<!--
Copyright 2025 AGR-Collect
Politique de Confidentialité
-->
<template>
  <div id="legal-privacy" class="legal-page">
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
          <ul>
            <li>{{ $t('section2.item1') }}</li>
            <li>{{ $t('section2.item2') }}</li>
            <li>{{ $t('section2.item3') }}</li>
            <li>{{ $t('section2.item4') }}</li>
          </ul>
          
          <h3>3. {{ $t('section3.title') }}</h3>
          <p>{{ $t('section3.content') }}</p>
          <ul>
            <li>{{ $t('section3.item1') }}</li>
            <li>{{ $t('section3.item2') }}</li>
            <li>{{ $t('section3.item3') }}</li>
          </ul>
          
          <h3>4. {{ $t('section4.title') }}</h3>
          <p>{{ $t('section4.content') }}</p>
          
          <h3>5. {{ $t('section5.title') }}</h3>
          <p>{{ $t('section5.content') }}</p>
          
          <h3>6. {{ $t('section6.title') }}</h3>
          <p>{{ $t('section6.content') }}</p>
          <ul>
            <li>{{ $t('section6.item1') }}</li>
            <li>{{ $t('section6.item2') }}</li>
            <li>{{ $t('section6.item3') }}</li>
            <li>{{ $t('section6.item4') }}</li>
          </ul>
          
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
  name: 'LegalPrivacy',
  components: { PageSection }
};
</script>

<i18n lang="json5">
{
  "en": {
    "title": "Privacy Policy",
    "intro": "AGR-Collect is committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information.",
    "section1": {
      "title": "Data Controller",
      "content": "AGR-Collect, operated by SAAHDEL NGO, is the data controller for all information collected through the platform. We are committed to ensuring the security and confidentiality of all collected data."
    },
    "section2": {
      "title": "Data Collected",
      "content": "We collect the following types of data:",
      "item1": "User information: name, email address, role, connection logs",
      "item2": "Geolocation data: GPS coordinates captured during data collection",
      "item3": "Field data: information entered in collection forms",
      "item4": "Attachments: photos and documents related to collections"
    },
    "section3": {
      "title": "Purpose of Data Processing",
      "content": "Collected data is used for:",
      "item1": "Field activity monitoring and reporting",
      "item2": "Data traceability and authentication",
      "item3": "Generation of statistical reports and analyses"
    },
    "section4": {
      "title": "Data Security",
      "content": "All data is encrypted during transmission and storage. Access to data is strictly controlled and limited to authorized users. We implement appropriate technical and organizational measures to protect your data against unauthorized access, modification, or destruction."
    },
    "section5": {
      "title": "Data Retention",
      "content": "Data is retained for the duration necessary to achieve the purposes for which it was collected. Collections are retained for a minimum of 5 years for traceability purposes. Users can request deletion of their personal data at any time."
    },
    "section6": {
      "title": "Your Rights",
      "content": "In accordance with data protection regulations, you have the following rights:",
      "item1": "Right of access: obtain a copy of your personal data",
      "item2": "Right of rectification: correct inaccurate data",
      "item3": "Right of erasure: request deletion of your data",
      "item4": "Right of portability: receive your data in a portable format"
    },
    "section7": {
      "title": "Contact",
      "content": "For any questions regarding this privacy policy or to exercise your rights, please contact the AGR-Collect data protection team at the email address provided in the Contacts section."
    },
    "footer": "Last updated: January 2025. This policy may be modified to comply with regulatory changes."
  },
  "fr": {
    "title": "Politique de Confidentialité",
    "intro": "AGR-Collect s'engage à protéger votre vie privée et vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.",
    "section1": {
      "title": "Responsable du Traitement",
      "content": "AGR-Collect, opéré par l'ONG SAAHDEL, est le responsable du traitement pour toutes les informations collectées via la plateforme. Nous nous engageons à assurer la sécurité et la confidentialité de toutes les données collectées."
    },
    "section2": {
      "title": "Données Collectées",
      "content": "Nous collectons les types de données suivants :",
      "item1": "Informations utilisateur : nom, adresse email, rôle, journaux de connexion",
      "item2": "Données de géolocalisation : coordonnées GPS capturées lors de la collecte",
      "item3": "Données terrain : informations saisies dans les formulaires de collecte",
      "item4": "Pièces jointes : photos et documents liés aux collectes"
    },
    "section3": {
      "title": "Finalité du Traitement",
      "content": "Les données collectées sont utilisées pour :",
      "item1": "Le suivi et le reporting des activités terrain",
      "item2": "La traçabilité et l'authentification des données",
      "item3": "La génération de rapports statistiques et d'analyses"
    },
    "section4": {
      "title": "Sécurité des Données",
      "content": "Toutes les données sont chiffrées lors de la transmission et du stockage. L'accès aux données est strictement contrôlé et limité aux utilisateurs autorisés. Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès, modification ou destruction non autorisés."
    },
    "section5": {
      "title": "Conservation des Données",
      "content": "Les données sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées. Les collectes sont conservées pendant un minimum de 5 ans à des fins de traçabilité. Les utilisateurs peuvent demander la suppression de leurs données personnelles à tout moment."
    },
    "section6": {
      "title": "Vos Droits",
      "content": "Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :",
      "item1": "Droit d'accès : obtenir une copie de vos données personnelles",
      "item2": "Droit de rectification : corriger des données inexactes",
      "item3": "Droit à l'effacement : demander la suppression de vos données",
      "item4": "Droit à la portabilité : recevoir vos données dans un format portable"
    },
    "section7": {
      "title": "Contact",
      "content": "Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, veuillez contacter l'équipe de protection des données AGR-Collect à l'adresse email indiquée dans la section Contacts."
    },
    "footer": "Dernière mise à jour : Janvier 2025. Cette politique peut être modifiée pour se conformer aux évolutions réglementaires."
  }
}
</i18n>
