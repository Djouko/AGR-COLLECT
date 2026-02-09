<template>
  <div id="user-home">
    <page-head>
      <template #title>{{ $t('title') }}</template>
      <template #tabs>
        <li :class="tabClass('')" role="presentation">
          <router-link :to="tabPath('')">{{ $t('resource.webUsers') }}</router-link>
        </li>
      </template>
    </page-head>
    <page-body>
      <router-view/>
    </page-body>
  </div>
</template>

<script setup>
import PageBody from '../page/body.vue';
import PageHead from '../page/head.vue';

import useTabs from '../../composables/tabs';

defineOptions({
  name: 'UserHome'
});

const { tabPath, tabClass } = useTabs('/users');
</script>

<style lang="scss">
#user-home {
  #page-head-tabs li { display: block; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is shown as the title at the top of the page.
    "title": "User Settings"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "title": "Uživatelské nastavení"
  },
  "de": {
    "title": "Benutzer-Einstellungen"
  },
  "es": {
    "title": "Configuraciones del usuario"
  },
  "fr": {
    "title": "Paramètres d'utilisateur"
  },
  "id": {
    "title": "Pengaturan Pengguna"
  },
  "it": {
    "title": "Impostazioni dell'utente"
  },
  "ja": {
    "title": "ユーザー管理"
  },
  "pt": {
    "title": "Configurações de usuário"
  },
  "sw": {
    "title": "Mipangilio ya Mtumiaji"
  },
  "zh": {
    "title": "用户设置"
  },
  "zh-Hant": {
    "title": "使用者設定"
  }
}
</i18n>
