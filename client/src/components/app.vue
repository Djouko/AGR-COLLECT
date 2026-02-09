<template>
  <div :class="features">
    <navbar v-if="!standalone" v-show="routerReady"/>
    <outdated-version/>
    <alerts/>
    <feedback-button v-if="showsFeedbackButton"/>
    <div v-if="routerReady && !standalone" ref="containerEl" class="container-fluid">
      <router-view/>
    </div>
    <template v-else-if="standalone">
      <router-view/>
    </template>

    <div id="modals"></div>
    <div id="tooltips"></div>
    <hover-cards/>
  </div>
</template>

<script>
import { computed, defineAsyncComponent, inject, useTemplateRef } from 'vue';

import { START_LOCATION, useRouter, useRoute } from 'vue-router';

import Alerts from './alerts.vue';
import Navbar from './navbar.vue';

import useCallWait from '../composables/call-wait';
import useDisabled from '../composables/disabled';
import useFeatureFlags from '../composables/feature-flags';
import { loadAsync } from '../util/load-async';
import { useAlert } from '../alert';
import { useRequestData } from '../request-data';
import { useSessions } from '../util/session';

export default {
  name: 'App',
  components: {
    Alerts,
    HoverCards: defineAsyncComponent(loadAsync('HoverCards')),
    Navbar,
    FeedbackButton: defineAsyncComponent(loadAsync('FeedbackButton')),
    OutdatedVersion: defineAsyncComponent(loadAsync('OutdatedVersion'))
  },
  inject: ['alert', 'config', 'location'],
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { toast } = inject('container');

    const { visiblyLoggedIn } = useSessions();
    useDisabled();

    const containerEl = useTemplateRef('containerEl');
    useAlert(toast, containerEl);

    router.isReady()
      .then(() => {
        if (!route.meta.standalone)
          document.documentElement.style.backgroundColor = 'var(--color-accent-secondary)';
      });

    const standalone = computed(() => route.meta.standalone);
    const { features } = useFeatureFlags();

    const { centralVersion } = useRequestData();
    const { callWait } = useCallWait();
    return { visiblyLoggedIn, centralVersion, callWait, features, standalone };
  },
  computed: {
    routerReady() {
      return this.$route !== START_LOCATION;
    },
    showsFeedbackButton() {
      return this.config.loaded && this.config.showsFeedbackButton &&
        this.visiblyLoggedIn;
    },
  },
  created() {
    this.callWait('checkVersion', this.checkVersion, (tries) =>
      (tries === 0 ? 15000 : 60000));
  },
  beforeUnmount() {
    document.documentElement.style.backgroundColor = '';
  },
  methods: {
    checkVersion() {
      const previousVersion = this.centralVersion.versionText;
      return this.centralVersion.request({
        url: '/version.txt',
        clear: false,
        alert: false
      })
        .then(() => {
          if (previousVersion == null || this.centralVersion.versionText === previousVersion)
            return false;

          this.callWait(
            'versionChange',
            () => {
              this.alert.info(this.$t('alert.versionChange'))
                .cta(this.$t('action.refreshPage'), () => { this.location.reload(); });
            },
            (count) => (count === 0 ? 0 : 60000)
          );
          return true;
        })
        .catch(error =>
          (error.response != null && error.response.status === 404));
    }
  }
};
</script>
