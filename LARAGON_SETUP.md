# Menjalankan website dengan Laragon

Website user berjalan dengan Next.js di `http://localhost:3000`. Database MySQL, API, dan halaman admin lokal dijalankan oleh Laragon.

## Persiapan Laragon

1. Buka Laragon di `C:\laragon` dan pilih **Start All** untuk menjalankan Apache dan MySQL. Jangan jalankan Apache XAMPP bersamaan jika keduanya memakai port 80.
2. Di terminal VS Code pada folder project, jalankan:

   ```powershell
   npm run laragon:sync
   ```

   Ini menyalin API dan admin ke `C:\laragon\www`. Jika ada konfigurasi dan berkas unggahan XAMPP lokal, skrip juga menyalinnya sebagai salinan; berkas XAMPP tidak dihapus.
3. Jika Laragon menggunakan kata sandi MySQL berbeda, edit `C:\laragon\www\portfolio-api\config.php` agar `db_password` cocok dengan MySQL Laragon. File ini lokal dan tidak masuk GitHub.
4. Siapkan tabel database:

   ```powershell
   npm run db:setup
   ```

   Perintah ini membuat database `portfolio_testimonials` dan tabel testimoni, anggota, skill, proyek, serta sertifikat dengan data awal. Jika MySQL root meminta kata sandi, masukkan kata sandi Laragon (untuk setelan bawaan, tekan Enter).
5. Jalankan website user:

   ```powershell
   npm run dev
   ```

## Alamat

- Website user: `http://localhost:3000`
- Admin terpisah: `http://localhost/portfolio-admin/`
- API konten: `http://localhost/portfolio-api/content.php`

Admin mengelola profil, skill, proyek, sertifikat, dan penghapusan testimoni. Perubahan database tampil pada halaman user otomatis dalam beberapa detik. Foto profil menerima JPG, PNG, atau WebP; sertifikat menerima PDF atau gambar, maksimal 12 MB. Berkas tersimpan lokal di `C:\laragon\www\portfolio-api\uploads`.

## Memindahkan database dari XAMPP

Skrip sinkronisasi menyalin kode, konfigurasi lokal yang tersedia, serta berkas unggahan. Data MySQL XAMPP perlu diekspor dan diimpor sebagai SQL karena Laragon memakai instalasi database terpisah. Biarkan database XAMPP tetap utuh sampai data berhasil dicek di Laragon:

1. Nyalakan MySQL XAMPP sementara, lalu ekspor database `portfolio_testimonials` ke file `.sql` dari phpMyAdmin.
2. Nyalakan MySQL Laragon, buka phpMyAdmin Laragon, lalu impor file `.sql` tersebut. Jika ingin database baru dengan data contoh, jalankan `npm run db:setup` sebagai gantinya.
3. Pastikan `config.php` di `C:\laragon\www\portfolio-api` memakai user, kata sandi, dan port MySQL Laragon.

Jika Apache atau MySQL Laragon memakai port khusus, atur `LARAGON_HOME` atau `LARAGON_MYSQL_PORT` di terminal. Untuk URL API Next.js khusus, atur `NEXT_PUBLIC_TESTIMONI_API_URL` pada `.env.local`, lalu mulai ulang `npm run dev`.
