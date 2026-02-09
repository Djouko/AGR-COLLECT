<!--
  FormBuilderCanvas - Zone de design du formulaire
  Affiche les champs ajoutés et permet de les réorganiser
-->
<template>
  <div 
    class="form-builder-canvas"
    :class="{ 'is-drag-over': isDragOver }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDropEmpty"
  >
    <div 
      v-if="fields.length === 0" 
      class="canvas-empty"
      :class="{ 'is-drag-target': isDragOver }"
    >
      <span class="icon-file-o"></span>
      <p>{{ $t('canvas.emptyTitle') }}</p>
      <p class="hint">{{ isDragOver ? $t('canvas.dropHere') : $t('canvas.emptyHint') }}</p>
    </div>

    <div v-else class="canvas-fields">
      <div 
        class="drop-zone drop-zone--top"
        :class="{ 'is-active': dropTargetIndex === 0 }"
        @dragover.prevent="setDropTarget(0)"
        @dragleave="clearDropTarget"
        @drop.prevent.stop="onDropAt(0, $event)"
      >
        <span class="drop-indicator">{{ $t('canvas.insertHere') }}</span>
      </div>

      <template v-for="(field, index) in fields" :key="field.id || index">
        <form-builder-field
          :field="field"
          :index="index"
          @update="updateField(index, $event)"
          @delete="deleteField(index)"
          @move="moveField"
        />
        
        <div 
          class="drop-zone"
          :class="{ 'is-active': dropTargetIndex === index + 1 }"
          @dragover.prevent="setDropTarget(index + 1)"
          @dragleave="clearDropTarget"
          @drop.prevent.stop="onDropAt(index + 1, $event)"
        >
          <span class="drop-indicator">{{ $t('canvas.insertHere') }}</span>
        </div>
      </template>
    </div>

    <div v-if="fields.length > 0" class="canvas-summary">
      <span class="icon-file-text"></span>
      {{ $t('canvas.fieldCount', { count: fields.length }) }}
    </div>
  </div>
</template>

<script>
import FormBuilderField from './FormBuilderField.vue';
import { FIELD_TYPES, generateFieldId, sanitizeFieldName } from './xlsform-generator';

export default {
  name: 'FormBuilderCanvas',
  components: { FormBuilderField },
  props: {
    fields: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update-fields', 'add-field-at'],
  data() {
    return {
      isDragOver: false,
      dropTargetIndex: -1
    };
  },
  methods: {
    updateField(index, updatedField) {
      const newFields = [...this.fields];
      newFields[index] = updatedField;
      this.$emit('update-fields', newFields);
    },
    deleteField(index) {
      const confirmMsg = this.$t('canvas.confirmDelete');
      if (window.confirm(confirmMsg)) {
        const newFields = [...this.fields];
        newFields.splice(index, 1);
        console.log('Deleting field at index:', index, 'New fields count:', newFields.length);
        this.$emit('update-fields', newFields);
      }
    },
    moveField({ from, to }) {
      const newFields = [...this.fields];
      const [moved] = newFields.splice(from, 1);
      newFields.splice(to, 0, moved);
      this.$emit('update-fields', newFields);
    },
    onDragOver(event) {
      const fieldType = event.dataTransfer.types.includes('application/x-field-type');
      if (fieldType) {
        this.isDragOver = true;
        event.dataTransfer.dropEffect = 'copy';
      }
    },
    onDragLeave() {
      this.isDragOver = false;
    },
    setDropTarget(index) {
      this.dropTargetIndex = index;
      this.isDragOver = true;
    },
    clearDropTarget() {
      this.dropTargetIndex = -1;
    },
    onDropEmpty(event) {
      if (this.fields.length === 0) {
        this.onDropAt(0, event);
      }
      this.isDragOver = false;
    },
    onDropAt(index, event) {
      if (!event || !event.dataTransfer) {
        console.warn('Drop event missing dataTransfer');
        this.isDragOver = false;
        this.dropTargetIndex = -1;
        return;
      }

      const fieldType = event.dataTransfer.getData('application/x-field-type') || 
                        event.dataTransfer.getData('text/plain');
      
      console.log('Drop at index:', index, 'fieldType:', fieldType);
      
      if (fieldType && FIELD_TYPES[fieldType]) {
        this.addFieldAt(fieldType, index);
      }
      
      this.isDragOver = false;
      this.dropTargetIndex = -1;
    },
    addFieldAt(type, index) {
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

      const newFields = [...this.fields];
      newFields.splice(index, 0, newField);
      this.$emit('update-fields', newFields);
    }
  }
};
</script>

<style lang="scss" scoped>
.form-builder-canvas {
  background: #fff;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  min-height: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.canvas-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  text-align: center;

  span {
    font-size: 48px;
    margin-bottom: 15px;
  }

  p {
    margin: 0;
    font-size: 16px;
    color: #6b7280;

    &.hint {
      font-size: 13px;
      color: #adb5bd;
      margin-top: 8px;
    }
  }
}

.canvas-fields {
  flex: 1;
}

.drop-zone {
  height: 8px;
  margin: 4px 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;

  .drop-indicator {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 11px;
    color: #2e7d32;
    white-space: nowrap;
    background: #e8f5e9;
    padding: 2px 10px;
    border-radius: 10px;
  }

  &.is-active {
    height: 40px;
    background: #e8f5e9;
    border: 2px dashed #2e7d32;

    .drop-indicator {
      display: block;
    }
  }

  &--top {
    margin-top: 0;
  }
}

.is-drag-over .canvas-empty {
  border-color: #2e7d32;
  background: #f0f7f0;
}

.canvas-empty.is-drag-target {
  border-color: #2e7d32;
  background: #e8f5e9;
}

.canvas-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

<i18n lang="json5">
{
  "en": {
    "canvas": {
      "emptyTitle": "Your form is empty",
      "emptyHint": "Add fields from the toolbox on the left, or choose a template to get started",
      "dropHere": "Drop here to add the field",
      "insertHere": "Insert here",
      "fieldCount": "{count} field(s) in your form",
      "confirmDelete": "Are you sure you want to delete this field?"
    }
  },
  "fr": {
    "canvas": {
      "emptyTitle": "Votre formulaire est vide",
      "emptyHint": "Ajoutez des champs depuis la palette à gauche, ou choisissez un modèle pour commencer",
      "dropHere": "Déposez ici pour ajouter le champ",
      "insertHere": "Insérer ici",
      "fieldCount": "{count} champ(s) dans votre formulaire",
      "confirmDelete": "Êtes-vous sûr de vouloir supprimer ce champ ?"
    }
  }
}
</i18n>
