<template>
  <ul id="navbar-links" class="nav navbar-nav">
    <li :class="{ active: projectsLinkIsActive }">
      <router-link to="/">
        {{ $t('resource.projects') }} <span class="sr-only">{{ $t('current') }}</span>
      </router-link>
    </li>
    <li v-if="canRoute('/users')" id="navbar-links-users"
      :class="{ active: routePathStartsWith('/users') }">
      <router-link to="/users">
        {{ $t('resource.users') }} <span class="sr-only">{{ $t('current') }}</span>
      </router-link>
    </li>
    <li v-if="canRoute('/system/audits')"
      :class="{ active: routePathStartsWith('/system') }">
      <router-link to="/system/audits">
        {{ $t('common.system') }} <span class="sr-only">{{ $t('current') }}</span>
      </router-link>
    </li>
    <li :class="{ active: routePathStartsWith('/reports') }">
      <router-link to="/reports">
        <span class="icon-bar-chart"></span> {{ $t('reports') }}
        <span class="sr-only">{{ $t('current') }}</span>
      </router-link>
    </li>
    <li :class="{ active: routePathStartsWith('/sites') }">
      <router-link to="/sites">
        <span class="icon-map-marker"></span> {{ $t('sites') }}
        <span class="sr-only">{{ $t('current') }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
import useRoutes from '../../composables/routes';

export default {
  name: 'NavbarLinks',
  setup() {
    const { canRoute } = useRoutes();
    return { canRoute };
  },
  computed: {
    projectsLinkIsActive() {
      return this.$route.path === '/' || this.routePathStartsWith('/projects');
    }
  },
  methods: {
    routePathStartsWith(path) {
      return this.$route.path === path ||
        this.$route.path.startsWith(`${path}/`);
    }
  }
};
</script>

<style lang="scss">
#navbar-links {
  .sr-only { display: none; }
  .active .sr-only { display: block; }

  > li > a {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.01em;
    transition: color 0.15s, background-color 0.15s;
    padding: 8px 14px;

    [class^="icon-"] {
      margin-right: 3px;
      font-size: 13px;
    }
  }

  > li.active > a {
    font-weight: 600;
  }
}

@media (min-width: 768px) {
  #navbar-links {
    margin-left: 30px;

    > li > a {
      padding: 0 14px;
      border-radius: 0;
    }

    > li + li { margin-left: 6px; }
    #navbar-links-users { margin-left: 30px; }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "current": "current",
    "reports": "Reports",
    "sites": "Sites"
  },
  "fr": {
    "current": "actuel",
    "reports": "Rapports",
    "sites": "Sites"
  }
}
</i18n>

<i18n>
{
  "cs": {
    "current": "stávající"
  },
  "de": {
    "current": "aktuell"
  },
  "es": {
    "current": "actual"
  },
  "fr": {
    "current": "actuel"
  },
  "id": {
    "current": "Sekarang ini"
  },
  "it": {
    "current": "attuale"
  },
  "ja": {
    "current": "現在"
  },
  "pt": {
    "current": "atual"
  },
  "sw": {
    "current": "sasa"
  },
  "zh": {
    "current": "当前"
  },
  "zh-Hant": {
    "current": "目前"
  }
}
</i18n>
