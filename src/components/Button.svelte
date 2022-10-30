<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let primary = false;
  export let secondary = false;
  const dispatch = createEventDispatcher();
  const click = () => dispatch('click');
</script>

<button class="btn" class:primary class:secondary on:click|preventDefault={click}>
  <slot></slot>
</button>


<style>
  .btn {
    @apply font-semibold py-2 px-4 rounded;
  }

  .primary {
    @apply bg-blue-500 text-white;
  }

  .primary:hover {
    @apply bg-blue-700;
  }

  .secondary {
    @apply bg-transparent text-blue-500 border-blue-500 border;
  }

  .secondary:hover {
    @apply bg-blue-100;
  }
</style>
