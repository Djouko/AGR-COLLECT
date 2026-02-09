<template>
  <div class="qr-panel panel panel-default">
    <div class="panel-heading">
      <h1 class="panel-title"><slot name="title"></slot></h1>
      <span class="icon-mobile"></span>
    </div>
    <div class="panel-body">
      <slot name="body"></slot>
      <div v-if="showClose" class="panel-footer">
        <button type="button" class="btn btn-primary" data-closes-popover>{{ $t('action.close') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'QrPanel'
});
defineProps({
  showClose: {
    type: Boolean,
    default: true
  }
});
</script>

<style lang="scss">
@import '../assets/scss/variables';

.qr-panel {
  margin-bottom: 0;
  width: 505px;

  .panel-heading {
    background-color: $color-action-background;
    position: relative;
  }

  .panel-footer {
    margin-bottom: -15px;
    border-radius: 0;
  }

  .icon-mobile {
    color: $color-action-overlay;
    font-size: 98px;
    position: absolute;
    right: 18px;
    top: -32px;
    transform: rotate(15deg);

    &::after {
      background-color: #fff;
      content: '';
      height: 65px;
      left: 5px;
      position: absolute;
      top: 18px;
      width: 32px;
      z-index: -1;
    }
  }

  .collect-qr {
    float: left;
    margin-right: 15px;
  }

  p {
    &:first-child { margin-top: 5px; }
    &:last-child { margin-bottom: 5px; }
  }
}
</style>
