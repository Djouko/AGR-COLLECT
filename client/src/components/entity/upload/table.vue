<template>
  <div ref="container" class="entity-upload-table"
    :class="{ 'overlaps-popup': overlapsPopup }" :style="{ minHeight }">
    <table class="table">
      <thead>
        <tr>
          <th><span class="sr-only">{{ $t('common.rowNumber') }}</span></th>
          <th>label</th>
          <th v-for="{ name } of dataset.properties" :key="name">
            <div v-tooltip.text>{{ name }}</div>
          </th>
        </tr>
      </thead>
      <tbody v-if="entities != null && entities.length !== 0"
        :class="{ 'data-loading': awaitingResponse }">
        <tr v-for="(entity, entityIndex) in entities" :key="entityIndex"
          :class="{ highlight: isHighlighted(rowIndex + entityIndex) }">
          <td class="row-number">
            {{ $n(rowIndex + entityIndex + 1, 'noGrouping') }}
          </td>
          <td><div v-tooltip.text>{{ entity.label }}</div></td>
          <td v-for="{ name } of dataset.properties" :key="name">
            <div v-tooltip.text>{{ entity.data[name] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';

import { px } from '../../../util/dom';
import { useRequestData } from '../../../request-data';

defineOptions({
  name: 'EntityUploadTable'
});
const props = defineProps({
  entities: Array,
  rowIndex: Number,
  pageSize: {
    type: Number,
    required: true
  },
  awaitingResponse: Boolean,
  highlighted: Array
});

const { dataset } = useRequestData();

const container = ref(null);

const minHeight = ref('auto');
let previousHeight = 0;
watch(
  [() => props.entities, () => props.pageSize],
  ([entities, newSize], [, oldSize]) => {
    minHeight.value = 'auto';

    if (newSize !== oldSize || entities == null) previousHeight = 0;

    if (entities != null && entities.length === newSize) {
      nextTick(() => {
        previousHeight = container.value.getBoundingClientRect().height;
      });
    } else if (previousHeight !== 0) {
      minHeight.value = px(previousHeight);
    }
  }
);

const isHighlighted = (index) => props.highlighted != null &&
  index >= props.highlighted[0] && index <= props.highlighted[1];

const overlapsPopup = ref(false);
const resizeLastColumn = () => {
  const th = container.value.querySelector('th:last-child');
  th.style.width = '';

  if (container.value.clientWidth === 0) {
    overlapsPopup.value = false;
    return;
  }

  const popup = container.value.closest('.modal-body')
    .querySelector('#entity-upload-popup');
  if (popup != null) {
    const popupRect = popup.getBoundingClientRect();
    const containerRect = container.value.getBoundingClientRect();
    overlapsPopup.value = popupRect.top < containerRect.bottom;
    if (overlapsPopup.value) {
      const overlap = containerRect.right - popupRect.left;
      th.style.width = px(th.clientWidth + overlap + 10);
    }
  }

  if (container.value.scrollWidth === container.value.clientWidth)
    th.style.width = 'auto';
};

const resetScroll = () => { container.value.scroll(0, 0); };

defineExpose({ resizeLastColumn, resetScroll });
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

.entity-upload-table {
  overflow: auto;

  table {
    margin-bottom: 0;
    table-layout: fixed;
  }

  $col-width: 160px;
  th, td {
    div { @include text-overflow-ellipsis; }
  }
  &.overlaps-popup {
    th, td {
      &:last-child div {
        width: #{$col-width - $padding-left-table-data - $padding-right-table-data};
      }
    }
  }

  th {
    width: $col-width;
    &:first-child { width: 54px; }
  }

  td:first-child { padding-left: 0; }
}
</style>
