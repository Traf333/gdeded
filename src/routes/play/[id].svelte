<script context="module" lang="ts">
  export const prerender = true;
</script>

<script lang="ts">
  import type { IPlay, ISpeech } from '$lib/types';
  import { longpress } from '$lib/longpress.js';
  import { onMount } from 'svelte';
  import http from '$lib/http';
  import MediaControl from '$lib/MediaControl.svelte';
  import Loader from '../../lib/Loader.svelte';
  import Modal from '../../lib/Modal.svelte';
  import Icon from '../../lib/icon/Icon.svelte';

  export let play: IPlay;
  export let speeches: ISpeech[] = [];
  let selectedItem: ISpeech;
  let editedItem: ISpeech;
  let selectedRole: string;
  let showRoleSelect = false;
  let showSearch = false;
  let showBookmarks = false;
  let searchTerm = '';
  let value = '';
  let searchIndex = 0;
  let bookmarks = [];

  onMount(() => {
    const key = `speeches-for-${play.id}`;
    const b_key = `bookmarks-for-${play.id}`;

    const rawData = localStorage.getItem(key);
    speeches = rawData ? JSON.parse(rawData) : [];

    const bb = localStorage.getItem(b_key);
    bookmarks = bb ? JSON.parse(bb) : [];

    http.get(`/speeches.json?play_id=${play.id}`).then(({ data }) => {
      speeches = data;
      localStorage.setItem(key, JSON.stringify(data));
    });
  });

  const handleSearchClick = () => {
    if (showSearch) {
      searchTerm = '';
      showSearch = false;
      searchIndex = 0;
    } else {
      showSearch = true;
    }
  };
  const handleUpdate = (data) => {
    if (data.audio) {
      let formData = new FormData();
      formData.append('speech[audio]', data.audio);
      http.put(`/speeches/${data.id}.json`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
      }).then(({ data }) => {
        speeches = speeches.map((s) => s.id === data.id ? data : s);
        selectedItem = data;
      });
    } else {
      http.put(`/speeches/${data.id}.json`, data)
        .then(({ data }) => {
          speeches = speeches.map((s) => s.id === data.id ? data : s);
          selectedItem = data;
        });
    }
  };
  const handleClick = (item) => {
    selectedItem = selectedItem === item ? null : item;
  };

  const handleBookmarkChange = () => {
    bookmarks = bookmarks.includes(editedItem.id)
      ? bookmarks.filter((b) => editedItem.id !== b)
      : [...bookmarks, editedItem.id].sort();

    const b_key = `bookmarks-for-${play.id}`;
    localStorage.setItem(b_key, JSON.stringify(bookmarks));
  };
  const toggleRole = (role) => {
    if (selectedRole === role) {
      selectedRole = null;
    } else {
      selectedRole = role;
      const item = speeches.find((r) => r.text.startsWith(role));
      scrollToIndex(item.id);
    }
  };
  const scrollToIndex = (id) => {
    const getMeTo = document.getElementById(id);
    getMeTo.scrollIntoView({ behavior: 'smooth' });
  };
  const goto = (item) => {
    scrollToIndex(item.id);
    selectedItem = item;
  };
  const close = () => editedItem = null;
  const save = () => {
    handleUpdate({ id: editedItem.id, text: editedItem.text });
    editedItem = null;
  };

  const handleDelete = (item) => {
    http.delete(`/speeches/${item.id}.json`)
      .then(() => {
        speeches = speeches.filter((i) => i.id !== item.id);
        editedItem = null;
      });
  };

  const onClickPrev = () => {
    searchIndex = searchIndex > 0 ? searchIndex - 1 : 0;
    scrollToIndex(foundItems[searchIndex].id);
  };
  const onClickNext = () => {
    searchIndex = searchIndex < foundItems.length ? searchIndex + 1 : foundItems.length;
    scrollToIndex(foundItems[searchIndex].id);
  };

  $: currentIndex = speeches.findIndex((s) => s.id === selectedItem?.id);
  $: prevSpeechItem = speeches.slice(0, currentIndex - 1).reverse().find((s) => s.audio_url);
  $: nextSpeechItem = speeches.slice(currentIndex + 1).find((s) => s.audio_url);
  $: foundItems = searchTerm ? speeches.filter((s) => s.text.includes(searchTerm)) : speeches;
  $: bookmarkItems = speeches.filter((s) => bookmarks.includes(s.id));
</script>

<svelte:head>
  <title>{play.title}</title>
  <meta name="description" content={play.description} />
</svelte:head>

<header>
  <div class="container d-flex align-items-center justify-content-between">
    <a href="/">← Назад</a>
    <h2 class="cursor-pointer" on:click={() => scrollToIndex('roles')}>{play.title}</h2>
    <div class="d-flex">
      <Icon name="search" className="mr-3" onClick={handleSearchClick} />
      <Icon name="users" onClick={() => showRoleSelect = !showRoleSelect} />
      {#if bookmarks.length > 0}
        <div class="burger ml-3" on:click={() => showBookmarks = true}>
          <svg viewBox="0 0 100 60" width="24" height="24">
            <rect width="100" height="6"></rect>
            <rect y="30" width="100" height="6"></rect>
            <rect y="60" width="100" height="6"></rect>
          </svg>
        </div>
      {/if}
    </div>
  </div>
  {#if showRoleSelect}
    <div class="roles container" id="roles">
      {#each play.roles as role (role)}
        <div class="role" class:active={role === selectedRole} on:click={() => toggleRole(role)}>{role}</div>
      {/each}
    </div>
  {/if}
</header>

<div class="play">
  <section class="container" class:filtered={selectedRole}>
    {#if speeches.length > 0}
      {#each speeches as item, i (item)}
        <div
          id={item.id}
          class="speech-item"
          class:selected={selectedItem === item}
          class:matched={item.text.startsWith(selectedRole)}
          class:withAudio={item.audio_url}
          on:click={() => handleClick(item)}
          on:long={() => editedItem = item}
          use:longpress
        >
          <div class="item-actions">
            {#if play.active}
              <Icon name="edit" onClick={() => editedItem = item} />
            {/if}
          </div>
          {@html item.text.replace(searchTerm, `<strong>${searchTerm}</strong>`)}
        </div>
      {/each}
    {:else}
      <Loader />
    {/if}
  </section>
</div>

{#if showSearch}
  {#key searchTerm}
    <footer>
      <div class="container">
        <div class="d-flex align-items-center justify-content-between p-3">
          <div class="d-flex align-items-center">
            {#if foundItems.length > 0}
              <Icon name="prev" className="m mr-3" onClick={onClickPrev} title="Предыдущая запись" />
              <Icon name="next" className="m" onClick={onClickNext} title="Следующая запись" />
            {/if}
            {#if searchTerm}
              {searchIndex + 1} / {foundItems.length}
            {/if}
          </div>
          <div class="d-flex align-items-center">
            <input type="text" bind:value class="mr-3">
            <Icon name="search" onClick={() => searchTerm = value} />
          </div>
        </div>
      </div>
    </footer>
  {/key}
{/if}

{#if selectedItem}
  {#key selectedItem}
    <footer>
      <div class="container">
        <MediaControl
          audioUrl={selectedItem.audio_url}
          onSave={(audio) => handleUpdate({ id: selectedItem.id, audio })}
          onClickPrev={prevSpeechItem && (() => goto(prevSpeechItem))}
          onClickNext={nextSpeechItem && (() => goto(nextSpeechItem))}
          readonly={!play.active}
        />
      </div>
    </footer>
  {/key}
{/if}

{#if play.active && editedItem}
  <Modal on:close={close}>
    <span slot="header">Редактирование текста</span>
    <p contenteditable="true" bind:innerHTML={editedItem.text}>
    </p>
    <label>
      <input type="checkbox" on:change={handleBookmarkChange} checked={bookmarks.includes(editedItem.id)}>
      <span class="ml-3 mb-3">В закладки</span>
    </label>
    <div class="d-flex justify-content-between" slot="footer">
      <div>
        <button class="btn-secondary" on:click={close}>
          Отменить
        </button>
        <button class="btn-danger" on:click={() => handleDelete(editedItem)}>
          Удалить
        </button>
      </div>

      <button class="btn-primary" on:click={save}>
        Сохранить
      </button>
    </div>
  </Modal>
{/if}
{#if showBookmarks}
  <div class="bookmarks">
    <div class="d-flex justify-content-between p-3">
      <h3>Закладки</h3>
      <Icon onClick={() => showBookmarks =false} name="cross" />
    </div>
    {#each bookmarkItems as item, i (item)}
      <div class="p-3 bookmark" class:active={item === selectedItem} on:click={() => {
        showBookmarks = false
        goto(item)
      }}>
        {item.text.substring(0, 25)}
      </div>
    {/each}
  </div>
{/if}

<style>
  .play {
    position: absolute;
    z-index: 1;
    top: 45px;
    bottom: 48px;
    left: 0;
    width: 100%;
    overflow: auto;
  }

  .bookmarks {
    box-sizing: border-box;
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  .bookmark.active {
    background-color: #eeeeee;
  }

  section {
    z-index: 1;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
  }

  header {
    top: 0;
    box-shadow: 0 1px 3px #ccc;
  }

  footer {
    bottom: 0;
    border-top: 1px solid #ccc;
  }

  header, footer {
    position: fixed;
    background-color: white;
    width: 100%;
    left: 0;
    z-index: 2;
  }

  .speech-item {
    cursor: pointer;
    padding: 1rem;
    transition: all ease-in-out 0.3s;
    border-left: 3px solid white;
    position: relative;
  }

  .item-actions {
    display: none;
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: white;
    border-radius: 8px;
  }

  .item-actions > :global(div) {
    width: 16px;
    margin: 4px;
  }

  .speech-item:hover .item-actions {
    display: block;
  }

  .filtered .speech-item {
    opacity: 0.4;
  }

  .filtered .speech-item.matched {
    opacity: 1;
  }

  .speech-item:hover {
    background-color: #eeeeee;
  }

  .speech-item.selected {
    border-color: cadetblue !important;
  }

  .speech-item.withAudio {
    border-color: #cccccc;
  }

  .role {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    border: 1px solid #cccccc;
    margin-right: 1rem;
  }

  .role.active {
    background-color: cadetblue;
    color: white;
    border-color: cadetblue;
  }

  .burger {
    cursor: pointer;
  }

  .roles {
    display: flex;
    padding-bottom: 1rem;
    margin-top: 24px;
    overflow-x: auto;
  }

  [contenteditable] {
    padding: 0.5em;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>
