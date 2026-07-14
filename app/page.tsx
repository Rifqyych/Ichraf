import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="landing frame">
        <div className="landing-copy">
          <p className="section-code">01 — BERANDA</p>

          <h1>
            Membuat web
            <br />
            dengan <span>rasa ingin tahu.</span>
          </h1>

          <p className="landing-text">
            Halo, saya Ahmad Chairul Ichraf. Saya sedang belajar membangun
            website yang tidak hanya berfungsi, tetapi juga nyaman digunakan.
          </p>

          <div className="landing-actions">
            <Link className="button button-blue" href="/portofolio">
              Lihat Project
            </Link>
            <Link className="underlined-link" href="/profile">
              Kenalan dengan saya →
            </Link>
          </div>
        </div>

        <div className="landing-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-square">ACI</div>
          <div className="art-note">
            <span>NOW</span>
            <strong>Learning<br />Next.js</strong>
          </div>
        </div>
      </section>

      <section className="home-strip">
        <div className="frame strip-grid">
          <p>HTML / CSS / JAVASCRIPT</p>
          <p>REACT / NEXT.JS</p>
          <p>UI EXPLORATION</p>
        </div>
      </section>

      <section className="frame home-intro">
        <p className="section-code">02 — CATATAN SINGKAT</p>
        <div>
          <h2>
            Saya percaya project kecil adalah tempat terbaik untuk mulai
            memahami teknologi.
          </h2>
          <Link className="underlined-link" href="/profile">
            Baca halaman profil →
          </Link>
        </div>
      </section>
    </main>
  );
}