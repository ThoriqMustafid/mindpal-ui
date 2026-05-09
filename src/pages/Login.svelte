<script>
  import { login } from "../lib/stores/auth.js";
  import { link } from "svelte-spa-router";

  let email = "";
  let password = "";
  let isLoading = false;
  let errorMessage = "";

async function handleLogin() {
    isLoading = true;
    errorMessage = '';
    try {
      await login(email, password);
    } catch (error) {
      console.error("Detail Error dari sistem:", error); // <-- TAMBAHKAN BARIS INI
      errorMessage = 'Login gagal. Periksa kembali email dan passwordmu.';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <div class="login-header">
      <div class="logo-mark">M</div>
      <h2>Masuk ke MindPal</h2>
      <p>Lanjutkan perjalanan refleksi harianmu.</p>
    </div>

    <form on:submit|preventDefault={handleLogin}>
      {#if errorMessage}
        <div class="error-msg">{errorMessage}</div>
      {/if}

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="nama@email.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Masukkan password"
          required
        />
      </div>

      <button type="submit" class="btn-submit" disabled={isLoading}>
        {isLoading ? "Memproses..." : "Masuk"}
      </button>
    </form>

    <div class="login-footer">
      <span>Bukan pengguna?</span>
      <a href="/" use:link>Kembali ke Beranda</a>
    </div>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--cream);
    padding: 2rem;
    font-family: "DM Sans", sans-serif;
  }
  .login-card {
    width: 100%;
    max-width: 420px;
    background: white;
    padding: 2.5rem;
    border-radius: 24px;
    border: 1px solid var(--sand);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
  }
  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .logo-mark {
    width: 52px;
    height: 52px;
    background: var(--sage);
    border-radius: 50% 50% 50% 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Lora", serif;
    font-size: 1.5rem;
    color: white;
    font-weight: 600;
    margin: 0 auto 1.25rem;
  }
  .login-header h2 {
    font-family: "Lora", serif;
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
  .login-header p {
    color: var(--text-mid);
    font-size: 0.9rem;
    margin: 0;
  }
  .form-group {
    margin-bottom: 1.25rem;
  }
  .form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-mid);
    margin-bottom: 0.5rem;
  }
  .form-group input {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid var(--sand);
    border-radius: 12px;
    background: var(--warm-white);
    font-family: "DM Sans", sans-serif;
    font-size: 0.95rem;
    color: var(--text-dark);
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    box-sizing: border-box;
  }
  .form-group input:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px var(--sage-light);
  }
  .btn-submit {
    width: 100%;
    padding: 0.85rem;
    background: var(--moss);
    color: white;
    border: none;
    border-radius: 100px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 1rem;
    font-family: "DM Sans", sans-serif;
  }
  .btn-submit:hover:not(:disabled) {
    background: var(--sage-dark);
  }
  .btn-submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .error-msg {
    background: var(--blush-light);
    color: var(--blush-dark);
    padding: 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    text-align: center;
    margin-bottom: 1.25rem;
    border: 1px solid var(--blush);
  }
  .login-footer {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.85rem;
  }
  .login-footer span {
    color: var(--text-soft);
  }
  .login-footer a {
    color: var(--moss);
    font-weight: 500;
    text-decoration: none;
    margin-left: 0.25rem;
    transition: color 0.2s;
  }
  .login-footer a:hover {
    color: var(--sage-dark);
  }
</style>
