<template>
  <div id="form-list">
    <page-section>
      <template #heading>
        <span>{{ $t('title') }}</span>
        <button v-if="project.dataExists && project.permits('form.create')"
          id="form-list-create-button" type="button" class="btn btn-primary"
          @click="selectorModal.show()">
          <span class="icon-plus-circle"></span>{{ $t('action.create') }}&hellip;
        </button>
        <form-sort v-model="sortMode"/>
      </template>
      <template #body>
        <form-table :sort-func="sortFunction"/>
        <form-table :sort-func="sortFunction" :show-closed="true"/>
        <loading :state="forms.initiallyLoading"/>
        <p v-if="forms.dataExists && forms.length === 0"
          class="empty-table-message">
          {{ $t('emptyTable') }}
        </p>
      </template>
    </page-section>
    <form-new-selector 
      v-bind="selectorModal" 
      @hide="selectorModal.hide()"
      @select-mode="onSelectMode"
    />
    
    <form-new 
      v-bind="createModal" 
      @hide="createModal.hide()"
      @success="afterCreate"
    />
    
    <form-builder-modal
      v-bind="builderModal"
      :project-id="project.id"
      @hide="builderModal.hide()"
      @success="afterCreate"
    />
  </div>
</template>

<script>
import FormNew from './new.vue';
import FormNewSelector from './new-selector.vue';
import FormTable from './table.vue';
import Loading from '../loading.vue';
import PageSection from '../page/section.vue';
import FormSort from './sort.vue';
import { FormBuilderModal } from './builder';

import sortFunctions from '../../util/sort';
import useRoutes from '../../composables/routes';
import { modalData } from '../../util/reactivity';
import { useRequestData } from '../../request-data';

export default {
  name: 'FormList',
  components: { FormTable, FormNew, FormNewSelector, FormBuilderModal, FormSort, Loading, PageSection },
  inject: ['alert'],
  setup() {
    const { project, forms } = useRequestData();
    const { formPath } = useRoutes();
    return { project, forms, formPath };
  },
  data() {
    return {
      selectorModal: modalData(),
      createModal: modalData(),
      builderModal: modalData(),
      sortMode: 'alphabetical'
    };
  },
  computed: {
    sortFunction() {
      return sortFunctions[this.sortMode];
    }
  },
  methods: {
    onSelectMode(mode) {
      this.selectorModal.hide();
      if (mode === 'simple') {
        this.builderModal.show();
      } else {
        this.createModal.show();
      }
    },
    async afterCreate(form) {
      const message = this.$t('alert.create', {
        name: form.name != null ? form.name : form.xmlFormId
      });
      await this.$router.push(this.formPath(form.projectId, form.xmlFormId, 'draft'));
      this.project.forms += 1;
      this.alert.success(message);
    }
  }
};
</script>

<style lang="scss">
#form-list {
  margin-bottom: 35px;

  .empty-table-message{
    margin-top: 20px;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a title shown above a section of the page.
    "title": "Forms",
    "action": {
      // This is the text of a button that is used to create a new Form.
      "create": "New"
    },
    "emptyTable": "There are no Forms to show.",
    "alert": {
      "create": "“{name}” has been created as a Form Draft."
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "title": "Formuláře",
    "action": {
      "create": "Nový"
    },
    "emptyTable": "Nejsou k dispozici žádné formuláře."
  },
  "de": {
    "title": "Formulare",
    "action": {
      "create": "Neu"
    },
    "emptyTable": "Keine Formulare zum Anzeigen vorhanden.",
    "alert": {
      "create": "\"{name}\" wurde als Formularentwurf erzeugt."
    }
  },
  "es": {
    "title": "Formularios",
    "action": {
      "create": "Nuevo"
    },
    "emptyTable": "No hay formularios para mostrar.",
    "alert": {
      "create": "\"{name}\" se ha creado como borrador de formulario."
    }
  },
  "fr": {
    "title": "Formulaires",
    "action": {
      "create": "Nouveau"
    },
    "emptyTable": "Il n'y a pas de formulaire à montrer.",
    "alert": {
      "create": "\"{name}\" a été créé comme brouillon."
    }
  },
  "id": {
    "title": "Formulir",
    "action": {
      "create": "Formulir Baru"
    },
    "emptyTable": "Tidak ada formulir untuk ditampilkan."
  },
  "it": {
    "title": "Formulari",
    "action": {
      "create": "Nuovo"
    },
    "emptyTable": "Non ci sono formulari da mostrare.",
    "alert": {
      "create": "“{name}” è stato creato come bozza di formulario."
    }
  },
  "ja": {
    "title": "フォーム",
    "action": {
      "create": "新規作成"
    },
    "emptyTable": "表示できるフォームはありません。"
  },
  "pt": {
    "title": "Formulários",
    "action": {
      "create": "Novo"
    },
    "emptyTable": "Não há formulários para exibir."
  },
  "sw": {
    "title": "Fomu",
    "action": {
      "create": "Mpya"
    },
    "emptyTable": "hakuna Fomu za kuonyesha"
  },
  "zh": {
    "title": "表单",
    "action": {
      "create": "更新"
    },
    "emptyTable": "暂无表单可显示。",
    "alert": {
      "create": "表单草稿“{name}”已创建。"
    }
  },
  "zh-Hant": {
    "title": "表單",
    "action": {
      "create": "新增"
    },
    "emptyTable": "沒有可顯示的表單。",
    "alert": {
      "create": "「{name}」已建立為表單草稿。"
    }
  }
}
</i18n>
