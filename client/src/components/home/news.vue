<template>
  <page-section id="home-news" horizontal>
    <template #heading>
      <span>{{ $t('title') }}</span>
    </template>
    <template #body>
      <iframe :src="iframeSrc" :title="$t('title')"></iframe>
    </template>
  </page-section>
</template>

<script setup>
import { computed, inject } from 'vue';
import PageSection from '../page/section.vue';

defineOptions({
  name: 'HomeNews'
});

const container = inject('container');
const { i18n: globalI18n } = container;
const locale = computed(() => globalI18n.locale);

const iframeSrc = computed(() => `about:blank?outdatedVersionWarning=false&lang=${locale.value}`);

</script>

<style lang="scss">
#home-news {
  margin-bottom: 25px;

  iframe {
    border-width: 0;
    height: 40px;
    width: calc(100% - 35px);
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a title shown above a section of the page.
    "title": "News"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "title": "Novinky"
  },
  "de": {
    "title": "Neuigkeiten"
  },
  "es": {
    "title": "Novedades"
  },
  "fr": {
    "title": "Nouvelles"
  },
  "id": {
    "title": "Berita"
  },
  "it": {
    "title": "Novità"
  },
  "pt": {
    "title": "Notícias"
  },
  "sw": {
    "title": "Habari"
  },
  "zh": {
    "title": "更新"
  },
  "zh-Hant": {
    "title": "新訊息"
  }
}
</i18n>
