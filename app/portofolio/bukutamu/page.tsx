"use client";

import { useEffect, useState } from "react";

export default function BukuTamuPage() {
  const [inputTeks, setInputTeks] = useState("");
  const [daftarPesan, setDaftarPesan] = useState<string[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("guestbook");

    if (data) {
      setDaftarPesan(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "guestbook",
      JSON.stringify(daftarPesan)
    );
  }, [daftarPesan]);

  function tambahPesan() {
    if (inputTeks.trim() === "") {
      alert("Silakan isi pesan terlebih dahulu!");
      return;
    }

    setDaftarPesan([...daftarPesan, inputTeks]);
    setInputTeks("");
  }

  return (
    <main className="container member-portfolio-page">
      <section className="portfolio-header">
        <p className="eyebrow">BUKU TAMU</p>

        <h1>Guestbook Portfolio Team RPL</h1>

        <p>
          Tinggalkan pesan, kritik, atau saran untuk portfolio kami.
          Pesan akan tetap tersimpan walaupun halaman di-refresh.
        </p>
      </section>

      <section className="guestbook-card">
        <div className="guestbook-header">
          <div>
            <h2>Buku Tamu</h2>
            <p>Silakan tuliskan pesan Anda.</p>
          </div>

          <div className="guestbook-total">
            {daftarPesan.length}
            <span> Pesan</span>
          </div>
        </div>

        <div className="guestbook-form">
          <input
            type="text"
            placeholder="Masukkan pesan..."
            value={inputTeks}
            onChange={(e) => setInputTeks(e.target.value)}
          />

          <button onClick={tambahPesan}>
            Kirim Pesan
          </button>
        </div>

        <div className="guestbook-list">
          {daftarPesan.length === 0 ? (
            <div className="guestbook-empty">
              <h3>Belum Ada Pesan</h3>
              <p>Jadilah orang pertama yang mengisi buku tamu.</p>
            </div>
          ) : (
            daftarPesan.map((pesan, index) => (
              <div className="guestbook-item" key={index}>
                <div className="guestbook-avatar">
                  {index + 1}
                </div>

                <div className="guestbook-content">
                  <h3>Pengunjung {index + 1}</h3>
                  <p>{pesan}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}