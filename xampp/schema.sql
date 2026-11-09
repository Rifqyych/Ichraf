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
