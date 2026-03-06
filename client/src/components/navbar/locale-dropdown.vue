<template>
  <li id="navbar-locale-dropdown" class="dropdown">
    <a class="dropdown-toggle" href="#" data-toggle="dropdown" role="button"
      :aria-label="locales.get($i18n.locale).name" aria-haspopup="true"
      aria-expanded="false">
      {{ languageSubtag }}<span class="caret"></span>
    </a>
    <ul class="dropdown-menu">
      <li v-for="[locale, info] of locales" :key="locale"
        :class="{ disabled: loading }">
        <a href="#" @click.prevent="selectLocale(locale)">{{ info.name }}</a>
      </li>
    </ul>
  </li>
</template>

<script setup>
import { computed, inject, ref } from 'vue';

import { loadLocale } from '../../util/i18n';
import { localStore } from '../../util/storage';
import { locales } from '../../i18n';
import { noop } from '../../util/util';

defineOptions({
  name: 'NavbarLocaleDropdown'
});

const container = inject('container');
const { i18n: globalI18n } = container;
const languageSubtag = computed(() =>
  new Intl.Locale(globalI18n.locale).language);

const loading = ref(false);
const selectLocale = (locale) => {
  loading.value = true;
  return loadLocale(container, locale)
    .then(() => { localStore.setItem('locale', locale); })
    .catch(noop)
    .finally(() => { loading.value = false; });
};
</script>

<i18n lang="json5">
{
  "en": {
    // This is shown below the list of languages and links to the AGR-Collect
    // translation guide.
    "helpTranslate": "Help translate Central"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "helpTranslate": "Nápověda k překladu Central"
  },
  "de": {
    "helpTranslate": "Hilf Central zu übersetzen"
  },
  "es": {
    "helpTranslate": "Ayuda a traducir Central"
  },
  "fr": {
    "helpTranslate": "Aider à traduire Central"
  },
  "id": {
    "helpTranslate": "Bantu terjemahan pusat"
  },
  "it": {
    "helpTranslate": "Aiuta a tradurre Central"
  },
  "ja": {
    "helpTranslate": "Centralの翻訳に貢献する"
  },
  "pt": {
    "helpTranslate": "Ajude a traduzir o Central"
  },
  "sw": {
    "helpTranslate": "Saidia kutafsiri Central"
  },
  "zh": {
    "helpTranslate": "协助翻译Central"
  },
  "zh-Hant": {
    "helpTranslate": "協助翻譯 Central"
  }
}
</i18n>
