<template>
  <div v-show="state" class="loading">
    {{ message ?? $t('common.loading') }}
  </div>
</template>

<script setup>
defineProps({
  state: Boolean,
  message: String
});
</script>

<style lang="scss">
.loading {
  color: #9ca3af;
  margin-bottom: 10px;
  text-align: center;
}
</style>
