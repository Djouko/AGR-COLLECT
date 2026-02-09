<template>
  <modal 
    id="form-builder-modal" 
    :state="state" 
    :hideable="!awaitingResponse"
    size="full"
    backdrop
    @hide="handleClose"
  >
    <template #title>
      <span class="icon-magic"></span>
      {{ $t('builder.title') }}
    </template>

    <template #body>
      <div v-if="step === 'templates'" class="builder-step">
        <form-builder-templates
          @select-template="selectTemplate"
          @start-blank="startBlank"
        />
      </div>

      <div v-else-if="step === 'config'" class="builder-step builder-config">
        <div class="config-header">
          <button type="button" class="btn-back" @click="goBack">
            <span class="icon-angle-left"></span>
            {{ $t('builder.back') }}
          </button>
          <h4>{{ $t('builder.configTitle') }}</h4>
        </div>

        <div class="config-form">
          <div class="form-group">
            <label for="form-title">{{ $t('builder.formTitle') }} *</label>
            <input 
              id="form-title"
              type="text" 
              v-model="formConfig.title"
              :placeholder="$t('builder.formTitlePlaceholder')"
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label for="form-id">{{ $t('builder.formId') }} *</label>
            <input 
              id="form-id"
              type="text" 
              v-model="formConfig.id"
              :placeholder="$t('builder.formIdPlaceholder')"
              pattern="[a-zA-Z][a-zA-Z0-9_]*"
              class="form-control"
            >
            <small class="form-hint">{{ $t('builder.formIdHint') }}</small>
          </div>

          <button 
            type="button" 
            class="btn btn-primary btn-continue"
            :disabled="!isConfigValid"
            @click="goToBuilder"
          >
            {{ $t('builder.continue') }}
            <span class="icon-angle-right"></span>
          </button>
        </div>
      </div>

      <div v-else-if="step === 'builder'" class="builder-step builder-main">
        <div class="builder-header">
          <button type="button" class="btn-back" @click="step = 'config'">
            <span class="icon-angle-left"></span>
          </button>
          <div class="form-info">
            <h4>{{ formConfig.title }}</h4>
            <span class="form-id">ID: {{ formConfig.id }}</span>
          </div>
          <div class="builder-actions">
            <button 
              type="button" 
              class="btn btn-outline-secondary"
              @click="downloadForm"
            >
              <span class="icon-download"></span>
              {{ $t('builder.download') }}
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              :disabled="!canCreate || awaitingResponse"
              @click="createForm"
            >
              <span class="icon-check"></span>
              {{ $t('builder.create') }}
              <spinner :state="awaitingResponse"/>
            </button>
          </div>
        </div>

        <div class="builder-workspace">
          <div class="builder-sidebar">
            <form-builder-toolbox @add-field="addField"/>
          </div>
          <div class="builder-canvas-container">
            <form-builder-canvas 
              :fields="fields"
              @update-fields="fields = $event"
            />
          </div>
        </div>

        <div v-if="validationErrors.length > 0" class="validation-errors">
          <span class="icon-exclamation-triangle"></span>
          <ul>
            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
          </ul>
        </div>

        <div v-if="validationWarnings.length > 0" class="validation-warnings">
          <span class="icon-info-circle"></span>
          <ul>
            <li v-for="(warning, index) in validationWarnings" :key="index">{{ warning }}</li>
          </ul>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from '../../modal.vue';
import Spinner from '../../spinner.vue';
import FormBuilderTemplates from './FormBuilderTemplates.vue';
import FormBuilderToolbox from './FormBuilderToolbox.vue';
import FormBuilderCanvas from './FormBuilderCanvas.vue';
import { 
  FIELD_TYPES, 
  generateFieldId, 
  sanitizeFieldName,
  createXLSFormFile,
  downloadXLSForm,
  validateFormDefinition,
  generateRequiredMetadataFields,
  checkRequiredMetadata
} from './xlsform-generator';
import useRequest from '../../../composables/request';
import { apiPaths, isProblem } from '../../../util/request';

export default {
  name: 'FormBuilderModal',
  components: {
    Modal,
    Spinner,
    FormBuilderTemplates,
    FormBuilderToolbox,
    FormBuilderCanvas
  },
  props: {
    state: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: [String, Number],
      required: true
    }
  },
  emits: ['hide', 'success'],
  setup() {
    const { request, awaitingResponse } = useRequest();
    return { request, awaitingResponse };
  },
  data() {
    return {
      step: 'templates',
      formConfig: {
        title: '',
        id: '',
        version: '1'
      },
      fields: [],
      validationErrors: [],
      validationWarnings: []
    };
  },
  computed: {
    isConfigValid() {
      return this.formConfig.title.trim() !== '' && 
             this.formConfig.id.trim() !== '' &&
             /^[a-zA-Z][a-zA-Z0-9_]*$/.test(this.formConfig.id);
    },
    canCreate() {
      return this.isConfigValid && this.fields.length > 0;
    }
  },
  watch: {
    state(newState) {
      if (!newState) {
        this.reset();
      }
    },
    'formConfig.title'(newTitle) {
      if (newTitle && !this.formConfig.id) {
        this.formConfig.id = sanitizeFieldName(newTitle);
      }
    }
  },
  methods: {
    reset() {
      this.step = 'templates';
      this.formConfig = { title: '', id: '', version: '1' };
      this.fields = [];
      this.validationErrors = [];
      this.validationWarnings = [];
    },
    handleClose() {
      if (this.step !== 'templates' && this.fields.length > 0) {
        if (!confirm(this.$t('builder.confirmClose'))) {
          return;
        }
      }
      this.$emit('hide');
    },
    goBack() {
      if (this.step === 'config') {
        this.step = 'templates';
      } else if (this.step === 'builder') {
        this.step = 'config';
      }
    },
    selectTemplate(template) {
      this.formConfig.title = template.name;
      this.formConfig.id = template.id;
      this.fields = template.fields.map(field => ({
        ...field,
        id: generateFieldId(),
        listName: field.listName || (field.choices ? sanitizeFieldName(field.name) + '_list' : undefined)
      }));
      this.step = 'config';
    },
    startBlank() {
      this.fields = generateRequiredMetadataFields();
      this.step = 'config';
    },
    goToBuilder() {
      if (this.isConfigValid) {
        this.step = 'builder';
      }
    },
    addField(type) {
      const fieldType = FIELD_TYPES[type];
      if (!fieldType) return;

      const fieldCount = this.fields.filter(f => f.type === type).length + 1;
      const baseName = sanitizeFieldName(fieldType.label);
      
      const newField = {
        id: generateFieldId(),
        type: type,
        name: `${baseName}_${fieldCount}`,
        label: `${fieldType.label} ${fieldCount}`,
        required: false,
        hint: '',
        choices: fieldType.hasChoices ? [] : undefined
      };

      if (fieldType.hasChoices) {
        newField.listName = newField.name + '_list';
        newField.choices = [
          { name: 'option_1', label: 'Option 1' },
          { name: 'option_2', label: 'Option 2' }
        ];
      }

      this.fields.push(newField);
    },
    getFormDefinition() {
      return {
        title: this.formConfig.title,
        id: this.formConfig.id,
        version: this.formConfig.version,
        fields: this.fields
      };
    },
    downloadForm() {
      const formDef = this.getFormDefinition();
      downloadXLSForm(formDef, formDef.id);
    },
    createForm() {
      const formDef = this.getFormDefinition();
      
      const validation = validateFormDefinition(formDef);
      if (!validation.valid) {
        this.validationErrors = validation.errors;
        this.validationWarnings = validation.warnings || [];
        return;
      }
      this.validationErrors = [];
      this.validationWarnings = [];

      const file = createXLSFormFile(formDef, formDef.id);
      
      this.request({
        method: 'POST',
        url: apiPaths.forms(this.projectId, { ignoreWarnings: true }),
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'X-XlsForm-FormId-Fallback': encodeURIComponent(formDef.id)
        },
        data: file,
        problemToAlert: ({ code, details }) => {
          if (code === 400.15) {
            return `Erreur XLSForm: ${details?.error || 'Formulaire invalide'}`;
          }
          if (code === 409.3 && details?.table === 'forms') {
            return `Un formulaire avec l'ID "${formDef.id}" existe déjà dans ce projet.`;
          }
          return null;
        }
      })
        .then(({ data }) => {
          return this.request({
            method: 'POST',
            url: apiPaths.publishDraft(this.projectId, data.xmlFormId)
          })
            .then(() => {
              return this.request({
                method: 'GET',
                url: apiPaths.form(this.projectId, data.xmlFormId),
                extended: true
              });
            })
            .then(({ data: publishedForm }) => {
              this.$emit('success', publishedForm);
            })
            .catch((publishError) => {
              console.error('Error publishing form:', publishError);
              this.$emit('success', data);
            });
        })
        .catch((error) => {
          console.error('Error creating form:', error);
          this.validationErrors = [this.$t('builder.createError') || 'Erreur lors de la création du formulaire'];
        });
    }
  }
};
</script>

<style lang="scss">
#form-builder-modal {
  .modal-body {
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    min-height: 70vh;
  }
}

.builder-step {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.builder-config {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
}

.config-header {
  margin-bottom: 30px;

  h4 {
    font-size: 24px;
    font-weight: 600;
    margin: 20px 0 0 0;
    color: #111827;
  }
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: #6b7280;
  background: transparent;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f8f9fa;
    color: #495057;
  }
}

.config-form {
  .form-group {
    margin-bottom: 20px;

    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      margin-bottom: 6px;
    }

    .form-control {
      width: 100%;
      padding: 10px 14px;
      font-size: 15px;
      border: 1px solid #ced4da;
      border-radius: 6px;
      transition: border-color 0.15s ease;

      &:focus {
        outline: none;
        border-color: #2e7d32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
      }
    }

    .form-hint {
      display: block;
      margin-top: 6px;
      font-size: 12px;
      color: #6b7280;
    }
  }
}

.btn-continue {
  width: 100%;
  padding: 12px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
}

.builder-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.builder-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;

  .form-info {
    flex: 1;

    h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: #111827;
    }

    .form-id {
      font-size: 12px;
      color: #6b7280;
      font-family: monospace;
    }
  }
}

.builder-actions {
  display: flex;
  gap: 10px;

  .btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    font-size: 13px;
  }

  .btn-outline-secondary {
    background: #fff;
    border: 1px solid #9ca3af;
    color: #6b7280;

    &:hover {
      background: #6b7280;
      color: #fff;
    }
  }
}

.builder-workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.builder-sidebar {
  width: 260px;
  border-right: 1px solid #e9ecef;
  overflow-y: auto;
  flex-shrink: 0;
}

.builder-canvas-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #f5f6f8;
}

.validation-errors {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fce4e4;
  border-top: 1px solid #f5c6c6;
  color: #c62828;
  font-size: 13px;

  li {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.validation-warnings {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  background: #fff3cd;
  border-top: 1px solid #ffc107;
  color: #856404;
  font-size: 13px;

  li {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "builder": {
      "title": "Visual Form Builder",
      "back": "Back",
      "configTitle": "Configure your form",
      "formTitle": "Form Title",
      "formTitlePlaceholder": "e.g., Field Survey 2024",
      "formId": "Form ID",
      "formIdPlaceholder": "e.g., field_survey_2024",
      "formIdHint": "Must start with a letter and contain only letters, numbers, and underscores",
      "continue": "Continue",
      "download": "Download XLS",
      "create": "Create Form",
      "confirmClose": "You have unsaved changes. Are you sure you want to close?",
      "createError": "Error creating the form. Please check your fields and try again."
    }
  },
  "fr": {
    "builder": {
      "title": "Créateur de Formulaire Visuel",
      "back": "Retour",
      "configTitle": "Configurer votre formulaire",
      "formTitle": "Titre du formulaire",
      "formTitlePlaceholder": "Ex: Enquête terrain 2024",
      "formId": "Identifiant du formulaire",
      "formIdPlaceholder": "Ex: enquete_terrain_2024",
      "formIdHint": "Doit commencer par une lettre et ne contenir que des lettres, chiffres et underscores",
      "continue": "Continuer",
      "download": "Télécharger XLS",
      "create": "Créer le formulaire",
      "confirmClose": "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir fermer ?",
      "createError": "Erreur lors de la création du formulaire. Veuillez vérifier vos champs et réessayer."
    }
  }
}
</i18n>
