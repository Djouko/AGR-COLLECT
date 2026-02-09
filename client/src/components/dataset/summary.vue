<template>
  <div v-if="datasetDiff.dataExists && datasetDiff.length > 0"
    class="dataset-summary">
    <template v-for="(dataset, index) in datasetDiff" :key="dataset.name">
      <dataset-summary-row :dataset="dataset"/>
      <hr v-if="index < datasetDiff.length - 1">
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import DatasetSummaryRow from './summary/row.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'DatasetSummary'
});
const props = defineProps({
  isDraft: Boolean
});

const { formDatasetDiff, formDraftDatasetDiff } = useRequestData();
const datasetDiff = computed(() =>
  (props.isDraft ? formDraftDatasetDiff : formDatasetDiff));
</script>
