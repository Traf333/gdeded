<script lang="ts">
  import mic from './mic.svg';
  import next from './next.svg';
  import pause from './pause.svg';
  import play from './play.svg';
  import prev from './prev.svg';
  import save from './save.svg';
  import stop from './stop.svg';
  import listen from './listen.svg';
  import ded from './ded.svg';
  import cross from './cross.svg';
  import edit from './edit.svg';
  import trash from './trash.svg';
  import users from './users.svg';
  import search from './search.svg';

  const icons = {
    mic,
    next,
    pause,
    play,
    prev,
    save,
    stop,
    listen,
    ded,
    cross, edit, trash, users, search
  };

  type iconNames = 'mic' | 'next' | 'pause' | 'play' | 'prev' | 'save' | 'stop' | 'listen' | 'ded' | 'cross' | 'edit' | 'trash'
  export let name: iconNames;
  export let title = '';
  export let className = '';
  export let onClick;
</script>

<div class="icon {className}" title={title} on:click={onClick}>
  <img src={icons[name]} alt={title} />
</div>

<style>
  .icon {
    display: inline-block;
    width: 24px;
    cursor: pointer;
  }
  .icon.m {
    width: 30px;
  }
  img {
    width: 100%;
  }
</style>
