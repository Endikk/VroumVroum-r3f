# Guide de déploiement GitHub Pages

## Configuration automatique

Votre projet est maintenant configuré pour le déploiement automatique sur GitHub Pages. Voici ce qui a été configuré :

### 1. Configuration Vite (`vite.config.ts`)
- Base URL configurée pour GitHub Pages : `/VroumVroum-r3f/`
- Répertoire de sortie : `dist`

### 2. Package.json
- Script de déploiement ajouté : `npm run deploy`
- Package `gh-pages` installé pour le déploiement manuel

### 3. GitHub Actions (`.github/workflows/deploy.yml`)
- Workflow automatique pour déployer sur `main` branch
- Build et déploiement automatique
- Configuration des permissions Pages

### 4. Fichiers supplémentaires
- `.nojekyll` dans `public/` pour éviter le traitement Jekyll
- README mis à jour avec les instructions

## Instructions de déploiement

### Méthode 1 : Déploiement automatique (recommandé)

1. **Sur GitHub :**
   - Allez dans Settings → Pages
   - Sous "Source", sélectionnez "GitHub Actions"
   - Sauvegardez

2. **Push vers main :**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Vérification :**
   - Le site sera disponible à : `https://votre-username.github.io/VroumVroum-r3f/`
   - Vous pouvez suivre le déploiement dans l'onglet "Actions" de votre repo

### Méthode 2 : Déploiement manuel

```bash
npm run deploy
```

## Points importants

⚠️ **URL de base** : Si votre repository a un nom différent de "VroumVroum-r3f", modifiez la propriété `base` dans `vite.config.ts`

✅ **Ressources statiques** : Tous les fichiers dans `public/` seront copiés à la racine du site

✅ **Build optimisé** : Le déploiement utilise une version optimisée et minifiée

## Résolution de problèmes

- **404 sur les assets** : Vérifiez que la `base` URL correspond au nom de votre repository
- **Échec du déploiement** : Consultez l'onglet Actions pour voir les logs d'erreur
- **Pages non activées** : Assurez-vous que GitHub Pages est activé dans les paramètres
