<template>
  <table id="audit-table" class="table">
    <thead>
      <tr>
        <th class="logged-at">{{ $t('header.time') }}</th>
        <th>{{ $t('header.type') }}</th>
        <th>{{ $t('header.initiator') }}</th>
        <th>{{ $t('header.target') }}</th>
        <th>{{ $t('header.details') }}</th>
      </tr>
    </thead>
    <tbody v-if="audits.dataExists">
      <audit-row v-for="(audit, index) in audits" :key="index" :audit="audit"/>
    </tbody>
  </table>
</template>

<script setup>
import AuditRow from './row.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'AuditTable'
});

const { audits } = useRequestData();
</script>

<style lang="scss">
#audit-table {
  table-layout: fixed;

  th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: #6b7280;
    font-weight: 600;
    padding: 10px;

    &.logged-at { width: 150px; }
  }

  tbody tr {
    transition: background-color 0.15s;
    &:hover { background-color: #f9fafb; }

    td {
      vertical-align: middle;
      font-size: 13px;
      padding: 10px;
      border-top-color: #f3f4f6;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "header": {
      "initiator": "Initiator",
      "target": "Target",
      "details": "Details"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "header": {
      "initiator": "Iniciátor",
      "target": "Cíl",
      "details": "Detaily"
    }
  },
  "de": {
    "header": {
      "initiator": "Initiator",
      "target": "Ziel",
      "details": "Details"
    }
  },
  "es": {
    "header": {
      "initiator": "Iniciador",
      "target": "Objetivo",
      "details": "Detalles"
    }
  },
  "fr": {
    "header": {
      "initiator": "Initiateur",
      "target": "Cible",
      "details": "Détails"
    }
  },
  "id": {
    "header": {
      "initiator": "Pemrakarsa",
      "target": "Target",
      "details": "Rincian"
    }
  },
  "it": {
    "header": {
      "initiator": "Iniziatore",
      "target": "Obbiettivo",
      "details": "Dettagli"
    }
  },
  "ja": {
    "header": {
      "initiator": "操作者",
      "target": "操作の対象",
      "details": "詳細"
    }
  },
  "pt": {
    "header": {
      "initiator": "Initiator",
      "target": "Target",
      "details": "Detalhes"
    }
  },
  "sw": {
    "header": {
      "initiator": "Mwanzilishi",
      "target": "Lengo",
      "details": "Maelezo"
    }
  },
  "zh": {
    "header": {
      "initiator": "发起者",
      "target": "目标",
      "details": "详情"
    }
  },
  "zh-Hant": {
    "header": {
      "initiator": "引發者",
      "target": "目標",
      "details": "細節"
    }
  }
}
</i18n>
