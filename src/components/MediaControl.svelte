<script lang="ts">
  import Icon from './icon/Icon.svelte';

  let mediaRecorder;
  let audioBlob;
  let recording = false;
  let audio;
  let paused;
  let mode: 'listen' | 'play';
  export let readonly;
  export let audioUrl;
  export let onSave;
  export let onClickPrev;
  export let onClickNext;

  const play = () => {
    if (mode !== 'play') audio.src = audioUrl;
    audio.play();
    mode = 'play';
  };

  const pause = () => {
    audio.pause();
  };
  const listen = () => {
    if (mode !== 'listen') audio.src = URL.createObjectURL(audioBlob);
    audio.play();
    mode = 'listen';
  };

  const stop = () => {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    mediaRecorder = null;
  };

  const record = () => {
    recording = true;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        const audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          audioBlob = new Blob(audioChunks);
          recording = false;
        });
      });
  };

  const save = () => {
    onSave(audioBlob);
    audioBlob = null;
    mediaRecorder = null;
  };
</script>

<div class="d-flex media-control align-items-center justify-content-between">
  <div class="control-section">
    {#if onClickPrev}
      <Icon name="prev" onClick={onClickPrev} title="Предыдущая запись" />
    {/if}
    {#if paused !== false && (audioUrl || audioBlob)}
      <Icon name="play" onClick={play} title="Проиграть" />
    {/if}
    {#if paused === false}
      <Icon name="pause" onClick={pause} title="Пауза" />
    {/if}
    {#if onClickNext}
      <Icon name="next" onClick={onClickNext} title="Следующая запись" />
    {/if}
  </div>
  <div class="control-section">
    {#if audioBlob}
      <Icon onClick={listen} name="listen" title="Прослушать записанное" />
      <Icon name="save" onClick={save} title="Сохранить" />
    {/if}
    {#if !readonly && !mediaRecorder}
      <Icon name="mic" onClick={record} title="Записать речь" />
    {/if}
    {#if mediaRecorder}
      <Icon onClick={stop} name="stop" title="Остановить" />
    {/if}
  </div>
  <audio bind:this={audio} bind:paused />
</div>

<style>
  .media-control {
    padding: 0.5rem;
  }

  .control-section > :global(div) {
    margin: 0 0.5rem;
  }
</style>
