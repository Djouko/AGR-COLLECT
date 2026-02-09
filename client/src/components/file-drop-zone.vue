<template>
  <div class="file-drop-zone"
    :class="{ styled, disabled, dragover: dragging && !disabled }"
    @dragenter="dragenter" @dragover="dragover" @dragleave="dragleave" @drop="drop">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  disabled: Boolean,
  styled: {
    type: Boolean,
    default: true
  }
});
const emit = defineEmits(['dragenter', 'dragleave', 'drop']);

const depth = ref(0);
const noFiles = (event) =>
  !event.dataTransfer.types.some(type => type === 'Files');
const dragenter = (event) => {
  if (noFiles(event)) return;
  event.preventDefault();
  depth.value += 1;
  if (!props.disabled) emit('dragenter', event);
};
const dragover = (event) => {
  if (noFiles(event)) return;
  event.preventDefault();
  // eslint-disable-next-line no-param-reassign
  event.dataTransfer.dropEffect = props.disabled ? 'none' : 'copy';
};
const dragleave = (event) => {
  if (noFiles(event)) return;
  depth.value -= 1;
  if (!props.disabled) emit('dragleave', event, depth.value === 0);
};
const drop = (event) => {
  if (noFiles(event)) return;
  event.preventDefault();
  depth.value = 0;
  if (!props.disabled) emit('drop', event);
};

const dragging = computed(() => depth.value !== 0);
</script>

<style lang="scss">
@import '../assets/scss/mixins';

.file-drop-zone.styled {
  @include form-control-background;
  @include clearfix;
  border: 1px dashed $color-subpanel-border;
  margin-bottom: 20px;
  padding: $padding-file-drop-zone;
  text-align: center;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &.dragover { opacity: 0.65; }
}
</style>
