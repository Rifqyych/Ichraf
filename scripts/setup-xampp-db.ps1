$ErrorActionPreference = "Stop"

$xamppHome = $env:XAMPP_HOME
if ([string]::IsNullOrWhiteSpace($xamppHome)) {
  $xamppHome = "C:\xampp"
}

$mysqlClient = Join-Path $xamppHome "mysql\bin\mysql.exe"
$schemaPath = (Resolve-Path (Join-Path $PSScriptRoot "..\xampp\schema.sql")).Path

if (-not (Test-Path -LiteralPath $mysqlClient)) {
  Write-Error "mysql.exe tidak ditemukan di '$mysqlClient'. Atur XAMPP_HOME jika XAMPP terpasang di lokasi lain."
  exit 1
}

$connection = [System.Net.Sockets.TcpClient]::new()
try {
  $connection.Connect("127.0.0.1", 3306)
} catch {
  Write-Error "MySQL XAMPP belum berjalan di port 3306. Buka XAMPP Control Panel, tekan Start pada MySQL, lalu ulangi perintah ini."
  exit 1
} finally {
  $connection.Dispose()
}

Write-Host "Menjalankan skema database testimoni di MySQL XAMPP."
Write-Host "Masukkan kata sandi MySQL root jika diminta; jika masih bawaan XAMPP, tekan Enter."

$sql = Get-Content -LiteralPath $schemaPath -Raw
& $mysqlClient --protocol=TCP --host=127.0.0.1 --port=3306 --user=root --password --default-character-set=utf8mb4 "--execute=$sql"

if ($LASTEXITCODE -ne 0) {
  Write-Error "Database belum dibuat. Periksa MySQL root dan pastikan MySQL XAMPP yang berjalan menggunakan port 3306."
  exit $LASTEXITCODE
}

Write-Host "Selesai: database portfolio_testimonials dan tabel testimonials tersedia di XAMPP."
