<p align="center">
  <img src="central/client/public/favicon.svg" alt="AGR-Collect Logo" width="80" height="80"/>
</p>

<h1 align="center">AGR-Collect</h1>

<p align="center">
  <strong>Plateforme de Collecte de Données Terrain — Fiable, Géolocalisée, Hors-ligne</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-Node.js_18-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Database-PostgreSQL_14-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Frontend-Vue_3-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3"/>
  <img src="https://img.shields.io/badge/Mobile-Android_(Kotlin)-3DDC84?logo=android&logoColor=white" alt="Android"/>
  <img src="https://img.shields.io/badge/Infra-Docker_Compose-2496ED?logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/License-Apache_2.0-blue" alt="License"/>
</p>

---

## Table des Matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture Technique](#architecture-technique)
- [Stack Technologique](#stack-technologique)
- [Structure du Projet](#structure-du-projet)
- [Prérequis](#prérequis)
- [Installation & Lancement Local](#installation--lancement-local)
- [Accès Administrateur](#accès-administrateur)
- [Utilisation de l'Interface Web](#utilisation-de-linterface-web)
- [API REST](#api-rest)
- [Gestion des Utilisateurs](#gestion-des-utilisateurs)
- [Développement Frontend](#développement-frontend)
- [Commandes Utiles](#commandes-utiles)
- [Dépannage](#dépannage)
- [Roadmap](#roadmap)

---

## Présentation

**AGR-Collect** est un système complet de collecte de données terrain développé pour l'ONG **SAAHDEL**, destiné à opérer dans les **zones rurales africaines**. Il permet aux agents de terrain de collecter des informations structurées — même **sans connexion Internet** — avec géolocalisation GPS, capture de photos, horodatage et traçabilité complète.

Le système repose sur trois composants principaux :

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| **Backend (Central)** | Node.js + PostgreSQL + Docker | Serveur API, gestion des utilisateurs, stockage des données |
| **Mobile (Collect)** | Android / Kotlin | Application de collecte terrain, mode hors-ligne |
| **Formulaires Web (Enketo)** | Enketo Express | Remplissage de formulaires via navigateur web |

### Les 3 Rôles Utilisateur

| Rôle | Droits |
|------|--------|
| **Administrateur** | Gestion complète : utilisateurs, formulaires, projets, sites, rapports |
| **Agent Terrain** | Collecte de données, synchronisation, consultation de rapports personnels |
| **Sponsor** | Consultation seule : rapports, cartes, statistiques |

---

## Fonctionnalités

### Collecte de Données
- Collecte **offline** avec synchronisation automatique
- Géolocalisation **GPS** automatique à chaque soumission
- Capture de **photos** et pièces jointes
- **Horodatage** et traçabilité complète
- Authentification obligatoire des agents

### Gestion & Administration
- Gestion des **utilisateurs et rôles** (Admin, Manager, Collecteur, App User)
- Création et gestion de **projets** avec permissions granulaires
- Upload de formulaires **XLSForm** (.xlsx) avec conversion automatique en XForm
- Versionnement des formulaires
- Gestion des **sites de collecte** personnalisés

### Rapports & Export
- **Dashboard** de statistiques avec graphiques interactifs
- Export **PDF** professionnel des rapports (par projet, par formulaire)
- Filtres avancés : par zone, date, agent, formulaire
- Export des données en **CSV / JSON / OData**
- Intégration avec **Power BI**, **Excel**, **Python** (pyAGR), **R** (ruAGR)

### Sécurité
- Chiffrement **SSL/TLS** des communications
- Authentification par **sessions JWT**
- Gestion fine des **permissions** par projet
- Support du chiffrement des formulaires

---

## Architecture Technique

```
┌──────────────────────────────────────────────────────────────────┐
│                        AGR-Collect Stack                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Clients (Navigateur / Mobile)                                  │
│        │                                                         │
│        ▼                                                         │
│   ┌──────────────┐                                               │
│   │    NGINX     │  ← Reverse proxy + SSL/TLS                    │
│   │   :80/:443   │     (certificat auto-signé en dev,            │
│   └──────┬───────┘      Let's Encrypt en production)             │
│          │                                                       │
│     ┌────┴─────────────────────────────┐                         │
│     ▼                                  ▼                         │
│   ┌──────────────┐            ┌────────────────┐                 │
│   │   SERVICE    │            │    CLIENT       │                 │
│   │  (Backend)   │            │   (Frontend)    │                 │
│   │  Node.js API │            │    Vue 3 SPA    │                 │
│   │    :8383     │            │  (servi par     │                 │
│   └──────┬───────┘            │   Nginx)        │                 │
│          │                    └────────────────┘                 │
│     ┌────┼──────────┬──────────────┐                             │
│     ▼    ▼          ▼              ▼                             │
│ ┌──────┐ ┌────────┐ ┌──────────┐ ┌──────────┐                   │
│ │Postgr│ │ Enketo │ │ PyXForm  │ │   Mail   │                   │
│ │SQL 14│ │ :8005  │ │  :5001   │ │   :25    │                   │
│ │:5432 │ └───┬────┘ └──────────┘ └──────────┘                   │
│ └──────┘     │                                                   │
│         ┌────┴────┐                                              │
│         ▼         ▼                                              │
│     ┌──────┐  ┌──────┐                                           │
│     │Redis │  │Redis │                                           │
│     │Main  │  │Cache │                                           │
│     │:6379 │  │:6380 │                                           │
│     └──────┘  └──────┘                                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
         ▲
         │ HTTPS (API REST + OpenRosa)
         │
    ┌────┴─────┐
    │   AGR    │
    │ Collect  │
    │ (Mobile) │
    └──────────┘
```

### Description des Services

| Service | Rôle | Port |
|---------|------|------|
| **Nginx** | Reverse proxy, terminaison SSL, routage | 80, 443 |
| **Service** | API REST principale (Node.js), logique métier | 8383 |
| **PostgreSQL 14** | Base de données relationnelle | 5432 |
| **Enketo** | Moteur de formulaires web (aperçu, remplissage) | 8005 |
| **PyXForm** | Conversion XLSForm (.xlsx) → XForm (.xml) | 5001 |
| **Redis Main** | Cache principal pour Enketo | 6379 |
| **Redis Cache** | Cache secondaire | 6380 |
| **Mail** | Envoi d'emails (invitations, réinitialisation) | 25 |

---

## Stack Technologique

| Couche | Technologies |
|--------|-------------|
| **Backend** | Node.js 18, Express, Slonik (PostgreSQL), Passport.js |
| **Base de données** | PostgreSQL 14 |
| **Frontend** | Vue 3, Vue Router, Vuex, SCSS, Bootstrap |
| **Mobile** | Android (Kotlin), AGR Collect |
| **Formulaires Web** | Enketo Express, @getAGR/web-forms |
| **Infrastructure** | Docker, Docker Compose, Nginx |
| **Conversion** | PyXForm (XLSForm → XForm) |
| **Cache** | Redis |
| **Email** | Exim4 (SMTP) |

---

## Structure du Projet

```
AGR-Collect/
├── central/                        # Backend + Frontend (Docker Compose)
│   ├── client/                     # Frontend Vue 3
│   │   ├── src/
│   │   │   ├── components/         # Composants Vue
│   │   │   │   ├── account/        # Authentification (login, claim, etc.)
│   │   │   │   ├── dashboard/      # Tableau de bord principal
│   │   │   │   ├── form/           # Gestion des formulaires
│   │   │   │   ├── project/        # Gestion des projets
│   │   │   │   ├── reports/        # Rapports PDF et statistiques
│   │   │   │   ├── sites/          # Gestion des sites de collecte
│   │   │   │   ├── submission/     # Visualisation des soumissions
│   │   │   │   ├── user/           # Gestion des utilisateurs
│   │   │   │   └── ...
│   │   │   ├── assets/             # SCSS, images, polices
│   │   │   ├── composables/        # Composition API hooks
│   │   │   ├── locales/            # Traductions (i18n)
│   │   │   ├── request-data/       # Couche d'accès aux données
│   │   │   ├── router.js           # Configuration des routes
│   │   │   └── main.js             # Point d'entrée
│   │   ├── public/                 # Fichiers statiques (favicon, etc.)
│   │   └── package.json
│   ├── server/                     # Backend Node.js
│   │   └── lib/
│   │       ├── http/               # Serveur HTTP
│   │       ├── model/              # Modèles de données, migrations
│   │       ├── resources/          # Contrôleurs API REST
│   │       └── formats/            # Formats de sortie (CSV, JSON, etc.)
│   ├── files/                      # Configuration Nginx, services
│   ├── docker-compose.yml          # Orchestration des services
│   ├── .env                        # Variables d'environnement
│   └── Makefile
├── collect/                        # Application mobile Android (Kotlin)
├── web-forms/                      # @getAGR/web-forms (moteur formulaires)
├── formulaires/                    # Formulaires XLSForm de test
├── scripts/                        # Scripts utilitaires
├── .gitignore
└── README.md                       # Ce fichier
```

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

| Outil | Version minimale | Téléchargement |
|-------|-----------------|----------------|
| **Docker Desktop** | 24.x+ | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Docker Compose** | 2.x+ (inclus dans Docker Desktop) | — |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com/) |
| **Node.js** (pour le dev frontend) | 18.x LTS | [nodejs.org](https://nodejs.org/) |
| **npm** (pour le dev frontend) | 9.x+ | Inclus avec Node.js |

> **Note Windows** : Docker Desktop doit être en mode **Linux containers** (par défaut).

---

## Installation & Lancement Local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Djouko/AGR-COLLECT.git
cd AGR-COLLECT
```

### 2. Configurer les variables d'environnement

Le fichier `central/.env` contient la configuration. Vérifiez et ajustez si nécessaire :

```bash
# central/.env
DOMAIN=localhost
SYSADMIN_EMAIL=admin@agr-collect.local
SSL_TYPE=selfsign
HTTP_PORT=80
HTTPS_PORT=443
```

> **Important** : Le `DOMAIN=localhost` est configuré pour le développement local avec un certificat SSL auto-signé. Pour la production, utilisez un vrai domaine avec Let's Encrypt.

### 3. Démarrer les services Docker

```bash
cd central
docker compose up -d
```

Le premier démarrage prend **5 à 10 minutes** car Docker doit construire toutes les images. Les démarrages suivants sont quasi instantanés.

### 4. Vérifier que tous les services tournent

```bash
docker compose ps
```

Vous devez voir **8 services** avec le statut `Up` ou `healthy` :

```
NAME                STATUS
central-nginx-1     Up (healthy)
central-service-1   Up
central-postgres14  Up
central-enketo-1    Up
central-pyxform-1   Up
central-redis_main  Up
central-redis_cache Up
central-mail-1      Up
```

### 5. Créer le compte administrateur

Lors de la **première installation**, créez le compte admin :

```bash
# Créer l'utilisateur
docker exec -i central-service-1 sh -c \
  "echo 'agrcollect2025' | node lib/bin/cli.js -u admin@agr-collect.local user-create"

# Le promouvoir administrateur
docker exec central-service-1 \
  node lib/bin/cli.js -u admin@agr-collect.local user-promote
```

### 6. Accéder à l'interface web

Ouvrez votre navigateur et accédez à :

```
https://localhost
```

> **Note** : Le navigateur affichera un avertissement de sécurité à cause du certificat auto-signé. Cliquez sur **"Avancé"** → **"Continuer vers localhost"** pour accéder au site.

---

## Accès Administrateur

| Champ | Valeur |
|-------|--------|
| **URL** | `https://localhost` |
| **Email** | `admin@agr-collect.local` |
| **Mot de passe** | `agrcollect2025` |

> Changez le mot de passe par défaut après la première connexion en production.

---

## Utilisation de l'Interface Web

### Créer un Projet

1. Connectez-vous avec le compte administrateur
2. Cliquez sur **"Nouveau"** sur la page d'accueil
3. Donnez un nom au projet (ex: "Collecte Terrain SAAHDEL")
4. Le projet apparaît dans la liste

### Créer et Publier un Formulaire

1. Ouvrez un projet existant
2. Cliquez sur **"Nouveau"** dans l'onglet Formulaires
3. Uploadez un fichier **XLSForm** (.xlsx) ou **XForm** (.xml)
4. Le formulaire est automatiquement converti et publié
5. Vous pouvez le pré-visualiser via le bouton **"Aperçu"**

### Gérer les Utilisateurs

1. Allez dans **"Utilisateurs"** via la barre de navigation
2. Cliquez sur **"Créer un utilisateur web"**
3. Renseignez l'email et le nom
4. Assignez les rôles appropriés dans chaque projet

### Consulter les Rapports

1. Allez dans **"Rapports"** via la barre de navigation
2. Sélectionnez les filtres (projet, formulaire, période, utilisateur)
3. Cliquez sur **"Générer le rapport"**
4. Exportez en PDF si nécessaire

### Exporter les Données

1. Ouvrez un formulaire dans un projet
2. Allez dans l'onglet **"Soumissions"**
3. Cliquez sur **"Télécharger"** pour exporter en CSV/ZIP
4. Ou utilisez **"Se connecter aux données"** pour l'accès OData (Power BI, Excel, R, Python)

---



### Workflow de Collecte

```
1. Télécharger les formulaires vides   → Menu → "Télécharger un formulaire vierge"
2. Remplir un formulaire               → "Remplir un formulaire"
3. (Mode hors-ligne possible)          → Les données sont stockées localement
4. Envoyer les formulaires complétés   → "Envoyer le formulaire finalisé"
5. Vérifier sur l'interface web        → Les soumissions apparaissent dans Central
```

---

## API REST

L'API REST complète est accessible à `https://localhost/v1/`. Toutes les requêtes (sauf l'authentification) nécessitent un token de session.

### Authentification

```http
POST /v1/sessions
Content-Type: application/json

{
  "email": "admin@agr-collect.local",
  "password": "agrcollect2025"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2026-03-01T00:00:00.000Z",
  "csrf": "..."
}
```

Utilisez le token dans le header `Authorization: Bearer <token>` pour les requêtes suivantes.

### Endpoints Principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/v1/users/current` | Utilisateur connecté |
| `GET` | `/v1/users` | Liste des utilisateurs |
| `POST` | `/v1/users` | Créer un utilisateur |
| `GET` | `/v1/projects` | Liste des projets |
| `POST` | `/v1/projects` | Créer un projet |
| `GET` | `/v1/projects/:id` | Détails d'un projet |
| `GET` | `/v1/projects/:id/forms` | Formulaires d'un projet |
| `POST` | `/v1/projects/:id/forms` | Upload d'un formulaire |
| `GET` | `/v1/projects/:id/forms/:formId/submissions` | Soumissions d'un formulaire |
| `GET` | `/v1/projects/:id/forms/:formId/submissions.csv` | Export CSV |
| `GET` | `/v1/projects/:id/app-users` | App Users (collecteurs mobiles) |
| `GET` | `/v1/roles` | Liste des rôles disponibles |
| `GET` | `/v1/audits` | Journal d'audit |

> Documentation API complète : les endpoints suivent le standard AGR Central API v1.

---

## Gestion des Utilisateurs

### Types d'utilisateurs

| Type | Description | Créé via |
|------|-------------|----------|
| **Web User** | Accède à l'interface web, peut gérer projets et données | Interface web ou API |
| **App User** | Compte dédié pour AGR Collect, limité à la collecte | Interface web (onglet "App Users" d'un projet) |

### Créer un utilisateur web via CLI

```bash
# Créer l'utilisateur
docker exec -i central-service-1 sh -c \
  "echo '<MOT_DE_PASSE>' | node lib/bin/cli.js -u <EMAIL> user-create"

# Promouvoir en administrateur (optionnel)
docker exec central-service-1 \
  node lib/bin/cli.js -u <EMAIL> user-promote
```

### Créer un App User pour la collecte mobile

1. Ouvrez un projet dans l'interface web
2. Allez dans l'onglet **"App Users"**
3. Cliquez **"Créer un App User"**
4. Donnez un nom (ex: "Agent Terrain 1")
5. Un **QR code** est généré — scannez-le avec AGR Collect pour configurer automatiquement la connexion

> **Astuce** : Les App Users sont plus sécurisés que le compte admin pour la collecte mobile. Chaque agent terrain devrait avoir son propre App User.

---

## Développement Frontend

### Installer les dépendances

```bash
cd central/client
npm install
```

### Lancer le serveur de développement

```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173` et se connectera automatiquement au backend Docker.

### Builder pour la production

```bash
npm run build
```

Les fichiers compilés sont générés dans `central/client/dist/`.

### Structure du code frontend

- **Composants** : `src/components/` — organisés par domaine fonctionnel
- **Routes** : `src/routes.js` — définition de toutes les pages
- **Traductions** : `src/locales/` + blocs `<i18n>` dans chaque composant
- **Données** : `src/request-data/` — gestion des requêtes API
- **Styles** : `src/assets/scss/` + styles scoped dans chaque composant

---

## Commandes Utiles

### Docker

```bash
# Démarrer les services
cd central && docker compose up -d

# Arrêter les services
docker compose down

# Redémarrer un service spécifique
docker compose restart service

# Voir les logs en temps réel
docker compose logs -f service

# Voir les logs de tous les services
docker compose logs -f

# Reconstruire les images (après modification)
docker compose build --no-cache

# Vérifier l'état des services
docker compose ps
```

### Base de données

```bash
# Accéder à PostgreSQL
docker exec -it central-postgres14-1 psql -U AGR -d AGR

# Lister les tables
\dt

# Compter les soumissions
SELECT COUNT(*) FROM submissions;

# Quitter
\q
```

### Réseau

```powershell
# Trouver l'IP locale (Windows)
ipconfig

# Tester la connectivité depuis un autre appareil
curl -k https://<IP_DU_PC>/v1/projects
```

---

## Dépannage

### Le navigateur affiche "Connexion non sécurisée"

**Cause** : Certificat SSL auto-signé en développement local.
**Solution** : Cliquez "Avancé" → "Continuer vers localhost". C'est normal en développement.

### AGR Collect ne se connecte pas au serveur

**Vérifications** :
1. Les deux appareils sont sur le **même réseau Wi-Fi**
2. Les ports **80** et **443** sont ouverts dans le pare-feu Windows
3. L'URL utilise `https://` (pas `http://`)
4. L'IP du PC est correcte (`ipconfig` pour vérifier)
5. Le certificat auto-signé a été **accepté** dans AGR Collect

### Docker : les services ne démarrent pas

```bash
# Vérifier les logs d'erreur
docker compose logs service
docker compose logs nginx

# Reconstruire les images
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Erreur 421 (Misdirected Request)

**Cause** : Le `DOMAIN` dans `.env` ne correspond pas à l'URL utilisée.
**Solution** : Assurez-vous que `DOMAIN=localhost` si vous accédez via `https://localhost`.

### Enketo ne charge pas les formulaires web

```bash
# Redémarrer Enketo et ses dépendances
docker compose restart redis_main redis_cache enketo
```

---

## Roadmap

- [x] Backend opérationnel (8 services Docker)
- [x] Interface web modernisée (design AGR-Collect)
- [x] Gestion des projets, formulaires, utilisateurs
- [x] Rapports PDF professionnels avec statistiques
- [x] Dashboard de statistiques
- [x] Gestion des sites de collecte
- [x] Export CSV / JSON / OData
- [x] Support multilingue (FR, EN, DE, ES, IT, PT, ZH, etc.)
- [ ] Application mobile personnalisée (branding AGR-Collect)
- [ ] Signatures numériques pour la traçabilité
- [ ] Déploiement production (VPS + Let's Encrypt)
- [ ] Templates de formulaires préconfigurés pour SAAHDEL

---

<p align="center">
  <strong>AGR-Collect</strong> — Développé pour l'ONG SAAHDEL<br/>
  <em>Collecte de données terrain fiable, géolocalisée, hors-ligne</em>
</p>
