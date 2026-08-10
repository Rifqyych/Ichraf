import Link from 'next/link';

export default async function BlogPage() {
  // Fetch all articles
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const daftarArtikel = await response.json();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Daftar Artikel Blog</h1>
      
      {daftarArtikel.map((artikel: any) => (
        <div key={artikel.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
          {/* Jadikan judul bisa diklik! */}
          <Link href={`/portfolio/blog/${artikel.id}`}>
            <h3 style={{ color: 'blue' }}>{artikel.title}</h3>
          </Link>
          <p>{artikel.body.substring(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}