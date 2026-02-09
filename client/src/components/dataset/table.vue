<template>
  <table id="dataset-table" class="table">
    <thead>
      <tr>
        <th>{{ $t('header.listName') }}</th>
        <th class="entities">{{ $t('header.entities') }}</th>
        <th>{{ $t('header.lastEntity') }}</th>
        <th>{{ $t('common.status') }}</th>
        <th>{{ $t('header.actions') }}</th>
      </tr>
    </thead>
    <tbody v-if="datasets.dataExists">
      <dataset-row v-for="dataset of datasets" :key="dataset.id"
        :dataset="dataset"/>
    </tbody>
  </table>
  <p v-if="datasets.dataExists && datasets.length === 0" class="empty-table-message">
    {{ $t('emptyTable') }}
  </p>
</template>

<script setup>
import DatasetRow from './row.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'DatasetTable'
});

const { datasets } = useRequestData();
</script>

<style lang="scss">
#dataset-table {
  table-layout: fixed;

  .entities {
    text-align: right;
    padding-right: 10%;
  }

  &+ .empty-table-message {
    margin-bottom: 20px;
  }
}
</style>

<i18n lang="json5">
  {
    "en": {
      "emptyTable": "No Entities have been created for this Project yet."
    }
  }
</i18n>

<i18n>
{
  "cs": {
    "emptyTable": "Nebyly vytvořeny žádné entity pro tento projekt."
  },
  "de": {
    "emptyTable": "Es wurden noch keine Objekte für dieses Projekt erstellt."
  },
  "es": {
    "emptyTable": "Aún no se han creado Entidades para este Proyecto."
  },
  "fr": {
    "emptyTable": "Aucune entité n'a été créée pour ce projet"
  },
  "it": {
    "emptyTable": "Non sono ancora stati create Entità per questo progetto."
  },
  "pt": {
    "emptyTable": "Nenhuma Entidade foi criada para este Projeto ainda."
  },
  "sw": {
    "emptyTable": "Bado hakuna Huluki ambazo zimeundwa kwa ajili ya Mradi huu."
  },
  "zh": {
    "emptyTable": "尚未为此项目建立任何实体"
  },
  "zh-Hant": {
    "emptyTable": "尚未為此專案建立任何實體。"
  }
}
</i18n>
