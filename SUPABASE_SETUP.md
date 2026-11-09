# Menyiapkan formulir testimoni

Formulir publik memakai Supabase agar kiriman pengunjung tersimpan dan bisa ditinjau admin.

1. Buat project Supabase.
2. Buka **SQL Editor**, jalankan isi `supabase/schema.sql`.
3. Salin Project URL dan **secret key** dari pengaturan API project.
4. Atur environment variable berikut di `.env.local` untuk pengembangan dan di pengaturan environment Vercel untuk situs live:

   ```env
   SUPABASE_URL=https://PROJECT_REF.supabase.co
   SUPABASE_SECRET_KEY=ISI_SECRET_KEY
   ADMIN_PASSWORD=BUAT_KATA_SANDI_ADMIN_YANG_KUAT
   ```

5. Restart server lokal setelah mengubah `.env.local`.
6. Pengunjung mengisi formulir di bagian **Testimoni** pada beranda. Kiriman masuk dengan status `pending`.
7. Admin membuka `/admin`, memasukkan `ADMIN_PASSWORD`, lalu menyetujui atau menolak setiap kiriman.

Jangan pernah menaruh `SUPABASE_SECRET_KEY` atau `ADMIN_PASSWORD` di kode browser, mengirimkannya lewat chat, atau melakukan commit file `.env.local`. Kiriman baru tampil di website setelah admin menyetujuinya.
