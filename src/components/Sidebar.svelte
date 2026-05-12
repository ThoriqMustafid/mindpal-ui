<script>
// @ts-nocheck
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
  import { auth } from '../lib/stores/auth.js';

  $: user = $auth || null;
  $: userName = user?.name || 'Pengguna';
  $: initials = userName.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
</script>

<aside class="sidebar">
  <div class="sidebar-logo">
    <div class="logo-mark">M</div>
    <span class="logo-text">MindPal</span>
  </div>

  <div class="nav-section">
    <div class="nav-section-label">Menu</div>
    <a href="/dashboard" use:link use:active class="nav-item">
      <div class="nav-icon ni-moss">🏠</div> Beranda
    </a>
    <a href="/kuesioner" use:link use:active class="nav-item">
      <div class="nav-icon ni-lavender">📋</div> Kuesioner
    </a>
    <a href="/chat" use:link use:active={{ className: 'active chat-active' }} class="nav-item">
      <div class="nav-icon ni-blush">💬</div> Chat Konselor
      <span class="nav-badge">1 baru</span>
    </a>
    <a href="/komunitas" use:link use:active={{ className: 'active komunitas-active' }} class="nav-item">
      <div class="nav-icon ni-sky">👥</div> Komunitas
    </a>
    <a href="/sumber-belajar" use:link use:active={{ className: 'active sumber-belajar-active' }} class="nav-item">
      <div class="nav-icon ni-amber">📚</div> Sumber Belajar
    </a>
  </div>

  <div class="nav-section" style="margin-top:.5rem">
    <div class="nav-section-label">Lainnya</div>
    <a href="/laporan" use:link use:active class="nav-item">
      <div class="nav-icon ni-sand">📈</div> Laporan
    </a>
    <a href="/pengaturan" use:link use:active class="nav-item">
      <div class="nav-icon ni-sand">⚙️</div> Pengaturan
    </a>
  </div>

  <div class="sidebar-footer">
    <button class="user-profile">
      <div class="avatar">{initials}</div>
      <div class="user-info">
        <span class="user-name">{userName}</span>
        <span class="user-plan">Paket Gratis</span>
      </div>
      <span class="arrow-icon">›</span>
    </button>
  </div>
</aside>

<style>
  .sidebar {
    width: var(--sidebar-w, 240px);
    flex-shrink: 0;
    background: white;
    border-right: 1px solid var(--sand);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 50;
    padding: 1.5rem 0;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 1.25rem 1.5rem;
    border-bottom: 1px solid var(--sand);
    margin-bottom: 1rem;
  }

  .logo-mark {
    width: 34px;
    height: 34px;
    background: var(--sage);
    border-radius: 50% 50% 50% 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lora', serif;
    font-size: 15px;
    color: white;
    font-weight: 600;
  }

  .logo-text {
    font-family: 'Lora', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--moss);
  }

  .nav-section {
    padding: 0 0.75rem;
    margin-bottom: 0.25rem;
  }

  .nav-section-label {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-soft);
    padding: 0 0.5rem;
    margin-bottom: 0.4rem;
    margin-top: 0.75rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem 0.75rem;
    border-radius: 12px;
    text-decoration: none;
    color: var(--text-mid);
    font-size: 0.88rem;
    font-weight: 400;
    transition: background 0.15s, color 0.15s;
    cursor: pointer;
    position: relative;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover {
    background: var(--cream);
    color: var(--text-dark);
  }

  .nav-item.active {
    background: var(--sage-light);
    color: var(--moss);
    font-weight: 500;
  }

  .nav-item.chat-active {
    background: var(--blush-light);
    color: var(--blush-dark);
  }

  .nav-item.komunitas-active {
    background: var(--sky-light);
    color: var(--sky-dark);
  }

  .nav-item.sumber-belajar-active {
    background: var(--amber-light);
    color: var(--amber-dark);
  }

  .nav-icon {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .ni-moss { background: var(--sage-light); }
  .ni-blush { background: var(--blush-light); }
  .ni-lavender { background: var(--lavender-light); }
  .ni-sky { background: #e5eef6; }
  .ni-amber { background: var(--amber-light); }
  .ni-sand { background: var(--sand); }

  .nav-badge {
    margin-left: auto;
    background: var(--blush-light);
    color: var(--blush-dark);
    font-size: 0.68rem;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 100px;
  }

  .sidebar-footer {
    padding: 1rem 0.75rem;
    border-top: 1px solid var(--sand);
    margin-top: auto;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    text-align: left;
    padding: 0.6rem 0.75rem;
    border-radius: 12px;
    transition: background 0.2s;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .user-profile:hover {
    background: var(--cream);
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--sage-dark);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .user-name {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text-dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-plan {
    font-size: 0.75rem;
    color: var(--text-soft);
    margin-top: 2px;
  }

  .arrow-icon {
    font-size: 1.2rem;
    color: var(--text-soft);
    margin-left: auto;
  }
</style>