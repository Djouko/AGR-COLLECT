<template>
  <div class="table-refresh-bar">
    <span v-if="odata.dataExists">
      {{ $t('dataRefreshTime', { date: formatDate(dataRefreshedAt), time: formatTime(dataRefreshedAt) }) }}
    </span>
    <button id="refresh-button" type="button"
      class="btn btn-link" :aria-disabled="refreshing"
      @click="$emit('refreshClick')">
      <span class="icon-refresh"></span>{{ $t('action.refresh') }}
      <spinner :state="refreshing"/>
    </button>
  </div>
</template>

<script setup>
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { formatDate, formatTime } from '../util/date-time';
import Spinner from './spinner.vue';

const props = defineProps({
  odata: Object,
  refreshing: Boolean
});

defineEmits(['refreshClick']);

const dataRefreshedAt = computed(() => DateTime.fromJSDate(props.odata.setAt));

</script>

<style lang="scss">
.table-refresh-bar {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  span {
    font-size: 12px;
    margin-right: 10px;
  }
}
</style>

<i18n lang="json5">
  {
  "en": {
    // Text shown above the data tables to tell users when data was last fetched / refreshed.
    // {date} is only the date component and {time} is only the time component.
    "dataRefreshTime": "Data last refreshed on {date} at {time}"
  }
}
</i18n>

<i18n>
{
  "de": {
    "dataRefreshTime": "Daten zuletzt aktualisiert am {date} um {time}"
  },
  "es": {
    "dataRefreshTime": "Última actualización de los datos el {date} a las {time}"
  },
  "fr": {
    "dataRefreshTime": "Données rafraîchies le {date} à {time}"
  },
  "it": {
    "dataRefreshTime": "Ultimo aggiornamento dei dati il {date} alle {time}"
  },
  "pt": {
    "dataRefreshTime": "Última atualização dos dados em {date} às {time}"
  },
  "zh": {
    "dataRefreshTime": "数据最后更新于{date}日{time}时"
  },
  "zh-Hant": {
    "dataRefreshTime": "資料最後重新整理時間：{date}{time}"
  }
}
</i18n>
