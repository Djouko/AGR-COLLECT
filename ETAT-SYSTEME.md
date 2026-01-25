# État du Système AGR-Collect

## Date: 25 Janvier 2026

---

## 1. STATUT GLOBAL: ✅ OPÉRATIONNEL

### Infrastructure Docker
| Service | Container | Statut |
|---------|-----------|--------|
| Backend | central-service-1 | ✅ Running |
| Base de données | central-postgres14-1 | ✅ Running |
| Nginx | central-nginx-1 | ✅ Running |
| Enketo | central-enketo-1 | ✅ Running |
| Redis Main | central-enketo_redis_main-1 | ✅ Running |
| Redis Cache | central-enketo_redis_cache-1 | ✅ Running |
| PyXForm | central-pyxform-1 | ✅ Running |
| Mail | central-mail-1 | ✅ Running |

---

## 2. ACCÈS SYSTÈME

### Interface Web
- **URL**: https://localhost
- **Certificat**: Auto-signé (valide 10 ans)

### Utilisateurs Web
| Utilisateur | Email | Mot de passe | Rôle |
|-------------|-------|--------------|------|
| Admin | admin@agr-collect.local | agrcollect2025 | Administrator |
| Agent | agent@agr-collect.local | agentterrain2025 | Data Collector |
| Sponsor | sponsor@agr-collect.local | sponsor2025 | Project Viewer |

### Utilisateurs Mobiles (App Users)
| Nom | Token | Accès |
|-----|-------|-------|
| Collecteur Terrain 1 | vSD1SwS49H$$3aAqkXdE3tt$eLozaNWOUDm0!DUKvLnICtuJTfIAL4Q38DBY4DNQ | Formulaire agr_collecte |

### URL QR Code pour ODK Collect
```
https://localhost/v1/key/vSD1SwS49H$$3aAqkXdE3tt$eLozaNWOUDm0!DUKvLnICtuJTfIAL4Q38DBY4DNQ/projects/1
```

---

## 3. FORMULAIRE DÉPLOYÉ

| Propriété | Valeur |
|-----------|--------|
| ID | agr_collecte |
| Nom | AGR Collecte Terrain |
| État | open (publié) |
| enketoId | fyYJbIcavq76S4kfvINIyU8M38TzKA6 |
| Projet | 1 |

---

## 4. CORRECTIONS APPLIQUÉES

### SSL Enketo
- **Fichier**: `files/enketo/start-enketo.sh`
- **Fix**: `export NODE_TLS_REJECT_UNAUTHORIZED=0`
- **Raison**: Permettre la communication avec certificats auto-signés

### Nginx Server Name
- **Fichier**: `files/nginx/odk.conf.template`
- **Fix**: `server_name ${DOMAIN} nginx;`
- **Raison**: Permettre la communication interne Docker via hostname "nginx"

### Branding AGR-Collect
- **Navbar**: `client/src/components/navbar.vue` → "AGR-Collect"
- **Title**: `client/index.html` → "AGR-Collect"
- **Footer**: `client/index.html` → "Powered by AGR-Collect"
- **Traductions FR**: `client/src/locales/fr.json` → "AGR-Collect"

### Configuration Enketo
- **Fichier**: `files/enketo/config.json.template`
- **server url**: "nginx" (communication interne Docker)
- **support email**: support@agr-collect.local

### Configuration Service
- **Fichier**: `files/service/config.json.template`
- **env.domain**: "https://nginx" (communication interne Docker)

---

## 5. TESTS VALIDÉS

### Tests API (tous ✅)
- POST /v1/sessions (authentification)
- GET /v1/users/current
- GET /v1/users
- GET /v1/projects
- GET /v1/projects/1/forms
- GET /v1/projects/1/app-users
- GET /v1/roles
- GET /v1/assignments

### Tests Connexion
- Admin: ✅ OK
- Agent: ✅ OK
- Sponsor: ✅ OK

### Tests Enketo
- Communication SSL: ✅ OK (via NODE_TLS_REJECT_UNAUTHORIZED)
- enketoId généré: ✅ fyYJbIcavq76S4kfvINIyU8M38TzKA6
- Redirection preview: ✅ 301

---

## 6. RÔLES DISPONIBLES

| ID | Nom | Verbs |
|----|-----|-------|
| 1 | Administrator | 52 |
| 2 | Project Manager | 37 |
| 3 | Project Viewer | 9 |
| 4 | Data Collector | 4 |
| 5 | App User | 2 |
| 6 | Form Viewer | 1 |
| 7 | Public Link | 2 |
| 8 | Password Reset Token | 1 |

---

## 7. COMMANDES UTILES

### Démarrer tous les services
```bash
cd central
docker-compose up -d
```

### Arrêter tous les services
```bash
docker-compose down
```

### Voir les logs
```bash
docker-compose logs -f service
docker-compose logs -f enketo
docker-compose logs -f nginx
```

### Nettoyer les sessions bloquées
```bash
echo 'DELETE FROM sessions;' | docker exec -i central-postgres14-1 psql -U odk -d odk
```

### Reconstruire après modification
```bash
docker-compose build nginx service enketo
docker-compose up -d nginx service enketo
```

---

## 8. PROCHAINES ÉTAPES

1. **Test navigateur**: Prévisualisation et soumission formulaire
2. **Test mobile**: Configuration ODK Collect avec QR code
3. **Dashboard**: Développer interface statistiques (non inclus dans ODK)
4. **Export PDF**: Développer service de génération PDF
5. **Production**: Remplacer certificat auto-signé par Let's Encrypt

---

## 9. CONFORMITÉ CAHIER DES CHARGES

Voir le document `ANALYSE-CONFORMITE.md` pour le détail complet.

**Couverture estimée: 80%**

Points couverts:
- ✅ Collecte offline + GPS + photos
- ✅ Mode hors-ligne avec sync auto
- ✅ Gestion utilisateurs et rôles
- ✅ Authentification sécurisée
- ✅ API REST complète

Points à développer:
- ❌ Export PDF (à implémenter)
- ❌ Dashboard statistiques (à implémenter)
- ⚠️ Simplification UX (personnalisation en cours)
