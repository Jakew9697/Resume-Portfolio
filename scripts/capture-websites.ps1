param([string[]]$Slugs, [string]$ArchivePreviewUrl)
$ErrorActionPreference = 'Stop'
$portfolioRoot = Split-Path $PSScriptRoot -Parent
$sites = Get-Content "$PSScriptRoot/website-inventory.json" -Raw | ConvertFrom-Json
if ($Slugs) { $sites = $sites | Where-Object { $_.slug -in $Slugs } }
New-Item -ItemType Directory -Force "$portfolioRoot/public/websites" | Out-Null
$results = @()
if (Test-Path "$portfolioRoot/evidence/websites-capture.json") {
  $results = @(Get-Content "$portfolioRoot/evidence/websites-capture.json" -Raw | ConvertFrom-Json)
}
foreach ($site in $sites) {
  if ($site.archived -and !$ArchivePreviewUrl) {
    Write-Output "Skipping archived $($site.slug); supply -ArchivePreviewUrl for a local source build."
    continue
  }
  $entry = [ordered]@{ slug = $site.slug; requestedUrl = $site.url; captures = @() }
  Write-Output "Capturing $($site.slug)"
  $captureUrl = if ($site.archived) { $ArchivePreviewUrl } else { $site.url }
  agent-browser --session websites-capture --headed open $captureUrl | Out-Null
  if ($LASTEXITCODE -ne 0) {
    $entry.error = 'Navigation failed'
    $results += $entry
    Write-Output "$($site.slug): navigation failed"
    continue
  }
  foreach ($size in @(@{name='desktop';width=1440;height=1000}, @{name='mobile';width=390;height=844})) {
    agent-browser --session websites-capture set viewport $size.width $size.height | Out-Null
    agent-browser --session websites-capture eval 'window.scrollTo(0,0);true' | Out-Null
    agent-browser --session websites-capture wait 2200 | Out-Null
    $inspect = "(async()=>{await Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,5000))]);return {url:location.href,title:document.title,heading:document.querySelector('h1')?.innerText,viewport:[innerWidth,innerHeight],text:document.body.innerText.slice(0,180),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).length}})()"
    $encoded = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($inspect))
    $raw = agent-browser --session websites-capture eval -b $encoded
    $state = $raw | ConvertFrom-Json
    if ($state.title -match '404|Not Found|Access Denied' -or $state.heading -match '^404') {
      throw "Unusable page at $captureUrl; existing screenshots preserved."
    }
    $entry.captures += @{size=$size.name;state=$state}
    agent-browser --session websites-capture screenshot --screenshot-format jpeg --screenshot-quality 90 "$portfolioRoot/public/websites/$($site.slug)-$($size.name).jpg" | Out-Null
  }
  $results = @($results | Where-Object { $_.slug -ne $site.slug }) + @($entry)
  Write-Output ($entry | ConvertTo-Json -Depth 6 -Compress)
  $results | ConvertTo-Json -Depth 8 | Set-Content "$portfolioRoot/evidence/websites-capture.json"
}
