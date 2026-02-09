<template>
  <div v-show="featureCount !== 0" ref="el" class="geojson-map">
    <div ref="mapContainer" class="map-container" :class="{ opaque: shown }" tabindex="0" :inert="!shown"></div>
    <div v-show="shown">
      <span class="count"><span class="icon-map-marker"></span>{{ countMessage }}</span>
      <div class="control-bar">
        <button v-tooltip.aria-describedby="$t('zoomToFit')" type="button"
          @click="fitViewToAllFeatures()">
          <img class="fit-icon" :src="FitIcon">
        </button>
      </div>
      <GeojsonMapDevTools v-if="config.devTools" v-model:max-zoom="maxZoom"
        v-model:cluster="showsClusters"
        v-model:cluster-distance="clusterDistance"
        v-model:cluster-min-distance="clusterMinDistance"
        v-model:overlap-radius="overlapRadius"
        v-model:overlap-hint="showsOverlapHints" :zoom="zoomLevel"/>
    </div>
  </div>
</template>

<script setup>
import Cluster from 'ol/source/Cluster';
import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import WebGLVectorLayer from 'ol/layer/WebGLVector';
import Zoom from 'ol/control/Zoom';
import { boundingExtent, createEmpty as createEmptyExtent, extend, getCenter } from 'ol/extent';
import { get as getProjection } from 'ol/proj';

import { equals } from 'ramda';
import { computed, defineAsyncComponent, inject, onBeforeUnmount, onMounted, useTemplateRef, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import FitIcon from '../assets/images/geojson-map/fullscreen.svg';

import useEventListener from '../composables/event-listener';
import { getOverlapHintStyles, getStyles, getTextStyles } from '../util/map-styles';
import { loadAsync } from '../util/load-async';
import { noop } from '../util/util';
import { px } from '../util/dom';
import { useI18nUtils } from '../util/i18n';

const props = defineProps({
  data: Object,
  sizer: {
    type: Function,
    default: noop
  }
});
const emit = defineEmits(['show', 'shown', 'hit', 'selection-changed']);

const GeojsonMapDevTools = defineAsyncComponent(loadAsync('GeojsonMapDevTools'));

const { t, n } = useI18n();
const { joinSentences } = useI18nUtils();
const { redAlert, config, buildMode } = inject('container');

// eslint-disable-next-line no-console
const log = config.devTools ? console.log.bind(console) : noop;

const el = useTemplateRef('el');
const mapContainer = useTemplateRef('mapContainer');



////////////////////////////////////////////////////////////////////////////////


let webGL = false;
try {
  const canvas = document.createElement('canvas');
  if (window.WebGLRenderingContext && canvas.getContext('webgl')) webGL = true;
} catch (error) {}

const canRender = webGL || buildMode === 'test';
if (!canRender)
  redAlert.show(joinSentences([t('noWebGL.title'), t('noWebGL.message')]));

const style = getStyles();
const createWebGLLayer = (source) => (!webGL
  ? new VectorLayer({ source })
  : new WebGLVectorLayer({
    source,
    style,
    variables: { selectedId: '' }
  }));



////////////////////////////////////////////////////////////////////////////////

const baseLayer = new TileLayer({ source: new OSM() });

const featureSource = new VectorSource();
const featureLayer = createWebGLLayer(featureSource);

const projection = 'EPSG:3857';
const mapInstance = new Map({
  layers: [baseLayer, featureLayer],
  view: new View({ projection, extent: getProjection(projection).getExtent() }),
  controls: [new Zoom()]
});



////////////////////////////////////////////////////////////////////////////////

const clusterSource = new Cluster({
  source: featureSource,
  geometryFunction: (feature) => {
    const geometry = feature.getGeometry();
    switch (geometry.getType()) {
      case 'Point': return geometry;
      case 'LineString': return new Point(geometry.getCoordinateAt(0.5));
      case 'Polygon': return geometry.getInteriorPoint();
      default: return new Point(getCenter(geometry.getExtent()));
    }
  },
  createCluster: (point, features) => (features.length === 1
    ? features[0]
    : new Feature({
      geometry: point,
      features,
      clusterSize: n(features.length, 'default')
    }))
});

const clusterDistance = ref(40);
const clusterMinDistance = ref(10);
watch(
  clusterDistance,
  (value) => { if (value !== '') clusterSource.setDistance(value); },
  { immediate: true }
);
watch(
  clusterMinDistance,
  (value) => { if (value !== '') clusterSource.setMinDistance(value); },
  { immediate: true }
);

const clusterLayer = createWebGLLayer(clusterSource);
mapInstance.addLayer(clusterLayer);

const clusterSizeLayer = new VectorLayer({
  source: clusterSource,
  style: getTextStyles()
});
mapInstance.addLayer(clusterSizeLayer);

const showsClusters = ref(true);
const maxZoom = ref(19);
watch(
  [showsClusters, maxZoom],
  () => {
    if (showsClusters.value && maxZoom.value === '') return;

    clusterLayer.setMaxZoom(showsClusters.value ? maxZoom.value - 0.001 : -1);
    clusterSizeLayer.setMaxZoom(clusterLayer.getMaxZoom());

    featureLayer.setMinZoom(clusterLayer.getMaxZoom());
  },
  { immediate: true }
);

const isCluster = (feature) => feature.get('clusterSize') != null;



////////////////////////////////////////////////////////////////////////////////

const featureCount = ref(0);

const addFeatures = () => {
  if (props.data == null) return;
  if (!canRender) return;

  const features = new GeoJSON().readFeatures(props.data, {
    featureProjection: mapInstance.getView().getProjection()
  });
  if (features.length === 0) return;

  for (const feature of features) feature.set('id', feature.getId());

  featureSource.addFeatures(features);
  featureCount.value = features.length;
  log('features added');
};

const removeFeatures = () => {
  if (featureCount.value === 0) return;
  featureSource.clear(true);
  featureCount.value = 0;
  log('features removed');
};



////////////////////////////////////////////////////////////////////////////////

const resize = () => {
  log('resizing map');

  const { sizer } = props;
  const result = sizer();
  if (result != null) {
    log('return value from sizer prop:', result);
    el.value.style.minHeight = typeof result === 'number'
      ? (result > 0 ? px(result) : '')
      : result;
  }
  log('min-height of .geojson-map:', el.value.style.minHeight);

  mapContainer.value.style.height = '';
  const newHeight = px(el.value.getBoundingClientRect().height);
  mapContainer.value.style.height = newHeight;
  log('height of .map-container:', newHeight);

  mapInstance.updateSize();
  log('size of mapInstance:', mapInstance.getSize());

  log('done resizing');
};



////////////////////////////////////////////////////////////////////////////////

const viewPadding = 50;
const animationDuration = 1000;

const fitView = (extent, options = undefined) => {
  mapInstance.getView().fit(extent, {
    padding: new Array(4).fill(viewPadding),
    maxZoom: maxZoom.value,
    ...options
  });
};

const fitViewToAllFeatures = (animate = true) => {
  fitView(featureSource.getExtent(), animate ? { duration: animationDuration } : null);
};

const inViewCount = ref(0);
const countFeaturesInView = () => {
  log('counting features in view');
  let count = 0;
  const extent = mapInstance.getView().calculateExtent();
  if (clusterLayer.isVisible()) {
    clusterSource.forEachFeatureIntersectingExtent(extent, feature => {
      count += isCluster(feature) ? feature.get('features').length : 1;
    });
  } else {
    featureSource.forEachFeatureIntersectingExtent(extent, () => {
      count += 1;
    });
  }
  inViewCount.value = count;
};
const countMessage = computed(() =>
  t('showing', { count: n(inViewCount.value), total: n(featureCount.value) }));

const zoomLevel = ref(0);



////////////////////////////////////////////////////////////////////////////////

/*
There are two levels of visibility at play here:

1. display: none. If there is no data, then the component as a whole will be
   hidden. The component will also be hidden if an ancestor element is hidden.
   Once the component becomes visible, show() will be called via a
   ResizeObserver.
2. opacity: 0. Even once the component is technically visible (once `display` is
   not 'none'), the map will be transparent. That's because show() is async:
   before fully showing/opacifying the map to the user, we wait for the map to
   render fully (e.g., loading tiles). That way, the user won't see layers
   appear at different times as the tiles fade in. We use opacity for this part
   instead of `display: none` because the map needs to be visible in order to
   render.
*/

const shown = ref(false);
let abortShow = noop;

const show = async () => {
  if (shown.value) return;
  log('attempting to show map');

  abortShow();

  if (featureCount.value === 0) {
    log('no features; map not shown');
    return;
  }

  if (mapInstance.getSize().some(length => length === 0)) {
    log('map not sized; not shown');
    return;
  }

  resize();
  if (mapInstance.getSize().some(length => length === 0)) {
    log('map not sized; not shown');
    return;
  }

  emit('show');
  fitViewToAllFeatures(false);

  const abortController = new AbortController();
  abortShow = () => {
    log('aborting show');
    abortController.abort();
    abortShow = noop;
  };

  await Promise.race([
    new Promise(resolve => {
      mapInstance.once('rendercomplete', resolve);
      mapInstance.render();
    }),
    new Promise(resolve => { setTimeout(resolve, 1500); })
  ]);
  if (abortController.signal.aborted) return;

  countFeaturesInView();

  shown.value = true;
  abortShow = noop;
  log('shown');
  emit('shown');
};

const hide = () => {
  abortShow();

  if (shown.value) {
    shown.value = false;
    log('hidden');
  }
};



////////////////////////////////////////////////////////////////////////////////

const overlapRadius = ref(7);

const showsOverlapHints = ref(false);
const overlapHintSource = new VectorSource();

const showOverlapHint = (pixel) => {
  if (!showsOverlapHints.value) return;
  overlapHintSource.addFeature(new Feature({
    geometry: new Point(mapInstance.getCoordinateFromPixel(pixel)),
    overlapHint: true
  }));
};
const hideOverlapHint = () => { overlapHintSource.clear(true); };

if (config.devTools && webGL) {
  const overlapHintLayer = createWebGLLayer(overlapHintSource);
  overlapHintLayer.setStyle(getOverlapHintStyles(overlapRadius.value));
  mapInstance.addLayer(overlapHintLayer);
  watch(showsOverlapHints, (value) => {
    hideOverlapHint();
    overlapHintLayer.setVisible(value);
  });
  watch(overlapRadius, (radius) => {
    hideOverlapHint();
    if (radius !== '')
      overlapHintLayer.setStyle(getOverlapHintStyles(radius));
  });
}



////////////////////////////////////////////////////////////////////////////////

const hitDetectionOptions = {
  layerFilter: (layer) => layer === featureLayer || layer === clusterLayer
};

const moveOverFeature = (event) => {
  if (event.dragging) return;
  const hit = mapInstance.hasFeatureAtPixel(event.pixel, hitDetectionOptions);
  mapContainer.value.style.cursor = hit ? 'pointer' : '';
};

const forEachFeatureNearPixel = (source, pixel, radius, callback) => {
  const corners = [
    [pixel[0] - radius, pixel[1] - radius], // top-left
    [pixel[0] + radius, pixel[1] + radius] // bottom-right
  ];
  const extent = boundingExtent(corners.map(p =>
    mapInstance.getCoordinateFromPixel(p)));

  source.forEachFeatureIntersectingExtent(extent, callback);
};

const getHits = (pixel) => {
  hideOverlapHint();

  const hits = mapInstance.getFeaturesAtPixel(pixel, hitDetectionOptions);
  if (hits.length === 0) return hits;

  if (clusterLayer.isVisible()) {
    const cluster = hits.find(isCluster);
    if (cluster != null) return [cluster];
  }

  const source = clusterLayer.isVisible() ? clusterSource : featureSource;
  const ids = hits.reduce((set, hit) => set.add(hit.getId()), new Set());
  forEachFeatureNearPixel(source, pixel, overlapRadius.value, (feature) => {
    if (!(isCluster(feature) || ids.has(feature.getId()))) hits.push(feature);
  });
  showOverlapHint(pixel);

  return hits;
};



////////////////////////////////////////////////////////////////////////////////

let selectedId;

const featureToObject = (feature) =>
  ({ id: feature.getId(), properties: feature.getProperties() });

const selectFeature = (feature, emitChange = true) => {
  const id = feature?.getId();
  if (id === selectedId) return;

  if (feature != null && feature.getGeometry().getType() === 'Point')
    hideOverlapHint();

  mapInstance.getLayers().forEach(layer => {
    if (layer instanceof WebGLVectorLayer)
      layer.updateStyleVariables({ selectedId: id ?? '' });
  });

  selectedId = id;
  if (emitChange)
    emit('selection-changed', feature != null ? featureToObject(feature) : null);
};

const selectCluster = (cluster) => {
  selectFeature(null);

  const features = cluster.get('features');
  const view = mapInstance.getView();
  if (features.length <= 2000) {
    const featureExtent = createEmptyExtent();
    for (const feature of features)
      extend(featureExtent, feature.getGeometry().getExtent());

    const oldResolution = view.getResolution();
    const size = mapInstance.getSize().map(length => length - 2 * viewPadding);
    const newResolution = view.getResolutionForExtent(featureExtent, size);
    const fitWouldZoomIn = newResolution < oldResolution;

    if (fitWouldZoomIn) {
      fitView(featureExtent, { duration: animationDuration });
      return;
    }
  }

  view.animate({
    center: cluster.getGeometry().getCoordinates(),
    zoom: view.getZoom() + 1,
    duration: animationDuration
  });
};

const selectFeatureAtPixel = (pixel) => {
  const hits = getHits(pixel);
  emit('hit', hits.length === 0 || isCluster(hits[0])
    ? []
    : hits.map(featureToObject));

  if (hits.length === 1) {
    const hit = hits[0];
    if (isCluster(hit))
      selectCluster(hit);
    else
      selectFeature(hit);
  } else {
    selectFeature(null);
  }
};



////////////////////////////////////////////////////////////////////////////////

const resizeObserver = new ResizeObserver(show);

onMounted(() => {
  mapInstance.setTarget(mapContainer.value);
  addFeatures();
  resizeObserver.observe(el.value);
});

const olListeners = [];
const olOn = (target, type, callback) => {
  target.on(type, callback);
  olListeners.push([target, type, callback]);
};

olOn(mapInstance, 'moveend', () => {
  if (shown.value) countFeaturesInView();

  zoomLevel.value = mapInstance.getView().getZoom();
  hideOverlapHint();
});
olOn(mapInstance, 'pointermove', moveOverFeature);

const ignoreDoubleClick = (callback) => {
  let previousPixel;
  let previousTime = 0;
  return (event) => {
    const now = Date.now();
    if (!equals(event.pixel, previousPixel) || now > previousTime + 250)
      callback(event);
    previousPixel = event.pixel;
    previousTime = now;
  };
};
olOn(mapInstance, 'click', ignoreDoubleClick(event => {
  selectFeatureAtPixel(event.pixel);
}));

watch(() => props.data, (newData, oldData) => {
  log(newData != null
    ? (oldData == null ? 'data set' : 'data updated')
    : 'data cleared');

  selectFeature(null);
  removeFeatures();

  if (newData != null) {
    addFeatures();

    if (!shown.value)
      show();
    else
      countFeaturesInView();
  } else {
    hide();
  }
});

const resizeIfShown = () => { if (shown.value) resize(); };
useEventListener(window, 'resize', resizeIfShown);

onBeforeUnmount(() => {
  abortShow();
  for (const [target, type, callback] of olListeners) target.un(type, callback);
  resizeObserver.disconnect();
  mapInstance.setTarget(null);

  featureSource.clear(true);
  for (const layer of [...mapInstance.getLayers().getArray()]) {
    mapInstance.removeLayer(layer);
    layer.setSource(null);
  }
});

defineExpose({
  getFeatures: () => featureSource.getFeatures().map(featureToObject),
  selectFeature: (id, emitChange) => {
    const feature = id != null ? featureSource.getFeatureById(id) : null;
    selectFeature(feature, emitChange);
  },
  removeFeature: (id) => {
    const feature = featureSource.getFeatureById(id);
    if (feature == null) return;

    if (id === selectedId) selectFeature(null);
    featureSource.removeFeature(feature);

    featureCount.value -= 1;
    if (shown.value) countFeaturesInView();
  }
});
</script>

<style lang="scss">
@import '../assets/scss/variables';

$spacing: 10px;
$background-color: #fff;
$radius: 6px;
$border-color: #cbd5e1;
$muted-background-color: #F1F5F9;

.geojson-map {
  position: relative;

  .map-container {
    min-height: 400px;
    border: 1px solid $border-color;
    border-radius: $radius;

    opacity: 0;
    &.opaque { opacity: 1; }
  }

  .count {
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);

    background-color: #fff;
    border-radius: 4px;
    color: #000;
    font-size: 12px;
    line-height: 16px;
    padding-block: 6px;
    padding-inline: 8px;
    user-select: none;

    .icon-map-marker{
      padding-right: $margin-right-icon;
    }
  }

  .ol-zoom {
    position: absolute;
    right: $spacing;
    bottom: $spacing;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    box-shadow: none;
    background: $background-color;
    border-radius: $radius;
    overflow: hidden;
    border: 1px solid $border-color;

    button,
    button:hover,
    button:focus,
    button:active {
      height: 37px;
      width: 36px;
      border: none;
      background: $background-color;
      -webkit-tap-highlight-color: transparent;
      font-size: 24px;
      font-weight: 300;
      cursor: pointer;
      &:first-child {
        border-bottom: 1px solid $border-color;
      }
      &:hover {
        background: $muted-background-color;
      }
    }
  }

  .control-bar {
    position: absolute;
    display: flex;
    flex-direction: column;
    top: $spacing;
    right: $spacing;
    z-index: 1;
    gap: 4px;

    button {
      background: $background-color;
      padding: 8px;
      border-radius: $radius;
      border: 1px solid $border-color;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;

      &:hover {
        background: $muted-background-color;
      }

      .fit-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .geojson-map-dev-tools {
    position: absolute;
    right: #{$spacing + 72px};
    bottom: $spacing;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // {count} and {total} are both numbers.
    "showing": "Showing {count} of {total}",
    // Shown above control button on map to zoom out to show all features
    "zoomToFit": "Zoom to fit all data",
    "noWebGL": {
      "title": "Graphics issue detected.",
      "message": "Your browser cannot display the map now. Enable graphics acceleration settings."
    }
  }
}
</i18n>

<i18n>
{
  "de": {
    "showing": "Zeigen {count} von {total}",
    "zoomToFit": "Zoomen, um alle Daten anzuzeigen.",
    "noWebGL": {
      "title": "Grafikproblem erkannt.",
      "message": "Ihr Browser kann die Karte derzeit nicht anzeigen. Aktivieren Sie die Grafikbeschleunigungseinstellungen."
    }
  },
  "es": {
    "showing": "Mostrando {count} de {total}",
    "zoomToFit": "Ajustar para mostrar todos los datos",
    "noWebGL": {
      "title": "Se ha detectado un problema gráfico.",
      "message": "Tu navegador no puede mostrar el mapa ahora. Activa la configuración de aceleración gráfica."
    }
  },
  "fr": {
    "showing": "{count} de {total} affichés",
    "zoomToFit": "Recentrer sur toutes les données",
    "noWebGL": {
      "title": "Problème de graphiques détecté",
      "message": "Votre navigateur ne peut pas montrer la carte. Activez les paramètres d'accélération graphique."
    }
  },
  "it": {
    "showing": "Mostrando {count} di {total}",
    "zoomToFit": "Ingrandisci per adattare tutti i dati",
    "noWebGL": {
      "title": "Problema grafico rilevato.",
      "message": "Il tuo browser non è in grado di visualizzare la mappa al momento. Abilita le impostazioni di accelerazione grafica."
    }
  },
  "pt": {
    "zoomToFit": "Ajustar para mostrar todos os dados"
  },
  "zh": {
    "showing": "当前显示第{count}项，共{total}项",
    "zoomToFit": "缩放至全数据视图",
    "noWebGL": {
      "title": "图形显示异常。",
      "message": "您的浏览器无法显示地图。请启用图形加速设置。"
    }
  },
  "zh-Hant": {
    "showing": "正在顯示{total}項中的第{count}項",
    "zoomToFit": "縮放以符合所有資料",
    "noWebGL": {
      "title": "圖形顯示異常。",
      "message": "您的瀏覽器目前無法顯示地圖。請啟用圖形加速設定。"
    }
  }
}
</i18n>
