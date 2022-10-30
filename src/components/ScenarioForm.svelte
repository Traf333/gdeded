<script lang="ts">
  import type { IScenario } from '$lib/types';

  const submit = () => {
    console.log(scenario)
  }
  export let scenario: IScenario | object = {}
</script>

<form on:submit|preventDefault={submit}>
  <input type="text" id="title" bind:value={scenario.title}>
  <button>save</button>
</form>
