<template>
  <expandable-row class="dataset-summary-row" initially-expanded>
    <template #title>
      <div class="dataset-name-wrap">
        <div class="dataset-name">
          <dataset-link v-if="!dataset.isNew" :project-id="projectId"
            :name="dataset.name" v-tooltip.text/>
          <span v-else v-tooltip.text>{{ dataset.name }}</span>
        </div>
        <div v-if="dataset.isNew" class="dataset-new">
          <span class="icon-plus-circle"></span>
          {{ $t('new') }}
        </div>
      </div>
    </template>
    <template #caption>
      <div class="properties-count">{{ propertiesCount }}</div>
    </template>
    <template #details>
      <i18n-list v-slot="{ value: property }" :list="inFormProperties"
        class="property-list">
        <span>{{ property.name }}</span>
        <span v-if="property.isNew">
          <span class="icon-plus-circle property-new" v-tooltip.sr-only></span>
          <span class="sr-only">&nbsp;{{ $t('addedByThisDraft') }}</span>
        </span>
      </i18n-list>
      <span v-if="inFormProperties.length === 0" class="no-properties">
        {{ $t('entity.noProperties') }}
      </span>
    </template>
  </expandable-row>
</template>

<script setup>
import { computed, inject } from 'vue';

import DatasetLink from '../link.vue';
import ExpandableRow from '../../expandable-row.vue';
import I18nList from '../../i18n/list.vue';

import { useI18nUtils } from '../../../util/i18n';

defineOptions({
  name: 'DatasetSummaryRow'
});
const props = defineProps({
  dataset: {
    type: Object,
    required: true
  }
});
const projectId = inject('projectId');

const inFormProperties = computed(() =>
  props.dataset.properties.filter(p => p.inForm));
const { tn } = useI18nUtils();
const propertiesCount = computed(() => tn(
  'common.propertiesCount',
  props.dataset.properties.length,
  { inform: inFormProperties.value.length }
));
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

.dataset-summary-row {
  @include text-block;

  .expandable-row-title { max-width: calc(100% - 180px); }

  .dataset-name-wrap {
    display: flex;

    .dataset-name {
      @include text-overflow-ellipsis;
      font-weight: bold;
      font-size: 16px;
    }

    .dataset-new {
      vertical-align: super;
      color: $color-success;
      margin-left: 2px;
      min-width: 46px;
    }
  }

  .property-new {
    margin-left: 2px;
    color: $color-success;
    vertical-align: super;
  }

  .properties-count {
    color: #9ca3af;
    line-height: 28px;
  }

  .expandable-row-toggle-button {
    color: #6b7280;
    font-size: 18px;
  }

  .property-list {
    hyphens: auto;
    overflow-wrap: break-word;
  }

  .no-properties { @include italic; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is shown when an Entity List is new
    "new": "new!",
    // This is shown when mouse hovers over plus icon of new Entity Property
    "addedByThisDraft": "Added by this Draft"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "new": "nový!",
    "addedByThisDraft": "Přidáno podle tohoto návrhu"
  },
  "de": {
    "new": "Neu!",
    "addedByThisDraft": "Hinzugefügt von diesem Entwurf"
  },
  "es": {
    "new": "¡nuevo!",
    "addedByThisDraft": "Añadido por este borrador"
  },
  "fr": {
    "new": "nouveau !",
    "addedByThisDraft": "Ajouté par cette ébauche"
  },
  "id": {
    "new": "baru!"
  },
  "it": {
    "new": "nuovo!",
    "addedByThisDraft": "Aggiunto da questa bozza"
  },
  "pt": {
    "new": "Nova!",
    "addedByThisDraft": "Adicionada por este Rascunho"
  },
  "sw": {
    "new": "mpya!",
    "addedByThisDraft": "Imeongezwa na Rasimu hii"
  },
  "zh": {
    "new": "更新！",
    "addedByThisDraft": "由此草稿添加"
  },
  "zh-Hant": {
    "new": "新增！",
    "addedByThisDraft": "已由草稿新增"
  }
}
</i18n>
