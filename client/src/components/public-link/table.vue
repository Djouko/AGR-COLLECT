<template>
  <table id="public-link-table" class="table">
    <thead>
      <tr>
        <th class="display-name">{{ $t('header.displayName') }}</th>
        <th>{{ $t('header.once') }}</th>
        <th class="access-link">{{ $t('header.accessLink') }}</th>
        <th class="actions">{{ $t('header.actions') }}</th>
      </tr>
    </thead>
    <tbody v-if="publicLinks.dataExists">
      <public-link-row v-for="publicLink of publicLinks" :key="publicLink.id"
        :public-link="publicLink" :highlighted="highlighted"
        @revoke="$emit('revoke', $event)"/>
    </tbody>
  </table>
</template>

<script setup>
import PublicLinkRow from './row.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'PublicLinkTable'
});
defineProps({
  highlighted: Number
});
defineEmits(['revoke']);

const { publicLinks } = useRequestData();
</script>

<style lang="scss">
#public-link-table {
  table-layout: fixed;

  th {
    &.display-name, &.access-link { width: 33.33333333%; }
    &.actions { width: 130px; }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "header": {
      "once": "Single Submission",
      "accessLink": "Access Link"
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "header": {
      "once": "Samostatný příspěvek",
      "accessLink": "Odkaz"
    }
  },
  "de": {
    "header": {
      "once": "Einzelübermittlung",
      "accessLink": "Zugangslink"
    }
  },
  "es": {
    "header": {
      "once": "Envío único",
      "accessLink": "Enlace de acceso"
    }
  },
  "fr": {
    "header": {
      "once": "Soumission unique",
      "accessLink": "Lien d'accès"
    }
  },
  "id": {
    "header": {
      "once": "Kiriman Data Tunggal",
      "accessLink": "Tautan Akses"
    }
  },
  "it": {
    "header": {
      "once": "Invio singolo",
      "accessLink": "Link di accesso"
    }
  },
  "ja": {
    "header": {
      "once": "一回限りのデータ提出機能",
      "accessLink": "アクセスリンク"
    }
  },
  "pt": {
    "header": {
      "once": "Resposta única",
      "accessLink": "Link de acesso"
    }
  },
  "sw": {
    "header": {
      "once": "Uwasilishaji Mmoja",
      "accessLink": "Kiungo cha Ufikiaji"
    }
  },
  "zh": {
    "header": {
      "once": "单次提交",
      "accessLink": "访问链接"
    }
  },
  "zh-Hant": {
    "header": {
      "once": "單次提交",
      "accessLink": "訪問連結"
    }
  }
}
</i18n>
