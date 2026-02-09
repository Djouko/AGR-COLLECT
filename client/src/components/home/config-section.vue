<template>
  <page-section id="home-config-section" horizontal>
    <template #heading>
      <span>{{ title }}</span>
    </template>
    <template #body>
      <markdown-view :raw-markdown="body"/>
    </template>
  </page-section>
</template>

<script setup>
import MarkdownView from '../markdown/view.vue';
import PageSection from '../page/section.vue';

defineOptions({
  name: 'HomeConfigSection'
});
defineProps({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});
</script>

<style lang="scss">
#home-config-section { margin-bottom: 0; }
</style>
