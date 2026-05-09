<script>
  import { onMount, tick } from 'svelte';
  import Sidebar from '../components/Sidebar.svelte';
  import { getCounselors, getMessages, sendMessage as sendChatMessage } from '../lib/api/chat.js';

  let activeChat = 0;
  let messageInput = '';
  let isTyping = false;
  let isLoadingChats = false;
  let isLoadingMessages = false;
  let isSending = false;
  let messagesEl;

  let konselorData = [
    {
      initials: 'AP',
      avatarClass: 'bg-lavender-dark',
      name: 'Dr. Amira Putri, M.Psi',
      role: 'Psikolog Klinis',
      subtitle: 'Psikolog Klinis · 8 thn',
      status: 'Online sekarang',
      statusDot: 'bg-[#5cb85c]',
      availability: 'online',
      preview: 'Tentu, kita bisa coba teknik itu...',
      time: '10:42',
      unread: 1,
      desc: 'Psikolog Klinis, 8 tahun pengalaman. Fokus pada kecemasan, depresi, dan trauma.',
      tags: ['Kecemasan', 'Depresi', 'Trauma', 'CBT'],
      stats: ['8 thn', '4.9★', '320+', '95%'],
      review: 'Dr. Amira sangat sabar dan membuat saya nyaman. Teknik yang diajarkan benar-benar membantu.'
    },
    {
      initials: 'BS',
      avatarClass: 'bg-sky-dark',
      name: 'Budi Santoso, S.Psi',
      role: 'Konselor',
      subtitle: 'Konselor · 5 thn',
      status: 'Sedang sibuk',
      statusDot: 'bg-amber',
      availability: 'busy',
      preview: 'Sesi kita Senin ya, jam 10 pagi',
      time: 'Kemarin',
      unread: 0,
      desc: 'Konselor 5 tahun, spesialis manajemen stres dan produktivitas kerja.',
      tags: ['Stres', 'Work-life balance', 'Motivasi'],
      stats: ['5 thn', '4.8★', '210+', '92%'],
      review: 'Pendekatannya praktis dan sangat membumi. Saya merasa lebih punya arah setelah sesi.'
    },
    {
      initials: 'SR',
      avatarClass: 'bg-blush-dark',
      name: 'Sinta Rahayu, M.Psi',
      role: 'Psikolog',
      subtitle: 'Psikolog · 6 thn',
      status: 'Offline',
      statusDot: 'bg-sand-dark',
      availability: 'offline',
      preview: 'Terima kasih sudah berbagi hari ini',
      time: 'Senin',
      unread: 0,
      desc: 'Psikolog dengan keahlian hubungan interpersonal dan pengembangan diri.',
      tags: ['Hubungan', 'Kepercayaan diri', 'Grief'],
      stats: ['6 thn', '4.9★', '260+', '94%'],
      review: 'Saya merasa didengar tanpa dihakimi. Sesi berjalan hangat dan jelas.'
    },
    {
      initials: 'RH',
      avatarClass: 'bg-sage-dark',
      name: 'Rizky Handoko, M.Psi',
      role: 'Psikolog Remaja',
      subtitle: 'Psikolog Remaja · 4 thn',
      status: 'Online sekarang',
      statusDot: 'bg-[#5cb85c]',
      availability: 'online',
      preview: 'Halo! Ada yang bisa saya bantu?',
      time: 'Minggu',
      unread: 0,
      desc: 'Spesialis psikologi anak dan remaja, 4 tahun menangani tumbuh kembang.',
      tags: ['Remaja', 'Akademik', 'Keluarga', 'ADHD'],
      stats: ['4 thn', '4.7★', '180+', '91%'],
      review: 'Bahasanya mudah dipahami dan sangat membantu untuk isu remaja.'
    }
  ];

  let conversations = [
    [
      { type: 'date', text: 'Hari ini, 28 April' },
      { type: 'system', text: 'Sesi konseling dimulai. Semua percakapan bersifat privat & aman 🔒' },
      { from: 'them', text: 'Halo Arif! Selamat pagi 😊 Berdasarkan hasil kuesioner terakhirmu, aku melihat ada beberapa hal terkait kecemasan yang mungkin ingin kita bahas. Bagaimana perasaanmu sekarang?', time: '10:30' },
      { from: 'me', text: 'Halo Dok! Lumayan, tadi pagi masih agak cemas tapi sekarang sudah sedikit lebih baik. Saya emang lagi banyak pikiran soal kerjaan belakangan ini.', time: '10:33' },
      { from: 'them', text: 'Aku senang kamu mau berbagi 🌿 Wajar sekali kalau pekerjaan bisa jadi sumber stres. Boleh cerita lebih lanjut, hal spesifik apa yang paling banyak menyita pikiranmu?', time: '10:34' },
      { from: 'me', text: 'Deadline proyek yang numpuk, terus saya sering ngerasa takut gagal. Kayak ada tekanan terus di dada gitu Dok. Susah tidur juga jadinya.', time: '10:36' },
      { from: 'them', text: 'Makasih sudah mau terbuka, Arif. Perasaan tertekan dan takut gagal itu sangat manusiawi, apalagi saat beban kerja tinggi. Kita bisa mulai dengan teknik sederhana. Kamu pernah dengar tentang grounding techniques?', time: '10:38' },
      { type: 'quick' },
      { type: 'date', text: '1 pesan baru' },
      { from: 'them', text: 'Tentu, kita bisa coba teknik itu bersama! Kalau kamu mau, kita juga bisa booking sesi 1-on-1 minggu depan untuk latihan lebih mendalam. Gimana menurutmu? 🌱', time: '10:42' }
    ],
    [
      { type: 'date', text: 'Kemarin' },
      { from: 'them', text: 'Halo Arif, sesi kita Senin ya, jam 10 pagi. Aku sudah siapkan beberapa latihan manajemen stres kerja.', time: '15:12' },
      { from: 'me', text: 'Siap Pak Budi, terima kasih. Saya akan hadir.', time: '15:20' }
    ],
    [
      { type: 'date', text: 'Senin' },
      { from: 'them', text: 'Terima kasih sudah berbagi hari ini. Pelan-pelan saja, yang penting kamu tetap memberi ruang untuk dirimu sendiri.', time: '16:05' }
    ],
    [
      { type: 'date', text: 'Minggu' },
      { from: 'them', text: 'Halo! Ada yang bisa saya bantu? Kamu bisa cerita dengan nyaman di sini.', time: '09:00' }
    ]
  ];

  const quickReplies = [
    'Pernah dengar tapi belum pernah coba',
    'Belum pernah dengar sama sekali',
    'Sudah pernah coba, lumayan membantu!'
  ];

  $: activeKonselor = konselorData[activeChat];
  $: activeMessages = conversations[activeChat];

  function getInitials(name = 'MP') {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  function formatTime(dateValue) {
    if (!dateValue) return '';

    return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateValue));
  }

  function mapChat(chat, index) {
    const counselor = chat.counselor ?? {};
    const counselorUser = counselor.user ?? {};
    const name = counselorUser.name ?? `Konselor ${index + 1}`;
    const role = counselorUser.role === 'counselor' ? 'Konselor' : 'Psikolog';
    const status = counselor.status ?? 'online';
    const lastMessage = Array.isArray(chat.messages) ? chat.messages[0] : null;
    const tags = counselor.specialization ?? ['Konseling', 'Mindfulness'];
    const experience = counselor.experience_years ? `${counselor.experience_years} thn` : '5 thn';
    const rating = counselor.rating ? `${Number(counselor.rating).toFixed(1)}★` : '4.8★';

    return {
      id: chat.id,
      counselorUserId: counselor.user_id ?? counselorUser.id,
      initials: getInitials(name),
      avatarClass: ['bg-lavender-dark', 'bg-sky-dark', 'bg-blush-dark', 'bg-sage-dark'][index % 4],
      name,
      role,
      subtitle: `${role} · ${experience}`,
      status: status === 'available' || status === 'online' ? 'Online sekarang' : status === 'busy' ? 'Sedang sibuk' : 'Offline',
      statusDot: status === 'busy' ? 'bg-amber' : status === 'offline' ? 'bg-sand-dark' : 'bg-[#5cb85c]',
      availability: status === 'busy' ? 'busy' : status === 'offline' ? 'offline' : 'online',
      preview: lastMessage?.content ?? 'Mulai percakapan dengan konselor',
      time: formatTime(lastMessage?.created_at) || 'Baru',
      unread: 0,
      desc: counselor.bio ?? `${role}, fokus mendampingi proses refleksi dan kesehatan mentalmu.`,
      tags,
      stats: [experience, rating, `${counselor.patients_count ?? 120}+`, '95%'],
      review: 'Pendampingannya hangat dan membantu pengguna merasa lebih terarah.'
    };
  }

  function mapMessage(message, counselorUserId) {
    return {
      from: message.sender_id === counselorUserId ? 'them' : 'me',
      text: message.content,
      time: formatTime(message.created_at) || currentTime()
    };
  }

  function buildConversation(messages, counselorUserId) {
    const items = [...messages].reverse().map((message) => mapMessage(message, counselorUserId));

    return items.length > 0
      ? [{ type: 'date', text: 'Riwayat percakapan' }, ...items]
      : [{ type: 'date', text: 'Mulai percakapan' }, { type: 'system', text: 'Semua percakapan bersifat privat & aman 🔒' }];
  }

  async function loadMessages(index) {
    const chat = konselorData[index];
    if (!chat?.id) {
      scrollMessages();
      return;
    }

    isLoadingMessages = true;

    try {
      const messages = await getMessages(chat.id);
      const nextConversations = [...conversations];
      nextConversations[index] = buildConversation(messages, chat.counselorUserId);
      conversations = nextConversations;
    } catch (error) {
      scrollMessages();
    } finally {
      isLoadingMessages = false;
      scrollMessages();
    }
  }

  async function loadCounselors() {
    isLoadingChats = true;

    try {
      const chats = await getCounselors();
      if (Array.isArray(chats) && chats.length > 0) {
        konselorData = chats.map(mapChat);
        conversations = chats.map(() => [{ type: 'date', text: 'Memuat percakapan...' }]);
        activeChat = 0;
        await loadMessages(0);
      }
    } catch (error) {
      scrollMessages();
    } finally {
      isLoadingChats = false;
    }
  }

  async function switchChat(index) {
    activeChat = index;
    isTyping = false;
    await loadMessages(index);
  }

  function currentTime() {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  async function scrollMessages() {
    await tick();
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  function removeQuickReplies(items) {
    return items.filter((item) => item.type !== 'quick');
  }

  async function sendMessage(text = messageInput) {
    const cleanText = text.trim();
    if (!cleanText || isSending) return;

    const nextConversations = [...conversations];
    nextConversations[activeChat] = [
      ...removeQuickReplies(nextConversations[activeChat]),
      { from: 'me', text: cleanText, time: currentTime() }
    ];
    conversations = nextConversations;
    messageInput = '';
    isSending = true;
    scrollMessages();

    try {
      const chat = konselorData[activeChat];
      if (chat?.id) {
        const savedMessage = await sendChatMessage(chat.id, cleanText);
        const updated = [...conversations];
        updated[activeChat] = [
          ...removeQuickReplies(updated[activeChat]).filter((item, itemIndex, items) => itemIndex !== items.length - 1 || item.text !== cleanText),
          mapMessage(savedMessage, chat.counselorUserId)
        ];
        conversations = updated;
      }
    } catch (error) {
      const updated = [...conversations];
      updated[activeChat] = [
        ...updated[activeChat],
        { type: 'system', text: 'Pesan belum terkirim. Coba lagi sebentar.' }
      ];
      conversations = updated;
    } finally {
      isSending = false;
      scrollMessages();
    }
  }

  function handleKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  onMount(loadCounselors);
</script>

<Sidebar />

<div class="main">

  <div class="konselor-list">
    <div class="kl-header">
      <h2>💬 Chat Konselor</h2>
      <div class="search-box">
        <span>🔍</span>
        <input type="text" placeholder="Cari konselor..." />
      </div>
    </div>
    <div class="kl-tabs">
      <div class="kl-tab active">Aktif</div>
      <div class="kl-tab">Tersedia</div>
      <div class="kl-tab">Semua</div>
    </div>
    <div class="kl-body">
      {#each konselorData as konselor, index}
        <div class="konselor-item {activeChat === index ? 'active' : ''}" on:click={() => switchChat(index)}>
          <div class="ki-avatar">
            <div class="ki-pic" style="background:{konselor.availability === 'online' ? '#9389b8' : konselor.availability === 'busy' ? '#4a7a9b' : '#c9857a'}">{konselor.initials}</div>
            <div class="ki-online {konselor.availability === 'online' ? 'online-dot' : konselor.availability === 'busy' ? 'busy-dot' : 'offline-dot'}"></div>
          </div>
          <div class="ki-info">
            <div class="ki-name">{konselor.name}</div>
            <div class="ki-role">{konselor.subtitle}</div>
            <div class="ki-preview">{konselor.preview}</div>
          </div>
          <div class="ki-right">
            <span class="ki-time">{konselor.time}</span>
            {#if konselor.unread}
              <span class="ki-unread">{konselor.unread}</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="chat-area">
    <div class="chat-header">
      <div class="ch-avatar" style="background:{activeKonselor.availability === 'online' ? '#9389b8' : '#c9857a'}">
        {activeKonselor.initials}
        {#if activeKonselor.availability === 'online'}<div class="ch-online-dot"></div>{/if}
      </div>
      <div class="ch-info">
        <h3>{activeKonselor.name}</h3>
        <p>{activeKonselor.availability === 'online' ? '🟢 Online sekarang' : activeKonselor.availability === 'busy' ? '🟡 Sedang sibuk' : '⚫ Offline'}</p>
      </div>
      <div class="ch-actions">
        <div class="ch-btn" title="Booking Sesi">📅</div>
        <div class="ch-btn" title="Profil">👤</div>
        <div class="ch-btn" title="Lainnya">⋯</div>
      </div>
    </div>

    <div class="chat-profile-banner">
      <div class="cpb-avatar" style="background:{activeKonselor.availability === 'online' ? '#9389b8' : '#c9857a'}">{activeKonselor.initials}</div>
      <div class="cpb-info">
        <h3>{activeKonselor.name}</h3>
        <p>{activeKonselor.desc}</p>
        <div class="cpb-tags">
          {#each activeKonselor.tags as tag}<span class="cpb-tag">{tag}</span>{/each}
        </div>
      </div>
      <div class="cpb-actions">
        <button class="cpb-btn cpb-book">📅 Booking Sesi</button>
        <button class="cpb-btn cpb-profile">Lihat Profil</button>
      </div>
    </div>

    <div class="messages" bind:this={messagesEl}>
      {#if isLoadingMessages}
        <div class="bubble-system">Memuat pesan...</div>
      {/if}
      {#each activeMessages as message}
        {#if message.type === 'date'}
          <div class="date-divider"><span>{message.text}</span></div>
        {:else if message.type === 'system'}
          <div class="bubble-system">{message.text}</div>
        {:else if message.type === 'quick'}
          <div class="quick-replies">
            {#each quickReplies as reply}
              <button class="qr-btn" on:click={() => sendMessage(reply)}>{reply}</button>
            {/each}
          </div>
        {:else}
          <div class="msg-row {message.from === 'me' ? 'me' : ''}">
            <div class="msg-avatar" style="background:{message.from === 'me' ? '#b5c9b1' : '#9389b8'}">{message.from === 'me' ? 'AR' : activeKonselor.initials}</div>
            <div><div class="bubble {message.from === 'me' ? 'bubble-me' : 'bubble-them'}">{message.text}<span class="bubble-time">{message.time}</span></div></div>
          </div>
        {/if}
      {/each}
      {#if isTyping}
        <div class="typing-indicator">
          <div class="msg-avatar" style="background:#9389b8">{activeKonselor.initials}</div>
          <div class="typing-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>
        </div>
      {/if}
    </div>

    <div class="chat-input-area">
      <div class="input-toolbar">
        <div class="tool-btn" title="Lampiran">📎</div>
        <div class="tool-btn" title="Emoji">😊</div>
        <div class="tool-btn" title="Jadwal">📅</div>
        <div class="tool-btn" title="Suara">🎤</div>
      </div>
      <div class="input-row">
        <textarea class="input-box" bind:value={messageInput} on:keydown={handleKey} rows="1" placeholder="Tulis pesanmu..."></textarea>
        <button class="send-btn" disabled={isSending} on:click={() => sendMessage()}>{isSending ? '…' : '➤'}</button>
      </div>
      <div class="input-hint">Enter untuk kirim · Shift+Enter baris baru · Semua pesan dienkripsi 🔒</div>
    </div>
  </div>

  <div class="konselor-detail">
    <div class="kd-section" style="text-align:center;padding-top:1.4rem">
      <div class="kd-avatar" style="background:#9389b8">{activeKonselor.initials}</div>
      <div class="kd-name">{activeKonselor.name}</div>
      <div class="kd-role">{activeKonselor.role}</div>
      <div class="kd-stats">
        {#each activeKonselor.stats as stat, index}
          <div class="kd-stat">
            <div class="kd-stat-val">{stat}</div>
            <div class="kd-stat-lbl">{['Pengalaman','Rating','Klien','Kepuasan'][index]}</div>
          </div>
        {/each}
      </div>
      <button class="kd-book-btn">📅 Booking Sesi Baru</button>
    </div>
    <div class="kd-section">
      <div class="kd-label">Spesialisasi</div>
      <div class="kd-spec-tags">
        {#each activeKonselor.tags as tag}<span class="spec-tag">{tag}</span>{/each}
      </div>
    </div>
    <div class="kd-section">
      <div class="kd-label">Jadwal Mendatang</div>
      <div class="sched-item">
        <div class="sched-date"><span class="sched-d">Rab</span><span class="sched-n">30</span></div>
        <div class="sched-info"><h4>Sesi 1-on-1</h4><p>14.00 – 15.00 WIB</p></div>
      </div>
      <div class="sched-item">
        <div class="sched-date" style="background:#ebe7f2"><span class="sched-d" style="color:#9389b8">Jum</span><span class="sched-n" style="color:#9389b8">9</span></div>
        <div class="sched-info"><h4>Sesi Lanjutan</h4><p>13.00 – 14.00 WIB</p></div>
      </div>
    </div>
    <div class="kd-section">
      <div class="kd-label">Ulasan Terbaru</div>
      <div style="display:flex;align-items:center;gap:.3rem;font-size:.78rem;color:#b89840;margin-bottom:.6rem">⭐⭐⭐⭐⭐ <span style="color:#8c8680;font-size:.7rem">4.9 (128 ulasan)</span></div>
      <div style="background:#f7f3ed;border-radius:10px;padding:.7rem;border:1px solid #e8e0d4">
        <div style="font-size:.73rem;font-style:italic;color:#5c5751;line-height:1.5">"{activeKonselor.review}"</div>
        <div style="font-size:.66rem;color:#8c8680;margin-top:.35rem">— Pengguna terverifikasi</div>
      </div>
    </div>
  </div>

</div>

<style>
.main{margin-left:var(--sidebar-w);flex:1;display:flex;height:100vh;overflow:hidden}
.konselor-list{width:290px;flex-shrink:0;background:white;border-right:1px solid var(--sand);display:flex;flex-direction:column;height:100vh}
.kl-header{padding:1.25rem 1.1rem 1rem;border-bottom:1px solid var(--sand)}
.kl-header h2{font-family:'Lora',serif;font-size:1.05rem;font-weight:600;color:var(--text-dark);margin-bottom:.75rem}
.search-box{display:flex;align-items:center;gap:8px;background:var(--cream);border:1.5px solid var(--sand);border-radius:12px;padding:.5rem .85rem}
.search-box input{border:none;background:none;outline:none;font-family:'DM Sans',sans-serif;font-size:.82rem;color:var(--text-dark);width:100%}
.search-box input::placeholder{color:var(--text-soft)}
.kl-tabs{display:flex;gap:.35rem;padding:.75rem 1.1rem .5rem;border-bottom:1px solid var(--sand)}
.kl-tab{flex:1;text-align:center;font-size:.76rem;color:var(--text-soft);padding:.4rem;border-radius:9px;cursor:pointer;transition:all .15s}
.kl-tab.active{background:var(--blush-light);color:var(--blush-dark);font-weight:500}
.kl-body{flex:1;overflow-y:auto;padding:.5rem .65rem}
.kl-body::-webkit-scrollbar{width:4px}
.kl-body::-webkit-scrollbar-thumb{background:var(--sand);border-radius:100px}
.konselor-item{display:flex;align-items:center;gap:.8rem;padding:.8rem .55rem;border-radius:13px;cursor:pointer;transition:background .15s}
.konselor-item:hover{background:var(--cream)}
.konselor-item.active{background:var(--blush-light)}
.ki-avatar{position:relative;flex-shrink:0}
.ki-pic{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:500;color:white}
.ki-online{position:absolute;bottom:1px;right:1px;width:11px;height:11px;border-radius:50%;border:2px solid white}
.online-dot{background:#5cb85c}.busy-dot{background:var(--amber)}.offline-dot{background:var(--sand-dark)}
.ki-info{flex:1;min-width:0}
.ki-name{font-size:.84rem;font-weight:500;color:var(--text-dark);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ki-role{font-size:.71rem;color:var(--text-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ki-preview{font-size:.71rem;color:var(--text-soft);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.ki-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0}
.ki-time{font-size:.66rem;color:var(--text-soft)}
.ki-unread{width:18px;height:18px;background:var(--blush-dark);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.64rem;color:white;font-weight:500}
.chat-area{flex:1;display:flex;flex-direction:column;height:100vh;overflow:hidden;min-width:0}
.chat-header{padding:.9rem 1.4rem;background:white;border-bottom:1px solid var(--sand);display:flex;align-items:center;gap:.9rem;flex-shrink:0}
.ch-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:500;color:white;position:relative;flex-shrink:0}
.ch-online-dot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;border-radius:50%;background:#5cb85c;border:2px solid white}
.ch-info h3{font-size:.92rem;font-weight:500;color:var(--text-dark);margin-bottom:1px}
.ch-info p{font-size:.73rem;color:var(--sage-dark)}
.ch-actions{margin-left:auto;display:flex;gap:.4rem}
.ch-btn{width:34px;height:34px;border-radius:50%;border:1.5px solid var(--sand);background:white;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:.88rem}
.ch-btn:hover{background:var(--cream);border-color:var(--sage)}
.chat-profile-banner{background:linear-gradient(135deg,var(--blush-light),var(--lavender-light));border-bottom:1px solid var(--sand);padding:.9rem 1.4rem;display:flex;align-items:center;gap:.9rem;flex-shrink:0}
.cpb-avatar{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:500;color:white;flex-shrink:0}
.cpb-info h3{font-family:'Lora',serif;font-size:.95rem;font-weight:600;color:var(--text-dark);margin-bottom:2px}
.cpb-info p{font-size:.75rem;color:var(--text-mid);line-height:1.4}
.cpb-tags{display:flex;gap:.35rem;margin-top:.4rem;flex-wrap:wrap}
.cpb-tag{font-size:.66rem;padding:2px 8px;border-radius:100px;background:white;color:var(--text-mid);border:1px solid var(--sand)}
.cpb-actions{margin-left:auto;display:flex;flex-direction:column;gap:.35rem;flex-shrink:0}
.cpb-btn{font-size:.73rem;padding:.38rem .85rem;border-radius:100px;border:none;font-family:'DM Sans',sans-serif;cursor:pointer;font-weight:500;transition:all .2s;white-space:nowrap}
.cpb-book{background:var(--moss);color:white}
.cpb-book:hover{background:var(--sage-dark)}
.cpb-profile{background:white;color:var(--text-mid);border:1.5px solid var(--sand)}
.cpb-profile:hover{border-color:var(--sage);color:var(--moss)}
.messages{flex:1;overflow-y:auto;padding:1.1rem 1.4rem;display:flex;flex-direction:column;gap:.55rem;background:var(--cream)}
.messages::-webkit-scrollbar{width:5px}
.messages::-webkit-scrollbar-thumb{background:var(--sand);border-radius:100px}
.date-divider{display:flex;align-items:center;gap:.65rem;margin:.4rem 0}
.date-divider span{font-size:.7rem;color:var(--text-soft);white-space:nowrap}
.date-divider::before,.date-divider::after{content:'';flex:1;height:1px;background:var(--sand)}
.msg-row{display:flex;gap:.55rem;align-items:flex-end;animation:popIn .22s ease both}
@keyframes popIn{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
.msg-row.me{flex-direction:row-reverse}
.msg-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.62rem;font-weight:500;color:white;flex-shrink:0;margin-bottom:2px}
.bubble{max-width:66%;padding:.7rem .95rem;border-radius:17px;font-size:.84rem;line-height:1.55;position:relative}
.bubble-them{background:white;border:1px solid var(--sand);border-bottom-left-radius:4px;color:var(--text-dark)}
.bubble-me{background:var(--moss);color:white;border-bottom-right-radius:4px}
.bubble-time{font-size:.63rem;margin-top:.3rem;opacity:.6;display:block;text-align:right}
.bubble-me .bubble-time{color:rgba(255,255,255,.7)}
.bubble-them .bubble-time{color:var(--text-soft)}
.bubble-system{background:var(--sage-light);border:1px solid var(--sage);border-radius:12px;color:var(--moss);font-size:.76rem;padding:.55rem .95rem;text-align:center;margin:.2rem auto;max-width:320px}
.quick-replies{display:flex;gap:.45rem;flex-wrap:wrap;margin-top:.2rem;margin-left:34px}
.qr-btn{font-size:.74rem;padding:.32rem .8rem;border-radius:100px;border:1.5px solid var(--sage);background:white;color:var(--moss);cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
.qr-btn:hover{background:var(--sage-light)}
.typing-indicator{display:flex;gap:.55rem;align-items:flex-end}
.typing-bubble{background:white;border:1px solid var(--sand);border-radius:17px;border-bottom-left-radius:4px;padding:.65rem .95rem;display:flex;gap:4px;align-items:center}
.typing-dot{width:6px;height:6px;border-radius:50%;background:var(--sand-dark);animation:bounce .9s ease infinite}
.typing-dot:nth-child(2){animation-delay:.15s}
.typing-dot:nth-child(3){animation-delay:.3s}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
.chat-input-area{background:white;border-top:1px solid var(--sand);padding:.85rem 1.4rem;flex-shrink:0}
.input-toolbar{display:flex;gap:.4rem;margin-bottom:.55rem}
.tool-btn{width:29px;height:29px;border-radius:8px;border:1.5px solid var(--sand);background:var(--cream);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.82rem;transition:all .2s}
.tool-btn:hover{border-color:var(--sage);background:var(--sage-light)}
.input-row{display:flex;align-items:flex-end;gap:.65rem}
.input-box{flex:1;background:var(--cream);border:1.5px solid var(--sand);border-radius:14px;padding:.65rem .95rem;font-family:'DM Sans',sans-serif;font-size:.86rem;color:var(--text-dark);resize:none;outline:none;line-height:1.5;max-height:110px;transition:border-color .2s}
.input-box:focus{border-color:var(--sage);background:white}
.input-box::placeholder{color:var(--text-soft)}
.send-btn{width:40px;height:40px;border-radius:50%;background:var(--moss);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .2s;font-size:.95rem;color:white}
.send-btn:hover{background:var(--sage-dark);transform:scale(1.06)}
.send-btn:active{transform:scale(.94)}
.input-hint{font-size:.67rem;color:var(--text-soft);margin-top:.35rem}
.konselor-detail{width:250px;flex-shrink:0;background:white;border-left:1px solid var(--sand);display:flex;flex-direction:column;height:100vh;overflow-y:auto}
.konselor-detail::-webkit-scrollbar{width:4px}
.konselor-detail::-webkit-scrollbar-thumb{background:var(--sand);border-radius:100px}
.kd-section{padding:1rem 1.1rem;border-bottom:1px solid var(--sand)}
.kd-section:last-child{border-bottom:none}
.kd-label{font-size:.67rem;text-transform:uppercase;letter-spacing:.08em;color:var(--text-soft);margin-bottom:.7rem;font-weight:500}
.kd-avatar{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:500;color:white;margin:0 auto .7rem}
.kd-name{font-family:'Lora',serif;font-size:.92rem;font-weight:600;text-align:center;color:var(--text-dark);margin-bottom:2px}
.kd-role{font-size:.73rem;color:var(--text-soft);text-align:center;margin-bottom:.7rem}
.kd-stats{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}
.kd-stat{background:var(--cream);border-radius:10px;padding:.55rem;text-align:center;border:1px solid var(--sand)}
.kd-stat-val{font-family:'Lora',serif;font-size:.95rem;font-weight:600;color:var(--moss)}
.kd-stat-lbl{font-size:.63rem;color:var(--text-soft);margin-top:1px}
.kd-spec-tags{display:flex;gap:.3rem;flex-wrap:wrap}
.spec-tag{font-size:.67rem;padding:.25rem .7rem;border-radius:100px;background:var(--sage-light);color:var(--moss);border:1px solid var(--sage)}
.kd-book-btn{width:100%;padding:.65rem;border-radius:11px;background:var(--moss);border:none;color:white;font-family:'DM Sans',sans-serif;font-size:.82rem;font-weight:500;cursor:pointer;transition:all .2s;margin-top:.7rem}
.kd-book-btn:hover{background:var(--sage-dark)}
.sched-item{display:flex;align-items:center;gap:.65rem;padding:.55rem 0;border-bottom:1px solid var(--sand)}
.sched-item:last-child{border-bottom:none;padding-bottom:0}
.sched-date{width:36px;height:38px;background:var(--sage-light);border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.sched-d{font-size:.58rem;color:var(--moss);font-weight:500;text-transform:uppercase}
.sched-n{font-family:'Lora',serif;font-size:.9rem;font-weight:600;color:var(--moss);line-height:1}
.sched-info h4{font-size:.76rem;font-weight:500;color:var(--text-dark)}
.sched-info p{font-size:.69rem;color:var(--text-soft)}
</style>
