<!-- Parts of this component are based on the npm package
vue-password-strength-meter 1.7.2, which uses the MIT license.
https://github.com/apertureless/vue-password-strength-meter -->
<template>
  <div class="password-strength">
    <div :data-score="score"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  password: {
    type: String,
    required: true
  }
});

const score = computed(() => {
  const { length } = props.password;
  if (length === 0) return 0;
  if (length < 8) return 1;
  if (length < 10) return 2;
  if (length < 12) return 3;
  if (length < 14) return 4;
  return 5;
});
</script>

<style lang="scss">
@use 'sass:color';
@use 'sass:math';
@import '../assets/scss/mixins';

.password-strength {
  background-color: #e5e7eb;
  float: right;
  height: 2px;
  margin-bottom: 20px;
  margin-top: 10px;
  position: relative;
  width: 50%;

  $between-bars: 5px;
  $bar-width: calc(20% - #{math.div(4 * $between-bars, 5)});
  &::before, &::after {
    background-color: transparent;
    border-color: #fff;
    border-style: solid;
    border-width: 0 $between-bars 0 $between-bars;
    box-sizing: content-box;
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    top: 0;
    width: $bar-width;
    z-index: 1;
  }
  &::before { left: $bar-width; }
  &::after { right: $bar-width; }

  [data-score] {
    height: 100%;
    transition: width 0.5s ease-in-out, background-color 0.25s;
  }
  [data-score="0"] {
    width: 0;
  }
  [data-score="1"] {
    background-color: $color-danger;
    width: 20%;
  }
  [data-score="2"] {
    background-color: color.mix($color-danger, $color-warning);
    width: 40%;
  }
  [data-score="3"] {
    background-color: $color-warning;
    width: 60%;
  }
  [data-score="4"] {
    background-color: color.mix($color-warning, $color-success);
    width: 80%;
  }
  [data-score="5"] {
    background-color: $color-success;
    width: 100%;
  }
}
</style>
