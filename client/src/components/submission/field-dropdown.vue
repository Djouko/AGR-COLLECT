<template>
  <multiselect id="submission-field-dropdown" :model-value="modelValue"
    :options="options" :label="$t('field.columns')" :placeholder="placeholder"
    :all="$t('action.all')" :none="$t('action.none')"
    :search="$t('field.search')"
    @update:model-value="$emit('update:modelValue', $event)">
    <template #after-list="{ selected }">
      <template v-if="selected.size > 100">
        <span class="icon-exclamation-triangle"></span>{{ $t('warning') }}
      </template>
    </template>
  </multiselect>
</template>

<script setup>
import { computed } from 'vue';

import Multiselect from '../multiselect.vue';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'SubmissionFieldDropdown'
});
defineProps({
  modelValue: {
    type: Array,
    required: true
  }
});
defineEmits(['update:modelValue']);

const { fields } = useRequestData();
const options = computed(() => fields.selectable.map(field => ({
  value: field,
  key: field.path,
  text: field.name,
  description: field.header
})));
const placeholder = (counts) => counts.selected;
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

#submission-field-dropdown {

  .dropdown-menu { width: 275px; }
  .after-list {
    background-color: $color-warning-light;
    font-size: 14px;

    .icon-exclamation-triangle { margin-right: $margin-right-icon; }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "field": {
      // This is shown beneath text that indicates the number of columns that
      // the user has selected to display in a table. For example, that text may
      // read "10 of 100", where 10 is the number of columns selected, and 100
      // is the total number of columns.
      "columns": "Columns shown",
      "search": "Search columns…"
    },
    "action": {
      /*
      This is the text of the button in dropdown menu of column selector,
      that allows the user to select all columns.
      */
      "all": "All",
      /*
      This is the text of the button in dropdown menu of column selector,
      that allows the user to unselect all columns.
      */
      "none": "None"
    },
    "warning": "Selecting too many columns might slow down your computer."
  }
}
</i18n>

<i18n>
{
  "cs": {
    "field": {
      "columns": "Zobrazené sloupce",
      "search": "Hledat sloupce…"
    },
    "warning": "Výběr příliš mnoha sloupců může zpomalit počítač."
  },
  "de": {
    "field": {
      "columns": "angezeigte Spalten",
      "search": "Spalten suchen..."
    },
    "action": {
      "all": "Alle",
      "none": "Keine"
    },
    "warning": "Die Auswahl zu vieler Spalten kann Ihren Computer verlangsamen."
  },
  "es": {
    "field": {
      "columns": "Se muestran las columnas",
      "search": "Buscar columnas…"
    },
    "action": {
      "all": "Todos",
      "none": "Ninguno"
    },
    "warning": "Seleccionar demasiadas columnas puede ralentizar su computadora."
  },
  "fr": {
    "field": {
      "columns": "Colonnes affichées",
      "search": "Chercher des colonnes"
    },
    "action": {
      "all": "Toutes",
      "none": "Aucune"
    },
    "warning": "Sélectionner trop de colonnes peut ralentir votre ordinateur."
  },
  "id": {
    "field": {
      "columns": "Kolom terlihat",
      "search": "Mencari kolom..."
    }
  },
  "it": {
    "field": {
      "columns": "Colonne mostrate",
      "search": "Cerca colonne..."
    },
    "action": {
      "all": "Tutto",
      "none": "Nessuno/a"
    },
    "warning": "La selezione di troppe colonne potrebbe rallentare il computer."
  },
  "ja": {
    "field": {
      "columns": "表示された列",
      "search": "列を検索"
    }
  },
  "pt": {
    "field": {
      "columns": "Colunas exibidas",
      "search": "Colunas de busca..."
    },
    "action": {
      "all": "Todos",
      "none": "Nenhum"
    },
    "warning": "Selecionar colunas em excesso pode deixar seu computador lento."
  },
  "sw": {
    "field": {
      "columns": "Safu wima zimeonyeshwa",
      "search": "Tafuta safu wima..."
    },
    "warning": "Kuchagua safu wima nyingi kunaweza kupunguza kasi ya kompyuta yako."
  },
  "zh": {
    "field": {
      "columns": "显示列",
      "search": "搜索列…"
    },
    "action": {
      "all": "全部",
      "none": "无"
    },
    "warning": "选择过多列可能导致设备运行缓慢。"
  },
  "zh-Hant": {
    "field": {
      "columns": "顯示欄位",
      "search": "搜尋欄位..."
    },
    "action": {
      "all": "全部",
      "none": "無"
    },
    "warning": "選擇太多列可能會降低計算機的速度。"
  }
}
</i18n>
