<template>
  <div id="map-view" ref="el">
    <Loading :state="geojson.initiallyLoading || showingMap"
      :message="loading"/>
    <geojson-map ref="map" :data="geojson.data" :sizer="sizeMap"
      @show="setShowing(true)" @shown="setShowing(false)"
      @selection-changed="selectionChanged" @hit="handleHit"/>
    <slot name="popup" v-bind="selection" :listeners="popupListeners"></slot>
    <div v-show="selection == null">
      <slot name="overlap" :features="overlap" :listeners="overlapListeners"></slot>
    </div>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref, shallowRef, useTemplateRef, watch, watchSyncEffect } from 'vue';

import Loading from '../loading.vue';

import { loadAsync } from '../../util/load-async';
import { noargs, noop } from '../../util/util';
import { styleBox } from '../../util/dom';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'MapView'
});
const props = defineProps({
  url: {
    type: String,
    required: true
  },
  odata: {
    type: Object,
    required: true
  },
  loading: {
    type: String,
    required: true
  }
});

const GeojsonMap = defineAsyncComponent(loadAsync('GeojsonMap'));

const { createResource } = useRequestData();
const geojson = createResource('geojson', () => ({
  transformResponse: ({ data, config }) => {
    const { features } = data;
    props.odata.setFromResponse({
      data: {
        value: new Array(features.length),
        '@odata.count': features.length
      },
      config
    });

    return data;
  }
}));
// eslint-disable-next-line vue/no-mutating-props
watchSyncEffect(() => { if (geojson.data == null) props.odata.data = null; });

const fetchData = (clear = true) => {
  if (clear) props.odata.reset();
  return geojson.request({ url: props.url, clear }).catch(noop);
};
fetchData();
watch(() => props.url, noargs(fetchData));
const cancelFetch = () => { geojson.cancelRequest(); };

const showingMap = ref(false);
const setShowing = (value) => { showingMap.value = value; };
watch(() => geojson.dataExists, (dataExists) => {
  if (!dataExists) setShowing(false);
});

const el = useTemplateRef('el');
const sizeMap = () => {
  const rect = el.value.getBoundingClientRect();
  if (rect.height === 0) return '';
  const section = el.value.closest('.page-section');
  const { marginBottom } = styleBox(getComputedStyle(section));
  return document.documentElement.clientHeight - rect.top - marginBottom;
};

const selection = shallowRef(null);
const selectionChanged = (feature) => {
  selection.value = feature != null ? { feature } : null;
};

const overlap = shallowRef(null);
const handleHit = (hits) => { overlap.value = hits.length > 1 ? hits : null; };
watch(() => geojson.data, () => { overlap.value = null; });

const map = useTemplateRef('map');
const hidePopup = () => {
  map.value.selectFeature(null);
  overlap.value = null;
};
const backToOverlap = () => { map.value.selectFeature(null); };
const popupListeners = { hide: hidePopup, back: backToOverlap };

const overlapListeners = {
  hide: hidePopup,
  preview: (data) => {
    map.value.selectFeature(data != null ? data.feature.id : null, false);
  },
  select: (data) => {
    map.value.selectFeature(data.feature.id, false);
    selection.value = data;
  }
};

const afterDelete = (instanceId) => {
  map.value.removeFeature(instanceId);
  if (overlap.value != null) {
    overlap.value = overlap.value.length > 1
      ? overlap.value.filter(feature => feature.id !== instanceId)
      : null;
  }

  props.odata.value.length -= 1; // eslint-disable-line vue/no-mutating-props
};

defineExpose({ fetchData, cancelFetch, afterDelete });
</script>

<style lang="scss">
#map-view {
  position: relative;

  .loading { color: #6b7280; }
  .page-section:has(&) { margin-bottom: 15px; }
}
</style>
