<template>
  <div>
    <home-summary/>
    <page-body>
      <project-list/>
    </page-body>
  </div>
</template>

<script setup>
import { inject } from 'vue';

import HomeSummary from './home/summary.vue';
import PageBody from './page/body.vue';
import ProjectList from './project/list.vue';

import useProjects from '../request-data/projects';
import { noop } from '../util/util';

defineOptions({
  name: 'Home'
});

const projects = useProjects();
projects.request({ url: '/v1/projects?forms=true&datasets=true' }).catch(noop);

const config = inject('config');
</script>

<style lang="scss">
@import '../assets/scss/variables';

#home-news-container {
  display: flex;
  > * { flex: 1; }
}
</style>

<i18n lang="json5">
{
  "en": {
    "heading": [
      "Welcome to AGR-Collect."
    ]
  }
}
</i18n>

<i18n>
{
  "cs": {
    "heading": [
      "Vítejte v AGR-Collect."
    ]
  },
  "de": {
    "heading": [
      "Willkommen bei AGR-Collect"
    ]
  },
  "es": {
    "heading": [
      "Bienvenido a AGR-Collect."
    ]
  },
  "fr": {
    "heading": [
      "Bienvenue sur AGR-Collect"
    ]
  },
  "id": {
    "heading": [
      "Selamat datang di AGR-Collect."
    ]
  },
  "it": {
    "heading": [
      "Benvenuto su AGR-Collect"
    ]
  },
  "pt": {
    "heading": [
      "Bem-vindo ao AGR-Collect."
    ]
  },
  "sw": {
    "heading": [
      "Karibu AGR-Collect"
    ]
  },
  "zh": {
    "heading": [
      "欢迎使用AGR-Collect。"
    ]
  },
  "zh-Hant": {
    "heading": [
      "歡迎來到 AGR-Collect."
    ]
  }
}
</i18n>
