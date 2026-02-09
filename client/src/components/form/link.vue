<!-- Specifying :key so that if the link path changes, the element will be
replaced. If a hover card is shown next to the element, it will be hidden. -->
<template>
  <link-if-can v-if="to == null" ref="link" :key="toDefault" :to="toDefault">
    {{ form.name ?? form.xmlFormId }}
  </link-if-can>
  <router-link v-else ref="link" :key="to" :to="to">
    {{ form.name ?? form.xmlFormId }}
  </router-link>
</template>

<script setup>
import { computed, ref } from 'vue';

import LinkIfCan from '../link-if-can.vue';

import useHoverCard from '../../composables/hover-card';
import useRoutes from '../../composables/routes';

defineOptions({
  name: 'FormLink'
});
const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  to: String
});

const { primaryFormPath } = useRoutes();
const toDefault = computed(() => primaryFormPath(props.form));

const link = ref(null);
useHoverCard(computed(() => link.value?.$el), 'form', () => props.form);
</script>
