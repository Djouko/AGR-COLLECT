<template>
  <div class="markdown-textarea" :class="activeBorderClass">
    <textarea :value="modelValue" class="form-control"
      :placeholder="defaultText" :aria-label="defaultText"
      :required="required" :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)">
    </textarea>
    <div v-if="!emptyValue && previewMode" class="preview-container">
      <p class="heading">{{ $t('preview') }}</p>
      <markdown-view :raw-markdown="modelValue"/>
    </div>
    <div v-show="!emptyValue || showFooter " class="markdown-textarea-actions">
      <a href="https://commonmark.org/help/" class="external-help-link" target="_blank" rel="noopener">{{ $t('markdownSupported') }} </a>
      <span class="push"></span>
      <button class="btn md-preview-btn" type="button" @click="toggleViewMode">
        {{ previewButtonText }}
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import MarkdownView from './view.vue';

export default {
  name: 'MarkdownTextarea',
  components: { MarkdownView },
  props: {
    modelValue: {
      type: String
    },
    showFooter: {
      type: Boolean
    },
    defaultText: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean
    },
    rows: {
      type: String,
      default: '2'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      previewMode: false
    };
  },
  computed: {
    emptyValue() {
      return this.modelValue === '' || this.modelValue == null;
    },
    previewButtonText() {
      return this.previewMode ? this.$t('action.hidePreview') : this.$t('action.showPreview');
    },
    activeBorderClass() {
      if (this.showFooter || !this.emptyValue)
        return 'active-border';
      return null;
    }
  },
  methods: {
    toggleViewMode() {
      this.previewMode = !this.previewMode;
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

.markdown-textarea {
  border: 1px solid transparent;
  &.active-border {
    border: 1px solid $color-info;
  }

  background: darken( $color-subpanel-background, 3% );

  .form-group {
    margin-bottom: 0;
    padding-bottom: 0px;
  }

  textarea {
    border-bottom-color: #d1d5db;
    resize: vertical;
  }

  .preview-container {
    padding: 10px;

    .heading {
      font-weight: bold;
      margin-bottom: 5px;
    }
  }

  .md-preview-btn {
    background-color: #d1d5db;
    color: #111827;
    &:hover, &:focus, &:active:focus { background-color: #9ca3af; }
  }

  .markdown-textarea-actions {
    @include clearfix;
    display: flex;
    align-content: stretch;
    align-items: center;
    margin-top: 5px;
  }

  .markdown-textarea-actions > .btn {
    margin: 3px;
  }

  .push {
    margin-left: auto;
  }

  .external-help-link {
    color: #9ca3af;
    font-size: 12px;
    text-decoration: underline;
    text-decoration-style: dotted;
    padding: 10px;
    &:hover, &:focus, &:active:focus { color: #6b7280; }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is a link to an external website with Markdown style guidelines
    "markdownSupported": "Markdown supported",
    // This is text shown as a label above the preview of Markdown formatting (special formatting of user-submitted text)
    "preview": "Preview"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "markdownSupported": "Markdown podporován",
    "preview": "Náhled"
  },
  "de": {
    "markdownSupported": "unterstützt durch Markdown",
    "preview": "Vorschau"
  },
  "es": {
    "markdownSupported": "soporte Markdown",
    "preview": "Vista previa"
  },
  "fr": {
    "markdownSupported": "Syntaxe Markdown supportée",
    "preview": "Aperçu"
  },
  "id": {
    "markdownSupported": "Markdown didukung",
    "preview": "Pratinjau"
  },
  "it": {
    "markdownSupported": "Markdown supportato",
    "preview": "Anteprima"
  },
  "ja": {
    "markdownSupported": "マークダウンがサポートされています。",
    "preview": "プレビュー"
  },
  "pt": {
    "markdownSupported": "Formatação em estilo Markdown suportada",
    "preview": "Visualização"
  },
  "sw": {
    "markdownSupported": "Markdown inatumika",
    "preview": "Hakiki"
  },
  "zh": {
    "markdownSupported": "支持Markdown语法",
    "preview": "预览"
  },
  "zh-Hant": {
    "markdownSupported": "支持 Markdown 語法",
    "preview": "預覽"
  }
}
</i18n>
