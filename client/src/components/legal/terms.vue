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
          <ul>
            <li>{{ $t('section1.item1') }}</li>
            <li>{{ $t('section1.item2') }}</li>
            <li>{{ $t('section1.item3') }}</li>
            <li>{{ $t('section1.item4') }}</li>
            <li>{{ $t('section1.item5') }}</li>
          </ul>
          
          <h3>2. {{ $t('section2.title') }}</h3>
          <p>{{ $t('section2.content') }}</p>
          
          <h3>3. {{ $t('section3.title') }}</h3>
          <p>{{ $t('section3.content') }}</p>
          <ul>
            <li>{{ $t('section3.item1') }}</li>
            <li>{{ $t('section3.item2') }}</li>
            <li>{{ $t('section3.item3') }}</li>
            <li>{{ $t('section3.item4') }}</li>
          </ul>
          
          <h3>4. {{ $t('section4.title') }}</h3>
          <p>{{ $t('section4.content') }}</p>
          <ul>
            <li>{{ $t('section4.item1') }}</li>
            <li>{{ $t('section4.item2') }}</li>
            <li>{{ $t('section4.item3') }}</li>
          </ul>
          
          <h3>5. {{ $t('section5.title') }}</h3>
          <p>{{ $t('section5.content') }}</p>
          <ul>
            <li>{{ $t('section5.item1') }}</li>
            <li>{{ $t('section5.item2') }}</li>
            <li>{{ $t('section5.item3') }}</li>
            <li>{{ $t('section5.item4') }}</li>
            <li>{{ $t('section5.item5') }}</li>
          </ul>
          
          <h3>6. {{ $t('section6.title') }}</h3>
          <p>{{ $t('section6.content') }}</p>
          
          <h3>7. {{ $t('section7.title') }}</h3>
          <p>{{ $t('section7.content') }}</p>
          <ul>
            <li>{{ $t('section7.item1') }}</li>
            <li>{{ $t('section7.item2') }}</li>
            <li>{{ $t('section7.item3') }}</li>
            <li>{{ $t('section7.item4') }}</li>
            <li>{{ $t('section7.item5') }}</li>
          </ul>
          
          <h3>8. {{ $t('section8.title') }}</h3>
          <p>{{ $t('section8.content') }}</p>
          
          <h3>9. {{ $t('section9.title') }}</h3>
          <p>{{ $t('section9.content') }}</p>
          
          <h3>10. {{ $t('section10.title') }}</h3>
          <p>{{ $t('section10.content') }}</p>
          <ul>
            <li>{{ $t('section10.item1') }}</li>
            <li>{{ $t('section10.item2') }}</li>
            <li>{{ $t('section10.item3') }}</li>
          </ul>
          
          <h3>11. {{ $t('section11.title') }}</h3>
          <p>{{ $t('section11.content') }}</p>
          
          <h3>12. {{ $t('section12.title') }}</h3>
          <p>{{ $t('section12.content') }}</p>
          
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
    "intro": "Welcome to AGR-Collect, a field data collection platform developed and operated by SAAHDEL (Société Africaine d'Action Humanitaire pour le Développement Local). By accessing or using the AGR-Collect platform (web interface and/or mobile application), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you must not use the platform. Please read these terms carefully before using our services.",
    "section1": {
      "title": "Definitions",
      "content": "For the purposes of these Terms of Use, the following definitions apply:",
      "item1": "\"Platform\" refers to the AGR-Collect web application and the AGR-Collect mobile application (Android), collectively or individually",
      "item2": "\"User\" refers to any individual who accesses or uses the Platform, regardless of their role",
      "item3": "\"Administrator\" refers to a user with full management rights over projects, users, forms, and data",
      "item4": "\"Field Agent\" refers to a user who collects data in the field using the mobile application",
      "item5": "\"Submission\" refers to a completed data collection form submitted by a Field Agent, including all associated metadata, GPS coordinates, and media files"
    },
    "section2": {
      "title": "Eligibility and Access",
      "content": "The AGR-Collect platform is intended for use by authorized personnel of organizations partnered with or approved by SAAHDEL. Users must be at least 16 years of age to create an account. Access to the platform is granted by an Administrator who creates user accounts and assigns appropriate roles. Each user receives credentials (email and password for web access, or a QR code configuration for mobile access) that are personal and non-transferable. Sharing credentials with unauthorized persons is strictly prohibited."
    },
    "section3": {
      "title": "User Accounts and Security",
      "content": "Each user is responsible for maintaining the security and confidentiality of their account credentials. Users agree to:",
      "item1": "Keep their password confidential and never share it with anyone, including colleagues or supervisors",
      "item2": "Notify the Administrator immediately if they suspect unauthorized access to their account or if their credentials have been compromised",
      "item3": "Use a strong password and change it periodically as recommended by their organization's security policy",
      "item4": "Log out of the web platform when using shared or public computers to prevent unauthorized access"
    },
    "section4": {
      "title": "User Roles and Permissions",
      "content": "The platform operates with a role-based access control system. Each role has specific permissions and responsibilities:",
      "item1": "Administrator: Full access to all platform features including user management, project configuration, form design, data review, site management, and report generation. Administrators are responsible for the proper configuration and oversight of the platform",
      "item2": "Field Agent (App User): Access to the mobile application for data collection, form filling, GPS capture, photo attachment, draft management, and data synchronization. Field Agents must follow the data collection protocols established by the Administrator",
      "item3": "Sponsor: Read-only access to view reports, maps, and aggregated data. Sponsors may not modify data, manage users, or configure forms"
    },
    "section5": {
      "title": "Data Collection Obligations",
      "content": "All users involved in data collection must adhere to the following principles and obligations:",
      "item1": "Accuracy: All data entered in collection forms must be accurate, truthful, and reflect actual field observations. Fabricating or falsifying data is strictly prohibited and may result in immediate account termination",
      "item2": "Geolocation integrity: GPS coordinates are captured automatically by the platform to ensure data traceability. Users must not attempt to manipulate, spoof, or falsify location data",
      "item3": "Timeliness: Data should be collected and submitted in a timely manner according to the project schedule. Drafts should be finalized and synchronized as soon as network connectivity is available",
      "item4": "Confidentiality: Data collected about individuals or communities must be handled with respect for privacy and in compliance with the organization's ethical guidelines and applicable laws",
      "item5": "Media quality: Photographs and other media attached to submissions must be clear, relevant, and taken in accordance with the data collection protocol. Inappropriate or irrelevant media content is prohibited"
    },
    "section6": {
      "title": "Intellectual Property",
      "content": "The AGR-Collect platform, including but not limited to its source code, user interface design, logos, icons, documentation, and all associated materials, is the intellectual property of SAAHDEL and is protected by applicable intellectual property laws. Users are granted a limited, non-exclusive, non-transferable, revocable license to use the platform solely for the purposes of authorized data collection activities. Users may not copy, modify, reverse-engineer, decompile, distribute, or create derivative works from any part of the platform without prior written authorization from SAAHDEL."
    },
    "section7": {
      "title": "Acceptable Use Policy",
      "content": "Users agree to use the platform responsibly and in accordance with these terms. The following activities are expressly prohibited:",
      "item1": "Attempting to gain unauthorized access to other users' accounts, data, or system resources",
      "item2": "Introducing viruses, malware, or any other harmful code into the platform",
      "item3": "Using the platform for any illegal, fraudulent, or malicious purpose",
      "item4": "Overloading the platform with excessive requests or data that could degrade performance for other users",
      "item5": "Extracting, scraping, or bulk-downloading data from the platform without authorization"
    },
    "section8": {
      "title": "Data Ownership and Licensing",
      "content": "Data collected through the AGR-Collect platform remains the property of the deploying organization (the entity that operates the AGR-Collect server instance). SAAHDEL does not claim ownership of any field data collected by users. However, SAAHDEL retains the right to use anonymized and aggregated usage statistics to improve the platform. Users and organizations are responsible for ensuring that their data collection activities comply with all applicable local, national, and international laws, including data protection regulations."
    },
    "section9": {
      "title": "Service Availability and Limitations",
      "content": "SAAHDEL strives to maintain the AGR-Collect platform available and operational at all times. However, the platform is provided \"as is\" and \"as available\" without warranties of any kind, express or implied. Service interruptions may occur due to scheduled maintenance, software updates, server issues, or circumstances beyond our control (force majeure). The mobile application is designed to function offline, allowing data collection to continue even without network connectivity. Data synchronization will resume automatically once connectivity is restored. SAAHDEL is not responsible for data loss resulting from device failure, theft, or damage."
    },
    "section10": {
      "title": "Account Termination and Suspension",
      "content": "SAAHDEL and platform Administrators reserve the right to suspend or terminate user accounts under the following circumstances:",
      "item1": "Violation of any provision of these Terms of Use, including data falsification, unauthorized access attempts, or misuse of the platform",
      "item2": "Inactivity for an extended period as determined by the organization's policy, or at the request of the user's organization",
      "item3": "Upon request of the user themselves, in which case personal data will be handled in accordance with our Privacy Policy"
    },
    "section11": {
      "title": "Governing Law and Dispute Resolution",
      "content": "These Terms of Use are governed by and construed in accordance with the laws of the Republic of Cameroon. Any disputes arising from or in connection with these terms shall first be attempted to be resolved amicably through negotiation. If no agreement can be reached, the dispute shall be submitted to the competent courts of Cameroon. By using the platform, you consent to this jurisdiction."
    },
    "section12": {
      "title": "Modifications to Terms",
      "content": "SAAHDEL reserves the right to modify, update, or replace these Terms of Use at any time. When significant changes are made, users will be notified through the platform or by email. The date of the last update is indicated at the bottom of this page. Continued use of the platform after modifications are published constitutes acceptance of the revised terms. If you do not agree with the updated terms, you must discontinue your use of the platform and contact your Administrator to deactivate your account."
    },
    "footer": "Last updated: January 2025. These terms are effective as of publication and supersede all previous versions. For questions, contact SAAHDEL at emmanueljuniordequa2{'@'}gmail.com."
  },
  "fr": {
    "title": "Conditions Générales d'Utilisation",
    "intro": "Bienvenue sur AGR-Collect, une plateforme de collecte de données terrain développée et opérée par SAAHDEL (Société Africaine d'Action Humanitaire pour le Développement Local). En accédant ou en utilisant la plateforme AGR-Collect (interface web et/ou application mobile), vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas une partie de ces conditions, vous ne devez pas utiliser la plateforme. Veuillez lire attentivement ces conditions avant d'utiliser nos services.",
    "section1": {
      "title": "Définitions",
      "content": "Aux fins des présentes Conditions Générales d'Utilisation, les définitions suivantes s'appliquent :",
      "item1": "« Plateforme » désigne l'application web AGR-Collect et l'application mobile AGR-Collect (Android), collectivement ou individuellement",
      "item2": "« Utilisateur » désigne toute personne qui accède ou utilise la Plateforme, quel que soit son rôle",
      "item3": "« Administrateur » désigne un utilisateur disposant de tous les droits de gestion sur les projets, utilisateurs, formulaires et données",
      "item4": "« Agent de Terrain » désigne un utilisateur qui collecte des données sur le terrain à l'aide de l'application mobile",
      "item5": "« Soumission » désigne un formulaire de collecte de données rempli et soumis par un Agent de Terrain, incluant toutes les métadonnées associées, coordonnées GPS et fichiers médias"
    },
    "section2": {
      "title": "Éligibilité et Accès",
      "content": "La plateforme AGR-Collect est destinée à être utilisée par le personnel autorisé des organisations partenaires ou approuvées par SAAHDEL. Les utilisateurs doivent avoir au moins 16 ans pour créer un compte. L'accès à la plateforme est accordé par un Administrateur qui crée les comptes utilisateurs et attribue les rôles appropriés. Chaque utilisateur reçoit des identifiants (email et mot de passe pour l'accès web, ou une configuration par code QR pour l'accès mobile) qui sont personnels et non transférables. Le partage d'identifiants avec des personnes non autorisées est strictement interdit."
    },
    "section3": {
      "title": "Comptes Utilisateurs et Sécurité",
      "content": "Chaque utilisateur est responsable du maintien de la sécurité et de la confidentialité de ses identifiants de compte. Les utilisateurs s'engagent à :",
      "item1": "Garder leur mot de passe confidentiel et ne jamais le partager avec quiconque, y compris collègues ou superviseurs",
      "item2": "Notifier immédiatement l'Administrateur s'ils soupçonnent un accès non autorisé à leur compte ou si leurs identifiants ont été compromis",
      "item3": "Utiliser un mot de passe fort et le changer périodiquement selon la politique de sécurité de leur organisation",
      "item4": "Se déconnecter de la plateforme web lors de l'utilisation d'ordinateurs partagés ou publics pour prévenir tout accès non autorisé"
    },
    "section4": {
      "title": "Rôles et Permissions des Utilisateurs",
      "content": "La plateforme fonctionne avec un système de contrôle d'accès basé sur les rôles. Chaque rôle dispose de permissions et responsabilités spécifiques :",
      "item1": "Administrateur : Accès complet à toutes les fonctionnalités de la plateforme incluant la gestion des utilisateurs, la configuration des projets, la conception des formulaires, la révision des données, la gestion des sites et la génération de rapports. Les Administrateurs sont responsables de la bonne configuration et supervision de la plateforme",
      "item2": "Agent de Terrain (Utilisateur App) : Accès à l'application mobile pour la collecte de données, le remplissage de formulaires, la capture GPS, l'ajout de photos, la gestion des brouillons et la synchronisation des données. Les Agents de Terrain doivent suivre les protocoles de collecte établis par l'Administrateur",
      "item3": "Sponsor : Accès en lecture seule pour consulter les rapports, les cartes et les données agrégées. Les Sponsors ne peuvent ni modifier les données, ni gérer les utilisateurs, ni configurer les formulaires"
    },
    "section5": {
      "title": "Obligations de Collecte de Données",
      "content": "Tous les utilisateurs impliqués dans la collecte de données doivent respecter les principes et obligations suivants :",
      "item1": "Exactitude : Toutes les données saisies dans les formulaires de collecte doivent être exactes, véridiques et refléter les observations réelles sur le terrain. La fabrication ou falsification de données est strictement interdite et peut entraîner la résiliation immédiate du compte",
      "item2": "Intégrité de la géolocalisation : Les coordonnées GPS sont capturées automatiquement par la plateforme pour assurer la traçabilité des données. Les utilisateurs ne doivent pas tenter de manipuler, usurper ou falsifier les données de localisation",
      "item3": "Ponctualité : Les données doivent être collectées et soumises en temps voulu selon le calendrier du projet. Les brouillons doivent être finalisés et synchronisés dès que la connectivité réseau est disponible",
      "item4": "Confidentialité : Les données collectées concernant des individus ou des communautés doivent être traitées dans le respect de la vie privée et en conformité avec les directives éthiques de l'organisation et les lois applicables",
      "item5": "Qualité des médias : Les photographies et autres médias joints aux soumissions doivent être clairs, pertinents et pris conformément au protocole de collecte de données. Tout contenu média inapproprié ou non pertinent est interdit"
    },
    "section6": {
      "title": "Propriété Intellectuelle",
      "content": "La plateforme AGR-Collect, y compris mais sans s'y limiter son code source, son design d'interface, ses logos, icônes, documentation et tous les matériaux associés, est la propriété intellectuelle de SAAHDEL et est protégée par les lois applicables en matière de propriété intellectuelle. Les utilisateurs se voient accorder une licence limitée, non exclusive, non transférable et révocable pour utiliser la plateforme uniquement aux fins d'activités de collecte de données autorisées. Les utilisateurs ne peuvent pas copier, modifier, désassembler, décompiler, distribuer ou créer des œuvres dérivées de toute partie de la plateforme sans autorisation écrite préalable de SAAHDEL."
    },
    "section7": {
      "title": "Politique d'Utilisation Acceptable",
      "content": "Les utilisateurs s'engagent à utiliser la plateforme de manière responsable et conformément aux présentes conditions. Les activités suivantes sont expressément interdites :",
      "item1": "Tenter d'obtenir un accès non autorisé aux comptes, données ou ressources système d'autres utilisateurs",
      "item2": "Introduire des virus, logiciels malveillants ou tout autre code nuisible dans la plateforme",
      "item3": "Utiliser la plateforme à des fins illégales, frauduleuses ou malveillantes",
      "item4": "Surcharger la plateforme avec des requêtes ou données excessives pouvant dégrader les performances pour les autres utilisateurs",
      "item5": "Extraire, scraper ou télécharger en masse des données de la plateforme sans autorisation"
    },
    "section8": {
      "title": "Propriété des Données et Licence",
      "content": "Les données collectées via la plateforme AGR-Collect restent la propriété de l'organisation déployante (l'entité qui opère l'instance du serveur AGR-Collect). SAAHDEL ne revendique aucune propriété sur les données terrain collectées par les utilisateurs. Cependant, SAAHDEL se réserve le droit d'utiliser des statistiques d'utilisation anonymisées et agrégées pour améliorer la plateforme. Les utilisateurs et organisations sont responsables de s'assurer que leurs activités de collecte de données sont conformes à toutes les lois locales, nationales et internationales applicables, y compris les réglementations sur la protection des données."
    },
    "section9": {
      "title": "Disponibilité du Service et Limitations",
      "content": "SAAHDEL s'efforce de maintenir la plateforme AGR-Collect disponible et opérationnelle en permanence. Cependant, la plateforme est fournie « en l'état » et « selon disponibilité » sans garantie d'aucune sorte, expresse ou implicite. Des interruptions de service peuvent survenir en raison de maintenances planifiées, mises à jour logicielles, problèmes de serveur ou circonstances indépendantes de notre volonté (force majeure). L'application mobile est conçue pour fonctionner hors ligne, permettant la collecte de données même sans connectivité réseau. La synchronisation des données reprendra automatiquement une fois la connectivité rétablie. SAAHDEL n'est pas responsable des pertes de données résultant de pannes, vols ou dommages aux appareils."
    },
    "section10": {
      "title": "Résiliation et Suspension de Compte",
      "content": "SAAHDEL et les Administrateurs de la plateforme se réservent le droit de suspendre ou résilier des comptes utilisateurs dans les circonstances suivantes :",
      "item1": "Violation de toute disposition des présentes Conditions d'Utilisation, y compris la falsification de données, les tentatives d'accès non autorisé ou l'utilisation abusive de la plateforme",
      "item2": "Inactivité pendant une période prolongée déterminée par la politique de l'organisation, ou à la demande de l'organisation de l'utilisateur",
      "item3": "À la demande de l'utilisateur lui-même, auquel cas les données personnelles seront traitées conformément à notre Politique de Confidentialité"
    },
    "section11": {
      "title": "Droit Applicable et Résolution des Litiges",
      "content": "Les présentes Conditions Générales d'Utilisation sont régies et interprétées conformément aux lois de la République du Cameroun. Tout litige découlant de ou en relation avec ces conditions sera d'abord tenté d'être résolu à l'amiable par négociation. Si aucun accord ne peut être trouvé, le litige sera soumis aux tribunaux compétents du Cameroun. En utilisant la plateforme, vous consentez à cette juridiction."
    },
    "section12": {
      "title": "Modifications des Conditions",
      "content": "SAAHDEL se réserve le droit de modifier, mettre à jour ou remplacer les présentes Conditions d'Utilisation à tout moment. Lorsque des modifications significatives sont apportées, les utilisateurs seront informés via la plateforme ou par email. La date de la dernière mise à jour est indiquée en bas de cette page. L'utilisation continue de la plateforme après la publication des modifications constitue l'acceptation des conditions révisées. Si vous n'acceptez pas les conditions mises à jour, vous devez cesser d'utiliser la plateforme et contacter votre Administrateur pour désactiver votre compte."
    },
    "footer": "Dernière mise à jour : Janvier 2025. Ces conditions sont effectives dès leur publication et remplacent toutes les versions précédentes. Pour toute question, contactez SAAHDEL à emmanueljuniordequa2{'@'}gmail.com."
  }
}
</i18n>
