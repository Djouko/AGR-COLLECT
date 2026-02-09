<template>
  <div class="spinner" :class="{ inline, active: state }">
    <div class="spinner-glyph"></div>
  </div>
</template>

<script setup>
defineProps({
  state: {
    type: Boolean,
    default: true
  },
  /* By default, a spinner is positioned in the center of its closest positioned
  ancestor. However, in some cases, a spinner should not be positioned and
  should be rendered inline. A spinner is sometimes rendered inline
  automatically, for example, if the spinner is after a <select> element. You
  can force a spinner to be rendered inline by specifying `true` for the
  `inline` prop. */
  inline: Boolean
});
</script>

<style lang="scss">
@use 'sass:math';
@import '../assets/scss/variables';

$spinner-size: 16px;
$spinner-width: 3px;

@keyframes spin {
  from { transform: rotateZ(0deg); }
  to { transform: rotateZ(360deg); }
}

.spinner {
  $adjusted-position: calc(50% - #{math.div($spinner-size, 2)});
  left: $adjusted-position;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: $adjusted-position;
  transition: 0.3s opacity;

  &.active {
    animation-duration: 0.6s;
    animation-iteration-count: infinite;
    animation-name: spin;
    animation-timing-function: linear;
    opacity: 1;
    transition-delay: 0.15s;
  }

  select + &, &.inline {
    display: inline-block;
    left: 0;
    position: relative;
    top: 0;
    vertical-align: text-top;
  }
  select + & { margin-left: 7px; }
}
.spinner-glyph {
  height: $spinner-size;
  width: $spinner-size;

  &:before {
    border: $spinner-width solid #6b7280;
    border-radius: 999px;
    content: '';
    display: block;
    height: $spinner-size;
    width: $spinner-size;

    .btn-primary &, .btn-danger & {
      border-color: #fff;
    }

    .btn-primary & {
      box-shadow: 0 0 20px 10px $color-action-background-disabled,
                  0 0 6px 3px $color-action-background-disabled inset;
    }

    .btn-danger & {
      box-shadow: 0 0 20px 10px $color-danger,
                  0 0 6px 3px $color-danger inset;
    }
  }

  &:after {
    border: 2px solid transparent;
    border-radius: 50%;
    border-right-color: $color-page-background;
    border-top-color: $color-page-background;
    content: '';
    display: block;
    left: math.div($spinner-size, 2) - math.div($spinner-width, 2);
    height: $spinner-width;
    position: absolute;
    top: 0;
    transform: rotate(45deg);
    width: $spinner-width;

    .btn-primary & {
      border-right-color: $color-action-background-disabled;
      border-top-color: $color-action-background-disabled;
    }

    .btn-danger & {
      border-right-color: $color-danger;
      border-top-color: $color-danger;
    }
  }
}
</style>
