<template>
  <entity-table v-show="odataEntities.dataExists" ref="table"
    v-model:all-selected="allSelected" :properties="dataset.properties"
    :deleted="deleted" :awaiting-deleted-responses="awaitingResponses"
    v-on="reemitters"/>
  <odata-loading-message :state="odataEntities.initiallyLoading"
    type="entity"
    :top="pagination.size"
    :filter="filter != null || !!searchTerm"
    :total-count="dataset.dataExists ? dataset.entities : 0"/>
  <Pagination v-if="pagination.count > 0"
    v-model:page="pagination.page" v-model:size="pagination.size"
    :count="pagination.count" :size-options="pageSizeOptions"
    :spinner="odataEntities.awaitingResponse"
    @update:page="handlePageChange"/>
</template>

<script setup>
import { inject, reactive, useTemplateRef, watch } from 'vue';

import EntityTable from './table.vue';
import OdataLoadingMessage from '../odata-loading-message.vue';
import Pagination from '../pagination.vue';

import { apiPaths } from '../../util/request';
import { noop, reemit, reexpose } from '../../util/util';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'EntityTableView'
});
const props = defineProps({
  deleted: Boolean,
  filter: String,
  searchTerm: String,
  awaitingResponses: {
    type: Set,
    required: true
  }
});
const allSelected = defineModel('allSelected');
const emit = defineEmits(['selection-changed', 'clear-selection', 'update', 'resolve', 'delete', 'restore']);

const projectId = inject('projectId');
const datasetName = inject('datasetName');

const { dataset, odataEntities, deletedEntityCount } = useRequestData();

const pageSizeOptions = [250, 500, 1000];
const pagination = reactive({ page: 0, size: pageSizeOptions[0], count: 0 });

let snapshotFilter;
const setSnapshotFilter = () => {
  snapshotFilter = '';
  const now = new Date().toISOString();
  if (props.deleted) {
    snapshotFilter += `__system/deletedAt le ${now}`;
  } else {
    snapshotFilter += `__system/createdAt le ${now} and `;
    snapshotFilter += `(__system/deletedAt eq null or __system/deletedAt gt ${now})`;
  }
};

const fetchChunk = (clear, refresh = false) => {
  const first = clear || refresh;
  if (first) {
    setSnapshotFilter();
    pagination.page = 0;
  }

  let $filter = snapshotFilter;
  if (props.filter) {
    $filter += ` and ${props.filter}`;
  }

  const $search = props.searchTerm ? props.searchTerm : undefined;

  emit('clear-selection');

  return odataEntities.request({
    url: apiPaths.odataEntities(
      projectId,
      datasetName,
      {
        $top: pagination.size,
        $skip: pagination.page * pagination.size,
        $count: true,
        $filter,
        $search,
        $orderby: '__system/createdAt desc'
      }
    ),
    clear,
    patch: !first
      ? (response) => odataEntities.replaceData(response.data, response.config)
      : null
  })
    .then(() => {
      pagination.count = odataEntities.count;

      if (props.deleted) {
        deletedEntityCount.cancelRequest();
        if (!deletedEntityCount.dataExists) {
          deletedEntityCount.data = reactive({});
        }
        deletedEntityCount.value = odataEntities.count;
      }
    })
    .catch(noop);
};
fetchChunk(true);
watch([() => props.deleted, () => props.filter, () => props.searchTerm], () => {
  fetchChunk(true);
});
const handlePageChange = () => {
  if (odataEntities.count < pageSizeOptions[0]) return;
  fetchChunk(false);
};
const exposedFetch = {
  fetchData: (clear = true) => fetchChunk(clear, !clear),
  cancelFetch: () => { odataEntities.cancelRequest(); }
};

const reemitters = reemit(
  emit,
  ['selection-changed', 'update', 'resolve', 'delete', 'restore']
);

const table = useTemplateRef('table');
defineExpose({
  ...exposedFetch,
  ...reexpose(table, ['afterUpdate', 'afterDelete'])
});
</script>
