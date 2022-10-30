<script>
  import { setContextClient, queryStore, getContextClient, gql } from '@urql/svelte';
  import client from '$lib/database/client';
  import { fetchScenarios } from "../api/scenario.js";

  setContextClient(client);

  const query = fetchScenarios();

</script>
{#if $query.fetching}
  <p>Loading...</p>
{:else if $query.error}
  <p>Oh no... {$query.error.message}</p>
{:else}
  {JSON.stringify($query)}
  <table>

    {#each $query.data.allScenarios.data as scenario}
      <tr>
        <td>{scenario.title}</td>
        <td>{scenario._id}</td>
        <td>{JSON.stringify(scenario.speeches.data)}</td>
      </tr>
    {/each}
  </table>
{/if}
