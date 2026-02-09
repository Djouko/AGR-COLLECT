<template>
  <div class="summary-item">
    <linkable :to="to" :clickable="clickable"
      class="summary-item-icon-container" @click="$emit('click')">
      <span :class="`icon-${icon}`"></span>
    </linkable>
    <div class="summary-item-heading">
      <linkable :to="to" :clickable="clickable" @click="$emit('click')">
        <slot name="heading"></slot>
      </linkable>
    </div>
    <div class="summary-item-body">
      <linkable :to="to" :clickable="clickable" @click="$emit('click')">
        <slot name="body"></slot>
      </linkable>
    </div>
  </div>
</template>

<script setup>
import Linkable from './linkable.vue';

defineProps({
  to: String,
  clickable: Boolean,
  icon: {
    type: String,
    required: true
  }
});
defineEmits(['click']);
</script>

<style lang="scss">
@import '../assets/scss/mixins';

$icon-font-size: 56px;

.summary-item {
  margin-bottom: 30px;
  min-height: $icon-font-size;
  position: relative;
}

.summary-item-icon-container {
  position: absolute;

  [class^="icon-"] {
    color: #6b7280;
    font-size: $icon-font-size;
  }
}
a.summary-item-icon-container [class^="icon-"] { margin-right: 0; }

.summary-item-heading, .summary-item-body { margin-left: 75px; }

.summary-item-heading {
  @include text-overflow-ellipsis;
  font-size: 30px;
  line-height: 35px;

  .icon-angle-right {
    color: $color-accent-primary;
    font-size: 20px;
    vertical-align: 2px;
  }
  a .icon-angle-right { margin-right: 0; }
}

.summary-item-body {
  color: #6b7280;

  strong {
    color: $color-text;
    font-weight: normal;
  }
}
</style>
