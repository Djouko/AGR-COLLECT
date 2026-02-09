<template>
  <div :key="alert.messageId" class="alert" role="alert">
    <div class="alert-message"><span>{{ alert.message }}</span></div>
    <div v-if="cta != null" class="alert-cta-container">
      <button type="button" class="alert-cta btn btn-link"
        :aria-disabled="cta.pending" @click="cta.handler">
        {{ cta.text }}
      </button>
      <spinner :state="cta.pending"/>
    </div>
    <div class="alert-close-container">
      <button type="button" class="close" :aria-label="$t('action.close')"
        @click="alert.hide()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import Spinner from './spinner.vue';

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
});

const cta = computed(() => props.alert.cta);
</script>

<style lang="scss">
@keyframes fadein {
  from { opacity: 0.2; }
  to { opacity: 1; }
}

.alert {
  animation-duration: 0.6s;
  animation-iteration-count: 1;
  animation-name: fadein;
  animation-timing-function: ease-out;

  display: flex;
  align-items: center;

  border-radius: 8px;
  margin-bottom: 15px;
  border: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.alert > div {
  display: flex;
  align-items: center;
}

.alert-message {
  flex-grow: 1;
  padding: 15px;
  padding-right: 62px;
}

.alert-cta-container, .alert-close-container {
  flex-shrink: 0;
  justify-content: center;
}

.alert-cta-container {
  position: relative;
}

.alert-close-container { padding-inline: 10px 18px; }

.alert-cta {
  font-size: inherit;

  &:hover, &:focus {
    background-color: transparent;
    text-decoration: none;
  }

  &[aria-disabled="true"] { opacity: 0; }
}

.alert .close {
  float: none;
  position: relative;
  top: -2px;

  color: inherit;
  opacity: 1;
  font-weight: 400;
  text-shadow: none;
}
</style>
