<template>
  <div id="project-overview">
    <form-list/>
    <form-trash-list v-if="rendersTrashList" @restore="$emit('fetch-forms', true)"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import FormList from '../form/list.vue';
import FormTrashList from '../form/trash-list.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'ProjectOverview'
});
defineProps({
  projectId: {
    type: String,
    required: true
  }
});
const emit = defineEmits(['fetch-forms']);

const { project } = useRequestData();
emit('fetch-forms', false);

const rendersTrashList = computed(() =>
  project.dataExists && project.permits('form.restore'));
</script>
