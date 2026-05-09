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
      id: 1,
      author: 'Rania Aulia',
      username: '@rania_a',
      time: '2 jam lalu',
      joined: 'Bergabung 2 tahun',
      initials: 'RA',
      avatarClass: 'bg-sage-dark',
      badge: 'Moderator',
      badgeClass: 'bg-sage-light text-moss',
      category: '🌱 Cerita & Pengalaman',
      categoryClass: 'bg-sage-light text-moss border-sage',
      title: 'Akhirnya berani konsultasi setelah menunda hampir setahun',
      text: 'Aku cuma mau berbagi sedikit kemenangan hari ini. Setelah lama takut dan merasa masalahku tidak cukup penting, akhirnya aku booking sesi konseling pertama. Ternyata rasanya lega sekali setelah cerita ke orang yang tepat. Buat teman-teman yang masih ragu, tidak apa-apa mulai pelan-pelan.',
      image: '🌿',
      tags: ['#konseling', '#langkahpertama', '#berbagi'],
      likes: 47,
      comments: 12,
      liked: true,
      tab: 'kecemasan',
      replies: [
        { initials: 'DB', avatarClass: 'bg-sky-dark', name: 'Dimas Bima', text: 'Bangga banget sama langkahmu. Kadang memulai memang bagian paling berat.', time: '1 jam lalu' }
      ]
    },
    {
      id: 2,
      author: 'Sari Susanti',
      username: '@sari_s',
      time: '5 jam lalu',
      joined: 'Bergabung 8 bulan',
      initials: 'SS',
      avatarClass: 'bg-lavender-dark',
      badge: 'Kontributor',
      badgeClass: 'bg-lavender-light text-lavender-dark',
      category: '💡 Tips & Strategi',
      categoryClass: 'bg-lavender-light text-lavender-dark border-lavender',
      title: 'Teknik grounding 5-4-3-2-1 yang menyelamatkan aku saat panic attack',
      text: 'Waktu panic attack datang, dunia terasa spinning. Teknik ini simpel tapi powerful banget: sebutkan 5 hal yang kamu lihat, 4 yang bisa kamu sentuh, 3 yang kamu dengar, 2 yang bisa kamu cium, 1 yang bisa kamu rasakan. Latihan ini langsung membawa kesadaranmu ke momen sekarang.',
      tags: ['#grounding', '#panicattack', '#anxietytips', '#kesehatanmental'],
      likes: 83,
      comments: 24,
      liked: false,
      tab: 'tips',
      replies: []
    },
    {
      id: 3,
      author: 'Mira Rahayu',
      username: '@mira_r',
      time: 'Kemarin',
      joined: 'Bergabung 1 bulan',
      initials: 'MR',
      avatarClass: 'bg-blush-dark',
      badge: 'Anggota Baru',
      badgeClass: 'bg-blush-light text-blush-dark',
      category: '💬 Butuh Dukungan',
      categoryClass: 'bg-blush-light text-blush-dark border-blush',
      title: 'Hari ini sangat berat. Apakah ada yang pernah merasa seperti ini?',
      text: 'Aku nggak tahu harus mulai dari mana. Sudah seminggu ini aku susah banget keluar dari tempat tidur. Pekerjaan menumpuk, tapi aku nggak punya energi sama sekali. Rasanya seperti mau tenggelam. Mungkin ada yang pernah merasakan hal serupa dan bisa berbagi.',
      tags: ['#butuhdukungan', '#kelelahan', '#burnout'],
      likes: 61,
      comments: 17,
      liked: false,
      tab: 'depresi',
      replies: [
        { initials: 'RA', avatarClass: 'bg-sage-dark', name: 'Rania Aulia', text: 'Pernah banget Mira 🤗 Kamu nggak sendirian. Semua orang di sini ada buat support kamu.', time: '23 jam lalu' },
        { initials: 'SS', avatarClass: 'bg-lavender-dark', name: 'Sari Susanti', text: 'Langkah pertama yang berani dengan berbagi di sini. Kami semua di sini bersamamu 💙', time: '22 jam lalu' }
      ]
    },
    {
      id: 4,
      author: 'Bagas Hermawan',
      username: '@bagas_h',
      time: '2 hari lalu',
      joined: 'Bergabung 5 bulan',
      initials: 'BH',
      avatarClass: 'bg-amber-dark',
      badge: 'Top Kontributor',
      badgeClass: 'bg-amber-light text-amber-dark',
      category: '✨ Motivasi & Inspirasi',
      categoryClass: 'bg-amber-light text-amber-dark border-amber',
      title: 'Kamu tidak harus baik-baik saja untuk memulai hari ini',
      text: 'Seringkali kita nunggu sampai siap atau lebih baik dulu sebelum melakukan sesuatu. Tapi pemulihan jarang bekerja seperti itu. Kadang langkah terkecil, bangun tidur, minum air, buka jendela, itu sudah luar biasa. Jangan bandingkan progresmu dengan orang lain.',
      tags: ['#motivasi', '#selfcompassion', '#recovery', '#smallsteps'],
      likes: 142,
      comments: 38,
      liked: false,
      tab: 'motivasi',
      replies: []
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
    ['RA', 'Rania', 'bg-sage-dark'],
    ['SS', 'Sari', 'bg-lavender-dark'],
    ['DB', 'Dimas', 'bg-sky-dark'],
    ['BH', 'Bagas', 'bg-amber-dark'],
    ['FN', 'Fira', 'bg-blush-dark'],
    ['AK', 'Andi', 'bg-moss']
  ];

  const groups = [
    ['Mindfulness Daily', '1.2K anggota', '🧘', 'bg-sage-light'],
    ['Anxiety Support', '3.4K anggota', '💙', 'bg-blush-light'],
    ['Better Sleep Club', '876 anggota', '🌙', 'bg-lavender-light'],
    ['Daily Motivation', '2.1K anggota', '✨', 'bg-amber-light']
  ];

  $: visiblePosts = activeTab === 'semua' || activeTab === 'trending'
    ? posts
    : posts.filter((post) => post.tab === activeTab);

  const categoryMap = {
    kecemasan: 1,
    depresi: 2,
    motivasi: 3,
    tips: 4
  };

  const categoryLabels = {
    1: '😰 Kecemasan',
    2: '💙 Depresi',
    3: '✨ Motivasi & Inspirasi',
    4: '💡 Tips & Strategi'
  };

  const categoryClasses = {
    1: 'bg-blush-light text-blush-dark border-blush',
    2: 'bg-sky-light text-sky-dark border-sky',
    3: 'bg-amber-light text-amber-dark border-amber',
    4: 'bg-lavender-light text-lavender-dark border-lavender'
  };

  function getInitials(name = 'MP') {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
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
      avatarClass: ['bg-sage-dark', 'bg-lavender-dark', 'bg-blush-dark', 'bg-amber-dark', 'bg-sky-dark'][index % 5],
      badge: index === 0 ? 'Baru' : 'Anggota',
      badgeClass: index === 0 ? 'bg-sky-light text-sky-dark' : 'bg-sage-light text-moss',
      category: categoryLabels[categoryId] ?? '🌱 Cerita & Pengalaman',
      categoryClass: categoryClasses[categoryId] ?? 'bg-sage-light text-moss border-sage',
      title: post.title,
      text: post.content,
      tags: ['#mindpal', '#komunitas'],
      likes,
      comments: comments.length,
      liked: false,
      tab,
      replies: comments.slice(0, 2).map((comment, replyIndex) => ({
        initials: getInitials(comment.user?.name ?? 'MP'),
        avatarClass: ['bg-sage-dark', 'bg-lavender-dark', 'bg-sky-dark'][replyIndex % 3],
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
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    repliesOpen = next;
  }

  function joinGroup(name) {
    const next = new Set(joinedGroups);
    next.add(name);
    joinedGroups = next;
  }

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

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
      await createPost({
        title: cleanTitle,
        content: cleanBody,
        category_id: getSelectedCategoryId()
      });
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
          id: Date.now(),
          author: 'Dika Kurnia',
          username: '@dika_k',
          time: '3 hari lalu',
          joined: 'Bergabung 6 bulan',
          initials: 'DK',
          avatarClass: 'bg-sky-dark',
          badge: 'Kontributor',
          badgeClass: 'bg-sky-light text-sky-dark',
          category: '💡 Tips & Strategi',
          categoryClass: 'bg-sky-light text-sky-dark border-sky',
          title: 'Journaling 10 menit sehari, cara terbaik kenali dirimu sendiri',
          text: 'Aku mulai journaling 6 bulan lalu dan ini jadi salah satu kebiasaan terbaik yang pernah aku adopsi. Tidak perlu panjang, cukup tulis apa yang kamu rasakan, apa yang membuatmu bersyukur, dan satu langkah kecil untuk besok.',
          tags: ['#journaling', '#selfawareness', '#kebiasaanbaik'],
          likes: 95,
          comments: 21,
          liked: false,
          tab: 'tips',
          replies: []
        }
      ];
      isLoadingMore = false;
    }, 600);
  }

  onMount(() => loadPosts('semua'));
</script>

<Sidebar />

<main class="ml-[240px] flex min-h-screen flex-1 bg-cream text-text-dark">
  <section class="min-w-0 flex-1 px-7 py-8">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="font-lora text-[1.55rem] font-semibold">Komunitas MindPal 🌿</h1>
        <p class="mt-[2px] text-[0.84rem] text-text-soft">Ruang aman untuk berbagi, mendengar, dan saling mendukung.</p>
      </div>
      <button class="flex items-center gap-[7px] rounded-full bg-moss px-[1.3rem] py-[0.65rem] text-[0.85rem] font-medium text-white transition hover:-translate-y-px hover:bg-sage-dark" on:click={openModal}>✏️ Buat Postingan</button>
    </div>

    <div class="relative mb-6 flex items-center justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-sky-dark to-lavender-dark px-7 py-6">
      <div class="absolute -right-10 -top-10 h-[180px] w-[180px] rounded-full bg-white/10"></div>
      <div class="absolute -bottom-[60px] right-20 h-[130px] w-[130px] rounded-full bg-white/5"></div>
      <div class="relative z-10">
        <h2 class="mb-1 font-lora text-[1.1rem] font-semibold text-white">Kamu tidak sendirian di sini 💙</h2>
        <p class="max-w-[340px] text-[0.82rem] leading-[1.5] text-white/75">Bergabunglah dengan ribuan anggota yang saling berbagi cerita dan dukungan setiap hari.</p>
      </div>
      <div class="relative z-10 flex gap-6">
        {#each [['12.4K', 'Anggota aktif'], ['284', 'Post minggu ini'], ['97%', 'Merasa didukung']] as stat}
          <div class="text-center">
            <div class="font-lora text-[1.4rem] font-semibold leading-none text-white">{stat[0]}</div>
            <div class="mt-[2px] text-[0.7rem] text-white/65">{stat[1]}</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="mb-5 flex gap-[0.35rem] rounded-[14px] border border-sand bg-white p-[0.35rem]">
      {#each tabs as tab}
        <button class="flex-1 rounded-[10px] p-2 text-center text-[0.82rem] transition hover:bg-cream {activeTab === tab.id ? 'bg-sky-light font-medium text-sky-dark' : 'text-text-soft'}" on:click={() => selectTab(tab.id)}>{tab.label}</button>
      {/each}
    </div>

    <div class="mb-5 rounded-[18px] border-[1.5px] border-sand bg-white px-5 py-[1.1rem] transition focus-within:border-sky">
      <div class="mb-[0.85rem] flex items-start gap-[0.85rem]">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-[0.75rem] font-medium text-white">AR</div>
        <textarea class="min-h-[52px] flex-1 resize-none bg-transparent text-[0.88rem] leading-[1.55] outline-none placeholder:text-text-soft" bind:value={composeText} placeholder="Apa yang ingin kamu bagikan hari ini?"></textarea>
      </div>
      <div class="flex items-center gap-2 border-t border-sand pt-3">
        {#each ['🖼️ Foto', '🏷️ Tag', '😊 Mood'] as tool}
          <button class="rounded-lg px-[0.65rem] py-[0.3rem] text-[0.76rem] text-text-soft transition hover:bg-cream hover:text-text-dark">{tool}</button>
        {/each}
        <button class="ml-auto rounded-full bg-sky-dark px-[1.1rem] py-[0.48rem] text-[0.8rem] font-medium text-white transition hover:bg-moss" on:click={publishCompose}>Posting</button>
      </div>
    </div>

    {#if isLoadingPosts}
      <div class="mb-4 rounded-full border border-sand bg-white px-4 py-2 text-center text-[0.8rem] text-text-soft">Memuat postingan...</div>
    {/if}

    <div class="flex flex-col gap-[0.9rem]">
      {#each visiblePosts as post}
        <article class="rounded-[18px] border border-sand bg-white px-[1.3rem] py-[1.2rem] transition hover:-translate-y-0.5 hover:border-sky">
          <div class="mb-[0.85rem] flex items-center gap-3">
            <div class="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[0.75rem] font-medium text-white {post.avatarClass}">{post.initials}</div>
            <div class="flex-1">
              <div class="text-[0.86rem] font-medium">{post.author} <span class="font-normal text-text-soft">· {post.username}</span></div>
              <div class="mt-px text-[0.72rem] text-text-soft">{post.time} · {post.joined}</div>
            </div>
            <span class="rounded-full px-[0.7rem] py-[0.2rem] text-[0.66rem] font-medium {post.badgeClass}">{post.badge}</span>
          </div>

          <div class="mb-[0.6rem] inline-flex items-center gap-[5px] rounded-full border px-3 py-[0.22rem] text-[0.7rem] font-medium {post.categoryClass}">{post.category}</div>
          <h2 class="mb-2 cursor-pointer font-lora text-base font-semibold leading-[1.35] transition hover:text-sky-dark">{post.title}</h2>
          <p class="mb-[0.85rem] text-[0.84rem] leading-[1.65] text-text-mid">{post.text}</p>

          {#if post.image}
            <div class="mb-[0.85rem] flex h-40 w-full items-center justify-center rounded-xl border border-sand bg-gradient-to-br from-sage-light to-sky-light text-[2.5rem]">{post.image}</div>
          {/if}

          <div class="mb-[0.85rem] flex flex-wrap gap-[0.4rem]">
            {#each post.tags as tag}
              <span class="rounded-full border border-sand bg-cream px-[0.65rem] py-[0.22rem] text-[0.68rem] text-text-soft transition hover:border-sky hover:bg-sky-light hover:text-sky-dark">{tag}</span>
            {/each}
          </div>

          {#if post.replies.length > 0}
            <div class="mt-3 border-t border-sand pt-3">
              {#each post.replies.slice(0, repliesOpen.has(post.id) ? post.replies.length : 1) as reply}
                <div class="mb-[0.65rem] flex gap-[0.65rem]">
                  <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.62rem] font-medium text-white {reply.avatarClass}">{reply.initials}</div>
                  <div class="flex-1 rounded-[0_12px_12px_12px] border border-sand bg-cream px-[0.8rem] py-[0.55rem]">
                    <div class="mb-[2px] text-[0.72rem] font-medium">{reply.name}</div>
                    <div class="text-[0.78rem] leading-[1.5] text-text-mid">{reply.text}</div>
                    <div class="mt-[3px] text-[0.65rem] text-text-soft">{reply.time}</div>
                  </div>
                </div>
              {/each}
              {#if post.replies.length > 1}
                <button class="ml-[34px] text-[0.76rem] text-sky-dark transition hover:opacity-70" on:click={() => toggleReplies(post.id)}>{repliesOpen.has(post.id) ? '← Sembunyikan' : `Lihat ${post.replies.length - 1} balasan lainnya →`}</button>
              {/if}
            </div>
          {/if}

          <div class="mt-3 flex items-center gap-[0.15rem] border-t border-sand pt-3">
            <button class="rounded-[9px] px-[0.7rem] py-[0.38rem] text-[0.76rem] transition hover:bg-cream {post.liked ? 'text-blush-dark hover:bg-blush-light' : 'text-text-soft hover:text-text-dark'}" on:click={() => toggleLike(post.id)}>{post.liked ? '❤️' : '🤍'} <span>{post.likes}</span></button>
            <div class="mx-[0.2rem] h-[18px] w-px bg-sand"></div>
            <button class="rounded-[9px] px-[0.7rem] py-[0.38rem] text-[0.76rem] text-text-soft transition hover:bg-cream hover:text-text-dark">💬 {post.comments} Komentar</button>
            <div class="mx-[0.2rem] h-[18px] w-px bg-sand"></div>
            <button class="rounded-[9px] px-[0.7rem] py-[0.38rem] text-[0.76rem] text-text-soft transition hover:bg-cream hover:text-text-dark">🔖 Simpan</button>
            <button class="ml-auto rounded-[9px] px-[0.7rem] py-[0.38rem] text-[0.76rem] text-text-soft transition hover:bg-cream hover:text-text-dark">↗ Bagikan</button>
          </div>
        </article>
      {/each}
    </div>

    <div class="py-5 text-center">
      <button class="rounded-full border-[1.5px] border-sand bg-white px-7 py-[0.65rem] text-[0.85rem] text-text-mid transition hover:border-sky hover:text-sky-dark disabled:opacity-60" on:click={loadMore} disabled={isLoadingMore}>{isLoadingMore ? 'Memuat...' : 'Muat lebih banyak'}</button>
    </div>
  </section>

  <aside class="w-[280px] shrink-0 py-8 pl-0 pr-5">
    <div class="mb-4 rounded-2xl border border-sand bg-white px-[1.2rem] py-[1.1rem]">
      <h3 class="mb-[0.9rem] flex items-center gap-1.5 text-[0.84rem] font-medium">🔥 Topik Trending</h3>
      <div class="flex flex-col gap-2">
        {#each trendingTopics as topic, index}
          <div class="flex items-center gap-3 rounded-[11px] px-[0.65rem] py-[0.55rem] transition hover:bg-cream">
            <div class="w-[18px] shrink-0 text-center font-lora text-[0.85rem] font-semibold text-sand-dark">{index + 1}</div>
            <div>
              <h4 class="text-[0.8rem] font-medium">{topic[0]}</h4>
              <p class="mt-px text-[0.68rem] text-text-soft">{topic[1]}</p>
            </div>
            <span class="ml-auto rounded-full border border-sand bg-cream px-[0.6rem] py-[0.2rem] text-[0.68rem] text-text-soft">{topic[2]}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="mb-4 rounded-2xl border border-sand bg-white px-[1.2rem] py-[1.1rem]">
      <h3 class="mb-[0.9rem] text-[0.84rem] font-medium">🟢 Anggota Online <span class="text-[0.7rem] font-normal text-text-soft">(24 orang)</span></h3>
      <div class="mb-3 flex flex-wrap gap-2">
        {#each members as member}
          <div class="flex items-center gap-[0.45rem] rounded-full border border-sand bg-cream py-[0.3rem] pl-[0.3rem] pr-[0.7rem]">
            <div class="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[0.55rem] font-medium text-white {member[2]}">{member[0]}</div>
            <span class="text-[0.72rem] text-text-mid">{member[1]}</span>
          </div>
        {/each}
      </div>
      <div class="text-[0.74rem] text-text-soft">+18 anggota lainnya online</div>
    </div>

    <div class="mb-4 rounded-2xl border border-sand bg-white px-[1.2rem] py-[1.1rem]">
      <h3 class="mb-[0.9rem] text-[0.84rem] font-medium">👥 Grup Komunitas</h3>
      <div class="flex flex-col gap-2">
        {#each groups as group}
          <div class="flex items-center gap-3 rounded-[11px] border border-transparent px-[0.65rem] py-[0.6rem] transition hover:border-sand hover:bg-cream">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[1.1rem] {group[3]}">{group[2]}</div>
            <div>
              <h4 class="text-[0.8rem] font-medium">{group[0]}</h4>
              <p class="mt-px text-[0.68rem] text-text-soft">{group[1]}</p>
            </div>
            <button class="ml-auto rounded-full border-[1.5px] px-[0.7rem] py-[0.25rem] text-[0.68rem] font-medium transition {joinedGroups.has(group[0]) ? 'border-sage bg-sage-light text-moss' : 'border-sky text-sky-dark hover:bg-sky-light'}" on:click={() => joinGroup(group[0])}>{joinedGroups.has(group[0]) ? '✓ Joined' : '+ Gabung'}</button>
          </div>
        {/each}
      </div>
    </div>

    <div class="rounded-2xl border border-sage bg-sage-light px-[1.2rem] py-[1.1rem]">
      <h3 class="mb-[0.9rem] text-[0.84rem] font-medium">📋 Panduan Komunitas</h3>
      <div class="flex flex-col gap-2">
        {#each ['🤝 Saling menghormati dan berempati', '🔒 Jaga privasi orang lain', '💙 Tidak ada penilaian di sini', '🚫 Hindari saran medis tanpa dasar'] as guide}
          <div class="flex items-start gap-2 text-[0.77rem] text-text-mid">{guide}</div>
        {/each}
      </div>
    </div>
  </aside>
</main>

{#if isModalOpen}
  <div class="fixed inset-0 z-[200] flex items-center justify-center px-4">
    <button class="absolute inset-0 bg-black/35 backdrop-blur-[3px]" type="button" aria-label="Tutup modal" on:click={closeModal}></button>
    <section class="relative z-10 w-[560px] max-w-[94vw] scale-100 rounded-[22px] bg-white p-7 opacity-100 shadow-[0_24px_80px_rgba(45,42,38,0.22)] transition-all duration-200">
      <div class="mb-5 flex items-center justify-between">
        <h2 class="font-lora text-[1.05rem] font-semibold">✏️ Buat Postingan Baru</h2>
        <button class="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-sand bg-cream text-[0.9rem] transition hover:bg-sand" on:click={closeModal}>✕</button>
      </div>

      <div class="mb-4 flex items-center gap-[0.65rem]">
        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage text-[0.75rem] font-medium text-white">AR</div>
        <div>
          <div class="text-[0.85rem] font-medium">Arif R.</div>
          <div class="text-[0.72rem] text-text-soft">Posting ke Komunitas MindPal</div>
        </div>
      </div>

      <div class="mb-2 text-[0.76rem] text-text-soft">Pilih kategori:</div>
      <div class="mb-4 flex flex-wrap gap-[0.35rem]">
        {#each categories as category}
          <button class="rounded-full border-[1.5px] px-[0.8rem] py-[0.3rem] text-[0.73rem] transition {selectedCategory === category ? 'border-sky-dark bg-sky-light text-sky-dark' : 'border-sand text-text-soft hover:bg-cream'}" on:click={() => selectedCategory = category}>{category}</button>
        {/each}
      </div>

      <input class="mb-3 w-full rounded-xl border-[1.5px] border-sand px-4 py-[0.7rem] font-lora text-base font-medium text-text-dark outline-none transition placeholder:font-sans placeholder:text-[0.9rem] placeholder:font-normal placeholder:text-text-soft focus:border-sky" bind:value={modalTitle} type="text" placeholder="Judul postinganmu..." />
      <textarea class="mb-3 w-full resize-none rounded-xl border-[1.5px] border-sand px-4 py-[0.7rem] text-[0.86rem] leading-[1.6] text-text-dark outline-none transition placeholder:text-text-soft focus:border-sky" bind:value={modalBody} rows="5" placeholder="Ceritakan pengalamanmu, atau tulis apa yang ada di pikiranmu. Ingat, ruang ini aman dan bebas penilaian 🌿"></textarea>

      <div class="flex items-center justify-between">
        <div class="flex gap-[0.4rem]">
          {#each ['🖼️', '🏷️', '😊'] as tool}
            <button class="flex h-8 w-8 items-center justify-center rounded-[9px] border-[1.5px] border-sand bg-cream text-[0.88rem] transition hover:border-sky hover:bg-sky-light">{tool}</button>
          {/each}
        </div>
        <div class="flex gap-[0.6rem]">
          <button class="rounded-full border-[1.5px] border-sand px-[1.1rem] py-[0.55rem] text-[0.83rem] text-text-mid transition hover:border-sand-dark" on:click={closeModal}>Batal</button>
          <button class="rounded-full bg-moss px-[1.3rem] py-[0.55rem] text-[0.83rem] font-medium text-white transition hover:bg-sage-dark disabled:cursor-not-allowed disabled:bg-sand-dark" disabled={isPublishing} on:click={publishPost}>{isPublishing ? 'Menerbitkan...' : 'Publikasikan 🌿'}</button>
        </div>
      </div>
    </section>
  </div>
{/if}
