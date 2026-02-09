<!-- Specifying :key so that if `to` changes, the element will be replaced. If a
hover card is shown next to the element, it will be hidden. -->
<template>
  <router-link ref="link" :key="to" :to="to">
    {{ entity.currentVersion.label }}
  </router-link>
</template>

<script setup>
import { computed, ref } from 'vue';

import useHoverCard from '../../composables/hover-card';
import useRoutes from '../../composables/routes';

defineOptions({
  name: 'EntityLink'
});
const props = defineProps({
  projectId: {
    type: [Number, String],
    required: true
  },
  dataset: {
    type: String,
    required: true
  },
  entity: {
    type: Object,
    required: true
  }
});

const { entityPath } = useRoutes();
const to = computed(() =>
  entityPath(props.projectId, props.dataset, props.entity.uuid));

const link = ref(null);
useHoverCard(computed(() => link.value?.$el), 'entity', () => ({
  projectId: props.projectId,
  dataset: props.dataset,
  uuid: props.entity.uuid
}));
</script>
