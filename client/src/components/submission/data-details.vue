<template>
  <page-section id="submission-data-details" v-if="visibleFields.length !== 0">
    <template #heading><span><span class="icon-list-alt"></span>{{ $t('heading') }}</span></template>
    <template #body>
      <loading :state="initiallyLoading"/>
      <div v-if="encrypted" class="encrypted-notice">
        <span class="icon-lock"></span>
        <span>{{ $t('submission.encryptionMessage') }}</span>
      </div>
      <dl v-else-if="dataExists">
        <div v-for="field of visibleFields" :key="field.path">
          <dt>{{ fieldLabel(field) }}</dt>
          <dd>
            <template v-if="field.binary === true">
              <submission-attachment-link v-if="getValue(submission, field) != null"
                :project-id="projectId" :xml-form-id="xmlFormId"
                :instance-id="submission.__id"
                :attachment-name="getValue(submission, field)"/>
              <span v-else class="empty-value">—</span>
            </template>
            <template v-else-if="field.type === 'geopoint' && getValue(submission, field) != null">
              <geopoint-value :value="getValue(submission, field)"/>
            </template>
            <template v-else>
              <span v-if="displayValue(field) != null" v-tooltip.text>{{ displayValue(field) }}</span>
              <span v-else class="empty-value">—</span>
            </template>
          </dd>
        </div>
      </dl>
    </template>
  </page-section>
</template>

<script>
import Loading from '../loading.vue';
import PageSection from '../page/section.vue';
import SubmissionAttachmentLink from './attachment-link.vue';
import GeopointValue from './geopoint-value.vue';

import { getValue, formatValue } from '../../util/submission';
import { useRequestData } from '../../request-data';

export default {
  name: 'SubmissionDataDetails',
  components: { GeopointValue, Loading, PageSection, SubmissionAttachmentLink },
  props: {
    projectId: {
      type: String,
      required: true
    },
    xmlFormId: {
      type: String,
      required: true
    }
  },
  setup() {
    const { submission, fields, resourceStates } = useRequestData();
    return {
      submission, fields,
      ...resourceStates([submission, fields])
    };
  },
  computed: {
    encrypted() {
      return this.submission.dataExists && this.submission.__system.status != null;
    },
    visibleFields() {
      if (!this.fields.dataExists) return [];
      return this.fields.outsideRepeat.filter(({ path, type }) =>
        path !== '/meta/instanceID' && path !== '/instanceID' &&
        path !== '/meta/deviceID' && path !== '/meta/audit' && type !== 'structure');
    }
  },
  methods: {
    getValue,
    displayValue(field) {
      return formatValue(this.submission, field, this.$i18n);
    },
    fieldLabel(field) {
      // Use the form's field label from pathElements (last element), humanized.
      const name = field.pathElements[field.pathElements.length - 1] || field.path;
      return name.replace(/_/g, ' ');
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

#submission-data-details {
  margin-bottom: 35px;

  .icon-list-alt {
    @include icon-box;
    font-size: 20px;
    margin-right: $margin-right-icon;
  }

  dl {
    margin-bottom: 0;
  }

  dd { @include text-overflow-ellipsis; }

  .empty-value {
    color: #9ca3af;
    font-style: italic;
  }

  .encrypted-notice {
    padding: 10px 15px;
    background-color: #f3f4f6;
    border-radius: 4px;
    color: #6b7280;
    font-style: italic;

    .icon-lock {
      margin-right: 8px;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "heading": "Submitted Data"
  }
}
</i18n>

<i18n>
{
  "fr": {
    "heading": "Données soumises"
  },
  "es": {
    "heading": "Datos enviados"
  },
  "de": {
    "heading": "Übermittelte Daten"
  },
  "pt": {
    "heading": "Dados enviados"
  },
  "it": {
    "heading": "Dati inviati"
  },
  "sw": {
    "heading": "Data Iliyowasilishwa"
  },
  "zh": {
    "heading": "提交的数据"
  },
  "zh-Hant": {
    "heading": "提交的資料"
  },
  "ja": {
    "heading": "提出されたデータ"
  },
  "id": {
    "heading": "Data yang dikirim"
  },
  "cs": {
    "heading": "Odeslaná data"
  }
}
</i18n>
