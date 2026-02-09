<template>
  <div ref="el" class="expandable-text" :class="{ toggleable, expanded }"
    :tabindex="toggleable ? 0 : null" @click="toggle" @keydown.enter="toggle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { truncatesText } from '../util/dom';

const truncated = ref(false);
const el = ref(null);
const setTruncated = () => { truncated.value = truncatesText(el.value); };
const resizeObserver = new ResizeObserver(setTruncated);
onMounted(() => {
  setTruncated();
  resizeObserver.observe(el.value);
});
onBeforeUnmount(() => { resizeObserver.disconnect(); });

const expanded = ref(false);
const toggleable = computed(() => truncated.value || expanded.value);
const toggle = () => {
  if (toggleable.value) expanded.value = !expanded.value;
};
</script>

<style lang="scss">
@import '../assets/scss/mixins';

.expandable-text {
  &:not(.expanded) { @include line-clamp(3); }
  &.toggleable { cursor: pointer; }
}
</style>
