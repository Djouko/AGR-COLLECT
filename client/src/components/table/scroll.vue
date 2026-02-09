<template>
  <div class="table-scroll">
    <slot></slot>
  </div>
</template>

<script setup>
defineOptions({
  name: 'TableScroll'
});
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.table-scroll {
  border-bottom: $border-top-table-data;
  margin-bottom: $margin-bottom-table;
  overflow: hidden auto;
  position: relative;

  table { margin-bottom: 0; }

  thead {
    position: sticky;
    top: 0;
  }

  th:first-child { border-left: 1px solid $color-table-heading-background; }
  th:last-child { border-right: 1px solid $color-table-heading-background; }
  td:first-child { border-left: $border-top-table-data; }
  td:last-child { border-right: $border-top-table-data; }
}
</style>
