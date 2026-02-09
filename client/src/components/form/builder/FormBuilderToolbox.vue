<!--
  FormBuilderToolbox - Palette d'outils pour le Form Builder
  Affiche les types de champs disponibles que l'utilisateur peut ajouter au formulaire
-->
<template>
  <div class="form-builder-toolbox">
    <h4 class="toolbox-title">
      <span class="icon-plus-circle"></span>
      {{ $t('toolbox.title') }}
    </h4>
    <p class="toolbox-hint">{{ $t('toolbox.hint') }}</p>
    
    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.basicFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in basicFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.dateTimeFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in dateTimeFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.selectionFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in selectionFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.geoFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in geoFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.mediaFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in mediaFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.specialFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in specialFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>

    <div class="toolbox-section">
      <h5 class="section-title">{{ $t('toolbox.metadataFields') }}</h5>
      <div class="field-types">
        <button
          v-for="fieldType in metadataFields"
          :key="fieldType.type"
          type="button"
          class="field-type-btn field-type-btn--meta"
          :title="fieldType.description"
          draggable="true"
          @dragstart="onDragStart($event, fieldType.type)"
          @click="$emit('add-field', fieldType.type)"
        >
          <span :class="'icon-' + fieldType.icon"></span>
          <span class="field-label">{{ fieldType.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FIELD_TYPES } from './xlsform-generator';

export default {
  name: 'FormBuilderToolbox',
  emits: ['add-field', 'add-field-at'],
  computed: {
    basicFields() {
      return [
        FIELD_TYPES.text,
        FIELD_TYPES.integer,
        FIELD_TYPES.decimal,
        FIELD_TYPES.range
      ];
    },
    dateTimeFields() {
      return [
        FIELD_TYPES.date,
        FIELD_TYPES.time,
        FIELD_TYPES.datetime,
        FIELD_TYPES.today
      ];
    },
    selectionFields() {
      return [
        FIELD_TYPES.select_one,
        FIELD_TYPES.select_multiple,
        FIELD_TYPES.rank
      ];
    },
    geoFields() {
      return [
        FIELD_TYPES.geopoint,
        FIELD_TYPES.geotrace,
        FIELD_TYPES.geoshape
      ];
    },
    mediaFields() {
      return [
        FIELD_TYPES.image,
        FIELD_TYPES.audio,
        FIELD_TYPES.video,
        FIELD_TYPES.file,
        FIELD_TYPES.barcode
      ];
    },
    specialFields() {
      return [
        FIELD_TYPES.note,
        FIELD_TYPES.calculate,
        FIELD_TYPES.acknowledge,
        FIELD_TYPES.hidden
      ];
    },
    metadataFields() {
      return [
        FIELD_TYPES.start,
        FIELD_TYPES.end,
        FIELD_TYPES.deviceid,
        FIELD_TYPES.username,
        FIELD_TYPES.email,
        FIELD_TYPES.phonenumber
      ];
    }
  },
  methods: {
    onDragStart(event, fieldType) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('application/x-field-type', fieldType);
      event.dataTransfer.setData('text/plain', fieldType);
    }
  }
};
</script>

<style lang="scss" scoped>
.form-builder-toolbox {
  background: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
}

.toolbox-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #2e7d32;
  }
}

.toolbox-hint {
  font-size: 11px;
  color: #6b7280;
  margin: 0 0 15px 0;
  font-style: italic;
}

.toolbox-section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
}

.field-types {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-type-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-size: 13px;
  color: #495057;

  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
    transform: translateX(3px);
  }

  &:active {
    background: #dee2e6;
  }

  span:first-child {
    width: 18px;
    text-align: center;
    color: #6b7280;
  }

  .field-label {
    flex: 1;
  }

  &--meta {
    background: #f0f4f8;
    border-color: #c3cfd9;
    font-size: 12px;
    padding: 8px 10px;

    span:first-child {
      color: #5a6c7d;
    }

    &:hover {
      background: #e1e8ef;
      border-color: #9fb3c8;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "toolbox": {
      "title": "Add Field",
      "hint": "Click or drag to add",
      "basicFields": "Basic Fields",
      "dateTimeFields": "Date & Time",
      "selectionFields": "Selection",
      "geoFields": "Geolocation",
      "mediaFields": "Media",
      "specialFields": "Special",
      "metadataFields": "Metadata (auto)"
    }
  },
  "fr": {
    "toolbox": {
      "title": "Ajouter un champ",
      "hint": "Cliquez ou glissez pour ajouter",
      "basicFields": "Champs de base",
      "dateTimeFields": "Date & Heure",
      "selectionFields": "Sélection",
      "geoFields": "Géolocalisation",
      "mediaFields": "Médias",
      "specialFields": "Spéciaux",
      "metadataFields": "Métadonnées (auto)"
    }
  }
}
</i18n>
