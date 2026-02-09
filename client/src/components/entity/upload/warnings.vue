<template>
  <div id="entity-upload-warnings">
    <entity-upload-warning v-if="raggedRows != null" :ranges="raggedRows"
      @rows="$emit('rows', $event)">
      {{ $t('row.raggedRows') }}
    </entity-upload-warning>
    <entity-upload-warning v-if="largeCell != null" :ranges="[[largeCell, largeCell]]"
      @rows="$emit('rows', $event)">
      {{ $t('row.largeCell') }}
    </entity-upload-warning>
  </div>
</template>

<script setup>
import EntityUploadWarning from './warning.vue';

defineOptions({
  name: 'EntityUploadWarnings'
});
defineProps({
  raggedRows: Array,
  largeCell: Number
});
defineEmits(['rows']);
</script>

<style lang="scss">
#entity-upload-warnings {
  background-color: #deedf3;
  padding: 9px 6px;
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a warning that is followed by a list of rows.
    "row": {
      "raggedRows": "Fewer columns were found than expected in some rows:",
      "largeCell": "Some cells are abnormally large, which can indicate difficulties reading your file:"
    }
  }
}
</i18n>

<i18n>
{
  "de": {
    "row": {
      "raggedRows": "In einigen Zeilen wurden weniger Spalten als erwartet gefunden:",
      "largeCell": "Einige Zellen sind ungewöhnlich groß, was auf Schwierigkeiten beim Lesen Ihrer Datei hinweisen kann:"
    }
  },
  "es": {
    "row": {
      "raggedRows": "Se encontraron menos columnas de las esperadas en algunas filas:",
      "largeCell": "Algunas celdas son anormalmente grandes, lo que puede indicar dificultades para leer su archivo:"
    }
  },
  "fr": {
    "row": {
      "raggedRows": "Dans certaines lignes, il y a eu moins de colonnes détectées que prévu:",
      "largeCell": "Certaines cellules sont anormalement larges, ce qui peut indiquer des difficultés à lire votre fichier:"
    }
  },
  "it": {
    "row": {
      "raggedRows": "In alcune righe sono state trovate meno colonne del previsto:",
      "largeCell": "Alcune celle sono eccessivamente grandi, il che può indicare difficoltà nella lettura del file:"
    }
  },
  "pt": {
    "row": {
      "raggedRows": "Menos colunas foram encontradas do que o esperado em algumas linhas:",
      "largeCell": "Algumas células são anormalmente grandes, o que pode indicar dificuldades na leitura do seu arquivo:"
    }
  },
  "zh": {
    "row": {
      "raggedRows": "部分行包含的纵列数少于预期：",
      "largeCell": "部分单元格异常过大，这可能会使文件读取失败："
    }
  },
  "zh-Hant": {
    "row": {
      "raggedRows": "在某些行中發現的列數少於預期：",
      "largeCell": "有些儲存格異常大，這可能表示讀取檔案有困難："
    }
  }
}
</i18n>
