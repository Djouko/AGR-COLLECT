<!--
  FormNewSelector - Sélecteur de méthode de création de formulaire
  Permet à l'utilisateur de choisir entre:
  - Mode Simple: Form Builder visuel (pour utilisateurs non techniques)
  - Mode Expert: Upload de fichier XLS/XML (méthode traditionnelle)
-->
<template>
  <modal 
    id="form-new-selector" 
    :state="state" 
    :hideable="true"
    backdrop
    @hide="$emit('hide')"
  >
    <template #title>
      {{ $t('selector.title') }}
    </template>

    <template #body>
      <div class="selector-intro">
        <p>{{ $t('selector.description') }}</p>
      </div>

      <div class="selector-options">
        <div 
          class="selector-option option-simple"
          @click="selectMode('simple')"
        >
          <div class="option-icon">
            <span class="icon-magic"></span>
          </div>
          <div class="option-content">
            <h4>{{ $t('selector.simpleMode.title') }}</h4>
            <p>{{ $t('selector.simpleMode.description') }}</p>
            <ul class="option-features">
              <li><span class="icon-check"></span> {{ $t('selector.simpleMode.feature1') }}</li>
              <li><span class="icon-check"></span> {{ $t('selector.simpleMode.feature2') }}</li>
              <li><span class="icon-check"></span> {{ $t('selector.simpleMode.feature3') }}</li>
            </ul>
          </div>
          <div class="option-badge recommended">
            {{ $t('selector.recommended') }}
          </div>
        </div>

        <div 
          class="selector-option option-expert"
          @click="selectMode('expert')"
        >
          <div class="option-icon">
            <span class="icon-file-code-o"></span>
          </div>
          <div class="option-content">
            <h4>{{ $t('selector.expertMode.title') }}</h4>
            <p>{{ $t('selector.expertMode.description') }}</p>
            <ul class="option-features">
              <li><span class="icon-check"></span> {{ $t('selector.expertMode.feature1') }}</li>
              <li><span class="icon-check"></span> {{ $t('selector.expertMode.feature2') }}</li>
              <li><span class="icon-check"></span> {{ $t('selector.expertMode.feature3') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import Modal from '../modal.vue';

export default {
  name: 'FormNewSelector',
  components: { Modal },
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  emits: ['hide', 'select-mode'],
  methods: {
    selectMode(mode) {
      this.$emit('select-mode', mode);
    }
  }
};
</script>

<style lang="scss" scoped>
.selector-intro {
  text-align: center;
  margin-bottom: 25px;

  p {
    font-size: 15px;
    color: #6b7280;
    margin: 0;
  }
}

.selector-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.selector-option {
  position: relative;
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2e7d32;
    box-shadow: 0 4px 15px rgba(46, 125, 50, 0.15);
    transform: translateY(-2px);
  }

  &.option-simple {
    .option-icon {
      background: linear-gradient(135deg, #1b5e20, #2e7d32);
    }
  }

  &.option-expert {
    .option-icon {
      background: linear-gradient(135deg, #6b7280, #495057);
    }
  }
}

.option-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  span {
    font-size: 28px;
    color: #fff;
  }
}

.option-content {
  flex: 1;

  h4 {
    font-size: 17px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 12px 0;
    line-height: 1.5;
  }
}

.option-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;

  li {
    font-size: 12px;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 5px;

    span {
      color: #2e7d32;
      font-size: 10px;
    }
  }
}

.option-badge {
  position: absolute;
  top: -10px;
  right: 15px;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 12px;

  &.recommended {
    background: #2e7d32;
    color: #fff;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "selector": {
      "title": "Create a New Form",
      "description": "Choose how you want to create your form",
      "recommended": "Recommended",
      "simpleMode": {
        "title": "Visual Builder (Simple Mode)",
        "description": "Create your form visually with drag-and-drop. No technical knowledge required.",
        "feature1": "Pre-built templates",
        "feature2": "Drag & drop interface",
        "feature3": "Instant preview"
      },
      "expertMode": {
        "title": "File Upload (Expert Mode)",
        "description": "Upload an XLSForm Excel file or XForms XML file. For advanced users.",
        "feature1": "Full XLSForm support",
        "feature2": "Complex logic & calculations",
        "feature3": "Import existing forms"
      }
    }
  },
  "fr": {
    "selector": {
      "title": "Créer un Nouveau Formulaire",
      "description": "Choisissez comment vous souhaitez créer votre formulaire",
      "recommended": "Recommandé",
      "simpleMode": {
        "title": "Créateur Visuel (Mode Simple)",
        "description": "Créez votre formulaire visuellement par glisser-déposer. Aucune connaissance technique requise.",
        "feature1": "Modèles préconfigurés",
        "feature2": "Interface glisser-déposer",
        "feature3": "Aperçu instantané"
      },
      "expertMode": {
        "title": "Téléverser un Fichier (Mode Expert)",
        "description": "Téléversez un fichier Excel XLSForm ou XML XForms. Pour utilisateurs avancés.",
        "feature1": "Support XLSForm complet",
        "feature2": "Logique et calculs complexes",
        "feature3": "Importer des formulaires existants"
      }
    }
  }
}
</i18n>
