<!-- The DlData component renders a <dt> and <dd> for arbitrary key/value data
from the user, e.g., entity data. The key and value will be truncated if they
are too long. -->
<template>
  <dt class="dl-data-dt">
    <slot name="name"><span v-tooltip.text>{{ name }}</span></slot>
  </dt>

  <dd class="dl-data-dd">
    <slot name="value">
      <span v-if="value == null || value === ''" class="dl-data-empty">
        {{ $t('common.emptyValue') }}
      </span>
      <expandable-text v-else>{{ value }}</expandable-text>
    </slot>
  </dd>
</template>

<script setup>
import ExpandableText from './expandable-text.vue';

defineOptions({
  name: 'DlData'
});
defineProps({
  /*
  "key" would have been a nice name for this prop, but sadly that's a reserved
  name.

  `name` can be passed in as a prop or as a slot.
  */
  name: String,
  value: String
});
</script>

<style lang="scss">
@import '../assets/scss/mixins';

.dl-data-dt { @include text-overflow-ellipsis; }

.dl-data-dd {
  overflow: hidden;

  .expandable-text {
    overflow-wrap: break-word;
    white-space: break-spaces;
  }
}

.dl-data-empty {
  @include italic;
  color: #9ca3af;
}
</style>
