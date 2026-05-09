<script>
  export let title = '';
  export let subtitle = '';
  export let withContainer = true;
  export let sectionClass = 'section';
</script>

<main class="app-shell">
  <section class={sectionClass}>
    <div class={withContainer ? 'container-app' : ''}>
      {#if title}
        <header class="mb-10">
          <h1 class="section-title">{title}</h1>
          {#if subtitle}
            <p class="section-subtitle">{subtitle}</p>
          {/if}
        </header>
      {/if}
      <slot />
    </div>
  </section>
</main>
