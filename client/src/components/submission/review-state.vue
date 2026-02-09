<template>
  <span :class="htmlClass">
    <span v-tooltip.sr-only :class="reviewStateIcon(value)"></span>
    <span :class="{ 'sr-only': tooltip }">
      <slot>{{ $t(`reviewState.${value}`) }}</slot>
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

import useReviewState from '../../composables/review-state';

defineOptions({
  name: 'SubmissionReviewState'
});
const props = defineProps({
  value: String,
  tooltip: Boolean,
  colorText: Boolean,
  align: Boolean
});

const htmlClass = computed(() => {
  const result = ['submission-review-state'];
  if (props.value != null) result.push(props.value);
  if (props.colorText) result.push('color-text');
  if (props.align) result.push('align');
  return result;
});

const { reviewStateIcon } = useReviewState();
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.submission-review-state {
  @mixin review-state-color($color) {
    & [class^="icon-"], &.color-text span:last-child { color: $color; }
  }
  @include review-state-color(#9ca3af);
  &.hasIssues { @include review-state-color($color-warning); }
  &.edited { @include review-state-color(#6b7280); }
  &.approved { @include review-state-color($color-success); }
  &.rejected { @include review-state-color($color-danger); }

  :where(&) [class^="icon-"] { margin-right: $margin-right-icon; }

  &.align {
    .icon-dot-circle-o, .icon-pencil, .icon-check-circle, .icon-times-circle {
      padding-left: 1px;
      padding-right: 1px;
    }
  }
}
</style>
