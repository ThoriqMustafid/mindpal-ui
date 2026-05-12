<script>
  import { onMount } from 'svelte';
  import Sidebar from '../components/Sidebar.svelte';
  import { getPosts, createPost, toggleLike as togglePostLike } from '../lib/api/post.js';

  let activeTab = 'semua';
  let isModalOpen = false;
  let isLoadingPosts = false;
  let isPublishing = false;
  let selectedCategory = 'Cerita & Pengalaman';
  let modalTitle = '';
  let modalBody = '';
  let composeText = '';
  let joinedGroups = new Set(['Mindfulness Daily', 'Daily Motivation']);
  let repliesOpen = new Set();
  let isLoadingMore = false;

  const tabs = [
    { id: 'semua', label: '🏠 Semua' },
    { id: 'trending', label: '🔥 Trending' },
    { id: 'kecemasan', label: '😰 Kecemasan' },
    { id: 'depresi', label: '💙 Depresi' },
    { id: 'motivasi', label: '✨ Motivasi' },
    { id: 'tips', label: '💡 Tips' }
  ];

  const categories = ['🌱 Cerita & Pengalaman', '💡 Tips & Strategi', '💬 Butuh Dukungan', '✨ Motivasi', '❓ Tanya Jawab'];

  let posts = [
    {
      id: 1, author: 'Rania Aulia', username: '@rania_a', time: '2 jam lalu', joined: 'Bergabung 2 tahun',
      initials: 'RA', avatarTheme: 'sage', badge: 'Moderator', badgeTheme: 'sage',
      category: '🌱 Cerita & Pengalaman', categoryTheme: 'sage',
      title: 'Akhirnya berani konsultasi setelah menunda hampir setahun',
      text: 'Aku cuma mau berbagi sedikit kemenangan hari ini. Setelah lama takut dan merasa masalahku tidak cukup penting, akhirnya aku booking sesi konseling pertama. Ternyata rasanya lega sekali setelah cerita ke orang yang tepat. Buat teman-teman yang masih ragu, tidak apa-apa mulai pelan-pelan.',
      image: '🌿', tags: ['#konseling', '#langkahpertama', '#berbagi'],
      likes: 47, comments: 12, liked: true, tab: 'kecemasan',
      replies: [
        { initials: 'DB', avatarTheme: 'sky', name: 'Dimas Bima', text: 'Bangga banget sama langkahmu. Kadang memulai memang bagian paling berat.', time: '1 jam lalu' }
      ]
    },
    {
      id: 2, author: 'Sari Susanti', username: '@sari_s', time: '5 jam lalu', joined: 'Bergabung 8 bulan',
      initials: 'SS', avatarTheme: 'lavender', badge: 'Kontributor', badgeTheme: 'lavender',
      category: '💡 Tips & Strategi', categoryTheme: 'lavender',
      title: 'Teknik grounding 5-4-3-2-1 yang menyelamatkan aku saat panic attack',
      text: 'Waktu panic attack datang, dunia terasa spinning. Teknik ini simpel tapi powerful banget: sebutkan 5 hal yang kamu lihat, 4 yang bisa kamu sentuh, 3 yang kamu dengar, 2 yang bisa kamu cium, 1 yang bisa kamu rasakan. Latihan ini langsung membawa kesadaranmu ke momen sekarang.',
      tags: ['#grounding', '#panicattack', '#anxietytips', '#kesehatanmental'],
      likes: 83, comments: 24, liked: false, tab: 'tips', replies: []
    },
    {
      id: 3, author: 'Mira Rahayu', username: '@mira_r', time: 'Kemarin', joined: 'Bergabung 1 bulan',
      initials: 'MR', avatarTheme: 'blush', badge: 'Anggota Baru', badgeTheme: 'blush',
      category: '💬 Butuh Dukungan', categoryTheme: 'blush',
      title: 'Hari ini sangat berat. Apakah ada yang pernah merasa seperti ini?',
      text: 'Aku nggak tahu harus mulai dari mana. Sudah seminggu ini aku susah banget keluar dari tempat tidur. Pekerjaan menumpuk, tapi aku nggak punya energi sama sekali. Rasanya seperti mau tenggelam. Mungkin ada yang pernah merasakan hal serupa dan bisa berbagi.',
      tags: ['#butuhdukungan', '#kelelahan', '#burnout'],
      likes: 61, comments: 17, liked: false, tab: 'depresi',
      replies: [
        { initials: 'RA', avatarTheme: 'sage', name: 'Rania Aulia', text: 'Pernah banget Mira 🤗 Kamu nggak sendirian. Semua orang di sini ada buat support kamu.', time: '23 jam lalu' },
        { initials: 'SS', avatarTheme: 'lavender', name: 'Sari Susanti', text: 'Langkah pertama yang berani dengan berbagi di sini. Kami semua di sini bersamamu 💙', time: '22 jam lalu' }
      ]
    },
    {
      id: 4, author: 'Bagas Hermawan', username: '@bagas_h', time: '2 hari lalu', joined: 'Bergabung 5 bulan',
      initials: 'BH', avatarTheme: 'amber', badge: 'Top Kontributor', badgeTheme: 'amber',
      category: '✨ Motivasi & Inspirasi', categoryTheme: 'amber',
      title: 'Kamu tidak harus baik-baik saja untuk memulai hari ini',
      text: 'Seringkali kita nunggu sampai siap atau lebih baik dulu sebelum melakukan sesuatu. Tapi pemulihan jarang bekerja seperti itu. Kadang langkah terkecil, bangun tidur, minum air, buka jendela, itu sudah luar biasa. Jangan bandingkan progresmu dengan orang lain.',
      tags: ['#motivasi', '#selfcompassion', '#recovery', '#smallsteps'],
      likes: 142, comments: 38, liked: false, tab: 'motivasi', replies: []
    }
  ];

  const trendingTopics = [
    ['#meditasi', 'Trending · 284 post', '🔥 Hot'],
    ['#anxietytips', '↑ Naik · 156 post', '↑ Baru'],
    ['#selfcare', 'Stabil · 203 post', '· · ·'],
    ['#burnout', '↑ Naik · 98 post', '↑ Baru'],
    ['#recovery', 'Stabil · 177 post', '· · ·']
  ];

  const members = [
    ['RA', 'Rania', 'sage'], ['SS', 'Sari', 'lavender'], ['DB', 'Dimas', 'sky'],
    ['BH', 'Bagas', 'amber'], ['FN', 'Fira', 'blush'], ['AK', 'Andi', 'moss']
  ];

  const groups = [
    ['Mindfulness Daily', '1.2K anggota', '🧘', 'sage'],
    ['Anxiety Support', '3.4K anggota', '💙', 'blush'],
    ['Better Sleep Club', '876 anggota', '🌙', 'lavender'],
    ['Daily Motivation', '2.1K anggota', '✨', 'amber']
  ];

  $: visiblePosts = activeTab === 'semua' || activeTab === 'trending' ? posts : posts.filter((post) => post.tab === activeTab);

  const categoryMap = { kecemasan: 1, depresi: 2, motivasi: 3, tips: 4 };
  const categoryLabels = { 1: '😰 Kecemasan', 2: '💙 Depresi', 3: '✨ Motivasi & Inspirasi', 4: '💡 Tips & Strategi' };
  const categoryThemes = { 1: 'blush', 2: 'sky', 3: 'amber', 4: 'lavender' };
  const avatarThemeList = ['sage', 'lavender', 'blush', 'amber', 'sky'];

  function getInitials(name = 'MP') {
    return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  }

  function formatRelativeDate(dateValue) {
    if (!dateValue) return 'Baru saja';
    const diffMs = Date.now() - new Date(dateValue).getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? 'Kemarin' : `${diffDays} hari lalu`;
  }

  function mapPost(post, index) {
    const user = post.user ?? {};
    const categoryId = post.category_id ?? null;
    const likes = Array.isArray(post.likes) ? post.likes.length : post.likes_count ?? 0;
    const comments = Array.isArray(post.comments) ? post.comments : [];
    const tab = Object.entries(categoryMap).find((entry) => entry[1] === categoryId)?.[0] ?? 'semua';
    
    return {
      id: post.id,
      author: user.name ?? 'Pengguna MindPal',
      username: user.email ? `@${user.email.split('@')[0]}` : '@mindpal',
      time: formatRelativeDate(post.created_at),
      joined: 'Anggota',
      initials: getInitials(user.name ?? 'MindPal'),
      avatarTheme: avatarThemeList[index % 5],
      badge: index === 0 ? 'Baru' : 'Anggota',
      badgeTheme: index === 0 ? 'sky' : 'sage',
      category: categoryLabels[categoryId] ?? '🌱 Cerita & Pengalaman',
      categoryTheme: categoryThemes[categoryId] ?? 'sage',
      title: post.title,
      text: post.content,
      tags: ['#mindpal', '#komunitas'],
      likes,
      comments: comments.length,
      liked: false,
      tab,
      replies: comments.slice(0, 2).map((comment, replyIndex) => ({
        initials: getInitials(comment.user?.name ?? 'MP'),
        avatarTheme: ['sage', 'lavender', 'sky'][replyIndex % 3],
        name: comment.user?.name ?? 'Pengguna MindPal',
        text: comment.content,
        time: formatRelativeDate(comment.created_at)
      }))
    };
  }

  async function loadPosts(category = activeTab) {
    isLoadingPosts = true;
    try {
      const categoryParam = categoryMap[category] ?? category;
      const responsePosts = await getPosts(categoryParam);
      if (Array.isArray(responsePosts)) {
        posts = responsePosts.map(mapPost);
      }
    } finally {
      isLoadingPosts = false;
    }
  }

  async function selectTab(tab) {
    activeTab = tab;
    await loadPosts(tab);
  }

  async function toggleLike(id) {
    const current = posts.find((post) => post.id === id);
    if (!current) return;
    posts = posts.map((post) => {
      if (post.id !== id) return post;
      const liked = !post.liked;
      return { ...post, liked, likes: liked ? post.likes + 1 : post.likes - 1 };
    });
    try {
      await togglePostLike(id);
    } catch (error) {
      posts = posts.map((post) => post.id === id ? current : post);
    }
  }

  function toggleReplies(id) {
    const next = new Set(repliesOpen);
    if (next.has(id)) { next.delete(id); } else { next.add(id); }
    repliesOpen = next;
  }

  function joinGroup(name) {
    const next = new Set(joinedGroups);
    next.add(name);
    joinedGroups = next;
  }

  function openModal() { isModalOpen = true; }
  function closeModal() { isModalOpen = false; }

  function getSelectedCategoryId() {
    if (selectedCategory.includes('Tips')) return 4;
    if (selectedCategory.includes('Dukungan')) return 2;
    if (selectedCategory.includes('Motivasi')) return 3;
    if (selectedCategory.includes('Tanya')) return 1;
    return null;
  }

  async function publishPost() {
    const cleanTitle = modalTitle.trim() || 'Postingan Baru';
    const cleanBody = modalBody.trim() || 'Kamu baru saja berbagi sesuatu yang berarti 🌿';
    isPublishing = true;
    try {
      await createPost({ title: cleanTitle, content: cleanBody, category_id: getSelectedCategoryId() });
      modalTitle = '';
      modalBody = '';
      closeModal();
      await loadPosts(activeTab);
    } finally {
      isPublishing = false;
    }
  }

  async function publishCompose() {
    if (!composeText.trim()) {
      openModal();
      return;
    }
    modalTitle = 'Cerita singkat dari Arif';
    modalBody = composeText;
    await publishPost();
    composeText = '';
  }

  function loadMore() {
    isLoadingMore = true;
    setTimeout(() => {
      posts = [
        ...posts,
        {
          id: Date.now(), author: 'Dika Kurnia', username: '@dika_k', time: '3 hari lalu', joined: 'Bergabung 6 bulan',
          initials: 'DK', avatarTheme: 'sky', badge: 'Kontributor', badgeTheme: 'sky',
          category: '💡 Tips & Strategi', categoryTheme: 'sky',
          title: 'Journaling 10 menit sehari, cara terbaik kenali dirimu sendiri',
          text: 'Aku mulai journaling 6 bulan lalu dan ini jadi salah satu kebiasaan terbaik yang pernah aku adopsi. Tidak perlu panjang, cukup tulis apa yang kamu rasakan, apa yang membuatmu bersyukur, dan satu langkah kecil untuk besok.',
          tags: ['#journaling', '#selfawareness', '#kebiasaanbaik'],
          likes: 95, comments: 21, liked: false, tab: 'tips', replies: []
        }
      ];
      isLoadingMore = false;
    }, 600);
  }

  onMount(() => loadPosts('semua'));
</script>

<Sidebar />

<main class="layout-main">
  <section class="content-section">
    <div class="page-header">
      <div>
        <h1 class="page-title">Komunitas MindPal 🌿</h1>
        <p class="page-subtitle">Ruang aman untuk berbagi, mendengar, dan saling mendukung.</p>
      </div>
      <button class="btn-primary" on:click={openModal}>✏️ Buat Postingan</button>
    </div>

    <div class="hero-banner">
      <div class="banner-circle circle-1"></div>
      <div class="banner-circle circle-2"></div>
      <div class="banner-content">
        <h2 class="banner-title">Kamu tidak sendirian di sini 💙</h2>
        <p class="banner-desc">Bergabunglah dengan ribuan anggota yang saling berbagi cerita dan dukungan setiap hari.</p>
      </div>
      <div class="banner-stats">
        {#each [['12.4K', 'Anggota aktif'], ['284', 'Post minggu ini'], ['97%', 'Merasa didukung']] as stat}
          <div class="stat-item">
            <div class="stat-value">{stat[0]}</div>
            <div class="stat-label">{stat[1]}</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="tabs-container">
      {#each tabs as tab}
        <button class="tab-btn" class:active={activeTab === tab.id} on:click={() => selectTab(tab.id)}>
          {tab.label}
        </button>
      {/each}
    </div>

    <div class="compose-box">
      <div class="compose-input-area">
        <div class="avatar avatar-sage">AR</div>
        <textarea class="compose-textarea" bind:value={composeText} placeholder="Apa yang ingin kamu bagikan hari ini?"></textarea>
      </div>
      <div class="compose-actions">
        <div class="action-tools">
          {#each ['🖼️ Foto', '🏷️ Tag', '😊 Mood'] as tool}
            <button class="tool-btn">{tool}</button>
          {/each}
        </div>
        <button class="btn-post" on:click={publishCompose}>Posting</button>
      </div>
    </div>

    {#if isLoadingPosts}
      <div class="loading-state">Memuat postingan...</div>
    {/if}

    <div class="post-list">
      {#each visiblePosts as post}
        <article class="post-card">
          <div class="post-header">
            <div class="avatar avatar-{post.avatarTheme}">{post.initials}</div>
            <div class="post-meta">
              <div class="post-author">{post.author} <span>· {post.username}</span></div>
              <div class="post-time">{post.time} · {post.joined}</div>
            </div>
            <span class="badge tag-{post.badgeTheme}">{post.badge}</span>
          </div>

          <div class="post-category tag-{post.categoryTheme}">{post.category}</div>
          <h2 class="post-title">{post.title}</h2>
          <p class="post-text">{post.text}</p>

          {#if post.image}
            <div class="post-image">{post.image}</div>
          {/if}

          <div class="post-tags">
            {#each post.tags as tag}
              <span class="hashtag">{tag}</span>
            {/each}
          </div>

          {#if post.replies.length > 0}
            <div class="post-replies">
              {#each post.replies.slice(0, repliesOpen.has(post.id) ? post.replies.length : 1) as reply}
                <div class="reply-item">
                  <div class="avatar avatar-small avatar-{reply.avatarTheme}">{reply.initials}</div>
                  <div class="reply-bubble">
                    <div class="reply-name">{reply.name}</div>
                    <div class="reply-text">{reply.text}</div>
                    <div class="reply-time">{reply.time}</div>
                  </div>
                </div>
              {/each}
              {#if post.replies.length > 1}
                <button class="btn-toggle-replies" on:click={() => toggleReplies(post.id)}>
                  {repliesOpen.has(post.id) ? '← Sembunyikan' : `Lihat ${post.replies.length - 1} balasan lainnya →`}
                </button>
              {/if}
            </div>
          {/if}

          <div class="post-footer">
            <button class="btn-action" class:liked={post.liked} on:click={() => toggleLike(post.id)}>
              {post.liked ? '❤️' : '🤍'} <span>{post.likes}</span>
            </button>
            <div class="divider"></div>
            <button class="btn-action">💬 {post.comments} Komentar</button>
            <div class="divider"></div>
            <button class="btn-action">🔖 Simpan</button>
            <button class="btn-action btn-share">↗ Bagikan</button>
          </div>
        </article>
      {/each}
    </div>

    <div class="load-more-container">
      <button class="btn-load-more" on:click={loadMore} disabled={isLoadingMore}>
        {isLoadingMore ? 'Memuat...' : 'Muat lebih banyak'}
      </button>
    </div>
  </section>

  <aside class="sidebar">
    <div class="sidebar-widget">
      <h3 class="widget-title">🔥 Topik Trending</h3>
      <div class="widget-list">
        {#each trendingTopics as topic, index}
          <div class="trending-item">
            <div class="trending-rank">{index + 1}</div>
            <div class="trending-info">
              <h4>{topic[0]}</h4>
              <p>{topic[1]}</p>
            </div>
            <span class="trending-badge">{topic[2]}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="sidebar-widget">
      <h3 class="widget-title">🟢 Anggota Online <span>(24 orang)</span></h3>
      <div class="online-members">
        {#each members as member}
          <div class="member-chip">
            <div class="avatar avatar-tiny avatar-{member[2]}">{member[0]}</div>
            <span>{member[1]}</span>
          </div>
        {/each}
      </div>
      <div class="online-more">+18 anggota lainnya online</div>
    </div>

    <div class="sidebar-widget">
      <h3 class="widget-title">👥 Grup Komunitas</h3>
      <div class="widget-list">
        {#each groups as group}
          <div class="group-item">
            <div class="group-icon icon-{group[3]}">{group[2]}</div>
            <div class="group-info">
              <h4>{group[0]}</h4>
              <p>{group[1]}</p>
            </div>
            <button class="btn-join" class:joined={joinedGroups.has(group[0])} on:click={() => joinGroup(group[0])}>
              {joinedGroups.has(group[0]) ? '✓ Joined' : '+ Gabung'}
            </button>
          </div>
        {/each}
      </div>
    </div>

    <div class="sidebar-widget widget-guidelines">
      <h3 class="widget-title">📋 Panduan Komunitas</h3>
      <div class="guideline-list">
        {#each ['🤝 Saling menghormati dan berempati', '🔒 Jaga privasi orang lain', '💙 Tidak ada penilaian di sini', '🚫 Hindari saran medis tanpa dasar'] as guide}
          <div class="guideline-item">{guide}</div>
        {/each}
      </div>
    </div>
  </aside>
</main>

{#if isModalOpen}
  <div class="modal-overlay">
    <button class="modal-backdrop" type="button" aria-label="Tutup modal" on:click={closeModal}></button>
    <section class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">✏️ Buat Postingan Baru</h2>
        <button class="btn-close" on:click={closeModal}>✕</button>
      </div>

      <div class="modal-user-info">
        <div class="avatar avatar-sage">AR</div>
        <div>
          <div class="modal-user-name">Arif R.</div>
          <div class="modal-user-desc">Posting ke Komunitas MindPal</div>
        </div>
      </div>

      <div class="category-select-label">Pilih kategori:</div>
      <div class="category-select-list">
        {#each categories as category}
          <button class="btn-category" class:active={selectedCategory === category} on:click={() => selectedCategory = category}>
            {category}
          </button>
        {/each}
      </div>

      <input class="input-title" bind:value={modalTitle} type="text" placeholder="Judul postinganmu..." />
      <textarea class="input-body" bind:value={modalBody} rows="5" placeholder="Ceritakan pengalamanmu, atau tulis apa yang ada di pikiranmu. Ingat, ruang ini aman dan bebas penilaian 🌿"></textarea>

      <div class="modal-footer">
        <div class="modal-tools">
          {#each ['🖼️', '🏷️', '😊'] as tool}
            <button class="btn-tool">{tool}</button>
          {/each}
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" on:click={closeModal}>Batal</button>
          <button class="btn-submit" disabled={isPublishing} on:click={publishPost}>
            {isPublishing ? 'Menerbitkan...' : 'Publikasikan 🌿'}
          </button>
        </div>
      </div>
    </section>
  </div>
{/if}

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
    display: flex;
    background-color: var(--cream);
    color: var(--text-dark);
    font-family: 'DM Sans', sans-serif;
  }

  .content-section {
    flex: 1;
    min-width: 0;
    padding: 2rem 1.75rem;
  }

  .sidebar {
    width: 280px;
    flex-shrink: 0;
    padding: 2rem 1.25rem 2rem 0;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-family: 'Lora', serif;
    font-size: 1.55rem;
    font-weight: 600;
    margin: 0;
  }

  .page-subtitle {
    font-size: 0.84rem;
    color: var(--text-soft);
    margin: 2px 0 0 0;
  }

  .btn-primary {
    background: var(--moss);
    color: white;
    padding: 0.65rem 1.3rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 7px;
    transition: all 0.2s;
  }

  .btn-primary:hover { background: var(--sage-dark); transform: translateY(-1px); }

  .hero-banner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to bottom right, var(--sky-dark), var(--lavender-dark));
    border-radius: 20px;
    padding: 1.5rem 1.75rem;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .banner-circle { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.1); }
  .circle-1 { width: 180px; height: 180px; right: -40px; top: -40px; }
  .circle-2 { width: 130px; height: 130px; right: 80px; bottom: -60px; background: rgba(255,255,255,0.05); }

  .banner-content, .banner-stats { position: relative; z-index: 10; }
  
  .banner-title {
    font-family: 'Lora', serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: white;
    margin: 0 0 4px 0;
  }

  .banner-desc {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
    max-width: 340px;
    margin: 0;
  }

  .banner-stats { display: flex; gap: 1.5rem; }
  .stat-item { text-align: center; }
  .stat-value { font-family: 'Lora', serif; font-size: 1.4rem; font-weight: 600; color: white; line-height: 1; }
  .stat-label { font-size: 0.7rem; color: rgba(255,255,255,0.65); margin-top: 2px; }

  .tabs-container {
    display: flex;
    gap: 0.35rem;
    background: white;
    border: 1px solid var(--sand);
    border-radius: 14px;
    padding: 0.35rem;
    margin-bottom: 1.25rem;
  }

  .tab-btn {
    flex: 1;
    padding: 0.5rem;
    border-radius: 10px;
    font-size: 0.82rem;
    color: var(--text-soft);
    text-align: center;
    transition: all 0.2s;
  }

  .tab-btn:hover { background: var(--cream); }
  .tab-btn.active { background: var(--sky-light); color: var(--sky-dark); font-weight: 500; }

  .compose-box {
    background: white;
    border: 1.5px solid var(--sand);
    border-radius: 18px;
    padding: 1.1rem 1.25rem;
    margin-bottom: 1.25rem;
    transition: border-color 0.2s;
  }

  .compose-box:focus-within { border-color: var(--sky-dark); }

  .compose-input-area { display: flex; align-items: flex-start; gap: 0.85rem; margin-bottom: 0.85rem; }
  
  .compose-textarea {
    flex: 1;
    min-height: 52px;
    background: transparent;
    border: none;
    resize: none;
    font-family: inherit;
    font-size: 0.88rem;
    line-height: 1.55;
    color: var(--text-dark);
    outline: none;
  }

  .compose-textarea::placeholder { color: var(--text-soft); }

  .compose-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--sand);
  }

  .action-tools { display: flex; gap: 0.5rem; }
  .tool-btn { padding: 0.3rem 0.65rem; border-radius: 8px; font-size: 0.76rem; color: var(--text-soft); transition: all 0.2s; }
  .tool-btn:hover { background: var(--cream); color: var(--text-dark); }

  .btn-post {
    margin-left: auto;
    background: var(--sky-dark);
    color: white;
    padding: 0.48rem 1.1rem;
    border-radius: 9999px;
    font-size: 0.8rem;
    font-weight: 500;
    transition: background 0.2s;
  }

  .btn-post:hover { background: var(--moss); }

  .loading-state {
    text-align: center;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid var(--sand);
    border-radius: 9999px;
    font-size: 0.8rem;
    color: var(--text-soft);
    margin-bottom: 1rem;
  }

  .post-list { display: flex; flex-direction: column; gap: 0.9rem; }

  .post-card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 18px;
    padding: 1.2rem 1.3rem;
    transition: all 0.2s;
  }

  .post-card:hover { border-color: var(--sky-dark); transform: translateY(-2px); }

  .post-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.85rem; }
  
  .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: white;
    font-weight: 500;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    font-size: 0.75rem;
  }

  .avatar-tiny { width: 22px; height: 22px; font-size: 0.55rem; }
  .avatar-small { width: 28px; height: 28px; font-size: 0.62rem; }

  .avatar-sage { background: var(--sage-dark); }
  .avatar-lavender { background: var(--lavender-dark); }
  .avatar-blush { background: var(--blush-dark); }
  .avatar-amber { background: var(--amber-dark); }
  .avatar-sky { background: var(--sky-dark); }
  .avatar-moss { background: var(--moss); }

  .post-meta { flex: 1; }
  .post-author { font-size: 0.86rem; font-weight: 500; }
  .post-author span { font-weight: normal; color: var(--text-soft); }
  .post-time { font-size: 0.72rem; color: var(--text-soft); margin-top: 1px; }

  .badge {
    padding: 0.2rem 0.7rem;
    border-radius: 9999px;
    font-size: 0.66rem;
    font-weight: 500;
  }

  .post-category {
    display: inline-flex;
    align-items: center;
    padding: 0.22rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid transparent;
    font-size: 0.7rem;
    font-weight: 500;
    margin-bottom: 0.6rem;
  }

  .tag-sage { background: var(--sage-light); color: var(--moss); border-color: var(--sage-dark); }
  .tag-lavender { background: var(--lavender-light); color: var(--lavender-dark); border-color: var(--lavender-dark); }
  .tag-blush { background: var(--blush-light); color: var(--blush-dark); border-color: var(--blush-dark); }
  .tag-amber { background: var(--amber-light); color: var(--amber-dark); border-color: var(--amber-dark); }
  .tag-sky { background: var(--sky-light); color: var(--sky-dark); border-color: var(--sky-dark); }

  .post-title {
    font-family: 'Lora', serif;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.35;
    margin: 0 0 0.5rem 0;
    cursor: pointer;
    transition: color 0.2s;
  }

  .post-title:hover { color: var(--sky-dark); }

  .post-text {
    font-size: 0.84rem;
    line-height: 1.65;
    color: var(--text-mid);
    margin: 0 0 0.85rem 0;
  }

  .post-image {
    height: 160px;
    width: 100%;
    background: linear-gradient(to bottom right, var(--sage-light), var(--sky-light));
    border: 1px solid var(--sand);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin-bottom: 0.85rem;
  }

  .post-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.85rem; }
  
  .hashtag {
    background: var(--cream);
    border: 1px solid var(--sand);
    padding: 0.22rem 0.65rem;
    border-radius: 9999px;
    font-size: 0.68rem;
    color: var(--text-soft);
    transition: all 0.2s;
  }

  .hashtag:hover { border-color: var(--sky-dark); background: var(--sky-light); color: var(--sky-dark); }

  .post-replies {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--sand);
  }

  .reply-item { display: flex; gap: 0.65rem; margin-bottom: 0.65rem; }
  
  .reply-bubble {
    flex: 1;
    background: var(--cream);
    border: 1px solid var(--sand);
    border-radius: 0 12px 12px 12px;
    padding: 0.55rem 0.8rem;
  }

  .reply-name { font-size: 0.72rem; font-weight: 500; margin-bottom: 2px; }
  .reply-text { font-size: 0.78rem; line-height: 1.5; color: var(--text-mid); }
  .reply-time { font-size: 0.65rem; color: var(--text-soft); margin-top: 3px; }

  .btn-toggle-replies {
    margin-left: 34px;
    font-size: 0.76rem;
    color: var(--sky-dark);
    transition: opacity 0.2s;
  }

  .btn-toggle-replies:hover { opacity: 0.7; }

  .post-footer {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--sand);
  }

  .btn-action {
    padding: 0.38rem 0.7rem;
    border-radius: 9px;
    font-size: 0.76rem;
    color: var(--text-soft);
    transition: all 0.2s;
  }

  .btn-action:hover { background: var(--cream); color: var(--text-dark); }
  .btn-action.liked { color: var(--blush-dark); }
  .btn-action.liked:hover { background: var(--blush-light); }

  .divider { width: 1px; height: 18px; background: var(--sand); margin: 0 0.2rem; }
  .btn-share { margin-left: auto; }

  .load-more-container { text-align: center; padding: 1.25rem 0; }
  
  .btn-load-more {
    background: white;
    border: 1.5px solid var(--sand);
    padding: 0.65rem 1.75rem;
    border-radius: 9999px;
    font-size: 0.85rem;
    color: var(--text-mid);
    transition: all 0.2s;
  }

  .btn-load-more:hover:not(:disabled) { border-color: var(--sky-dark); color: var(--sky-dark); }
  .btn-load-more:disabled { opacity: 0.6; cursor: not-allowed; }

  .sidebar-widget {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 16px;
    padding: 1.1rem 1.2rem;
    margin-bottom: 1rem;
  }

  .widget-title { font-size: 0.84rem; font-weight: 500; margin: 0 0 0.9rem 0; display: flex; align-items: center; gap: 6px; }
  .widget-title span { font-size: 0.7rem; font-weight: normal; color: var(--text-soft); }

  .widget-list { display: flex; flex-direction: column; gap: 0.5rem; }

  .trending-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.55rem 0.65rem;
    border-radius: 11px;
    transition: background 0.2s;
  }

  .trending-item:hover { background: var(--cream); }
  .trending-rank { width: 18px; text-align: center; font-family: 'Lora', serif; font-size: 0.85rem; font-weight: 600; color: var(--sand-dark); flex-shrink: 0; }
  .trending-info h4 { font-size: 0.8rem; font-weight: 500; margin: 0; }
  .trending-info p { font-size: 0.68rem; color: var(--text-soft); margin: 1px 0 0 0; }
  .trending-badge { margin-left: auto; background: var(--cream); border: 1px solid var(--sand); padding: 0.2rem 0.6rem; border-radius: 9999px; font-size: 0.68rem; color: var(--text-soft); }

  .online-members { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
  .member-chip {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    background: var(--cream);
    border: 1px solid var(--sand);
    padding: 0.3rem 0.7rem 0.3rem 0.3rem;
    border-radius: 9999px;
  }
  .member-chip span { font-size: 0.72rem; color: var(--text-mid); }
  .online-more { font-size: 0.74rem; color: var(--text-soft); }

  .group-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.65rem;
    border: 1px solid transparent;
    border-radius: 11px;
    transition: all 0.2s;
  }

  .group-item:hover { border-color: var(--sand); background: var(--cream); }
  
  .group-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  .icon-sage { background: var(--sage-light); }
  .icon-blush { background: var(--blush-light); }
  .icon-lavender { background: var(--lavender-light); }
  .icon-amber { background: var(--amber-light); }

  .group-info h4 { font-size: 0.8rem; font-weight: 500; margin: 0; }
  .group-info p { font-size: 0.68rem; color: var(--text-soft); margin: 1px 0 0 0; }

  .btn-join {
    margin-left: auto;
    border: 1.5px solid var(--sky-dark);
    color: var(--sky-dark);
    padding: 0.25rem 0.7rem;
    border-radius: 9999px;
    font-size: 0.68rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-join:hover { background: var(--sky-light); }
  .btn-join.joined { border-color: var(--sage-dark); background: var(--sage-light); color: var(--moss); }

  .widget-guidelines { background: var(--sage-light); border-color: var(--sage-dark); }
  .guideline-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .guideline-item { font-size: 0.77rem; color: var(--text-mid); display: flex; align-items: flex-start; gap: 0.5rem; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(3px);
    width: 100%;
    height: 100%;
  }

  .modal-content {
    position: relative;
    z-index: 10;
    width: 560px;
    max-width: 94vw;
    background: white;
    border-radius: 22px;
    padding: 1.75rem;
    box-shadow: 0 24px 80px rgba(45,42,38,0.22);
  }

  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .modal-title { font-family: 'Lora', serif; font-size: 1.05rem; font-weight: 600; margin: 0; }
  .btn-close { width: 30px; height: 30px; border-radius: 50%; background: var(--cream); border: 1px solid var(--sand); font-size: 0.9rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .btn-close:hover { background: var(--sand); }

  .modal-user-info { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 1rem; }
  .modal-user-name { font-size: 0.85rem; font-weight: 500; }
  .modal-user-desc { font-size: 0.72rem; color: var(--text-soft); }

  .category-select-label { font-size: 0.76rem; color: var(--text-soft); margin-bottom: 0.5rem; }
  .category-select-list { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem; }
  
  .btn-category {
    border: 1.5px solid var(--sand);
    padding: 0.3rem 0.8rem;
    border-radius: 9999px;
    font-size: 0.73rem;
    color: var(--text-soft);
    transition: all 0.2s;
  }

  .btn-category:hover { background: var(--cream); }
  .btn-category.active { border-color: var(--sky-dark); background: var(--sky-light); color: var(--sky-dark); }

  .input-title, .input-body {
    width: 100%;
    border: 1.5px solid var(--sand);
    border-radius: 12px;
    padding: 0.7rem 1rem;
    color: var(--text-dark);
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 0.75rem;
    font-family: inherit;
  }

  .input-title { font-family: 'Lora', serif; font-size: 1rem; font-weight: 500; }
  .input-title::placeholder { font-family: 'DM Sans', sans-serif; font-weight: normal; font-size: 0.9rem; color: var(--text-soft); }
  .input-body { resize: none; font-size: 0.86rem; line-height: 1.6; }
  .input-body::placeholder { color: var(--text-soft); }
  
  .input-title:focus, .input-body:focus { border-color: var(--sky-dark); }

  .modal-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem; }
  .modal-tools { display: flex; gap: 0.4rem; }
  .btn-tool { width: 32px; height: 32px; border: 1.5px solid var(--sand); background: var(--cream); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 0.88rem; transition: all 0.2s; }
  .btn-tool:hover { border-color: var(--sky-dark); background: var(--sky-light); }

  .modal-actions { display: flex; gap: 0.6rem; }
  .btn-cancel { border: 1.5px solid var(--sand); padding: 0.55rem 1.1rem; border-radius: 9999px; font-size: 0.83rem; color: var(--text-mid); transition: border-color 0.2s; }
  .btn-cancel:hover { border-color: var(--sand-dark); }
  
  .btn-submit { background: var(--moss); color: white; padding: 0.55rem 1.3rem; border-radius: 9999px; font-size: 0.83rem; font-weight: 500; transition: background 0.2s; }
  .btn-submit:hover:not(:disabled) { background: var(--sage-dark); }
  .btn-submit:disabled { background: var(--sand-dark); cursor: not-allowed; }
</style>