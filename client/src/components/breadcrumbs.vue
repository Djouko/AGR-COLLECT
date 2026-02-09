<template>
  <div class="breadcrumbs">
    <template v-for="(link, index) in links" :key="index">
      <div class="breadcrumb-item" v-tooltip.text>
        <linkable :to="link.path">
          <span v-if="link.icon" :class="link.icon"></span>
          {{ link.text }}
        </linkable>
      </div>
      <span v-if="index < links.length - 1" class="separator">/</span>
    </template>
  </div>
</template>

<script setup>
import Linkable from './linkable.vue';

defineProps({
  links: {
    type: Array,
    required: true,
    validator(value) {
      return value.every(link => 'text' in link);
    }
  }
});
</script>

<style lang="scss">
@import '../assets/scss/mixins';
.breadcrumbs {
  display: flex;
  align-items: center;
  background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 12px 15px 0;
  margin-inline: -15px;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb-item {
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;

  a {
    color: $color-accent-primary;
    text-decoration: none;
    transition: color 0.15s;

    &:hover {
      color: darken($color-accent-primary, 15%);
    }

    [class^="icon-"] {
      margin-left: 0;
      margin-right: 4px;
      font-size: 12px;
    }
  }
}

.separator {
  padding: 0px 8px;
  color: #d1d5db;
  font-size: 11px;
}
</style>
