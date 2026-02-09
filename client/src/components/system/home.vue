<template>
  <div>
    <page-head>
      <template #title>{{ $t('systemHome.title') }}</template>
      <template #tabs>
        <li :class="tabClass('audits')" role="presentation">
          <router-link :to="tabPath('audits')">
            {{ $t('systemHome.tab.audits') }}
          </router-link>
        </li>
        <!-- Analytics tab hidden for AGR-Collect -->
        <li v-if="false" :class="tabClass('analytics')"
          role="presentation">
          <router-link :to="tabPath('analytics')">
            {{ $t('systemHome.tab.analytics') }}
          </router-link>
        </li>
      </template>
    </page-head>
    <page-body>
      <router-view/>
    </page-body>
  </div>
</template>

<script setup>
import { inject } from 'vue';

import PageBody from '../page/body.vue';
import PageHead from '../page/head.vue';

import useTabs from '../../composables/tabs';

defineOptions({
  name: 'SystemHome'
});

const { tabPath, tabClass } = useTabs('/system');
const config = inject('config');
</script>
