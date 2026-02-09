<template>
  <div v-show="state" class="action-bar-container">
    <div class="action-bar" role="alert">
      <div class="close-container">
        <button type="button" class="close" :aria-disabled="disableClose"
          :aria-label="$t('action.close')" @click="$emit('hide')">
          <span aria-hidden="true" class="icon-times-circle"></span>
        </button>
      </div>
      <div class="message"><span>{{ message }}</span></div>
      <div class="cta-container">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  state: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  disableClose: Boolean
});

defineEmits(['hide']);
</script>

<style lang="scss">
@import '../assets/scss/variables';
@import '../assets/scss/mixins';

.action-bar-container {
  @include floating-container;

  .action-bar {
    box-shadow: $m3-elevation-light-3;
    background-color: #1f2937;
    color: #fff;
    display: flex;
    align-items: center;
    border-radius: 4px;

    .message {
      flex-grow: 1;
      padding: 15px;
      padding-right: 62px;
    }

    .cta-container,
    .close-container {
      flex-shrink: 0;
      justify-content: center;
    }

    .cta-container {
      padding-inline: 10px 18px;
    }

    .close-container {
      padding-inline: 10px 0;
    }

    .close {
      opacity: 1;
      color: #fff;
    }
  }
}
</style>
