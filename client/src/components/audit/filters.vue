<template>
  <form class="form-inline" @submit.prevent>
    <audit-filters-action :model-value="action"
      @update:model-value="$emit('update:action', $event)"/>
    <date-range-picker :model-value="dateRange"
      :label="$t('field.dateRange')" required
      :placeholder="$t('noLogDateSelected')"
      @update:model-value="$emit('update:dateRange', $event)"/>
  </form>
</template>

<script>
import AuditFiltersAction from './filters/action.vue';
import DateRangePicker from '../date-range-picker.vue';

export default {
  name: 'AuditFilters',
  components: { AuditFiltersAction, DateRangePicker },
  props: {
    action: {
      type: String,
      required: true
    },
    dateRange: {
      type: Array,
      required: true
    }
  },
  emits: ['update:action', 'update:dateRange']
};
</script>

<i18n lang="json5">
  {
    "en": {
      // Text shown when no Audit log date is selected in the filter
      "noLogDateSelected": "(none)"
    }
  }
  </i18n>

<i18n>
{
  "de": {
    "noLogDateSelected": "(keine)"
  },
  "es": {
    "noLogDateSelected": "(ninguno)"
  },
  "fr": {
    "noLogDateSelected": "(Aucune)"
  },
  "it": {
    "noLogDateSelected": "(nessuno)"
  },
  "pt": {
    "noLogDateSelected": "(nenhum)"
  },
  "zh": {
    "noLogDateSelected": "（无）"
  },
  "zh-Hant": {
    "noLogDateSelected": "(無)"
  }
}
</i18n>
