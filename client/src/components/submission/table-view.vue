<template>
  <submission-table v-show="odata.dataExists" ref="table"
    :project-id="projectId" :xml-form-id="xmlFormId" :draft="draft" :deleted="deleted"
    :fields="fields" :awaiting-deleted-responses="awaitingResponses"
    v-on="reemitters"/>
  <odata-loading-message :state="odata.initiallyLoading"
    type="submission"
    :top="pagination.size"
    :filter="!!filter"
    :total-count="totalCount"/>
  <Pagination v-if="pagination.count > 0"
    v-model:page="pagination.page" v-model:size="pagination.size"
    :count="pagination.count" :size-options="pageSizeOptions"
    :spinner="odata.awaitingResponse"
    @update:page="handlePageChange"/>
</template>

<script setup>
import { computed, reactive, useTemplateRef, watch } from 'vue';

import OdataLoadingMessage from '../odata-loading-message.vue';
import Pagination from '../pagination.vue';
import SubmissionTable from './table.vue';

import { apiPaths } from '../../util/request';
import { noop, reemit, reexpose } from '../../util/util';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'SubmissionTableView'
});
const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  xmlFormId: {
    type: String,
    required: true
  },
  draft: Boolean,
  deleted: Boolean,

  filter: String,
  fields: Array,

  totalCount: {
    type: Number,
    default: 0
  },
  awaitingResponses: {
    type: Set,
    required: true
  }
});
const emit = defineEmits(['review', 'delete', 'restore']);

const { odata, deletedSubmissionCount } = useRequestData();

const pageSizeOptions = [250, 500, 1000];
const pagination = reactive({ page: 0, size: pageSizeOptions[0], count: 0 });

let snapshotFilter;
const setSnapshotFilter = () => {
  snapshotFilter = '';
  const now = new Date().toISOString();
  if (props.deleted) {
    snapshotFilter += `__system/deletedAt le ${now}`;
  } else {
    snapshotFilter += `__system/submissionDate le ${now} and `;
    snapshotFilter += `(__system/deletedAt eq null or __system/deletedAt gt ${now})`;
  }
};

const odataSelect = computed(() => {
  if (props.fields == null) return null;
  const paths = props.fields.map(({ path }) => path.replace('/', ''));
  paths.unshift('__id', '__system');
  return paths.join(',');
});

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

  return odata.request({
    url: apiPaths.odataSubmissions(
      props.projectId,
      props.xmlFormId,
      props.draft,
      {
        $top: pagination.size,
        $skip: pagination.page * pagination.size,
        $count: true,
        $wkt: true,
        $filter,
        $select: odataSelect.value,
        $orderby: '__system/submissionDate desc'
      }
    ),
    clear,
    patch: !first
      ? (response) => odata.replaceData(response.data, response.config)
      : null
  })
    .then(() => {
      pagination.count = odata.count;

      if (props.deleted) {
        deletedSubmissionCount.cancelRequest();
        if (!deletedSubmissionCount.dataExists) {
          deletedSubmissionCount.data = reactive({});
        }
        deletedSubmissionCount.value = odata.count;
      }
    })
    .catch(noop);
};
fetchChunk(true);
watch([() => props.filter, () => props.deleted], () => { fetchChunk(true); });
watch(() => props.fields, (_, oldFields) => {
  if (oldFields != null && !props.deleted) fetchChunk(true);
});
const handlePageChange = () => {
  if (odata.count < pageSizeOptions[0]) return;
  fetchChunk(false);
};
const refresh = () => fetchChunk(false, true);
const cancelRefresh = () => { odata.cancelRequest(); };

const reemitters = reemit(emit, ['review', 'delete', 'restore']);

const table = useTemplateRef('table');
defineExpose({
  refresh, cancelRefresh,
  ...reexpose(table, ['afterReview', 'afterDelete'])
});
</script>
