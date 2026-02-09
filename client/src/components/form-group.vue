<template>
  <label class="form-group" :class="htmlClass">
    <slot name="before"></slot>
    <input ref="input" v-model="modelValue" v-bind="$attrs" class="form-control"
      :placeholder="requiredLabel(placeholder, required)" :required="required"
      v-tooltip.aria-describedby="tooltip" :autocomplete="autocomplete">
    <password-strength v-if="autocomplete === 'new-password'"
      :password="modelValue"/>
    <span class="form-label">{{ requiredLabel(placeholder, required) }}</span>
    <slot name="after"></slot>
  </label>
</template>

<script setup>
import { computed, ref } from 'vue';

import PasswordStrength from './password-strength.vue';

import { requiredLabel } from '../util/dom';

defineOptions({
  inheritAttrs: false
});
const modelValue = defineModel({ required: true });
const props = defineProps({
  placeholder: {
    type: String,
    required: true
  },
  required: Boolean,
  tooltip: String,
  hasError: Boolean,
  autocomplete: {
    type: String,
    required: true
  }
});

const htmlClass = computed(() => ({
  'new-password': props.autocomplete === 'new-password',
  'has-error': props.hasError
}));

const input = ref(null);
const focus = () => { input.value.focus(); };
defineExpose({ focus });
</script>

<style lang="scss">
.form-group {
  &.new-password ~ .form-group.new-password .password-strength {
    display: none;
  }
}
</style>
