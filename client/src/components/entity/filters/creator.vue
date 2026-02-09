<template>
  <multiselect id="entity-filters-creator" :model-value="selectValue" :options="options"
    :loading="entityCreators.initiallyLoading" :label="$t('field.creator')" :placeholder="placeholder"
    :all="$t('action.all')" :none="$t('action.none')" :search="$t('field.search')" :empty="$t('emptyTable')"
    @update:model-value="update">
    <template #icon>
      <span class="icon-user"></span>
    </template>
  </multiselect>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import Multiselect from '../../multiselect.vue';

import { useRequestData } from '../../../request-data';

defineOptions({
  name: 'EntityFiltersCreator'
});
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(['update:modelValue']);

const { entityCreators } = useRequestData();

const { t } = useI18n();
const unknown = computed(() => props.modelValue.reduce(
  (set, id) => (entityCreators.ids.has(id) ? set : set.add(id)),
  new Set()
));
const options = computed(() => {
  if (!entityCreators.dataExists) return null;
  const result = new Array(entityCreators.length + unknown.value.size);
  let i = 0;
  for (const id of unknown.value) {
    result[i] = { value: id, text: t('unknown') };
    i += 1;
  }
  for (const { id, displayName } of entityCreators) {
    result[i] = { value: id, text: displayName };
    i += 1;
  }
  return result;
});

const selectValue = ref(props.modelValue);
watch(() => props.modelValue, (value) => { selectValue.value = value; });
const update = (value) => {
  if (unknown.value.size !== 0) {
    const withoutUnknown = value.filter(id => !unknown.value.has(id));
    emit('update:modelValue', withoutUnknown.length !== 0
      ? withoutUnknown
      : [...entityCreators.ids]);
  } else if (value.length !== 0) {
    emit('update:modelValue', value);
  } else {
    const all = [...entityCreators.ids];
    if (props.modelValue.length !== all.length) {
      emit('update:modelValue', all);
    } else {
      selectValue.value = value;
      nextTick(() => { selectValue.value = all; });
    }
  }
};

const placeholder = (counts) => {
  if (counts.total === counts.selected) return t('action.all');

  return counts.selected;
};
</script>

<style lang="scss">
#entity-filters-creator .none {
  font-style: italic;
}
</style>

<i18n lang="json5">
{
  "en": {
    "field": {
      // This is the text of a form field that shows the names of users that have created Entities.
      "creator": "Created by",
      "search": "Search creators…"
    },
    "action": {
      /*
      This is the text of the button in dropdown menu of entity "created by" filter,
      that allows the user to select all creators.
      */
      "all": "All",
      /*
      This is the text of the button in dropdown menu of creator filter,
      that allows the user to unselect all creators.
      */
      "none": "None"
    },
    "unknown": "Unknown creator",
    "emptyTable": "There are no Entities yet."
  }
}
</i18n>

<i18n>
{
  "de": {
    "field": {
      "creator": "Erstellt von",
      "search": "Ersteller suchen…"
    },
    "action": {
      "all": "Alle",
      "none": "Keine"
    },
    "unknown": "Unbekannter Ersteller",
    "emptyTable": "Es gibt noch keine Objekte."
  },
  "es": {
    "field": {
      "creator": "Creado por",
      "search": "Buscar creadores..."
    },
    "action": {
      "all": "Todas",
      "none": "Ninguna"
    },
    "unknown": "Creador desconocido",
    "emptyTable": "Aún no hay entidades."
  },
  "fr": {
    "field": {
      "creator": "Créé par",
      "search": "Rechercher un créateur..."
    },
    "action": {
      "all": "Tous",
      "none": "Aucun"
    },
    "unknown": "Créateur inconnu",
    "emptyTable": "Pas encore d'entités."
  },
  "it": {
    "field": {
      "creator": "Creato da",
      "search": "Cerca creatore..."
    },
    "action": {
      "all": "Tutto",
      "none": "Nessuno/a"
    },
    "unknown": "Creatore sconosciuto",
    "emptyTable": "Non ci sono ancora entità"
  },
  "pt": {
    "field": {
      "creator": "Criado por",
      "search": "Buscar criadores..."
    },
    "action": {
      "all": "Todos",
      "none": "Nenhum"
    },
    "unknown": "Criador desconhecido",
    "emptyTable": "Não há Entidades ainda."
  },
  "zh": {
    "field": {
      "creator": "创建人",
      "search": "搜索创建人…"
    },
    "action": {
      "all": "全部",
      "none": "无"
    },
    "unknown": "未知创建人",
    "emptyTable": "目前尚无实体。"
  },
  "zh-Hant": {
    "field": {
      "creator": "建立者",
      "search": "搜尋建立者…"
    },
    "action": {
      "all": "全部",
      "none": "無"
    },
    "unknown": "未知的建立者",
    "emptyTable": "目前尚無實體。"
  }
}
</i18n>
