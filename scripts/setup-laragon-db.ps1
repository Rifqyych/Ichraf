$ErrorActionPreference = "Stop"

$laragonHome = $env:LARAGON_HOME
if ([string]::IsNullOrWhiteSpace($laragonHome)) {
  $laragonHome = "C:\laragon"
}

$mysqlRoot = Join-Path $laragonHome "bin\mysql"
$mysqlClient = Get-ChildItem -LiteralPath $mysqlRoot -Directory -ErrorAction SilentlyContinue |
  Sort-Object Name -Descending |
  ForEach-Object { Join-Path $_.FullName "bin\mysql.exe" } |
  Where-Object { Test-Path -LiteralPath $_ } |
  Select-Object -First 1
$mysqlPort = 3307
if (-not [string]::IsNullOrWhiteSpace($env:LARAGON_MYSQL_PORT)) {
  $mysqlPort = [int] $env:LARAGON_MYSQL_PORT
}
$schemaPath = (Resolve-Path (Join-Path $PSScriptRoot "..\laragon\schema.sql")).Path

if (-not $mysqlClient) {
  Write-Error "mysql.exe tidak ditemukan di '$mysqlRoot'. Periksa instalasi MySQL Laragon atau atur LARAGON_HOME."
  exit 1
}

$connection = [System.Net.Sockets.TcpClient]::new()
try {
  $connection.Connect("127.0.0.1", $mysqlPort)
} catch {
  Write-Error "MySQL Laragon belum berjalan di port $mysqlPort. Buka Laragon, pilih Start All, lalu ulangi perintah ini."
  exit 1
} finally {
  $connection.Dispose()
}

Write-Host "Menyiapkan schema portfolio_testimonials pada MySQL Laragon."
Write-Host "Masukkan kata sandi MySQL root jika diminta; jika default Laragon, tekan Enter."

$sql = Get-Content -LiteralPath $schemaPath -Raw
& $mysqlClient --protocol=TCP --host=127.0.0.1 --port=$mysqlPort --user=root --password --default-character-set=utf8mb4 "--execute=$sql"

if ($LASTEXITCODE -ne 0) {
  Write-Error "Database belum disiapkan. Periksa user root, kata sandi, dan port MySQL Laragon."
  exit $LASTEXITCODE
}

Write-Host "Selesai: database portfolio_testimonials dan tabel portfolio tersedia di Laragon."
