<script>
  export let variant = 'primary';
  export let type = 'button';
  export let href = '';
  export let className = '';

  const variantMap = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary'
  };

  $: classes = `${variantMap[variant] ?? variantMap.primary} ${className}`.trim();
</script>

{#if href}
  <a class={classes} href={href}>
    <slot />
  </a>
{:else}
  <button class={classes} {type} {...$$restProps}>
    <slot />
  </button>
{/if}
