# Analyse de Conformité AGR-Collect vs Cahier des Charges

## Date: 25 Janvier 2026

---

## 1. ACTEURS SYSTÈME

| Acteur Cahier des Charges | Implémentation ODK Central | Statut |
|---------------------------|---------------------------|--------|
| **Administrateur** | Rôle "Administrator" (sitewide) | ✅ OK |
| **Agent terrain** | App User (mobile) + Web User avec rôle "Data Collector" | ⚠️ À VÉRIFIER |
| **Sponsor** | Web User avec rôle "Project Viewer" | ⚠️ À VÉRIFIER |

### Détail des rôles ODK Central:
- **Administrator**: Tous les droits (création users, forms, projets)
- **Project Manager**: Gestion d'un projet spécifique
- **Project Viewer**: Consultation seule (correspond au Sponsor)
- **Data Collector**: Collecte de données (correspond à l'Agent terrain)
- **App User**: Utilisateur mobile uniquement (pour ODK Collect)

---

## 2. BESOINS FONCTIONNELS (BF)

### BF1: Collecte et gestion des données terrain

| Exigence | ODK Central | Statut |
|----------|-------------|--------|
| BF1.1 Formulaires statiques (texte, entier, choix, dates, photos) | XLSForm + Enketo | ✅ OK |
| BF1.2 Ajout automatique GPS | Champ geopoint dans formulaire | ✅ OK |
| BF1.3 Mode offline | ODK Collect stockage local | ✅ OK |
| BF1.4 Synchronisation automatique | ODK Collect sync automatique | ✅ OK |
| BF1.5 Validation des champs | Contraintes XLSForm | ✅ OK |
| BF1.6 Photos/pièces jointes | Type "image" dans formulaire | ✅ OK |

### BF2: Traçabilité et transparence

| Exigence | ODK Central | Statut |
|----------|-------------|--------|
| BF2.1 Horodatage automatique | metadata: start, end, today | ✅ OK |
| BF2.2 Authentification obligatoire | Session JWT + App User tokens | ✅ OK |

### BF3: Gestion des utilisateurs et rôles

| Exigence | ODK Central | Statut |
|----------|-------------|--------|
| BF3.1 Création/gestion comptes | API /v1/users | ✅ OK |
| BF3.2 Différenciation des droits | Système de rôles ODK | ✅ OK |

### BF4: Analyse et exploitation

| Exigence | ODK Central | Statut |
|----------|-------------|--------|
| BF4.1 Export PDF | ❌ Non natif - À IMPLÉMENTER | ❌ MANQUE |
| BF4.2 Consultation par zone/date/agent | OData API avec filtres | ⚠️ PARTIEL |

### BF5: Sécurité

| Exigence | ODK Central | Statut |
|----------|-------------|--------|
| BF5.1 Connexion sécurisée | HTTPS + JWT | ✅ OK |
| BF5.2 Sauvegarde automatique | PostgreSQL + backup | ✅ OK |

---

## 3. BESOINS NON-FONCTIONNELS (BNF)

| BNF | Statut ODK Central |
|-----|-------------------|
| BNF1 Fiabilité/robustesse | ✅ Production-ready |
| BNF2 Mode hors-ligne | ✅ ODK Collect |
| BNF3 Sécurité | ✅ HTTPS, JWT, chiffrement |
| BNF4 Performance (<3s) | ✅ À tester |
| BNF5 Ergonomie | ⚠️ Interface technique |
| BNF6 Compatibilité Android | ✅ ODK Collect |
| BNF7 Maintenabilité | ✅ Docker, API REST |
| BNF8 Export/API | ✅ OData, REST API |

---

## 4. ÉCARTS IDENTIFIÉS ET SOLUTIONS

### 4.1 Export PDF (BF4.1) - CRITIQUE
**Problème**: ODK Central ne génère pas de PDF natif
**Solution**: 
- Développer un service de génération PDF
- Utiliser l'API OData pour récupérer les données
- Générer PDF avec librairie (pdfmake, puppeteer)

### 4.2 Dashboard intégré - IMPORTANT
**Problème**: Pas de tableau de bord visuel dans ODK Central
**Solution**:
- Développer une interface dashboard personnalisée
- Intégrer statistiques et graphiques
- Ajouter carte des interventions

### 4.3 Simplicité interface - AMÉLIORATION
**Problème**: Interface ODK Central technique
**Solution**:
- Personnaliser le branding AGR-Collect ✅ EN COURS
- Simplifier la navigation pour les utilisateurs non techniques

---

## 5. UTILISATEURS DE TEST CRÉÉS

| Utilisateur | Email | Rôle | Type |
|-------------|-------|------|------|
| Admin | admin@agr-collect.local | Administrator | Web |
| Agent | agent@agr-collect.local | Data Collector | Web |
| Sponsor | sponsor@agr-collect.local | Project Viewer | Web |
| Agent Mobile | Agent Terrain Mobile | App User | Mobile |

---

## 6. TESTS À EFFECTUER

### Tests Utilisateur Admin
- [ ] Connexion web
- [ ] Création d'utilisateurs
- [ ] Création de formulaires
- [ ] Gestion des projets
- [ ] Accès aux rapports
- [ ] Export des données

### Tests Utilisateur Agent Terrain
- [ ] Connexion web (si autorisé)
- [ ] Connexion mobile via QR code
- [ ] Remplissage de formulaire
- [ ] Capture GPS
- [ ] Ajout de photos
- [ ] Synchronisation offline→online

### Tests Utilisateur Sponsor
- [ ] Connexion web
- [ ] Consultation des données (lecture seule)
- [ ] Visualisation des rapports
- [ ] Aucune modification possible

### Tests Techniques
- [ ] Prévisualisation Enketo
- [ ] Soumission via web
- [ ] API REST fonctionnelle
- [ ] Certificat SSL
- [ ] Session management

---

## 7. CONCLUSION

**Couverture estimée**: ~80%

**Points forts ODK Central**:
- Infrastructure robuste et éprouvée
- Mode offline natif
- API REST complète
- Sécurité HTTPS/JWT
- Formulaires flexibles (XLSForm)

**Améliorations nécessaires**:
1. Export PDF (développement requis)
2. Dashboard statistiques (développement requis)
3. Simplification UX (personnalisation)
4. Branding AGR-Collect (en cours ✅)

**Recommandation**: L'architecture ODK Central est solide et couvre la majorité des besoins. Les fonctionnalités manquantes peuvent être ajoutées par développement complémentaire.
