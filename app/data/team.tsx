export type Project = {
  number: string;
  title: string;
  category: string;
  description: string;
  tools: string[];
  linkUrl?: string;
  linkLabel?: string;
};

export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  url?: string;
};

export type Testimonial = {
  name: string;
  role: string;
  message: string;
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  initials: string;
  photo: string;
  color: string;
  about: string;
  skills: string[];
  projects: Project[];
  certificates: Certificate[];
  testimonials: Testimonial[];
  contactUrl?: string;
};

export const members: TeamMember[] = [
  {
    slug: "zaki",
    name: "Zaki",
    role: "Siswa Rekayasa Perangkat Lunak (RPL)",
    initials: "ZK",
    photo: "/images/asraf.png",
    color: "orange",
    about:
      "Zaki adalah siswa RPL yang sedang memperkuat basic RPL, terutama pembuatan website, logika pemrograman, dan pengelolaan kode menggunakan Git.",
    skills: ["Basic RPL", "HTML", "CSS", "JavaScript", "Git", "UI Dasar"],
    certificates: [],
    testimonials: [],
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
    slug: "rifqy",
    name: "Rifqy",
    role: "Siswa Rekayasa Perangkat Lunak (RPL)",
    initials: "RF",
    photo: "/images/ichwan.png",
    color: "blue",
    about:
      "Rifqy adalah siswa RPL yang mempelajari basic RPL melalui pembuatan antarmuka website, aplikasi sederhana, dan latihan pemrograman JavaScript.",
    skills: ["Basic RPL", "HTML", "CSS", "JavaScript", "UI Design", "Git"],
    certificates: [],
    testimonials: [],
    contactUrl: "https://github.com/Rifqyych",
    projects: [
      {
        number: "01",
        title: "Website Appau",
        category: "Web Application",
        description:
          "Website aplikasi berbasis web dengan antarmuka responsif untuk memberikan pengalaman penggunaan yang sederhana dan mudah dipahami.",
        tools: ["HTML", "CSS", "JavaScript"],
        linkUrl: "https://github.com/Rifqyych/Appau",
        linkLabel: "Lihat repository GitHub",
      },
      {
        number: "02",
        title: "Website Kursus Aliah",
        category: "Portal Kursus",
        description:
          "Portal informasi kursus dengan tampilan responsif untuk menyajikan program belajar dan informasi yang mudah diakses pengunjung.",
        tools: ["HTML", "CSS", "JavaScript"],
        linkUrl: "https://kursus-aliah.vercel.app",
        linkLabel: "Lihat website live",
      },
      {
        number: "03",
        title: "Website Kursus DKAcademy",
        category: "Laravel Web App",
        description:
          "Platform website kursus untuk menampilkan program pembelajaran dan informasi kursus, dibangun menggunakan framework Laravel.",
        tools: ["Laravel", "PHP", "MySQL", "Blade", "Bootstrap"],
        linkUrl: "https://dkacademy.vercel.app",
        linkLabel: "Lihat website live",
      },
    ],
  },
];

export function getMember(slug: string) {
  return members.find((member) => member.slug === slug);
}
