<template>
  <tr class="project-dataset-row">
    <td class="col-icon">
      <span v-if="showIcon" class="icon-database"></span>
    </td>
    <td colspan="2" class="dataset-name">
      <dataset-link :project-id="project.id" :name="dataset.name"
        v-tooltip.text/>
    </td>
    <td colspan="2" class="conflicts-count">
      <span v-tooltip.no-aria="dataset.conflicts > 0 ? null : $t('common.conflicts')">
        <router-link :class="{ 'btn btn-danger': dataset.conflicts > 0 }" :to="datasetPath(project.id, dataset.name, 'entities?conflict=true')">
          {{ dataset.conflicts > 0 ? $tcn('entity.conflictsCount', dataset.conflicts) : $n(0) }}<span class="icon-warning"></span>
        </router-link>
      </span>
    </td>
    <td class="last-entity">
      <span v-tooltip.no-aria="lastEntityTooltip">
        <template v-if="dataset.lastEntity != null">
          <router-link :to="datasetPath(project.id, dataset.name, 'entities')">
            <date-time-component :iso="dataset.lastEntity" relative="past" :tooltip="false"/>
            <span class="icon-clock-o"></span>
          </router-link>
        </template>
        <template v-else>{{ $t('entity.noEntity') }}</template>
      </span>
    </td>
    <td class="total-entities">
      <span v-tooltip.no-aria="$t('common.totalEntities')">
        <router-link :to="datasetPath(project.id, dataset.name, 'entities')">
          <span>{{ $n(dataset.entities, 'default') }}</span>
          <span class="icon-asterisk"></span>
        </router-link>
      </span>
    </td>
  </tr>
</template>

<script setup>
import { DateTime } from 'luxon';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DatasetLink from '../dataset/link.vue';
import DateTimeComponent from '../date-time.vue';

import useRoutes from '../../composables/routes';
import { formatDateTime } from '../../util/date-time';

const props = defineProps({
  dataset: {
    type: Object,
    required: true
  },
  project: {
    type: Object,
    required: true
  },
  showIcon: {
    type: Boolean,
    required: true
  }
});

const { datasetPath } = useRoutes();

const { t } = useI18n();

const lastEntityTooltip = computed(() => {
  const { lastEntity } = props.dataset;
  const header = t('header.lastEntity');
  if (lastEntity == null) return header;
  const formatted = formatDateTime(DateTime.fromISO(lastEntity));
  return `${header}\n${formatted}`;
});
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

.project-dataset-row {
  transition: background-color 0.15s;

  &:hover {
    background-color: #f9fafb !important;
  }

  td {
    font-size: 15px;
    padding: 8px 6px 8px 10px;
    color: #111827;
    border-top: 1px solid #f3f4f6;

    a {
      @include text-link;
      font-weight: 500;
    }
  }

  .dataset-name {
    font-weight: 500;
  }

  .total-entities {
    text-align: right;
    padding-right: 12px;
    width: 80px;
    font-size: 13px;
    color: #6b7280;
  }

  .last-entity {
    text-align: right;
    width: 170px;
    font-size: 13px;
    color: #6b7280;
  }

  [class*='icon'] {
    margin-left: 5px;
    color: #d1d5db;
  }
}
</style>
