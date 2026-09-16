terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.64.0" }
  }
}

variable "environment" { type = string }
variable "allowed_origins" { type = string }

data "aws_caller_identity" "current" {}
locals {
  name              = "jake-portfolio-${var.environment}"
  signing_parameter = "/sync/jake-portfolio/${var.environment}/session-signing-key"
}

resource "aws_dynamodb_table" "workspaces" {
  name         = local.name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"
  attribute {
    name = "pk"
    type = "S"
  }
  attribute {
    name = "sk"
    type = "S"
  }
  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }
  server_side_encryption { enabled = true }
  tags = { Project = "jake-portfolio", Environment = var.environment }
}

resource "aws_s3_bucket" "audio" {
  bucket = "${local.name}-audio-${data.aws_caller_identity.current.account_id}"
  tags   = { Project = "jake-portfolio", Environment = var.environment }
}
resource "aws_s3_bucket_public_access_block" "audio" {
  bucket                  = aws_s3_bucket.audio.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
resource "aws_s3_bucket_server_side_encryption_configuration" "audio" {
  bucket = aws_s3_bucket.audio.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
resource "aws_s3_bucket_lifecycle_configuration" "audio" {
  bucket = aws_s3_bucket.audio.id
  rule {
    id     = "expire-demo-recordings"
    status = "Enabled"
    filter { prefix = "" }
    expiration { days = 1 }
    abort_incomplete_multipart_upload { days_after_initiation = 1 }
  }
}

resource "aws_iam_role" "api" {
  name               = local.name
  assume_role_policy = jsonencode({ Version = "2012-10-17", Statement = [{ Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" }, Action = "sts:AssumeRole" }] })
}
resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${local.name}"
  retention_in_days = 14
}
resource "aws_iam_role_policy" "api" {
  name = "isolated-demo-services"
  role = aws_iam_role.api.id
  policy = jsonencode({ Version = "2012-10-17", Statement = [
    { Effect = "Allow", Action = ["logs:CreateLogStream", "logs:PutLogEvents"], Resource = "${aws_cloudwatch_log_group.api.arn}:*" },
    { Effect = "Allow", Action = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"], Resource = aws_dynamodb_table.workspaces.arn },
    { Effect = "Allow", Action = ["ssm:GetParameter"], Resource = "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter${local.signing_parameter}" },
    { Effect = "Allow", Action = ["ssm:GetParameter"], Resource = "arn:aws:ssm:us-east-1:${data.aws_caller_identity.current.account_id}:parameter/sync/google/api-key" },
    { Effect = "Allow", Action = ["bedrock:InvokeModel"], Resource = [
      "arn:aws:bedrock:us-east-1:${data.aws_caller_identity.current.account_id}:inference-profile/us.anthropic.claude-haiku-4-5-20251001-v1:0",
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0",
      "arn:aws:bedrock:us-east-2::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0",
      "arn:aws:bedrock:us-west-2::foundation-model/anthropic.claude-haiku-4-5-20251001-v1:0"
    ] },
    { Effect = "Allow", Action = ["polly:SynthesizeSpeech"], Resource = "*" },
    { Effect = "Allow", Action = ["transcribe:StartTranscriptionJob", "transcribe:GetTranscriptionJob"], Resource = "arn:aws:transcribe:us-east-1:${data.aws_caller_identity.current.account_id}:transcription-job/jake-*" },
    { Effect = "Allow", Action = ["s3:GetObject", "s3:PutObject"], Resource = ["${aws_s3_bucket.audio.arn}/audio/*", "${aws_s3_bucket.audio.arn}/transcripts/*"] }
  ] })
}
resource "aws_lambda_function" "api" {
  function_name                  = local.name
  role                           = aws_iam_role.api.arn
  runtime                        = "nodejs22.x"
  handler                        = "index.handler"
  filename                       = "${path.module}/../../dist/api.zip"
  source_code_hash               = filebase64sha256("${path.module}/../../dist/api.zip")
  memory_size                    = 512
  timeout                        = 90
  reserved_concurrent_executions = 3
  environment {
    variables = {
      TABLE_NAME        = aws_dynamodb_table.workspaces.name
      AUDIO_BUCKET      = aws_s3_bucket.audio.id
      SIGNING_PARAMETER = local.signing_parameter
      ALLOWED_ORIGINS   = var.allowed_origins
      MODEL_ID          = "us.anthropic.claude-haiku-4-5-20251001-v1:0"
      NODE_OPTIONS      = "--enable-source-maps"
    }
  }
  depends_on = [aws_iam_role_policy.api, aws_cloudwatch_log_group.api]
  tags       = { Project = "jake-portfolio", Environment = var.environment }
}
resource "aws_lambda_function_url" "api" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"
  # App validates signed, expiring guest sessions and enforces quotas.
}

output "api_url" { value = aws_lambda_function_url.api.function_url }
output "table_name" { value = aws_dynamodb_table.workspaces.name }
output "audio_bucket" { value = aws_s3_bucket.audio.id }
