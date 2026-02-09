<template>
  <table id="form-version-table" class="table">
    <thead>
      <tr>
        <th>{{ $t('header.name') }}</th>
        <th>{{ $t('header.published') }}</th>
        <th>{{ $t('header.actions') }}</th>
      </tr>
    </thead>
    <tbody v-if="formVersions.dataExists">
      <form-version-row v-for="(version, index) in formVersions"
        :key="version.version" :version="version" :current="index === 0"
        @view-xml="$emit('view-xml')"/>
    </tbody>
  </table>
</template>

<script setup>
import FormVersionRow from './row.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'FormVersionTable'
});
defineEmits(['view-xml']);

const { formVersions } = useRequestData();
</script>

<style lang="scss">
#form-version-table {
  table-layout: fixed;

  th:nth-child(3) {
    width: 245px;
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "header": {
      // This is the text of a table column header. The column shows who
      // published the version of the Form, as well as when they did so.
      "published": "Published",
      // This is the text of a table column header. "Definition" refers to a
      // Form definition.
      "definition": "Definition"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "header": {
      "published": "Publikováno",
      "definition": "Definice"
    }
  },
  "de": {
    "header": {
      "published": "Veröffentlicht",
      "definition": "Definition"
    }
  },
  "es": {
    "header": {
      "published": "Publicado",
      "definition": "Definición"
    }
  },
  "fr": {
    "header": {
      "published": "Publié",
      "definition": "Définition"
    }
  },
  "id": {
    "header": {
      "published": "Diterbitkan",
      "definition": "Definisi"
    }
  },
  "it": {
    "header": {
      "published": "Pubblicato",
      "definition": "Definizione"
    }
  },
  "ja": {
    "header": {
      "published": "公開済み",
      "definition": "定義フォーム"
    }
  },
  "pt": {
    "header": {
      "published": "Publicado",
      "definition": "Definição"
    }
  },
  "sw": {
    "header": {
      "published": "Imechapishwa",
      "definition": "Ufafanuzi"
    }
  },
  "zh": {
    "header": {
      "published": "已发布",
      "definition": "定义"
    }
  },
  "zh-Hant": {
    "header": {
      "published": "已發布",
      "definition": "定義"
    }
  }
}
</i18n>
