<script>
  export let className = '';
</script>

<article class={`card p-6 ${className}`.trim()}>
  <slot />
</article>
