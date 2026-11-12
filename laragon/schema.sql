CREATE DATABASE IF NOT EXISTS portfolio_testimonials
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE portfolio_testimonials;

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_slug VARCHAR(32) NOT NULL,
  project_title VARCHAR(160) NULL,
  name VARCHAR(80) NOT NULL,
  role VARCHAR(100) NOT NULL DEFAULT '',
  message VARCHAR(1000) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX testimonials_status_created_at (status, created_at)
);

CREATE TABLE IF NOT EXISTS team_members (
  slug VARCHAR(32) NOT NULL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  role VARCHAR(160) NOT NULL,
  initials VARCHAR(8) NOT NULL,
  photo VARCHAR(500) NOT NULL,
  color ENUM('orange', 'blue') NOT NULL DEFAULT 'blue',
  about TEXT NOT NULL,
  contact_url VARCHAR(500) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_slug VARCHAR(32) NOT NULL,
  name VARCHAR(100) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY skills_member_name (member_slug, name),
  INDEX skills_member_order (member_slug, sort_order)
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_slug VARCHAR(32) NOT NULL,
  number_label VARCHAR(16) NOT NULL,
  title VARCHAR(160) NOT NULL,
  category VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  tools_json TEXT NOT NULL,
  link_url VARCHAR(500) NULL,
  link_label VARCHAR(120) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY projects_member_title (member_slug, title),
  INDEX projects_member_order (member_slug, sort_order)
);

CREATE TABLE IF NOT EXISTS certificates (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  member_slug VARCHAR(32) NOT NULL,
  title VARCHAR(180) NOT NULL,
  issuer VARCHAR(180) NOT NULL,
  date_label VARCHAR(80) NOT NULL,
  url VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE KEY certificates_member_title_issuer (member_slug, title, issuer),
  INDEX certificates_member_order (member_slug, sort_order)
);

INSERT IGNORE INTO team_members (slug, name, role, initials, photo, color, about, contact_url) VALUES
('zaki', 'Zaki', 'Siswa Rekayasa Perangkat Lunak (RPL)', 'ZK', '/images/asraf.png', 'orange', 'Zaki adalah siswa RPL yang sedang memperkuat basic RPL, terutama pembuatan website, logika pemrograman, dan pengelolaan kode menggunakan Git.', NULL),
('rifqy', 'Rifqy', 'Siswa Rekayasa Perangkat Lunak (RPL)', 'RF', '/images/ichwan.png', 'blue', 'Rifqy adalah siswa RPL yang mempelajari basic RPL melalui pembuatan antarmuka website, aplikasi sederhana, dan latihan pemrograman JavaScript.', 'https://github.com/Rifqyych');

INSERT IGNORE INTO skills (member_slug, name, sort_order) VALUES
('zaki', 'Basic RPL', 1), ('zaki', 'HTML', 2), ('zaki', 'CSS', 3), ('zaki', 'JavaScript', 4), ('zaki', 'Git', 5), ('zaki', 'UI Dasar', 6),
('rifqy', 'Basic RPL', 1), ('rifqy', 'HTML', 2), ('rifqy', 'CSS', 3), ('rifqy', 'JavaScript', 4), ('rifqy', 'UI Design', 5), ('rifqy', 'Git', 6);

INSERT IGNORE INTO projects (member_slug, number_label, title, category, description, tools_json, link_url, link_label, sort_order) VALUES
('zaki', '01', 'Website Profil Sekolah', 'Frontend Website', 'Website informasi sekolah yang menampilkan profil, jurusan, fasilitas, berita, dan kegiatan siswa dengan tampilan responsif.', '["HTML","CSS","JavaScript","Responsive Design"]', NULL, NULL, 1),
('zaki', '02', 'Kalkulator Nilai Siswa', 'JavaScript', 'Aplikasi sederhana untuk menghitung nilai rata-rata siswa dan menentukan predikat berdasarkan nilai tugas, UTS, dan UAS.', '["HTML","CSS","JavaScript","DOM"]', NULL, NULL, 2),
('zaki', '03', 'Aplikasi To-Do List', 'Web App', 'Aplikasi pencatat tugas harian dengan fungsi menambah, menandai selesai, dan menghapus daftar kegiatan.', '["HTML","CSS","JavaScript","Local Storage"]', NULL, NULL, 3),
('rifqy', '01', 'Website Appau', 'Web Application', 'Website aplikasi berbasis web dengan antarmuka responsif untuk memberikan pengalaman penggunaan yang sederhana dan mudah dipahami pengunjung.', '["HTML","CSS","JavaScript"]', 'https://github.com/Rifqyych/Appau', 'Lihat repository GitHub', 1),
('rifqy', '02', 'Website Kursus Aliah', 'Portal Kursus', 'Portal informasi kursus dengan tampilan responsif untuk menyajikan program belajar dan informasi yang mudah diakses pengunjung.', '["HTML","CSS","JavaScript"]', 'https://kursus-aliah.vercel.app', 'Lihat website live', 2),
('rifqy', '03', 'Website Kursus DKAcademy', 'Laravel Web App', 'Platform website kursus untuk menampilkan program pembelajaran dan informasi kursus, dibangun menggunakan framework Laravel.', '["Laravel","PHP","MySQL","Blade","Bootstrap"]', 'https://dkacademy.vercel.app', 'Lihat website live', 3);

ALTER TABLE testimonials ALTER COLUMN status SET DEFAULT 'approved';
