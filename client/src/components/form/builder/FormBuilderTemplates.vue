<!--
  FormBuilderTemplates - Sélection de templates préconfigurés
  Permet de démarrer rapidement avec un formulaire prêt à l'emploi
-->
<template>
  <div class="form-builder-templates">
    <h4 class="templates-title">
      <span class="icon-files-o"></span>
      {{ $t('templates.title') }}
    </h4>
    <p class="templates-description">{{ $t('templates.description') }}</p>

    <div v-if="metierTemplates.length > 0" class="templates-section">
      <h5 class="section-title">
        <span class="icon-folder-open"></span>
        {{ $t('templates.metierSection') }}
      </h5>
      <div class="templates-grid">
        <div
          v-for="template in metierTemplates"
          :key="template.id"
          class="template-card template-card--metier"
          @click="$emit('select-template', template)"
        >
          <div class="template-icon template-icon--metier">
            <span :class="'icon-' + template.icon"></span>
          </div>
          <div class="template-info">
            <h5 class="template-name">{{ template.name }}</h5>
            <p class="template-desc">{{ template.description }}</p>
            <div class="template-meta">
              <span class="icon-file-text"></span>
              {{ template.fields.length }} {{ $t('templates.fields') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="templates-section">
      <h5 class="section-title">
        <span class="icon-cube"></span>
        {{ $t('templates.generalSection') }}
      </h5>
      <div class="templates-grid">
        <div
          v-for="template in generalTemplates"
          :key="template.id"
          class="template-card"
          @click="$emit('select-template', template)"
        >
          <div class="template-icon">
            <span :class="'icon-' + template.icon"></span>
          </div>
          <div class="template-info">
            <h5 class="template-name">{{ template.name }}</h5>
            <p class="template-desc">{{ template.description }}</p>
            <div class="template-meta">
              <span class="icon-file-text"></span>
              {{ template.fields.length }} {{ $t('templates.fields') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="templates-footer">
      <button type="button" class="btn-blank" @click="$emit('start-blank')">
        <span class="icon-plus-circle"></span>
        {{ $t('templates.startBlank') }}
      </button>
    </div>
  </div>
</template>

<script>
import { FORM_TEMPLATES } from './xlsform-generator';

export default {
  name: 'FormBuilderTemplates',
  emits: ['select-template', 'start-blank'],
  computed: {
    allTemplates() {
      return Object.values(FORM_TEMPLATES);
    },
    metierTemplates() {
      return this.allTemplates.filter(t => t.category === 'metier');
    },
    generalTemplates() {
      return this.allTemplates.filter(t => 
        t.category !== 'metier' && t.id !== 'formulaire_vide'
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.form-builder-templates {
  padding: 20px;
}

.templates-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    color: #2e7d32;
  }
}

.templates-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.templates-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  span {
    color: #6b7280;
  }
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.template-card {
  display: flex;
  gap: 15px;
  padding: 16px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2e7d32;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.15);
    transform: translateY(-2px);
  }
}

.template-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-size: 22px;
    color: #fff;
  }

  &--metier {
    background: linear-gradient(135deg, #1b5e20, #2e7d32);
  }
}

.template-card--metier {
  border-color: #c3e6cb;
  background: linear-gradient(135deg, #fff 0%, #f0fff4 100%);

  &:hover {
    border-color: #2e7d32;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
  }
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 6px 0;
}

.template-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.template-meta {
  font-size: 12px;
  color: #adb5bd;
  display: flex;
  align-items: center;
  gap: 6px;
}

.templates-footer {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.btn-blank {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 14px;
  color: #6b7280;
  background: transparent;
  border: 1px dashed #adb5bd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #2e7d32;
    border-color: #2e7d32;
    background: #f0f7f0;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "templates": {
      "title": "Choose a Template",
      "description": "Start with a pre-configured template or create a form from scratch",
      "metierSection": "SAAHDEL Business Templates",
      "generalSection": "General Templates",
      "fields": "fields",
      "startBlank": "Start with a blank form"
    }
  },
  "fr": {
    "templates": {
      "title": "Choisir un modèle",
      "description": "Démarrez avec un modèle préconfiguré ou créez un formulaire vide",
      "metierSection": "Modèles Métier SAAHDEL",
      "generalSection": "Modèles Généraux",
      "fields": "champs",
      "startBlank": "Commencer avec un formulaire vide"
    }
  }
}
</i18n>
