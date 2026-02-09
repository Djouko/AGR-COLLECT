<template>
  <hover-card icon="cube">
    <template #title>{{ entity.currentVersion.label }}</template>
    <template #subtitle>{{ $t('resource.entity') }}</template>
    <template #body>
      <dl class="dl-horizontal">
        <dt>{{ $t('resource.entityList') }}</dt>
        <dd>{{ dataset.name }}</dd>

        <dt>{{ $t('common.lastUpdate') }}</dt>
        <dd><date-time :iso="entity.updatedAt ?? entity.createdAt"/></dd>

        <dl-data v-for="name of propertyNames" :key="name" :name="name"
          :value="entityData[name]"/>
      </dl>
    </template>
  </hover-card>
</template>

<script setup>
import { computed } from 'vue';

import DateTime from '../date-time.vue';
import DlData from '../dl-data.vue';
import HoverCard from '../hover-card.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'HoverCardEntity'
});

const { dataset, entity } = useRequestData();

const propertyNames = computed(() => {
  const { properties } = dataset;
  const length = Math.min(properties.length, 5);
  return new Array(length).fill(null).map((_, i) => properties[i].name);
});
const entityData = computed(() => entity.currentVersion.data);
</script>
