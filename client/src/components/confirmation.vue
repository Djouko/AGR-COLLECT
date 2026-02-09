<template>
  <modal :state="state" :hideable="!awaitingResponse"
    backdrop class="confirmation" @hide="$emit('hide')">
    <template #title>{{ title }}</template>
    <template #body>
      <div class="modal-introduction">
        <slot name="body"></slot>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-link" :aria-disabled="awaitingResponse"
          @click="$emit('hide')">
          {{ noTextC }}
        </button>
        <button type="button" class="btn btn-primary"
          :aria-disabled="awaitingResponse" @click="$emit('success')">
          {{ yesTextC }} <spinner :state="awaitingResponse"/>
        </button>
      </div>
    </template>
  </modal>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Modal from './modal.vue';
import Spinner from './spinner.vue';

const { t } = useI18n();

defineOptions({
  name: 'Confirmation'
});

const prop = defineProps({
  state: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  yesText: {
    type: String
  },
  noText: {
    type: String
  },
  awaitingResponse: {
    type: Boolean,
    default: false
  }
});

const yesTextC = computed(() => prop.yesText || t('common.yes'));
const noTextC = computed(() => prop.noText || t('common.no'));

defineEmits(['hide', 'success']);

</script>
