<!--
  FormBuilderField - Composant pour afficher et éditer un champ du formulaire
  Permet de configurer les propriétés d'un champ (label, required, choices, etc.)
-->
<template>
  <div 
    class="form-builder-field" 
    :class="{ 'is-editing': isEditing, 'is-dragging': isDragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent
    @drop="onDrop"
  >
    <div class="field-header">
      <span class="drag-handle" title="Glisser pour réorganiser">
        <span class="icon-random"></span>
      </span>
      
      <span class="field-type-badge" :title="fieldTypeInfo.description">
        <span :class="'icon-' + fieldTypeInfo.icon"></span>
        {{ fieldTypeInfo.label }}
      </span>

      <div class="field-actions">
        <button 
          type="button" 
          class="btn-icon" 
          :title="isEditing ? 'Fermer' : 'Modifier'"
          @click="toggleEdit"
        >
          <span :class="isEditing ? 'icon-times' : 'icon-pencil'"></span>
        </button>
        <button 
          type="button" 
          class="btn-icon btn-delete" 
          title="Supprimer ce champ"
          @click="$emit('delete')"
        >
          <span class="icon-trash"></span>
        </button>
      </div>
    </div>

    <div class="field-preview">
      <div class="preview-label">
        {{ field.label || '(Sans label)' }}
        <span v-if="field.required" class="required-badge">*</span>
      </div>
      <div class="preview-name">{{ field.name }}</div>
    </div>

    <div v-if="isEditing" class="field-config">
      <div class="config-row">
        <label>
          <span>Label (affiché)</span>
          <input 
            type="text" 
            v-model="localField.label" 
            placeholder="Question ou instruction..."
            @input="emitUpdate"
          >
        </label>
      </div>

      <div class="config-row">
        <label>
          <span>Nom technique</span>
          <input 
            type="text" 
            v-model="localField.name" 
            placeholder="nom_du_champ"
            pattern="[a-z_][a-z0-9_]*"
            @input="emitUpdate"
          >
        </label>
      </div>

      <div class="config-row config-row-checkbox">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="localField.required"
            @change="emitUpdate"
          >
          <span>Champ obligatoire</span>
        </label>
      </div>

      <div v-if="field.type === 'text'" class="config-row config-row-checkbox">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            :checked="localField.appearance === 'multiline'"
            @change="toggleMultiline"
          >
          <span>Texte multiligne</span>
        </label>
      </div>

      <div v-if="field.type === 'range'" class="config-row-group">
        <div class="config-row config-row-inline">
          <label>
            <span>Min</span>
            <input 
              type="number" 
              v-model.number="localField.parameters.start" 
              placeholder="0"
              @input="emitUpdate"
            >
          </label>
          <label>
            <span>Max</span>
            <input 
              type="number" 
              v-model.number="localField.parameters.end" 
              placeholder="100"
              @input="emitUpdate"
            >
          </label>
          <label>
            <span>Pas</span>
            <input 
              type="number" 
              v-model.number="localField.parameters.step" 
              placeholder="1"
              @input="emitUpdate"
            >
          </label>
        </div>
      </div>

      <div v-if="field.type === 'calculate'" class="config-row">
        <label>
          <span>Formule de calcul</span>
          <input 
            type="text" 
            v-model="localField.calculation" 
            placeholder="Ex: ${field1} + ${field2}"
            @input="emitUpdate"
          >
        </label>
        <small class="config-hint">Utilisez ${nom_champ} pour référencer d'autres champs</small>
      </div>

      <div v-if="field.type === 'hidden'" class="config-row">
        <label>
          <span>Valeur par défaut</span>
          <input 
            type="text" 
            v-model="localField.default" 
            placeholder="Valeur cachée..."
            @input="emitUpdate"
          >
        </label>
      </div>

      <div class="config-row">
        <label>
          <span>Indice (hint)</span>
          <input 
            type="text" 
            v-model="localField.hint" 
            placeholder="Aide pour l'utilisateur..."
            @input="emitUpdate"
          >
        </label>
      </div>

      <div v-if="isMetadataField" class="config-info">
        <span class="icon-info-circle"></span>
        Ce champ capture automatiquement une valeur système.
      </div>

      <div v-if="hasChoices" class="config-choices">
        <div class="choices-header">
          <span>Options de choix</span>
          <button type="button" class="btn-add-choice" @click="addChoice">
            <span class="icon-plus-circle"></span> Ajouter
          </button>
        </div>
        
        <div class="choices-list">
          <div 
            v-for="(choice, index) in localField.choices" 
            :key="index"
            class="choice-item"
          >
            <input 
              type="text" 
              v-model="choice.label" 
              placeholder="Label de l'option"
              @input="updateChoiceName(index); emitUpdate()"
            >
            <button 
              type="button" 
              class="btn-remove-choice"
              title="Supprimer cette option"
              @click="removeChoice(index)"
            >
              <span class="icon-times"></span>
            </button>
          </div>
        </div>

        <p v-if="!localField.choices || localField.choices.length === 0" class="no-choices">
          Aucune option. Cliquez sur "Ajouter" pour créer des options.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { FIELD_TYPES, sanitizeFieldName } from './xlsform-generator';

export default {
  name: 'FormBuilderField',
  props: {
    field: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  emits: ['update', 'delete', 'move'],
  data() {
    return {
      isEditing: false,
      isDragging: false,
      localField: { ...this.field }
    };
  },
  computed: {
    fieldTypeInfo() {
      return FIELD_TYPES[this.field.type] || {
        type: this.field.type,
        label: this.field.type,
        icon: 'question',
        description: ''
      };
    },
    hasChoices() {
      return this.field.type === 'select_one' || this.field.type === 'select_multiple' || this.field.type === 'rank';
    },
    isMetadataField() {
      return ['start', 'end', 'today', 'deviceid', 'username', 'email', 'phonenumber'].includes(this.field.type);
    }
  },
  watch: {
    field: {
      handler(newVal) {
        this.localField = { ...newVal };
        this.initializeFieldDefaults();
      },
      deep: true
    }
  },
  mounted() {
    this.initializeFieldDefaults();
  },
  methods: {
    initializeFieldDefaults() {
      if (this.hasChoices && !this.localField.choices) {
        this.localField.choices = [];
      }
      if (this.field.type === 'range' && !this.localField.parameters) {
        this.localField.parameters = { start: 0, end: 100, step: 1 };
      }
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    emitUpdate() {
      this.$emit('update', { ...this.localField });
    },
    toggleMultiline() {
      this.localField.appearance = this.localField.appearance === 'multiline' ? '' : 'multiline';
      this.emitUpdate();
    },
    addChoice() {
      if (!this.localField.choices) {
        this.localField.choices = [];
      }
      const choiceNum = this.localField.choices.length + 1;
      this.localField.choices.push({
        name: `option_${choiceNum}`,
        label: `Option ${choiceNum}`
      });
      this.emitUpdate();
    },
    removeChoice(index) {
      this.localField.choices.splice(index, 1);
      this.emitUpdate();
    },
    updateChoiceName(index) {
      const choice = this.localField.choices[index];
      if (choice && choice.label) {
        choice.name = sanitizeFieldName(choice.label);
      }
    },
    onDragStart(e) {
      this.isDragging = true;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.index.toString());
    },
    onDragEnd() {
      this.isDragging = false;
    },
    onDrop(e) {
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      if (fromIndex !== this.index) {
        this.$emit('move', { from: fromIndex, to: this.index });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.form-builder-field {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-bottom: 10px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #adb5bd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &.is-editing {
    border-color: #2e7d32;
    box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
  }

  &.is-dragging {
    opacity: 0.5;
    transform: scale(0.98);
  }
}

.field-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 6px 6px 0 0;
}

.drag-handle {
  cursor: grab;
  color: #adb5bd;
  padding: 4px;
  margin-right: 8px;

  &:hover {
    color: #6b7280;
  }

  &:active {
    cursor: grabbing;
  }
}

.field-type-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  background: #e9ecef;
  padding: 4px 10px;
  border-radius: 12px;

  span:first-child {
    font-size: 11px;
  }
}

.field-actions {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 6px 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: #e9ecef;
    color: #495057;
  }

  &.btn-delete:hover {
    background: #fee2e2;
    color: #dc3545;
  }
}

.field-preview {
  padding: 12px 15px;
}

.preview-label {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 4px;

  .required-badge {
    color: #dc3545;
    margin-left: 2px;
  }
}

.preview-name {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.field-config {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 6px 6px;
}

.config-row {
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;

    span {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #495057;
      margin-bottom: 4px;
    }

    input[type="text"] {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.15s ease;

      &:focus {
        outline: none;
        border-color: #2e7d32;
        box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
      }
    }
  }

  &.config-row-checkbox {
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      span {
        margin-bottom: 0;
        font-size: 13px;
      }
    }
  }
}

.config-row-group {
  margin-bottom: 12px;
}

.config-row-inline {
  display: flex;
  gap: 12px;

  label {
    flex: 1;
  }
}

.config-hint {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 4px;
  font-style: italic;
}

.config-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #e8f5e9;
  border-radius: 4px;
  font-size: 12px;
  color: #1b5e20;
  margin-top: 12px;

  span {
    font-size: 14px;
  }
}

.config-choices {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #dee2e6;
}

.choices-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  span {
    font-size: 12px;
    font-weight: 500;
    color: #495057;
  }
}

.btn-add-choice {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #218838;
  }
}

.choices-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.choice-item {
  display: flex;
  gap: 8px;

  input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 13px;

    &:focus {
      outline: none;
      border-color: #2e7d32;
    }
  }
}

.btn-remove-choice {
  background: transparent;
  border: 1px solid #dee2e6;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.15s ease;

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #dc3545;
  }
}

.no-choices {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  margin: 0;
}
</style>
