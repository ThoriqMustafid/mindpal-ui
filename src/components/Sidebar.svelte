<script>
  import { link } from 'svelte-spa-router';
  import active from 'svelte-spa-router/active';
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
    <a href="/sumber-belajar" use:link use:active class="nav-item">
      <div class="nav-icon ni-amber">📚</div> Sumber Belajar
    </a>
  </div>

  <div class="nav-section" style="margin-top:.5rem">
    <div class="nav-section-label">Lainnya</div>
    <div class="nav-item">
      <div class="nav-icon ni-sand">📈</div> Laporan
    </div>
    <div class="nav-item">
      <div class="nav-icon ni-sand">⚙️</div> Pengaturan
    </div>
  </div>

  <div class="sidebar-user">
    <div class="user-avatar">AR</div>
    <div>
      <div class="user-name">Arif R.</div>
      <div class="user-plan">Paket Gratis</div>
    </div>
    <div class="user-settings">›</div>
  </div>
</aside>

<style>
.sidebar {
  width: var(--sidebar-w);
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

.active-bar {
  position: absolute;
  left: -0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--sage-dark);
  border-radius: 0 4px 4px 0;
}

.chat-bar {
  background: var(--blush-dark);
}

.komunitas-bar {
  background: var(--sky-dark);
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
  background: var(--blush);
  color: var(--blush-dark);
  font-size: 0.68rem;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 100px;
}

.sidebar-user {
  margin-top: auto;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--sand);
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--sage);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  flex-shrink: 0;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-dark);
}

.user-plan {
  font-size: 0.72rem;
  color: var(--text-soft);
}

.user-settings {
  margin-left: auto;
  color: var(--text-soft);
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.user-settings:hover {
  color: var(--moss);
}
</style>
