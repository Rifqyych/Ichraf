import Link from 'next/link';

// 1. Terima params dari URL
export default async function DetailArtikel({ params }: { params: { id: string } }) {

  // 2. Fetch data spesifik berdasarkan ID dari param
  const respon = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`);

  // 3. Konversi ke JSON
  const artikel = await respon.json();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Tombol kembali ke daftar blog */}
      <Link href="/portfolio/blog" style={{ textDecoration: 'none', color: '#0070f3' }}>
        Kembali ke Daftar Artikel
      </Link>

      <br /> <br />

      {/* Tampilkan detail data */}
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h1 style={{ textTransform: 'capitalize' }}>{artikel.title}</h1>
        <p style={{ color: 'gray' }}>Artikel ID: {artikel.id}</p>
        <hr />
        <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{artikel.body}</p>
      </div>
    </div>
  );
}