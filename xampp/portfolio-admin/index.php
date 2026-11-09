<?php
require_once dirname(__DIR__) . '/portfolio-api/bootstrap.php';

session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

function h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

$error = '';
$notice = '';
$config = null;
$pdo = null;
try {
    $config = portfolio_config();
    $pdo = portfolio_db();
} catch (Throwable $exception) {
    $error = 'Database belum siap. Pastikan MySQL berjalan, schema.sql sudah dijalankan, dan config.php tersedia.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = is_string($_POST['csrf'] ?? null) ? $_POST['csrf'] : '';
    if (!hash_equals($_SESSION['csrf'], $token)) {
        $error = 'Sesi formulir sudah kedaluwarsa. Muat ulang halaman dan coba lagi.';
    } elseif (($_POST['action'] ?? '') === 'login' && $config !== null) {
        $username = is_string($_POST['username'] ?? null) ? $_POST['username'] : '';
        $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
        if (hash_equals((string) ($config['admin_user'] ?? ''), $username)
            && hash_equals((string) ($config['admin_password'] ?? ''), $password)) {
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            header('Location: ./');
            exit;
        }
        $error = 'Nama pengguna atau kata sandi salah.';
    } elseif (($_POST['action'] ?? '') === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: ./');
        exit;
    } elseif (($_POST['action'] ?? '') === 'review' && !empty($_SESSION['admin_logged_in']) && $pdo instanceof PDO) {
        $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
        $status = $_POST['status'] ?? '';
        if ($id && in_array($status, ['approved', 'rejected'], true)) {
            $update = $pdo->prepare('UPDATE testimonials SET status = :status WHERE id = :id AND status = \'pending\'');
            $update->execute(['status' => $status, 'id' => $id]);
            $notice = $status === 'approved' ? 'Testimoni disetujui.' : 'Testimoni ditolak.';
        } else {
            $error = 'Permintaan peninjauan tidak valid.';
        }
    }
}

$pending = [];
if (!empty($_SESSION['admin_logged_in']) && $pdo instanceof PDO) {
    $pending = $pdo->query("SELECT id, member_slug, project_title, name, role, message, created_at FROM testimonials WHERE status = 'pending' ORDER BY created_at ASC")->fetchAll();
}
?>
<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Portofolio RPL</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="shell">
    <header class="topbar"><a class="brand" href="./">RPL <span>/ ADMIN</span></a><span>Panel terpisah · XAMPP lokal</span></header>
    <section class="intro">
      <p class="eyebrow">PANEL ADMIN</p>
      <h1>Kelola testimoni.</h1>
      <p>Kiriman publik baru tidak tampil sampai kamu menyetujuinya.</p>
    </section>

    <?php if ($error !== ''): ?><div class="notice error"><?= h($error) ?></div><?php endif; ?>
    <?php if ($notice !== ''): ?><div class="notice success"><?= h($notice) ?></div><?php endif; ?>

    <?php if (empty($_SESSION['admin_logged_in'])): ?>
      <form class="card login-card" method="post">
        <h2>Masuk sebagai admin</h2>
        <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
        <input type="hidden" name="action" value="login">
        <label>Nama pengguna<input name="username" autocomplete="username" required></label>
        <label>Kata sandi<input type="password" name="password" autocomplete="current-password" required></label>
        <button type="submit">Masuk</button>
      </form>
    <?php else: ?>
      <form class="logout-form" method="post">
        <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
        <input type="hidden" name="action" value="logout">
        <button class="button-secondary" type="submit">Keluar</button>
      </form>
      <div class="queue-heading"><h2>Menunggu persetujuan</h2><span><?= count($pending) ?> kiriman</span></div>
      <?php if ($pending === []): ?>
        <div class="card empty"><strong>Belum ada kiriman baru.</strong><p>Kiriman dari form testimoni website user muncul di sini.</p></div>
      <?php else: ?>
        <div class="pending-list">
          <?php foreach ($pending as $item): ?>
            <article class="card testimonial">
              <p class="eyebrow"><?= h($item['member_slug']) ?><?= $item['project_title'] ? ' · ' . h($item['project_title']) : '' ?></p>
              <blockquote>“<?= h($item['message']) ?>”</blockquote>
              <p><strong><?= h($item['name']) ?></strong><?= $item['role'] ? ' · ' . h($item['role']) : '' ?></p>
              <small><?= h($item['created_at']) ?></small>
              <div class="actions">
                <form method="post">
                  <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
                  <input type="hidden" name="action" value="review">
                  <input type="hidden" name="id" value="<?= (int) $item['id'] ?>">
                  <input type="hidden" name="status" value="approved">
                  <button type="submit">Setujui</button>
                </form>
                <form method="post">
                  <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf']) ?>">
                  <input type="hidden" name="action" value="review">
                  <input type="hidden" name="id" value="<?= (int) $item['id'] ?>">
                  <input type="hidden" name="status" value="rejected">
                  <button class="button-secondary" type="submit">Tolak</button>
                </form>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    <?php endif; ?>
    <footer>Data tersimpan di MySQL XAMPP pada komputer ini.</footer>
  </main>
</body>
</html>
