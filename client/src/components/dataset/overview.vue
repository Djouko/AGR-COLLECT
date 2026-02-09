<template>
  <div v-if="dataset.dataExists" id="dataset-overview">
    <page-section id="dataset-overview-form-connections">
      <template #heading>
        <span class="dataset-overview-heading"><span class="icon-link"></span>{{ $t('connectionsToForms') }}</span>
      </template>
      <template #body>
        <div class="row">
          <div class="col-md-7">
            <connection-to-forms/>
          </div>
          <div class="col-md-5">
            <linked-forms/>
          </div>
        </div>
      </template>
    </page-section>
    <page-section>
      <template #heading>
        <span class="dataset-overview-heading"><span class="icon-cog"></span>{{ $t('entityProperties') }}</span>
        <button v-if="project.dataExists && project.permits('dataset.update')"
          id="dataset-property-new-button" type="button" class="btn btn-primary"
          @click="newDatasetPropertyModal.show()">
          <span class="icon-plus-circle"></span>{{ $t('new') }}
        </button>
      </template>
      <template #body>
        <dataset-properties/>
      </template>
    </page-section>
    <dataset-property-new v-bind="newDatasetPropertyModal"
      @hide="newDatasetPropertyModal.hide()"
      @success="afterCreateProperty"/>
  </div>
</template>

<script setup>
import PageSection from '../page/section.vue';
import ConnectionToForms from './overview/connection-to-forms.vue';
import LinkedForms from './overview/linked-forms.vue';
import DatasetPropertyNew from './property/new.vue';
import DatasetProperties from './overview/dataset-properties.vue';

import { modalData } from '../../util/reactivity';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'DatasetOverview'
});
defineProps({
  projectId: {
    type: String,
    required: true
  },
  datasetName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['fetch-dataset']);

const { project, dataset } = useRequestData();

const newDatasetPropertyModal = modalData();

const afterCreateProperty = () => {
  newDatasetPropertyModal.hide();
  emit('fetch-dataset', true);
};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

#dataset-overview .page-section-heading {
  font-size: 24px;
  margin: 20px 0px;

  .dataset-overview-heading {
    [class^="icon-"] {
      @include icon-box;
      font-size: 24px;
      margin-right: 10px;
    }
  }
}

#dataset-overview-form-connections{
  margin-bottom: 0;
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a title shown above a section of the page.
    "connectionsToForms": "Connections to Forms",
    // This is a title shown above a section of the page.
    "entityProperties" : "Entity Properties",
    // This is shown on a button for creating new Entity Properties
    "new": "New",
  }
}
</i18n>

<i18n>
{
  "cs": {
    "connectionsToForms": "Připojení k formulářům",
    "entityProperties": "Vlastnosti entity"
  },
  "de": {
    "connectionsToForms": "Verbindungen zu Formularen",
    "entityProperties": "Objekteigenschaften",
    "new": "Neu"
  },
  "es": {
    "connectionsToForms": "Conexiones a formularios",
    "entityProperties": "Propiedades de la entidad",
    "new": "Nueva"
  },
  "fr": {
    "connectionsToForms": "Connexions aux formulaires",
    "entityProperties": "Propriétés",
    "new": "Nouvelle"
  },
  "it": {
    "connectionsToForms": "Connessioni ai formulari",
    "entityProperties": "Proprietà della Entità",
    "new": "Nuova"
  },
  "pt": {
    "connectionsToForms": "Conexões com Formulários",
    "entityProperties": "Propriedades da Entidade",
    "new": "Nova"
  },
  "sw": {
    "connectionsToForms": "Viunganisho kwa Fomu",
    "entityProperties": "Sifa za Mashirika"
  },
  "zh": {
    "connectionsToForms": "关联表单",
    "entityProperties": "实体属性",
    "new": "更新"
  },
  "zh-Hant": {
    "connectionsToForms": "與表單的連接",
    "entityProperties": "實體屬性",
    "new": "新增"
  }
}
</i18n>
