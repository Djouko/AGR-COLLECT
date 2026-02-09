<template>
  <multiselect id="submission-filters-review-state" :model-value="modelValue"
    :options="options" default-to-all :label="$t('common.reviewState')"
    :placeholder="placeholder" :all="$t('action.all')"
    :none="$t('action.none')"
    @update:model-value="$emit('update:modelValue', $event)"/>
</template>

<script setup>
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

import Multiselect from '../../multiselect.vue';

import useReviewState from '../../../composables/review-state';
import { odataLiteral } from '../../../util/odata';

defineOptions({
  name: 'SubmissionFiltersReviewState'
});
defineProps({
  modelValue: {
    type: Array,
    required: true
  }
});
defineEmits(['update:modelValue']);

const { reviewStates } = useReviewState();
const { i18n: globalI18n } = inject('container');
const options = reviewStates.map(reviewState => ({
  value: odataLiteral(reviewState),
  text: globalI18n.t(`reviewState.${reviewState}`)
}));

const { t } = useI18n();
const placeholder = (counts) => {
  if (counts.total === counts.selected) return t('action.all');
  return counts.selected;
};
</script>

<style lang="scss">
#submission-filters-review-state .none {
  font-style: italic;
}
</style>

<i18n lang="json5">
{
  "en": {
    "action": {
      /*
      This is the text of the button in dropdown menu of Review States filter,
      that allows the user to select all Review States.
      */
      "all": "All",
      /*
      This is the text of the button in dropdown menu of Review States filter,
      that allows the user to unselect all Review States.
      */
      "none": "None"
    },
  }
}
</i18n>

<i18n>
{
  "de": {
    "action": {
      "all": "Alle",
      "none": "Keine"
    }
  },
  "es": {
    "action": {
      "all": "Todos",
      "none": "Ninguno"
    }
  },
  "fr": {
    "action": {
      "all": "Tous",
      "none": "Aucun"
    }
  },
  "it": {
    "action": {
      "all": "Tutto",
      "none": "Nessuno/a"
    }
  },
  "pt": {
    "action": {
      "all": "Todos",
      "none": "Nenhum"
    }
  },
  "zh": {
    "action": {
      "all": "全部",
      "none": "无"
    }
  },
  "zh-Hant": {
    "action": {
      "all": "全部",
      "none": "無"
    }
  }
}
</i18n>
