<!-- Specifying :key so that if `to` changes, the element will be replaced. If a
hover card is shown next to the element, it will be hidden. -->
<template>
  <router-link ref="link" :key="to" :to="to">
    {{ submission.currentVersion.instanceName ?? submission.instanceId }}
  </router-link>
</template>

<script setup>
import { computed, ref } from 'vue';

import useHoverCard from '../../composables/hover-card';
import useRoutes from '../../composables/routes';

defineOptions({
  name: 'SubmissionLink'
});
const props = defineProps({
  projectId: {
    type: [Number, String],
    required: true
  },
  xmlFormId: {
    type: String,
    required: true
  },
  submission: {
    type: Object,
    required: true
  }
});

const { submissionPath } = useRoutes();
const to = computed(() =>
  submissionPath(props.projectId, props.xmlFormId, props.submission.instanceId));

const link = ref(null);
useHoverCard(computed(() => link.value?.$el), 'submission', () => ({
  projectId: props.projectId,
  xmlFormId: props.xmlFormId,
  instanceId: props.submission.instanceId
}));
</script>
