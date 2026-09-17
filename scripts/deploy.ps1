param([switch]$Apply, [switch]$FrontendOnly)
$ErrorActionPreference = 'Stop'
$portfolioRoot = Split-Path $PSScriptRoot -Parent
Push-Location $portfolioRoot
try {
  $env:AWS_PROFILE = 'sync-admin'
  $env:AWS_REGION = 'us-east-1'
  $portfolioAccount = aws sts get-caller-identity --query Account --output text
  if ($LASTEXITCODE -ne 0 -or $portfolioAccount.Trim() -ne '831926606670') { throw 'Wrong AWS account or expired SSO session.' }
  if (!$FrontendOnly) {
    npm run build:api
    if ($LASTEXITCODE -ne 0) { throw 'API build failed.' }
    terraform '-chdir=infra/prod' init -input=false
    if ($LASTEXITCODE -ne 0) { throw 'Terraform init failed.' }
    terraform '-chdir=infra/prod' plan -input=false '-out=portfolio.tfplan'
    if ($LASTEXITCODE -ne 0) { throw 'Terraform plan failed.' }
    if (!$Apply) { Write-Output 'Plan only. Run with -Apply to deploy the reviewed changes.'; return }
    node scripts/ensure-signing-key.mjs prod
    if ($LASTEXITCODE -ne 0) { throw 'SSM signing-key preparation failed.' }
    terraform '-chdir=infra/prod' apply -input=false portfolio.tfplan
    if ($LASTEXITCODE -ne 0) { throw 'Terraform apply failed.' }
  } elseif (!$Apply) { Write-Output 'Frontend deploy requires -Apply.'; return }
  $portfolioApi = terraform '-chdir=infra/prod' output -raw api_url
  if ($LASTEXITCODE -ne 0) { throw 'Could not resolve API URL.' }
  $env:NEXT_PUBLIC_DEMO_API = $portfolioApi.Trim()
  npm run build
  if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed.' }
  aws s3 sync out/_next/static/ s3://sync-static-sites/tenants/jakeworsham/_next/static/ --cache-control 'public,max-age=31536000,immutable' --only-show-errors
  if ($LASTEXITCODE -ne 0) { throw 'Asset upload failed.' }
  aws s3 sync out/ s3://sync-static-sites/tenants/jakeworsham/ --exclude '_next/static/*' --cache-control 'public,max-age=300' --only-show-errors
  if ($LASTEXITCODE -ne 0) { throw 'Page upload failed.' }
  aws cloudfront create-invalidation --distribution-id E1EMVV1XZZTJAS --paths '/tenants/jakeworsham/*' --query 'Invalidation.{Id:Id,Status:Status}'
  if ($LASTEXITCODE -ne 0) { throw 'Invalidation failed.' }
  Write-Output 'Published https://jakeworsham.syncgr.com. Run the live browser and API checks before accepting the deployment.'
} finally { Pop-Location }
