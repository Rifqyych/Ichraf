<?php
require_once __DIR__ . '/bootstrap.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
try {
    $config = portfolio_config();
    $allowedOrigins = $config['allowed_origins'] ?? [];
} catch (Throwable $error) {
    $allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
}

if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $pdo = portfolio_db();
} catch (Throwable $error) {
    portfolio_json(['error' => 'Database Laragon belum siap. Periksa Apache, MySQL, dan config.php.'], 503);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = $pdo->query(
        "SELECT id, member_slug, project_title, name, role, message
         FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC"
    );
    portfolio_json($query->fetchAll());
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    portfolio_json(['error' => 'Metode tidak didukung.'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    portfolio_json(['error' => 'Isi formulir tidak valid.'], 400);
}

// Honeypot sederhana untuk menolak kiriman otomatis.
if (!empty($data['website'])) {
    portfolio_json(['ok' => true], 201);
}

$memberSlug = is_string($data['memberSlug'] ?? null) ? trim($data['memberSlug']) : '';
$projectTitle = is_string($data['projectTitle'] ?? null) ? trim($data['projectTitle']) : '';
$name = is_string($data['name'] ?? null) ? trim($data['name']) : '';
$role = is_string($data['role'] ?? null) ? trim($data['role']) : '';
$message = is_string($data['message'] ?? null) ? trim($data['message']) : '';
$allowedMembers = [
    'zaki' => ['Website Profil Sekolah', 'Kalkulator Nilai Siswa', 'Aplikasi To-Do List'],
    'rifqy' => ['Website Appau', 'Website Kursus Aliah', 'Website Kursus DKAcademy'],
];

$length = static fn (string $value): int => function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
if (!isset($allowedMembers[$memberSlug]) || $length($name) < 1 || $length($name) > 80 || $length($role) > 100 || $length($message) < 5 || $length($message) > 1000) {
    portfolio_json(['error' => 'Periksa kembali isian formulir.'], 400);
}
if ($projectTitle !== '' && !in_array($projectTitle, $allowedMembers[$memberSlug], true)) {
    portfolio_json(['error' => 'Project yang dipilih tidak valid.'], 400);
}

$insert = $pdo->prepare(
    "INSERT INTO testimonials (member_slug, project_title, name, role, message, status)
     VALUES (:member_slug, :project_title, :name, :role, :message, 'approved')"
);
$insert->execute([
    'member_slug' => $memberSlug,
    'project_title' => $projectTitle !== '' ? $projectTitle : null,
    'name' => $name,
    'role' => $role,
    'message' => $message,
]);

$testimonial = [
    'id' => (string) $pdo->lastInsertId(),
    'member_slug' => $memberSlug,
    'project_title' => $projectTitle !== '' ? $projectTitle : null,
    'name' => $name,
    'role' => $role,
    'message' => $message,
];

portfolio_json(['ok' => true, 'testimonial' => $testimonial], 201);
