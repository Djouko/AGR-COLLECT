<template>
  <div class="submission-actions btn-group">
    <button v-if="project.verbs.has('submission.delete')" type="button"
      class="delete-button btn btn-default" :aria-label="$t('action.delete')"
      v-tooltip.aria-label>
      <span class="icon-trash"></span><spinner :state="awaitingResponse"/>
    </button>
    <template v-if="project.verbs.has('submission.update')">
      <button type="button" class="review-button btn btn-default"
        :aria-label="$t('action.review')" v-tooltip.aria-label>
        <span class="icon-check"></span>
      </button>
      <a v-if="submission.__system.status == null" class="btn btn-default"
        :href="editPath" target="_blank" :aria-label="editLabel"
        v-tooltip.aria-label>
        <span class="icon-pencil"></span>
      </a>
      <button v-else type="button" class="btn btn-default"
        :aria-label="editLabel" aria-disabled="true"
        v-tooltip.aria-describedby="$t('submission.editDisabled')">
        <span class="icon-pencil"></span>
      </button>
    </template>
    <router-link v-slot="{ href }" :to="detailPath" custom>
      <a class="more-button btn btn-default" :href="href" target="_blank">
        <span>{{ $t('action.more') }}</span>
        <span class="icon-angle-right"></span>
      </a>
    </router-link>
  </div>
</template>

<script setup>

import { computed, inject } from 'vue';

import Spinner from '../spinner.vue';

import useRoutes from '../../composables/routes';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'SubmissionActions'
});
const props = defineProps({
  submission: {
    type: Object,
    required: true
  },
  awaitingResponse: Boolean
});

const { i18n } = inject('container');
const { project, form } = useRequestData();

const { submissionPath, editSubmissionPath } = useRoutes();
const detailPath = computed(() =>
  submissionPath(form.projectId, form.xmlFormId, props.submission.__id));

const editPath = computed(() => editSubmissionPath(
  form.projectId,
  form.xmlFormId,
  props.submission.__id,
  form.webformsEnabled
));
const editLabel = computed(() => i18n.t('submission.action.edit', {
  count: i18n.n(props.submission.__system.edits, 'default')
}));
</script>
