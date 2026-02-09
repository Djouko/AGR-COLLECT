<template>
  <modal :state="state" :hideable="!form.awaitingResponse" backdrop
  @hide="$emit('hide')">
    <template v-if="webformsEnabled" #banner>
      <img
        srcset="../../assets/images/form/web-forms-settings-confirmation/banner@1x.png, ../../assets/images/form/web-forms-settings-confirmation/banner@2x.png 2x"
        src="../../assets/images/form/web-forms-settings-confirmation/banner@1x.png"
        alt="Modal banner image showing sample Web Form UI.">
    </template>
    <template v-if="webformsEnabled" #title>AGR Web Forms</template>
    <template v-else #title>Enketo</template>

    <template v-if="webformsEnabled" #body>
      <p>
        {{ $t('webformsConfirmation.intro') }}
      </p>
      <i18n-t tag="p" keypath="webformsConfirmation.description.full">
        <template #seeSupportedFeatures>
          <a href="#web-forms-features"
            target="_blank">
            {{ $t('webformsConfirmation.description.seeSupportedFeatures') }}
          </a>
        </template>
        <template #previewYourForm>
          <a href="https://agr-collect.local/web-forms-preview/" target="_blank">
            {{ $t('webformsConfirmation.description.previewYourForm') }}
          </a>
        </template>
      </i18n-t>
      <div class="modal-actions">
        <button class="btn btn-link" type="button" @click="$emit('hide')">
          {{ $t('action.cancel') }}
        </button>
        <button type="button" class="btn btn-primary"
          :aria-disabled="form.awaitingResponse" @click="setWebformsEnabled">
          {{ $t('webformsConfirmation.useAgrWebForms') }} <spinner :state="form.awaitingResponse"/>
        </button>
      </div>
    </template>
    <template v-else #body>
      <p>
        {{ $t('enketoConfirmation.description') }}
      </p>
      <div class="modal-actions">
        <button class="btn btn-link" type="button"
          :aria-disabled="form.awaitingResponse" @click="$emit('hide')">
          {{ $t('action.cancel') }}
        </button>
        <button type="button" class="btn btn-primary"
          :aria-disabled="form.awaitingResponse" @click="setWebformsEnabled">
          {{ $t('enketoConfirmation.useEnketo') }} <spinner :state="form.awaitingResponse"/>
        </button>
      </div>
    </template>
  </modal>
</template>

<script setup>
import Modal from '../modal.vue';
import Spinner from '../spinner.vue';

import { useRequestData } from '../../request-data';
import { apiPaths } from '../../util/request';
import { noop } from '../../util/util';

const { form } = useRequestData();

defineOptions({
  name: 'FormWebFormsSettingsConfirmation'
});

const props = defineProps({
  state: Boolean,
  webformsEnabled: Boolean
});

const emit = defineEmits(['hide', 'success']);

const setWebformsEnabled = () => {
  form.request({
    method: 'PATCH',
    url: apiPaths.form(form.projectId, form.xmlFormId),
    data: { webformsEnabled: props.webformsEnabled },
    patch: ({ data }) => {
      form.updatedAt = data.updatedAt;
      form.webformsEnabled = data.webformsEnabled;
    }
  })
    .then(() => {
      emit('success');
    })
    .catch(noop);
};
</script>

<i18n lang="json5">
  {
    "en": {
      "webformsConfirmation": {
        // The words "AGR Web Forms" should not be translated
        "useAgrWebForms": "Use AGR Web Forms",
        "intro": "We’re building a new web-forms experience designed to be fast and user-friendly!",
        "description": {
          "full": "Some functionality might be lost; {seeSupportedFeatures} for details and {previewYourForm} before opting in.",
          "seeSupportedFeatures": "see supported features",
          "previewYourForm": "preview your form"
        }
      },
      "enketoConfirmation": {
        // The words "Enketo" and "AGR Web Forms" should not be translated
        "description": "Are you sure you want to switch from AGR Web Forms to Enketo?",
        // The word "Enketo" should not be translated
        "useEnketo": "Use Enketo"
      }
    }
  }
</i18n>

<i18n>
{
  "de": {
    "webformsConfirmation": {
      "useAgrWebForms": "AGR Web-Formulare verwenden",
      "intro": "Wir bauen ein neues Web-Formularsystem auf, das schnell und benutzerfreundlich sein soll!",
      "description": {
        "full": "Einige Funktionen könnten verloren gehen; {seeSupportedFeatures} für Details und {previewYourForm}, bevor Sie zustimmen.",
        "seeSupportedFeatures": "siehe unterstützte Funktionen",
        "previewYourForm": "Vorschau auf Ihr Formular"
      }
    },
    "enketoConfirmation": {
      "description": "Sind Sie sicher, dass Sie von AGR Web-Formulare zu Enketo wechseln wollen?",
      "useEnketo": "Enketo verwenden"
    }
  },
  "es": {
    "webformsConfirmation": {
      "useAgrWebForms": "Utilizar AGR Web Forms",
      "intro": "Estamos construyendo una nueva experiencia de formularios web diseñada para ser rápida y fácil de usar.",
      "description": {
        "full": "Es posible que se pierda parte de la funcionalidad; {seeSupportedFeatures} para más detalles y {previewYourForm} antes de optar por él.",
        "seeSupportedFeatures": "ver funciones compatibles",
        "previewYourForm": "previsualice su formulario"
      }
    },
    "enketoConfirmation": {
      "description": "¿Está seguro de que desea cambiar de AGR Web Forms a Enketo?",
      "useEnketo": "Utilice Enketo"
    }
  },
  "fr": {
    "webformsConfirmation": {
      "useAgrWebForms": "Utiliser AGR Web Forms",
      "intro": "Nous construisons une nouvelle experience de formulaires web conçus pour être rapides et faciles à utiliser !",
      "description": {
        "full": "Certaines fonctionnalité peuvent être perdues ; {seeSupportedFeatures} pour détail et {previewYourForm} avant de choisir cette option.",
        "seeSupportedFeatures": "voir les fonctionnalités supportées",
        "previewYourForm": "Prévisualiser votre formulaire"
      }
    },
    "enketoConfirmation": {
      "description": "Êtes vous sûr de vouloir passer d'AGR Web Forms à Enketo ?",
      "useEnketo": "Utiliser Enketo"
    }
  },
  "it": {
    "webformsConfirmation": {
      "useAgrWebForms": "Utilizza AGR Web Forms",
      "intro": "Stiamo costruendo una nuova esperienza di web-forms progettata per essere veloce e facile da usare!",
      "description": {
        "full": "Alcune funzionalità potrebbero andare perse; {seeSupportedFeatures} per dettagli e {previewYourForm} prima di accettare.",
        "seeSupportedFeatures": "vedere le funzioni supportate",
        "previewYourForm": "anteprima del tuo formulario"
      }
    },
    "enketoConfirmation": {
      "description": "Siete sicuri di voler passare da AGR Web Forms a Enketo?",
      "useEnketo": "Usa Enketo"
    }
  },
  "pt": {
    "webformsConfirmation": {
      "useAgrWebForms": "Utilizar AGR Web Forms"
    },
    "enketoConfirmation": {
      "description": "Você tem certeza que deseja mudar do AGR Web Forms para o Enketo?",
      "useEnketo": "Utilizar o Enketo"
    }
  },
  "zh": {
    "webformsConfirmation": {
      "useAgrWebForms": "使用 AGR Web Forms",
      "intro": "我们正在打造全新的Web表单体验，旨在提供更快速、更友好的操作界面！",
      "description": {
        "full": "部分功能可能受限；详情请{seeSupportedFeatures}，并在启用前{previewYourForm}。",
        "seeSupportedFeatures": "查看支持的功能列表",
        "previewYourForm": "预览表单效果"
      }
    },
    "enketoConfirmation": {
      "description": "确定要从AGR Web表单切换至Enketo吗？",
      "useEnketo": "使用Enketo"
    }
  },
  "zh-Hant": {
    "webformsConfirmation": {
      "useAgrWebForms": "使用 AGR Web Forms",
      "intro": "我們正在建立一個全新的 web 表單體驗，設計快速且易於使用！",
      "description": {
        "full": "某些功能可能會遺失；{seeSupportedFeatures}瞭解詳情，{previewYourForm}再選擇加入。",
        "seeSupportedFeatures": "查看支援的功能",
        "previewYourForm": "預覽您的表格"
      }
    },
    "enketoConfirmation": {
      "description": "您確定要從 AGR Web Forms 轉換到 Enketo？",
      "useEnketo": "使用 Enketo"
    }
  }
}
</i18n>
