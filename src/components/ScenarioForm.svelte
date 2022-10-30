<script lang="ts">
  import type { IScenario } from '$lib/types';
  import { Button, Label, Input, Toggle } from 'flowbite-svelte';

  export let scenario: IScenario | object = {};
  export let onCancel;
  export let onSubmit;

</script>

<form on:submit|preventDefault={() => onSubmit(scenario)}>
  <div class="mb-4">
    <Label for="title">Title</Label>
    <Input id="title" type="text" placeholder="Title" bind:value={scenario.title} />
  </div>
  <div class="mb-6">
    <Label class="" for="description">Описание</Label>
    <Input class="form-input" id="description" type="text" bind:value={scenario.description} />
  </div>
  <div class="mb-6">
    <Label class="" for="description">Roles</Label>
    <Input class="form-input" id="description" type="text"
           on:blur={(e)=> scenario.roles = e.target.value.split(', ')}
           defaultValue={scenario.roles?.join(', ')} />
  </div>
  <div class="mb-6">
    <Toggle bind:checked={scenario.active}>Active</Toggle>
  </div>
  <div class="flex items-center justify-between">
    <Button color="alternative" on:click={onCancel}>Отмена</Button>
    <Button on:click={() => onSubmit(scenario)}>Сохранить</Button>
  </div>
</form>
