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
            <li>{{ $t('section2.item5') }}</li>
            <li>{{ $t('section2.item6') }}</li>
            <li>{{ $t('section2.item7') }}</li>
          </ul>
          
          <h3>3. {{ $t('section3.title') }}</h3>
          <p>{{ $t('section3.content') }}</p>
          <ul>
            <li>{{ $t('section3.item1') }}</li>
            <li>{{ $t('section3.item2') }}</li>
            <li>{{ $t('section3.item3') }}</li>
            <li>{{ $t('section3.item4') }}</li>
            <li>{{ $t('section3.item5') }}</li>
            <li>{{ $t('section3.item6') }}</li>
            <li>{{ $t('section3.item7') }}</li>
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
            <li>{{ $t('section6.item5') }}</li>
            <li>{{ $t('section6.item6') }}</li>
          </ul>
          
          <h3>7. {{ $t('section7.title') }}</h3>
          <p>{{ $t('section7.content') }}</p>
          
          <h3>8. {{ $t('section8.title') }}</h3>
          <p>{{ $t('section8.content') }}</p>
          
          <h3>9. {{ $t('section9.title') }}</h3>
          <p>{{ $t('section9.content') }}</p>
          
          <h3>10. {{ $t('section10.title') }}</h3>
          <p>{{ $t('section10.content') }}</p>
          
          <h3>11. {{ $t('section11.title') }}</h3>
          <p>{{ $t('section11.content') }}</p>
          
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
    "intro": "AGR-Collect, developed and operated by SAAHDEL (Société Africaine d'Action Humanitaire pour le Développement Local), is firmly committed to protecting your privacy and personal data. This privacy policy describes in detail how we collect, use, store, and protect your information when you use the AGR-Collect platform (web and mobile). By using our services, you acknowledge that you have read and understood this policy.",
    "section1": {
      "title": "Data Controller",
      "content": "SAAHDEL, a non-governmental organization registered in Cameroon, is the data controller for all personal data and field data collected through the AGR-Collect platform. As the data controller, SAAHDEL determines the purposes and means of processing your data and is responsible for ensuring compliance with applicable data protection laws. For any inquiries related to data protection, you may contact us at emmanueljuniordequa2{'@'}gmail.com or by phone at +237 690 624 051."
    },
    "section2": {
      "title": "Data We Collect",
      "content": "We collect the following categories of data to provide and improve our services:",
      "item1": "Account information: Full name, email address, assigned role (Administrator, Field Agent, Sponsor), display name for app users, and account creation date",
      "item2": "Authentication data: Encrypted passwords, session tokens, QR code configuration data, and connection logs (IP address, login timestamps, device type)",
      "item3": "Geolocation data: GPS coordinates (latitude, longitude, altitude, accuracy) captured automatically during field data collection to ensure data traceability",
      "item4": "Field data: All information entered by field agents in data collection forms, including text responses, numeric values, date/time stamps, and selected choices",
      "item5": "Media files: Photographs, audio recordings, and video files attached to form submissions as required by the data collection protocol",
      "item6": "Technical data: Device model, operating system version, app version, network status, and error logs for troubleshooting and improving the service",
      "item7": "Audit data: Logs of all significant actions performed on the platform (form creation, user management, data submissions) for accountability and traceability"
    },
    "section3": {
      "title": "Purpose of Data Processing",
      "content": "Your data is processed exclusively for the following legitimate purposes:",
      "item1": "Enabling field data collection: Allowing field agents to fill out forms, capture GPS coordinates, take photos, and submit data from the field",
      "item2": "Data management and visualization: Providing administrators with tools to view, filter, export, and analyze collected data through tables, maps, and charts",
      "item3": "User management and access control: Creating and managing user accounts, assigning roles, and controlling access to projects and forms",
      "item4": "Reporting and analytics: Generating statistical reports filtered by date, agent, form, or geographic area to monitor field activity progress",
      "item5": "Data quality assurance: Enabling submission review (approval, rejection, flagging) to maintain data accuracy and reliability",
      "item6": "Platform maintenance and improvement: Using technical and error data to diagnose issues, improve performance, and develop new features",
      "item7": "Legal compliance and audit: Maintaining audit trails and logs as required by applicable laws and organizational policies"
    },
    "section4": {
      "title": "Data Security Measures",
      "content": "We implement comprehensive technical and organizational security measures to protect your data at every stage. All data transmitted between the mobile app and the server is encrypted using HTTPS/TLS protocols, ensuring that information cannot be intercepted during transfer. Data stored on the server is protected by encrypted database connections, restricted network access, and regular security updates. User passwords are hashed using industry-standard algorithms and are never stored in plain text. Access to the platform is controlled through role-based permissions, ensuring that each user can only access data relevant to their role. Server infrastructure is hosted in a secure environment with regular backups and disaster recovery procedures. We conduct periodic security reviews to identify and address potential vulnerabilities."
    },
    "section5": {
      "title": "Data Retention",
      "content": "We retain your data only for as long as necessary to fulfill the purposes described in this policy. Field data and submissions are retained for a minimum of 5 years to ensure traceability and compliance with project reporting requirements. User account data is retained for the duration of the user's active relationship with the platform. Once a user account is deactivated or deleted, personal data is anonymized or removed within 90 days, unless longer retention is required by law. Audit logs are retained for a minimum of 3 years for accountability purposes. Backup copies of data are retained for up to 30 days after the primary data is deleted. You may request early deletion of your personal data at any time by contacting your administrator or our support team."
    },
    "section6": {
      "title": "Your Rights",
      "content": "In accordance with applicable data protection laws, you have the following rights regarding your personal data. To exercise any of these rights, please contact your organization's administrator or SAAHDEL directly:",
      "item1": "Right of access: You may request a complete copy of all personal data we hold about you, including form submissions, connection logs, and account information",
      "item2": "Right of rectification: You may request correction of any inaccurate or incomplete personal data associated with your account",
      "item3": "Right of erasure: You may request the deletion of your personal data, subject to legal retention obligations and legitimate organizational needs",
      "item4": "Right of portability: You may request to receive your personal data in a structured, commonly used, and machine-readable format (such as CSV or JSON)",
      "item5": "Right to restrict processing: You may request that we temporarily limit the processing of your data while a dispute or inquiry is being resolved",
      "item6": "Right to object: You may object to the processing of your data for specific purposes, and we will cease processing unless we have compelling legitimate grounds"
    },
    "section7": {
      "title": "Third-Party Sharing",
      "content": "SAAHDEL does not sell, rent, or trade your personal data to third parties. Your data is shared only with authorized members of your organization who have the appropriate role-based access. The platform uses OpenStreetMap tile servers for map display (no personal data is transmitted). The mobile application may use your device's GPS and camera hardware, but this data stays within the AGR-Collect ecosystem and is not shared with external services. In the event of a legal obligation, we may disclose data to competent authorities as required by law."
    },
    "section8": {
      "title": "Cookies and Local Storage",
      "content": "The AGR-Collect web platform uses essential cookies and browser local storage to manage your session, remember your language preference, and maintain your authentication state. These are strictly necessary for the platform to function and cannot be disabled. We do not use advertising, tracking, or analytics cookies. The mobile application stores form data and submission data locally on your device until it is synchronized with the server."
    },
    "section9": {
      "title": "Children's Data",
      "content": "AGR-Collect is a professional data collection platform and is not intended for use by children under the age of 16. We do not knowingly collect personal data from children. If field data collection involves information about minors (e.g., health surveys), this data is collected under the responsibility of the deploying organization, which must ensure appropriate consent and protections are in place."
    },
    "section10": {
      "title": "Policy Updates",
      "content": "We may update this privacy policy from time to time to reflect changes in our practices, legal requirements, or platform features. When we make significant changes, we will notify users through the platform or by email. The date of the last update is indicated at the bottom of this page. We encourage you to review this policy periodically."
    },
    "section11": {
      "title": "Contact Us",
      "content": "For any questions, concerns, or requests related to this privacy policy or the processing of your personal data, please contact SAAHDEL at: emmanueljuniordequa2{'@'}gmail.com | Phone: +237 690 624 051 | Website: www.saahdel.org. We will respond to your inquiry within 30 business days."
    },
    "footer": "Last updated: January 2025. This policy is governed by the laws of the Republic of Cameroon and applicable international data protection standards."
  },
  "fr": {
    "title": "Politique de Confidentialité",
    "intro": "AGR-Collect, développé et opéré par SAAHDEL (Société Africaine d'Action Humanitaire pour le Développement Local), s'engage fermement à protéger votre vie privée et vos données personnelles. Cette politique de confidentialité décrit en détail comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez la plateforme AGR-Collect (web et mobile). En utilisant nos services, vous reconnaissez avoir lu et compris cette politique.",
    "section1": {
      "title": "Responsable du Traitement",
      "content": "SAAHDEL, organisation non gouvernementale enregistrée au Cameroun, est le responsable du traitement pour toutes les données personnelles et données terrain collectées via la plateforme AGR-Collect. En tant que responsable du traitement, SAAHDEL détermine les finalités et les moyens du traitement de vos données et est responsable du respect des lois applicables en matière de protection des données. Pour toute demande relative à la protection des données, vous pouvez nous contacter à emmanueljuniordequa2{'@'}gmail.com ou par téléphone au +237 690 624 051."
    },
    "section2": {
      "title": "Données que Nous Collectons",
      "content": "Nous collectons les catégories de données suivantes pour fournir et améliorer nos services :",
      "item1": "Informations de compte : Nom complet, adresse email, rôle attribué (Administrateur, Agent de Terrain, Sponsor), nom d'affichage pour les utilisateurs mobile, et date de création du compte",
      "item2": "Données d'authentification : Mots de passe chiffrés, jetons de session, données de configuration par code QR, et journaux de connexion (adresse IP, horodatage des connexions, type d'appareil)",
      "item3": "Données de géolocalisation : Coordonnées GPS (latitude, longitude, altitude, précision) capturées automatiquement lors de la collecte de données terrain pour assurer la traçabilité",
      "item4": "Données terrain : Toutes les informations saisies par les agents dans les formulaires de collecte, incluant réponses textuelles, valeurs numériques, horodatages et choix sélectionnés",
      "item5": "Fichiers médias : Photographies, enregistrements audio et fichiers vidéo joints aux soumissions de formulaires selon le protocole de collecte",
      "item6": "Données techniques : Modèle d'appareil, version du système d'exploitation, version de l'application, état du réseau et journaux d'erreurs pour le dépannage et l'amélioration du service",
      "item7": "Données d'audit : Journaux de toutes les actions significatives effectuées sur la plateforme (création de formulaires, gestion des utilisateurs, soumissions de données) pour la responsabilité et la traçabilité"
    },
    "section3": {
      "title": "Finalités du Traitement",
      "content": "Vos données sont traitées exclusivement pour les finalités légitimes suivantes :",
      "item1": "Permettre la collecte de données terrain : Permettre aux agents de remplir des formulaires, capturer des coordonnées GPS, prendre des photos et soumettre des données depuis le terrain",
      "item2": "Gestion et visualisation des données : Fournir aux administrateurs des outils pour visualiser, filtrer, exporter et analyser les données collectées via tableaux, cartes et graphiques",
      "item3": "Gestion des utilisateurs et contrôle d'accès : Créer et gérer les comptes utilisateurs, attribuer des rôles et contrôler l'accès aux projets et formulaires",
      "item4": "Rapports et analyses : Générer des rapports statistiques filtrés par date, agent, formulaire ou zone géographique pour suivre la progression des activités terrain",
      "item5": "Assurance qualité des données : Permettre la révision des soumissions (approbation, rejet, signalement) pour maintenir la précision et la fiabilité des données",
      "item6": "Maintenance et amélioration de la plateforme : Utiliser les données techniques et d'erreur pour diagnostiquer les problèmes, améliorer les performances et développer de nouvelles fonctionnalités",
      "item7": "Conformité légale et audit : Maintenir les pistes d'audit et journaux conformément aux lois applicables et aux politiques organisationnelles"
    },
    "section4": {
      "title": "Mesures de Sécurité des Données",
      "content": "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles complètes pour protéger vos données à chaque étape. Toutes les données transmises entre l'application mobile et le serveur sont chiffrées via les protocoles HTTPS/TLS, garantissant que les informations ne peuvent être interceptées pendant le transfert. Les données stockées sur le serveur sont protégées par des connexions de base de données chiffrées, un accès réseau restreint et des mises à jour de sécurité régulières. Les mots de passe utilisateurs sont hachés à l'aide d'algorithmes standards de l'industrie et ne sont jamais stockés en clair. L'accès à la plateforme est contrôlé par des permissions basées sur les rôles, garantissant que chaque utilisateur ne peut accéder qu'aux données pertinentes pour son rôle. L'infrastructure serveur est hébergée dans un environnement sécurisé avec des sauvegardes régulières et des procédures de reprise après sinistre. Nous effectuons des revues de sécurité périodiques pour identifier et corriger les vulnérabilités potentielles."
    },
    "section5": {
      "title": "Conservation des Données",
      "content": "Nous conservons vos données uniquement aussi longtemps que nécessaire pour remplir les finalités décrites dans cette politique. Les données terrain et soumissions sont conservées pendant un minimum de 5 ans pour assurer la traçabilité et la conformité avec les exigences de reporting des projets. Les données de compte utilisateur sont conservées pendant la durée de la relation active de l'utilisateur avec la plateforme. Une fois un compte utilisateur désactivé ou supprimé, les données personnelles sont anonymisées ou supprimées dans les 90 jours, sauf si une conservation plus longue est requise par la loi. Les journaux d'audit sont conservés pendant un minimum de 3 ans à des fins de responsabilité. Les copies de sauvegarde sont conservées jusqu'à 30 jours après la suppression des données principales. Vous pouvez demander la suppression anticipée de vos données personnelles à tout moment en contactant votre administrateur ou notre équipe de support."
    },
    "section6": {
      "title": "Vos Droits",
      "content": "Conformément aux lois applicables en matière de protection des données, vous disposez des droits suivants concernant vos données personnelles. Pour exercer l'un de ces droits, veuillez contacter l'administrateur de votre organisation ou SAAHDEL directement :",
      "item1": "Droit d'accès : Vous pouvez demander une copie complète de toutes les données personnelles que nous détenons à votre sujet, incluant les soumissions, journaux de connexion et informations de compte",
      "item2": "Droit de rectification : Vous pouvez demander la correction de toute donnée personnelle inexacte ou incomplète associée à votre compte",
      "item3": "Droit à l'effacement : Vous pouvez demander la suppression de vos données personnelles, sous réserve des obligations légales de conservation et des besoins organisationnels légitimes",
      "item4": "Droit à la portabilité : Vous pouvez demander à recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine (tel que CSV ou JSON)",
      "item5": "Droit à la limitation du traitement : Vous pouvez demander la limitation temporaire du traitement de vos données pendant la résolution d'un litige ou d'une demande",
      "item6": "Droit d'opposition : Vous pouvez vous opposer au traitement de vos données pour des finalités spécifiques, et nous cesserons le traitement sauf motifs légitimes impérieux"
    },
    "section7": {
      "title": "Partage avec des Tiers",
      "content": "SAAHDEL ne vend, ne loue et n'échange pas vos données personnelles avec des tiers. Vos données sont partagées uniquement avec les membres autorisés de votre organisation disposant de l'accès basé sur les rôles approprié. La plateforme utilise les serveurs de tuiles OpenStreetMap pour l'affichage des cartes (aucune donnée personnelle n'est transmise). L'application mobile peut utiliser le GPS et l'appareil photo de votre appareil, mais ces données restent dans l'écosystème AGR-Collect et ne sont pas partagées avec des services externes. En cas d'obligation légale, nous pouvons divulguer des données aux autorités compétentes conformément à la loi."
    },
    "section8": {
      "title": "Cookies et Stockage Local",
      "content": "La plateforme web AGR-Collect utilise des cookies essentiels et le stockage local du navigateur pour gérer votre session, mémoriser votre préférence linguistique et maintenir votre état d'authentification. Ceux-ci sont strictement nécessaires au fonctionnement de la plateforme et ne peuvent être désactivés. Nous n'utilisons pas de cookies publicitaires, de suivi ou d'analyse. L'application mobile stocke les données de formulaires et de soumissions localement sur votre appareil jusqu'à leur synchronisation avec le serveur."
    },
    "section9": {
      "title": "Données des Mineurs",
      "content": "AGR-Collect est une plateforme professionnelle de collecte de données et n'est pas destinée aux enfants de moins de 16 ans. Nous ne collectons pas sciemment de données personnelles auprès d'enfants. Si la collecte de données terrain implique des informations sur des mineurs (ex : enquêtes de santé), ces données sont collectées sous la responsabilité de l'organisation déployante, qui doit s'assurer que le consentement et les protections appropriés sont en place."
    },
    "section10": {
      "title": "Mises à Jour de la Politique",
      "content": "Nous pouvons mettre à jour cette politique de confidentialité de temps en temps pour refléter les changements dans nos pratiques, les exigences légales ou les fonctionnalités de la plateforme. Lorsque nous apportons des modifications significatives, nous informerons les utilisateurs via la plateforme ou par email. La date de la dernière mise à jour est indiquée en bas de cette page. Nous vous encourageons à consulter régulièrement cette politique."
    },
    "section11": {
      "title": "Nous Contacter",
      "content": "Pour toute question, préoccupation ou demande relative à cette politique de confidentialité ou au traitement de vos données personnelles, veuillez contacter SAAHDEL à : emmanueljuniordequa2{'@'}gmail.com | Téléphone : +237 690 624 051 | Site web : www.saahdel.org. Nous répondrons à votre demande dans un délai de 30 jours ouvrables."
    },
    "footer": "Dernière mise à jour : Janvier 2025. Cette politique est régie par les lois de la République du Cameroun et les normes internationales applicables en matière de protection des données."
  }
}
</i18n>
