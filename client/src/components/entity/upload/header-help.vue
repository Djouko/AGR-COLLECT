<template>
  <div id="entity-upload-header-help"
    :class="{ panel: hasError, 'panel-danger': hasError }">
    <div :class="{ 'panel-heading': hasError }">
      <span>{{ $t('headersNote') }}</span>
      <sentence-separator/>
      <entity-upload-data-template :error="hasError"/>
    </div>
    <div v-if="hasError" class="panel-body">
      <entity-upload-header-errors v-bind="errors"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import EntityUploadDataTemplate from './data-template.vue';
import EntityUploadHeaderErrors from './header-errors.vue';
import SentenceSeparator from '../../sentence-separator.vue';

defineOptions({
  name: 'EntityUploadHeaderHelp'
});
const props = defineProps({
  errors: Object
});

const hasError = computed(() => props.errors != null);
</script>

<style lang="scss">
$border-radius: 3px;

#entity-upload-header-help {
  margin-top: 1px;
  &.panel-danger { margin-top: 10px; }

  .panel-heading {
    padding-bottom: 4px;
    padding-top: 6px;
  }

  .panel-body {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // @transifexKey component.EntityUpload.headersNote
    "headersNote": "The first row in your data file must exactly match the table header you see above."
  }
}
</i18n>

<i18n>
{
  "de": {
    "headersNote": "Die erste Zeile in Ihrer Datendatei muss genau mit dem Tabellenkopf übereinstimmen, den Sie oben sehen."
  },
  "es": {
    "headersNote": "La primera fila de su fichero de datos debe coincidir exactamente con la cabecera de la tabla que ve arriba."
  },
  "fr": {
    "headersNote": "La première ligne de votre fichier de données doit correspondre exactement à l'entête de table visible ci-dessous."
  },
  "it": {
    "headersNote": "The first row in your data file must exactly match the table header you see above."
  },
  "pt": {
    "headersNote": "A primeira linha do seu arquivo de dados deve corresponder exatamente ao cabeçalho da tabela que você vê acima."
  },
  "zh": {
    "headersNote": "您数据文件的首行必须和以上表头完全一致。"
  },
  "zh-Hant": {
    "headersNote": "資料檔案中的第一行必須與上面看到的表標題完全相符。"
  }
}
</i18n>
