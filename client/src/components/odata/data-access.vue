<template>
  <div v-if="!oidcEnabled" id="odata-data-access">
    <button id="odata-data-access-analyze-button" type="button"
      class="btn btn-default" :aria-disabled="analyzeDisabled"
      v-tooltip.aria-describedby="analyzeDisabled ? analyzeDisabledMessage : null"
      @click="$emit('analyze')">
      <span class="icon-bar-chart"></span>{{ $t('action.connectData') }}
    </button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

defineOptions({
  name: 'OdataDataAccess'
});
defineProps({
  analyzeDisabled: Boolean,
  analyzeDisabledMessage: String
});
defineEmits(['analyze']);

const { oidcEnabled } = inject('config');
</script>

<style lang="scss">
#odata-data-access-analyze-button { margin-left: 5px; }
</style>

<i18n lang="json5">
{
  "en": {
    "action": {
      "connectData": "Connect Data"
    }
  }
}
</i18n>

<i18n>
{
  "de": {
    "action": {
      "connectData": "Daten verbinden"
    }
  },
  "es": {
    "action": {
      "connectData": "Conectar datos"
    }
  },
  "fr": {
    "action": {
      "connectData": "Se connecter aux données"
    }
  },
  "it": {
    "action": {
      "connectData": "Collegare Dati"
    }
  },
  "pt": {
    "action": {
      "connectData": "Dados de conexão"
    }
  },
  "zh": {
    "action": {
      "connectData": "连接数据"
    }
  },
  "zh-Hant": {
    "action": {
      "connectData": "連接資料"
    }
  }
}
</i18n>
