<script>
  import { link } from "svelte-spa-router";
</script>

<!-- NAV -->
<nav>
  <a href="/" use:link class="logo">
    <div class="logo-mark">M</div>
    <span class="logo-text">MindPal</span>
  </a>
  <ul class="nav-links">
    <li><a href="#fitur">Fitur</a></li>
    <li><a href="#cara-kerja">Cara Kerja</a></li>
    <li><a href="#komunitas">Komunitas</a></li>
    <li><a href="/login" use:link class="nav-cta">Mulai Gratis</a></li>
  </ul>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>

  <div class="hero-content">
    <div class="hero-badge">Berbasis AI · Privat & Aman</div>

    <h1>Rawat pikiranmu,<br /><em>satu hari</em> dalam satu waktu.</h1>

    <p class="hero-desc">
      MindPal hadir sebagai teman yang mendengar. Analisis kondisi mentalmu,
      dapatkan saran personal berbasis AI, dan terhubung dengan komunitas yang
      saling mendukung.
    </p>

    <div class="hero-actions">
      <a href="/login" use:link class="btn-primary">Mulai Perjalananmu</a>
      <a href="#cara-kerja" class="btn-ghost">Lihat cara kerjanya</a>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-number">12K+</div>
        <div class="stat-label">Pengguna aktif yang lebih baik setiap hari</div>
      </div>
      <div class="stat">
        <div class="stat-number">94%</div>
        <div class="stat-label">Merasa lebih tenang setelah 2 minggu</div>
      </div>
      <div class="stat">
        <div class="stat-number">50+</div>
        <div class="stat-label">Psikolog & konselor terverifikasi</div>
      </div>
    </div>
  </div>

  <!-- Floating cards -->
  <div class="hero-visual">
    <div class="mood-card">
      <div class="mood-card-label">Bagaimana perasaanmu hari ini?</div>
      <div class="mood-emojis">
        <div class="mood-emoji">😔</div>
        <div class="mood-emoji">😐</div>
        <div class="mood-emoji active">🙂</div>
        <div class="mood-emoji">😊</div>
        <div class="mood-emoji">😁</div>
      </div>
      <div class="mood-progress">
        <div class="mood-progress-fill"></div>
      </div>
    </div>
    <div class="insight-card">
      <div class="insight-icon">✨</div>
      <div class="insight-text">
        <strong>Insight Harianmu</strong>
        Tingkat stresmu turun 18% minggu ini. Pertahankan pola istirahatmu!
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="section features-bg" id="fitur">
  <div class="features-inner">
    <div>
      <div class="features-header">
        <div class="section-label">Fitur Unggulan</div>
        <h2 class="section-title">
          Semua yang kamu butuhkan, dalam satu tempat
        </h2>
        <p class="section-sub">
          Dari analisis mood hingga sesi konseling — MindPal dirancang agar
          terasa hangat dan mudah.
        </p>
      </div>
      <div class="feature-list">
        <div class="feature-item">
          <div class="feature-icon fi-sage">📋</div>
          <div class="feature-info">
            <h3>Kuesioner Mental</h3>
            <p>
              Jawab pertanyaan singkat untuk memahami kondisi emosionalmu secara
              lebih mendalam.
            </p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon fi-lavender">🤖</div>
          <div class="feature-info">
            <h3>Saran Berbasis AI</h3>
            <p>
              Rekomendasi personal dari algoritma yang memahami pola mood dan
              kebutuhanmu.
            </p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon fi-blush">💬</div>
          <div class="feature-info">
            <h3>Chat dengan Konselor</h3>
            <p>
              Terhubung langsung dengan profesional kesehatan mental yang
              terverifikasi.
            </p>
          </div>
        </div>
        <div class="feature-item">
          <div class="feature-icon fi-sky">🌱</div>
          <div class="feature-info">
            <h3>Komunitas & Sumber Belajar</h3>
            <p>
              Bergabung dengan komunitas yang saling mendukung dan akses artikel
              terpercaya.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div style="position: relative; display: flex; justify-content: center;">
      <div
        style="background: white; border-radius: 28px; padding: 2rem; border: 1px solid var(--sand); width: 300px; box-shadow: 0 12px 50px rgba(0,0,0,0.07);"
      >
        <div
          style="font-size: 0.75rem; color: var(--text-soft); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem;"
        >
          Laporan Minggu Ini
        </div>
        <div
          style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 1.5rem;"
        >
          <div>
            <div
              style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-mid); margin-bottom: 5px;"
            >
              <span>Kecemasan</span><span style="color: var(--moss);"
                >Membaik</span
              >
            </div>
            <div
              style="height: 8px; background: var(--sand); border-radius: 100px;"
            >
              <div
                style="height: 100%; width: 35%; background: var(--sage); border-radius: 100px;"
              ></div>
            </div>
          </div>
          <div>
            <div
              style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-mid); margin-bottom: 5px;"
            >
              <span>Kualitas Tidur</span><span style="color: var(--moss);"
                >Baik</span
              >
            </div>
            <div
              style="height: 8px; background: var(--sand); border-radius: 100px;"
            >
              <div
                style="height: 100%; width: 72%; background: var(--lavender); border-radius: 100px;"
              ></div>
            </div>
          </div>
          <div>
            <div
              style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-mid); margin-bottom: 5px;"
            >
              <span>Mood Umum</span><span style="color: var(--sage-dark);"
                >Stabil</span
              >
            </div>
            <div
              style="height: 8px; background: var(--sand); border-radius: 100px;"
            >
              <div
                style="height: 100%; width: 60%; background: var(--blush); border-radius: 100px;"
              ></div>
            </div>
          </div>
        </div>
        <div
          style="background: var(--sage-light); border-radius: 14px; padding: 1rem;"
        >
          <div
            style="font-size: 0.78rem; font-weight: 500; color: var(--moss); margin-bottom: 0.3rem;"
          >
            Rekomendasi hari ini
          </div>
          <div
            style="font-size: 0.8rem; color: var(--text-mid); line-height: 1.5;"
          >
            Coba teknik pernapasan 4-7-8 sebelum tidur untuk mengurangi
            kecemasan.
          </div>
        </div>
      </div>
      <div
        style="position: absolute; top: -20px; right: -20px; background: var(--blush-light); border: 1px solid var(--blush); border-radius: 16px; padding: 0.85rem 1rem; font-size: 0.8rem; color: var(--blush-dark); max-width: 150px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);"
      >
        <div style="font-weight: 500; margin-bottom: 2px;">Sesi konselor</div>
        <div style="color: var(--text-soft);">Besok, 14.00 WIB</div>
      </div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="section" id="cara-kerja">
  <div class="how-inner">
    <div class="how-header">
      <div class="section-label">Cara Kerja</div>
      <h2 class="section-title">Mulai dalam 4 langkah mudah</h2>
      <p class="section-sub" style="margin: 0.75rem auto 0;">
        Tidak perlu pengalaman sebelumnya. MindPal memandumu dari awal hingga
        kamu merasa lebih baik.
      </p>
    </div>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <h3>Daftar Gratis</h3>
        <p>Buat akun dalam 30 detik. Tidak ada kartu kredit yang dibutuhkan.</p>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <h3>Isi Kuesioner</h3>
        <p>
          Jawab pertanyaan ringan tentang kondisi emosional dan keseharianmu.
        </p>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <h3>Dapatkan Insight AI</h3>
        <p>Terima analisis personal dan saran yang relevan untuk kondisimu.</p>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <h3>Tumbuh Bersama</h3>
        <p>
          Pantau perkembanganmu dan terhubung dengan komunitas yang suportif.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="section testimonials-bg" id="komunitas">
  <div class="testimonials-inner">
    <div class="testimonials-header">
      <div class="section-label">Cerita Nyata</div>
      <h2 class="section-title">Mereka sudah merasakan manfaatnya</h2>
    </div>
    <div class="testi-grid">
      <div class="testi-card">
        <p class="testi-quote">
          "Awalnya skeptis, tapi setelah 3 minggu pakai MindPal, gue ngerasa
          jauh lebih aware sama kondisi mental gue sendiri. Kuesionernya simpel
          tapi ngena banget."
        </p>
        <div class="testi-author">
          <div class="testi-avatar av-blush">RA</div>
          <div>
            <div class="testi-name">Rania A.</div>
            <div class="testi-role">Mahasiswi, 21 tahun</div>
          </div>
        </div>
      </div>
      <div class="testi-card">
        <p class="testi-quote">
          "Fitur chat konselor ini beneran ngebantu pas gue lagi di titik
          terendah. Responsnya cepat dan profesional banget. Terima kasih
          MindPal."
        </p>
        <div class="testi-author">
          <div class="testi-avatar av-sage">DB</div>
          <div>
            <div class="testi-name">Dimas B.</div>
            <div class="testi-role">Karyawan, 27 tahun</div>
          </div>
        </div>
      </div>
      <div class="testi-card">
        <p class="testi-quote">
          "Komunitas online-nya hangat banget. Banyak orang yang berbagi
          pengalaman serupa, jadi gue nggak ngerasa sendirian lagi."
        </p>
        <div class="testi-author">
          <div class="testi-avatar av-lavender">SS</div>
          <div>
            <div class="testi-name">Sari S.</div>
            <div class="testi-role">Ibu rumah tangga, 34 tahun</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section" id="mulai">
  <div class="cta-box">
    <h2>Mulai rawat dirimu hari ini</h2>
    <p>
      Gratis selamanya untuk fitur dasar. Tidak perlu kartu kredit, tidak perlu
      janji. Hanya langkah kecil menuju dirimu yang lebih baik.
    </p>
    <a href="/login" use:link class="btn-cta">Daftar Sekarang — Gratis</a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-copy">
    © 2025 MindPal. Dibuat dengan ❤ untuk kesehatan mental Indonesia.
  </div>
  <ul class="footer-links">
    <li><a href="/">Tentang</a></li>
    <li><a href="/">Privasi</a></li>
    <li><a href="/">Kontak</a></li>
  </ul>
</footer>

<style>
  /* NAV */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 5%;
    background: rgba(253, 250, 246, 0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(181, 201, 177, 0.3);
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .logo-mark {
    width: 36px;
    height: 36px;
    background: var(--sage);
    border-radius: 50% 50% 50% 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lora", serif;
    font-size: 16px;
    color: white;
    font-weight: 600;
  }
  .logo-text {
    font-family: "Lora", serif;
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--moss);
    letter-spacing: -0.02em;
  }
  .nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-links a {
    text-decoration: none;
    color: var(--text-mid);
    font-size: 0.9rem;
    font-weight: 400;
    transition: color 0.2s;
  }
  .nav-links a:hover {
    color: var(--moss);
  }
  :global(.nav-cta) {
    background: var(--sage);
    color: white !important;
    padding: 0.5rem 1.25rem;
    border-radius: 100px;
    font-weight: 500 !important;
    transition: background 0.2s !important;
  }
  :global(.nav-cta:hover) {
    background: var(--sage-dark) !important;
    color: white !important;
  }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 0.1rem 5% 5rem;
    position: relative;
    overflow: hidden;
  }
  .hero-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(
        ellipse 60% 50% at 80% 30%,
        rgba(197, 189, 216, 0.25) 0%,
        transparent 70%
      ),
      radial-gradient(
        ellipse 50% 60% at 10% 70%,
        rgba(181, 201, 177, 0.3) 0%,
        transparent 70%
      ),
      radial-gradient(
        ellipse 40% 40% at 50% 90%,
        rgba(232, 201, 193, 0.2) 0%,
        transparent 70%
      );
  }
  .blob {
    position: absolute;
    border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    opacity: 0.18;
    animation: morph 10s ease-in-out infinite;
  }
  .blob-1 {
    width: 500px;
    height: 500px;
    background: var(--sage);
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }
  .blob-2 {
    width: 350px;
    height: 350px;
    background: var(--lavender);
    bottom: -80px;
    left: 20%;
    animation-delay: 3s;
  }
  .blob-3 {
    width: 250px;
    height: 250px;
    background: var(--blush);
    top: 30%;
    left: -60px;
    animation-delay: 6s;
  }
  @keyframes morph {
    0%,
    100% {
      border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
    }
    33% {
      border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
    }
    66% {
      border-radius: 70% 30% 50% 50% / 30% 70% 50% 50%;
    }
  }
  .hero-content {
    position: relative;
    max-width: 600px;
    animation: fadeUp 0.9s ease both;
  }
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(28px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--sage-light);
    color: var(--moss);
    font-size: 0.8rem;
    font-weight: 500;
    padding: 0.4rem 1rem;
    border-radius: 100px;
    margin-bottom: 1.5rem;
    letter-spacing: 0.03em;
  }
  .hero-badge::before {
    content: "";
    width: 7px;
    height: 7px;
    background: var(--sage-dark);
    border-radius: 50%;
  }
  h1 {
    font-family: "Lora", serif;
    font-size: clamp(2.4rem, 5vw, 3.8rem);
    font-weight: 600;
    line-height: 1.2;
    color: var(--text-dark);
    margin-bottom: 1.25rem;
    letter-spacing: -0.02em;
  }
  h1 em {
    color: var(--moss);
    font-style: italic;
  }
  .hero-desc {
    font-size: 1.05rem;
    color: var(--text-mid);
    line-height: 1.75;
    margin-bottom: 2.25rem;
    font-weight: 300;
    max-width: 480px;
  }
  .hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }
  :global(.btn-primary) {
    background: var(--moss);
    color: white;
    padding: 0.85rem 2rem;
    border-radius: 100px;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition:
      transform 0.2s,
      background 0.2s;
    box-shadow: 0 4px 20px rgba(74, 103, 65, 0.25);
  }
  :global(.btn-primary:hover) {
    background: var(--sage-dark);
    transform: translateY(-2px);
    color: white;
  }
  .btn-ghost {
    color: var(--text-mid);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: color 0.2s;
  }
  .btn-ghost:hover {
    color: var(--moss);
  }
  .btn-ghost::after {
    content: "→";
    transition: transform 0.2s;
  }
  .btn-ghost:hover::after {
    transform: translateX(4px);
  }
  .hero-visual {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translateY(-50%);
    animation: fadeUp 1s 0.2s ease both;
  }
  .mood-card {
    background: white;
    border-radius: 24px;
    padding: 1.5rem;
    width: 260px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.07);
    border: 1px solid var(--sand);
    margin-bottom: 1rem;
    transition: transform 0.3s;
  }
  .mood-card:hover {
    transform: translateY(-4px);
  }
  .mood-card-label {
    font-size: 0.75rem;
    color: var(--text-soft);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.75rem;
  }
  .mood-emojis {
    display: flex;
    gap: 12px;
    margin-bottom: 1rem;
  }
  .mood-emoji {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    cursor: pointer;
    transition: transform 0.15s;
    border: 2px solid transparent;
  }
  .mood-emoji:hover {
    transform: scale(1.15);
  }
  .mood-emoji.active {
    border-color: var(--sage-dark);
    background: var(--sage-light);
  }
  .mood-progress {
    height: 6px;
    background: var(--sand);
    border-radius: 100px;
    overflow: hidden;
  }
  .mood-progress-fill {
    height: 100%;
    width: 68%;
    background: linear-gradient(90deg, var(--sage) 0%, var(--sage-dark) 100%);
    border-radius: 100px;
  }
  .insight-card {
    background: var(--lavender-light);
    border-radius: 18px;
    padding: 1.25rem;
    width: 240px;
    margin-left: 2rem;
    border: 1px solid var(--lavender);
  }
  .insight-icon {
    width: 32px;
    height: 32px;
    background: var(--lavender);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
  .insight-text {
    font-size: 0.85rem;
    color: var(--text-mid);
    line-height: 1.5;
  }
  .insight-text strong {
    display: block;
    color: var(--text-dark);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }

  /* STATS */
  .stats {
    display: flex;
    gap: 0;
    border-top: 1px solid var(--sand);
    margin-top: 3rem;
    padding-top: 2rem;
    position: relative;
  }
  .stat {
    flex: 1;
    padding-right: 2rem;
    border-right: 1px solid var(--sand);
    margin-right: 2rem;
    animation: fadeUp 1s ease both;
  }
  .stat:last-child {
    border-right: none;
    padding-right: 0;
    margin-right: 0;
  }
  .stat:nth-child(1) {
    animation-delay: 0.2s;
  }
  .stat:nth-child(2) {
    animation-delay: 0.35s;
  }
  .stat:nth-child(3) {
    animation-delay: 0.5s;
  }
  .stat-number {
    font-family: "Lora", serif;
    font-size: 2rem;
    font-weight: 600;
    color: var(--moss);
    line-height: 1;
    margin-bottom: 0.35rem;
  }
  .stat-label {
    font-size: 0.82rem;
    color: var(--text-soft);
    line-height: 1.4;
  }

  /* FEATURES */
  .section {
    padding: 6rem 5%;
  }
  .section-label {
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sage-dark);
    margin-bottom: 1rem;
  }
  .section-title {
    font-family: "Lora", serif;
    font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 600;
    line-height: 1.25;
    color: var(--text-dark);
    margin-bottom: 1rem;
    letter-spacing: -0.02em;
    max-width: 500px;
  }
  .section-sub {
    font-size: 1rem;
    color: var(--text-mid);
    line-height: 1.7;
    max-width: 460px;
    font-weight: 300;
  }
  .features-bg {
    background: var(--cream);
  }
  .features-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
    max-width: 1100px;
    margin: 0 auto;
  }
  .features-header {
    margin-bottom: 2.5rem;
  }
  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .feature-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.1rem 1.25rem;
    background: white;
    border-radius: 16px;
    border: 1px solid var(--sand);
    transition:
      border-color 0.2s,
      transform 0.2s;
    cursor: default;
  }
  .feature-item:hover {
    border-color: var(--sage);
    transform: translateX(4px);
  }
  .feature-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  .fi-sage {
    background: var(--sage-light);
  }
  .fi-blush {
    background: var(--blush-light);
  }
  .fi-lavender {
    background: var(--lavender-light);
  }
  .fi-sky {
    background: var(--sky-light);
  }
  .feature-info h3 {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 0.2rem;
  }
  .feature-info p {
    font-size: 0.82rem;
    color: var(--text-soft);
    line-height: 1.5;
    margin: 0;
  }

  /* HOW IT WORKS */
  .how-inner {
    max-width: 1000px;
    margin: 0 auto;
    text-align: center;
  }
  .how-header {
    margin-bottom: 3.5rem;
  }
  .how-header .section-title,
  .how-header .section-sub {
    margin: 0 auto;
    text-align: center;
  }
  .how-header .section-label {
    text-align: center;
  }
  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    position: relative;
  }
  .steps::before {
    content: "";
    position: absolute;
    top: 28px;
    left: 12.5%;
    right: 12.5%;
    height: 1px;
    background: var(--sand);
    z-index: 0;
  }
  .step {
    position: relative;
    z-index: 1;
    animation: fadeUp 0.7s ease both;
  }
  .step:nth-child(1) {
    animation-delay: 0.1s;
  }
  .step:nth-child(2) {
    animation-delay: 0.25s;
  }
  .step:nth-child(3) {
    animation-delay: 0.4s;
  }
  .step:nth-child(4) {
    animation-delay: 0.55s;
  }
  .step-num {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--sand);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
    font-family: "Lora", serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--moss);
    transition:
      border-color 0.2s,
      background 0.2s;
  }
  .step:hover .step-num {
    border-color: var(--sage);
    background: var(--sage-light);
  }
  .step h3 {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  .step p {
    font-size: 0.82rem;
    color: var(--text-soft);
    line-height: 1.6;
  }

  /* TESTIMONIALS */
  .testimonials-bg {
    background: var(--cream);
  }
  .testimonials-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
  .testimonials-header {
    margin-bottom: 3rem;
  }
  .testi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
  .testi-card {
    background: white;
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid var(--sand);
    transition: transform 0.2s;
  }
  .testi-card:hover {
    transform: translateY(-4px);
  }
  .testi-card:nth-child(2) {
    background: var(--sage-light);
    border-color: var(--sage);
    margin-top: -1rem;
  }
  .testi-quote {
    font-size: 0.9rem;
    color: var(--text-mid);
    line-height: 1.65;
    margin-bottom: 1.25rem;
    font-style: italic;
    font-family: "Lora", serif;
  }
  .testi-author {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .testi-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 500;
    color: white;
  }
  .av-sage {
    background: var(--sage-dark);
  }
  .av-blush {
    background: var(--blush-dark);
  }
  .av-lavender {
    background: #9389b8;
  }
  .testi-name {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-dark);
  }
  .testi-role {
    font-size: 0.75rem;
    color: var(--text-soft);
  }

  /* CTA */
  .cta-section {
    padding: 6rem 5%;
    text-align: center;
  }
  .cta-box {
    background: var(--moss);
    border-radius: 32px;
    padding: 4rem 3rem;
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
  }
  .cta-box::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 200px;
    height: 200px;
    background: rgba(181, 201, 177, 0.15);
    border-radius: 50%;
  }
  .cta-box::after {
    content: "";
    position: absolute;
    bottom: -40px;
    left: -40px;
    width: 160px;
    height: 160px;
    background: rgba(232, 201, 193, 0.1);
    border-radius: 50%;
  }
  .cta-box h2 {
    font-family: "Lora", serif;
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    color: white;
    font-weight: 600;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
  }
  .cta-box p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    font-weight: 300;
    position: relative;
    z-index: 1;
  }
  :global(.btn-cta) {
    display: inline-block;
    background: white;
    color: var(--moss);
    padding: 0.9rem 2.25rem;
    border-radius: 100px;
    font-weight: 500;
    font-size: 0.95rem;
    text-decoration: none;
    transition:
      transform 0.2s,
      box-shadow 0.2s;
    position: relative;
    z-index: 1;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  :global(.btn-cta:hover) {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    color: var(--moss);
  }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--sand);
    padding: 2.5rem 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-copy {
    font-size: 0.82rem;
    color: var(--text-soft);
  }
  .footer-links {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .footer-links a {
    text-decoration: none;
    font-size: 0.82rem;
    color: var(--text-soft);
    transition: color 0.2s;
  }
  .footer-links a:hover {
    color: var(--moss);
  }

  @media (max-width: 900px) {
    .hero-visual {
      display: none;
    }
    .features-inner {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    .steps {
      grid-template-columns: repeat(2, 1fr);
    }
    .steps::before {
      display: none;
    }
    .testi-grid {
      grid-template-columns: 1fr;
    }
    .testi-card:nth-child(2) {
      margin-top: 0;
    }
    .nav-links {
      display: none;
    }
  }
</style>
