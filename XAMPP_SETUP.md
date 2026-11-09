# Menjalankan form testimoni dengan XAMPP

Konfigurasi ini untuk demo lokal di komputer kamu. Website user berjalan di Next.js, database berjalan di MySQL XAMPP, dan admin adalah aplikasi PHP terpisah di Apache XAMPP.

## Persiapan satu kali

1. Buka XAMPP Control Panel, lalu jalankan **Apache** dan **MySQL**.
2. Buka `http://localhost/phpmyadmin`, pilih tab **Import**, lalu import `xampp/schema.sql` dari project ini.
3. Salin folder `xampp/portfolio-api` dan `xampp/portfolio-admin` ke folder `htdocs` XAMPP. Biasanya lokasinya `C:\xampp\htdocs`; sesuaikan jika XAMPP terpasang di lokasi lain.
4. Di folder hasil salin `htdocs/portfolio-api`, duplikat `config.example.php` dan beri nama `config.php`.
5. Edit `config.php`, ubah `admin_password` menjadi kata sandi pilihanmu. Pengaturan database bawaan cocok untuk XAMPP dengan user `root` tanpa kata sandi. Sesuaikan jika MySQL kamu memakai kata sandi.

## Menjalankan

- Website user: jalankan `npm run dev`, lalu buka `http://localhost:3000`.
- Website admin terpisah: buka `http://localhost/portfolio-admin/`.
- Kiriman testimoni disimpan di MySQL XAMPP. Admin masuk menggunakan username `admin` dan kata sandi yang diisi di `config.php`, lalu menyetujui atau menolak kiriman.

Admin tidak ditautkan dari navbar website user. Kiriman yang disetujui akan muncul pada bagian Testimoni setelah halaman dimuat ulang.

Jika Apache menggunakan port selain 80, ubah URL API pada `.env.local`, contohnya:

```env
NEXT_PUBLIC_TESTIMONI_API_URL=http://localhost:8080/portfolio-api/testimonials.php
```

Restart server Next.js setelah mengubah `.env.local`. XAMPP lokal hanya bisa digunakan oleh aplikasi yang dapat terhubung ke komputer ini; formulir ini tidak menerima kiriman dari pengunjung website yang hanya berjalan di internet.
