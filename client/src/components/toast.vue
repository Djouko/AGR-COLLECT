<template>
  <alert class="toast" :alert="toast"/>
</template>

<script setup>
import { inject } from 'vue';

import Alert from './alert.vue';

const toast = inject('toast');
</script>

<style lang="scss">
@import '../assets/scss/variables';

.toast {
  background-color: #1f2937;
  color: #fff;

  .alert-cta {
    color: $color-action-light;
    &:hover, &:focus { color: $color-action-background; }
  }
}
</style>
