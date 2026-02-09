<template>
  <textarea ref="el" class="textarea-autosize form-control"
    :class="{ 'user-resized': userResized }" :value="props.modelValue"
    :aria-disabled="disabled"
    v-tooltip.aria-describedby="disabled ? disabledMessage : null"
    @input="$emit('update:modelValue', $event.target.value)"
    @mousedown="listenForUserResize">
  </textarea>
</template>

<script setup>

import { nextTick, onMounted, ref, watch } from 'vue';

import { px, styleBox } from '../util/dom';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  disabled: Boolean,
  disabledMessage: String,
  minHeight: {
    type: Number,
    default: 0
  },
  mockUserResized: Boolean
});
defineEmits(['update:modelValue']);

const el = ref(null);

const userResized = ref(false);
const listenForUserResize = () => {
  if (userResized.value) return;
  const mousedownHeight = el.value.getBoundingClientRect().height;

  const { style } = el.value;
  const minHeightStyle = style.minHeight;
  style.minHeight = px(0);
  const mousedownHeightStyle = style.height;
  style.height = px(mousedownHeight);

  const mouseup = () => {
    document.removeEventListener('mouseup', mouseup);
    if (el.value == null) return;
    const mouseupHeight = el.value.getBoundingClientRect().height;
    userResized.value = mouseupHeight !== mousedownHeight || props.mockUserResized;
    if (!userResized.value) {
      style.height = mousedownHeightStyle;
      style.minHeight = minHeightStyle;
    }
  };
  document.addEventListener('mouseup', mouseup);
};

let heightOutdated = false;
const setHeight = () => {
  const { style } = el.value;
  style.height = px(0);
  const { minHeight } = style;
  style.minHeight = px(0);
  const { scrollHeight } = el.value;
  style.minHeight = minHeight;
  if (scrollHeight !== 0) {
    const box = styleBox(getComputedStyle(el.value));
    style.height = px(scrollHeight + box.borderTop + box.borderBottom);
    heightOutdated = false;
  } else {
    style.height = '';
    heightOutdated = true;
  }
};
onMounted(setHeight);
watch(() => props.modelValue, () => {
  if (!userResized.value) nextTick(setHeight);
});

const setMinHeight = () => { el.value.style.minHeight = px(props.minHeight); };
onMounted(setMinHeight);
watch(() => props.minHeight, () => { if (!userResized.value) setMinHeight(); });

const resize = () => {
  if (heightOutdated || userResized.value) setHeight();
  if (userResized.value) {
    setMinHeight();
    userResized.value = false;
  }
};
const focus = () => el.value.focus();
defineExpose({ el, resize, focus });
</script>

<style lang="scss">
.textarea-autosize {
  resize: vertical;

  overflow-y: hidden;
  &.user-resized { overflow-y: auto; }
}
</style>
