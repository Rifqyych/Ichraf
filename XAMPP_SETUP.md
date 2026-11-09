# Menjalankan form testimoni dengan XAMPP

Konfigurasi ini untuk demo lokal di komputer kamu. Website user berjalan di Next.js, database berjalan di MySQL XAMPP, dan admin adalah aplikasi PHP terpisah di Apache XAMPP.

## Persiapan satu kali

1. Buka XAMPP Control Panel, lalu jalankan **Apache** dan **MySQL**.
2. Buka terminal VS Code di folder project dan jalankan:

   ```powershell
   npm run db:setup
   ```

   Script ini memakai `C:\xampp\mysql\bin\mysql.exe` untuk membuat database `portfolio_testimonials` dan tabel `testimonials`, `team_members`, `skills`, `projects`, dan `certificates`, lalu mengisi data awal profil dan proyek. Masukkan kata sandi MySQL root jika diminta; jika masih bawaan XAMPP, tekan Enter.
   Jika muncul `ERROR 1130 (HY000): Host 'localhost' is not allowed`, hak akses akun MariaDB XAMPP perlu diperbaiki terlebih dahulu. phpMyAdmin mengalami error host yang sama; script tidak mengubah akun MySQL.
3. Salin folder `xampp/portfolio-api` dan `xampp/portfolio-admin` ke folder `htdocs` XAMPP. Biasanya lokasinya `C:\xampp\htdocs`; sesuaikan jika XAMPP terpasang di lokasi lain. Di komputer ini folder tersebut sudah disalin.
4. Di `htdocs/portfolio-api`, duplikat `config.example.php` dan beri nama `config.php`.
5. Edit `config.php`, ubah `admin_password` menjadi kata sandi pilihanmu. Pengaturan database bawaan cocok untuk XAMPP dengan user `root` tanpa kata sandi. Sesuaikan jika MySQL kamu memakai kata sandi.

## Menjalankan

- Website user: jalankan `npm run dev`, lalu buka `http://localhost:3000`.
- Website admin terpisah: buka `http://localhost/portfolio-admin/`. Admin dapat mengedit profil dan skill, mengelola proyek dan sertifikat, serta menghapus testimoni.
- Kiriman testimoni disimpan dan langsung ditampilkan dari MySQL XAMPP. Admin tidak perlu menyetujui kiriman.

Admin tetap terpisah dari website user dan tidak ditautkan dari navbar. Halaman testimoni memuat pembaruan secara otomatis.

Jika XAMPP terpasang selain di `C:\xampp`, atur `XAMPP_HOME` sebelum menjalankan script. Jika Apache menggunakan port selain 80, ubah URL API pada `.env.local`, contohnya:

```env
NEXT_PUBLIC_TESTIMONI_API_URL=http://localhost:8080/portfolio-api/testimonials.php
```

Restart server Next.js setelah mengubah `.env.local`. XAMPP lokal hanya bisa digunakan oleh aplikasi yang dapat terhubung ke komputer ini; formulir ini tidak menerima kiriman dari pengunjung website yang hanya berjalan di internet.
