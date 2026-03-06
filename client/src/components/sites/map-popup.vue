<template>
  <map-popup v-show="site != null" id="site-map-popup" ref="popup"
    :back="fromOverlap" @hide="$emit('hide')" @back="$emit('back')">
    <template v-if="site" #title>
      <span :class="['status-dot', 'status-' + site.status]"></span>
      <span v-tooltip.text>{{ site.name }}</span>
    </template>
    <template #body>
      <div v-if="site">
        <dl>
          <div>
            <dt>{{ $t('project') }}</dt>
            <dd v-tooltip.text>{{ site.projectName }}</dd>
          </div>
          <div>
            <dt>{{ $t('status') }}</dt>
            <dd>
              <span :class="['status-badge', 'status-' + site.status]">
                {{ $t('statusLabel.' + site.status) }}
              </span>
            </dd>
          </div>
        </dl>
        <dl>
          <div v-if="site.placeName || site.coordinates">
            <dt>{{ $t('location') }}</dt>
            <dd v-tooltip.text>{{ site.placeName || formatCoords(site.coordinates) }}</dd>
          </div>
          <div v-if="site.region">
            <dt>{{ $t('region') }}</dt>
            <dd v-tooltip.text>{{ site.region }}</dd>
          </div>
          <div v-if="site.description">
            <dt>{{ $t('description') }}</dt>
            <dd class="description-text">{{ site.description }}</dd>
          </div>
          <div v-if="site.media">
            <dt>{{ $t('media') }}</dt>
            <dd>{{ site.media.length }} {{ $t('files') }}</dd>
          </div>
        </dl>
      </div>
    </template>
    <template #footer>
      <div v-if="site" class="popup-actions">
        <button type="button" class="btn btn-primary btn-sm" @click="$emit('view', site)">
          <span class="icon-eye"></span> {{ $t('viewDetails') }}
        </button>
        <button v-if="canEdit" type="button" class="btn btn-default btn-sm" @click="$emit('edit', site)">
          <span class="icon-pencil"></span> {{ $t('edit') }}
        </button>
      </div>
    </template>
  </map-popup>
</template>

<script>
import MapPopup from '../map/popup.vue';

export default {
  name: 'SiteMapPopup',
  components: { MapPopup },
  props: {
    site: { type: Object, default: null },
    fromOverlap: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false }
  },
  emits: ['hide', 'back', 'view', 'edit'],
  methods: {
    formatCoords(coords) {
      if (!coords) return '';
      const lat = parseFloat(coords.lat || coords.latitude || 0);
      const lng = parseFloat(coords.lng || coords.longitude || 0);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    },
    resetScroll() {
      if (this.$refs.popup) this.$refs.popup.resetScroll();
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#site-map-popup {
  .status-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
    flex-shrink: 0;

    &.status-active { background-color: #2e7d32; }
    &.status-inactive { background-color: #c62828; }
    &.status-pending { background-color: #f57c00; }
  }

  dl:first-of-type {
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
  }

  dl:last-of-type {
    padding-top: 12px;
  }

  .description-text {
    white-space: normal;
    line-height: 1.4;
    color: #6b7280;
  }

  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;

    &.status-active { background: #e8f5e9; color: #2e7d32; }
    &.status-inactive { background: #ffebee; color: #c62828; }
    &.status-pending { background: #fff3e0; color: #f57c00; }
  }

  .popup-actions {
    display: flex;
    gap: 8px;

    .btn { font-size: 12px; padding: 4px 10px; }
    .btn-primary { background: #2e7d32; border-color: #2e7d32; color: #fff; }
    .btn-primary:hover { background: #1b5e20; }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "project": "Project",
    "status": "Status",
    "location": "Location",
    "region": "Region",
    "description": "Description",
    "media": "Media",
    "files": "file(s)",
    "viewDetails": "View details",
    "edit": "Edit",
    "statusLabel": {
      "active": "Active",
      "inactive": "Inactive",
      "pending": "Pending"
    }
  }
}
</i18n>

<i18n>
{
  "fr": {
    "project": "Projet",
    "status": "Statut",
    "location": "Localisation",
    "region": "Région",
    "description": "Description",
    "media": "Médias",
    "files": "fichier(s)",
    "viewDetails": "Voir détails",
    "edit": "Modifier",
    "statusLabel": {
      "active": "Actif",
      "inactive": "Inactif",
      "pending": "En attente"
    }
  }
}
</i18n>
