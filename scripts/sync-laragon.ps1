$ErrorActionPreference = "Stop"

$laragonHome = $env:LARAGON_HOME
if ([string]::IsNullOrWhiteSpace($laragonHome)) {
  $laragonHome = "C:\laragon"
}
$www = Join-Path $laragonHome "www"
$apiSource = Join-Path $PSScriptRoot "..\laragon\portfolio-api"
$adminSource = Join-Path $PSScriptRoot "..\laragon\portfolio-admin"
$apiTarget = Join-Path $www "portfolio-api"
$adminTarget = Join-Path $www "portfolio-admin"

foreach ($folder in @($www, $apiTarget, $adminTarget)) {
  New-Item -ItemType Directory -Path $folder -Force | Out-Null
}

foreach ($pair in @(
  @{ Source = $apiSource; Target = $apiTarget },
  @{ Source = $adminSource; Target = $adminTarget }
)) {
  Get-ChildItem -LiteralPath $pair.Source -Force | Where-Object { $_.Name -ne "config.php" } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $pair.Target -Recurse -Force
  }
}

$configTarget = Join-Path $apiTarget "config.php"
$legacyConfig = "C:\xampp\htdocs\portfolio-api\config.php"
$exampleConfig = Join-Path $apiTarget "config.example.php"
if (-not (Test-Path -LiteralPath $configTarget)) {
  if (Test-Path -LiteralPath $legacyConfig) {
    Copy-Item -LiteralPath $legacyConfig -Destination $configTarget
    Write-Host "Konfigurasi admin lokal disalin dari XAMPP; XAMPP tetap tidak diubah."
  } elseif (Test-Path -LiteralPath $exampleConfig) {
    Copy-Item -LiteralPath $exampleConfig -Destination $configTarget
    Write-Warning "config.php dibuat dari contoh. Edit kata sandi admin dan sesuaikan koneksi MySQL Laragon sebelum login."
  }
}

if (Test-Path -LiteralPath $configTarget) {
  $configContents = Get-Content -LiteralPath $configTarget -Raw
  $configContents = [regex]::Replace($configContents, "('db_port'\s*=>\s*)\d+", '${1}3307')
  Set-Content -LiteralPath $configTarget -Value $configContents -Encoding utf8
  Write-Host "Konfigurasi database Laragon diarahkan ke port 3307."
}

$legacyUploads = "C:\xampp\htdocs\portfolio-api\uploads"
$laragonUploads = Join-Path $apiTarget "uploads"
if (Test-Path -LiteralPath $legacyUploads) {
  New-Item -ItemType Directory -Path $laragonUploads -Force | Out-Null
  Get-ChildItem -LiteralPath $legacyUploads -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $laragonUploads -Recurse -Force
  }
  Write-Host "Salinan file unggahan XAMPP disimpan di Laragon; file sumber XAMPP tidak dihapus."
}

Write-Host "API: http://localhost:8080/portfolio-api/content.php"
Write-Host "Admin: http://localhost:8080/portfolio-admin/"
