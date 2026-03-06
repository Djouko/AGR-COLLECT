<template>
  <div>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed"
            data-toggle="collapse" data-target=".navbar-collapse"
            aria-expanded="false">
            <span class="sr-only">{{ $t('action.toggle') }}</span>
            <span class="navbar-icon-bar"></span>
            <span class="navbar-icon-bar"></span>
            <span class="navbar-icon-bar"></span>
          </button>
          <router-link to="/" class="navbar-brand">
            <img class="navbar-logo" src="/logo-agr-collect.png" alt="AGR-Collect"/>
            <span>AGR-Collect</span>
          </router-link>
        </div>
        <div class="collapse navbar-collapse">
          <navbar-links v-if="visiblyLoggedIn"/>
          <div class="navbar-right">
            <!-- Analytics notice hidden for AGR-Collect -->
            <a v-if="false" id="navbar-analytics-notice"
              href="#" @click.prevent="analyticsIntroduction.show()">
              {{ $t('analyticsNotice') }}
            </a>
            <ul class="nav navbar-nav">
              <navbar-help-dropdown/>
              <navbar-locale-dropdown/>
              <navbar-actions/>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <analytics-introduction v-if="config.loaded && config.showsAnalytics"
      v-bind="analyticsIntroduction" @hide="analyticsIntroduction.hide()"/>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

import NavbarActions from './navbar/actions.vue';
import NavbarHelpDropdown from './navbar/help-dropdown.vue';
import NavbarLinks from './navbar/links.vue';
import NavbarLocaleDropdown from './navbar/locale-dropdown.vue';

import useRoutes from '../composables/routes';
import { loadAsync } from '../util/load-async';
import { modalData } from '../util/reactivity';
import { useRequestData } from '../request-data';

export default {
  name: 'Navbar',
  components: {
    AnalyticsIntroduction: defineAsyncComponent(loadAsync('AnalyticsIntroduction')),
    NavbarActions,
    NavbarHelpDropdown,
    NavbarLinks,
    NavbarLocaleDropdown
  },
  inject: ['config', 'visiblyLoggedIn'],
  setup() {
    const { currentUser, analyticsConfig } = useRequestData();
    const { canRoute } = useRoutes();
    return { currentUser, analyticsConfig, canRoute };
  },
  data() {
    return {
      analyticsIntroduction: modalData('AnalyticsIntroduction')
    };
  },
  computed: {
    showsAnalyticsNotice() {
      return this.config.loaded && this.config.showsAnalytics && this.visiblyLoggedIn &&
        this.canRoute('/system/analytics') && this.analyticsConfig.dataExists &&
        this.analyticsConfig.isEmpty() &&
        Date.now() - Date.parse(this.currentUser.createdAt) >= /* 14 days */ 1209600000;
    }
  }
};
</script>

<style lang="scss">
@import '../assets/scss/mixins';

$nav-height: 48px;

.navbar-default {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  height: $nav-height;
  margin-bottom: 0;
  min-height: auto;

  .navbar-brand {
    float: left;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 800;
    height: $nav-height;
    letter-spacing: -0.01em;
    padding: 0 20px;

    &, &:hover, &:focus { color: #fff; }

    &:hover {
      opacity: 0.92;
    }

    &:focus {
      background-color: transparent;
      text-decoration: none;
    }

    .navbar-logo {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
    }
  }

  .navbar-nav {
    font-size: 13px;

    > li > a {
      &, &:hover, &:focus { color: rgba(255, 255, 255, 0.9); }
      &:hover { color: #fff; }
    }
  }
}

#navbar-analytics-notice {
  @include text-link;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  float: left;
  font-size: 10px;
  margin-top: 14px;
  margin-right: 20px;
  padding: 2px 8px;

  &:hover, &:focus {
    background-color: #ffeeba;
    border-color: #ffca2c;
  }
}

@media (min-width: 768px) {
  .navbar-default {
    border-radius: 0;

    .navbar-brand { margin-left: -15px; }

    .navbar-nav {
      > li > a {
        padding: 0 14px;
        height: $nav-height;
        line-height: $nav-height;
        box-sizing: border-box;
        border-bottom: 3px solid transparent;
        transition: all 0.2s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
          border-bottom-color: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          background-color: rgba(255, 255, 255, 0.06);
          border-bottom-color: rgba(255, 255, 255, 0.7);
          outline: none;
        }
      }

      .active > a, .open > a {
        &, &:hover, &:focus {
          background-color: rgba(0, 0, 0, 0.15);
          border-bottom-color: #fff;
          color: #fff;
          box-shadow: none;
        }
      }
    }
  }

  .navbar-right {
    margin-right: -25px;
  }

  #navbar-actions { margin-left: 10px; }
}

@media (max-width: 767px) {
  .navbar-default {
    height: $nav-height;

    .navbar-toggle {
      border: none;
      margin: 8px 8px;
      padding: 6px;

      &:hover, &:focus { background-color: rgba(255, 255, 255, 0.1); }

      .navbar-icon-bar {
        background-color: #fff;
        width: 20px;
        height: 2px;
      }
    }

    .navbar-collapse {
      background: linear-gradient(180deg, #1b5e20 0%, #2e7d32 100%);
      border: none;
      position: relative;
      z-index: 99;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .navbar-nav {
      margin-top: 0;
      padding: 8px 0;

      > li > a {
        padding: 10px 20px;
        border-left: 3px solid transparent;
        transition: all 0.15s ease;
      }

      .active > a, .open > a {
        border-left-color: #fff;

        &, &:hover, &:focus {
          background-color: rgba(0, 0, 0, 0.15);
          color: #fff;
        }
      }

      .open .dropdown-menu {
        background-color: rgba(0, 0, 0, 0.1);
        border: none;
        padding: 4px 0;

        > li > a {
          padding: 8px 32px;
          &, &:hover, &:focus { color: rgba(255, 255, 255, 0.9); }
          &:hover { background-color: rgba(255, 255, 255, 0.08); }
        }
      }
    }
  }

  #navbar-analytics-notice { display: none; }
}
</style>

<i18n lang="json5">
{
  "en": {
    "action": {
      "toggle": "Toggle navigation"
    },
    "analyticsNotice": "Help improve AGR-Collect!"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "action": {
      "toggle": "Přepnout navigaci"
    },
    "analyticsNotice": "Pomozte zlepšit AGR-Collect!"
  },
  "de": {
    "action": {
      "toggle": "Navigation umschalten"
    },
    "analyticsNotice": "Hilf AGR-Collect zu verbessern!"
  },
  "es": {
    "action": {
      "toggle": "Alternar la navegación"
    },
    "analyticsNotice": "Ayuda a mejorar AGR-Collect"
  },
  "fr": {
    "action": {
      "toggle": "Basculer la navigation"
    },
    "analyticsNotice": "Aidez à améliorer AGR-Collect !"
  },
  "id": {
    "action": {
      "toggle": "Navigasi Toggle"
    },
    "analyticsNotice": "Bantu Memperbaiki AGR-Collect!"
  },
  "it": {
    "action": {
      "toggle": "Attiva/disattiva navigazione"
    },
    "analyticsNotice": "Aiuta a migliorare AGR-Collect"
  },
  "ja": {
    "action": {
      "toggle": "ナビゲーションを有効化"
    },
    "analyticsNotice": "AGR-Collectの改善を支援！"
  },
  "pt": {
    "action": {
      "toggle": "Ocultar ou exibir a barra de navegação"
    },
    "analyticsNotice": "Ajude a melhorar o AGR-Collect!"
  },
  "sw": {
    "action": {
      "toggle": "Geuza urambazaji"
    },
    "analyticsNotice": "Saidia kuboresha AGR-Collect"
  },
  "zh": {
    "action": {
      "toggle": "切换导航"
    },
    "analyticsNotice": "助力完善AGR-Collect！"
  },
  "zh-Hant": {
    "action": {
      "toggle": "切換導航鈕"
    },
    "analyticsNotice": "幫忙改善 AGR-Collect!"
  }
}
</i18n>
