/**
 * XLSForm Generator for AGR-Collect Form Builder
 * 
 * Ce module génère des fichiers XLSForm (XLSX) à partir d'une définition de formulaire JSON.
 * Le fichier généré est compatible avec AGR-Collect et pyxform.
 * 
 * Structure XLSForm:
 * - survey: définit les questions du formulaire
 * - choices: définit les options pour les questions à choix
 * - settings: métadonnées du formulaire
 */

import * as XLSX from 'xlsx';

/**
 * Types de champs supportés avec leur configuration XLSForm
 */
export const FIELD_TYPES = {
  // === CHAMPS DE BASE ===
  text: {
    type: 'text',
    label: 'Texte',
    icon: 'pencil',
    description: 'Champ texte libre',
    hasChoices: false,
    category: 'basic'
  },
  integer: {
    type: 'integer',
    label: 'Nombre entier',
    icon: 'circle-o',
    description: 'Nombre sans décimales',
    hasChoices: false,
    category: 'basic'
  },
  decimal: {
    type: 'decimal',
    label: 'Nombre décimal',
    icon: 'circle',
    description: 'Nombre avec décimales',
    hasChoices: false,
    category: 'basic'
  },
  range: {
    type: 'range',
    label: 'Curseur (Range)',
    icon: 'random',
    description: 'Sélection d\'une valeur sur une échelle',
    hasChoices: false,
    category: 'basic'
  },
  
  // === CHAMPS DATE/HEURE ===
  date: {
    type: 'date',
    label: 'Date',
    icon: 'calendar',
    description: 'Sélecteur de date',
    hasChoices: false,
    category: 'datetime'
  },
  time: {
    type: 'time',
    label: 'Heure',
    icon: 'clock-o',
    description: 'Sélecteur d\'heure',
    hasChoices: false,
    category: 'datetime'
  },
  datetime: {
    type: 'datetime',
    label: 'Date et heure',
    icon: 'calendar',
    description: 'Date et heure combinées',
    hasChoices: false,
    category: 'datetime'
  },
  
  // === CHAMPS DE SÉLECTION ===
  select_one: {
    type: 'select_one',
    label: 'Choix unique',
    icon: 'dot-circle-o',
    description: 'Une seule réponse possible',
    hasChoices: true,
    category: 'selection'
  },
  select_multiple: {
    type: 'select_multiple',
    label: 'Choix multiples',
    icon: 'check-circle',
    description: 'Plusieurs réponses possibles',
    hasChoices: true,
    category: 'selection'
  },
  rank: {
    type: 'rank',
    label: 'Classement',
    icon: 'bar-chart',
    description: 'Classer des options par ordre de préférence',
    hasChoices: true,
    category: 'selection'
  },
  
  // === CHAMPS GÉOLOCALISATION ===
  geopoint: {
    type: 'geopoint',
    label: 'Point GPS',
    icon: 'map-marker',
    description: 'Coordonnées GPS (un point)',
    hasChoices: false,
    category: 'geo'
  },
  geotrace: {
    type: 'geotrace',
    label: 'Tracé GPS',
    icon: 'link',
    description: 'Ligne ou chemin GPS (plusieurs points)',
    hasChoices: false,
    category: 'geo'
  },
  geoshape: {
    type: 'geoshape',
    label: 'Zone GPS',
    icon: 'cube',
    description: 'Polygone GPS (délimiter une zone)',
    hasChoices: false,
    category: 'geo'
  },
  
  // === CHAMPS MÉDIAS ===
  image: {
    type: 'image',
    label: 'Photo',
    icon: 'image',
    description: 'Capture d\'image ou photo',
    hasChoices: false,
    category: 'media'
  },
  audio: {
    type: 'audio',
    label: 'Audio',
    icon: 'comment',
    description: 'Enregistrement audio',
    hasChoices: false,
    category: 'media'
  },
  video: {
    type: 'video',
    label: 'Vidéo',
    icon: 'file-o',
    description: 'Enregistrement vidéo',
    hasChoices: false,
    category: 'media'
  },
  file: {
    type: 'file',
    label: 'Fichier',
    icon: 'file',
    description: 'Upload de fichier quelconque',
    hasChoices: false,
    category: 'media'
  },
  
  // === CHAMPS SPÉCIAUX ===
  barcode: {
    type: 'barcode',
    label: 'Code-barres / QR',
    icon: 'qrcode',
    description: 'Scanner un code-barres ou QR code',
    hasChoices: false,
    category: 'special'
  },
  calculate: {
    type: 'calculate',
    label: 'Calcul',
    icon: 'cog',
    description: 'Champ calculé automatiquement',
    hasChoices: false,
    category: 'special'
  },
  acknowledge: {
    type: 'acknowledge',
    label: 'Confirmation',
    icon: 'check',
    description: 'Case à cocher de confirmation',
    hasChoices: false,
    category: 'special'
  },
  hidden: {
    type: 'hidden',
    label: 'Champ caché',
    icon: 'lock',
    description: 'Valeur stockée mais non affichée',
    hasChoices: false,
    category: 'special'
  },
  
  // === CHAMPS D'INFORMATION ===
  note: {
    type: 'note',
    label: 'Note / Instruction',
    icon: 'info-circle',
    description: 'Texte d\'information (lecture seule)',
    hasChoices: false,
    category: 'info'
  },
  
  // === CHAMPS MÉTADONNÉES (automatiques) ===
  start: {
    type: 'start',
    label: 'Heure début',
    icon: 'chevron-right',
    description: 'Heure de début de remplissage (auto)',
    hasChoices: false,
    category: 'metadata',
    isAutomatic: true
  },
  end: {
    type: 'end',
    label: 'Heure fin',
    icon: 'ban',
    description: 'Heure de fin de remplissage (auto)',
    hasChoices: false,
    category: 'metadata',
    isAutomatic: true
  },
    today: {
    type: 'today',
    label: 'Date du jour',
    icon: 'calendar',
    description: 'Date actuelle (auto)',
    hasChoices: false,
    category: 'metadata'
  },
  deviceid: {
    type: 'deviceid',
    label: 'ID Appareil',
    icon: 'mobile',
    description: 'Identifiant unique de l\'appareil (auto)',
    hasChoices: false,
    category: 'metadata'
  },
  username: {
    type: 'username',
    label: 'Nom utilisateur',
    icon: 'user',
    description: 'Nom de l\'utilisateur connecté (auto)',
    hasChoices: false,
    category: 'metadata'
  },
  email: {
    type: 'email',
    label: 'Email utilisateur',
    icon: 'asterisk',
    description: 'Email de l\'utilisateur (auto)',
    hasChoices: false,
    category: 'metadata'
  },
  phonenumber: {
    type: 'phonenumber',
    label: 'N° téléphone',
    icon: 'mobile',
    description: 'Numéro de téléphone de l\'appareil (auto)',
    hasChoices: false,
    category: 'metadata'
  }
};

/**
 * Templates de formulaires préconfigurés
 */
export const FORM_TEMPLATES = {
  collecte_terrain: {
    id: 'collecte_terrain',
    name: 'Collecte Terrain Standard',
    description: 'Formulaire de base pour la collecte de données sur le terrain avec GPS automatique et photo',
    icon: 'map-marker',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'agent_name', type: 'text', label: 'Nom de l\'agent', required: true },
      { name: 'date_collecte', type: 'date', label: 'Date de collecte', required: true },
      { name: 'photo_site', type: 'image', label: 'Photo du site' },
      { name: 'observations', type: 'text', label: 'Observations', appearance: 'multiline' },
      { name: 'commentaires', type: 'text', label: 'Commentaires additionnels', appearance: 'multiline' }
    ]
  },
  enquete_simple: {
    id: 'enquete_simple',
    name: 'Enquête Simple',
    description: 'Formulaire d\'enquête avec questions de satisfaction',
    icon: 'file-text',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'nom_repondant', type: 'text', label: 'Nom du répondant', required: true },
      { name: 'date_enquete', type: 'date', label: 'Date de l\'enquête', required: true },
      { 
        name: 'satisfaction', 
        type: 'select_one', 
        label: 'Niveau de satisfaction',
        listName: 'satisfaction_list',
        choices: [
          { name: 'tres_satisfait', label: 'Très satisfait' },
          { name: 'satisfait', label: 'Satisfait' },
          { name: 'neutre', label: 'Neutre' },
          { name: 'insatisfait', label: 'Insatisfait' },
          { name: 'tres_insatisfait', label: 'Très insatisfait' }
        ],
        required: true
      },
      { name: 'commentaires', type: 'text', label: 'Commentaires', appearance: 'multiline' }
    ]
  },
  inventaire: {
    id: 'inventaire',
    name: 'Inventaire / Comptage',
    description: 'Formulaire pour inventaire avec catégories et quantités',
    icon: 'bar-chart',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'date_inventaire', type: 'date', label: 'Date de l\'inventaire', required: true },
      { 
        name: 'categorie', 
        type: 'select_one', 
        label: 'Catégorie',
        listName: 'categorie_list',
        choices: [
          { name: 'cat_a', label: 'Catégorie A' },
          { name: 'cat_b', label: 'Catégorie B' },
          { name: 'cat_c', label: 'Catégorie C' },
          { name: 'autre', label: 'Autre' }
        ],
        required: true
      },
      { name: 'quantite', type: 'integer', label: 'Quantité', required: true },
      { 
        name: 'etat', 
        type: 'select_one', 
        label: 'État',
        listName: 'etat_list',
        choices: [
          { name: 'bon', label: 'Bon état' },
          { name: 'moyen', label: 'État moyen' },
          { name: 'mauvais', label: 'Mauvais état' }
        ]
      },
      { name: 'photo', type: 'image', label: 'Photo' },
      { name: 'remarques', type: 'text', label: 'Remarques', appearance: 'multiline' }
    ]
  },
  rapport_incident: {
    id: 'rapport_incident',
    name: 'Rapport d\'Incident',
    description: 'Formulaire pour signaler des incidents sur le terrain',
    icon: 'exclamation-triangle',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'date_incident', type: 'datetime', label: 'Date et heure de l\'incident', required: true },
      { 
        name: 'type_incident', 
        type: 'select_one', 
        label: 'Type d\'incident',
        listName: 'type_incident_list',
        choices: [
          { name: 'securite', label: 'Sécurité' },
          { name: 'materiel', label: 'Problème matériel' },
          { name: 'environnement', label: 'Environnement' },
          { name: 'autre', label: 'Autre' }
        ],
        required: true
      },
      { 
        name: 'gravite', 
        type: 'select_one', 
        label: 'Gravité',
        listName: 'gravite_list',
        choices: [
          { name: 'faible', label: 'Faible' },
          { name: 'moyenne', label: 'Moyenne' },
          { name: 'elevee', label: 'Élevée' },
          { name: 'critique', label: 'Critique' }
        ],
        required: true
      },
      { name: 'description', type: 'text', label: 'Description de l\'incident', required: true, appearance: 'multiline' },
      { name: 'photo_incident', type: 'image', label: 'Photo de l\'incident' },
      { name: 'actions_prises', type: 'text', label: 'Actions prises', appearance: 'multiline' },
      { name: 'rapporteur', type: 'text', label: 'Nom du rapporteur', required: true }
    ]
  },

  // ========== TEMPLATES MÉTIER SAAHDEL (Cahier des charges) ==========
  
  economie_agricole: {
    id: 'economie_agricole',
    name: 'Économie Agricole',
    description: 'Suivi des activités agricoles génératrices de revenus',
    icon: 'star',
    category: 'metier',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'agent_collecteur', type: 'text', label: 'Nom de l\'agent collecteur', required: true },
      { name: 'date_visite', type: 'date', label: 'Date de la visite', required: true },
      { name: 'nom_beneficiaire', type: 'text', label: 'Nom du bénéficiaire', required: true },
      { name: 'contact_beneficiaire', type: 'text', label: 'Contact téléphonique' },
      { 
        name: 'type_culture', 
        type: 'select_one', 
        label: 'Type de culture',
        listName: 'type_culture_list',
        choices: [
          { name: 'cereales', label: 'Céréales (maïs, mil, sorgho)' },
          { name: 'legumineuses', label: 'Légumineuses (haricot, arachide)' },
          { name: 'tubercules', label: 'Tubercules (manioc, igname, patate)' },
          { name: 'maraichage', label: 'Maraîchage (légumes)' },
          { name: 'fruits', label: 'Arboriculture fruitière' },
          { name: 'autre', label: 'Autre' }
        ],
        required: true
      },
      { name: 'superficie_hectares', type: 'decimal', label: 'Superficie exploitée (hectares)', required: true },
      { 
        name: 'stade_culture', 
        type: 'select_one', 
        label: 'Stade de la culture',
        listName: 'stade_culture_list',
        choices: [
          { name: 'preparation', label: 'Préparation du sol' },
          { name: 'semis', label: 'Semis / Plantation' },
          { name: 'croissance', label: 'Croissance' },
          { name: 'floraison', label: 'Floraison' },
          { name: 'recolte', label: 'Récolte' },
          { name: 'post_recolte', label: 'Post-récolte' }
        ]
      },
      { name: 'quantite_recoltee', type: 'decimal', label: 'Quantité récoltée (kg)', hint: 'Laisser vide si pas encore récolté' },
      { name: 'prix_vente_unitaire', type: 'integer', label: 'Prix de vente unitaire (FCFA/kg)' },
      { name: 'revenus_generes', type: 'integer', label: 'Revenus générés (FCFA)' },
      { 
        name: 'difficultes_rencontrees', 
        type: 'select_multiple', 
        label: 'Difficultés rencontrées',
        listName: 'difficultes_list',
        choices: [
          { name: 'secheresse', label: 'Sécheresse' },
          { name: 'inondation', label: 'Inondation' },
          { name: 'ravageurs', label: 'Ravageurs / Maladies' },
          { name: 'intrants', label: 'Manque d\'intrants' },
          { name: 'main_oeuvre', label: 'Manque de main d\'œuvre' },
          { name: 'acces_marche', label: 'Accès au marché difficile' },
          { name: 'aucune', label: 'Aucune difficulté' }
        ]
      },
      { name: 'photo_parcelle', type: 'image', label: 'Photo de la parcelle', required: true },
      { name: 'observations', type: 'text', label: 'Observations et recommandations', appearance: 'multiline' }
    ]
  },

  economie_piscicole: {
    id: 'economie_piscicole',
    name: 'Économie Piscicole',
    description: 'Suivi des activités piscicoles et aquacoles',
    icon: 'circle',
    category: 'metier',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'agent_collecteur', type: 'text', label: 'Nom de l\'agent collecteur', required: true },
      { name: 'date_visite', type: 'date', label: 'Date de la visite', required: true },
      { name: 'nom_exploitant', type: 'text', label: 'Nom de l\'exploitant', required: true },
      { name: 'contact_exploitant', type: 'text', label: 'Contact téléphonique' },
      { 
        name: 'type_exploitation', 
        type: 'select_one', 
        label: 'Type d\'exploitation',
        listName: 'type_exploitation_list',
        choices: [
          { name: 'etang', label: 'Étang piscicole' },
          { name: 'cage', label: 'Cage flottante' },
          { name: 'bassin', label: 'Bassin en béton' },
          { name: 'rizipisciculture', label: 'Rizipisciculture' },
          { name: 'autre', label: 'Autre' }
        ],
        required: true
      },
      { name: 'nombre_unites', type: 'integer', label: 'Nombre d\'unités (étangs/cages/bassins)', required: true },
      { name: 'surface_totale', type: 'decimal', label: 'Surface totale en eau (m²)' },
      { 
        name: 'especes_elevees', 
        type: 'select_multiple', 
        label: 'Espèces élevées',
        listName: 'especes_list',
        choices: [
          { name: 'tilapia', label: 'Tilapia' },
          { name: 'clarias', label: 'Clarias (Silure)' },
          { name: 'carpe', label: 'Carpe' },
          { name: 'heterotis', label: 'Heterotis' },
          { name: 'autre', label: 'Autre espèce' }
        ],
        required: true
      },
      { name: 'nombre_alevins', type: 'integer', label: 'Nombre d\'alevins mis en charge' },
      { name: 'date_empoissonnement', type: 'date', label: 'Date d\'empoissonnement' },
      { 
        name: 'type_alimentation', 
        type: 'select_one', 
        label: 'Type d\'alimentation',
        listName: 'alimentation_list',
        choices: [
          { name: 'granules', label: 'Granulés industriels' },
          { name: 'artisanal', label: 'Aliment artisanal' },
          { name: 'mixte', label: 'Alimentation mixte' },
          { name: 'naturel', label: 'Alimentation naturelle' }
        ]
      },
      { name: 'quantite_recolte', type: 'decimal', label: 'Quantité récoltée (kg)', hint: 'Dernière récolte' },
      { name: 'prix_vente_kg', type: 'integer', label: 'Prix de vente (FCFA/kg)' },
      { name: 'revenus_generes', type: 'integer', label: 'Revenus générés (FCFA)' },
      { 
        name: 'problemes_rencontres', 
        type: 'select_multiple', 
        label: 'Problèmes rencontrés',
        listName: 'problemes_piscicole_list',
        choices: [
          { name: 'mortalite', label: 'Mortalité élevée' },
          { name: 'predateurs', label: 'Prédateurs' },
          { name: 'qualite_eau', label: 'Qualité de l\'eau' },
          { name: 'aliments', label: 'Manque d\'aliments' },
          { name: 'alevins', label: 'Manque d\'alevins' },
          { name: 'vol', label: 'Vol / Braconnage' },
          { name: 'aucun', label: 'Aucun problème' }
        ]
      },
      { name: 'photo_site', type: 'image', label: 'Photo du site piscicole', required: true },
      { name: 'observations', type: 'text', label: 'Observations et recommandations', appearance: 'multiline' }
    ]
  },

  supervision_agroeco: {
    id: 'supervision_agroeco',
    name: 'Supervision Agro-écologique',
    description: 'Suivi et évaluation des pratiques agro-écologiques',
    icon: 'map-marker',
    category: 'metier',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'superviseur', type: 'text', label: 'Nom du superviseur', required: true },
      { name: 'date_supervision', type: 'date', label: 'Date de supervision', required: true },
      { name: 'nom_site', type: 'text', label: 'Nom du site / Exploitation', required: true },
      { name: 'responsable_site', type: 'text', label: 'Responsable du site' },
      { 
        name: 'type_activite', 
        type: 'select_multiple', 
        label: 'Types d\'activités sur le site',
        listName: 'activite_agroeco_list',
        choices: [
          { name: 'agriculture', label: 'Agriculture' },
          { name: 'elevage', label: 'Élevage' },
          { name: 'pisciculture', label: 'Pisciculture' },
          { name: 'agroforesterie', label: 'Agroforesterie' },
          { name: 'apiculture', label: 'Apiculture' },
          { name: 'transformation', label: 'Transformation' }
        ],
        required: true
      },
      { 
        name: 'pratiques_agroeco', 
        type: 'select_multiple', 
        label: 'Pratiques agro-écologiques observées',
        listName: 'pratiques_list',
        choices: [
          { name: 'compostage', label: 'Compostage' },
          { name: 'paillage', label: 'Paillage / Mulching' },
          { name: 'rotation', label: 'Rotation des cultures' },
          { name: 'association', label: 'Association de cultures' },
          { name: 'haies', label: 'Haies vives / Brise-vent' },
          { name: 'bio_pesticides', label: 'Bio-pesticides' },
          { name: 'conservation_eau', label: 'Conservation de l\'eau' },
          { name: 'semences_locales', label: 'Semences locales' },
          { name: 'aucune', label: 'Aucune pratique observée' }
        ]
      },
      { 
        name: 'niveau_adoption', 
        type: 'select_one', 
        label: 'Niveau d\'adoption des pratiques',
        listName: 'niveau_adoption_list',
        choices: [
          { name: 'debutant', label: 'Débutant (moins de 25%)' },
          { name: 'intermediaire', label: 'Intermédiaire (25-50%)' },
          { name: 'avance', label: 'Avancé (50-75%)' },
          { name: 'expert', label: 'Expert (plus de 75%)' }
        ],
        required: true
      },
      { 
        name: 'etat_biodiversite', 
        type: 'select_one', 
        label: 'État de la biodiversité',
        listName: 'biodiversite_list',
        choices: [
          { name: 'excellent', label: 'Excellent' },
          { name: 'bon', label: 'Bon' },
          { name: 'moyen', label: 'Moyen' },
          { name: 'faible', label: 'Faible' },
          { name: 'critique', label: 'Critique' }
        ]
      },
      { 
        name: 'etat_sol', 
        type: 'select_one', 
        label: 'État du sol',
        listName: 'etat_sol_list',
        choices: [
          { name: 'fertile', label: 'Fertile' },
          { name: 'moyennement_fertile', label: 'Moyennement fertile' },
          { name: 'degrade', label: 'Dégradé' },
          { name: 'tres_degrade', label: 'Très dégradé' }
        ]
      },
      { name: 'nombre_beneficiaires', type: 'integer', label: 'Nombre de bénéficiaires directs' },
      { name: 'superficie_couverte', type: 'decimal', label: 'Superficie couverte (hectares)' },
      { 
        name: 'besoins_identifies', 
        type: 'select_multiple', 
        label: 'Besoins identifiés',
        listName: 'besoins_list',
        choices: [
          { name: 'formation', label: 'Formation technique' },
          { name: 'equipements', label: 'Équipements' },
          { name: 'intrants', label: 'Intrants biologiques' },
          { name: 'financement', label: 'Financement' },
          { name: 'accompagnement', label: 'Accompagnement de proximité' },
          { name: 'commercialisation', label: 'Appui à la commercialisation' }
        ]
      },
      { name: 'photo_1', type: 'image', label: 'Photo 1 - Vue générale', required: true },
      { name: 'photo_2', type: 'image', label: 'Photo 2 - Détail des pratiques' },
      { name: 'points_forts', type: 'text', label: 'Points forts observés', appearance: 'multiline' },
      { name: 'points_amelioration', type: 'text', label: 'Points d\'amélioration', appearance: 'multiline' },
      { name: 'recommandations', type: 'text', label: 'Recommandations', appearance: 'multiline', required: true }
    ]
  },

  suivi_elevage: {
    id: 'suivi_elevage',
    name: 'Suivi Élevage',
    description: 'Suivi des activités d\'elevage (bovins, ovins, caprins, volailles)',
    icon: 'tag',
    category: 'metier',
    fields: [
      { name: 'start', type: 'start', label: 'Début', isAutomatic: true },
      { name: 'end', type: 'end', label: 'Fin', isAutomatic: true },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil', isAutomatic: true },
      { name: 'position_collecte', type: 'geopoint', label: 'Position GPS', required: true },
      { name: 'agent_collecteur', type: 'text', label: 'Nom de l\'agent', required: true },
      { name: 'date_visite', type: 'date', label: 'Date de la visite', required: true },
      { name: 'nom_eleveur', type: 'text', label: 'Nom de l\'éleveur', required: true },
      { name: 'contact', type: 'text', label: 'Contact téléphonique' },
      { 
        name: 'type_elevage', 
        type: 'select_multiple', 
        label: 'Type d\'élevage',
        listName: 'type_elevage_list',
        choices: [
          { name: 'bovins', label: 'Bovins' },
          { name: 'ovins', label: 'Ovins (moutons)' },
          { name: 'caprins', label: 'Caprins (chèvres)' },
          { name: 'porcins', label: 'Porcins' },
          { name: 'volailles', label: 'Volailles' },
          { name: 'lapins', label: 'Lapins' },
          { name: 'autre', label: 'Autre' }
        ],
        required: true
      },
      { name: 'effectif_total', type: 'integer', label: 'Effectif total du cheptel', required: true },
      { 
        name: 'mode_elevage', 
        type: 'select_one', 
        label: 'Mode d\'élevage',
        listName: 'mode_elevage_list',
        choices: [
          { name: 'extensif', label: 'Extensif (pâturage libre)' },
          { name: 'semi_intensif', label: 'Semi-intensif' },
          { name: 'intensif', label: 'Intensif (stabulation)' }
        ]
      },
      { 
        name: 'etat_sanitaire', 
        type: 'select_one', 
        label: 'État sanitaire général',
        listName: 'etat_sanitaire_list',
        choices: [
          { name: 'excellent', label: 'Excellent' },
          { name: 'bon', label: 'Bon' },
          { name: 'moyen', label: 'Moyen' },
          { name: 'mauvais', label: 'Mauvais' }
        ],
        required: true
      },
      { name: 'vaccination_jour', type: 'select_one', label: 'Vaccination à jour ?', listName: 'oui_non_list', choices: [{ name: 'oui', label: 'Oui' }, { name: 'non', label: 'Non' }, { name: 'partiel', label: 'Partiellement' }] },
      { name: 'naissances_recentes', type: 'integer', label: 'Naissances récentes (3 derniers mois)' },
      { name: 'mortalites_recentes', type: 'integer', label: 'Mortalités récentes (3 derniers mois)' },
      { name: 'ventes_recentes', type: 'integer', label: 'Ventes récentes (3 derniers mois)' },
      { name: 'revenus_ventes', type: 'integer', label: 'Revenus des ventes (FCFA)' },
      { 
        name: 'difficultes', 
        type: 'select_multiple', 
        label: 'Difficultés rencontrées',
        listName: 'difficultes_elevage_list',
        choices: [
          { name: 'alimentation', label: 'Alimentation insuffisante' },
          { name: 'eau', label: 'Accès à l\'eau' },
          { name: 'maladies', label: 'Maladies' },
          { name: 'veterinaire', label: 'Accès aux soins vétérinaires' },
          { name: 'vol', label: 'Vol de bétail' },
          { name: 'marche', label: 'Accès au marché' },
          { name: 'aucune', label: 'Aucune' }
        ]
      },
      { name: 'photo_elevage', type: 'image', label: 'Photo de l\'élevage', required: true },
      { name: 'observations', type: 'text', label: 'Observations', appearance: 'multiline' }
    ]
  },

  formulaire_vide: {
    id: 'formulaire_vide',
    name: 'Formulaire Vierge',
    description: 'Commencer avec un formulaire vide et ajouter vos propres champs',
    icon: 'file-o',
    category: 'base',
    fields: [
      { name: 'start', type: 'start', label: 'Début' },
      { name: 'end', type: 'end', label: 'Fin' },
      { name: 'deviceid', type: 'deviceid', label: 'ID Appareil' }
    ]
  }
};

/**
 * Génère un identifiant unique pour un champ
 */
export function generateFieldId() {
  return 'field_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Nettoie un nom pour le rendre compatible XLSForm
 * @param {string} name - Nom à nettoyer
 * @returns {string} - Nom nettoyé (snake_case, sans caractères spéciaux)
 */
export function sanitizeFieldName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9_]/g, '_')      // Remplace les caractères spéciaux
    .replace(/_+/g, '_')              // Évite les underscores multiples
    .replace(/^_|_$/g, '');           // Supprime les underscores en début/fin
}

/**
 * Génère le contenu de la feuille 'survey'
 * @param {Array} fields - Liste des champs du formulaire
 * @returns {Array} - Données pour la feuille survey
 */
function generateSurveySheet(fields) {
  const headers = ['type', 'name', 'label', 'required', 'appearance', 'hint', 'constraint', 'constraint_message', 'relevant', 'calculation', 'default', 'parameters'];
  const rows = [headers];

  for (const field of fields) {
    let type = field.type;
    
    // Pour les types select, rank: ajouter le nom de la liste
    if (type === 'select_one' || type === 'select_multiple' || type === 'rank') {
      const listName = field.listName || sanitizeFieldName(field.name) + '_list';
      type = `${type} ${listName}`;
    }

    // Construire les paramètres pour range
    let parameters = '';
    if (field.type === 'range' && field.parameters) {
      const { start = 0, end = 100, step = 1 } = field.parameters;
      parameters = `start=${start} end=${end} step=${step}`;
    }

    const row = [
      type,
      field.name,
      field.label || '',
      field.required ? 'yes' : '',
      field.appearance || '',
      field.hint || '',
      field.constraint || '',
      field.constraintMessage || '',
      field.relevant || '',
      field.calculation || '',  // Pour les champs calculate
      field.default || '',      // Pour les valeurs par défaut (hidden, etc.)
      parameters                // Pour range
    ];
    rows.push(row);
  }

  return rows;
}

/**
 * Génère le contenu de la feuille 'choices'
 * @param {Array} fields - Liste des champs du formulaire
 * @returns {Array} - Données pour la feuille choices
 */
function generateChoicesSheet(fields) {
  const headers = ['list_name', 'name', 'label'];
  const rows = [headers];

  for (const field of fields) {
    // Support pour select_one, select_multiple ET rank
    if (field.choices && field.choices.length > 0 && 
        (field.type === 'select_one' || field.type === 'select_multiple' || field.type === 'rank')) {
      const listName = field.listName || sanitizeFieldName(field.name) + '_list';
      for (const choice of field.choices) {
        rows.push([
          listName,
          choice.name || sanitizeFieldName(choice.label),
          choice.label
        ]);
      }
    }
  }

  return rows;
}

/**
 * Génère le contenu de la feuille 'settings'
 * @param {Object} formSettings - Paramètres du formulaire
 * @returns {Array} - Données pour la feuille settings
 */
function generateSettingsSheet(formSettings) {
  const headers = ['form_title', 'form_id', 'version', 'default_language', 'instance_name'];
  const row = [
    formSettings.title || 'Formulaire AGR-Collect',
    formSettings.id || 'form_' + Date.now(),
    formSettings.version || '1',
    formSettings.language || 'French',
    formSettings.instanceName || ''
  ];
  return [headers, row];
}

/**
 * Génère un fichier XLSForm complet
 * @param {Object} formDefinition - Définition du formulaire
 * @param {string} formDefinition.title - Titre du formulaire
 * @param {string} formDefinition.id - ID unique du formulaire
 * @param {Array} formDefinition.fields - Liste des champs
 * @returns {Blob} - Fichier XLSX en Blob
 */
export function generateXLSForm(formDefinition) {
  const { title, id, fields, version = '1', language = 'French' } = formDefinition;

  // Créer le workbook
  const workbook = XLSX.utils.book_new();

  // Générer et ajouter la feuille survey
  const surveyData = generateSurveySheet(fields);
  const surveySheet = XLSX.utils.aoa_to_sheet(surveyData);
  XLSX.utils.book_append_sheet(workbook, surveySheet, 'survey');

  // Générer et ajouter la feuille choices (seulement si nécessaire)
  const choicesData = generateChoicesSheet(fields);
  if (choicesData.length > 1) {
    const choicesSheet = XLSX.utils.aoa_to_sheet(choicesData);
    XLSX.utils.book_append_sheet(workbook, choicesSheet, 'choices');
  }

  // Générer et ajouter la feuille settings
  const settingsData = generateSettingsSheet({ title, id, version, language });
  const settingsSheet = XLSX.utils.aoa_to_sheet(settingsData);
  XLSX.utils.book_append_sheet(workbook, settingsSheet, 'settings');

  // Convertir en buffer puis en Blob
  const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([xlsxBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });

  return blob;
}

/**
 * Génère un fichier XLSForm et le télécharge
 * @param {Object} formDefinition - Définition du formulaire
 * @param {string} filename - Nom du fichier (sans extension)
 */
export function downloadXLSForm(formDefinition, filename) {
  const blob = generateXLSForm(formDefinition);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename || formDefinition.id || 'form'}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Crée un objet File à partir de la définition du formulaire
 * (utilisé pour l'upload vers l'API)
 * @param {Object} formDefinition - Définition du formulaire
 * @param {string} filename - Nom du fichier
 * @returns {File} - Objet File
 */
export function createXLSFormFile(formDefinition, filename) {
  const blob = generateXLSForm(formDefinition);
  const file = new File(
    [blob], 
    `${filename || formDefinition.id || 'form'}.xlsx`,
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  );
  return file;
}

/**
 * Génère les champs métadonnées obligatoires pour tout formulaire
 * Inclut: start, end, deviceid, et geopoint pour la géolocalisation
 * @returns {Array} - Liste des champs métadonnées
 */
export function generateRequiredMetadataFields() {
  return [
    { 
      id: generateFieldId(), 
      type: 'start', 
      name: 'start', 
      label: 'Début de remplissage',
      required: false,
      isAutomatic: true
    },
    { 
      id: generateFieldId(), 
      type: 'end', 
      name: 'end', 
      label: 'Fin de remplissage',
      required: false,
      isAutomatic: true
    },
    { 
      id: generateFieldId(), 
      type: 'deviceid', 
      name: 'deviceid', 
      label: 'ID Appareil',
      required: false,
      isAutomatic: true
    },
    { 
      id: generateFieldId(), 
      type: 'geopoint', 
      name: 'position_collecte', 
      label: 'Position GPS de la collecte',
      hint: 'Capturez votre position actuelle',
      required: true,
      isAutomatic: false
    }
  ];
}

/**
 * Vérifie si un formulaire contient les champs métadonnées requis
 * @param {Array} fields - Liste des champs
 * @returns {Object} - { hasGeopoint, hasStart, hasEnd, hasDeviceid }
 */
export function checkRequiredMetadata(fields) {
  const result = {
    hasGeopoint: false,
    hasStart: false,
    hasEnd: false,
    hasDeviceid: false
  };
  
  for (const field of fields) {
    if (field.type === 'geopoint') result.hasGeopoint = true;
    if (field.type === 'start') result.hasStart = true;
    if (field.type === 'end') result.hasEnd = true;
    if (field.type === 'deviceid') result.hasDeviceid = true;
  }
  
  return result;
}

/**
 * Valide une définition de formulaire
 * @param {Object} formDefinition - Définition à valider
 * @returns {Object} - { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateFormDefinition(formDefinition) {
  const errors = [];
  const warnings = [];

  if (!formDefinition.title || formDefinition.title.trim() === '') {
    errors.push('Le titre du formulaire est requis');
  }

  if (!formDefinition.id || formDefinition.id.trim() === '') {
    errors.push('L\'identifiant du formulaire est requis');
  } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formDefinition.id)) {
    errors.push('L\'identifiant doit commencer par une lettre et ne contenir que des lettres, chiffres et underscores');
  }

  if (!formDefinition.fields || formDefinition.fields.length === 0) {
    errors.push('Le formulaire doit contenir au moins un champ');
  } else {
    const fieldNames = new Set();
    for (const field of formDefinition.fields) {
      if (!field.name) {
        errors.push('Tous les champs doivent avoir un nom');
      } else if (fieldNames.has(field.name)) {
        errors.push(`Nom de champ dupliqué: ${field.name}`);
      } else {
        fieldNames.add(field.name);
      }

      if (!field.type) {
        errors.push(`Le champ "${field.name || 'sans nom'}" doit avoir un type`);
      }

      // Vérifier les choix pour les types select et rank
      if ((field.type === 'select_one' || field.type === 'select_multiple' || field.type === 'rank') && 
          (!field.choices || field.choices.length === 0)) {
        errors.push(`Le champ "${field.name}" doit avoir au moins une option`);
      }
    }
    
    // Vérifier la présence de la géolocalisation (obligatoire selon cahier des charges)
    const metadata = checkRequiredMetadata(formDefinition.fields);
    if (!metadata.hasGeopoint) {
      warnings.push('ATTENTION: Ce formulaire ne capture pas la position GPS. Ajoutez un champ "Position GPS" pour respecter les exigences de traçabilité.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export default {
  FIELD_TYPES,
  FORM_TEMPLATES,
  generateFieldId,
  sanitizeFieldName,
  generateXLSForm,
  downloadXLSForm,
  generateRequiredMetadataFields,
  checkRequiredMetadata,
  createXLSFormFile,
  validateFormDefinition
};
