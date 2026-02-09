<template>
  <div ref="el" class="selectable" @click="select"><!-- eslint-disable-line vuejs-accessibility/click-events-have-key-events, vue/multiline-html-element-content-newline -->
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const el = ref(null);
const select = () => {
  const selection = getSelection();
  if (selection.isCollapsed) selection.selectAllChildren(el.value);
};
</script>

<style lang="scss">
@import '../assets/scss/variables';

.selectable {
  font-family: $font-family-monospace;
  overflow-x: auto;
  white-space: nowrap;
}
</style>
