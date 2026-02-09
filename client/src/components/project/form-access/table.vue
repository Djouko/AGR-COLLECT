<template>
  <table-freeze id="project-form-access-table"
    :class="{ 'no-field-keys': noFieldKeys }" :data="forms.data"
    key-prop="xmlFormId" :frozen-only="noFieldKeys">
    <template #head-frozen>
      <th>{{ $t('header.form') }}</th>
      <th>
        <span>{{ $t('header.state') }}</span>
        <button type="button" class="btn btn-link"
          @click="$emit('show-states')">
          <span class="icon-question-circle"></span>
        </button>
      </th>
    </template>
    <template #head-scrolling>
      <th><div>{{ $t('resource.appUsers') }}</div></th>
      <th v-for="fieldKey of fieldKeys.withToken" :key="fieldKey.id">
        <div><span v-tooltip.text>{{ fieldKey.displayName }}</span></div>
      </th>
      <th></th>
    </template>

    <template #data-frozen="{ data: form }">
      <project-form-access-row :form="form"
        :changes="changesByForm[form.xmlFormId]" frozen
        @update:state="updateState"/>
    </template>
    <template #data-scrolling="{ data: form }">
      <project-form-access-row :form="form"
        :changes="changesByForm[form.xmlFormId]"
        @update:field-key-access="updateFieldKeyAccess"/>
    </template>
  </table-freeze>
</template>

<script>
import ProjectFormAccessRow from './row.vue';
import TableFreeze from '../../table/freeze.vue';

import { useRequestData } from '../../../request-data';

export default {
  name: 'ProjectFormAccessTable',
  components: { ProjectFormAccessRow, TableFreeze },
  props: {
    changesByForm: {
      type: Object,
      required: true
    }
  },
  emits: ['show-states', 'update:state', 'update:fieldKeyAccess'],
  setup() {
    const { forms, fieldKeys } = useRequestData();
    return { forms, fieldKeys };
  },
  computed: {
    noFieldKeys() {
      return this.fieldKeys.dataExists && this.fieldKeys.withToken.length === 0;
    }
  },
  methods: {
    updateState(form, state) {
      this.$emit('update:state', form, state);
    },
    updateFieldKeyAccess(form, fieldKey, accessible) {
      this.$emit('update:fieldKeyAccess', form, fieldKey, accessible);
    }
  }
};
</script>

<style lang="scss">
@import '../../../assets/scss/variables';

#project-form-access-table {
  .table-freeze-frozen {
    margin-top: 70px;

    &.no-field-keys {
      margin-top: 0;
    }
  }
  .table-freeze-scrolling-container {
    padding-top: 70px;
  }

  .table {
    th {
      height: 33px;
    }

    td {
      height: 51px;
      vertical-align: middle;
    }
  }

  .table-freeze-frozen {
    $form-name-width: 250px;
    $state-width: 200px;

    table-layout: fixed;
    width: $form-name-width + $state-width;

    th {
      &:first-child {
        width: $form-name-width;
      }

      &:nth-child(2) {
        width: $state-width;

        > span:first-child { margin-right: 5px; }
        .btn-link { padding: 0; }
        .icon-question-circle { margin-right: 0; }
      }
    }
  }

  .table-freeze-scrolling {
    width: auto;

    thead {
      background-color: transparent;
    }

    th {
      position: relative;

      div {
        bottom: 2px;
        left: 30px;
        position: absolute;
        transform: rotate(-45deg);
        transform-origin: center left;
        width: 120px;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &::before {
        bottom: 0;
        content: '';
        height: 102px;
        left: 51px;
        position: absolute;
        transform: skewX(-45deg);
        transform-origin: center left;
      }
      &, &::before {
        min-width: 42px;
        width: 42px;
      }
      &:first-child {
        &, &::before {
          background-color: $color-table-heading-background;
        }

        &::before {
          border-left: 1px solid #f3f4f6;
        }
      }
      &:nth-child(2n + 3)::before {
        background-color: #f3f4f6;
      }
      &:last-child::before {
        display: none;
      }

      &:last-child {
        min-width: 102px;
        width: 102px;
      }
    }

    td:nth-child(2n + 3) {
      background-color: #f3f4f6;
    }
    td:last-child {
      background-color: transparent;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "header": {
      "form": "Form",
      "state": "State"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "header": {
      "form": "Formulář",
      "state": "Stav"
    }
  },
  "de": {
    "header": {
      "form": "Formular",
      "state": "Status"
    }
  },
  "es": {
    "header": {
      "form": "Formulario",
      "state": "Estado"
    }
  },
  "fr": {
    "header": {
      "form": "Formulaire",
      "state": "État"
    }
  },
  "id": {
    "header": {
      "form": "Formulir",
      "state": "Status"
    }
  },
  "it": {
    "header": {
      "form": "Formulario",
      "state": "Stato"
    }
  },
  "ja": {
    "header": {
      "form": "フォーム",
      "state": "状態"
    }
  },
  "pt": {
    "header": {
      "form": "Formulário",
      "state": "Status"
    }
  },
  "sw": {
    "header": {
      "form": "fomu",
      "state": "hali"
    }
  },
  "zh": {
    "header": {
      "form": "表单",
      "state": "状态"
    }
  },
  "zh-Hant": {
    "header": {
      "form": "表單",
      "state": "狀態"
    }
  }
}
</i18n>
