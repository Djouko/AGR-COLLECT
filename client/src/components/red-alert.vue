<template>
  <alert class="red-alert" :alert="redAlert"/>
</template>

<script setup>
import { inject } from 'vue';

import Alert from './alert.vue';

const redAlert = inject('redAlert');
</script>

<style lang="scss">
@import '../assets/scss/variables';

.red-alert {
  background-color: $color-danger-light;
  color: $color-danger;

  .alert-message {
    overflow-wrap: break-word;
    white-space: pre-wrap;
  }
}
</style>
