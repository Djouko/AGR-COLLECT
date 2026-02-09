<template>
  <div id="entity-upload-data-error" class="panel panel-danger">
    <div class="panel-heading">
      <h1 class="panel-title">{{ $t('title') }}</h1>
    </div>
    <div class="panel-body">{{ message }}</div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'EntityUploadDataError'
});
defineProps({
  message: {
    type: String,
    required: true
  }
});
</script>

<style lang="scss">
#entity-upload-data-error { margin-top: 15px; }
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Data error"
  }
}
</i18n>

<i18n>
{
  "de": {
    "title": "Datenfehler"
  },
  "es": {
    "title": "Error de datos"
  },
  "fr": {
    "title": "Erreur de données"
  },
  "it": {
    "title": "Errore dati"
  },
  "pt": {
    "title": "Erro de dados"
  },
  "zh": {
    "title": "数据错误"
  },
  "zh-Hant": {
    "title": "資料錯誤"
  }
}
</i18n>
