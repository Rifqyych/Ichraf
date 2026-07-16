export type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  about: string;
  skills: string[];
  projects: Project[];
};

export const members: TeamMember[] = [
  {
    slug: "asraf",
    name: "Asraf",
    role: "Siswa Rekayasa Perangkat Lunak (RPL)",
    initials: "AS",
    color: "blue",
    about:
      "Asraf adalah siswa RPL yang sedang memperkuat basic RPL, terutama pembuatan website, logika pemrograman, dan pengelolaan kode menggunakan Git.",
    skills: ["Basic RPL", "HTML", "CSS", "JavaScript", "Git", "UI Dasar"],
    projects: [
      {
        number: "01",
        title: "Website Profil Sekolah",
        category: "Frontend Website",
        description:
          "Website informasi sekolah yang menampilkan profil, jurusan, fasilitas, berita, dan kegiatan siswa dengan tampilan responsif.",
        tools: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      },
      {
        number: "02",
        title: "Kalkulator Nilai Siswa",
        category: "JavaScript",
        description:
          "Aplikasi sederhana untuk menghitung nilai rata-rata siswa dan menentukan predikat berdasarkan nilai tugas, UTS, dan UAS.",
        tools: ["HTML", "CSS", "JavaScript", "DOM"],
      },
      {
        number: "03",
        title: "Aplikasi To-Do List",
        category: "Web App",
        description:
          "Aplikasi pencatat tugas harian dengan fungsi menambah, menandai selesai, dan menghapus daftar kegiatan.",
        tools: ["HTML", "CSS", "JavaScript", "Local Storage"],
      },
    ],
  },
  {
    slug: "ichwan",
    name: "Ichwan",
    role: "Siswa Rekayasa Perangkat Lunak (RPL)",
    initials: "IC",
    color: "orange",
    about:
      "Ichwan adalah siswa RPL yang mempelajari basic RPL melalui pembuatan antarmuka website, aplikasi sederhana, dan latihan pemrograman JavaScript.",
    skills: ["Basic RPL", "HTML", "CSS", "JavaScript", "UI Design", "Git"],
    projects: [
      {
        number: "01",
        title: "Landing Page Kelas",
        category: "Frontend Website",
        description:
          "Halaman informasi kelas berisi jadwal pelajaran, struktur organisasi, galeri kegiatan, dan kontak pengurus kelas.",
        tools: ["HTML", "CSS", "JavaScript", "Layout"],
      },
      {
        number: "02",
        title: "Aplikasi Kasir Sederhana",
        category: "JavaScript",
        description:
          "Aplikasi latihan transaksi yang dapat menghitung total belanja, jumlah bayar, kembalian, dan daftar pesanan.",
        tools: ["HTML", "CSS", "JavaScript", "DOM"],
      },
      {
        number: "03",
        title: "Perpustakaan Digital Mini",
        category: "Web App",
        description:
          "Prototype katalog buku digital dengan fitur pencarian buku dan tampilan status buku yang tersedia atau sedang dipinjam.",
        tools: ["HTML", "CSS", "JavaScript", "Data Array"],
      },
    ],
  },
];

export function getMember(slug: string) {
  return members.find((member) => member.slug === slug);
}
