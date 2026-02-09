<template>
  <link-if-can v-if="actor.type === 'user' && actor.deletedAt == null" :to="to" class="actor-link" v-tooltip.text>{{ actor.displayName }}</link-if-can>
  <span v-else class="actor-link" v-tooltip.text>{{ actor.displayName }}</span>
</template>

<script setup>
import { computed } from 'vue';

import LinkIfCan from './link-if-can.vue';

import useRoutes from '../composables/routes';

const props = defineProps({
  actor: {
    type: Object,
    required: true
  }
});

const { userPath } = useRoutes();
const to = computed(() => userPath(props.actor.id));
</script>
