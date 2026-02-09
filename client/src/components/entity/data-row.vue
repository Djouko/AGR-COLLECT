<template>
  <tr class="entity-data-row" :class="{ 'entity-row-selected': entity.__system.selected }">
    <td v-for="property of properties" :key="property.name">
      <span v-tooltip.text>{{ entity[property.odataName] }}</span>
    </td>
    <td><span v-tooltip.text>{{ entity.label }}</span></td>
    <td>{{ entity.__id }}</td>
  </tr>
</template>

<script setup>
defineOptions({
  name: 'EntityDataRow'
});
defineProps({
  entity: {
    type: Object,
    required: true
  },
  properties: {
    type: Array,
    required: true
  }
});
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.entity-row-selected {
  background-color: $color-selected-row;
}
</style>
