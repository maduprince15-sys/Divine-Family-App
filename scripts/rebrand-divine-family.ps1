$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$paths = @('app', 'public', 'package.json', 'package-lock.json') | Where-Object { Test-Path $_ }

$files = foreach ($path in $paths) {
  if (Test-Path $path -PathType Container) {
    Get-ChildItem $path -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.json,*.md,*.html,*.css
  } else {
    Get-Item $path
  }
}

$replacements = [ordered]@{
  'The Kingdom Citizens' = 'Divine Power Deliverance Ministry'
  'Kingdom Citizens' = 'Divine Family'
  'kingdom-citizens-app' = 'divine-family-app'
  'kingdom-citizens-logo.png' = 'dpdm-logo.png'
  'kingdom-citizens-logo' = 'dpdm-logo'
  'kingdom-citizens-v1' = 'divine-family-v1'
  'Our address is in Christ' = 'A family of prayer, deliverance, worship, and the Word'
  'Citizens App' = 'Divine Family App'
  'Citizens' = 'Divine Family'
}

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $updated = $content

  foreach ($key in $replacements.Keys) {
    $updated = $updated.Replace($key, $replacements[$key])
  }

  if ($updated -ne $content) {
    [System.IO.File]::WriteAllText($file.FullName, $updated)
    Write-Host "Updated $($file.FullName)"
  }
}

# Ensure the package name is correct even if JSON formatting changes later.
if (Test-Path 'package.json') {
  $pkgPath = (Resolve-Path 'package.json').Path
  $pkg = [System.IO.File]::ReadAllText($pkgPath) | ConvertFrom-Json
  $pkg.name = 'divine-family-app'
  $pkg | ConvertTo-Json -Depth 20 | Set-Content 'package.json'
}

if (Test-Path 'package-lock.json') {
  $lockPath = (Resolve-Path 'package-lock.json').Path
  $lock = [System.IO.File]::ReadAllText($lockPath) | ConvertFrom-Json
  if ($lock.name) { $lock.name = 'divine-family-app' }
  if ($lock.packages -and $lock.packages.'' -and $lock.packages.''.name) {
    $lock.packages.''.name = 'divine-family-app'
  }
  $lock | ConvertTo-Json -Depth 100 | Set-Content 'package-lock.json'
}

Write-Host ''
Write-Host 'Rebrand pass complete. Now run:'
Write-Host 'Select-String -Path "app\**\*.tsx","app\**\*.ts","public\*.json","public\*.js","package.json","package-lock.json" -Pattern "Kingdom Citizens","kingdom-citizens","Our address is in Christ","kingdom-citizens-logo","kingdom-citizens-app"'
Write-Host 'npm run build'