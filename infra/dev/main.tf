terraform {
  required_version = ">= 1.10.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 6.64.0" }
  }
  backend "s3" {
    bucket       = "sync-terraform-state-831926606670"
    key          = "jake-portfolio/dev/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true
  }
}
provider "aws" { region = "us-east-1" }
module "portfolio" {
  source          = "../module"
  environment     = "dev"
  allowed_origins = "http://localhost:3046,https://dev-jakeworsham.syncgr.com"
}
output "api_url" { value = module.portfolio.api_url }
output "table_name" { value = module.portfolio.table_name }
output "audio_bucket" { value = module.portfolio.audio_bucket }
