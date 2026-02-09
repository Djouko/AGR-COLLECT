<template>
  <router-link v-if="to != null && !external" :to="to" class="linkable">
    <slot></slot>
  </router-link>
  <a v-else-if="to != null && external" class="linkable" :href="to"
    target="_blank">
    <slot></slot>
  </a>
  <a v-else-if="clickable" class="linkable" href="#" role="button"
    @click.prevent="$emit('click')">
    <slot></slot>
  </a>
  <component :is="tag" v-else class="linkable">
    <slot></slot>
  </component>
</template>

<script>
export default {
  name: 'Linkable',
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    to: String,
    clickable: Boolean
  },
  emits: ['click'],
  computed: {
    external() {
      return !this.to.startsWith('/');
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/mixins';

a.linkable { @include text-link; }
</style>
