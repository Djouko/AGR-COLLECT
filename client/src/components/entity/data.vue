<template>
  <page-section id="entity-data">
    <template #heading>
      <span>{{ $t('common.data') }}</span>
      <button v-if="rendersUpdateButton" id="entity-data-update-button"
        type="button" class="btn btn-default" @click="$emit('update')">
        <span class="icon-pencil"></span>{{ $t('action.edit') }}
      </button>
    </template>
    <template #body>
      <loading :state="dataset.initiallyLoading"/>
      <dl v-if="dataExists">
        <div v-for="{ name } of dataset.properties" :key="name">
          <dl-data :name="name" :value="data[name]"/>
        </div>
      </dl>
    </template>
  </page-section>
</template>

<script setup>
import { computed } from 'vue';

import DlData from '../dl-data.vue';
import Loading from '../loading.vue';
import PageSection from '../page/section.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'EntityData'
});
defineEmits(['update']);

const { project, dataset, entity, resourceStates } = useRequestData();
const { dataExists } = resourceStates([dataset, entity]);

const rendersUpdateButton = computed(() => project.dataExists &&
  project.permits('entity.update') && dataset.dataExists);
const data = computed(() => entity.currentVersion.data);
</script>

<style lang="scss">
#entity-data {
  margin-bottom: 35px;
}
</style>
