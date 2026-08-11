import Link from 'next/link';

// 1. Terima params dari URL (params berupa Promise di Next.js versi baru)
export default async function DetailArtikel({ params }: { params: Promise<{ id: string }> }) {

  // 1a. Await dulu params-nya
  const { id } = await params;

  // 2. Fetch data spesifik berdasarkan ID dari param
  const respon = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  // 3. Konversi ke JSON
  const artikel = await respon.json();

  return (
    <main className="container">
      {/* Tombol kembali ke daftar blog */}
      <Link href="/portofolio/blog" style={{ textDecoration: 'none', color: '#0070f3' }}>
        Kembali ke Daftar Artikel
      </Link>

      <br /> <br />

      {/* Tampilkan detail data */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '40px' }}>
        <h1 style={{ textTransform: 'capitalize' }}>{artikel.title}</h1>
        <p style={{ color: 'gray' }}>Artikel ID: {artikel.id}</p>
        <hr />
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{artikel.body}</p>
      </div>
    </main>
  );
}