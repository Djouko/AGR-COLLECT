<template>
  <div id="project-sort">
    <form class="form-inline" @submit.prevent>
      <label class="form-group">
        <span id="project-sort-label">{{ $t('action.sort') }}</span>
        <select :value="modelValue" class="form-control"
          @change="$emit('update:modelValue', $event.target.value)">
          <option value="alphabetical">{{ $t('sortOptions.alphabetical') }}</option>
          <option value="latest">{{ $t('header.recentActivity') }}</option>
          <option value="newest">{{ $t('sortOptions.newest') }}</option>
        </select>
      </label>
    </form>
  </div>
</template>

<script setup>
defineOptions({
  name: 'ProjectSort'
});
defineProps({
  modelValue: {
    type: String,
    required: true
  }
});
defineEmits(['update:modelValue']);
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#project-sort {
  float: right;
  display: flex;
  align-items: center;

  #project-sort-label {
    font-size: 12px;
    padding-right: 8px;
    color: #9ca3af;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .form-control {
    font-size: 13px;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    padding: 4px 10px;
    height: 32px;
    color: #374151;
    background: white;
    cursor: pointer;

    &:focus {
      border-color: $color-action-background;
      box-shadow: 0 0 0 2px rgba(46, 125, 50, 0.1);
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This text is shown as one option in a dropdown menu for choosing how to sort a list of Projects.
    "sortOptions": {
      "alphabetical": "Alphabetical",
      "newest": "Newest"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "sortOptions": {
      "alphabetical": "Abecedně",
      "newest": "Nejnovější"
    }
  },
  "de": {
    "sortOptions": {
      "alphabetical": "Alphabetisch",
      "newest": "Neueste"
    }
  },
  "es": {
    "sortOptions": {
      "alphabetical": "Alfabético",
      "newest": "El mas nuevo"
    }
  },
  "fr": {
    "sortOptions": {
      "alphabetical": "Alphabétique",
      "newest": "Plus récent"
    }
  },
  "id": {
    "sortOptions": {
      "alphabetical": "Urutan Abjad",
      "newest": "Terbaru"
    }
  },
  "it": {
    "sortOptions": {
      "alphabetical": "Alfabetico",
      "newest": "Il più nuovo"
    }
  },
  "pt": {
    "sortOptions": {
      "alphabetical": "Em ordem alfabética",
      "newest": "Mais recentes"
    }
  },
  "sw": {
    "sortOptions": {
      "alphabetical": "Kialfabeti",
      "newest": "Mpya zaidi"
    }
  },
  "zh": {
    "sortOptions": {
      "alphabetical": "按字母顺序",
      "newest": "最新优先"
    }
  },
  "zh-Hant": {
    "sortOptions": {
      "alphabetical": "按字母順序",
      "newest": "新專案優先"
    }
  }
}
</i18n>
