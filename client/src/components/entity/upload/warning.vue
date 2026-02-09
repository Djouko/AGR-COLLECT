<template>
  <div class="entity-upload-warning">
    <span class="label label-warning">
      <span class="icon-warning"></span>{{ $t('common.warning') }}
    </span>
    <slot></slot>
    <template v-if="ranges != null">
      <span>&nbsp;</span>
      <i18n-list v-slot="{ value: [start, end] }" :list="ranges">
        <a href="#" @click.prevent="$emit('rows', [start - 1, end - 1])">
          {{ formatRange(start, end) }}
        </a>
      </i18n-list>
    </template>
  </div>
</template>

<script setup>
import I18nList from '../../i18n/list.vue';

import { useI18nUtils } from '../../../util/i18n';

defineOptions({
  name: 'EntityUploadWarning'
});
defineProps({
  ranges: Array
});
defineEmits(['rows']);

const { formatRange } = useI18nUtils();
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

.entity-upload-warning {
  @include text-overflow-ellipsis;
  background-color: #fff;
  font-weight: bold;
  padding: 9px 3px;

  .label {
    font-size: inherit;
    margin-right: 10px;
    padding: 7px 5px;
  }

  .i18n-list {
    font-weight: normal;
    margin-left: 3px;
  }

  + .entity-upload-warning { margin-top: 2px; }

  $border-radius: 5px;
  &:first-child {
    border-top-left-radius: $border-radius;
    border-top-right-radius: $border-radius;
  }
  &:last-child {
    border-bottom-left-radius: $border-radius;
    border-bottom-right-radius: $border-radius;
  }
}
</style>
