<template>
  <router-link v-if="canRoute(to)" ref="link" :to="to" class="link-if-can">
    <slot></slot>
  </router-link>
  <span v-else ref="span" class="link-if-can">
    <slot></slot>
  </span>
</template>

<script setup>
import { computed, ref } from 'vue';

import useRoutes from '../composables/routes';

defineProps({
  to: {
    type: String,
    required: true
  }
});

const { canRoute } = useRoutes();

const link = ref(null);
const span = ref(null);
const $el = computed(() => (link.value != null ? link.value.$el : span.value));

defineExpose({ $el });
</script>

<style lang="scss">
span.link-if-can {
  > .icon-angle-right:last-child { display: none; }
}
</style>
