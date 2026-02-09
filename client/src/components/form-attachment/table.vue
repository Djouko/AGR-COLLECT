<template>
  <table-scroll id="form-attachment-table">
    <table class="table">
      <thead>
        <tr>
          <th>{{ $t('header.type') }}</th>
          <th>{{ $t('header.name') }}</th>
          <th>{{ $t('header.uploaded') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody v-if="form.dataExists && draftAttachments.dataExists">
        <form-attachment-row v-for="attachment of draftAttachments.values()"
          :key="attachment.name" :attachment="attachment"
          :file-is-over-drop-zone="fileIsOverDropZone"
          :dragover-attachment="dragoverAttachment"
          :planned-uploads="plannedUploads"
          :updated-attachments="updatedAttachments"
          :linkable="attachment.type === 'file' && dsHashset.has(attachment.name.replace(/\.[^.]+$/i, ''))"
          @link="$emit('link', $event)"/>
      </tbody>
    </table>
  </table-scroll>
</template>

<script setup>
import { computed } from 'vue';

import FormAttachmentRow from './row.vue';
import TableScroll from '../table/scroll.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'FormAttachmentTable'
});
defineProps({
  fileIsOverDropZone: Boolean,
  dragoverAttachment: Object,
  plannedUploads: {
    type: Array,
    required: true
  },
  updatedAttachments: {
    type: Set,
    required: true
  }
});
defineEmits(['link']);

const { form, draftAttachments, datasets } = useRequestData();

const dsHashset = computed(() =>
  (datasets.dataExists ? new Set(datasets.map(d => `${d.name}`)) : new Set()));
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#form-attachment-table {
  margin-bottom: 10px;
  max-height: 70vh;

  table { table-layout: fixed; }

  th:first-child { width: 125px; }
  th:nth-child(2) { width: 250px; }
  th:last-child { width: #{200px + $padding-left-table-data + $padding-right-table-data}; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // @transifexKey component.FormAttachmentList.header
    "header": {
      // This is the text of a table column header. The column shows when each
      // Media File was uploaded.
      "uploaded": "Uploaded"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "header": {
      "uploaded": "Nahráno"
    }
  },
  "de": {
    "header": {
      "uploaded": "Hochgeladen"
    }
  },
  "es": {
    "header": {
      "uploaded": "Subido"
    }
  },
  "fr": {
    "header": {
      "uploaded": "Téléversés"
    }
  },
  "id": {
    "header": {
      "uploaded": "Diunggah"
    }
  },
  "it": {
    "header": {
      "uploaded": "Caricati"
    }
  },
  "ja": {
    "header": {
      "uploaded": "アップロード済"
    }
  },
  "pt": {
    "header": {
      "uploaded": "Carregado"
    }
  },
  "sw": {
    "header": {
      "uploaded": "Imepakiwa"
    }
  },
  "zh": {
    "header": {
      "uploaded": "已上传"
    }
  },
  "zh-Hant": {
    "header": {
      "uploaded": "已上傳"
    }
  }
}
</i18n>
