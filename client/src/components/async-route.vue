<template>
  <div v-if="loading === 'tab'">
    <loading :state="showsLoading"/>
    <component :is="component" v-if="component != null" v-bind="bindings"/>
  </div>
  <page-body v-else-if="showsLoading">
    <loading :state="true"/>
  </page-body>
  <component :is="component" v-else-if="component != null" v-bind="bindings"/>
</template>

<script>
import { markRaw } from 'vue';

import Loading from './loading.vue';
import PageBody from './page/body.vue';

import { loadAsync, loadedAsync } from '../util/load-async';
import { noop } from '../util/util';

export default {
  name: 'AsyncRoute',
  components: { Loading, PageBody },
  inject: ['alert', 'location'],
  inheritAttrs: false,
  props: {
    componentName: {
      type: String,
      required: true
    },
    props: {
      type: Object,
      required: true
    },
    loading: {
      type: String,
      required: true
    },
    k: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      component: null,
      showsLoading: false,
      cancel: noop
    };
  },
  computed: {
    bindings() {
      return { ...this.props, ...this.$attrs, key: this.k };
    }
  },
  watch: {
    componentName: 'load'
  },
  created() {
    this.load();
  },
  beforeUnmount() {
    this.cancel();
  },
  methods: {
    load() {
      this.cancel();

      this.component = null;
      this.showsLoading = !loadedAsync(this.componentName);
      let canceled = false;
      this.cancel = () => {
        canceled = true;
      };
      loadAsync(this.componentName)()
        /*
        A few things can happen between when the async component starts loading
        and when it finishes:

          - this.componentName can change. This often happens after a route
            change (though not always, especially for a component associated
            with a parent route).
          - this.componentName can change, then change back. In that case, there
            are multiple pending promises for the same async component, and they
            will each now be resolved (though all but the last have been
            canceled).
          - The AsyncRoute component may be unmounted.
        */
        .then(m => {
          if (!canceled) {
            this.showsLoading = false;
            this.component = markRaw(m.default);
          }
        })
        .catch(() => {
          if (!canceled) {
            this.alert.danger(this.$t('alert.loadError'))
              .cta(this.$t('action.refresh'), () => { this.location.reload(); });
            this.showsLoading = false;
          }
        });
    }
  }
};
</script>

<i18n lang="json5">
{
  "en": {
    "alert": {
      "loadError": "The page you requested could not be loaded. Please refresh the page and try again."
    }
  }
}
</i18n>

<i18n>
{
  "cs": {
    "alert": {
      "loadError": "Požadovanou stránku se nepodařilo načíst. Obnovte prosím stránku a zkuste to znovu."
    }
  },
  "de": {
    "alert": {
      "loadError": "Die Seite konnte nicht geladen werden. Bitte aktualisiere die Seite und versuche es erneut."
    }
  },
  "es": {
    "alert": {
      "loadError": "No se pudo cargar la página solicitada. Actualice la página y vuelva a intentarlo."
    }
  },
  "fr": {
    "alert": {
      "loadError": "La page demandée ne peut être chargée. Merci de rafraîchir la page et d'essayer à nouveau."
    }
  },
  "it": {
    "alert": {
      "loadError": "Impossibile caricare la pagina richiesta. Perfavore ricarica la pagina e riprova."
    }
  },
  "ja": {
    "alert": {
      "loadError": "リクエストされたページを読み込むことができませんでした。ページを更新して、もう一度試みて下さい。"
    }
  },
  "pt": {
    "alert": {
      "loadError": "A página que você solicitou não pode ser carregada. Por favor, atualize a página e tente novamente."
    }
  },
  "sw": {
    "alert": {
      "loadError": "ukurasa ulioomba haukuweza kupakiwa. Tafadhali onyesha upya ukurasa na ujaribu tena"
    }
  },
  "zh": {
    "alert": {
      "loadError": "无法加载您请求的页面。请刷新页面后重试。"
    }
  },
  "zh-Hant": {
    "alert": {
      "loadError": "無法載入您要求的頁面。請重新載入頁面並再試一次。"
    }
  }
}
</i18n>
