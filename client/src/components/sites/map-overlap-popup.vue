<template>
  <map-popup v-show="sites != null && sites.length > 0" class="site-overlap-popup"
    @hide="$emit('hide')">
    <template #title>
      {{ sites ? sites.length : 0 }} {{ $t('sitesInArea') }}
    </template>
    <template #body>
      <div v-for="site in sites" :key="site.id" class="overlap-item" tabindex="0"
        @mouseenter="$emit('preview', site)"
        @mouseleave="$emit('preview', null)"
        @click="$emit('select', site)"
        @keydown.enter="$emit('select', site)">
        <div class="overlap-item-content">
          <span :class="['status-dot', 'status-' + site.status]"></span>
          <span class="site-name">{{ site.name }}</span>
        </div>
        <div><span class="icon-angle-right"></span></div>
      </div>
    </template>
  </map-popup>
</template>

<script>
import MapPopup from '../map/popup.vue';

export default {
  name: 'SiteMapOverlapPopup',
  components: { MapPopup },
  props: {
    sites: { type: Array, default: null }
  },
  emits: ['hide', 'preview', 'select']
};
</script>

<style lang="scss">
@import '../../assets/scss/mixins';

.site-overlap-popup {
  .overlap-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 16px;
    padding: 8px 6px;
    margin-inline: -6px;
    cursor: pointer;

    .overlap-item-content {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;

      &.status-active { background: #2e7d32; }
      &.status-inactive { background: #c62828; }
      &.status-pending { background: #f57c00; }
    }

    .site-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    > :last-child {
      color: #1c1b1f;
      flex-shrink: 0;
      font-size: 20px;
      padding-right: 3px;
    }

    &:hover, &:focus-within {
      background-color: $color-action-background;
      border-radius: 4px;

      &, & > :last-child, .site-name { color: #fff; }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "sitesInArea": "sites in this area"
  }
}
</i18n>

<i18n>
{
  "fr": {
    "sitesInArea": "sites dans cette zone"
  }
}
</i18n>
