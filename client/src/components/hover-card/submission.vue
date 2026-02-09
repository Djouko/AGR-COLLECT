<template>
  <hover-card icon="tag" :truncate-dt="false">
    <template #title>
      <template v-if="submission.instanceName != null">
        {{ submission.instanceName }}
      </template>
      <template v-else>
        <span v-for="(part, index) in idParts" :key="index">{{ part }}</span>
      </template>
    </template>
    <template #subtitle>{{ $t('resource.submission') }}</template>
    <template #body>
      <dl class="dl-horizontal">
        <dt>{{ $t('resource.form') }}</dt>
        <dd>{{ form.nameOrId }}</dd>

        <dt>{{ $t('header.submitterName') }}</dt>
        <dd>{{ submission.__system.submitterName }}</dd>

        <dt>{{ $t('header.submissionDate') }}</dt>
        <dd><date-time :iso="submission.__system.submissionDate"/></dd>

        <dt>{{ $t('common.reviewState') }}</dt>
        <dd>
          <submission-review-state :value="submission.__system.reviewState"/>
        </dd>
      </dl>
    </template>
  </hover-card>
</template>

<script setup>
import { computed } from 'vue';

import DateTime from '../date-time.vue';
import HoverCard from '../hover-card.vue';
import SubmissionReviewState from '../submission/review-state.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'HoverCardSubmission'
});

const { form, submission } = useRequestData();

const idParts = computed(() => {
  const id = submission.__id;
  const match = id.match(/^((?:uuid:)?[0-9a-f]{8})[0-9a-f-]+([0-9a-f]{8})$/);
  return match != null ? [match[1], '…', match[2]] : [id];
});
</script>
