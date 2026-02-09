<template>
  <tr class="entity-update-row"
    :class="{ 'uncommitted-change': modelValue != null }">
    <td class="label-cell">
      <label :for="textareaId" v-tooltip.text>
        {{ requiredLabel(label, required) }}
      </label>
    </td>
    <td class="old-value" :class="{ empty: oldIsEmpty }">
      <div ref="oldValueContainer">
        {{ oldIsEmpty ? $t('common.emptyValue') : oldValue }}
      </div>
    </td>
    <td class="new-value">
      <div class="form-group">
        <textarea-autosize :id="textareaId" ref="textarea"
          :model-value="modelValue ?? oldValue ?? ''" :min-height="minHeight"
          :required="required" :disabled="disabled"
          :disabled-message="disabledMessage" @update:model-value="update"/>
      </div>
    </td>
  </tr>
</template>

<script>
let id = 0;
</script>
<script setup>
import { computed, ref, watch } from 'vue';

import TextareaAutosize from '../../textarea-autosize.vue';

import { requiredLabel } from '../../../util/dom';

defineOptions({
  name: 'EntityUpdateRow'
});
const props = defineProps({
  modelValue: String,
  oldValue: String,
  label: {
    type: String,
    required: true
  },
  required: Boolean,
  disabled: Boolean,
  disabledMessage: String
});
const emit = defineEmits(['update:modelValue']);

const oldIsEmpty = computed(() =>
  props.oldValue == null || props.oldValue === '');

id += 1;
const textareaId = `entity-update-row-textarea${id}`;

const minHeight = ref(0);
let minHeightOutdated = true;
const oldValueContainer = ref(null);
const setMinHeight = () => {
  minHeight.value = oldValueContainer.value.getBoundingClientRect().height;
  minHeightOutdated = false;
};
watch(() => props.oldValue, () => { minHeightOutdated = true; });

const update = (value) => {
  emit('update:modelValue', value !== (props.oldValue ?? '') ? value : undefined);
};

const textarea = ref(null);
const resize = () => {
  textarea.value.resize();
  if (minHeightOutdated) setMinHeight();
};
defineExpose({ textarea: computed(() => ({ ...textarea.value, resize })) });
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

.entity-update-row {
  td, textarea { font-size: 16px; }

  $vpadding: 4px;
  .label-cell, .old-value, .new-value { padding-bottom: $vpadding; }
  .label-cell {
    padding-right: 15px;
    padding-top: #{$vpadding + $padding-top-form-control};
  }
  .old-value {
    padding-top: $vpadding;

    div {
      padding-top: $padding-top-form-control;
      padding-bottom: $padding-top-form-control;
    }
  }
  .new-value {
    padding-top: $vpadding;
    padding-right: 0px;
  }

  .label-cell { @include text-overflow-ellipsis; }
  label {
    display: inline;
    margin-bottom: 0;
  }

  .old-value {
    overflow-wrap: break-word;
    white-space: break-spaces;

    &.empty {
      @include italic;
      color: #9ca3af;
    }
  }

  .form-group {
    margin-bottom: 0;
    padding-bottom: 0;
  }
}
</style>
