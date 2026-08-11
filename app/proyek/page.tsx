// Halaman ini mengambil data dari API buatan sendiri (app/api/proyek/route.ts)

type Proyek = {
  id: number;
  judul: string;
  teknologi: string;
  selesai: boolean;
};

export default async function ProyekPage() {
  // Fetch dari API sendiri, bukan dari JSONPlaceholder
  const response = await fetch('http://localhost:3000/api/proyek', {
    cache: 'no-store',
  });
  const daftarProyek: Proyek[] = await response.json();

  return (
    <main className="container listing-page">
      <p className="eyebrow">BACKEND SENDIRI</p>
      <h1>Daftar Proyek Kami</h1>
      <p className="page-description">
        Data di bawah ini diambil dari API buatan sendiri di{' '}
        <code>/api/proyek</code>, bukan dari internet.
      </p>

      <div className="project-grid" style={{ marginTop: '42px' }}>
        {daftarProyek.map((proyek) => (
          <div key={proyek.id} className="detail-card">
            <h2>{proyek.judul}</h2>
            <p>Teknologi: {proyek.teknologi}</p>
            <span
              className="popular-badge"
              style={{
                display: 'inline-block',
                marginTop: '14px',
                background: proyek.selesai ? '#3156db' : '#f26a3d',
                color: '#fff',
              }}
            >
              {proyek.selesai ? 'Selesai' : 'Dalam Proses'}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}