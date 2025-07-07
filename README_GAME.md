# 🏎️ VroumVroum F1 - Simulateur de Course Professionnel

Un simulateur de course de Formule 1 réaliste construit avec React Three Fiber, Three.js et Rapier Physics.

## 🌟 Caractéristiques

### 🏁 Circuit Professionnel
- **Circuit inspiré de Monaco/Spa-Francorchamps** avec 5 secteurs distincts
- **Élévations et dénivelés** incluant un pont surélevé
- **Chicanes techniques** et épingle à cheveux
- **Barrières de sécurité réalistes** avec collision physique
- **Système de checkpoints** pour détecter les tours complets

### 🚗 Physique de Voiture Réaliste
- **Modèle Ferrari F1 2019** avec animations des roues
- **Physique moteur avancée** : couple, RPM, vitesses automatiques
- **Système de direction** avec aide électronique
- **Freinage et accélération** réalistes
- **Effets d'appui aérodynamique** (downforce)
- **Système DRS/Boost** avec Shift

### 🎮 Contrôles Avancés
- **Z/↑** : Accélération
- **S/↓** : Freinage/Marche arrière
- **Q/←** : Braquage gauche
- **D/→** : Braquage droite
- **SPACE** : Freinage d'urgence
- **SHIFT** : DRS/Mode Boost

### 📊 Interface Professionnelle F1
- **Tableau de bord digital** avec compteur de vitesse
- **Compte-tours avec zones rouge** 
- **Indicateur de vitesse et puissance moteur**
- **Chronométrage de tours** avec meilleur temps
- **Mini-carte du circuit** en temps réel
- **Télémétrie complète** (vitesse, RPM, vitesse, puissance)
- **Indicateurs d'état** (hors piste, collisions, haute vitesse)

### 🎨 Effets Visuels
- **Système de particules** d'échappement
- **Particules de poussière** hors piste
- **Effets de collision** avec étincelles
- **Éclairage dynamique** du circuit
- **Environnement réaliste** avec brouillard
- **Ombres et reflets** en temps réel

### 🏎️ Modèles 3D Authentiques
- **Modèles de routes** de qualité professionnelle (GLB)
- **Éléments de signalisation** F1
- **Barrières et cônes** de sécurité
- **Éclairage de circuit** réaliste
- **Ponts et infrastructures** surélevées

## 🚀 Installation et Lancement

```bash
# Installation des dépendances
npm install

# Lancement en mode développement
npm run dev

# Construction pour production
npm run build
```

## 🛠️ Technologies Utilisées

- **React 19** - Framework UI
- **Three.js** - Moteur 3D
- **React Three Fiber** - Intégration React/Three.js
- **Rapier Physics** - Moteur physique réaliste
- **Three Drei** - Composants utilitaires 3D
- **TypeScript** - Typage statique
- **Vite** - Build tool moderne

## 📁 Structure du Projet

```
src/
├── components/
│   ├── ProfessionalRaceTrack.tsx    # Circuit F1 complet
│   ├── RealisticF1Car.tsx           # Voiture avec physique réaliste
│   ├── ProfessionalGameUI.tsx       # Interface utilisateur F1
│   ├── ParticleSystem.tsx           # Effets de particules
│   ├── CameraController.tsx         # Caméra qui suit la voiture
│   ├── TrackManager.tsx             # Gestion des tours et checkpoints
│   ├── PhysicsCheckpoint.tsx        # Points de contrôle
│   └── PhysicsGround.tsx            # Sol physique
├── App.tsx                          # Composant principal
└── main.tsx                         # Point d'entrée
```

## 🎯 Caractéristiques du Circuit

### Secteur 1 : Ligne de Départ
- Longue ligne droite de 100m
- Première chicane technique
- Zone de dépassement

### Secteur 2 : Section Technique
- Montée avec virages en S
- Pont surélevé (point culminant)
- Descente rapide

### Secteur 3 : Épingle
- Virage le plus lent du circuit
- Zone de freinage intense
- Opportunité de dépassement

### Secteur 4 : Chicane Finale
- Complexe de virages
- Retour vers la ligne droite
- Préparation de la ligne d'arrivée

## 🏆 Système de Course

- **Tours chronométrés** avec précision milliseconde
- **Meilleurs temps** sauvegardés
- **Détection de position** sur circuit
- **Pénalités** pour sorties de piste
- **Système de dommages** basé sur les collisions

## 🎮 Mode de Jeu

### Course Libre
- Roulez sur le circuit professionnel
- Améliorez vos temps de tour
- Maîtrisez chaque virage
- Explorez les limites de la physique

### Objectifs
- Réaliser un tour complet
- Battre votre meilleur temps
- Éviter les collisions
- Maîtriser les zones techniques

## 🔧 Personnalisation

Le projet est entièrement modulaire et permet :
- Ajout de nouveaux circuits
- Modification des paramètres physiques
- Customisation de l'interface
- Intégration de nouveaux modèles 3D

## 📝 Licence

Projet éducatif - Libre d'utilisation pour l'apprentissage.

## 🙏 Crédits

- **Modèles 3D** : Kenney Assets (CityModel)
- **Moteur Physique** : Rapier
- **Inspiration** : Circuits F1 légendaires

---

**Développé avec ❤️ pour les passionnés de course automobile et de développement 3D**
