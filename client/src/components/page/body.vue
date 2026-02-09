<template>
  <div id="page-body" :class="htmlClass">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';

defineOptions({
  name: 'PageBody'
});

const { router } = inject('container');
const htmlClass = computed(() => ({
  'full-width': router != null && router.currentRoute.value.meta.fullWidth
}));
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

#page-body {
  @include clearfix;
  margin-left: auto;
  margin-right: auto;
  margin-top: $margin-top-page-body;
  max-width: $max-width-page-body;

  &.full-width { max-width: none; }
}
</style>
