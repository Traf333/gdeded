<script lang="ts">
  import type { IScenario } from '$lib/types';
  import { Button, Label, Input, Checkbox, Fileupload } from 'flowbite-svelte';

  export let scenario: IScenario;
  export let onCancel;
  export let onSubmit;

  let roles = scenario.roles?.join(', ');
  let loading = false;
  let speeches = [];

  function extractSpeeches(e) {
    loading = true;
    var reader = new FileReader();
    reader.readAsText(e.target.files[0], 'UTF-8');
    reader.onload = function (evt) {
      speeches = evt.target.result
        .split('\n')
        .filter((line) => line.trim())
        .map((line) => ({ text: line.trim() }));
      loading = false;
    };
    reader.onerror = function (evt) {
      console.log('error reading file');
      loading = false;
    };
  }

  function submit() {
    const params = {
      title: scenario.title,
      description: scenario.description,
      roles: roles.split(',').map((r) => r.trim()),
      active: scenario.active,
    };
    if (speeches.length > 0) {
      params.speeches = { create: speeches };
    }
    onSubmit(params);
  }

  let fileuploadprops = {
    id: 'user_avatar'
  };

</script>

<form on:submit={submit}>
  <div class="mb-4">
    <Label for="title">Название</Label>
    <Input id="title" type="text" placeholder="Мастер и Маргарита" bind:value={scenario.title} />
  </div>
  <div class="mb-6">
    <Label class="" for="description">Описание</Label>
    <Input class="form-input" id="description" type="text" bind:value={scenario.description} />
  </div>
  <div class="mb-6">
    <Label class="" for="description">Roles</Label>
    <Input class="form-input" id="description" type="text" bind:value={roles} />
  </div>
  <div class="mb-6">
    <Label class="pb-2">Загрузить спектакль <small>(форматы TXT, DOCX, DOC)</small></Label>
    <Fileupload {...fileuploadprops} on:change={extractSpeeches} />
  </div>
  <div class="mb-6">
    <Checkbox bind:checked={scenario.active}>Активный</Checkbox>
  </div>
  <div class="flex items-center justify-between">
    <Button color="alternative" on:click={onCancel}>Отмена</Button>
    <Button on:click={submit} disabled={loading}>Сохранить</Button>
  </div>
</form>
