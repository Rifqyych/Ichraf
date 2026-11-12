<?php
require_once __DIR__ . '/bootstrap.php';

$publicAssetUrl = static function (?string $path): ?string {
    if (!$path) return null;
    if (str_starts_with($path, '/portfolio-api/uploads/')) return 'http://localhost' . $path;
    return $path;
};

try {
    $pdo = portfolio_db();
    $members = [];
    foreach ($pdo->query('SELECT slug, name, role, initials, photo, color, about, contact_url FROM team_members ORDER BY FIELD(slug, \'zaki\', \'rifqy\'), name')->fetchAll() as $row) {
        $members[$row['slug']] = [
            'slug' => $row['slug'],
            'name' => $row['name'],
            'role' => $row['role'],
            'initials' => $row['initials'],
            'photo' => $publicAssetUrl($row['photo']),
            'color' => $row['color'],
            'about' => $row['about'],
            'contactUrl' => $row['contact_url'] ?: null,
            'skills' => [],
            'projects' => [],
            'certificates' => [],
            'testimonials' => [],
        ];
    }

    foreach ($pdo->query('SELECT member_slug, name FROM skills ORDER BY member_slug, sort_order, id')->fetchAll() as $row) {
        if (isset($members[$row['member_slug']])) {
            $members[$row['member_slug']]['skills'][] = $row['name'];
        }
    }

    foreach ($pdo->query('SELECT member_slug, number_label, title, category, description, tools_json, link_url, link_label FROM projects ORDER BY member_slug, sort_order, id')->fetchAll() as $row) {
        if (isset($members[$row['member_slug']])) {
            $members[$row['member_slug']]['projects'][] = [
                'number' => $row['number_label'],
                'title' => $row['title'],
                'category' => $row['category'],
                'description' => $row['description'],
                'tools' => json_decode($row['tools_json'], true) ?: [],
                'linkUrl' => $row['link_url'] ?: null,
                'linkLabel' => $row['link_label'] ?: null,
            ];
        }
    }

    foreach ($pdo->query('SELECT member_slug, title, issuer, date_label, url FROM certificates ORDER BY member_slug, sort_order, id')->fetchAll() as $row) {
        if (isset($members[$row['member_slug']])) {
            $members[$row['member_slug']]['certificates'][] = [
                'title' => $row['title'],
                'issuer' => $row['issuer'],
                'date' => $row['date_label'],
                'url' => $publicAssetUrl($row['url']),
            ];
        }
    }

    portfolio_json(['members' => array_values($members)]);
} catch (Throwable $error) {
    portfolio_json(['error' => 'Konten portofolio XAMPP belum siap. Jalankan db:setup.'], 503);
}
