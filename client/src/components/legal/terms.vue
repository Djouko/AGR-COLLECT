<!--
Copyright 2025 AGR-Collect
Conditions Générales d'Utilisation (CGU)
-->
<template>
  <div id="legal-terms" class="legal-page">
    <page-section>
      <template #heading>
        <span>{{ $t('title') }}</span>
      </template>
      <template #body>
        <div class="legal-content">
          <p class="legal-intro">{{ $t('intro') }}</p>
          
          <h3>1. {{ $t('section1.title') }}</h3>
          <p>{{ $t('section1.content') }}</p>
          
          <h3>2. {{ $t('section2.title') }}</h3>
          <p>{{ $t('section2.content') }}</p>
          
          <h3>3. {{ $t('section3.title') }}</h3>
          <p>{{ $t('section3.content') }}</p>
          
          <h3>4. {{ $t('section4.title') }}</h3>
          <p>{{ $t('section4.content') }}</p>
          
          <h3>5. {{ $t('section5.title') }}</h3>
          <p>{{ $t('section5.content') }}</p>
          
          <h3>6. {{ $t('section6.title') }}</h3>
          <p>{{ $t('section6.content') }}</p>
          
          <h3>7. {{ $t('section7.title') }}</h3>
          <p>{{ $t('section7.content') }}</p>
          
          <p class="legal-footer">{{ $t('footer') }}</p>
        </div>
      </template>
    </page-section>
  </div>
</template>

<script>
import PageSection from '../page/section.vue';

export default {
  name: 'LegalTerms',
  components: { PageSection }
};
</script>

<style lang="scss">
.legal-page {
  max-width: 800px;
  margin: 0 auto;
  
  .legal-content {
    line-height: 1.8;
    
    h3 {
      margin-top: 24px;
      margin-bottom: 12px;
      color: #111827;
      font-size: 18px;
    }
    
    p {
      margin-bottom: 16px;
      text-align: justify;
    }
    
    .legal-intro {
      font-weight: 500;
      font-size: 16px;
      border-left: 4px solid #009ecc;
      padding-left: 16px;
      margin-bottom: 24px;
    }
    
    .legal-footer {
      margin-top: 32px;
      font-style: italic;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
      padding-top: 16px;
    }
  }
}
</style>

<i18n lang="json5">
{
  "en": {
    "title": "Terms of Use",
    "intro": "Welcome to AGR-Collect. By using this platform, you agree to comply with the following terms and conditions.",
    "section1": {
      "title": "Purpose of the Platform",
      "content": "AGR-Collect is a data collection solution designed for NGOs and organizations operating in rural areas. The platform enables geolocated, offline-capable, and secure data collection for field activities."
    },
    "section2": {
      "title": "User Accounts",
      "content": "Each user must have a valid account to access the platform. Users are responsible for maintaining the confidentiality of their credentials. Any activity performed under a user account is the responsibility of that user."
    },
    "section3": {
      "title": "Data Collection",
      "content": "All data collected through AGR-Collect must be accurate and truthful. Users must not collect fraudulent, falsified, or misleading data. Each collection is automatically timestamped and geolocated to ensure traceability."
    },
    "section4": {
      "title": "Intellectual Property",
      "content": "The AGR-Collect platform, including its design, code, and content, is protected by intellectual property rights. Users may not reproduce, modify, or distribute any part of the platform without prior authorization."
    },
    "section5": {
      "title": "User Responsibilities",
      "content": "Users must use the platform in accordance with applicable laws and regulations. Users must not attempt to compromise the security or integrity of the system. Any misuse may result in account suspension or termination."
    },
    "section6": {
      "title": "Limitation of Liability",
      "content": "AGR-Collect strives to ensure platform availability and data security. However, we cannot be held liable for damages resulting from service interruptions, data loss, or unauthorized access beyond our control."
    },
    "section7": {
      "title": "Modifications",
      "content": "AGR-Collect reserves the right to modify these terms at any time. Users will be notified of any significant changes. Continued use of the platform after modifications constitutes acceptance of the new terms."
    },
    "footer": "Last updated: January 2025. For any questions, please contact the AGR-Collect team."
  },
  "fr": {
    "title": "Conditions Générales d'Utilisation",
    "intro": "Bienvenue sur AGR-Collect. En utilisant cette plateforme, vous acceptez de respecter les conditions générales suivantes.",
    "section1": {
      "title": "Objet de la Plateforme",
      "content": "AGR-Collect est une solution de collecte de données conçue pour les ONG et organisations opérant en zones rurales. La plateforme permet une collecte de données géolocalisée, hors-ligne et sécurisée pour les activités de terrain."
    },
    "section2": {
      "title": "Comptes Utilisateurs",
      "content": "Chaque utilisateur doit disposer d'un compte valide pour accéder à la plateforme. Les utilisateurs sont responsables de la confidentialité de leurs identifiants. Toute activité effectuée sous un compte utilisateur relève de la responsabilité de cet utilisateur."
    },
    "section3": {
      "title": "Collecte de Données",
      "content": "Toutes les données collectées via AGR-Collect doivent être exactes et véridiques. Les utilisateurs ne doivent pas collecter de données frauduleuses, falsifiées ou trompeuses. Chaque collecte est automatiquement horodatée et géolocalisée pour assurer la traçabilité."
    },
    "section4": {
      "title": "Propriété Intellectuelle",
      "content": "La plateforme AGR-Collect, y compris son design, son code et son contenu, est protégée par des droits de propriété intellectuelle. Les utilisateurs ne peuvent pas reproduire, modifier ou distribuer une partie de la plateforme sans autorisation préalable."
    },
    "section5": {
      "title": "Responsabilités des Utilisateurs",
      "content": "Les utilisateurs doivent utiliser la plateforme conformément aux lois et réglementations applicables. Les utilisateurs ne doivent pas tenter de compromettre la sécurité ou l'intégrité du système. Tout abus peut entraîner la suspension ou la résiliation du compte."
    },
    "section6": {
      "title": "Limitation de Responsabilité",
      "content": "AGR-Collect s'efforce d'assurer la disponibilité de la plateforme et la sécurité des données. Cependant, nous ne pouvons être tenus responsables des dommages résultant d'interruptions de service, de pertes de données ou d'accès non autorisés échappant à notre contrôle."
    },
    "section7": {
      "title": "Modifications",
      "content": "AGR-Collect se réserve le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés de tout changement significatif. L'utilisation continue de la plateforme après modification constitue l'acceptation des nouvelles conditions."
    },
    "footer": "Dernière mise à jour : Janvier 2025. Pour toute question, veuillez contacter l'équipe AGR-Collect."
  }
}
</i18n>
