<script>
  import { onMount } from 'svelte';
  import Sidebar from '../components/Sidebar.svelte';
  import { getMoodStats, logMood } from '../lib/api/mood.js';
  import { getCurrentUser } from '../lib/api/user.js';

  let userName = 'Arif';
  let streakCount = 14;
  let isLoadingDashboard = false;
  let moodSubmitStatus = '';
  let moodStats = {
    score: 7.4,
    changeText: '↑ +0.8 dari minggu lalu',
    changeClass: 'text-sage-dark',
    anxietyText: 'Rendah',
    anxietyChange: '↓ Turun 18% minggu ini',
    sessions: 3,
    sessionsText: '1 sesi berikutnya Rabu'
  };

  let selectedMood = 'Baik';
  let moodDistribution = {
    good: 40,
    okay: 30,
    sad: 20,
    great: 10
  };
  const moodScores = {
    'Sangat sedih': 1,
    'Sedih': 2,
    'Biasa': 3,
    'Baik': 4,
    'Sangat baik': 5
  };

  async function pickMood(mood) {
    selectedMood = mood;
    moodSubmitStatus = 'Menyimpan mood...';

    try {
      await logMood({
        moodScore: moodScores[mood],
        sleepQuality: 70,
        anxietyLevel: mood === 'Sangat sedih' || mood === 'Sedih' ? 70 : 35
      });
      moodSubmitStatus = 'Mood tersimpan';
      await loadMoodStats();
    } catch (error) {
      moodSubmitStatus = 'Gagal menyimpan mood';
    }
  }

  let moodData = [
    { day:'Sen', mood:62, sleep:70, anxiety:45 },
    { day:'Sel', mood:55, sleep:60, anxiety:55 },
    { day:'Rab', mood:48, sleep:55, anxiety:65 },
    { day:'Kam', mood:50, sleep:65, anxiety:58 },
    { day:'Jum', mood:70, sleep:75, anxiety:35 },
    { day:'Sab', mood:78, sleep:80, anxiety:28 },
    { day:'Min', mood:74, sleep:78, anxiety:30 }
  ];
  const maxH = 80;

  function getCollectionItems(value) {
    return value?.data ?? value ?? [];
  }

  function formatDay(dateValue) {
    return new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(new Date(dateValue));
  }

  function scoreToPercent(score) {
    return Math.round((Number(score) / 5) * 100);
  }

  function applyMoodStats(stats) {
    const trend = getCollectionItems(stats.trend_7_days);
    const distribution = stats.distribution ?? {};
    const totalDistribution = Object.values(distribution).reduce((total, value) => total + Number(value), 0);

    if (totalDistribution > 0) {
      moodDistribution = {
        good: Math.round((Number(distribution[4] ?? 0) / totalDistribution) * 100),
        okay: Math.round((Number(distribution[3] ?? 0) / totalDistribution) * 100),
        sad: Math.round((Number(distribution[1] ?? 0) + Number(distribution[2] ?? 0)) / totalDistribution * 100),
        great: Math.round((Number(distribution[5] ?? 0) / totalDistribution) * 100)
      };
    }

    if (trend.length > 0) {
      moodData = trend.map((item) => ({
        day: formatDay(item.logged_date),
        mood: scoreToPercent(item.mood_score),
        sleep: item.sleep_quality,
        anxiety: item.anxiety_level
      }));

      const averageMood = trend.reduce((total, item) => total + Number(item.mood_score), 0) / trend.length;
      moodStats.score = Number((averageMood * 2).toFixed(1));
      moodStats.anxietyText = trend.at(-1)?.anxiety_level > 65 ? 'Tinggi' : trend.at(-1)?.anxiety_level > 40 ? 'Sedang' : 'Rendah';
    }

    streakCount = stats.streak ?? streakCount;
  }

  async function loadMoodStats() {
    const stats = await getMoodStats();
    applyMoodStats(stats);
  }

  async function loadDashboardData() {
    isLoadingDashboard = true;

    try {
      const [user, stats] = await Promise.all([
        getCurrentUser(),
        getMoodStats()
      ]);

      userName = user.name ?? userName;
      applyMoodStats(stats);
    } catch (error) {
      // Keep the design populated with fallback data if the API is unavailable.
    } finally {
      isLoadingDashboard = false;
    }
  }

  onMount(loadDashboardData);
</script>

<Sidebar />

<main class="main">
  <div class="topbar">
    <div class="topbar-left">
      <h1>Selamat pagi, {userName} 👋</h1>
      <p>Senin, 28 April 2025 · Hari ke-{streakCount} bersama MindPal</p>
    </div>
    <div class="topbar-right">
      <div class="icon-btn" title="Notifikasi">🔔<div class="notif-dot"></div></div>
      <div class="icon-btn" title="Pencarian">🔍</div>
    </div>
  </div>

  <div class="mood-checkin">
    <div class="mc-left">
      <h2>Cek mood harianmu</h2>
      <p>{moodSubmitStatus || 'Bagaimana perasaanmu saat ini? Ceritakan pada kami.'}</p>
    </div>
    <div class="mc-moods">
      {#each [['Sangat sedih','😢'],['Sedih','😔'],['Biasa','😐'],['Baik','🙂'],['Sangat baik','😊']] as [label, emoji]}
        <div class="mc-mood {selectedMood === label ? 'sel' : ''}" on:click={() => pickMood(label)}>{emoji}</div>
      {/each}
    </div>
  </div>

  <div class="stat-row">
    <div class="stat-card">
      <div class="sc-top"><span class="sc-label">Skor Mood Minggu Ini</span><div class="sc-icon sci-sage">😊</div></div>
      <div class="sc-val">{moodStats.score}</div>
      <div class="sc-sub sc-up">{moodStats.changeText}</div>
    </div>
    <div class="stat-card">
      <div class="sc-top"><span class="sc-label">Level Kecemasan</span><div class="sc-icon sci-blush">😰</div></div>
      <div class="sc-val">{moodStats.anxietyText}</div>
      <div class="sc-sub sc-up">{moodStats.anxietyChange}</div>
    </div>
    <div class="stat-card">
      <div class="sc-top"><span class="sc-label">Sesi Konseling</span><div class="sc-icon sci-lavender">💬</div></div>
      <div class="sc-val">{moodStats.sessions}</div>
      <div class="sc-sub sc-neutral">{moodStats.sessionsText}</div>
    </div>
    <div class="stat-card">
      <div class="sc-top"><span class="sc-label">Streak Check-in</span><div class="sc-icon sci-amber">🔥</div></div>
      <div class="sc-val">{streakCount}</div>
      <div class="sc-sub sc-up">Hari berturut-turut!</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-head"><span class="card-title">Tren Mood 7 Hari</span><span class="card-link">Lihat laporan →</span></div>
      <div class="mood-chart">
        {#each moodData as d}
          <div class="bar-wrap">
            <div style="display:flex;align-items:flex-end;gap:2px;height:80px;width:100%">
              <div class="bar" style="flex:1;background:#b5c9b1;height:{Math.round(d.mood/100*maxH)}px"></div>
              <div class="bar" style="flex:1;background:#c5bdd8;height:{Math.round(d.sleep/100*maxH)}px"></div>
              <div class="bar" style="flex:1;background:#e8c9c1;height:{Math.round(d.anxiety/100*maxH)}px"></div>
            </div>
            <div class="bar-day">{d.day}</div>
          </div>
        {/each}
      </div>
      <div class="mood-legend">
        <div class="legend-item"><div class="legend-dot" style="background:#b5c9b1"></div>Mood harian</div>
        <div class="legend-item"><div class="legend-dot" style="background:#c5bdd8"></div>Kualitas tidur</div>
        <div class="legend-item"><div class="legend-dot" style="background:#e8c9c1"></div>Kecemasan</div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-title">✨ Insight dari AI</span><span class="card-link">Semua →</span></div>
      <div class="insight-list">
        <div class="insight-item"><div class="ins-icon" style="background:#ddebd9">💤</div><div class="ins-body"><h4>Tidur lebih awal = mood lebih baik</h4><p>Data 2 minggu terakhir menunjukkan mood kamu 32% lebih tinggi saat tidur sebelum jam 23.00.</p></div></div>
        <div class="insight-item"><div class="ins-icon" style="background:#ebe7f2">🧘</div><div class="ins-body"><h4>Meditasi rutin terbukti efektif</h4><p>Kecemasan kamu turun signifikan di hari-hari ketika kamu berlatih pernapasan.</p></div></div>
        <div class="insight-item"><div class="ins-icon" style="background:#f7f0d8">⚠️</div><div class="ins-body"><h4>Perhatikan Rabu &amp; Kamis</h4><p>Mood kamu cenderung lebih rendah di pertengahan minggu. Coba atur jadwal istirahat lebih baik.</p></div></div>
      </div>
    </div>
  </div>

  <div class="grid-3">
    <div class="card">
      <div class="card-head"><span class="card-title">Jadwal Konseling</span><span class="card-link">+ Booking →</span></div>
      <div class="session-list">
        <div class="session-item"><div class="sess-date"><span class="sess-day">Rab</span><span class="sess-num">30</span></div><div class="sess-info"><h4>Dr. Amira Putri, M.Psi</h4><p>14.00 – 15.00 WIB · Online</p></div><span class="sess-badge sb-online">Konfirmasi</span></div>
        <div class="session-item"><div class="sess-date" style="background:#f5e6e2"><span class="sess-day" style="color:#c9857a">Sen</span><span class="sess-num" style="color:#c9857a">5</span></div><div class="sess-info"><h4>Budi Santoso, S.Psi</h4><p>10.00 – 11.00 WIB · Online</p></div><span class="sess-badge sb-pending">Menunggu</span></div>
        <div class="session-item"><div class="sess-date" style="background:#ebe7f2"><span class="sess-day" style="color:#9389b8">Jum</span><span class="sess-num" style="color:#9389b8">9</span></div><div class="sess-info"><h4>Dr. Amira Putri, M.Psi</h4><p>13.00 – 14.00 WIB · Online</p></div><span class="sess-badge sb-pending">Menunggu</span></div>
      </div>
    </div>
    <div class="card" style="text-align:center">
      <div class="card-head"><span class="card-title">Distribusi Mood Bulan Ini</span></div>
      <div class="mood-ring-wrap">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="52" fill="none" stroke="#e8e0d4" stroke-width="18"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="#b5c9b1" stroke-width="18" stroke-dasharray="130.6 196.5" stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="#c5bdd8" stroke-width="18" stroke-dasharray="97.9 229.2" stroke-dashoffset="-130.6" stroke-linecap="round" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="#e8c9c1" stroke-width="18" stroke-dasharray="65.3 261.8" stroke-dashoffset="-228.5" stroke-linecap="round" transform="rotate(-90 65 65)"/>
          <circle cx="65" cy="65" r="52" fill="none" stroke="#e8c87a" stroke-width="18" stroke-dasharray="32.7 294.5" stroke-dashoffset="-293.8" stroke-linecap="round" transform="rotate(-90 65 65)"/>
          <text x="65" y="60" text-anchor="middle" font-family="Lora,serif" font-size="18" font-weight="600" fill="#4a6741">{moodStats.score}</text>
          <text x="65" y="75" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="9" fill="#8c8680">rata-rata</text>
        </svg>
      </div>
      <div class="mood-ring-labels">
        <div class="mrl-item"><div class="mrl-dot" style="background:#b5c9b1"></div>Baik ({moodDistribution.good}%)</div>
        <div class="mrl-item"><div class="mrl-dot" style="background:#c5bdd8"></div>Cukup ({moodDistribution.okay}%)</div>
        <div class="mrl-item"><div class="mrl-dot" style="background:#e8c9c1"></div>Sedih ({moodDistribution.sad}%)</div>
        <div class="mrl-item"><div class="mrl-dot" style="background:#e8c87a"></div>Sangat baik ({moodDistribution.great}%)</div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-title">Sumber Belajar Untukmu</span><span class="card-link">Semua →</span></div>
      <div class="resource-list">
        <div class="resource-item"><div class="res-thumb" style="background:#ebe7f2">🧘</div><div class="res-info"><h4>Teknik Pernapasan 4-7-8</h4><p>Artikel · 5 menit baca</p></div><div class="res-arrow">›</div></div>
        <div class="resource-item"><div class="res-thumb" style="background:#ddebd9">💤</div><div class="res-info"><h4>Memperbaiki Kualitas Tidur</h4><p>Video · 12 menit</p></div><div class="res-arrow">›</div></div>
        <div class="resource-item"><div class="res-thumb" style="background:#f5e6e2">🧠</div><div class="res-info"><h4>Mengenal CBT untuk Pemula</h4><p>Panduan · 10 menit baca</p></div><div class="res-arrow">›</div></div>
        <div class="resource-item"><div class="res-thumb" style="background:#f7f0d8">📝</div><div class="res-info"><h4>Journaling untuk Kesehatan Mental</h4><p>Artikel · 7 menit baca</p></div><div class="res-arrow">›</div></div>
      </div>
    </div>
  </div>

  <div class="grid-2b">
    <div class="card">
      <div class="card-head"><span class="card-title">Dari Komunitas</span><span class="card-link">Lihat semua →</span></div>
      <div class="community-posts">
        <div class="post-item"><div class="post-head"><div class="post-avatar" style="background:#7a9e76">RA</div><span class="post-name">Rania A.</span><span class="post-time">2j lalu</span></div><div class="post-text">Setelah 3 minggu rutin meditasi pagi, gue ngerasa jauh lebih fokus dan tenang. Ada yang punya tips lain buat jaga konsistensi? 🌿</div><div class="post-actions"><div class="post-action">❤ 24</div><div class="post-action">💬 8 komentar</div></div></div>
        <div class="post-item"><div class="post-head"><div class="post-avatar" style="background:#9389b8">DB</div><span class="post-name">Dimas B.</span><span class="post-time">5j lalu</span></div><div class="post-text">Sharing: teknik grounding 5-4-3-2-1 beneran ngebantu banget pas gue lagi panik. Cobain deh, teman-teman. 💙</div><div class="post-actions"><div class="post-action">❤ 41</div><div class="post-action">💬 15 komentar</div></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><span class="card-title">Check-in Streak</span><span class="card-link">Lihat detail →</span></div>
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:.75rem">
        <div><div class="streak-num">{streakCount} 🔥</div><div class="streak-label">hari berturut-turut</div></div>
        <div style="flex:1;background:#ddebd9;border-radius:12px;padding:.75rem">
          <div style="font-size:.75rem;color:#4a6741;font-weight:500">Target berikutnya</div>
          <div style="font-size:.8rem;color:#5c5751;margin-top:2px">21 hari — tinggal 7 hari lagi!</div>
          <div style="height:5px;background:#e8e0d4;border-radius:100px;margin-top:.5rem;overflow:hidden"><div style="height:100%;width:66%;background:#7a9e76;border-radius:100px"></div></div>
        </div>
      </div>
      <div class="streak-grid">
        {#each Array(28) as _, i}
          <div class="streak-dot {i < streakCount - 1 ? 'done' : (i === streakCount - 1 ? 'today' : '')}"></div>
        {/each}
      </div>
      <div style="display:flex;gap:8px;margin-top:.5rem;font-size:.7rem;color:#8c8680;align-items:center">
        <div style="width:12px;height:12px;border-radius:3px;background:#b5c9b1"></div>Selesai
        <div style="width:12px;height:12px;border-radius:3px;background:#4a6741"></div>Hari ini
        <div style="width:12px;height:12px;border-radius:3px;background:#e8e0d4"></div>Belum
      </div>
    </div>
  </div>
</main>

<style>
.main{margin-left:var(--sidebar-w);flex:1;padding:2rem 2.25rem;min-height:100vh;background:var(--cream)}
.topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem}
.topbar-left h1{font-family:'Lora',serif;font-size:1.55rem;font-weight:600;color:var(--text-dark)}
.topbar-left p{font-size:0.85rem;color:var(--text-soft);margin-top:2px}
.topbar-right{display:flex;align-items:center;gap:10px}
.icon-btn{width:38px;height:38px;border-radius:50%;background:white;border:1px solid var(--sand);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer;transition:background .15s,border-color .15s;position:relative}
.icon-btn:hover{background:var(--sage-light);border-color:var(--sage)}
.notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--blush-dark);border-radius:50%;border:1.5px solid white}
.mood-checkin{background:linear-gradient(135deg,var(--moss) 0%,var(--sage-dark) 100%);border-radius:20px;padding:1.5rem 1.75rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.mood-checkin::before{content:'';position:absolute;right:-30px;top:-40px;width:160px;height:160px;background:rgba(255,255,255,.07);border-radius:50%}
.mood-checkin::after{content:'';position:absolute;right:60px;bottom:-60px;width:120px;height:120px;background:rgba(255,255,255,.05);border-radius:50%}
.mc-left h2{font-family:'Lora',serif;font-size:1.1rem;font-weight:600;color:white;margin-bottom:4px}
.mc-left p{font-size:0.82rem;color:rgba(255,255,255,.7)}
.mc-moods{display:flex;gap:8px;z-index:1;position:relative}
.mc-mood{width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:1.3rem;cursor:pointer;transition:background .2s,transform .15s}
.mc-mood:hover{background:rgba(255,255,255,.3);transform:scale(1.1)}
.mc-mood.sel{background:rgba(255,255,255,.35);border-color:white;transform:scale(1.12)}
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
.stat-card{background:white;border-radius:16px;padding:1.1rem 1.25rem;border:1px solid var(--sand);transition:transform .2s,border-color .2s}
.stat-card:hover{transform:translateY(-3px);border-color:var(--sage)}
.sc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem}
.sc-label{font-size:.75rem;color:var(--text-soft);font-weight:400}
.sc-icon{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:.9rem}
.sci-sage{background:var(--sage-light)}.sci-blush{background:var(--blush-light)}.sci-lavender{background:var(--lavender-light)}.sci-amber{background:var(--amber-light)}
.sc-val{font-family:'Lora',serif;font-size:1.7rem;font-weight:600;color:var(--text-dark);line-height:1}
.sc-sub{font-size:.72rem;margin-top:5px}
.sc-up{color:var(--sage-dark)}.sc-down{color:var(--blush-dark)}.sc-neutral{color:var(--text-soft)}
.grid-2{display:grid;grid-template-columns:1.4fr 1fr;gap:1.25rem;margin-bottom:1.25rem}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem;margin-bottom:1.25rem}
.grid-2b{display:grid;grid-template-columns:1fr 1.2fr;gap:1.25rem}
.card{background:white;border-radius:18px;padding:1.25rem 1.4rem;border:1px solid var(--sand)}
.card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem}
.card-title{font-size:.88rem;font-weight:500;color:var(--text-dark)}
.card-link{font-size:.75rem;color:var(--sage-dark);cursor:pointer;transition:opacity .2s}
.card-link:hover{opacity:.7}
.mood-chart{display:flex;align-items:flex-end;gap:6px;height:80px;margin-bottom:.75rem}
.bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px}
.bar{width:100%;border-radius:6px 6px 0 0;transition:opacity .2s;cursor:pointer;position:relative;min-height:4px}
.bar:hover{opacity:.75}
.bar-day{font-size:.65rem;color:var(--text-soft)}
.mood-legend{display:flex;gap:12px;flex-wrap:wrap}
.legend-item{display:flex;align-items:center;gap:5px;font-size:.72rem;color:var(--text-soft)}
.legend-dot{width:8px;height:8px;border-radius:50%}
.insight-list{display:flex;flex-direction:column;gap:.75rem}
.insight-item{display:flex;align-items:flex-start;gap:.85rem;background:var(--cream);border-radius:12px;padding:.85rem 1rem;border:1px solid var(--sand);transition:border-color .2s;cursor:pointer}
.insight-item:hover{border-color:var(--sage)}
.ins-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
.ins-body h4{font-size:.82rem;font-weight:500;color:var(--text-dark);margin-bottom:2px}
.ins-body p{font-size:.75rem;color:var(--text-soft);line-height:1.45}
.session-list{display:flex;flex-direction:column;gap:.75rem}
.session-item{display:flex;align-items:center;gap:.85rem;padding:.85rem 0;border-bottom:1px solid var(--sand)}
.session-item:last-child{border-bottom:none;padding-bottom:0}
.sess-date{width:42px;height:46px;border-radius:12px;background:var(--sage-light);display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0}
.sess-day{font-size:.65rem;color:var(--moss);font-weight:500;text-transform:uppercase;letter-spacing:.05em}
.sess-num{font-family:'Lora',serif;font-size:1.1rem;font-weight:600;color:var(--moss);line-height:1}
.sess-info h4{font-size:.83rem;font-weight:500;color:var(--text-dark);margin-bottom:2px}
.sess-info p{font-size:.73rem;color:var(--text-soft)}
.sess-badge{margin-left:auto;font-size:.68rem;padding:3px 9px;border-radius:100px;font-weight:500}
.sb-online{background:var(--sage-light);color:var(--moss)}.sb-pending{background:var(--amber-light);color:var(--amber-dark)}
.mood-ring-wrap{display:flex;justify-content:center;margin:1rem 0 .5rem}
.mood-ring-labels{display:grid;grid-template-columns:1fr 1fr;gap:4px 1rem}
.mrl-item{display:flex;align-items:center;gap:6px;font-size:.72rem;color:var(--text-mid)}
.mrl-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.resource-list{display:flex;flex-direction:column;gap:.65rem}
.resource-item{display:flex;align-items:center;gap:.85rem;padding:.75rem;border-radius:12px;background:var(--cream);border:1px solid var(--sand);cursor:pointer;transition:border-color .2s,background .2s}
.resource-item:hover{border-color:var(--sage);background:var(--sage-light)}
.res-thumb{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0}
.res-info h4{font-size:.8rem;font-weight:500;color:var(--text-dark);margin-bottom:2px}
.res-info p{font-size:.7rem;color:var(--text-soft)}
.res-arrow{margin-left:auto;color:var(--text-soft);font-size:.9rem}
.community-posts{display:flex;flex-direction:column;gap:.75rem}
.post-item{padding:.9rem;border-radius:12px;background:var(--cream);border:1px solid var(--sand);cursor:pointer;transition:border-color .2s}
.post-item:hover{border-color:var(--lavender)}
.post-head{display:flex;align-items:center;gap:8px;margin-bottom:.5rem}
.post-avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;font-weight:500;color:white}
.post-name{font-size:.78rem;font-weight:500;color:var(--text-dark)}
.post-time{font-size:.68rem;color:var(--text-soft);margin-left:auto}
.post-text{font-size:.78rem;color:var(--text-mid);line-height:1.5;margin-bottom:.5rem}
.post-actions{display:flex;gap:12px}
.post-action{font-size:.7rem;color:var(--text-soft);display:flex;align-items:center;gap:4px;cursor:pointer;transition:color .2s}
.post-action:hover{color:var(--moss)}
.streak-grid{display:flex;gap:5px;flex-wrap:wrap;margin:.5rem 0}
.streak-dot{width:20px;height:20px;border-radius:5px;background:var(--sand);transition:background .2s;cursor:pointer}
.streak-dot.done{background:var(--sage)}
.streak-dot.today{background:var(--moss);box-shadow:0 0 0 2px var(--sage)}
.streak-dot:hover{opacity:.75}
.streak-num{font-family:'Lora',serif;font-size:1.5rem;font-weight:600;color:var(--moss)}
.streak-label{font-size:.72rem;color:var(--text-soft)}
</style>
