<template>
  <span v-if="sentenceSeparator !== ''">{{ sentenceSeparator }}</span>
</template>

<script setup>
import { useI18nUtils } from '../util/i18n';

const { sentenceSeparator } = useI18nUtils();
</script>
