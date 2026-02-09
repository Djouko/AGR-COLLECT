<template>
  <span v-if="version !== ''" class="form-version-string" v-tooltip.text>{{ version }}</span>
  <span v-else class="form-version-string blank-version">{{ $t('blank') }}</span>
</template>

<script>
export default {
  name: 'FormVersionString',
  props: {
    version: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.form-version-string {
  font-family: $font-family-monospace;
  &.blank-version { font-family: inherit; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is shown for a Form with a blank version name.
    "blank": "(blank)"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "blank": "(prázdný)"
  },
  "de": {
    "blank": "(leer)"
  },
  "es": {
    "blank": "(vacío)"
  },
  "fr": {
    "blank": "(vierge)"
  },
  "id": {
    "blank": "(kosong)"
  },
  "it": {
    "blank": "(vuoto)"
  },
  "ja": {
    "blank": "(未設定)"
  },
  "pt": {
    "blank": "(em branco)"
  },
  "sw": {
    "blank": "(tupu)"
  },
  "zh": {
    "blank": "（空）"
  },
  "zh-Hant": {
    "blank": "(空白)"
  }
}
</i18n>
