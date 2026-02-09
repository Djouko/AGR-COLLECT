<template>
  <map-view ref="view" :odata="odata" :url="geojsonUrl"
    :loading="$t('loading')">
    <template #popup="{ feature, odata: odataElement, listeners }">
      <submission-map-popup :project-id="projectId" :xml-form-id="xmlFormId"
        :instance-id="feature?.id" :fieldpath="feature?.properties?.fieldpath"
        :odata="odataElement"
        :awaiting-response="awaitingResponses.has(feature?.id)"
        v-on="{ ...listeners, ...reemitters }"/>
    </template>
    <template #overlap="{ features, listeners }">
      <map-overlap-popup :features="features" :odata-url="overlapUrl"
        v-on="listeners">
        <template #title>
          {{ $tcn('overlapTitle', features != null ? features.length : 0) }}
        </template>
        <template #feature="{ odata: odataElement }">
          {{ odataElement.meta?.instanceName ?? odataElement.__id }}
        </template>
      </map-overlap-popup>
    </template>
  </map-view>
</template>

<script setup>
import { computed, ref } from 'vue';

import MapOverlapPopup from '../map/overlap-popup.vue';
import MapView from '../map/view.vue';
import SubmissionMapPopup from './map-popup.vue';

import { apiPaths } from '../../util/request';
import { noop, reemit } from '../../util/util';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'SubmissionMapView'
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

  filter: Object,

  awaitingResponses: {
    type: Set,
    required: true
  }
});
const emit = defineEmits(['review', 'delete']);

const { odata } = useRequestData();

const geojsonUrl = computed(() => apiPaths.submissions(
  props.projectId,
  props.xmlFormId,
  false,
  '.geojson',
  props.filter
));
const overlapUrl = (query) =>
  apiPaths.odataSubmissions(props.projectId, props.xmlFormId, false, query);

const reemitters = reemit(emit, ['review', 'delete']);

const view = ref(null);
defineExpose({
  refresh: () => view.value.fetchData(false),
  cancelRefresh: () => view.value.cancelFetch(),
  afterDelete: (instanceId) => view.value.afterDelete(instanceId),

  afterReview: noop
});
</script>

<i18n lang="json5">
{
  "en": {
    "loading": "Preparing map — loading known Submissions and scanning for new ones. This could take a while.",
    "overlapTitle": "{count} Submission in this area | {count} Submissions in this area"
  }
}
</i18n>

<i18n>
{
  "de": {
    "loading": "Karte wird vorbereitet – bekannte Einreichungen werden geladen und nach neuen gesucht. Dies kann eine Weile dauern.",
    "overlapTitle": "{count} Übermittlung in diesem Bereich | {count} Übermittlungen in diesem Bereich"
  },
  "es": {
    "loading": "Preparando mapa: cargando envíos conocidos y buscando nuevos. Esto puede tardar un poco.",
    "overlapTitle": "{count} Envío a esta zona | {count} Envíos a esta zona | {count} Envíos a esta zona"
  },
  "fr": {
    "loading": "Préparation de carte en cours -- chargement de soumissions connues et analyse des soumissions nouvelles. Ceci pourrait prendre un certain temps.",
    "overlapTitle": "{count} soumission visible | {count} soumissions visibles | {count} soumissions visibles"
  },
  "it": {
    "loading": "Preparazione della mappa: caricamento degli invii noti e ricerca di quelli nuovi. L'operazione potrebbe richiedere alcuni minuti.",
    "overlapTitle": "{count} Invio in quest'area | {count} Invii in quest'area | {count} Invii in quest'area"
  },
  "zh": {
    "loading": "正在准备地图——正在加载已有提交数据并扫描新增内容，此过程可能需要一些时间。",
    "overlapTitle": "此区域内有 {count} 条提交数据"
  },
  "zh-Hant": {
    "loading": "正在準備地圖——正在載入已有提交資料並掃描新增內容，此過程可能需要一些時間。",
    "overlapTitle": "此區域內有{count}筆提交資料"
  }
}
</i18n>
