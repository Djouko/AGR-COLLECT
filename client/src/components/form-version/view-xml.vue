<!-- We show the XForm XML in a modal rather than showing it in a new tab and
trying to leverage browsers' ability to render XML as a tree. That's because
rather than rendering an XForm as an XML tree, the browser will render it as
XHTML, because XForms include the XHTML namespace. There doesn't seem to be a
way to force browsers to render the XML as a tree, so we format it ourselves.
Somewhat related: https://support.google.com/chrome/thread/10921150?hl=en -->
<template>
  <modal id="form-version-view-xml" :state="state" hideable backdrop
    @hide="$emit('hide')">
    <template #title>{{ $t('title') }}</template>
    <template #body>
      <pre><spinner :state="formVersionXml.initiallyLoading"/><code>{{ formattedXml }}</code></pre>
      <div class="modal-actions">
        <button type="button" class="btn btn-primary" @click="$emit('hide')">
          {{ $t('action.close') }}
        </button>
      </div>
    </template>
  </modal>
</template>

<script>
import formatXml from 'xml-formatter';

import Modal from '../modal.vue';
import Spinner from '../spinner.vue';

import { useRequestData } from '../../request-data';

export default {
  name: 'FormVersionViewXml',
  components: { Modal, Spinner },
  props: {
    state: {
      type: Boolean,
      default: false
    }
  },
  emits: ['hide'],
  setup() {
    const { formVersionXml } = useRequestData();
    return { formVersionXml };
  },
  computed: {
    formattedXml() {
      return this.formVersionXml.dataExists
        ? formatXml(this.formVersionXml.data, { collapseContent: true })
        : '';
    }
  },
  watch: {
    state(state) {
      if (!state) this.formVersionXml.reset();
    }
  }
};
</script>

<style lang="scss">
#form-version-view-xml {
  pre {
    min-height: 120px;
    max-height: max(calc(70vh - 129px), 120px);
    position: relative;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is the title at the top of a pop-up.
    "title": "View XML"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "title": "Zobrazit XML"
  },
  "de": {
    "title": "XML ansehen"
  },
  "es": {
    "title": "Ver el XML"
  },
  "fr": {
    "title": "Afficher le XML"
  },
  "id": {
    "title": "Lihat XML"
  },
  "it": {
    "title": "Vedi XML"
  },
  "ja": {
    "title": "XMLの閲覧"
  },
  "pt": {
    "title": "Exibir XML"
  },
  "sw": {
    "title": "Tazama XML"
  },
  "zh": {
    "title": "查看XML"
  },
  "zh-Hant": {
    "title": "檢視XML"
  }
}
</i18n>
