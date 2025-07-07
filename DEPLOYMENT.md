# Guide de déploiement GitHub Pages

## ✅ Problème 404 résolu

Le problème 404 que vous rencontriez était dû à une mauvaise configuration de la base URL. Voici ce qui a été corrigé :

### 🔧 Corrections apportées

1. **Configuration Vite mise à jour** (`vite.config.ts`):
   ```typescript
   base: '/VroumVroum-r3f/',  // Chemin correct pour votre repository
   ```

2. **Workflow GitHub Actions amélioré** (`.github/workflows/deploy.yml`):
   - Support pour `main` et `master` branches
   - Permissions correctement configurées
   - Déploiement plus robuste

3. **Package.json mis à jour**:
   - Script de prévisualisation ajouté
   - Types Node.js installés

## 🚀 Instructions de déploiement

### Méthode 1 : Déploiement automatique (recommandé)

1. **Activez GitHub Pages** (si ce n'est pas déjà fait):
   - Allez dans Settings → Pages de votre repository
   - Sous "Source", sélectionnez "GitHub Actions"
   - Sauvegardez

2. **Poussez vos changements**:
   ```bash
   git add .
   git commit -m "Fix 404 issues for GitHub Pages"
   git push origin main
   ```

3. **Vérifiez le déploiement**:
   - Consultez l'onglet "Actions" pour voir le processus
   - Votre site sera disponible à : `https://endikk.github.io/VroumVroum-r3f/`

### Méthode 2 : Test local avec la même configuration

Pour tester localement avec la même base URL que GitHub Pages :

```bash
npm run build
npm run preview:dist
```

Puis visitez : `http://localhost:4173/VroumVroum-r3f/`

## 🔍 Vérifications importantes

### ✅ Ce qui est maintenant correct :
- Base URL configurée pour GitHub Pages
- Chemins des assets corrects dans le HTML généré
- Workflow GitHub Actions opérationnel
- Fichier `.nojekyll` présent pour éviter le traitement Jekyll

### 🛠️ Si le problème persiste :

1. **Vérifiez le nom du repository** :
   - Si votre repository s'appelle différemment, modifiez `base` dans `vite.config.ts`

2. **Vérifiez la branche principale** :
   - Le workflow est configuré pour `main` et `master`

3. **Attendez quelques minutes** :
   - GitHub Pages peut prendre 5-10 minutes pour se mettre à jour

4. **Videz le cache** :
   - Utilisez Ctrl+F5 ou mode incognito pour voir les changements

## 📋 Structure des fichiers modifiés

```
VroumVroum-r3f/
├── .github/workflows/deploy.yml    # Workflow amélioré
├── vite.config.ts                  # Base URL corrigée
├── package.json                    # Scripts mis à jour
├── public/.nojekyll                # Évite le traitement Jekyll
└── DEPLOYMENT.md                   # Ce guide
```

## 🌐 URL finale

Votre site devrait maintenant être accessible à :
**https://endikk.github.io/VroumVroum-r3f/**

Si vous avez encore des erreurs 404, vérifiez dans la console du navigateur quels fichiers ne sont pas trouvés et assurez-vous que la base URL correspond exactement au nom de votre repository.
