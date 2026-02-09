<!--
Copyright 2025 AGR-Collect
AGR-Guide - Guide d'utilisation
-->
<template>
  <div id="legal-guide" class="legal-page">
    <page-section>
      <template #heading>
        <span>{{ $t('title') }}</span>
      </template>
      <template #body>
        <div class="legal-content guide-content">
          <p class="legal-intro">{{ $t('intro') }}</p>
          
          <h3><span class="icon-users"></span> {{ $t('roles.title') }}</h3>
          <div class="role-section">
            <h4>{{ $t('roles.admin.title') }}</h4>
            <p>{{ $t('roles.admin.description') }}</p>
            <ul>
              <li v-for="(item, index) in $tm('roles.admin.permissions')" :key="index">{{ item }}</li>
            </ul>
          </div>
          
          <div class="role-section">
            <h4>{{ $t('roles.agent.title') }}</h4>
            <p>{{ $t('roles.agent.description') }}</p>
            <ul>
              <li v-for="(item, index) in $tm('roles.agent.permissions')" :key="index">{{ item }}</li>
            </ul>
          </div>
          
          <div class="role-section">
            <h4>{{ $t('roles.sponsor.title') }}</h4>
            <p>{{ $t('roles.sponsor.description') }}</p>
            <ul>
              <li v-for="(item, index) in $tm('roles.sponsor.permissions')" :key="index">{{ item }}</li>
            </ul>
          </div>
          
          <h3><span class="icon-mobile"></span> {{ $t('mobile.title') }}</h3>
          <ol>
            <li v-for="(step, index) in $tm('mobile.steps')" :key="index">{{ step }}</li>
          </ol>
          
          <h3><span class="icon-cloud-upload"></span> {{ $t('sync.title') }}</h3>
          <p>{{ $t('sync.description') }}</p>
          <div class="status-legend">
            <div class="status-item">
              <span class="status-badge pending">{{ $t('sync.pending') }}</span>
              <span>{{ $t('sync.pendingDesc') }}</span>
            </div>
            <div class="status-item">
              <span class="status-badge synced">{{ $t('sync.synced') }}</span>
              <span>{{ $t('sync.syncedDesc') }}</span>
            </div>
            <div class="status-item">
              <span class="status-badge error">{{ $t('sync.error') }}</span>
              <span>{{ $t('sync.errorDesc') }}</span>
            </div>
          </div>
          
          <h3><span class="icon-map-marker"></span> {{ $t('gps.title') }}</h3>
          <p>{{ $t('gps.description') }}</p>
          
          <h3><span class="icon-file-text"></span> {{ $t('reports.title') }}</h3>
          <p>{{ $t('reports.description') }}</p>
          
          <p class="legal-footer">{{ $t('footer') }}</p>
        </div>
      </template>
    </page-section>
  </div>
</template>

<script>
import PageSection from '../page/section.vue';

export default {
  name: 'LegalGuide',
  components: { PageSection }
};
</script>

<style lang="scss">
.guide-content {
  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    
    span[class^="icon-"] {
      color: #009ecc;
    }
  }
  
  .role-section {
    margin-left: 20px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    
    h4 {
      color: #009ecc;
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    ul {
      margin-bottom: 0;
    }
  }
  
  ol {
    li {
      margin-bottom: 10px;
    }
  }
  
  .status-legend {
    margin: 16px 0;
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      min-width: 100px;
      text-align: center;
      
      &.pending {
        background: #ffc107;
        color: #000;
      }
      
      &.synced {
        background: #2e7d32;
        color: #fff;
      }
      
      &.error {
        background: #dc3545;
        color: #fff;
      }
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "AGR-Guide",
    "intro": "This guide will help you get started with AGR-Collect and make the most of its features for field data collection.",
    "roles": {
      "title": "User Roles",
      "admin": {
        "title": "Administrator",
        "description": "The administrator has full access to all platform features.",
        "permissions": [
          "Create, modify, and delete user accounts",
          "Manage forms and templates",
          "Register and manage collection sites",
          "Generate and export reports",
          "Access audit logs"
        ]
      },
      "agent": {
        "title": "Field Agent",
        "description": "The field agent is responsible for data collection in the field.",
        "permissions": [
          "Collect data via forms",
          "Add photos and GPS coordinates",
          "Work offline with automatic sync",
          "View their own reports",
          "Edit or delete their submissions"
        ]
      },
      "sponsor": {
        "title": "Sponsor",
        "description": "The sponsor has read-only access for monitoring activities.",
        "permissions": [
          "View reports and statistics",
          "Consult the intervention map",
          "Export reports in PDF format"
        ]
      }
    },
    "mobile": {
      "title": "Mobile Application",
      "steps": [
        "Download AGR-Collect Mobile from Google Play Store",
        "Configure the server URL: https://your-domain.com",
        "Log in with your email and password",
        "Download available forms",
        "Fill out a form and add GPS coordinates",
        "Submit when connected or save for later"
      ]
    },
    "sync": {
      "title": "Synchronization",
      "description": "AGR-Collect automatically synchronizes your data when a connection is available.",
      "pending": "Pending",
      "pendingDesc": "Data saved locally, awaiting synchronization",
      "synced": "Synced",
      "syncedDesc": "Data successfully sent to server",
      "error": "Error",
      "errorDesc": "Synchronization failed, will retry automatically"
    },
    "gps": {
      "title": "Geolocation",
      "description": "Each collection is automatically geolocated. Ensure location services are enabled on your device. GPS coordinates are captured automatically and cannot be modified manually, ensuring data integrity."
    },
    "reports": {
      "title": "Reports",
      "description": "Reports can be filtered by zone, date, or agent. Administrators and sponsors can generate PDF reports for external sharing. Data visualizations are available on the dashboard."
    },
    "footer": "For additional assistance, contact the AGR-Collect support team."
  },
  "fr": {
    "title": "AGR-Guide",
    "intro": "Ce guide vous aidera à démarrer avec AGR-Collect et à tirer le meilleur parti de ses fonctionnalités pour la collecte de données terrain.",
    "roles": {
      "title": "Rôles Utilisateurs",
      "admin": {
        "title": "Administrateur",
        "description": "L'administrateur a un accès complet à toutes les fonctionnalités de la plateforme.",
        "permissions": [
          "Créer, modifier et supprimer des comptes utilisateurs",
          "Gérer les formulaires et templates",
          "Enregistrer et gérer les sites de collecte",
          "Générer et exporter des rapports",
          "Accéder aux journaux d'audit"
        ]
      },
      "agent": {
        "title": "Agent de Terrain",
        "description": "L'agent de terrain est responsable de la collecte de données sur le terrain.",
        "permissions": [
          "Collecter des données via formulaires",
          "Ajouter des photos et coordonnées GPS",
          "Travailler hors-ligne avec synchronisation automatique",
          "Consulter ses propres rapports",
          "Modifier ou supprimer ses soumissions"
        ]
      },
      "sponsor": {
        "title": "Sponsor",
        "description": "Le sponsor a un accès en lecture seule pour le suivi des activités.",
        "permissions": [
          "Consulter les rapports et statistiques",
          "Consulter la carte des interventions",
          "Exporter les rapports au format PDF"
        ]
      }
    },
    "mobile": {
      "title": "Application Mobile",
      "steps": [
        "Téléchargez AGR-Collect Mobile depuis le Play Store",
        "Configurez l'URL du serveur : https://votre-domaine.com",
        "Connectez-vous avec votre email et mot de passe",
        "Téléchargez les formulaires disponibles",
        "Remplissez un formulaire et ajoutez les coordonnées GPS",
        "Envoyez si connecté ou sauvegardez pour plus tard"
      ]
    },
    "sync": {
      "title": "Synchronisation",
      "description": "AGR-Collect synchronise automatiquement vos données lorsqu'une connexion est disponible.",
      "pending": "En attente",
      "pendingDesc": "Données sauvegardées localement, en attente de synchronisation",
      "synced": "Synchronisé",
      "syncedDesc": "Données envoyées avec succès au serveur",
      "error": "Erreur",
      "errorDesc": "Échec de la synchronisation, nouvelle tentative automatique"
    },
    "gps": {
      "title": "Géolocalisation",
      "description": "Chaque collecte est automatiquement géolocalisée. Assurez-vous que les services de localisation sont activés sur votre appareil. Les coordonnées GPS sont capturées automatiquement et ne peuvent pas être modifiées manuellement, garantissant l'intégrité des données."
    },
    "reports": {
      "title": "Rapports",
      "description": "Les rapports peuvent être filtrés par zone, date ou agent. Les administrateurs et sponsors peuvent générer des rapports PDF pour un partage externe. Les visualisations de données sont disponibles sur le tableau de bord."
    },
    "footer": "Pour une assistance supplémentaire, contactez l'équipe de support AGR-Collect."
  }
}
</i18n>
