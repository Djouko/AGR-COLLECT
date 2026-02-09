<template>
  <div class="entity-diff" :class="conflictClass">
    <entity-diff-head v-if="entityVersion.conflict != null" v-model="diffProp"/>
    <entity-diff-table v-if="entityVersion.conflict != null || diff.size !== 0"
      :diff="diff"/>
    <p v-if="entityVersion.conflict != null && diff.size === 0"
      class="empty-table-message">
      {{ $t('noChange') }}
    </p>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';

import EntityDiffHead from './diff/head.vue';
import EntityDiffTable from './diff/table.vue';

defineOptions({
  name: 'EntityDiff'
});
const entityVersion = inject('entityVersion');

const conflictClass = entityVersion.conflict != null
  ? `${entityVersion.conflict}-conflict`
  : null;

const diffProp = ref('baseDiff');
const diff = computed(() => entityVersion[diffProp.value]);
</script>

<style lang="scss">
@import '../../assets/scss/variables';

$border-width: 1px;
.entity-diff {
  border-left: $border-width solid transparent;
  border-right: $border-width solid transparent;
  &.hard-conflict, &.soft-conflict {
    border-bottom: $border-width solid transparent;
    border-top: 12px solid transparent;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  &.hard-conflict { border-color: $color-danger; }
  &.soft-conflict { border-color: $color-warning-dark; }

  .empty-table-message { margin-left: $hpadding-feed-entry; }
}


$tabs-indent: 3px;
.entity-diff-head {
  $hpadding: $hpadding-feed-entry - $border-width;
  padding-left: $hpadding;
  padding-right: $hpadding;

  .nav-tabs { margin-left: #{$tabs-indent - $hpadding-nav-tab}; }
}

.entity-diff-table {
  $padding-left: $hpadding-feed-entry - $border-width + $tabs-indent;
  col:nth-child(1) {
    width: #{$padding-left + 150px + $padding-right-table-data};
  }
  col:nth-child(3) { width: 30px; }

  td:first-child { padding-left: $padding-left; }
  td:last-child { padding-right: #{$hpadding-feed-entry - $border-width}; }
}
</style>

<i18n lang="json5">
{
  "en": {
    "noChange": "There are no changes to show."
  }
}
</i18n>

<i18n>
{
  "cs": {
    "noChange": "Nejsou žádné změny k zobrazení."
  },
  "de": {
    "noChange": "Es gibt keine Änderungen anzuzeigen."
  },
  "es": {
    "noChange": "No hay cambios que mostrar."
  },
  "fr": {
    "noChange": "Il n'y a pas de modification à montrer."
  },
  "it": {
    "noChange": "Non ci sono cambiamenti da mostrare."
  },
  "pt": {
    "noChange": "Não há alterações para mostrar."
  },
  "zh": {
    "noChange": "没有可显示的更改"
  },
  "zh-Hant": {
    "noChange": "沒有可顯示的變更。"
  }
}
</i18n>
