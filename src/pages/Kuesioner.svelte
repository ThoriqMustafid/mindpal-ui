<script>
  import Sidebar from '../components/Sidebar.svelte';
  import { fly } from 'svelte/transition';
  import { submitQuestionnaire } from '../lib/api/questionnaire.js';

  const questions = [
    {
      id: 1, cat: 'Mood', theme: 'sage', emoji: '😊',
      text: 'Bagaimana suasana hati kamu secara keseluruhan?',
      sub: 'Bayangkan rata-rata perasaanmu dalam seminggu terakhir.',
      type: 'emoji',
      options: [
        { e: '😢', l: 'Sangat buruk' }, { e: '😔', l: 'Buruk' }, { e: '😐', l: 'Biasa saja' }, { e: '🙂', l: 'Cukup baik' }, { e: '😊', l: 'Sangat baik' }
      ]
    },
    {
      id: 2, cat: 'Stres', theme: 'blush', emoji: '😰',
      text: 'Seberapa sering kamu merasa kewalahan atau stres?',
      sub: 'Pikirkan situasi di rumah, sekolah, atau tempat kerja.',
      type: 'options',
      options: [
        { text: 'Hampir tidak pernah — saya merasa cukup terkendali' },
        { text: 'Sesekali — biasanya masih bisa diatasi' },
        { text: 'Cukup sering — sering terasa berat' },
        { text: 'Hampir setiap hari — sangat menguras energi' },
      ]
    },
    {
      id: 3, cat: 'Tidur', theme: 'lavender', emoji: '💤',
      text: 'Bagaimana kualitas tidurmu belakangan ini?',
      sub: 'Termasuk kemudahan tidur, durasi, dan kualitas istirahat.',
      type: 'scale',
      scaleMin: 'Sangat buruk', scaleMax: 'Sangat baik',
    },
    {
      id: 4, cat: 'Kecemasan', theme: 'blush', emoji: '💭',
      text: 'Seberapa sering pikiran cemas mengganggu aktivitasmu?',
      sub: 'Misalnya rasa khawatir berlebihan, pikiran tidak bisa berhenti, atau takut tanpa alasan jelas.',
      type: 'options',
      options: [
        { text: 'Jarang sekali — saya bisa fokus dengan baik' },
        { text: 'Kadang-kadang — tidak terlalu mengganggu' },
        { text: 'Cukup sering — lumayan menganggu konsentrasi' },
        { text: 'Sangat sering — sulit sekali mengontrolnya' },
      ]
    },
    {
      id: 5, cat: 'Energi', theme: 'amber', emoji: '⚡',
      text: 'Bagaimana tingkat energi dan motivasimu sehari-hari?',
      sub: 'Apakah kamu merasa bersemangat menjalani hari, atau sebaliknya?',
      type: 'scale',
      scaleMin: 'Sangat rendah', scaleMax: 'Sangat tinggi',
    },
    {
      id: 6, cat: 'Sosial', theme: 'sky', emoji: '👥',
      text: 'Bagaimana hubunganmu dengan orang-orang di sekitarmu?',
      sub: 'Keluarga, teman, rekan kerja — apakah kamu merasa terhubung atau terisolasi?',
      type: 'options',
      options: [
        { text: 'Saya merasa sangat terhubung dan didukung' },
        { text: 'Cukup baik, meskipun ada kalanya merasa sendirian' },
        { text: 'Sering merasa kurang dimengerti atau kesepian' },
        { text: 'Saya cenderung menarik diri dari orang lain' },
      ]
    },
    {
      id: 7, cat: 'Mood', theme: 'sage', emoji: '🌱',
      text: 'Apakah ada hal yang ingin kamu ceritakan lebih lanjut?',
      sub: 'Opsional — kamu bisa berbagi situasi atau perasaan yang kamu alami saat ini.',
      type: 'textarea',
      placeholder: 'Tulis di sini jika ada yang ingin kamu ceritakan... (opsional)'
    },
    {
      id: 8, cat: 'Mood', theme: 'sage', emoji: '🎯',
      text: 'Apa tujuan utamamu menggunakan MindPal?',
      sub: 'Jawaban ini membantu kami menyesuaikan saran dan konten yang relevan untukmu.',
      type: 'options',
      options: [
        { text: 'Mengelola stres dan kecemasan sehari-hari' },
        { text: 'Meningkatkan kualitas tidur dan energi' },
        { text: 'Memahami kondisi emosional saya lebih baik' },
        { text: 'Mencari dukungan profesional yang tepat' },
      ]
    }
  ];

  const sectionLabels = ['Mood', 'Stres', 'Tidur', 'Kecemasan', 'Energi', 'Sosial', 'Refleksi', 'Tujuan'];
  let current = 0;
  let answers = new Array(questions.length).fill(null);
  let showResultScreen = false;
  let isSubmitting = false;
  let submitError = '';
  let questionnaireResult = null;

  const fallbackRecommendations = [
    'Latihan Mindfulness 10 Menit',
    'Panduan Tidur Lebih Berkualitas',
    'Konsultasi dengan Psikolog'
  ];

  $: currentQuestion = questions[current];
  $: progressPct = Math.round((current / questions.length) * 100);
  $: canProceed = answers[current] !== null || currentQuestion.type === 'textarea';
  $: scored = answers.filter(a => a !== null && a !== 'skipped').length;
  $: fallbackScore = Math.min(100, Math.round(55 + scored * 6));
  $: score = questionnaireResult?.total_score ? Math.min(100, Math.round((questionnaireResult.total_score / 42) * 100)) : fallbackScore;
  $: recommendations = questionnaireResult?.recommendations ?? fallbackRecommendations;

  function selectOption(i) {
    answers[current] = i;
    submitError = '';
  }

  function selectEmoji(i) {
    answers[current] = i;
    submitError = '';
  }

  function selectScale(n) {
    answers[current] = n;
    submitError = '';
  }

  function findFirstIncompleteRequired() {
    return answers.findIndex((answer, index) => index !== 6 && (answer === null || answer === 'skipped'));
  }

  async function submitAnswers() {
    const incompleteIndex = findFirstIncompleteRequired();

    if (incompleteIndex !== -1) {
      current = incompleteIndex;
      submitError = 'Lengkapi pertanyaan wajib sebelum melihat hasil.';
      return;
    }

    isSubmitting = true;
    submitError = '';

    try {
      questionnaireResult = await submitQuestionnaire(answers);
      showResultScreen = true;
    } catch (error) {
      submitError = error.response?.data?.message ?? 'Gagal mengirim kuesioner. Coba lagi sebentar.';
    } finally {
      isSubmitting = false;
    }
  }

  async function nextQ() {
    if (current < questions.length - 1) {
      current++;
    } else {
      await submitAnswers();
    }
  }

  function prevQ() {
    if (current > 0) {
      current--;
    }
  }

  function skipQ() {
    if (currentQuestion.type !== 'textarea') {
      submitError = 'Pertanyaan ini wajib dijawab.';
      return;
    }

    answers[current] = answers[current] ?? '';

    if (current < questions.length - 1) {
      current++;
    } else {
      showResultScreen = true;
    }
  }

  function goTo(i) {
    if (answers[i] !== null || i === current) {
      current = i;
    }
  }

  function goBack() {
    history.back();
  }

  function resetQuiz() {
    current = 0;
    answers = new Array(questions.length).fill(null);
    showResultScreen = false;
    questionnaireResult = null;
    submitError = '';
  }
</script>

<Sidebar />

<main class="layout-main">
  <div class="container">
    <header class="header">
      <button class="btn-back" on:click={goBack}>← Kembali ke Dashboard</button>
      <h1 class="page-title">Kuesioner Kesehatan Mental</h1>
      <p class="page-subtitle">Luangkan 5–10 menit untuk menjawab dengan jujur. Semua data bersifat privat.</p>
      {#if submitError}
        <p class="error-text">{submitError}</p>
      {/if}
    </header>

    <div class="card progress-card">
      <div class="progress-header">
        <span class="progress-text">
          {showResultScreen ? 'Kuesioner selesai!' : `Pertanyaan ${current + 1} dari ${questions.length}`}
        </span>
        <span class="progress-pct">
          {showResultScreen ? '100% selesai' : `${progressPct}% selesai`}
        </span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: {showResultScreen ? 100 : progressPct}%"></div>
      </div>
      <div class="progress-nav">
        {#each questions as q, i}
          <div class="nav-item" class:nav-active={i === current && !showResultScreen} class:nav-done={showResultScreen || (i < current && answers[i] !== null)} on:click={() => { if (!showResultScreen) goTo(i); }}>
            <div class="nav-circle">{i + 1}</div>
            <div class="nav-label">{sectionLabels[i]}</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="content-grid">
      <div class="card main-question-card" class:auto-height={showResultScreen}>
        {#if !showResultScreen}
          {#key current}
            <div in:fly={{ x: 18, duration: 350, opacity: 0 }} class="question-wrapper">
              <div class="question-header">
                <span class="badge badge-{currentQuestion.theme}">
                  {currentQuestion.emoji} {currentQuestion.cat}
                </span>
                <div class="question-counter">Pertanyaan {currentQuestion.id} dari {questions.length}</div>
                <h2 class="question-text">{currentQuestion.text}</h2>
                <p class="question-sub">{currentQuestion.sub}</p>
              </div>

              <div class="question-body">
                {#if currentQuestion.type === 'emoji'}
                  <div class="grid-emoji">
                    {#each currentQuestion.options as opt, i}
                      <button class="box-emoji" class:active={answers[current] === i} on:click={() => selectEmoji(i)}>
                        <span class="emoji-icon">{opt.e}</span>
                        <span class="emoji-label">{opt.l}</span>
                      </button>
                    {/each}
                  </div>
                {:else if currentQuestion.type === 'options'}
                  <div class="grid-options">
                    {#each currentQuestion.options as opt, i}
                      <button class="box-option" class:active={answers[current] === i} on:click={() => selectOption(i)}>
                        <div class="radio-circle">
                          <div class="radio-dot"></div>
                        </div>
                        <span class="option-label">{opt.text}</span>
                      </button>
                    {/each}
                  </div>
                {:else if currentQuestion.type === 'scale'}
                  <div class="scale-container">
                    <div class="scale-labels">
                      <span>{currentQuestion.scaleMin}</span>
                      <span>{currentQuestion.scaleMax}</span>
                    </div>
                    <div class="grid-scale">
                      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as n}
                        <button class="box-scale" class:active={answers[current] === n} on:click={() => selectScale(n)}>
                          {n}
                        </button>
                      {/each}
                    </div>
                  </div>
                {:else if currentQuestion.type === 'textarea'}
                  <div class="textarea-container">
                    <textarea rows="6" placeholder={currentQuestion.placeholder} bind:value={answers[current]} class="input-textarea"></textarea>
                  </div>
                {/if}
              </div>

              <div class="question-footer">
                <button class="btn-secondary" class:hidden={current === 0} on:click={prevQ}>← Sebelumnya</button>
                <button class="btn-skip" on:click={skipQ}>Lewati</button>
                <button class="btn-primary" disabled={!canProceed || isSubmitting} on:click={nextQ}>
                  {isSubmitting ? 'Mengirim...' : (current === questions.length - 1 ? 'Lihat Hasil ✨' : 'Lanjut →')}
                </button>
              </div>
            </div>
          {/key}
        {:else}
          <div in:fly={{ y: 12, duration: 400, opacity: 0 }} class="result-wrapper">
            <div class="result-icon-top">✨</div>
            <h2 class="result-title">Analisis Selesai!</h2>
            <p class="result-sub">Berdasarkan jawabanmu, AI MindPal telah menyusun profil kondisi mentalmu. Berikut ringkasannya.</p>

            <div class="chart-container">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="56" class="chart-bg"/>
                <circle cx="70" cy="70" r="56" class="chart-fill" stroke-dasharray="{Math.round(2*Math.PI*56*score/100)} {Math.round(2*Math.PI*56)}"/>
              </svg>
              <div class="chart-score">
                {score}
                <span>/ 100</span>
              </div>
            </div>

            <div class="tags-container">
              <span class="tag tag-sage">Mood: {questionnaireResult?.mood_status ?? 'Cukup Baik'}</span>
              <span class="tag tag-neutral">Stres: {questionnaireResult?.stress_status ?? 'Sedang'}</span>
              <span class="tag tag-sage">Tidur: {questionnaireResult?.sleep_status ?? 'Membaik'}</span>
              <span class="tag tag-neutral">Kecemasan: {questionnaireResult?.anxiety_status ?? 'Perlu Perhatian'}</span>
            </div>

            <div class="recommendation-box">
              <h3 class="box-title">Rekomendasi untukmu</h3>
              <div class="rec-item">
                <div class="rec-icon bg-sage-light">🧘</div>
                <div class="rec-text">
                  <h4>{recommendations[0] ?? fallbackRecommendations[0]}</h4>
                  <p>Cocok untuk mengurangi kecemasan yang sedang kamu alami</p>
                </div>
                <span class="rec-arrow">›</span>
              </div>
              <div class="rec-item">
                <div class="rec-icon bg-sage-light">💤</div>
                <div class="rec-text">
                  <h4>{recommendations[1] ?? fallbackRecommendations[1]}</h4>
                  <p>Tingkatkan rutinitas tidurmu dengan teknik sederhana</p>
                </div>
                <span class="rec-arrow">›</span>
              </div>
              <div class="rec-item">
                <div class="rec-icon bg-sage-light">💬</div>
                <div class="rec-text">
                  <h4>{recommendations[2] ?? fallbackRecommendations[2]}</h4>
                  <p>Disarankan untuk mendiskusikan kecemasan lebih lanjut</p>
                </div>
                <span class="rec-arrow">›</span>
              </div>
            </div>

            <div class="result-actions">
              <button class="btn-primary">Lihat Laporan Lengkap</button>
              <button class="btn-outline" on:click={resetQuiz}>Ulangi Kuesioner</button>
              <button class="btn-outline">Booking Konselor</button>
            </div>
          </div>
        {/if}
      </div>

      <aside class="sidebar-info">
        {#if !showResultScreen}
          <div class="card info-card">
            <h3 class="info-title">💡 Tips menjawab</h3>
            <div class="info-item">
              <span class="info-icon">🎯</span>
              <p>Jawab berdasarkan perasaan kamu dalam <strong>7 hari terakhir</strong>, bukan hari ini saja.</p>
            </div>
            <div class="info-item">
              <span class="info-icon">🔒</span>
              <p>Semua jawaban bersifat <strong>privat</strong> dan hanya digunakan untuk analisis pribadimu.</p>
            </div>
            <div class="info-item">
              <span class="info-icon">✨</span>
              <p>Tidak ada jawaban benar atau salah. Jujurlah dengan dirimu sendiri.</p>
            </div>
          </div>
          <div class="card info-card">
            <h3 class="info-title">📝 Progres jawabanmu</h3>
            <div class="progress-list">
              {#each questions as q, i}
                <div class="progress-list-item" class:active={answers[i] !== null || i === current}>
                  <div class="list-circle" class:done={answers[i] !== null && i !== current} class:current={i === current}>
                    {i === current ? '→' : (answers[i] !== null ? '✓' : '·')}
                  </div>
                  <span>{sectionLabels[i]}</span>
                </div>
              {/each}
            </div>
          </div>
        {:else}
          <div in:fly={{ y: 12, duration: 400, opacity: 0 }} class="card info-card">
            <h3 class="info-title">📊 Ringkasan Jawaban</h3>
            <div class="progress-list">
              {#each sectionLabels as l}
                <div class="progress-list-item active">
                  <div class="list-circle done">✓</div>
                  <span>{l}</span>
                </div>
              {/each}
            </div>
          </div>
          <div in:fly={{ y: 12, duration: 400, opacity: 0 }} class="card info-card">
            <h3 class="info-title">🔔 Langkah Selanjutnya</h3>
            <div class="info-item">
              <span class="info-icon">📋</span>
              <p>Laporan lengkap sudah tersedia di menu <strong>Laporan</strong>.</p>
            </div>
            <div class="info-item">
              <span class="info-icon">💬</span>
              <p>Coba booking sesi konseling pertamamu — gratis untuk pengguna baru.</p>
            </div>
            <div class="info-item">
              <span class="info-icon">🔁</span>
              <p>Ulangi kuesioner ini setiap minggu untuk memantau perkembanganmu.</p>
            </div>
          </div>
        {/if}
      </aside>
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
    --amber-light: #FEF3C7;
    --amber-dark: #B45309;
    --sky-light: #E6F0F9;
    --sky-dark: #5B8FB9;
  }

  * {
    box-sizing: border-box;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    background: none;
    border: none;
  }

  .layout-main {
    margin-left: 240px;
    min-height: 100vh;
    background-color: var(--cream);
    padding: 2rem;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark);
  }

  .container {
    max-width: 80rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .header {
    margin-bottom: 0.5rem;
  }

  .btn-back {
    color: var(--text-soft);
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.375rem;
    transition: color 0.2s;
  }

  .btn-back:hover {
    color: var(--moss);
  }

  .page-title {
    font-family: 'Lora', serif;
    font-size: 2.25rem;
    font-weight: bold;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    color: var(--text-mid);
    line-height: 1.6;
  }

  .error-text {
    color: var(--blush-dark);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .card {
    background: white;
    border: 1px solid var(--sand);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .progress-card {
    padding: 1.5rem 1.5rem;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }

  .progress-text {
    font-weight: 500;
  }

  .progress-pct {
    color: var(--text-soft);
  }

  .progress-track {
    height: 0.5rem;
    background: var(--sand);
    border-radius: 9999px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: var(--moss);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .progress-nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
    margin-top: 1rem;
  }

  @media (min-width: 768px) {
    .progress-nav {
      grid-template-columns: repeat(8, 1fr);
    }
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }

  .nav-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid var(--sand);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--text-soft);
    background: white;
    transition: all 0.2s;
  }

  .nav-label {
    font-size: 0.625rem;
    color: var(--text-soft);
  }

  .nav-active .nav-circle {
    background: var(--moss);
    border-color: var(--moss);
    color: white;
    box-shadow: 0 0 0 4px rgba(85, 124, 85, 0.2);
  }

  .nav-done .nav-circle {
    background: var(--moss);
    border-color: var(--moss);
    color: white;
  }

  .content-grid {
    display: grid;
    gap: 1.5rem;
    align-items: start;
  }

  @media (min-width: 1280px) {
    .content-grid {
      grid-template-columns: minmax(0, 1fr) 320px;
    }
  }

  .main-question-card {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
    min-height: 480px;
  }

  .main-question-card.auto-height {
    min-height: auto;
  }

  .question-wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .question-header {
    padding: 2rem 2rem 0;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 1rem;
  }

  .badge-sage { background: var(--sage-light); color: var(--moss); }
  .badge-blush { background: var(--blush-light); color: var(--blush-dark); }
  .badge-lavender { background: var(--lavender-light); color: #8E73A6; }
  .badge-amber { background: var(--amber-light); color: var(--amber-dark); }
  .badge-sky { background: var(--sky-light); color: var(--sky-dark); }

  .question-counter {
    font-size: 0.875rem;
    color: var(--text-soft);
    margin-bottom: 0.5rem;
  }

  .question-text {
    font-family: 'Lora', serif;
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1.25;
    margin-bottom: 0.75rem;
  }

  .question-sub {
    color: var(--text-mid);
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .question-body {
    padding: 0 2rem;
    flex: 1;
  }

  .grid-emoji {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .grid-emoji {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .box-emoji {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0.75rem;
    border: 1px solid var(--sand);
    border-radius: 1rem;
    transition: all 0.2s;
  }

  .box-emoji:hover {
    border-color: var(--moss);
    background: var(--sage-light);
    transform: translateY(-2px);
  }

  .box-emoji.active {
    border-color: var(--moss);
    background: var(--sage-light);
  }

  .emoji-icon { font-size: 1.8rem; }
  .emoji-label { font-size: 0.75rem; color: var(--text-mid); text-align: center; }

  .grid-options {
    display: grid;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .box-option {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid var(--sand);
    border-radius: 1rem;
    text-align: left;
    transition: all 0.2s;
  }

  .box-option:hover {
    border-color: var(--moss);
    background: var(--sage-light);
    transform: translateX(3px);
  }

  .box-option.active {
    border-color: var(--moss);
    background: var(--sage-light);
  }

  .radio-circle {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid var(--sand);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
  }

  .box-option.active .radio-circle {
    border-color: var(--moss);
    background: var(--moss);
  }

  .radio-dot {
    width: 0.5rem;
    height: 0.5rem;
    background: white;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .box-option.active .radio-dot {
    opacity: 1;
  }

  .option-label {
    font-size: 0.875rem;
    color: var(--text-dark);
  }

  .scale-container { margin-bottom: 2rem; }
  
  .scale-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-soft);
    margin-bottom: 0.5rem;
  }

  .grid-scale {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
  }

  @media (min-width: 768px) {
    .grid-scale { grid-template-columns: repeat(10, 1fr); }
  }

  .box-scale {
    height: 2.5rem;
    border: 1px solid var(--sand);
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-soft);
    transition: all 0.2s;
  }

  .box-scale:hover {
    border-color: var(--moss);
    background: var(--sage-light);
  }

  .box-scale.active {
    border-color: var(--moss);
    background: var(--moss);
    color: white;
  }

  .textarea-container { margin-bottom: 2rem; }
  
  .input-textarea {
    width: 100%;
    resize: none;
    border: 1px solid var(--sand);
    border-radius: 1rem;
    padding: 1rem;
    font-family: inherit;
    font-size: 0.875rem;
    color: var(--text-dark);
    line-height: 1.6;
    outline: none;
    transition: border-color 0.2s;
  }

  .input-textarea:focus { border-color: var(--moss); }
  .input-textarea::placeholder { color: var(--text-soft); }

  .question-footer {
    padding: 1.25rem 2rem;
    border-top: 1px solid var(--sand);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .btn-secondary {
    padding: 0.625rem 1.5rem;
    border: 1px solid var(--sand);
    border-radius: 9999px;
    font-size: 0.875rem;
    color: var(--text-dark);
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    border-color: var(--moss);
    color: var(--moss);
  }

  .btn-secondary.hidden { visibility: hidden; }

  .btn-skip {
    font-size: 0.875rem;
    color: var(--text-soft);
    transition: color 0.2s;
  }

  .btn-skip:hover { color: var(--moss); }

  .btn-primary {
    padding: 0.625rem 1.75rem;
    border-radius: 9999px;
    background: var(--moss);
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--sage-dark);
    transform: translateY(-1px);
  }

  .btn-primary:disabled {
    background: var(--sand-dark);
    cursor: not-allowed;
  }

  .result-wrapper {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .result-icon-top {
    width: 3rem;
    height: 3rem;
    background: var(--sage-light);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .result-title {
    font-family: 'Lora', serif;
    font-size: 1.875rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .result-sub {
    color: var(--text-mid);
    line-height: 1.6;
    max-width: 420px;
    margin-bottom: 2rem;
  }

  .chart-container {
    position: relative;
    width: 140px;
    height: 140px;
    margin-bottom: 2rem;
  }

  .chart-bg { stroke: var(--sand); stroke-width: 12; fill: none; }
  .chart-fill {
    stroke: var(--moss);
    stroke-width: 12;
    fill: none;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
  }

  .chart-score {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    font-weight: 600;
    color: var(--moss);
    line-height: 1;
  }

  .chart-score span {
    display: block;
    font-size: 0.75rem;
    font-weight: normal;
    color: var(--text-soft);
    margin-top: 0.25rem;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .tag {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .tag-sage { background: var(--sage-light); color: var(--moss); }
  .tag-neutral { background: var(--cream); border: 1px solid var(--sand); color: var(--text-dark); }

  .recommendation-box {
    width: 100%;
    text-align: left;
    margin-bottom: 2rem;
  }

  .box-title {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }

  .rec-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--sand);
    border-radius: 1rem;
    margin-bottom: 0.5rem;
    transition: border-color 0.2s;
    cursor: pointer;
  }

  .rec-item:hover { border-color: var(--moss); }

  .rec-icon {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .bg-sage-light { background: var(--sage-light); }

  .rec-text h4 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }

  .rec-text p {
    font-size: 0.75rem;
    color: var(--text-mid);
    margin: 0;
  }

  .rec-arrow {
    margin-left: auto;
    color: var(--text-soft);
  }

  .result-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  .btn-outline {
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--sand);
    border-radius: 9999px;
    background: white;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-dark);
    transition: all 0.2s;
  }

  .btn-outline:hover {
    border-color: var(--moss);
    color: var(--moss);
  }

  .sidebar-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-card {
    padding: 1.25rem;
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: var(--cream);
    border: 1px solid var(--sand);
    border-radius: 0.75rem;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .info-icon { font-size: 1rem; flex-shrink: 0; }
  .info-item p { font-size: 0.875rem; line-height: 1.6; color: var(--text-mid); margin: 0; }

  .progress-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .progress-list-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: var(--text-mid);
  }

  .progress-list-item.active { color: var(--text-dark); }

  .list-circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    background: var(--sand);
    color: var(--text-soft);
    flex-shrink: 0;
  }

  .list-circle.done {
    background: var(--sage-light);
    color: var(--moss);
  }

  .list-circle.current {
    background: var(--moss);
    color: white;
  }
</style>