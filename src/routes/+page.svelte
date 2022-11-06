<script lang="ts">
  import { create, update, destroy } from '../api/scenario';
  import type { IScenario } from '$lib/types';
  import ScenarioForm from '../components/ScenarioForm.svelte';
  import { Card, ToolbarButton, Dropdown, DropdownItem, Button, Modal } from 'flowbite-svelte';

  export let data;

  let selectedItem: IScenario | object | null;
  let scenarios = data.scenarios;

  const handleSubmit = async (scenario) => {
    if (selectedItem?._id) {
      await update(selectedItem._id, scenario);
      scenarios = scenarios.map((s) => s._id === selectedItem._id ? scenario : s);
    } else {
      const rest = await create(scenario);
      scenarios = [...scenarios, rest.data.createScenario];
    }
  };
</script>

<svelte:head>
  <title>А Где Дед?</title>
  <meta name="description" content="ПО для заучивания сценариев" />
</svelte:head>

<section>
  <h1>А Где Дед?</h1>
  <h2 class="mb-5 p-3 text-center font-bold">Помощник в заучивании сценариев для спектаклей</h2>
  <div class="flex flex-col mb-3 xl:w-1/3 md:mx-auto md:w-2/3 xs:w-full p-3">
    {#each scenarios as play (play)}
      <Card class="mb-3">
        <div class="flex justify-between">
          <a href="/play/{play._id}" class="mb-2 text-l font-semibold tracking-tight text-gray-900 dark:text-white">
            {play.title}
          </a>
          <ToolbarButton class="dots-menu{play._id} text-gray-900 bg-white dark:text-white dark:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </ToolbarButton>
          <Dropdown class="w-36" triggeredBy=".dots-menu{play._id}">
            <DropdownItem on:click={() => selectedItem = play}>Редактировать</DropdownItem>
            <!--              <DropdownItem>Export data</DropdownItem>-->
            <DropdownItem on:click={async () => {
              await destroy(play._id)
              scenarios = scenarios.filter((s) => s._id !== play._id)
            }}>
              Удалить
            </DropdownItem>
          </Dropdown>
        </div>
        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
          {play.description ?? ''}
        </p>
      </Card>
    {/each}
  </div>
  <div class="text-center">
    <Button outline gradient color="purpleToBlue" on:click={() => selectedItem = {}}>
      Добавить новый спектакль
    </Button>
  </div>
  <br><br>
</section>

<Modal bind:open={selectedItem} title={selectedItem?._id ? 'Редактировать спектакль' : 'Создать спектакль'}>
  <ScenarioForm scenario={selectedItem}
                onSubmit={handleSubmit}
                onCancel={() => selectedItem = null} />
</Modal>

<style>
  section {
    height: 100vh;
    overflow: auto;
  }

  h1 {
    width: 100%;
    text-align: center;
  }
</style>
