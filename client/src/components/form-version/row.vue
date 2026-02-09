<template>
  <tr class="form-version-row">
    <td class="version">
      <div>
        <div><form-version-string :version="version.version"/></div>
        <div v-if="current"><span class="chip">{{ $t('current') }}</span></div>
      </div>
    </td>
    <td>
      <time-and-user :iso="version.publishedAt" :user="version.publishedBy"/>
    </td>
    <td>
      <enketo-preview v-if="current" :form-version="version"/>
      <form-version-def-dropdown :version="version"
        @view-xml="$emit('view-xml')"/>
    </td>
  </tr>
</template>

<script setup>
import EnketoPreview from '../enketo/preview.vue';
import FormVersionDefDropdown from './def-dropdown.vue';
import FormVersionString from './string.vue';
import TimeAndUser from '../time-and-user.vue';

defineOptions({
  name: 'FormVersionRow'
});
defineProps({
  version: {
    type: Object,
    required: true
  },
  current: Boolean
});
defineEmits(['view-xml']);
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

.form-version-row {
  .table tbody & td { vertical-align: middle; }

  .version > div {
    column-gap: 15px;
    display: flex;

    > :first-child {
      @include text-overflow-ellipsis;
      max-width: 100%;
    }

    > :last-child { flex-shrink: 0; }
  }

  * + .form-version-def-dropdown { margin-left: 5px; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a label shown for the current version of a Form.
    "current": "Current Published Version"
  }
}
</i18n>

<i18n>
{
  "de": {
    "current": "Aktuell veröffentlichte Version"
  },
  "es": {
    "current": "Versión actualmente publicada"
  },
  "fr": {
    "current": "Version actuellement publiée"
  },
  "it": {
    "current": "Versione corrente pubblicata"
  },
  "pt": {
    "current": "Versão publicada atualmente"
  },
  "zh": {
    "current": "当前已发布版本"
  },
  "zh-Hant": {
    "current": "當前已發布版本"
  }
}
</i18n>
