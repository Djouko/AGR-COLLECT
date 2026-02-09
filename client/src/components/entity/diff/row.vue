<template>
  <tr class="entity-diff-row">
    <td :class="{ property: name !== 'label', conflicting }">
      <span v-tooltip.text>{{ name === 'label' ? $t('entity.label') : name }}</span>
      <span v-if="conflicting" class="sr-only">&nbsp;{{ $t('conflictingProp') }}</span>
    </td>

    <td v-if="oldValue === ''" class="empty">{{ $t('common.emptyValue') }}</td>
    <td v-else class="value">{{ oldValue }}</td>

    <td aria-hidden="true">
      <span v-if="conflicting" v-tooltip.no-aria="$t('conflictingProp')">
        <span class="icon-arrow-circle-right"></span>
        <span class="icon-exclamation-circle"></span>
      </span>
      <template v-else>
        <span class="icon-arrow-circle-right"></span>
      </template>
    </td>

    <td v-if="newValue === ''" class="empty">{{ $t('common.emptyValue') }}</td>
    <td v-else class="value">{{ newValue }}</td>
  </tr>
</template>

<script setup>
import { computed, inject } from 'vue';

defineOptions({
  name: 'EntityDiffRow'
});
const props = defineProps({
  oldVersion: {
    type: Object,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});
const entityVersion = inject('entityVersion');

const { name } = props;
const conflicting = entityVersion.conflictingProperties.has(name);
const oldValue = computed(() => (name === 'label'
  ? props.oldVersion.label
  : props.oldVersion.data[name] ?? ''));
const newValue = name === 'label' ? entityVersion.label : entityVersion.data[name];
</script>

<style lang="scss">
@import '../../../assets/scss/mixins';

.entity-diff-row {
  .property {
    @include text-overflow-ellipsis;
    font-family: $font-family-monospace;
  }
  .conflicting { color: $color-danger; }

  .empty {
    @include italic;
    color: #9ca3af;
  }
  .value {
    overflow-wrap: break-word;
    white-space: break-spaces;
  }

  .icon-arrow-circle-right {
    position: relative;
    z-index: 1;

    left: 1px;
    &:last-child { left: 0; }
  }
  .icon-exclamation-circle {
    color: $color-danger;
    position: relative;
    right: 1px;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is shown for an Entity property that is part of a conflict between
    // versions of the Entity.
    "conflictingProp": "Another update already wrote to this property."
  }
}
</i18n>

<i18n>
{
  "cs": {
    "conflictingProp": "Další aktualizace již zapsala do této vlastnosti."
  },
  "de": {
    "conflictingProp": "Ein weiteres Update hat bereits diese Eigenschaft geschrieben."
  },
  "es": {
    "conflictingProp": "Otra actualización ya se escribió en esta propiedad."
  },
  "fr": {
    "conflictingProp": "Une autre mise à jour a déjà écrit sur cette propriété."
  },
  "it": {
    "conflictingProp": "Un altro aggiornamento è già stato scritto su questa proprietà."
  },
  "pt": {
    "conflictingProp": "Outra atualização já foi gravada nesta propriedade."
  },
  "zh": {
    "conflictingProp": "该属性已被其他更新写入"
  },
  "zh-Hant": {
    "conflictingProp": "另一個更新已寫入此屬性。"
  }
}
</i18n>
