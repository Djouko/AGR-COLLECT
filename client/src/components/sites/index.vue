<!--
AGR-Collect - Sites Management Component
Gestion complète des sites avec visualisation cartographique
-->
<template>
  <div id="sites-page" class="sites-container">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="icon-map-marker"></span>
          {{ $t('title') }}
        </h1>
        <p class="page-description">{{ $t('description') }}</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-primary" @click="showCreateModal = true" v-if="canCreateSite">
          <span class="icon-plus"></span>
          {{ $t('actions.addSite') }}
        </button>
      </div>
    </div>

    <div class="filters-section">
      <div class="filter-group">
        <label>{{ $t('filters.project') }}</label>
        <select v-model="selectedProject" @change="loadSites" class="form-control">
          <option value="">{{ $t('filters.allProjects') }}</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>{{ $t('filters.status') }}</label>
        <select v-model="selectedStatus" @change="filterSites" class="form-control">
          <option value="">{{ $t('filters.allStatuses') }}</option>
          <option value="active">{{ $t('status.active') }}</option>
          <option value="inactive">{{ $t('status.inactive') }}</option>
          <option value="pending">{{ $t('status.pending') }}</option>
        </select>
      </div>
      <div class="filter-group search-group">
        <label>{{ $t('filters.search') }}</label>
        <div class="search-input-wrapper">
          <input type="text" v-model="searchQuery" :placeholder="$t('filters.searchPlaceholder')" 
                 class="form-control" @input="onSearchInput" @focus="showSearchDropdown = true" @blur="hideSearchDropdownDelayed">
          <div v-if="showSearchDropdown && searchSuggestions.length > 0" class="search-dropdown">
            <div class="search-dropdown-header">
              <span>{{ searchSuggestions.length }} {{ $t('filters.sitesFound') }}</span>
            </div>
            <div class="search-dropdown-list">
              <div v-for="site in searchSuggestions" :key="site.id" class="search-dropdown-item" @mousedown.prevent="selectSearchSite(site)">
                <div class="search-item-main">
                  <span class="search-item-name">{{ site.name }}</span>
                  <span :class="['search-item-status', site.status]">{{ $t('status.' + site.status) }}</span>
                </div>
                <div class="search-item-details">
                  <span class="search-item-project">{{ site.projectName }}</span>
                  <span v-if="site.region" class="search-item-region">• {{ site.region }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"><span class="icon-map-marker"></span></div>
        <div class="stat-content">
          <div class="stat-value">{{ totalSites }}</div>
          <div class="stat-label">{{ $t('stats.totalSites') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="icon-check-circle"></span></div>
        <div class="stat-content">
          <div class="stat-value">{{ activeSites }}</div>
          <div class="stat-label">{{ $t('stats.activeSites') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon"><span class="icon-camera"></span></div>
        <div class="stat-content">
          <div class="stat-value">{{ totalMedia }}</div>
          <div class="stat-label">{{ $t('stats.mediaFiles') }}</div>
        </div>
      </div>
      <!-- submission count frame removed per client request -->
    </div>

    <div class="view-toggle">
      <button :class="['toggle-btn', { active: viewMode === 'map' }]" @click="viewMode = 'map'">
        <span class="icon-map"></span> {{ $t('view.map') }}
      </button>
      <button :class="['toggle-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
        <span class="icon-list"></span> {{ $t('view.list') }}
      </button>
      <button :class="['toggle-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">
        <span class="icon-th"></span> {{ $t('view.grid') }}
      </button>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ $t('loading') }}</p>
    </div>

    <div v-else-if="viewMode === 'map'" class="map-section" ref="mapSectionEl">
      <geojson-map ref="geojsonMap" :data="sitesGeoJson" :sizer="mapSizer"
        @selection-changed="onMapSelectionChanged" @hit="onMapHit"/>
      <map-popup v-show="mapSelectedSite != null" ref="sitePopup"
        :back="mapOverlap != null && mapOverlap.length > 1" @hide="hideMapPopup" @back="backToOverlap">
        <template #title>
          <span>{{ mapSelectedSite?.name }}</span>
        </template>
        <template #body>
          <dl v-if="mapSelectedSite">
            <div>
              <dt>{{ $t('detail.project') }}</dt>
              <dd>{{ mapSelectedSite.projectName }}</dd>
            </div>
            <div>
              <dt>{{ $t('detail.status') }}</dt>
              <dd>
                <span :class="['status-badge', 'status-' + mapSelectedSite.status]">
                  {{ $t('status.' + mapSelectedSite.status) }}
                </span>
              </dd>
            </div>
            <div v-if="mapSelectedSite.placeName || mapSelectedSite.coordinates">
              <dt>{{ $t('detail.location') }}</dt>
              <dd>{{ mapSelectedSite.placeName || formatSiteCoords(mapSelectedSite.coordinates) }}</dd>
            </div>
            <div v-if="mapSelectedSite.description">
              <dt>{{ $t('detail.description') }}</dt>
              <dd>{{ mapSelectedSite.description }}</dd>
            </div>
          </dl>
        </template>
        <template #footer>
          <button class="btn btn-primary btn-sm" @click="viewSiteFromMap">
            <span class="icon-eye"></span> {{ $t('actions.view') }}
          </button>
        </template>
      </map-popup>
      <map-popup v-show="mapSelectedSite == null && mapOverlapSites != null"
        @hide="hideMapPopup">
        <template #title>{{ mapOverlapSites ? mapOverlapSites.length : 0 }} {{ $t('overlap.sitesHere') }}</template>
        <template #body>
          <div v-for="os in mapOverlapSites" :key="os.id" class="overlap-item"
            tabindex="0"
            @click="onOverlapSelect(os)" @keydown.enter="onOverlapSelect(os)"
            @mouseenter="onOverlapPreview(os)" @focus="onOverlapPreview(os)"
            @mouseleave="onOverlapPreview(null)" @blur="onOverlapPreview(null)">
            <div class="overlap-item-info">
              <span :class="['legend-dot', os.status]"></span>
              <span>{{ os.name }}</span>
            </div>
            <span class="icon-angle-right"></span>
          </div>
        </template>
      </map-popup>
      <div class="map-legend">
        <div class="legend-item">
          <span class="legend-dot active"></span> {{ $t('status.active') }}
        </div>
        <div class="legend-item">
          <span class="legend-dot inactive"></span> {{ $t('status.inactive') }}
        </div>
        <div class="legend-item">
          <span class="legend-dot pending"></span> {{ $t('status.pending') }}
        </div>
      </div>
    </div>

    <div v-else-if="viewMode === 'list'" class="list-section">
      <div class="sites-table-container">
        <table class="sites-table">
          <thead>
            <tr>
              <th>{{ $t('table.name') }}</th>
              <th>{{ $t('table.project') }}</th>
              <th>{{ $t('table.location') }}</th>
              <th>{{ $t('table.status') }}</th>
              <th>{{ $t('table.lastActivity') }}</th>
              <th>{{ $t('table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="site in filteredSites" :key="site.id" @click="selectSite(site)">
              <td class="site-name">
                <span class="icon-map-marker"></span>
                {{ site.name }}
              </td>
              <td>{{ site.projectName }}</td>
              <td class="location-cell">
                <span v-if="site.coordinates && site.placeName">
                  📍 {{ site.placeName }}
                </span>
                <span v-else-if="site.coordinates">
                  📍 {{ formatSiteCoords(site.coordinates) }}
                </span>
                <span v-else class="no-location">{{ $t('noLocation') }}</span>
              </td>
              <td>
                <span :class="['status-badge', 'status-' + site.status]">
                  {{ $t('status.' + site.status) }}
                </span>
              </td>
              <td>{{ formatDate(site.lastActivity) }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-view" @click.stop="viewSite(site)" :title="$t('actions.view')">
                  <span class="icon-eye"></span>
                </button>
                <button class="btn-icon btn-edit" @click.stop="editSite(site)" :title="$t('actions.edit')" v-if="canEditSite">
                  <span class="icon-pencil"></span>
                </button>
                <button class="btn-icon btn-delete" @click.stop="deleteSite(site)" :title="$t('actions.delete')" v-if="canDeleteSite && !site.isDemo">
                  <span class="icon-trash"></span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="filteredSites.length === 0" class="no-data">
          <span class="icon-map-marker"></span>
          <p>{{ $t('noSites') }}</p>
        </div>
      </div>
    </div>

    <div v-else class="grid-section">
      <div class="sites-grid">
        <div v-for="site in filteredSites" :key="site.id" class="site-card" @click="selectSite(site)">
          <div class="site-card-image">
            <img v-if="getSiteThumbnail(site)" :src="getSiteThumbnail(site)" :alt="site.name" class="site-thumbnail">
            <div v-else class="no-image">
              <div class="placeholder-content">
                <span class="icon-map-marker placeholder-icon"></span>
                <span class="placeholder-text">{{ site.name.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <span :class="['status-indicator', 'status-' + site.status]"></span>
          </div>
          <div class="site-card-content">
            <h3 class="site-card-title">{{ site.name }}</h3>
            <p class="site-card-project">{{ getProjectName(site.projectId) }}</p>
            <div class="site-card-meta">
              <span v-if="site.coordinates" class="meta-item location">
                <span class="icon-map-marker"></span> {{ site.region || formatSiteCoords(site.coordinates) }}
              </span>
              <span class="meta-item">
                <span class="icon-file-text"></span> {{ (site.media && site.media.length) || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredSites.length === 0" class="no-data">
        <span class="icon-map-marker"></span>
        <p>{{ $t('noSites') }}</p>
      </div>
    </div>

    <div v-if="selectedSite" class="modal-overlay" @click.self="selectedSite = null">
      <div class="site-detail-modal">
        <div class="modal-header">
          <h2>{{ selectedSite.name }}</h2>
          <div class="header-actions-group">
            <button class="btn btn-sm btn-edit-header" @click="editSite(selectedSite)" v-if="canEditSite">
              <span class="icon-pencil"></span> {{ $t('actions.edit') }}
            </button>
            <button class="btn btn-sm btn-delete-header" @click="deleteSite(selectedSite)" v-if="canDeleteSite && !selectedSite.isDemo">
              <span class="icon-trash"></span> {{ $t('actions.delete') }}
            </button>
            <button class="close-btn" @click="selectedSite = null">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3><span class="icon-info-circle"></span> {{ $t('detail.info') }}</h3>
            <div class="info-grid">
              <div class="info-item">
                <label>{{ $t('detail.project') }}</label>
                <span>{{ selectedSite.projectName }}</span>
              </div>
              <div class="info-item">
                <label>{{ $t('detail.status') }}</label>
                <span :class="['status-badge', 'status-' + selectedSite.status]">
                  {{ $t('status.' + selectedSite.status) }}
                </span>
              </div>
              <div class="info-item">
                <label>{{ $t('detail.createdAt') }}</label>
                <span>{{ formatDate(selectedSite.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>{{ $t('detail.lastActivity') }}</label>
                <span>{{ formatDate(selectedSite.lastActivity) }}</span>
              </div>
            </div>
            <div v-if="selectedSite.description" class="description">
              <label>{{ $t('detail.description') }}</label>
              <p>{{ selectedSite.description }}</p>
            </div>
          </div>

          <div class="detail-section" v-if="selectedSite.coordinates">
            <h3><span class="icon-map-marker"></span> {{ $t('detail.location') }}</h3>
            <div class="detail-map-wrapper">
              <geojson-map :data="detailSiteGeoJson" :sizer="detailMapSizer"/>
            </div>
            <div class="coordinates-display">
              <span v-if="selectedSite.placeName"><strong>📍</strong> {{ selectedSite.placeName }}</span>
              <span v-else>📍 {{ formatSiteCoords(selectedSite.coordinates) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-header-with-action">
              <h3><span class="icon-camera"></span> {{ $t('detail.media') }} ({{ selectedSite.media?.length || 0 }})</h3>
              <button class="btn btn-sm btn-add-media" @click="showMediaUpload = true" v-if="canEditSite && !selectedSite.isDemo">
                <span class="icon-plus"></span> {{ $t('media.add') }}
              </button>
            </div>
            <div v-if="selectedSite.media && selectedSite.media.length > 0" class="media-gallery">
              <div v-for="(media, index) in selectedSite.media" :key="index" class="media-item">
                <img v-if="media.type === 'image'" :src="media.blobUrl || media.thumbnail || media.url" :alt="media.name" @click="openMediaViewer(media, index)">
                <div v-else class="video-thumbnail" @click="openMediaViewer(media, index)">
                  <span class="icon-play-circle"></span>
                  <span class="video-label">{{ $t('detail.video') }}</span>
                </div>
                <button class="media-delete-btn" @click.stop="deleteMedia(media)" v-if="canEditSite && !selectedSite.isDemo" :title="$t('media.delete')">
                  <span class="icon-trash"></span>
                </button>
              </div>
            </div>
            <div v-else class="no-media-placeholder">
              <span class="icon-camera"></span>
              <p>{{ $t('media.noMedia') }}</p>
              <button class="btn btn-primary btn-sm" @click="showMediaUpload = true" v-if="canEditSite && !selectedSite.isDemo">
                <span class="icon-plus"></span> {{ $t('media.addFirst') }}
              </button>
            </div>
          </div>

          <!-- Submissions section removed per client request -->
        </div>
      </div>
    </div>

    <div v-if="viewingMedia" class="media-viewer-overlay" @click.self="closeMediaViewer">
      <div class="media-viewer">
        <button class="close-btn" @click="closeMediaViewer">&times;</button>
        
        <button v-if="selectedSite?.media?.length > 1" class="nav-btn nav-prev" @click.stop="prevMedia" title="Précédent (←)">
          <span class="icon-angle-left"></span>
        </button>
        <button v-if="selectedSite?.media?.length > 1" class="nav-btn nav-next" @click.stop="nextMedia" title="Suivant (→)">
          <span class="icon-angle-right"></span>
        </button>
        
        <div class="media-content" @wheel.prevent="handleImageWheel" @mousedown="startImageDrag" @mousemove="handleImageDrag" @mouseup="stopImageDrag" @mouseleave="stopImageDrag">
          <img 
            v-if="viewingMedia.type === 'image'" 
            :src="viewingMedia.blobUrl || viewingMedia.url" 
            :alt="viewingMedia.name" 
            class="media-image"
            :class="{ 'is-zoomed': imageZoom > 1, 'is-dragging': isDragging }"
            :style="imageTransformStyle"
            @dblclick="toggleZoom"
          >
          <video 
            v-else 
            ref="mediaVideo"
            controls 
            autoplay 
            class="media-video" 
            :key="viewingMedia.id"
            controlsList="nodownload"
            preload="metadata"
          >
            <source :src="viewingMedia.blobUrl || viewingMedia.url" :type="viewingMedia.mimeType || 'video/mp4'">
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
        
        <div v-if="viewingMedia.type === 'image'" class="zoom-controls">
          <button @click="zoomOut" :disabled="imageZoom <= 0.5" class="zoom-btn" title="Zoom arrière (-)">
            −
          </button>
          <span class="zoom-level">{{ Math.round(imageZoom * 100) }}%</span>
          <button @click="zoomIn" :disabled="imageZoom >= 4" class="zoom-btn" title="Zoom avant (+)">
            +
          </button>
          <button @click="resetZoom" class="zoom-btn zoom-reset" title="Réinitialiser (0)">
            <span class="icon-refresh"></span>
          </button>
        </div>
        
        <div class="media-info-bar">
          <div class="media-info-left">
            <span class="media-name">{{ viewingMedia.name }}</span>
            <span v-if="viewingMedia.createdAt" class="media-date">{{ formatDateTime(viewingMedia.createdAt) }}</span>
          </div>
          <div class="media-info-right">
            <span class="media-counter" v-if="selectedSite?.media?.length > 1">
              {{ viewingMediaIndex + 1 }} / {{ selectedSite.media.length }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showMediaUpload" class="modal-overlay" @click.self="showMediaUpload = false">
      <div class="media-upload-modal">
        <div class="modal-header">
          <h2>{{ $t('media.uploadTitle') }}</h2>
          <button class="close-btn" @click="showMediaUpload = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="upload-zone" @drop.prevent="handleFileDrop" @dragover.prevent @dragenter.prevent>
            <input type="file" ref="fileInput" @change="handleFileSelect" multiple accept="image/*,video/*" class="file-input">
            <div class="upload-content" @click="$refs.fileInput.click()">
              <span class="icon-cloud-upload upload-icon"></span>
              <p class="upload-text">{{ $t('media.dropFiles') }}</p>
              <p class="upload-hint">{{ $t('media.supportedFormats') }}</p>
            </div>
          </div>
          <div v-if="selectedFiles.length > 0" class="selected-files">
            <h4>{{ $t('media.selectedFiles') }} ({{ selectedFiles.length }})</h4>
            <div class="file-list">
              <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
                <span class="file-icon">{{ file.type.startsWith('image') ? '🖼️' : '🎬' }}</span>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ formatFileSize(file.size) }}</span>
                <button class="btn-remove-file" @click="removeSelectedFile(index)">&times;</button>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="showMediaUpload = false">
              {{ $t('modal.cancel') }}
            </button>
            <button type="button" class="btn btn-primary" @click="uploadMedia" :disabled="uploadingMedia || selectedFiles.length === 0">
              <span v-if="uploadingMedia" class="spinner-small"></span>
              {{ $t('media.upload') }} ({{ selectedFiles.length }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="site-create-modal">
        <div class="modal-header">
          <h2>{{ editingSite ? $t('modal.editTitle') : $t('modal.createTitle') }}</h2>
          <button class="close-btn" @click="closeCreateModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveSite">
            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('modal.project') }} *</label>
                <select v-model="siteForm.projectId" class="form-control" required>
                  <option value="">{{ $t('modal.selectProject') }}</option>
                  <option v-for="project in projects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('modal.status') }}</label>
                <select v-model="siteForm.status" class="form-control">
                  <option value="active">{{ $t('status.active') }}</option>
                  <option value="pending">{{ $t('status.pending') }}</option>
                  <option value="inactive">{{ $t('status.inactive') }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>{{ $t('modal.name') }} *</label>
              <input type="text" v-model="siteForm.name" class="form-control" required 
                     :placeholder="$t('modal.namePlaceholder')">
            </div>
            <div class="form-group">
              <label>{{ $t('modal.description') }}</label>
              <textarea v-model="siteForm.description" class="form-control" rows="3"
                        :placeholder="$t('modal.descriptionPlaceholder')"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('modal.latitude') }}</label>
                <input type="number" step="any" v-model="siteForm.latitude" class="form-control" 
                       placeholder="5.3456">
              </div>
              <div class="form-group">
                <label>{{ $t('modal.longitude') }}</label>
                <input type="number" step="any" v-model="siteForm.longitude" class="form-control" 
                       placeholder="-3.9876">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('modal.region') }}</label>
                <input type="text" v-model="siteForm.region" class="form-control" 
                       :placeholder="$t('modal.regionPlaceholder')">
              </div>
              <div class="form-group">
                <label>{{ $t('modal.address') }}</label>
                <input type="text" v-model="siteForm.address" class="form-control" 
                       :placeholder="$t('modal.addressPlaceholder')">
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeCreateModal">
                {{ $t('modal.cancel') }}
              </button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving" class="spinner-small"></span>
                {{ editingSite ? $t('modal.update') : $t('modal.create') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import useRequest from '../../composables/request';
import { apiPaths } from '../../util/request';
import { loadAsync } from '../../util/load-async';
import MapPopup from '../map/popup.vue';
import { formatCoords, getCachedPlaceName, reverseGeocode } from '../../util/reverse-geocode';

export default {
  name: 'SitesIndex',
  
  components: {
    GeojsonMap: defineAsyncComponent(loadAsync('GeojsonMap')),
    MapPopup
  },
  
  inject: ['container'],
  
  setup() {
    const { request, awaitingResponse } = useRequest();
    return { request, awaitingResponse };
  },
  
  data() {
    return {
      loading: true,
      saving: false,
      projects: [],
      sites: [],
      filteredSites: [],
      selectedProject: '',
      selectedStatus: '',
      searchQuery: '',
      viewMode: 'map',
      selectedSite: null,
      viewingMedia: null,
      viewingMediaIndex: -1,
      mediaObjectUrls: {},
      imageZoom: 1,
      imagePosition: { x: 0, y: 0 },
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      showSearchDropdown: false,
      searchDropdownTimeout: null,
      showCreateModal: false,
      showMediaUpload: false,
      uploadingMedia: false,
      selectedFiles: [],
      editingSite: null,
      siteForm: {
        projectId: '',
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        altitude: '',
        region: '',
        address: '',
        status: 'active'
      },
      mapSelection: null,
      mapOverlap: null,
      mapSelectedFromOverlap: false,
      currentUser: null,
      userRoles: []
    };
  },

  computed: {
    totalSites() {
      return this.sites.length;
    },
    activeSites() {
      return this.sites.filter(s => s.status === 'active').length;
    },
    totalMedia() {
      return this.sites.reduce((sum, s) => sum + (s.media?.length || 0), 0);
    },
    totalSubmissions() {
      return this.sites.reduce((sum, s) => sum + (s.submissionsCount || 0), 0);
    },
    canCreateSite() {
      return !this.isOnlyViewer;
    },
    canEditSite() {
      return !this.isOnlyViewer;
    },
    canDeleteSite() {
      return !this.isOnlyViewer;
    },
    isOnlyViewer() {
      
      if (!this.userRoles || this.userRoles.length === 0) return false;
      
      const hasAdminOrManager = this.userRoles.some(r => 
        r.system === 'admin' || r.system === 'manager'
      );
      if (hasAdminOrManager) return false;
      
      const hasViewerRole = this.userRoles.some(r => r.system === 'viewer');
      return hasViewerRole;
    },
    searchSuggestions() {
      if (!this.searchQuery || this.searchQuery.length < 1) return [];
      const query = this.searchQuery.toLowerCase();
      let result = [...this.sites];
      
      if (this.selectedProject) {
        result = result.filter(s => s.projectId === parseInt(this.selectedProject));
      }
      
      if (this.selectedStatus) {
        result = result.filter(s => s.status === this.selectedStatus);
      }
      
      result = result.filter(s => 
        s.name.toLowerCase().includes(query) ||
        (s.description && s.description.toLowerCase().includes(query)) ||
        (s.region && s.region.toLowerCase().includes(query))
      );
      
      return result.slice(0, 10);
    },
    imageTransformStyle() {
      return {
        transform: `translate(${this.imagePosition.x}px, ${this.imagePosition.y}px) scale(${this.imageZoom})`,
        transition: this.isDragging ? 'none' : 'transform 0.15s ease-out',
        willChange: 'transform',
        transformOrigin: 'center center'
      };
    },
    sitesGeoJson() {
      const features = this.filteredSites
        .filter(s => s.coordinates)
        .map(s => ({
          type: 'Feature',
          id: String(s.id),
          geometry: {
            type: 'Point',
            coordinates: [s.coordinates.lng, s.coordinates.lat]
          },
          properties: {
            name: s.name,
            status: s.status,
            projectName: s.projectName,
            siteId: s.id
          }
        }));
      if (features.length === 0) return null;
      return { type: 'FeatureCollection', features };
    },
    mapSelectedSite() {
      if (!this.mapSelection) return null;
      const id = this.mapSelection.id;
      return this.sites.find(s => String(s.id) === String(id)) || null;
    },
    mapOverlapSites() {
      if (!this.mapOverlap || this.mapOverlap.length < 2) return null;
      return this.mapOverlap.map(f => {
        const id = f.id;
        return this.sites.find(s => String(s.id) === String(id));
      }).filter(Boolean);
    },
    detailSiteGeoJson() {
      if (!this.selectedSite?.coordinates) return null;
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          id: String(this.selectedSite.id),
          geometry: {
            type: 'Point',
            coordinates: [this.selectedSite.coordinates.lng, this.selectedSite.coordinates.lat]
          },
          properties: {
            name: this.selectedSite.name,
            status: this.selectedSite.status
          }
        }]
      };
    },
  },

  async mounted() {
    await this.loadCurrentUser();
    await this.loadProjects();
    await this.loadSites();
  },

  beforeUnmount() {
    Object.values(this.mediaObjectUrls).forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    document.removeEventListener('keydown', this.handleMediaKeydown);
  },

  watch: {
  },

  methods: {

    async loadCurrentUser() {
      try {
        const userRes = await this.request.get('/v1/users/current');
        this.currentUser = userRes.data;
        
        const projectsRes = await this.request.get('/v1/projects?extended=true');
        const projects = projectsRes.data || [];
        
        let allVerbs = [];
        for (const project of projects) {
          if (project.verbs && project.verbs.length > 0) {
            allVerbs = allVerbs.concat(project.verbs);
          }
        }
        allVerbs = [...new Set(allVerbs)];
        console.log('User verbs from projects:', allVerbs.length, allVerbs.slice(0, 10));
        
        const siteWriteVerbs = ['site.create', 'site.update', 'site.delete'];
        const generalWriteVerbs = ['form.create', 'form.update', 'submission.create', 'assignment.create'];
        
        const hasSiteWritePermissions = allVerbs.some(v => siteWriteVerbs.includes(v));
        const hasGeneralWritePermissions = allVerbs.some(v => generalWriteVerbs.includes(v));
        
        console.log('Site write permissions:', hasSiteWritePermissions);
        console.log('General write permissions:', hasGeneralWritePermissions);
        
        if (hasSiteWritePermissions || hasGeneralWritePermissions) {
          this.userRoles = [{ system: 'admin' }];
          console.log('User has write permissions (admin/manager)');
        } else {
          this.userRoles = [{ system: 'viewer' }];
          console.log('User is viewer (read-only access)');
        }
      } catch (e) {
        console.error('Error loading current user:', e);
        this.userRoles = [];
      }
    },

    async loadProjects() {
      try {
        const res = await this.request.get(apiPaths.projects());
        this.projects = res.data || [];
      } catch (e) {
        console.error('Error loading projects:', e);
        this.projects = [];
      }
    },

    async loadSites() {
      this.loading = true;
      try {
        let url = '/v1/sites';
        if (this.selectedProject) {
          url = `/v1/projects/${this.selectedProject}/sites`;
        }
        
        const res = await this.request.get(url);
        let sites = res.data || [];
        
        for (const site of sites) {
          try {
            const mediaRes = await this.request.get(apiPaths.siteMedia(site.id));
            const mediaList = mediaRes.data || [];
            
            site.media = await Promise.all(mediaList.map(async (m) => {
              const mediaUrl = apiPaths.siteMediaContent(site.id, m.id);
              let blobUrl = null;
              
              try {
                const blobRes = await this.request.get(mediaUrl, { responseType: 'blob' });
                if (blobRes.data) {
                  blobUrl = URL.createObjectURL(blobRes.data);
                  this.mediaObjectUrls[`${site.id}-${m.id}`] = blobUrl;
                }
              } catch (err) {
                console.warn(`Failed to load media ${m.id}:`, err);
              }
              
              return {
                ...m,
                url: mediaUrl,
                blobUrl: blobUrl,
                thumbnail: blobUrl || mediaUrl
              };
            }));
          } catch (e) {
            site.media = [];
          }
        }
        
        sites = sites.map(site => ({
          ...site,
          coordinates: site.latitude && site.longitude ? {
            lat: parseFloat(site.latitude),
            lng: parseFloat(site.longitude)
          } : null,
          placeName: null,
          projectName: this.projects.find(p => p.id === site.projectId)?.name || `Projet ${site.projectId}`,
          media: site.media || [],
          submissions: site.submissions || []
        }));
        
        // Resolve place names from cache immediately
        sites.forEach(site => {
          if (site.coordinates) {
            const cached = getCachedPlaceName(site.coordinates.lat, site.coordinates.lng);
            if (cached) site.placeName = cached;
          }
        });
        
        if (sites.length === 0) {
          sites = await this.generateDemoSites();
        }
        
        this.sites = sites;
        this.filterSites();
        
        // Async resolve uncached place names
        this.resolveAllPlaceNames();
      } catch (e) {
        console.error('Error loading sites from API, falling back to demo:', e);
        this.sites = await this.generateDemoSites();
        this.filterSites();
      } finally {
        this.loading = false;
      }
    },

    async generateDemoSites() {
      const sites = [];
      for (const project of this.projects) {
        if (this.selectedProject && project.id !== parseInt(this.selectedProject)) continue;
        
        try {
          const formsRes = await this.request.get(apiPaths.forms(project.id));
          const forms = formsRes.data || [];
          
          for (const form of forms) {
            try {
              const subsRes = await this.request.get(
                apiPaths.submissions(project.id, form.xmlFormId, false, '')
              );
              const submissions = subsRes.data || [];
              
              const locationGroups = {};
              submissions.forEach(sub => {
                const lat = sub.geopoint?.lat || (5.3 + Math.random() * 2);
                const lng = sub.geopoint?.lng || (-3.9 + Math.random() * 2);
                const key = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
                
                if (!locationGroups[key]) {
                  locationGroups[key] = {
                    id: `demo_${project.id}_${form.xmlFormId}_${Object.keys(locationGroups).length}`,
                    name: `Site ${form.name || form.xmlFormId} #${Object.keys(locationGroups).length + 1}`,
                    projectId: project.id,
                    projectName: project.name,
                    coordinates: { lat, lng },
                    status: sub.reviewState === 'approved' ? 'active' : 
                            sub.reviewState === 'rejected' ? 'inactive' : 'pending',
                    submissionsCount: 0,
                    submissions: [],
                    media: [],
                    createdAt: sub.createdAt,
                    lastActivity: sub.createdAt,
                    description: `Site de collecte pour ${form.name || form.xmlFormId}`,
                    isDemo: true
                  };
                }
                
                locationGroups[key].submissionsCount++;
                locationGroups[key].submissions.push({
                  instanceId: sub.instanceId,
                  formName: form.name || form.xmlFormId,
                  createdAt: sub.createdAt,
                  reviewState: sub.reviewState || 'pending'
                });
                
                if (new Date(sub.createdAt) > new Date(locationGroups[key].lastActivity)) {
                  locationGroups[key].lastActivity = sub.createdAt;
                }
              });
              
              sites.push(...Object.values(locationGroups));
            } catch (e) {
              console.error('Error loading submissions for form:', form.xmlFormId, e);
            }
          }
        } catch (e) {
          console.error('Error loading forms for project:', project.id, e);
        }
      }
      return sites;
    },

    filterSites() {
      let result = [...this.sites];
      
      if (this.selectedProject) {
        result = result.filter(s => s.projectId === parseInt(this.selectedProject));
      }
      
      if (this.selectedStatus) {
        result = result.filter(s => s.status === this.selectedStatus);
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(s => 
          s.name.toLowerCase().includes(query) ||
          s.projectName.toLowerCase().includes(query) ||
          (s.description && s.description.toLowerCase().includes(query)) ||
          (s.region && s.region.toLowerCase().includes(query))
        );
      }
      
      this.filteredSites = result;
    },

    onSearchInput() {
      this.showSearchDropdown = true;
      this.filterSites();
    },

    hideSearchDropdownDelayed() {
      this.searchDropdownTimeout = setTimeout(() => {
        this.showSearchDropdown = false;
      }, 200);
    },

    selectSearchSite(site) {
      if (this.searchDropdownTimeout) {
        clearTimeout(this.searchDropdownTimeout);
      }
      this.showSearchDropdown = false;
      this.searchQuery = site.name;
      this.filterSites();
      if (this.viewMode === 'map' && this.$refs.geojsonMap) {
        this.$refs.geojsonMap.selectFeature(String(site.id));
      } else {
        this.selectSite(site);
      }
    },

    mapSizer() {
      const el = this.$refs.mapSectionEl;
      if (!el) return 500;
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) return 500;
      return Math.max(500, document.documentElement.clientHeight - rect.top - 20);
    },

    onMapSelectionChanged(feature) {
      this.mapSelection = feature;
      if (feature != null && !this.mapSelectedFromOverlap) {
        this.mapOverlap = null;
      }
      this.mapSelectedFromOverlap = false;
    },

    onMapHit(hits) {
      if (hits.length > 1) {
        this.mapOverlap = hits;
      } else if (hits.length <= 1) {
        this.mapOverlap = null;
      }
    },

    hideMapPopup() {
      if (this.$refs.geojsonMap) {
        this.$refs.geojsonMap.selectFeature(null);
      }
      this.mapSelection = null;
      this.mapOverlap = null;
    },

    backToOverlap() {
      if (this.$refs.geojsonMap) {
        this.$refs.geojsonMap.selectFeature(null);
      }
      this.mapSelection = null;
    },

    onOverlapPreview(site) {
      if (!this.$refs.geojsonMap) return;
      if (site != null) {
        this.$refs.geojsonMap.selectFeature(String(site.id), false);
      } else {
        this.$refs.geojsonMap.selectFeature(null, false);
      }
    },

    onOverlapSelect(site) {
      this.mapSelectedFromOverlap = true;
      if (this.$refs.geojsonMap) {
        this.$refs.geojsonMap.selectFeature(String(site.id), false);
      }
      this.mapSelection = { id: String(site.id), properties: { name: site.name, status: site.status } };
    },

    viewSiteFromMap() {
      if (this.mapSelectedSite) {
        this.selectSite(this.mapSelectedSite);
      }
    },

    detailMapSizer() {
      return 250;
    },

    selectSite(site) {
      this.selectedSite = site;
    },

    viewSite(site) {
      this.selectedSite = site;
    },

    editSite(site) {
      this.editingSite = site;
      this.siteForm = {
        projectId: site.projectId,
        name: site.name,
        description: site.description || '',
        latitude: site.coordinates?.lat || site.latitude || '',
        longitude: site.coordinates?.lng || site.longitude || '',
        altitude: site.altitude || '',
        region: site.region || '',
        address: site.address || '',
        status: site.status || 'active'
      };
      this.showCreateModal = true;
    },

    closeCreateModal() {
      this.showCreateModal = false;
      this.editingSite = null;
      this.siteForm = {
        projectId: '',
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        altitude: '',
        region: '',
        address: '',
        status: 'active'
      };
    },

    async saveSite() {
      if (!this.siteForm.projectId || !this.siteForm.name) {
        alert(this.$t('modal.requiredFields'));
        return;
      }

      this.saving = true;
      try {
        const payload = {
          projectId: parseInt(this.siteForm.projectId),
          name: this.siteForm.name,
          description: this.siteForm.description || null,
          latitude: this.siteForm.latitude ? parseFloat(this.siteForm.latitude) : null,
          longitude: this.siteForm.longitude ? parseFloat(this.siteForm.longitude) : null,
          altitude: this.siteForm.altitude ? parseFloat(this.siteForm.altitude) : null,
          region: this.siteForm.region || null,
          address: this.siteForm.address || null,
          status: this.siteForm.status
        };

        if (this.editingSite && !this.editingSite.isDemo) {
          await this.request.patch(apiPaths.site(this.editingSite.id), payload);
        } else {
          await this.request.post(apiPaths.projectSites(payload.projectId), payload);
        }

        this.closeCreateModal();
        await this.loadSites();
      } catch (e) {
        console.error('Error saving site:', e);
        alert(this.$t('modal.saveError'));
      } finally {
        this.saving = false;
      }
    },

    async deleteSite(site) {
      if (site.isDemo) {
        alert(this.$t('modal.cannotDeleteDemo'));
        return;
      }
      if (!confirm(this.$t('modal.confirmDelete'))) return;
      
      try {
        await this.request.delete(apiPaths.site(site.id));
        this.selectedSite = null;
        await this.loadSites();
      } catch (e) {
        console.error('Error deleting site:', e);
        alert(this.$t('modal.deleteError'));
      }
    },

    openMediaViewer(media, index = -1) {
      if (index === -1 && this.selectedSite?.media) {
        index = this.selectedSite.media.findIndex(m => m.id === media.id);
      }
      this.viewingMediaIndex = index;
      this.viewingMedia = media;
      document.addEventListener('keydown', this.handleMediaKeydown);
    },

    closeMediaViewer() {
      this.viewingMedia = null;
      this.viewingMediaIndex = -1;
      document.removeEventListener('keydown', this.handleMediaKeydown);
    },

    handleMediaKeydown(e) {
      if (!this.viewingMedia) return;
      if (e.key === 'Escape') {
        this.closeMediaViewer();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        this.nextMedia();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        this.prevMedia();
      } else if (e.key === '+' || e.key === '=') {
        this.zoomIn();
      } else if (e.key === '-') {
        this.zoomOut();
      } else if (e.key === '0') {
        this.resetZoom();
      }
    },

    nextMedia() {
      if (!this.selectedSite?.media || this.selectedSite.media.length === 0) return;
      const newIndex = (this.viewingMediaIndex + 1) % this.selectedSite.media.length;
      this.viewingMediaIndex = newIndex;
      this.viewingMedia = this.selectedSite.media[newIndex];
      this.resetZoom();
    },

    prevMedia() {
      if (!this.selectedSite?.media || this.selectedSite.media.length === 0) return;
      const newIndex = (this.viewingMediaIndex - 1 + this.selectedSite.media.length) % this.selectedSite.media.length;
      this.viewingMediaIndex = newIndex;
      this.viewingMedia = this.selectedSite.media[newIndex];
      this.resetZoom();
    },

    zoomIn() {
      if (this.imageZoom < 4) {
        this.imageZoom = Math.min(4, this.imageZoom + 0.25);
      }
    },

    zoomOut() {
      if (this.imageZoom > 0.5) {
        this.imageZoom = Math.max(0.5, this.imageZoom - 0.25);
        if (this.imageZoom <= 1) {
          this.imagePosition = { x: 0, y: 0 };
        }
      }
    },

    resetZoom() {
      this.imageZoom = 1;
      this.imagePosition = { x: 0, y: 0 };
    },

    toggleZoom() {
      if (this.imageZoom === 1) {
        this.imageZoom = 2;
      } else {
        this.resetZoom();
      }
    },

    handleImageWheel(e) {
      if (this.viewingMedia?.type !== 'image') return;
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      const newZoom = Math.max(0.5, Math.min(4, this.imageZoom + delta));
      this.imageZoom = newZoom;
      if (newZoom <= 1) {
        this.imagePosition = { x: 0, y: 0 };
      }
    },

    startImageDrag(e) {
      if (this.imageZoom <= 1 || this.viewingMedia?.type !== 'image') return;
      e.preventDefault();
      this.isDragging = true;
      this.dragStart = {
        x: e.clientX - this.imagePosition.x,
        y: e.clientY - this.imagePosition.y
      };
    },

    handleImageDrag(e) {
      if (!this.isDragging) return;
      e.preventDefault();
      requestAnimationFrame(() => {
        this.imagePosition = {
          x: e.clientX - this.dragStart.x,
          y: e.clientY - this.dragStart.y
        };
      });
    },

    stopImageDrag() {
      this.isDragging = false;
    },

    getSiteThumbnail(site) {
      if (!site.media || site.media.length === 0) return null;
      const firstImage = site.media.find(m => m.type === 'image' && m.blobUrl);
      return firstImage ? firstImage.blobUrl : null;
    },

    getProjectName(projectId) {
      if (!projectId) return '-';
      const project = this.projects.find(p => p.id === projectId);
      return project ? project.name : `Projet ${projectId}`;
    },

    formatSiteCoords(coords) {
      if (!coords) return '-';
      return formatCoords(coords.lat, coords.lng);
    },

    async resolveAllPlaceNames() {
      for (const site of this.sites) {
        if (site.coordinates && !site.placeName) {
          try {
            const name = await reverseGeocode(site.coordinates.lat, site.coordinates.lng);
            if (name) site.placeName = name;
          } catch (_) { /* ignore */ }
        }
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '-';
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    },

    formatDateTime(dateStr) {
      if (!dateStr) return '-';
      return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.selectedFiles = [...this.selectedFiles, ...files];
    },

    handleFileDrop(event) {
      const files = Array.from(event.dataTransfer.files).filter(
        f => f.type.startsWith('image/') || f.type.startsWith('video/')
      );
      this.selectedFiles = [...this.selectedFiles, ...files];
    },

    removeSelectedFile(index) {
      this.selectedFiles.splice(index, 1);
    },

    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },

    async uploadMedia() {
      if (!this.selectedSite || this.selectedSite.isDemo || this.selectedFiles.length === 0) return;
      
      this.uploadingMedia = true;
      try {
        for (const file of this.selectedFiles) {
          await this.request.post(apiPaths.siteMedia(this.selectedSite.id, file.name), file, {
            headers: { 'Content-Type': file.type || 'application/octet-stream' }
          });
        }

        this.selectedFiles = [];
        this.showMediaUpload = false;
        await this.loadSites();
        
        if (this.selectedSite) {
          const updatedSite = this.sites.find(s => s.id === this.selectedSite.id);
          if (updatedSite) this.selectedSite = updatedSite;
        }
        
        alert(this.$t('media.uploadSuccess'));
      } catch (e) {
        console.error('Error uploading media:', e);
        alert(this.$t('media.uploadError'));
      } finally {
        this.uploadingMedia = false;
      }
    },

    async deleteMedia(media) {
      if (this.selectedSite.isDemo) return;
      if (!confirm(this.$t('media.confirmDelete'))) return;
      
      try {
        await this.request.delete(apiPaths.siteMediaItem(this.selectedSite.id, media.id));
        
        if (this.selectedSite.media) {
          this.selectedSite.media = this.selectedSite.media.filter(m => m.id !== media.id);
        }
        
        await this.loadSites();
      } catch (e) {
        console.error('Error deleting media:', e);
        alert(this.$t('media.deleteError'));
      }
    }
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "title": "Sites Management",
    "description": "Visualize and manage all your data collection sites. View locations on map, browse media files, and track submissions.",
    "loading": "Loading sites...",
    "noSites": "No sites found",
    "noLocation": "No location",
    "filters": {
      "project": "Project",
      "allProjects": "All projects",
      "status": "Status",
      "allStatuses": "All statuses",
      "search": "Search",
      "searchPlaceholder": "Search sites...",
      "sitesFound": "site(s) found"
    },
    "stats": {
      "totalSites": "Total Sites",
      "activeSites": "Active Sites",
      "mediaFiles": "Media Files",
      "submissions": "Submissions"
    },
    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "pending": "Pending"
    },
    "view": {
      "map": "Map",
      "list": "List",
      "grid": "Grid"
    },
    "table": {
      "name": "Site Name",
      "project": "Project",
      "location": "Location",
      "status": "Status",
      "submissions": "Submissions",
      "lastActivity": "Last Activity",
      "actions": "Actions"
    },
    "actions": {
      "addSite": "Add Site",
      "view": "View",
      "edit": "Edit",
      "delete": "Delete"
    },
    "media": {
      "add": "Add Media",
      "addFirst": "Add First Media",
      "noMedia": "No media files for this site",
      "delete": "Delete media",
      "confirmDelete": "Are you sure you want to delete this media file?",
      "uploadTitle": "Upload Media Files",
      "dropFiles": "Click or drag files here to upload",
      "supportedFormats": "Supported: JPG, PNG, GIF, MP4, MOV",
      "selectedFiles": "Selected files",
      "upload": "Upload",
      "uploadSuccess": "Media files uploaded successfully!",
      "uploadError": "Error uploading media files. Please try again.",
      "deleteError": "Error deleting media file. Please try again."
    },
    "detail": {
      "info": "Site Information",
      "project": "Project",
      "status": "Status",
      "createdAt": "Created",
      "lastActivity": "Last Activity",
      "description": "Description",
      "location": "Location",
      "media": "Photos & Videos",
      "video": "Video",
      "submissions": "Recent Submissions",
      "noSubmissions": "No submissions yet"
    },
    "overlap": {
      "sitesHere": "site(s) at this location"
    },
    "modal": {
      "createTitle": "Create New Site",
      "editTitle": "Edit Site",
      "project": "Project",
      "selectProject": "Select a project",
      "name": "Site Name",
      "namePlaceholder": "Enter site name",
      "description": "Description",
      "descriptionPlaceholder": "Brief description of the site",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "region": "Region",
      "regionPlaceholder": "Region or zone",
      "address": "Address",
      "addressPlaceholder": "Full address",
      "status": "Status",
      "cancel": "Cancel",
      "create": "Create Site",
      "update": "Update Site",
      "requiredFields": "Please fill in all required fields (Project and Name)",
      "saveError": "Error saving site. Please try again.",
      "deleteError": "Error deleting site. Please try again.",
      "confirmDelete": "Are you sure you want to delete this site?",
      "cannotDeleteDemo": "Demo sites cannot be deleted. Create a real site first."
    }
  },
  "fr": {
    "title": "Gestion des Sites",
    "description": "Visualisez et gérez tous vos sites de collecte de données. Consultez les emplacements sur la carte, parcourez les fichiers médias et suivez les soumissions.",
    "loading": "Chargement des sites...",
    "noSites": "Aucun site trouvé",
    "noLocation": "Pas de localisation",
    "filters": {
      "project": "Projet",
      "allProjects": "Tous les projets",
      "status": "Statut",
      "allStatuses": "Tous les statuts",
      "search": "Rechercher",
      "searchPlaceholder": "Rechercher un site...",
      "sitesFound": "site(s) trouvé(s)"
    },
    "stats": {
      "totalSites": "Total Sites",
      "activeSites": "Sites Actifs",
      "mediaFiles": "Fichiers Médias",
      "submissions": "Soumissions"
    },
    "status": {
      "active": "Actif",
      "inactive": "Inactif",
      "pending": "En attente"
    },
    "view": {
      "map": "Carte",
      "list": "Liste",
      "grid": "Grille"
    },
    "table": {
      "name": "Nom du Site",
      "project": "Projet",
      "location": "Localisation",
      "status": "Statut",
      "submissions": "Soumissions",
      "lastActivity": "Dernière Activité",
      "actions": "Actions"
    },
    "actions": {
      "addSite": "Ajouter un Site",
      "view": "Voir",
      "edit": "Modifier",
      "delete": "Supprimer"
    },
    "media": {
      "add": "Ajouter Média",
      "addFirst": "Ajouter un Premier Média",
      "noMedia": "Aucun fichier média pour ce site",
      "delete": "Supprimer le média",
      "confirmDelete": "Êtes-vous sûr de vouloir supprimer ce fichier média ?",
      "uploadTitle": "Télécharger des Fichiers Médias",
      "dropFiles": "Cliquez ou glissez des fichiers ici pour télécharger",
      "supportedFormats": "Formats supportés : JPG, PNG, GIF, MP4, MOV",
      "selectedFiles": "Fichiers sélectionnés",
      "upload": "Télécharger",
      "uploadSuccess": "Fichiers médias téléchargés avec succès !",
      "uploadError": "Erreur lors du téléchargement. Veuillez réessayer.",
      "deleteError": "Erreur lors de la suppression du média. Veuillez réessayer."
    },
    "detail": {
      "info": "Informations du Site",
      "project": "Projet",
      "status": "Statut",
      "createdAt": "Créé le",
      "lastActivity": "Dernière Activité",
      "description": "Description",
      "location": "Localisation",
      "media": "Photos & Vidéos",
      "video": "Vidéo",
      "submissions": "Soumissions Récentes",
      "noSubmissions": "Aucune soumission"
    },
    "overlap": {
      "sitesHere": "site(s) à cet emplacement"
    },
    "modal": {
      "createTitle": "Créer un Nouveau Site",
      "editTitle": "Modifier le Site",
      "project": "Projet",
      "selectProject": "Sélectionner un projet",
      "name": "Nom du Site",
      "namePlaceholder": "Entrez le nom du site",
      "description": "Description",
      "descriptionPlaceholder": "Description brève du site",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "region": "Région",
      "regionPlaceholder": "Région ou zone",
      "address": "Adresse",
      "addressPlaceholder": "Adresse complète",
      "status": "Statut",
      "cancel": "Annuler",
      "create": "Créer le Site",
      "update": "Mettre à jour",
      "requiredFields": "Veuillez remplir tous les champs obligatoires (Projet et Nom)",
      "saveError": "Erreur lors de la sauvegarde. Veuillez réessayer.",
      "deleteError": "Erreur lors de la suppression. Veuillez réessayer.",
      "confirmDelete": "Êtes-vous sûr de vouloir supprimer ce site ?",
      "cannotDeleteDemo": "Les sites de démonstration ne peuvent pas être supprimés. Créez d'abord un vrai site."
    }
  }
}
</i18n>

<style lang="scss" scoped>
.sites-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1b5e20;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-description {
  color: #6b7280;
  margin: 5px 0 0 0;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #1b5e20, #2e7d32);
  color: white;
  &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3); }
}

.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  label { font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
}

.search-group { flex: 1; min-width: 200px; }

.search-input-wrapper {
  position: relative;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-dropdown-header {
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.search-dropdown-list {
  overflow-y: auto;
  max-height: 260px;
}

.search-dropdown-item {
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;
  
  &:hover {
    background: #e8f5e9;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.search-item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.search-item-name {
  font-weight: 500;
  color: #111827;
  font-size: 14px;
}

.search-item-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
  
  &.active { background: #e8f5e9; color: #2e7d32; }
  &.inactive { background: #ffebee; color: #c62828; }
  &.pending { background: #fff3e0; color: #ef6c00; }
}

.search-item-details {
  font-size: 12px;
  color: #9ca3af;
}

.search-item-project {
  color: #2e7d32;
}

.search-item-region {
  margin-left: 4px;
}

.form-control {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  min-width: 180px;
  &:focus { border-color: #2e7d32; outline: none; box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 25px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #2e7d32;
}

.stat-value { font-size: 28px; font-weight: 700; color: #111827; }
.stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }

.view-toggle {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  background: #f5f5f5;
  padding: 5px;
  border-radius: 10px;
  width: fit-content;
}

.toggle-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  &.active { background: white; color: #2e7d32; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  &:hover:not(.active) { background: #e0e0e0; }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.map-section {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;

  :deep(.geojson-map) {
    min-height: 500px;
  }
}

.overlap-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 6px;
  margin-inline: -6px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;

  .overlap-item-info {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-angle-right {
    color: #1c1b1f;
    flex-shrink: 0;
    font-size: 20px;
    padding-right: 3px;
  }

  &:hover, &:focus-within {
    background-color: #2e7d32;
    color: #fff;
    .icon-angle-right { color: #fff; }
  }
}

.map-legend {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  &.active { background: #2e7d32; }
  &.inactive { background: #c62828; }
  &.pending { background: #f57c00; }
}

.sites-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
}

.sites-table {
  width: 100%;
  border-collapse: collapse;
  
  th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e0e0e0; }
  th { background: #f5f5f5; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #6b7280; }
  tbody tr { cursor: pointer; transition: background 0.2s; }
  tbody tr:hover { background: #f8f9fa; }
}

.site-name {
  font-weight: 600;
  color: #1b5e20;
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-cell { font-size: 13px; }
.no-location { color: #9ca3af; font-style: italic; }

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  &.status-active { background: #e8f5e9; color: #2e7d32; }
  &.status-inactive { background: #ffebee; color: #c62828; }
  &.status-pending { background: #fff3e0; color: #e65100; }
  &.status-approved { background: #e8f5e9; color: #2e7d32; }
  &.status-rejected { background: #ffebee; color: #c62828; }
}

.text-center { text-align: center; }

.actions-cell { display: flex; gap: 8px; }

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: #f5f5f5;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
  &:hover { background: #2e7d32; color: white; }
}

.no-data {
  padding: 60px;
  text-align: center;
  color: #9ca3af;
  span { font-size: 48px; display: block; margin-bottom: 15px; }
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.site-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
}

.site-card-image {
  height: 160px;
  background: #f5f5f5;
  position: relative;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.no-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.placeholder-icon {
  font-size: 28px;
  opacity: 0.7;
  margin-bottom: 5px;
}

.placeholder-text {
  font-size: 42px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.site-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  &.status-active { background: #2e7d32; }
  &.status-inactive { background: #c62828; }
  &.status-pending { background: #f57c00; }
}

.site-card-content { padding: 16px; }
.site-card-title { margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #111827; }
.site-card-project { margin: 0 0 10px 0; font-size: 13px; color: #6b7280; }

.site-card-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #9ca3af;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.site-detail-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
  
  h2 { margin: 0; font-size: 22px; color: #111827; }
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: #e0e0e0; }
}

.modal-body { padding: 25px; }

.detail-section {
  margin-bottom: 30px;
  h3 {
    font-size: 16px;
    color: #1b5e20;
    margin: 0 0 15px 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  label { display: block; font-size: 11px; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
  span { font-size: 14px; color: #111827; }
}

.description {
  margin-top: 15px;
  label { display: block; font-size: 11px; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
  p { margin: 0; color: #6b7280; line-height: 1.6; }
}

.detail-map-wrapper {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;

  :deep(.geojson-map) {
    min-height: 250px;
  }
}

.coordinates-display {
  margin-top: 10px;
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #6b7280;
}

.media-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.media-item {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover { transform: scale(1.05); }
  img { width: 100%; height: 100%; object-fit: cover; }
}

.video-thumbnail {
  width: 100%;
  height: 100%;
  background: #111827;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  span:first-child { font-size: 36px; }
}

.video-label { font-size: 12px; margin-top: 5px; }

.submissions-list { display: flex; flex-direction: column; gap: 10px; }

.submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.sub-date { font-size: 13px; color: #6b7280; }
.sub-form { font-weight: 500; color: #111827; }

.no-submissions {
  padding: 30px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #9ca3af;
}

.media-viewer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  overflow: hidden;
}

.media-viewer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  
  .close-btn {
    position: fixed;
    top: 15px;
    right: 15px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    color: white;
    font-size: 32px;
    border: none;
    cursor: pointer;
    z-index: 100;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    &:hover { background: rgba(255,255,255,0.4); transform: scale(1.1); }
  }
  
  .nav-btn {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    color: white;
    font-size: 28px;
    border: none;
    cursor: pointer;
    z-index: 100;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover { background: rgba(255,255,255,0.4); }
    &.nav-prev { left: 15px; }
    &.nav-next { right: 15px; }
    
    @media (max-width: 768px) {
      width: 44px;
      height: 44px;
      font-size: 22px;
      &.nav-prev { left: 10px; }
      &.nav-next { right: 10px; }
    }
  }
  
  .media-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 70px);
    max-height: calc(100vh - 70px);
    padding: 60px 80px 10px;
    box-sizing: border-box;
    overflow: hidden;
    
    @media (max-width: 768px) {
      padding: 50px 50px 10px;
    }
    
    @media (max-width: 480px) {
      padding: 45px 10px 10px;
    }
  }
  
  .media-image {
    max-width: calc(100vw - 160px);
    max-height: calc(100vh - 140px);
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    
    @media (max-width: 768px) {
      max-width: calc(100vw - 100px);
      max-height: calc(100vh - 120px);
    }
    
    @media (max-width: 480px) {
      max-width: calc(100vw - 20px);
      max-height: calc(100vh - 100px);
      border-radius: 4px;
    }
  }
  
  .media-video {
    max-width: calc(100vw - 160px);
    max-height: calc(100vh - 140px);
    width: auto;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    background: #000;
    
    &::-webkit-media-controls-panel {
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
    }
    
    &::-webkit-media-controls-play-button,
    &::-webkit-media-controls-volume-slider,
    &::-webkit-media-controls-mute-button,
    &::-webkit-media-controls-timeline,
    &::-webkit-media-controls-current-time-display,
    &::-webkit-media-controls-time-remaining-display,
    &::-webkit-media-controls-fullscreen-button {
      filter: brightness(1.2);
    }
    
    @media (max-width: 768px) {
      max-width: calc(100vw - 100px);
      max-height: calc(100vh - 120px);
    }
    
    @media (max-width: 480px) {
      max-width: calc(100vw - 20px);
      max-height: calc(100vh - 100px);
      border-radius: 4px;
    }
  }
  
  .media-info-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    padding: 12px 20px;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 50;
    
    @media (max-width: 480px) {
      padding: 10px 15px;
    }
  }
  
  .media-info-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-width: 70%;
  }
  
  .media-name {
    color: white;
    font-size: 15px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
  
  .media-date {
    color: rgba(255,255,255,0.7);
    font-size: 12px;
    
    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
  
  .media-info-right {
    display: flex;
    align-items: center;
  }
  
  .media-counter {
    color: rgba(255,255,255,0.9);
    font-size: 13px;
    background: rgba(255,255,255,0.15);
    padding: 5px 12px;
    border-radius: 20px;
    
    @media (max-width: 480px) {
      font-size: 12px;
      padding: 4px 10px;
    }
  }
  
  .zoom-controls {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0,0,0,0.7);
    padding: 8px 16px;
    border-radius: 30px;
    z-index: 60;
    
    @media (max-width: 480px) {
      bottom: 55px;
      padding: 6px 12px;
      gap: 6px;
    }
  }
  
  .zoom-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
    
    &:hover:not(:disabled) { background: rgba(255,255,255,0.35); }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
    
    &.zoom-reset {
      background: rgba(255,255,255,0.1);
    }
    
    @media (max-width: 480px) {
      width: 32px;
      height: 32px;
      font-size: 14px;
    }
  }
  
  .zoom-level {
    color: white;
    font-size: 13px;
    min-width: 50px;
    text-align: center;
    font-weight: 500;
    
    @media (max-width: 480px) {
      font-size: 12px;
      min-width: 40px;
    }
  }
  
  .media-image {
    user-select: none;
    -webkit-user-drag: none;
    
    &.is-zoomed {
      cursor: grab;
    }
    &.is-zoomed.is-dragging {
      cursor: grabbing;
    }
  }
}

.media-content {
  user-select: none;
}

.media-item {
  position: relative;
  
  .media-delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(220, 53, 69, 0.9);
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s;
    &:hover { background: #c82333; }
  }
  
  &:hover .media-delete-btn {
    opacity: 1;
  }
}

.no-media-placeholder {
  text-align: center;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  
  span:first-child {
    font-size: 48px;
    color: #adb5bd;
    display: block;
    margin-bottom: 15px;
  }
  
  p {
    color: #6b7280;
    margin: 0 0 15px;
  }
}

.site-create-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 18px;
  
  label {
    display: block;
    font-weight: 600;
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 6px;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    
    &:focus {
      border-color: #2e7d32;
      outline: none;
      box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-secondary {
  background: #f5f5f5;
  color: #6b7280;
  border: 1px solid #ddd;
  
  &:hover {
    background: #e0e0e0;
  }
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .site-create-modal {
    max-width: 100%;
    margin: 10px;
  }
}

.header-actions-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-edit-header {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  &:hover { background: #c8e6c9; }
}

.btn-delete-header {
  background: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
  &:hover { background: #ffcdd2; }
}

.btn-add-media {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
  &:hover { background: #c8e6c9; }
}

.btn-icon.btn-delete {
  &:hover { background: #c62828; color: white; }
}

.section-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  h3 {
    margin: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.no-media-placeholder {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  
  span { font-size: 48px; display: block; margin-bottom: 10px; opacity: 0.5; }
  p { margin: 0 0 15px 0; }
}

.media-item {
  position: relative;
  
  .media-delete-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: rgba(198, 40, 40, 0.9);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s;
    
    &:hover { background: #c62828; }
  }
  
  &:hover .media-delete-btn { opacity: 1; }
}

.media-upload-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
}

.upload-zone {
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #2e7d32;
    background: #f8f9fa;
  }
}

.file-input {
  display: none;
}

.upload-content {
  .upload-icon {
    font-size: 48px;
    color: #2e7d32;
    display: block;
    margin-bottom: 15px;
  }
  
  .upload-text {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 8px 0;
  }
  
  .upload-hint {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
  }
}

.selected-files {
  margin-top: 20px;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #6b7280;
  }
}

.file-list {
  max-height: 200px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
  
  .file-icon { font-size: 20px; }
  .file-name { flex: 1; font-size: 14px; color: #111827; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-size { font-size: 12px; color: #9ca3af; }
  
  .btn-remove-file {
    width: 24px;
    height: 24px;
    border: none;
    background: #ffebee;
    color: #c62828;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover { background: #ffcdd2; }
  }
}
</style>
