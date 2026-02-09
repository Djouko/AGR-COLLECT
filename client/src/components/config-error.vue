<template>
  <div id="config-error">
    <div class="config-error-container">
      <div class="config-error-icon">
        <span class="icon-warning"></span>
      </div>
      <h1 class="config-error-title">{{ $t('title') }}</h1>
      <p class="config-error-message">
        <span>{{ $t('body') }}</span>
        <sentence-separator/>
        <span>{{ loadError }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { F } from 'ramda';
import { computed, inject } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

import SentenceSeparator from './sentence-separator.vue';

import { requestAlertMessage } from '../util/request';

defineOptions({
  name: 'ConfigError'
});

onBeforeRouteLeave(F);

const { i18n, config } = inject('container');
const loadError = computed(() => requestAlertMessage(i18n, config.loadError));
</script>

<style lang="scss">
@import '../assets/scss/variables';

#config-error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px 20px;
}

.config-error-container {
  text-align: center;
  max-width: 520px;
}

.config-error-icon {
  font-size: 64px;
  color: $color-danger;
  margin-bottom: 16px;
}

.config-error-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
}

.config-error-message {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is the title at the top of a panel.
    "title": "Error Loading Central",
    "body": "There was an error loading Central."
  }
}
</i18n>

<i18n>
{
  "cs": {
    "title": "Chyba načítání Central"
  },
  "de": {
    "title": "Fehler beim Laden Central",
    "body": "Es ist ein Fehler beim Laden Central aufgetreten."
  },
  "es": {
    "title": "Error al cargar Central",
    "body": "Se ha producido un error al cargar Central."
  },
  "fr": {
    "title": "Erreur au chargement de Central",
    "body": "Il y a eu des erreurs au chargement de Central"
  },
  "it": {
    "title": "Errore nel caricamento di Central",
    "body": "C'è stato un errore nel caricamento di Central."
  },
  "pt": {
    "title": "Erro ao carregar o Central",
    "body": "Ocorreu um erro ao carregar o Central."
  },
  "zh": {
    "title": "载入Central时出错",
    "body": "载入Central时发生错误。"
  },
  "zh-Hant": {
    "title": "載入 Central 時出錯",
    "body": "載入 Central 時發生錯誤。"
  }
}
</i18n>
