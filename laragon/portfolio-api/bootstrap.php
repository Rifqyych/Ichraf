<?php

function portfolio_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $configPath = __DIR__ . '/config.php';
    if (!is_file($configPath)) {
        throw new RuntimeException('Buat config.php dari config.example.php terlebih dahulu.');
    }

    $loaded = require $configPath;
    if (!is_array($loaded)) {
        throw new RuntimeException('Konfigurasi Laragon tidak valid.');
    }
    if (($loaded['admin_password'] ?? '') === 'CHANGE_THIS_ADMIN_PASSWORD' || empty($loaded['admin_password'])) {
        throw new RuntimeException('Ubah kata sandi admin pada config.php sebelum digunakan.');
    }
    $config = $loaded;
    return $config;
}

function portfolio_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = portfolio_config();
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['db_host'] ?? '127.0.0.1',
        (int) ($config['db_port'] ?? 3306),
        $config['db_name'] ?? 'portfolio_testimonials'
    );

    $pdo = new PDO($dsn, $config['db_user'] ?? 'root', $config['db_password'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function portfolio_json(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
