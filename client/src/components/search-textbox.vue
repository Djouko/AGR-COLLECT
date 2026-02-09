<template>
  <label id="search-textbox" class="form-group" :class="{ disabled }">
    <span class="icon-search"></span>
    <input v-model="searchTextbox" class="form-control search-textbox" :placeholder="label"
      :aria-label="label" :aria-disabled="disabled" v-tooltip.aria-describedby="disabledMessage"
      autocomplete="off" @keydown.enter="setSearchTerm" @focusout="revert">
    <button v-show="searchTextbox" type="button" class="close"
      :aria-label="$t('action.clearSearch')" @click="clearSearch">
      <span aria-hidden="true">&times;</span>
    </button>
    <span v-if="!hideLabel" class="form-label">{{ label }}</span>
  </label>
</template>

<script setup>
import { ref, watch } from 'vue';


const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  disabledMessage: String,
  /**
   * Text for label and placeholder
   */
  label: {
    type: String,
    required: true
  },
  hideLabel: Boolean
});

const emit = defineEmits(['update:modelValue']);

const searchTextbox = ref(props.modelValue);

const setSearchTerm = () => {
  emit('update:modelValue', searchTextbox.value);
};

const clearSearch = () => {
  emit('update:modelValue', '');
};

const revert = () => {
  searchTextbox.value = props.modelValue;
};

watch(() => props.modelValue, (value) => {
  searchTextbox.value = value;
});
</script>

<style lang="scss">
@import '../assets/scss/mixins';
@import '../assets/scss/variables';

#search-textbox {
  @include filter-control;

  .form-control {
    padding-right: 21px;
    font-size: 12px;
    background: inherit;
    border: none;

    &::placeholder {
      color: $color-text-secondary;
    }
  }

  .form-label {
    position: absolute;
    top: 37px;
    left: 33px;
  }

  .close {
    right: 10px;
    top: 6px;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "action": {
      // @transifexKey component.ProjectUserList.action.clearSearch
      "clearSearch": "Clear search"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "action": {
      "clearSearch": "Vymazat vyhledávání"
    }
  },
  "de": {
    "action": {
      "clearSearch": "Suche löschen"
    }
  },
  "es": {
    "action": {
      "clearSearch": "Limpiar la búsqueda"
    }
  },
  "fr": {
    "action": {
      "clearSearch": "Effacer la recherche"
    }
  },
  "id": {
    "action": {
      "clearSearch": "Hapus pencarian"
    }
  },
  "it": {
    "action": {
      "clearSearch": "Cancella ricerca"
    }
  },
  "ja": {
    "action": {
      "clearSearch": "検索条件の解除"
    }
  },
  "pt": {
    "action": {
      "clearSearch": "Limpar a busca"
    }
  },
  "sw": {
    "action": {
      "clearSearch": "Futa utafutaji"
    }
  },
  "zh": {
    "action": {
      "clearSearch": "清除搜索条件"
    }
  },
  "zh-Hant": {
    "action": {
      "clearSearch": "清除搜尋"
    }
  }
}
</i18n>
