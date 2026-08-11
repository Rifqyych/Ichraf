import { NextResponse } from 'next/server';

// Fungsi GET untuk merespons permintaan pengambilan data
export async function GET() {

  // 1. Kita siapkan data buatan kita sendiri (seolah-olah dari Database)
  const daftarProyek = [
    {
      id: 1,
      judul: "Aplikasi Kasir UMKM",
      teknologi: "Flutter & Firebase",
      selesai: true,
    },
    {
      id: 2,
      judul: "Mading Sekolah Digital",
      teknologi: "Next.js & Tailwind",
      selesai: false,
    },
    {
      id: 3,
      judul: "Sistem IoT Pendeteksi Suhu",
      teknologi: "Arduino & C++",
      selesai: true,
    },
  ];

  // 2. Kirimkan data tersebut ke pengguna dalam format JSON
  return NextResponse.json(daftarProyek);
}