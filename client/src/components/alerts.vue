<template>
  <div id="alerts">
    <Toast v-show="showsToast"/>
    <RedAlert v-show="showsRedAlert"/>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue';

import RedAlert from './red-alert.vue';
import Toast from './toast.vue';

const { toast, redAlert, openModal } = inject('container');

const showsToast = ref(false);
const showsRedAlert = ref(false);
watch(() => toast.messageId, () => {
  showsToast.value = toast.state;
  if (toast.state) showsRedAlert.value = false;
});
watch(() => redAlert.messageId, () => {
  showsRedAlert.value = redAlert.state && !openModal.state;
  if (showsRedAlert.value) showsToast.value = false;
});
</script>

<style lang="scss">
@import '../assets/scss/variables';
@import '../assets/scss/mixins';

#alerts {
  @include floating-container;

  .alert {
    margin-bottom: 0;
  }
}
</style>
