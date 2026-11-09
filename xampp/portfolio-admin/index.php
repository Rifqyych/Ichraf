<?php
require_once dirname(__DIR__) . '/portfolio-api/bootstrap.php';

session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict']);
session_start();

function h(string|null $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function post_text(string $key, int $maxLength): string
{
    $value = is_string($_POST[$key] ?? null) ? trim($_POST[$key]) : '';
    if (mb_strlen($value, 'UTF-8') > $maxLength) {
        throw new RuntimeException('Isian terlalu panjang: ' . $key . '.');
    }
    return $value;
}

function optional_url(string $value): ?string
{
    if ($value === '') return null;
    if (!filter_var($value, FILTER_VALIDATE_URL) || !in_array(parse_url($value, PHP_URL_SCHEME), ['http', 'https'], true)) {
        throw new RuntimeException('Tautan harus menggunakan alamat http atau https yang valid.');
    }
    return $value;
}

function upload_file(string $field, bool $allowPdf): ?string
{
    $file = $_FILES[$field] ?? null;
    if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) return null;
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'] ?? '')) {
        throw new RuntimeException('Unggahan gagal. Pilih file kembali dan pastikan ukurannya sesuai batas PHP.');
    }
    if (($file['size'] ?? 0) < 1 || $file['size'] > 12 * 1024 * 1024) {
        throw new RuntimeException('Ukuran file maksimal 12 MB.');
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    if ($allowPdf) $allowed['application/pdf'] = 'pdf';
    if (!isset($allowed[$mime])) {
        throw new RuntimeException($allowPdf ? 'File sertifikat harus berupa PDF, JPG, PNG, atau WebP.' : 'Foto profil harus berupa JPG, PNG, atau WebP.');
    }

    $directory = dirname(__DIR__) . '/portfolio-api/uploads';
    if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
        throw new RuntimeException('Folder unggahan XAMPP tidak dapat dibuat.');
    }
    if (!is_writable($directory)) throw new RuntimeException('Folder unggahan XAMPP tidak memiliki izin tulis.');

    $filename = bin2hex(random_bytes(16)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $filename)) {
        throw new RuntimeException('File tidak bisa disimpan ke folder unggahan XAMPP.');
    }
    return '/portfolio-api/uploads/' . $filename;
}

function public_asset_url(?string $path): ?string
{
    if (!$path) return null;
    if (str_starts_with($path, '/portfolio-api/uploads/')) return 'http://localhost' . $path;
    if (str_starts_with($path, '/images/')) return 'http://localhost:3000' . $path;
    return $path;
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . h($_SESSION['csrf']) . '">';
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
        $error = 'Sesi formulir kedaluwarsa. Muat ulang halaman dan coba lagi.';
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
    } elseif (!empty($_SESSION['admin_logged_in']) && $pdo instanceof PDO) {
        try {
            $action = is_string($_POST['action'] ?? null) ? $_POST['action'] : '';
            if ($action === 'save_member') {
                $slug = post_text('slug', 32);
                $name = post_text('name', 80);
                $role = post_text('role', 160);
                $initials = post_text('initials', 8);
                $color = post_text('color', 16);
                $about = post_text('about', 2000);
                $contactUrl = optional_url(post_text('contact_url', 500));
                $skills = array_values(array_unique(array_filter(array_map('trim', preg_split('/[,\r\n]+/', post_text('skills', 2000)) ?: []))));
                if (!in_array($slug, ['zaki', 'rifqy'], true) || $name === '' || $role === '' || $about === '') {
                    throw new RuntimeException('Nama, peran, dan deskripsi anggota wajib diisi.');
                }
                if (!in_array($color, ['orange', 'blue'], true)) throw new RuntimeException('Warna profil tidak valid.');
                $existingPhoto = $pdo->prepare('SELECT photo FROM team_members WHERE slug=:slug');
                $existingPhoto->execute(['slug' => $slug]);
                $photo = upload_file('profile_photo', false) ?? $existingPhoto->fetchColumn();
                if (!is_string($photo) || $photo === '') throw new RuntimeException('Foto profil saat ini tidak tersedia. Unggah foto baru.');
                $pdo->beginTransaction();
                $update = $pdo->prepare('UPDATE team_members SET name=:name, role=:role, initials=:initials, photo=:photo, color=:color, about=:about, contact_url=:contact_url WHERE slug=:slug');
                $update->execute(['name' => $name, 'role' => $role, 'initials' => $initials, 'photo' => $photo, 'color' => $color, 'about' => $about, 'contact_url' => $contactUrl, 'slug' => $slug]);
                $pdo->prepare('DELETE FROM skills WHERE member_slug=:slug')->execute(['slug' => $slug]);
                $insertSkill = $pdo->prepare('INSERT INTO skills (member_slug, name, sort_order) VALUES (:slug, :name, :sort_order)');
                foreach ($skills as $index => $skill) {
                    if (mb_strlen($skill, 'UTF-8') > 100) throw new RuntimeException('Nama skill maksimal 100 karakter.');
                    $insertSkill->execute(['slug' => $slug, 'name' => $skill, 'sort_order' => $index + 1]);
                }
                $pdo->commit();
                $notice = 'Profil dan skill anggota berhasil diperbarui.';
            } elseif ($action === 'save_project') {
                $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT) ?: null;
                $memberSlug = post_text('member_slug', 32);
                $number = post_text('number_label', 16);
                $title = post_text('title', 160);
                $category = post_text('category', 120);
                $description = post_text('description', 3000);
                $linkUrl = optional_url(post_text('link_url', 500));
                $linkLabel = post_text('link_label', 120) ?: null;
                $tools = array_values(array_unique(array_filter(array_map('trim', preg_split('/[,\r\n]+/', post_text('tools', 1000)) ?: []))));
                if (!in_array($memberSlug, ['zaki', 'rifqy'], true) || $number === '' || $title === '' || $category === '' || $description === '' || $tools === []) {
                    throw new RuntimeException('Anggota, nomor, judul, kategori, deskripsi, dan teknologi proyek wajib diisi.');
                }
                $toolsJson = json_encode($tools, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
                if ($id) {
                    $stmt = $pdo->prepare('UPDATE projects SET member_slug=:member_slug, number_label=:number_label, title=:title, category=:category, description=:description, tools_json=:tools_json, link_url=:link_url, link_label=:link_label WHERE id=:id');
                    $stmt->execute(['member_slug' => $memberSlug, 'number_label' => $number, 'title' => $title, 'category' => $category, 'description' => $description, 'tools_json' => $toolsJson, 'link_url' => $linkUrl, 'link_label' => $linkLabel, 'id' => $id]);
                    $notice = 'Proyek berhasil diperbarui.';
                } else {
                    $orderQuery = $pdo->prepare('SELECT COALESCE(MAX(sort_order),0)+1 FROM projects WHERE member_slug=:member_slug');
                    $orderQuery->execute(['member_slug' => $memberSlug]);
                    $order = (int) $orderQuery->fetchColumn();
                    $stmt = $pdo->prepare('INSERT INTO projects (member_slug, number_label, title, category, description, tools_json, link_url, link_label, sort_order) VALUES (:member_slug, :number_label, :title, :category, :description, :tools_json, :link_url, :link_label, :sort_order)');
                    $stmt->execute(['member_slug' => $memberSlug, 'number_label' => $number, 'title' => $title, 'category' => $category, 'description' => $description, 'tools_json' => $toolsJson, 'link_url' => $linkUrl, 'link_label' => $linkLabel, 'sort_order' => $order]);
                    $notice = 'Proyek baru berhasil ditambahkan.';
                }
            } elseif ($action === 'delete_project') {
                $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) throw new RuntimeException('Proyek tidak valid.');
                $pdo->prepare('DELETE FROM projects WHERE id=:id')->execute(['id' => $id]);
                $notice = 'Proyek berhasil dihapus.';
            } elseif ($action === 'save_certificate') {
                $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT) ?: null;
                $memberSlug = post_text('member_slug', 32);
                $title = post_text('title', 180);
                $issuer = post_text('issuer', 180);
                $dateLabel = post_text('date_label', 80);
                if (!in_array($memberSlug, ['zaki', 'rifqy'], true) || $title === '' || $issuer === '' || $dateLabel === '') {
                    throw new RuntimeException('Anggota, nama sertifikat, penyelenggara, dan tanggal wajib diisi.');
                }
                $existingUrl = null;
                if ($id) {
                    $existingFile = $pdo->prepare('SELECT url FROM certificates WHERE id=:id');
                    $existingFile->execute(['id' => $id]);
                    $existingUrl = $existingFile->fetchColumn() ?: null;
                }
                $url = upload_file('certificate_file', true) ?? $existingUrl;
                if (!$id && !$url) throw new RuntimeException('Pilih file sertifikat berupa PDF atau gambar.');
                if ($id) {
                    $stmt = $pdo->prepare('UPDATE certificates SET member_slug=:member_slug, title=:title, issuer=:issuer, date_label=:date_label, url=:url WHERE id=:id');
                    $stmt->execute(['member_slug' => $memberSlug, 'title' => $title, 'issuer' => $issuer, 'date_label' => $dateLabel, 'url' => $url, 'id' => $id]);
                    $notice = 'Sertifikat berhasil diperbarui.';
                } else {
                    $orderQuery = $pdo->prepare('SELECT COALESCE(MAX(sort_order),0)+1 FROM certificates WHERE member_slug=:member_slug');
                    $orderQuery->execute(['member_slug' => $memberSlug]);
                    $order = (int) $orderQuery->fetchColumn();
                    $stmt = $pdo->prepare('INSERT INTO certificates (member_slug, title, issuer, date_label, url, sort_order) VALUES (:member_slug, :title, :issuer, :date_label, :url, :sort_order)');
                    $stmt->execute(['member_slug' => $memberSlug, 'title' => $title, 'issuer' => $issuer, 'date_label' => $dateLabel, 'url' => $url, 'sort_order' => $order]);
                    $notice = 'Sertifikat berhasil ditambahkan.';
                }
            } elseif ($action === 'delete_certificate') {
                $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) throw new RuntimeException('Sertifikat tidak valid.');
                $pdo->prepare('DELETE FROM certificates WHERE id=:id')->execute(['id' => $id]);
                $notice = 'Sertifikat berhasil dihapus.';
            } elseif ($action === 'delete_testimonial') {
                $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
                if (!$id) throw new RuntimeException('Testimoni tidak valid.');
                $pdo->prepare('DELETE FROM testimonials WHERE id=:id')->execute(['id' => $id]);
                $notice = 'Testimoni berhasil dihapus.';
            } else {
                throw new RuntimeException('Aksi admin tidak dikenali.');
            }
        } catch (Throwable $exception) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            $error = $exception instanceof PDOException && $exception->getCode() === '23000'
                ? 'Data dengan nama tersebut sudah ada untuk anggota itu.'
                : $exception->getMessage();
        }
    }
}

$members = [];
$projects = [];
$certificates = [];
$testimonials = [];
$editingProject = null;
$editingCertificate = null;
if ($pdo instanceof PDO) {
    $members = $pdo->query('SELECT * FROM team_members ORDER BY FIELD(slug, \'zaki\', \'rifqy\')')->fetchAll();
    foreach ($pdo->query('SELECT member_slug, name FROM skills ORDER BY member_slug, sort_order, id')->fetchAll() as $skill) {
        $memberIndex = array_search($skill['member_slug'], array_column($members, 'slug'), true);
        if ($memberIndex !== false) {
            $members[$memberIndex]['skills'][] = $skill['name'];
        }
    }
    $projects = $pdo->query('SELECT * FROM projects ORDER BY member_slug, sort_order, id')->fetchAll();
    $certificates = $pdo->query('SELECT * FROM certificates ORDER BY member_slug, sort_order, id')->fetchAll();
    $testimonials = $pdo->query('SELECT * FROM testimonials ORDER BY created_at DESC')->fetchAll();
    $editProjectId = filter_var($_GET['edit_project'] ?? null, FILTER_VALIDATE_INT);
    $editCertificateId = filter_var($_GET['edit_certificate'] ?? null, FILTER_VALIDATE_INT);
    if ($editProjectId) {
        $stmt = $pdo->prepare('SELECT * FROM projects WHERE id=:id');
        $stmt->execute(['id' => $editProjectId]);
        $editingProject = $stmt->fetch() ?: null;
    }
    if ($editCertificateId) {
        $stmt = $pdo->prepare('SELECT * FROM certificates WHERE id=:id');
        $stmt->execute(['id' => $editCertificateId]);
        $editingCertificate = $stmt->fetch() ?: null;
    }
}

$loggedIn = !empty($_SESSION['admin_logged_in']);
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
  <main class="shell admin-shell">
    <header class="topbar"><a class="brand" href="./">RPL <span>/ ADMIN</span></a><span>Panel pengelolaan · XAMPP lokal</span></header>
    <section class="intro">
      <p class="eyebrow">PANEL ADMIN</p>
      <h1>Kelola portofolio.</h1>
      <p>Atur profil, skill, proyek, sertifikat, dan hapus testimoni yang tidak diinginkan.</p>
    </section>

    <?php if ($error !== ''): ?><div class="notice error"><?= h($error) ?></div><?php endif; ?>
    <?php if ($notice !== ''): ?><div class="notice success"><?= h($notice) ?></div><?php endif; ?>

    <?php if (!$loggedIn): ?>
      <form class="card login-card" method="post">
        <h2>Masuk sebagai admin</h2>
        <?= csrf_field() ?>
        <input type="hidden" name="action" value="login">
        <label>Nama pengguna<input name="username" autocomplete="username" required></label>
        <label>Kata sandi<input type="password" name="password" autocomplete="current-password" required></label>
        <button type="submit">Masuk</button>
      </form>
    <?php else: ?>
      <nav class="admin-nav">
        <a href="#members">Profil &amp; skill</a><a href="#projects">Proyek</a><a href="#certificates">Sertifikat</a><a href="#testimonials">Testimoni</a>
      </nav>
      <form class="logout-form" method="post"><?= csrf_field() ?><input type="hidden" name="action" value="logout"><button class="button-secondary" type="submit">Keluar</button></form>

      <section class="admin-section" id="members">
        <div class="section-heading"><div><p class="eyebrow">01 · ANGGOTA</p><h2>Profil dan skill</h2></div><span><?= count($members) ?> anggota</span></div>
        <div class="editor-grid">
          <?php foreach ($members as $member): ?>
            <form class="card editor-card" method="post" enctype="multipart/form-data">
              <?= csrf_field() ?><input type="hidden" name="action" value="save_member"><input type="hidden" name="slug" value="<?= h($member['slug']) ?>">
              <h3><?= h($member['name']) ?></h3>
              <div class="field-grid">
                <label>Nama<input name="name" value="<?= h($member['name']) ?>" maxlength="80" required></label>
                <label>Peran<input name="role" value="<?= h($member['role']) ?>" maxlength="160" required></label>
                <label>Inisial<input name="initials" value="<?= h($member['initials']) ?>" maxlength="8" required></label>
                <label>Warna kartu<select name="color"><option value="orange" <?= $member['color'] === 'orange' ? 'selected' : '' ?>>Oranye</option><option value="blue" <?= $member['color'] === 'blue' ? 'selected' : '' ?>>Biru</option></select></label>
                <div class="field-full upload-field"><span class="field-label">Foto profil saat ini</span><img class="current-photo" src="<?= h(public_asset_url($member['photo'])) ?>" alt="Foto <?= h($member['name']) ?>"><label>Unggah foto baru (JPG, PNG, atau WebP)<input type="file" name="profile_photo" accept="image/jpeg,image/png,image/webp"></label><small>Kosongkan jika ingin mempertahankan foto saat ini. Maksimal 12 MB.</small></div>
                <label class="field-full">Tentang<textarea name="about" rows="4" maxlength="2000" required><?= h($member['about']) ?></textarea></label>
                <label class="field-full">Skill (pisahkan dengan koma atau baris baru)<textarea name="skills" rows="3" maxlength="2000"><?= h(implode(', ', $member['skills'] ?? [])) ?></textarea></label>
                <label class="field-full">Tautan kontak<input type="url" name="contact_url" value="<?= h($member['contact_url']) ?>" placeholder="https://..."></label>
              </div>
              <button type="submit">Simpan profil</button>
            </form>
          <?php endforeach; ?>
        </div>
      </section>

      <section class="admin-section" id="projects">
        <div class="section-heading"><div><p class="eyebrow">02 · KARYA</p><h2>Proyek</h2></div><span><?= count($projects) ?> proyek</span></div>
        <form class="card editor-card" method="post">
          <?= csrf_field() ?><input type="hidden" name="action" value="save_project"><input type="hidden" name="id" value="<?= h((string) ($editingProject['id'] ?? '')) ?>">
          <h3><?= $editingProject ? 'Edit proyek' : 'Tambah proyek' ?></h3>
          <div class="field-grid">
            <label>Anggota<select name="member_slug"><option value="zaki" <?= ($editingProject['member_slug'] ?? '') === 'zaki' ? 'selected' : '' ?>>Zaki</option><option value="rifqy" <?= ($editingProject['member_slug'] ?? '') === 'rifqy' ? 'selected' : '' ?>>Rifqy</option></select></label>
            <label>Nomor<input name="number_label" value="<?= h($editingProject['number_label'] ?? '') ?>" placeholder="04" maxlength="16" required></label>
            <label>Judul<input name="title" value="<?= h($editingProject['title'] ?? '') ?>" maxlength="160" required></label>
            <label>Kategori<input name="category" value="<?= h($editingProject['category'] ?? '') ?>" maxlength="120" required></label>
            <label class="field-full">Deskripsi<textarea name="description" rows="3" maxlength="3000" required><?= h($editingProject['description'] ?? '') ?></textarea></label>
            <label class="field-full">Teknologi (pisahkan dengan koma atau baris baru)<textarea name="tools" rows="2" required><?= h(implode(', ', json_decode($editingProject['tools_json'] ?? '[]', true) ?: [])) ?></textarea></label>
            <label>Tautan<input type="url" name="link_url" value="<?= h($editingProject['link_url'] ?? '') ?>" placeholder="https://..."></label>
            <label>Label tautan<input name="link_label" value="<?= h($editingProject['link_label'] ?? '') ?>" maxlength="120"></label>
          </div>
          <div class="actions"><button type="submit"><?= $editingProject ? 'Simpan perubahan' : 'Tambah proyek' ?></button><?php if ($editingProject): ?><a class="button-secondary button-link" href="#projects">Batal edit</a><?php endif; ?></div>
        </form>
        <div class="record-list">
          <?php foreach ($projects as $project): ?>
            <article class="card record-card"><div><p class="eyebrow"><?= h($project['member_slug']) ?> · <?= h($project['category']) ?></p><h3><?= h($project['title']) ?></h3><p><?= h($project['description']) ?></p><small>Teknologi: <?= h(implode(', ', json_decode($project['tools_json'], true) ?: [])) ?></small></div><div class="actions"><a class="button-secondary button-link" href="?edit_project=<?= (int) $project['id'] ?>#projects">Edit</a><form method="post" onsubmit="return confirm('Hapus proyek ini?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete_project"><input type="hidden" name="id" value="<?= (int) $project['id'] ?>"><button class="danger-button" type="submit">Hapus</button></form></div></article>
          <?php endforeach; ?>
        </div>
      </section>

      <section class="admin-section" id="certificates">
        <div class="section-heading"><div><p class="eyebrow">03 · PENCAPAIAN</p><h2>Sertifikat</h2></div><span><?= count($certificates) ?> sertifikat</span></div>
        <form class="card editor-card" method="post" enctype="multipart/form-data">
          <?= csrf_field() ?><input type="hidden" name="action" value="save_certificate"><input type="hidden" name="id" value="<?= h((string) ($editingCertificate['id'] ?? '')) ?>">
          <h3><?= $editingCertificate ? 'Edit sertifikat' : 'Tambah sertifikat' ?></h3>
          <div class="field-grid">
            <label>Anggota<select name="member_slug"><option value="zaki" <?= ($editingCertificate['member_slug'] ?? '') === 'zaki' ? 'selected' : '' ?>>Zaki</option><option value="rifqy" <?= ($editingCertificate['member_slug'] ?? '') === 'rifqy' ? 'selected' : '' ?>>Rifqy</option></select></label>
            <label>Nama sertifikat<input name="title" value="<?= h($editingCertificate['title'] ?? '') ?>" maxlength="180" required></label>
            <label>Penyelenggara<input name="issuer" value="<?= h($editingCertificate['issuer'] ?? '') ?>" maxlength="180" required></label>
            <label>Tanggal / tahun<input name="date_label" value="<?= h($editingCertificate['date_label'] ?? '') ?>" maxlength="80" placeholder="2026" required></label>
            <div class="field-full upload-field"><span class="field-label">File sertifikat (PDF, JPG, PNG, atau WebP)</span><?php if (!empty($editingCertificate['url'])): ?><a class="section-help" href="<?= h(public_asset_url($editingCertificate['url'])) ?>" target="_blank" rel="noreferrer">Lihat file saat ini</a><?php endif; ?><input type="file" name="certificate_file" accept="application/pdf,image/jpeg,image/png,image/webp" <?= $editingCertificate ? '' : 'required' ?>><small><?= $editingCertificate ? 'Pilih file baru hanya jika ingin mengganti file saat ini.' : 'Ukuran maksimal 12 MB.' ?></small></div>
          </div>
          <div class="actions"><button type="submit"><?= $editingCertificate ? 'Simpan perubahan' : 'Tambah sertifikat' ?></button><?php if ($editingCertificate): ?><a class="button-secondary button-link" href="#certificates">Batal edit</a><?php endif; ?></div>
        </form>
        <div class="record-list">
          <?php foreach ($certificates as $certificate): ?>
            <article class="card record-card"><div><p class="eyebrow"><?= h($certificate['member_slug']) ?> · <?= h($certificate['date_label']) ?></p><h3><?= h($certificate['title']) ?></h3><p><?= h($certificate['issuer']) ?></p><?php if (!empty($certificate['url'])): ?><a class="section-link" href="<?= h(public_asset_url($certificate['url'])) ?>" target="_blank" rel="noreferrer">Buka file sertifikat →</a><?php endif; ?></div><div class="actions"><a class="button-secondary button-link" href="?edit_certificate=<?= (int) $certificate['id'] ?>#certificates">Edit</a><form method="post" onsubmit="return confirm('Hapus sertifikat ini?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete_certificate"><input type="hidden" name="id" value="<?= (int) $certificate['id'] ?>"><button class="danger-button" type="submit">Hapus</button></form></div></article>
          <?php endforeach; ?>
          <?php if ($certificates === []): ?><div class="card empty"><strong>Belum ada sertifikat.</strong><p>Tambahkan sertifikat dari formulir di atas.</p></div><?php endif; ?>
        </div>
      </section>

      <section class="admin-section" id="testimonials">
        <div class="section-heading"><div><p class="eyebrow">04 · MASUKAN PUBLIK</p><h2>Testimoni</h2></div><span><?= count($testimonials) ?> testimoni</span></div>
        <p class="section-help">Testimoni yang dikirim langsung tampil. Hapus kiriman yang tidak ingin ditampilkan.</p>
        <div class="record-list">
          <?php foreach ($testimonials as $testimonial): ?>
            <article class="card record-card"><div><p class="eyebrow"><?= h($testimonial['member_slug']) ?><?= $testimonial['project_title'] ? ' · ' . h($testimonial['project_title']) : '' ?></p><blockquote>“<?= h($testimonial['message']) ?>”</blockquote><p><strong><?= h($testimonial['name']) ?></strong><?= $testimonial['role'] ? ' · ' . h($testimonial['role']) : '' ?></p><small><?= h($testimonial['created_at']) ?></small></div><form method="post" onsubmit="return confirm('Hapus testimoni ini secara permanen?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete_testimonial"><input type="hidden" name="id" value="<?= (int) $testimonial['id'] ?>"><button class="danger-button" type="submit">Hapus testimoni</button></form></article>
          <?php endforeach; ?>
          <?php if ($testimonials === []): ?><div class="card empty"><strong>Belum ada testimoni.</strong></div><?php endif; ?>
        </div>
      </section>
    <?php endif; ?>
    <footer>Perubahan tersimpan di database MySQL XAMPP dan tampil di website lokal.</footer>
  </main>
</body>
</html>
