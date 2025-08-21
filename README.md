# La Bonne Gestion Immobilière 🏠

Un jeu de plateau numérique immobilier français avec des mécaniques de jeu complexes et une interface interactive rétro.

## 📋 Description du Jeu

"La Bonne Gestion Immobilière" est un jeu de gestion immobilière multijoueur inspiré du Monopoly, entièrement développé en JavaScript vanilla. Les équipes se déplacent sur un plateau en spirale, tirent des cartes thématiques et gèrent un portefeuille immobilier virtuel tout en accumulant des points.

## ✨ Caractéristiques Principales

### 🎮 Gameplay
- **Mode Multijoueur** : Jusqu'à 4 équipes avec 4 joueurs maximum par équipe
- **Plateau en Spirale** : Génération procédurale avec répartition équilibrée des types de cartes
- **Système de Tours** : Rotation automatique entre les équipes et joueurs
- **Gestion des Scores** : Système de points en temps réel avec historique complet

### 🃏 Système de Cartes
- **Cartes Biens** : Propriétés immobilières générant des revenus (70-110K€)
- **Cartes Factures** : Dépenses obligatoires (-10 à -45K€)
- **Cartes Bonus** : Effets spéciaux et majorations de revenus
- **Cartes Interaction** : Actions entre équipes avec questions à points
- **Cartes PDB (Plus De Biens)** : Effets modificateurs sur les transactions
- **Cartes Redevance** : Revenus récurrents (20-70K€)

### 🎯 Nouvelles Fonctionnalités
- **Questions Interactives** : Système de Q&A avec attribution de points pour bonnes réponses
- **Vidéos Immersives** : Contenu vidéo contextuel affiché une seule fois par partie
- **Synthèse Vocale** : Lecture automatique des cartes en français (Microsoft Paul)
- **Animations 3D** : Effets de retournement de cartes avec CSS 3D transforms

## 🛠️ Architecture Technique

### Frontend
- **HTML5 + CSS3 + JavaScript Vanilla** : Aucune dépendance externe
- **Architecture Modulaire** : Code organisé en modules spécialisés
- **Responsive Design** : Interface adaptative mobile-first
- **Thème Rétro** : Esthétique 8-bit avec la police Press Start 2P

### Gestion d'État
- **localStorage** : Persistance automatique de l'état du jeu
- **État Centralisé** : Objet global gérant équipes, scores et historique
- **Sauvegarde Intelligente** : Récupération automatique après rafraîchissement

### Animations et Interface
- **CSS 3D Transforms** : Animations de cartes avec perspective hardware-accelerated
- **Système Modal** : Interface overlay pour les interactions de cartes
- **Feedback Visuel** : Effets hover et transitions fluides

## 🎨 Design et UX

### Interface Utilisateur
- **Codes Couleur par Équipe** : 4 palettes distinctes pour l'identification
- **Boutons Personnalisés** : Style rétro avec effets interactifs
- **Affichage des Scores** : Mise à jour en temps réel avec format "K€"
- **Navigation Intuitive** : Écrans de configuration et de jeu fluides

### Accessibilité
- **Support Audio** : Lecture vocale du contenu des cartes
- **Contrastes Optimisés** : Lisibilité sur tous types d'écrans
- **Interface Tactile** : Compatible mobiles et tablettes

## 🚀 Installation et Utilisation

```bash
# Cloner le repository
git clone https://github.com/ahmedooo1/LaBonneGestionImmobiliere.git

# Naviguer dans le dossier
cd LaBonneGestionImmobiliere

# Lancer un serveur local (Python exemple)
python3 -m http.server 5000

# Ouvrir dans le navigateur
http://localhost:5000
```

### Configuration Rapide
1. **Accueil** : Sélectionner le nombre d'équipes (1-4)
2. **Équipes** : Configurer noms des équipes et joueurs
3. **Jeu** : Lancer les dés et interagir avec les cartes
4. **Scores** : Suivi automatique avec historique détaillé

## 📊 Données de Jeu

### Base de Données des Cartes
- **+200 cartes uniques** réparties en 6 catégories
- **Montants dynamiques** : Génération aléatoire dans des fourchettes définies
- **Effets spéciaux** : Multiplicateurs, réductions, interactions inter-équipes
- **Descriptions immersives** : Contenu thématique immobilier français

### Métriques de Performance
- **Temps de chargement** : <2 secondes sur connexion standard
- **Responsive** : Compatible dès 320px de largeur
- **Stockage local** : <5MB d'espace disque utilisé

## 🔧 Technologies Utilisées

| Composant | Technologie | Version |
|-----------|------------|---------|
| Frontend | HTML5/CSS3/JavaScript | ES6+ |
| Fonts | Google Fonts | Press Start 2P, Roboto |
| Storage | localStorage API | Native |
| Audio | Web Speech API | Native |
| Animations | CSS 3D Transforms | Native |

## 📈 Fonctionnalités Avancées

### Système de Questions
- Questions thématiques immobilières
- Attribution automatique de points (bonnes réponses)
- Interface dédiée avec options multiples
- Intégration dans le flow de jeu

### Gestion Vidéo
- Lecture unique par session de jeu
- Intégration contextuelle aux cartes interaction
- Contrôles utilisateur (skip, replay)
- Optimisation de la bande passante

### Audio et Accessibilité
- Sélection automatique de voix française
- Fallback sur voix système disponibles
- Volume et contrôles personnalisables
- Support multilingue (extension future)

## 🏆 Points Forts du Projet

- ✅ **100% Vanilla** : Aucune dépendance externe
- ✅ **Persistance Complète** : Sauvegarde automatique de l'état
- ✅ **Animations Fluides** : CSS 3D haute performance
- ✅ **Mobile-First** : Interface responsive native
- ✅ **Extensible** : Architecture modulaire pour nouvelles fonctionnalités
- ✅ **Accessible** : Support audio et navigation clavier

## 🚧 Roadmap

- [ ] Mode en ligne multijoueur
- [ ] Statistiques avancées et graphiques
- [ ] Thèmes visuels supplémentaires
- [ ] API de gestion de propriétés réelles
- [ ] Mode tournoi avec classements

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📞 Contact

Pour toute question ou suggestion concernant le projet, n'hésitez pas à ouvrir une issue GitHub.

---

*Développé avec ❤️ pour les passionnés d'immobilier et de jeux de stratégie*

- Application conçue pour DGFIP par ETN76
