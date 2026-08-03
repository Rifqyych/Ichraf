export default async function HalamanBlog() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");

  const daftarArtikel = await response.json();

  return (
    <main className="container">
      <h1>Kumpulan Artikel Blog</h1>
      <p>Data di bawah ini diambil secara langsung dari internet.</p>

      <div>
        {daftarArtikel.map((artikel: any) => (
          <div
            key={artikel.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
            }}
          >
            <h3>{artikel.title}</h3>
            <p>{artikel.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}