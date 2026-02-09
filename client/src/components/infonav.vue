<template>
  <div class="infonav-button dropdown">
    <router-link v-if="link != null" class="btn btn-link" :to="link">
      <slot name="title"></slot>
    </router-link>
    <template v-else>
      <button :id="toggleId" type="button" class="btn dropdown-toggle" data-toggle="dropdown"
        aria-haspopup="menu" aria-expanded="false">
          <slot name="title"></slot>
          <span class="icon-angle-down"></span>
      </button>
      <ul class="dropdown-menu" :aria-labelledby="toggleId">
        <slot name="dropdown"></slot>
      </ul>
    </template>
  </div>
</template>


<script>
let id = 1;
</script>
<script setup>
defineOptions({
  name: 'Infonav'
});
defineProps({
  link: String
});

const idPrefix = `infonav${id}`;
id += 1;
const toggleId = `${idPrefix}-toggle`;

</script>

<style lang="scss">
@import '../assets/scss/variables';

  #page-head:not(:hover):not(:focus-within) .infonav-button {
    color: #9ca3af;
    a {
      color: #9ca3af;
      [class^="icon-"] {
        color: #d1d5db;
      }
    }
  }

  .infonav-button {
    margin-left: 10px;
    color: $color-action-foreground;

    .btn {
      font-size: 15px;
      box-shadow: none;
    }

    &:not(.open) > .btn:focus {
      color: $color-action-foreground;
    }

    &:not(.open):hover > .btn {
      background-color: white;
      color: $color-action-foreground;
    }

    &.open > .btn {
        background-color: $color-action-background;
        color: #fff;
      }

    .icon-angle-down {
      margin-left: 5px;
    }

    .dropdown-menu {
      font-size: 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-top: 4px;
      min-width: 100%;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      padding: 4px 0;

      li a {
        max-width: 300px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 7px 16px;
      }
    }
  }


  .dropdown-divider {
    margin-top: 0px;
    margin-bottom: 0px;
  }
</style>
