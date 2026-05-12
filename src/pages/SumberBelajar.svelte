<script>
  import Sidebar from '../components/Sidebar.svelte';
  let activeCategory = 'Semua';

  const categories = ['Semua', 'Artikel', 'Meditasi Audio', 'Video Edukasi', 'Panduan Jurnal'];

  const resources = [
    {
      id: 1,
      title: 'Memahami Panic Attack dan Cara Mengatasinya',
      desc: 'Pelajari teknik pernapasan dan grounding 5-4-3-2-1 untuk meredakan serangan panik secara efektif.',
      type: 'Artikel',
      theme: 'sage',
      icon: '📄',
      time: '5 mnt baca',
      views: '1.2k kali dibaca'
    },
    {
      id: 2,
      title: 'Melepaskan Beban Pikiran Sebelum Tidur',
      desc: 'Sesi meditasi audio terpandu untuk membantu tubuh rileks dan mendapatkan tidur yang berkualitas.',
      type: 'Meditasi Audio',
      theme: 'lavender',
      icon: '🎧',
      time: '15 mnt dengar',
      views: '3.4k kali didengar'
    },
    {
      id: 3,
      title: 'Kenapa Kita Sering Merasa Insecure?',
      desc: 'Penjelasan psikologis mengenai akar rasa rendah diri dan langkah pertama untuk membangun self-esteem.',
      type: 'Video Edukasi',
      theme: 'sky',
      icon: '▶️',
      time: '8 mnt tonton',
      views: '850 kali ditonton'
    },
    {
      id: 4,
      title: 'Template Journaling: Mengenali Emosi Harian',
      desc: 'Panduan menulis jurnal harian untuk melacak mood dan mencari pola stres dalam keseharianmu.',
      type: 'Panduan Jurnal',
      theme: 'amber',
      icon: '📓',
      time: '3 mnt baca',
      views: '2.1k kali diunduh'
    },
    {
      id: 5,
      title: 'Membangun Batasan Diri (Boundaries) yang Sehat',
      desc: 'Cara berkata "tidak" tanpa merasa bersalah demi menjaga energi mental dan emosionalmu.',
      type: 'Artikel',
      theme: 'sage',
      icon: '📄',
      time: '6 mnt baca',
      views: '1.8k kali dibaca'
    },
    {
      id: 6,
      title: 'Fokus dan Hadir Secara Penuh (Mindfulness)',
      desc: 'Latihan audio singkat di sela-sela jam kerja untuk mengembalikan fokus yang hilang.',
      type: 'Meditasi Audio',
      theme: 'lavender',
      icon: '🎧',
      time: '10 mnt dengar',
      views: '4.5k kali didengar'
    }
  ];

  $: filteredResources = activeCategory === 'Semua' 
    ? resources 
    : resources.filter(r => r.type === activeCategory);

  function setCategory(cat) {
    activeCategory = cat;
  }
</script>

<Sidebar />

<main class="layout-main">
  <div class="content-wrapper">
    <header class="page-header">
      <h1 class="page-title">Sumber Belajar 📚</h1>
      <p class="page-subtitle">Kumpulan artikel, meditasi, dan panduan untuk mendukung perjalanan mentalmu.</p>
    </header>

    <div class="filter-container">
      {#each categories as cat}
        <button 
          class="filter-btn" 
          class:active={activeCategory === cat} 
          on:click={() => setCategory(cat)}
        >
          {cat}
        </button>
      {/each}
    </div>

    <div class="resource-grid">
      {#each filteredResources as item}
        <article class="resource-card">
          <div class="card-thumbnail thumbnail-{item.theme}">
            <span class="thumbnail-icon">{item.icon}</span>
          </div>
          <div class="card-content">
            <span class="card-badge badge-{item.theme}">{item.type}</span>
            <h2 class="card-title">{item.title}</h2>
            <p class="card-desc">{item.desc}</p>
            <div class="card-footer">
              <span class="card-meta">⏱ {item.time}</span>
              <span class="card-meta">👁 {item.views}</span>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</main>

<style>
  :root {
    --cream: #FDFBF7;
    --moss: #557C55;
    --sage-light: #EAF0E7;
    --sage-dark: #7A916E;
    --sand: #E5E5E5;
    --sand-dark: #D1D1D1;
    --text-dark: #222222;
    --text-mid: #555555;
    --text-soft: #888888;
    --blush-light: #FBE8E8;
    --blush-dark: #C97A7E;
    --lavender-light: #F0E7F5;
    --lavender-dark: #8E73A6;
    --amber-light: #FEF3C7;
    --amber-dark: #B45309;
    --sky-light: #E6F0F9;
    --sky-dark: #5B8FB9;
  }

  * { box-sizing: border-box; }
  button { font-family: inherit; cursor: pointer; background: none; border: none; }
  
  .layout-main {
    margin-left: 240px;
    min-height: 100vh;
    background-color: var(--cream);
    color: var(--text-dark);
    font-family: 'DM Sans', sans-serif;
    padding: 2.5rem;
  }

  .content-wrapper {
    max-width: 1100px;
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-family: 'Lora', serif;
    font-size: 2rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .page-subtitle {
    font-size: 0.95rem;
    color: var(--text-mid);
    margin: 0;
  }

  .filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .filter-btn {
    padding: 0.5rem 1.25rem;
    border-radius: 9999px;
    border: 1.5px solid var(--sand);
    background: white;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-mid);
    transition: all 0.2s;
  }

  .filter-btn:hover {
    border-color: var(--moss);
    color: var(--moss);
  }

  .filter-btn.active {
    background: var(--moss);
    border-color: var(--moss);
    color: white;
  }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .resource-card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.2s;
    cursor: pointer;
  }

  .resource-card:hover {
    border-color: var(--moss);
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.03);
  }

  .card-thumbnail {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid var(--sand);
  }

  .thumbnail-sage { background: linear-gradient(135deg, var(--sage-light), #D4E0D1); }
  .thumbnail-lavender { background: linear-gradient(135deg, var(--lavender-light), #E3D4EB); }
  .thumbnail-sky { background: linear-gradient(135deg, var(--sky-light), #D1E5F5); }
  .thumbnail-amber { background: linear-gradient(135deg, var(--amber-light), #FCE6A9); }

  .thumbnail-icon {
    font-size: 3.5rem;
  }

  .card-content {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .card-badge {
    align-self: flex-start;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .badge-sage { background: var(--sage-light); color: var(--sage-dark); }
  .badge-lavender { background: var(--lavender-light); color: var(--lavender-dark); }
  .badge-sky { background: var(--sky-light); color: var(--sky-dark); }
  .badge-amber { background: var(--amber-light); color: var(--amber-dark); }

  .card-title {
    font-family: 'Lora', serif;
    font-size: 1.1rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 0.5rem 0;
    color: var(--text-dark);
  }

  .card-desc {
    font-size: 0.85rem;
    color: var(--text-mid);
    line-height: 1.6;
    margin: 0 0 1.25rem 0;
    flex: 1;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid var(--sand);
  }

  .card-meta {
    font-size: 0.75rem;
    color: var(--text-soft);
    font-weight: 500;
  }
</style>