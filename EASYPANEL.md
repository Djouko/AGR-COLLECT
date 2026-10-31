# AGR-Collect Central - Déploiement EasyPanel

## Architecture

Le `Dockerfile` à la racine du projet crée un **conteneur unifié** qui inclut :
- **Nginx** — Frontend Vue.js + reverse proxy (port 80)
- **Service** — Backend Node.js / API ODK Central (port 8383 interne)
- **Enketo** — Moteur de formulaires web (port 8005 interne)
- **PyXForm** — Convertisseur XLSForm → XML (port 8081 interne)
- **Redis x2** — Base de données Enketo + cache (ports 6379/6380 internes)

**Dépendance externe** : PostgreSQL 14+ (service de base de données EasyPanel)

---

## Étapes de déploiement sur EasyPanel

### 1. Créer le projet

Dans EasyPanel, créez un nouveau projet nommé `agr-collect`.

### 2. Créer le service PostgreSQL

1. Dans le projet, cliquez **+ Service** → **Database** → **PostgreSQL**
2. Nom : `postgres`
3. Version : `14` ou plus récent
4. Notez les informations de connexion générées :
   - **Host** : `agr-collect-postgres` (nom interne EasyPanel)
   - **Port** : `5432`
   - **User** : (généré automatiquement)
   - **Password** : (généré automatiquement)
   - **Database** : (généré automatiquement)

### 3. Créer le service App (AGR-Collect)

1. Cliquez **+ Service** → **App**
2. Nom : `app`
3. Source : **GitHub** → sélectionnez votre repository `AGR-COLLECT`
4. **Branch** : `master`
5. **Build Path** : `/` (le `Dockerfile` est à la racine du dépôt `AGR-COLLECT`)
6. **Dockerfile Path** : `Dockerfile`

### 4. Configurer les variables d'environnement

Dans les paramètres du service `app`, ajoutez ces variables :

#### Variables obligatoires

| Variable | Valeur | Description |
|----------|--------|-------------|
| `DOMAIN` | `agr-collect.votredomaine.com` | Votre domaine réel |
| `SSL_TYPE` | `upstream` | **IMPORTANT** : EasyPanel gère le SSL |
| `DB_HOST` | `agr-collect-postgres` | Host PostgreSQL EasyPanel |
| `DB_USER` | *(de l'étape 2)* | Utilisateur PostgreSQL |
| `DB_PASSWORD` | *(de l'étape 2)* | Mot de passe PostgreSQL |
| `DB_NAME` | *(de l'étape 2)* | Nom de la base de données |
| `SYSADMIN_EMAIL` | `admin@agr-collect.local` | Email admin système |
| `ADMIN_EMAIL` | `admin@agr-collect.local` | Email du compte admin |
| `ADMIN_PASSWORD` | *(mot de passe fort, 10 caractères min.)* | Mot de passe du compte admin créé au premier démarrage. Ne gardez pas la valeur par défaut documentée. |

#### Variables email (SMTP)

> ⚠️ **DigitalOcean bloque les ports SMTP sortants 25, 465 et 587 sur tous les Droplets**
> ([documentation DigitalOcean](https://docs.digitalocean.com/support/why-is-smtp-blocked/)).
> Gmail (`smtp.gmail.com:587`) ne peut donc **pas** fonctionner depuis EasyPanel sur DigitalOcean.
> Utilisez un fournisseur d'emails transactionnels joignable sur le port **2525**, par exemple
> **Brevo** (offre gratuite : 300 emails/jour), qui le supporte officiellement.

| Variable | Valeur (Brevo) | Description |
|----------|----------------|-------------|
| `EMAIL_HOST` | `smtp-relay.brevo.com` | Serveur SMTP |
| `EMAIL_PORT` | `2525` | Port non bloqué par DigitalOcean |
| `EMAIL_USER` | *(identifiant SMTP Brevo)* | Brevo > SMTP & API > SMTP |
| `EMAIL_PASSWORD` | *(clé SMTP Brevo)* | Brevo > SMTP & API > SMTP |
| `EMAIL_FROM` | `no-reply@votredomaine.com` | Doit être un expéditeur ou un domaine **vérifié** dans Brevo |

`EMAIL_SECURE` et `EMAIL_IGNORE_TLS` sont déduits automatiquement (STARTTLS dès qu'un vrai
serveur est configuré, SSL implicite si `EMAIL_PORT=465`) : ne les définissez que pour forcer
une valeur. Au démarrage, les logs indiquent `[mail] SMTP OK` ou `!! [mail] SMTP check FAILED`
avec la cause probable.

#### Variables optionnelles

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `DB_SSL` | `null` | SSL pour PostgreSQL (`null` ou `{"rejectUnauthorized":false}`) |
| `DB_POOL_SIZE` | `10` | Taille du pool de connexions |
| `SESSION_LIFETIME` | `86400` | Durée de session en secondes (24h) |
| `HTTPS_PORT` | `443` | Port HTTPS (laisser 443) |
| `WORKER_COUNT` | `2` | Processus Node.js du backend. Tous les services partagent le conteneur (et souvent le Droplet avec Postgres) : n'augmentez que si le Droplet a ≥ 4 Go de RAM |

### 5. Configurer le domaine

1. Dans les paramètres du service `app` → **Domains**
2. Ajoutez votre domaine : `agr-collect.votredomaine.com`
3. Activez **HTTPS** (EasyPanel génère le certificat Let's Encrypt automatiquement)
4. Port du conteneur : `80`

### 6. Configurer les volumes persistants

Dans **Volumes** du service `app`, ajoutez :

| Chemin dans le conteneur | Description |
|--------------------------|-------------|
| `/etc/secrets` | Clés de chiffrement Enketo (CRITIQUE) |
| `/data/transfer` | Données de transfert |
| `/var/lib/redis` | Données Redis |
| `/etc/dh` | Paramètres Diffie-Hellman |

> ⚠️ **IMPORTANT** : Le volume `/etc/secrets` contient les clés de chiffrement.
> Si ce volume est perdu, les formulaires web Enketo ne fonctionneront plus correctement.
> Sauvegardez ce volume régulièrement. Sans montage persistant, Docker crée des volumes
> anonymes perdus à chaque redéploiement : le démarrage l'affiche alors dans les logs
> (`!! WARNING: /etc/secrets is not a persistent volume`).

### 7. Déployer

Cliquez **Deploy**. Le premier déploiement prend 5-10 minutes (build du frontend).

---

## Vérification

Une fois déployé, vérifiez :

1. **Frontend** : `https://agr-collect.votredomaine.com` → page de connexion
2. **API** : `https://agr-collect.votredomaine.com/v1/projects` → réponse JSON
3. **Connexion** : Utilisez `ADMIN_EMAIL` / `ADMIN_PASSWORD` pour vous connecter
4. **Logs** : `[mail] SMTP OK` et aucun `!! WARNING` sur les volumes
5. **Utilisateur web** : Utilisateurs > Nouveau. Sans mot de passe, l'utilisateur reçoit un
   email d'activation ; avec un mot de passe initial (10 caractères min.), il peut se
   connecter immédiatement (utile tant que le SMTP n'est pas configuré)
6. **Formulaire** : créez un projet et importez un XLSForm (`.xlsx` ou `.xls`) ; le formulaire
   doit se publier et s'ouvrir en aperçu web (Enketo)

---

## Dépannage

### Le conteneur ne démarre pas
- Vérifiez les logs dans EasyPanel
- Assurez-vous que PostgreSQL est accessible (`DB_HOST` correct)
- Vérifiez que `SSL_TYPE=upstream` est bien défini

### Erreur de connexion à la base de données
- Le host PostgreSQL dans EasyPanel est généralement : `nom-projet-nom-service`
  (ex : `agr-collect-postgres`)
- Vérifiez les credentials dans les variables d'environnement

### Les formulaires web (Enketo) ne fonctionnent pas
- Vérifiez que le volume `/etc/secrets` est monté et persistant
- Consultez les logs du service `enketo` dans les logs du conteneur

### Erreur 502 Bad Gateway
- Le backend met quelques secondes à démarrer (migrations, etc.)
- Attendez 30 secondes et réessayez

---

## Mise à jour

Pour mettre à jour l'application :
1. Poussez vos changements sur GitHub (`git push`)
2. Dans EasyPanel, cliquez **Rebuild** sur le service `app`

---

## Différence avec docker-compose

| | docker-compose | EasyPanel (Dockerfile unifié) |
|---|---|---|
| Services | 8 conteneurs séparés | 1 conteneur + 1 base de données |
| SSL | Certbot intégré | Traefik (EasyPanel) |
| PostgreSQL | Conteneur local | Service EasyPanel managé |
| Redis | 2 conteneurs séparés | Intégré dans le conteneur |
| Gestion | `docker compose up/down` | Interface web EasyPanel |
