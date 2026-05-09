<script>
  import Sidebar from '../components/Sidebar.svelte';
  import { fly } from 'svelte/transition';
  import { submitQuestionnaire } from '../lib/api/questionnaire.js';

  const questions = [
    {
      id: 1, cat: 'Mood', catClass: 'bg-sage-light text-moss', emoji: '😊',
      text: 'Bagaimana suasana hati kamu secara keseluruhan?',
      sub: 'Bayangkan rata-rata perasaanmu dalam seminggu terakhir.',
      type: 'emoji',
      options: [
        { e: '😢', l: 'Sangat buruk' }, { e: '😔', l: 'Buruk' }, { e: '😐', l: 'Biasa saja' }, { e: '🙂', l: 'Cukup baik' }, { e: '😊', l: 'Sangat baik' }
      ]
    },
    {
      id: 2, cat: 'Stres', catClass: 'bg-blush-light text-blush-dark', emoji: '😰',
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
      id: 3, cat: 'Tidur', catClass: 'bg-lavender-light text-lavender-dark', emoji: '💤',
      text: 'Bagaimana kualitas tidurmu belakangan ini?',
      sub: 'Termasuk kemudahan tidur, durasi, dan kualitas istirahat.',
      type: 'scale',
      scaleMin: 'Sangat buruk', scaleMax: 'Sangat baik',
    },
    {
      id: 4, cat: 'Kecemasan', catClass: 'bg-blush-light text-blush-dark', emoji: '💭',
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
      id: 5, cat: 'Energi', catClass: 'bg-amber-light text-amber-dark', emoji: '⚡',
      text: 'Bagaimana tingkat energi dan motivasimu sehari-hari?',
      sub: 'Apakah kamu merasa bersemangat menjalani hari, atau sebaliknya?',
      type: 'scale',
      scaleMin: 'Sangat rendah', scaleMax: 'Sangat tinggi',
    },
    {
      id: 6, cat: 'Sosial', catClass: 'bg-sky-light text-sky-dark', emoji: '👥',
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
      id: 7, cat: 'Mood', catClass: 'bg-sage-light text-moss', emoji: '🌱',
      text: 'Apakah ada hal yang ingin kamu ceritakan lebih lanjut?',
      sub: 'Opsional — kamu bisa berbagi situasi atau perasaan yang kamu alami saat ini.',
      type: 'textarea',
      placeholder: 'Tulis di sini jika ada yang ingin kamu ceritakan... (opsional)'
    },
    {
      id: 8, cat: 'Mood', catClass: 'bg-sage-light text-moss', emoji: '🎯',
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

<main class="ml-[240px] flex-1 py-8 px-9 min-h-screen bg-cream flex flex-col">
  <div class="flex items-center justify-between mb-8">
    <div>
      <button class="flex items-center gap-[6px] text-[0.85rem] text-text-mid cursor-pointer transition-colors duration-200 bg-transparent border-none font-sans hover:text-moss" on:click={goBack}>← Kembali ke Dashboard</button>
      <h1 class="font-lora text-[1.55rem] font-semibold text-text-dark mt-[0.3rem]">Kuesioner Kesehatan Mental</h1>
      <p class="text-[0.85rem] text-text-soft mt-[2px]">Luangkan 5–10 menit untuk menjawab dengan jujur. Semua data bersifat privat.</p>
      {#if submitError}
        <p class="text-[0.8rem] text-blush-dark mt-2">{submitError}</p>
      {/if}
    </div>
  </div>

  <div class="bg-white rounded-2xl border border-sand py-5 px-6 mb-5">
    <div class="flex justify-between items-center mb-3">
      <span class="text-[0.8rem] text-text-mid font-medium">{showResultScreen ? 'Kuesioner selesai!' : `Pertanyaan ${current + 1} dari ${questions.length}`}</span>
      <span class="text-[0.78rem] text-text-soft">{showResultScreen ? '100% selesai' : `${progressPct}% selesai`}</span>
    </div>
    <div class="h-2 bg-sand rounded-full overflow-hidden">
      <div class="h-full rounded-full bg-gradient-to-r from-sage to-sage-dark transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style="width: {showResultScreen ? 100 : progressPct}%"></div>
    </div>
    <div class="flex justify-between mt-3">
      {#each questions as q, i}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="flex flex-col items-center gap-1 cursor-pointer" on:click={() => { if (!showResultScreen) goTo(i); }}>
          <div class="w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center text-[0.6rem] font-medium transition-all duration-200 {showResultScreen || (i < current && answers[i] !== null) ? 'bg-sage border-sage text-white' : (i === current && !showResultScreen ? 'bg-moss border-moss text-white shadow-[0_0_0_4px_rgba(74,103,65,0.15)]' : 'border-sand bg-white text-text-soft')}">
            {i + 1}
          </div>
          <div class="text-[0.6rem] text-text-soft">{sectionLabels[i]}</div>
        </div>
      {/each}
    </div>
  </div>

  <div class="grid grid-cols-[1fr_300px] gap-6 items-start">
    <div class="bg-white rounded-[20px] border border-sand overflow-hidden flex flex-col {showResultScreen ? '' : 'min-h-[420px]'}">
      {#if !showResultScreen}
        {#key current}
          <div in:fly={{ x: 18, duration: 350, opacity: 0 }} class="flex flex-col flex-1">
            <div class="pt-6 px-7">
              <span class="inline-flex items-center gap-[6px] text-[0.72rem] font-medium tracking-[0.06em] uppercase py-[0.3rem] px-[0.85rem] rounded-full mb-4 {currentQuestion.catClass}">
                {currentQuestion.emoji} {currentQuestion.cat}
              </span>
              <div class="text-[0.75rem] text-text-soft mb-2">Pertanyaan {currentQuestion.id} dari {questions.length}</div>
              <div class="font-lora text-[1.3rem] font-semibold leading-[1.4] text-text-dark mb-2">{currentQuestion.text}</div>
              <div class="text-[0.83rem] text-text-soft leading-[1.5] mb-6 italic">{currentQuestion.sub}</div>
            </div>

            <div class="px-7 pb-7 flex-1 flex flex-col justify-between">
              <div>
                {#if currentQuestion.type === 'emoji'}
                  <div class="grid grid-cols-5 gap-[0.6rem] mb-6">
                    {#each currentQuestion.options as opt, i}
                      <!-- svelte-ignore a11y_click_events_have_key_events -->
                      <!-- svelte-ignore a11y_no_static_element_interactions -->
                      <div class="flex flex-col items-center gap-[0.4rem] py-3 px-2 rounded-[14px] border-[1.5px] cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:border-sage hover:bg-sage-light {answers[current] === i ? 'border-moss bg-sage-light' : 'border-sand bg-cream'}" on:click={() => selectEmoji(i)}>
                        <div class="text-[1.8rem]">{opt.e}</div>
                        <div class="text-[0.65rem] text-text-soft text-center">{opt.l}</div>
                      </div>
                    {/each}
                  </div>
                {:else if currentQuestion.type === 'options'}
                  <div class="flex flex-col gap-[0.6rem] mb-6">
                    {#each currentQuestion.options as opt, i}
                      <!-- svelte-ignore a11y_click_events_have_key_events -->
                      <!-- svelte-ignore a11y_no_static_element_interactions -->
                      <div class="flex items-center gap-4 py-[0.85rem] px-[1.1rem] rounded-[14px] border-[1.5px] cursor-pointer transition-all duration-200 text-left font-sans hover:translate-x-[3px] hover:border-sage hover:bg-sage-light {answers[current] === i ? 'border-moss bg-sage-light' : 'border-sand bg-cream'}" on:click={() => selectOption(i)}>
                        <div class="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 relative {answers[current] === i ? 'border-moss bg-moss' : 'border-sand-dark bg-white'}">
                          <div class="w-2 h-2 rounded-full bg-white transition-opacity duration-200 {answers[current] === i ? 'opacity-100' : 'opacity-0'}"></div>
                        </div>
                        <span class="text-[0.88rem] text-text-mid">{opt.text}</span>
                      </div>
                    {/each}
                  </div>
                {:else if currentQuestion.type === 'scale'}
                  <div class="mb-6">
                    <div class="flex justify-between text-[0.72rem] text-text-soft mb-2">
                      <span>{currentQuestion.scaleMin}</span>
                      <span>{currentQuestion.scaleMax}</span>
                    </div>
                    <div class="relative h-9 flex items-center gap-[6px]">
                      {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as n}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div class="flex-1 h-9 rounded-[9px] border-[1.5px] cursor-pointer flex items-center justify-center text-[0.8rem] font-medium transition-all duration-200 {answers[current] === n ? 'border-moss bg-moss text-white' : 'border-sand bg-cream text-text-soft hover:border-sage hover:bg-sage-light'}" on:click={() => selectScale(n)}>
                          {n}
                        </div>
                      {/each}
                    </div>
                  </div>
                {:else if currentQuestion.type === 'textarea'}
                  <div class="mb-6">
                    <textarea rows="5" placeholder={currentQuestion.placeholder} bind:value={answers[current]} class="w-full border-[1.5px] border-sand rounded-[14px] py-[0.9rem] px-4 font-sans text-[0.88rem] text-text-dark bg-cream resize-none outline-none leading-[1.6] transition-colors duration-200 focus:border-sage focus:bg-white placeholder:text-text-soft"></textarea>
                  </div>
                {/if}
              </div>

              <div class="flex justify-between items-center pt-4 border-t border-sand">
                <button class="bg-transparent border-[1.5px] border-sand text-text-mid py-[0.65rem] px-[1.4rem] rounded-full font-sans text-[0.85rem] cursor-pointer transition-all duration-200 hover:border-sage-dark hover:text-moss {current === 0 ? 'invisible' : ''}" on:click={prevQ}>← Sebelumnya</button>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <span class="text-[0.75rem] text-text-soft cursor-pointer transition-colors duration-200 hover:text-moss" on:click={skipQ}>Lewati</span>
                <button class="border-none py-[0.65rem] px-[1.75rem] rounded-full font-sans text-[0.85rem] font-medium transition-all duration-200 flex items-center gap-[6px] {canProceed && !isSubmitting ? 'bg-moss text-white hover:bg-sage-dark hover:-translate-y-[1px] cursor-pointer' : 'bg-sand-dark text-white cursor-not-allowed'}" disabled={!canProceed || isSubmitting} on:click={nextQ}>
                  {isSubmitting ? 'Mengirim...' : (current === questions.length - 1 ? 'Lihat Hasil ✨' : 'Lanjut →')}
                </button>
              </div>
            </div>
          </div>
        {/key}
      {:else}
        <div in:fly={{ y: 12, duration: 400, opacity: 0 }} class="flex flex-col items-center text-center p-8">
          <div class="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center text-[1.5rem] mx-auto mb-3">✨</div>
          <div class="font-lora text-[1.4rem] font-semibold text-text-dark mb-2">Analisis Selesai!</div>
          <div class="text-[0.88rem] text-text-mid leading-[1.6] max-w-[380px] mx-auto mb-6">Berdasarkan jawabanmu, AI MindPal telah menyusun profil kondisi mentalmu. Berikut ringkasannya.</div>

          <div class="mx-auto mb-6 relative w-[140px] h-[140px]">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="56" fill="none" class="stroke-sand" stroke-width="12"/>
              <circle cx="70" cy="70" r="56" fill="none" class="stroke-sage transition-[stroke-dasharray] duration-1000 ease-in-out" stroke-width="12"
                stroke-dasharray="{Math.round(2*Math.PI*56*score/100)} {Math.round(2*Math.PI*56)}"
                stroke-dashoffset="0" stroke-linecap="round" transform="rotate(-90 70 70)"/>
            </svg>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-lora text-[2rem] font-semibold text-moss">
              {score}
              <span class="block font-sans text-[0.7rem] font-normal text-text-soft">/ 100</span>
            </div>
          </div>

          <div class="flex gap-2 justify-center flex-wrap mb-6">
            <span class="py-[0.3rem] px-[0.9rem] rounded-full text-[0.75rem] font-medium bg-sage-light text-moss">Mood: {questionnaireResult?.mood_status ?? 'Cukup Baik'}</span>
            <span class="py-[0.3rem] px-[0.9rem] rounded-full text-[0.75rem] font-medium bg-amber-light text-amber-dark">Stres: {questionnaireResult?.stress_status ?? 'Sedang'}</span>
            <span class="py-[0.3rem] px-[0.9rem] rounded-full text-[0.75rem] font-medium bg-sage-light text-moss">Tidur: {questionnaireResult?.sleep_status ?? 'Membaik'}</span>
            <span class="py-[0.3rem] px-[0.9rem] rounded-full text-[0.75rem] font-medium bg-blush-light text-blush-dark">Kecemasan: {questionnaireResult?.anxiety_status ?? 'Perlu Perhatian'}</span>
          </div>

          <div class="mt-6 w-full text-left">
            <div class="text-[0.82rem] font-medium text-text-dark mb-3">Rekomendasi untukmu</div>
            <div class="flex items-center gap-[0.85rem] py-[0.85rem] px-4 bg-cream rounded-xl border border-sand mb-2.5 cursor-pointer transition-colors duration-200 hover:border-sage">
              <div class="w-9 h-9 rounded-[10px] bg-lavender-light flex items-center justify-center text-base shrink-0">🧘</div>
              <div>
                <h4 class="text-[0.82rem] font-medium text-text-dark">{recommendations[0] ?? fallbackRecommendations[0]}</h4>
                <p class="text-[0.72rem] text-text-soft">Cocok untuk mengurangi kecemasan yang sedang kamu alami</p>
              </div>
              <span class="ml-auto text-text-soft">›</span>
            </div>
            <div class="flex items-center gap-[0.85rem] py-[0.85rem] px-4 bg-cream rounded-xl border border-sand mb-2.5 cursor-pointer transition-colors duration-200 hover:border-sage">
              <div class="w-9 h-9 rounded-[10px] bg-sage-light flex items-center justify-center text-base shrink-0">💤</div>
              <div>
                <h4 class="text-[0.82rem] font-medium text-text-dark">{recommendations[1] ?? fallbackRecommendations[1]}</h4>
                <p class="text-[0.72rem] text-text-soft">Tingkatkan rutinitas tidurmu dengan teknik sederhana</p>
              </div>
              <span class="ml-auto text-text-soft">›</span>
            </div>
            <div class="flex items-center gap-[0.85rem] py-[0.85rem] px-4 bg-cream rounded-xl border border-sand mb-2.5 cursor-pointer transition-colors duration-200 hover:border-sage">
              <div class="w-9 h-9 rounded-[10px] bg-blush-light flex items-center justify-center text-base shrink-0">💬</div>
              <div>
                <h4 class="text-[0.82rem] font-medium text-text-dark">{recommendations[2] ?? fallbackRecommendations[2]}</h4>
                <p class="text-[0.72rem] text-text-soft">Disarankan untuk mendiskusikan kecemasan lebih lanjut</p>
              </div>
              <span class="ml-auto text-text-soft">›</span>
            </div>
          </div>

          <div class="flex gap-3 justify-center flex-wrap mt-6">
            <button class="py-3 px-6 rounded-full text-[0.88rem] font-medium cursor-pointer transition-all duration-200 border-none font-sans bg-moss text-white hover:bg-sage-dark">Lihat Laporan Lengkap</button>
            <button class="py-3 px-6 rounded-full text-[0.88rem] font-medium cursor-pointer transition-all duration-200 border-[1.5px] border-sand font-sans bg-white text-text-mid hover:border-sage hover:text-moss" on:click={resetQuiz}>Ulangi Kuesioner</button>
            <button class="py-3 px-6 rounded-full text-[0.88rem] font-medium cursor-pointer transition-all duration-200 border-[1.5px] border-sand font-sans bg-white text-text-mid hover:border-sage hover:text-moss">Booking Konselor</button>
          </div>
        </div>
      {/if}
    </div>

    <div>
      {#if !showResultScreen}
        <div class="bg-white rounded-2xl border border-sand py-[1.1rem] px-5 mb-4">
          <h3 class="text-[0.83rem] font-medium text-text-dark mb-[0.85rem]">💡 Tips menjawab</h3>
          <div class="flex gap-3 items-start p-3 bg-cream rounded-[10px] border border-sand mb-2">
            <div class="text-base shrink-0">🎯</div>
            <div class="text-[0.76rem] text-text-mid leading-[1.45]">Jawab berdasarkan perasaan kamu dalam <strong>7 hari terakhir</strong>, bukan hari ini saja.</div>
          </div>
          <div class="flex gap-3 items-start p-3 bg-cream rounded-[10px] border border-sand mb-2">
            <div class="text-base shrink-0">🔒</div>
            <div class="text-[0.76rem] text-text-mid leading-[1.45]">Semua jawaban bersifat <strong>privat</strong> dan hanya digunakan untuk analisis pribadimu.</div>
          </div>
          <div class="flex gap-3 items-start p-3 bg-cream rounded-[10px] border border-sand mb-2">
            <div class="text-base shrink-0">✨</div>
            <div class="text-[0.76rem] text-text-mid leading-[1.45]">Tidak ada jawaban benar atau salah. Jujurlah dengan dirimu sendiri.</div>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-sand py-[1.1rem] px-5 mb-4">
          <h3 class="text-[0.83rem] font-medium text-text-dark mb-[0.85rem]">📝 Progres jawabanmu</h3>
          <div class="flex flex-col gap-2">
            {#each questions as q, i}
              <div class="flex items-center gap-[0.6rem] text-[0.75rem] text-text-mid">
                <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[0.65rem] shrink-0 {i === current ? 'bg-moss text-white' : (answers[i] !== null ? 'bg-sage-light text-moss' : 'bg-sand text-text-soft')}">
                  {i === current ? '→' : (answers[i] !== null ? '✓' : '·')}
                </div>
                <span class="{answers[i] !== null || i === current ? 'text-text-dark' : 'text-text-soft'}">{sectionLabels[i]}</span>
              </div>
            {/each}
          </div>
        </div>
      {:else}
        <div in:fly={{ y: 12, duration: 400, opacity: 0 }} class="bg-white rounded-2xl border border-sand py-[1.1rem] px-5 mb-4">
          <h3 class="text-[0.83rem] font-medium text-text-dark mb-[0.85rem]">📊 Ringkasan Jawaban</h3>
          <div class="flex flex-col gap-2">
            {#each sectionLabels as l}
              <div class="flex items-center gap-[0.6rem] text-[0.75rem] text-text-mid">
                <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[0.65rem] shrink-0 bg-sage-light text-moss">✓</div>
                <span class="text-text-dark">{l}</span>
              </div>
            {/each}
          </div>
        </div>
        <div in:fly={{ y: 12, duration: 400, opacity: 0 }} class="bg-white rounded-2xl border border-sand py-[1.1rem] px-5 mb-4">
          <h3 class="text-[0.83rem] font-medium text-text-dark mb-[0.85rem]">🔔 Langkah Selanjutnya</h3>
          <div class="flex gap-3 items-start p-3 bg-cream rounded-[10px] border border-sand mb-2">
            <div class="text-base shrink-0">📋</div>
            <div class="text-[0.76rem] text-text-mid leading-[1.45]">Laporan lengkap sudah tersedia di menu <strong>Laporan</strong>.</div>
          </div>
          <div class="flex gap-3 items-start p-3 bg-cream rounded-[10px] border border-sand mb-2">
            <div class="text-base shrink-0">💬</div>
            <div class="text-[0.76rem] text-text-mid leading-[1.45]">Coba booking sesi konseling pertamamu — gratis untuk pengguna baru.</div>
          </div>
          <div class="flex gap-3 items-start p-3 bg-cream rounded-[10px] border border-sand mb-2">
            <div class="text-base shrink-0">🔁</div>
            <div class="text-[0.76rem] text-text-mid leading-[1.45]">Ulangi kuesioner ini setiap minggu untuk memantau perkembanganmu.</div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</main>
