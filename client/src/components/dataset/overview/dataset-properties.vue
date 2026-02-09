<template>
  <table v-if="properties.length > 0" id="dataset-properties" class="table">
    <thead>
      <tr>
        <th>{{ $t('header.name') }}</th>
        <th>{{ $t('header.updatedBy') }}</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(property) in properties" :key="property.name">
        <tr>
          <td :rowspan="property.forms.length || 1">
            {{ property.name }}
          </td>
          <td>
            <form-link v-if="property.forms.length > 0"
              :form="property.forms[0]"
              :to="publishedFormPath(property.forms[0].projectId, property.forms[0].xmlFormId)"
              v-tooltip.text/>
            <div v-else class="empty-update-form">{{ $t('none') }}</div>
          </td>
        </tr>
        <template v-for="(form, index) in property.forms" :key="form.xmlFormId">
          <tr v-if="index > 0">
            <td>
              <form-link :form="form"
                :to="publishedFormPath(form.projectId, form.xmlFormId)"
                v-tooltip.text/>
            </td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
  <p v-show="properties.length === 0"
      class="empty-table-message">
      {{ $t('emptyTable') }}
    </p>
</template>

<script setup>
import { computed } from 'vue';

import FormLink from '../../form/link.vue';

import useRoutes from '../../../composables/routes';
import { useRequestData } from '../../../request-data';

defineOptions({
  name: 'DatasetProperties'
});

const { dataset } = useRequestData();
const properties = computed(() => dataset.properties);

const { publishedFormPath } = useRoutes();
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

#dataset-properties {
  &.table{
    table-layout: fixed;

    td {
      overflow-wrap: break-word;
    }

    > tbody > tr:first-child > td {
      border-top: none;
    }

    a {
      font-size: 16px;
    }
  }

  .empty-update-form {
    @include italic;
    color: #9ca3af;
  }
}
</style>

<i18n lang="json5">
  {
    "en": {
      "emptyTable": "The Entities in this Entity List do not have any user-defined properties.",
      // This is shown in an Entity property row in a column about Forms, and 'None' refers to Forms.
      "none": "(None)"
    }
  }
  </i18n>

<i18n>
{
  "cs": {
    "emptyTable": "Entity v tomto seznamu entit nemají žádné uživatelsky definované vlastnosti.",
    "none": "(žádný)"
  },
  "de": {
    "emptyTable": "Die Objekte in dieser Objektliste verfügen über keine benutzerdefinierten Eigenschaften.",
    "none": "(Keine)"
  },
  "es": {
    "emptyTable": "Las entidades de esta lista no tienen propiedades definidas por el usuario.",
    "none": "(ninguno)"
  },
  "fr": {
    "emptyTable": "Les entités dans cette liste n'ont pas de propriétés définies par l'utilisateur",
    "none": "Aucun"
  },
  "it": {
    "emptyTable": "Le entità di questo elenco di entità non hanno proprietà definite dall'utente.",
    "none": "(Nessuna)"
  },
  "pt": {
    "emptyTable": "As Entidades nesta Lista de Entidades não têm nenhuma propriedade definida pelo usuário.",
    "none": "(Nenhum)"
  },
  "sw": {
    "emptyTable": "Huluki katika Orodha hii ya Huluki hazina sifa zozote zilizobainishwa na mtumiaji."
  },
  "zh": {
    "emptyTable": "该实体清单中的实体没有任何使用者定义的属性。",
    "none": "（无）"
  },
  "zh-Hant": {
    "emptyTable": "此實體清單中的實體沒有任何使用者定義的屬性。",
    "none": "(無)"
  }
}
</i18n>
