<template>
  <a :href="href" target="_blank"><slot></slot></a>
</template>

<script>
export default {
  name: 'DocLink',
  props: {
    to: {
      type: String,
      default: ''
    }
  },
  computed: {
    href() {
      return `https://docs.agr-collect.local/${this.to}`;
    }
  }
};
</script>
