<template>
  <a class="submission-attachment-link" :href="href" target="_blank"
    :aria-disabled="deleted" :aria-label="label" v-tooltip.aria-label>
    <span class="icon-check"></span> <span class="icon-download"></span>
  </a>
</template>

<script setup>
import { computed, inject } from 'vue';

import { apiPaths } from '../../util/request';

defineOptions({
  name: 'SubmissionAttachmentLink'
});
const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  xmlFormId: {
    type: String,
    required: true
  },
  draft: Boolean,
  instanceId: {
    type: String,
    required: true
  },
  attachmentName: {
    type: String,
    required: true
  },
  deleted: Boolean
});

const { i18n } = inject('container');

const href = computed(() => apiPaths.submissionAttachment(
  props.projectId,
  props.xmlFormId,
  props.draft,
  props.instanceId,
  props.attachmentName
));
const label = computed(() => (props.deleted
  ? i18n.t('submission.fileDownloadUnavailable')
  : i18n.t('submission.binaryLinkTitle')));
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.submission-attachment-link {
  background-color: $color-subpanel-background;
  border-radius: 99px;
  padding: 4px 7px;
  text-decoration: none;

  .icon-check {
    color: $color-success;
    margin-right: 0;
  }

  .icon-download {
    border-left: 1px dotted #d1d5db;
    color: #d1d5db;
    padding-left: 5px;
  }
  &:hover .icon-download { color: $color-action-foreground; }
}
</style>
