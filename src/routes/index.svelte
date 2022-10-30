<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import ded from '$lib/icon/ded.svg';
  import { fetchScenarios } from '../api/scenario';
  import type { IScenario } from '$lib/types';
  import Modal from '$lib/Modal.svelte';
  import ScenarioForm from '../components/ScenarioForm.svelte';
  import Loader from '$lib/Loader.svelte';

  let selectedItem: IScenario | object | null;
  const query = fetchScenarios();
</script>

<svelte:head>
  <title>А Где Дед?</title>
  <meta name="description" content="ПО для заучивания сценариев" />
</svelte:head>

<section>
  <h1>А Где Дед?</h1>

  <h2 class="mb-5 p-3 text-center">Помощник в заучивании сценариев для спектаклей</h2>
  {#if $query.fetching}
    <Loader />
  {:else if $query.error}
    Oh no! {$query.error.message}
  {:else if !$query.data}
    No data
  {:else}
    <ul>
      {#each $query.data.allScenarios.data as play (play)}
        <li>
          <a href="/play/{play.id}">
            <h3>{play.title}</h3>
            <div><em>{play.description ?? ''}</em></div>
            <small>{play.roles.length} человек</small>
          </a>
        </li>
      {/each}
      <li class="dashed" on:click={() => selectedItem  = {}}>
        Добавить новый спектакль
      </li>
    </ul>
  {/if}
  <br><br>
</section>

{#if selectedItem}
  <Modal>
    <ScenarioForm scenario={selectedItem} />
  </Modal>
{/if}

<style>
  section {
    height: 100vh;
    overflow: auto;
  }

  h1 {
    width: 100%;
    text-align: center;
  }

  ul {
    list-style: none;
    margin: auto;
    padding: 1rem;
    max-width: 600px;
  }

  li {
    margin-bottom: 1rem;
    padding: 1rem;
    box-shadow: 0 0 3px var(--primary-color);
    border-radius: 1rem;
    width: 100%;
    max-width: 600px;
    box-sizing: border-box;
    cursor: pointer;
  }

  li.dashed {
    border-style: dashed;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
</style>
