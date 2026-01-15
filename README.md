# SMART PARKING

Application de navigations vers les différents parking de Metz disponible dans notre BDD.
Possible de trouver le parking le plus proche en 1 clique !

Notre rapport :  [Cliquez ici](https://docs.google.com/document/d/1J6fdDPijHZQg0OlEI1brwOyghVC7sfJreb6cwIfckF0/edit?usp=sharing)  

> [!WARNING]
>
> - Actuellement compatible avec les parkings de Londre et de Metz
> - Android et web seulement
> - VPN de l'iut OBLIGATOIRE en attendant un hebergement

---

## INFORMATION

### Technologies
- HTML / JS / CSS => FrontEnd :
   - Fiable, moderne et facile à mettre sur mobile en place sans récoder l'app 
- PHP => BackEnd
   - Fiable, Stable, perforomance garantie
- Cordova => Version Android
  - Facile d'utilisation, maintenue activement 
- mySql => BDD
  - Optimisé, stable et performant 
### Outils
- PHPmyAdmin => Notre BDD
  - Simple d'utilisation
- Discord, trello, git => Collaboration
- Neovim et Vscodium => IDE

## INSTALLATION

- Se connecter à internet
- Se connecter au VPN de l'IUT
- Accéder à l'URL pour tester la version web :
  [Cliquez ici](http://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/)
- Ou, installer et télécharger l'APK sur un téléphone android :
  [Dernière Version](https://github.com/Lecasly10/SAE_3.01/releases/latest/)

Si l'apk ne fonctionne pas, suivre les étapes suivantes (nécessite node/npm et cordova d'installé globalement):

- Cloner ce repo

```
git clone https://github.com/Lecasly10/SAE_3.01.git
```

- Ce rendre dans le dossier /src-Android et init le projet :

```
npm install
```

- Ajouter android :

```
cordova platform add android
```

- Si Android est déjà ajouté :

```
cordova plateform update android
```

- Générer l'Apk :

```
cordova build android

```

- Le fichier ce trouve ici :

```
/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Structure

```
.
├── conf
│   └── conf.inc.php
├── controller
│   ├── js
│   │   ├── api
│   │   │   └── apiService.js
│   │   ├── errors
│   │   │   ├── errors.js
│   │   │   └── globalErrorHandling.js
│   │   ├── events
│   │   │   ├── event.js
│   │   │   ├── map.events.js
│   │   │   ├── settings.events.js
│   │   │   ├── user.events.js
│   │   │   └── vehicule.events.js
│   │   ├── maps
│   │   │   ├── mapService.js
│   │   │   └── styles.js
│   │   ├── navigation
│   │   │   ├── geolocationService.js
│   │   │   └── navigationService.js
│   │   ├── storage
│   │   │   └── storageService.js
│   │   ├── ui
│   │   │   ├── htmlElement.js
│   │   │   └── UI.js
│   │   ├── user
│   │   │   ├── user.js
│   │   │   └── userService.js
│   │   ├── vehicule
│   │   │   └── vehiculeService.js
│   │   ├── main.js
│   │   ├── services.js
│   │   └── utils.js
│   └── php
│       ├── api
│       │   ├── dataAPI.php
│       │   ├── londreApi.php
│       │   ├── metzApi.php
│       │   └── parkingApi.php
│       ├── parking
│       │   ├── closest.php
│       │   ├── getAvailablePlace.php
│       │   ├── load.php
│       │   └── search.php
│       ├── user
│       │   ├── load.php
│       │   ├── login.php
│       │   ├── logout.php
│       │   ├── session.php
│       │   ├── signin.php
│       │   └── update.php
│       ├── utils
│       │   └── response.php
│       ├── vehicle
│       │   ├── create.php
│       │   ├── delete.php
│       │   ├── load.php
│       │   ├── loadAll.php
│       │   └── update.php
│       └── distance.php
├── modele
│   └── php
│       ├── connexion.php
│       ├── parking.class.php
│       ├── parkingCapacity.class.php
│       ├── parkingCapacityDAO.class.php
│       ├── parkingDAO.class.php
│       ├── parkingTarif.class.php
│       ├── parkingTarifDAO.class.php
│       ├── user.class.php
│       ├── userDAO.class.php
│       ├── userPref.class.php
│       ├── userPrefDAO.class.php
│       ├── vehicule.class.php
│       └── vehiculeDAO.class.php
├── vue
│   └── style
│       ├── images
│       │   └── vehicule.png
│       └── style.css
└── index.html
```

## FONCTIONS

### Doc fonctionnelle :

- À quoi sert l’app ?

  - L’application aide les conducteurs à trouver un parking rapidement, à voir s’il reste des places et à être guidés jusqu’au parking choisi.

- Qui utilise l’app ?

  - Conducteurs : cherchent un parking et s’y rendent
  - Admin : met à jour ou ajoute les infos des parkings

- Ce que fait l’app

  - Trouver des parkings autour de moi, ou par une recherche
  - Afficher l'itiniraire du parking sur une carte
  - Indiquer s’il reste des places
  - Donner les infos utiles (prix, horaires, hauteur max…)
  - Lancer la navigation GPS

- Ce que l’app ne fait pas

  - Ne réserve pas de place
  - Ne garantit pas une place libre à l’arrivée (Certaines API sont variable)
  - Ne gère pas le paiement

- Fonctionnalités principales

  - Rechercher un parking
  - Autour de ma position actuelle
  - Avec filtres (prix, distance, dispo)
  - Voir les parkings sur la carte
  - Consulter un parking
  - Sauvegarde et récup. du trajet

- Quand je clique sur un parking, je vois :

  - le nom et l’adresse
  - le nombre de places dispo
  - les tarifs
  - les horaires
  - la hauteur maximale
  - les services (PMR, bornes électriques…)

- Aller au parking

  - Je choisis un parking
  - Je lance la navigation
  - L’app me guide jusqu’au parking
  - Si le parking devient complet, l’app me prévient et en propose un autre

- Cas particuliers

  - GPS désactivé : message d’erreur mais app utilisable
  - Pas de connexion : message d'erreur
  - Aucune dispo connue : pris en compte

- Infos importantes à savoir
  - Les infos de disponibilité peuvent être approximatives
  - L’app aide à trouver un parking, mais ne promet pas une place libre

### Tests App

- Chargement initial

  > Préconditions : navigateur avec JS activé  
  > Étapes :
  > Charger la page
  > Résultat attendu :
  >
  > - Loader visible
  > - UI initialisée
  > - Carte affichée
  > - Aucun message d’erreur

- Démarrage hors ligne

  > Préconditions : couper Internet avant chargement  
  > Résultat attendu :
  >
  > - Notification : Connexion internet indisponible
  > - Application ne plante pas
  > - Loader désactivé

- Perte / retour réseau
  > Étapes :  
  > Lancer l’app  
  > Désactiver Internet
  > Réactiver Internet
  > Résultat attendu :
  >
  > - Notification “Connexion perdue”
  > - Notification “Connexion retrouvée”

### Tests Utilisateurs

- Connexion valide

  > Données : email + mot de passe valides
  > Résultat attendu :
  >
  > - Icône utilisateur changée
  > - Menu paramètres accessible
  > - Notification succès

- Connexion invalide

  > Données : mauvais mot de passe
  > Résultat attendu :
  >
  > - Message d’erreur
  > - Aucun changement d’état utilisateur

- Champs manquants

  > Données : manquante
  > Résultat attendu :
  >
  > - Message d'erreur
  > - Aucun changement d'état utilisateur

- Création de compte

  > Données : formulaire complet
  > Résultat attendu :
  >
  > - Compte créé
  > - Connexion automatique
  > - Notification succès

- Logout
  > Résultat attendu :
  >
  > - User reset
  > - Notification de succès
  > - Icône redevenue “inscription”
  > - Paramètres fermés

### Tests Paramètres utilisateur

- Chargement paramètres

  > Résultat attendu :
  >
  > - Infos utilisateur remplies
  > - Véhicules listés
  > - Véhicule sélectionné restauré depuis storage

- Modification valide

  > Données : formulaire complet
  > Résultat attendu :
  >
  > - Données mises à jour en BDD
  > - Notification succès
  > - Storage véhicule mis à jour

- Modification invalide
  > Données : invalide
  > Résultat attendu :
  >
  > - Message erreur
  > - Aucun changement d'état param utilisateur

### Tests Véhicules

- Liste des véhicules

  > Résultat attendu :
  >
  > - Liste remplie depuis BDD
  > - Boutons edit/supprimer désactivés si aucun véhicule sélectionner

- Création invalide

  > Données : invalide
  > Résultat attendu :
  >
  > - Message erreur
  > - Aucun changement d'état

- Création véhicule

  > Données : formulaire complet
  > Résultat attendu :
  >
  > - Véhicule ajouté
  > - Liste rafraîchie
  > - Notification succès

- Modification véhicule

  > Données : formulaire complet
  > Résultat attendu :
  >
  > - Données mises à jour
  > - Message de succès

- Modification invalide

  > Données : invalide
  > Résultat attendu :
  >
  > - Message erreur
  > - Aucun changement d'état

- Suppression véhicule sélectionné
  > Donnée : véhicule sélectionné
  > Résultat attendu :
  >
  > - Véhicule supprimé
  > - Storage vidé si sélectionné
  > - Liste mise à jour

### Tests Carte & Géolocalisation

- Géolocalisation acceptée

  > Résultat attendu :
  >
  > - Marker utilisateur affiché
  > - Carte centrée

- Géolocalisation refusée

  > Résultat attendu :
  >
  > - Position par défaut utilisée
  > - Message d'erreur
  > - App fonctionnelle

- Bouton recentrage

  > Résultat attendu :
  >
  > - Carte centrée sur l’utilisateur
  > - notification

- Mode nuit
  > Conditions : Heure >= 20h ou < 6h
  > Résultat attendu :
  >
  > - MapId sombre appliqué

### Tests Parkings & Navigation

- Recherche parking

  > Données : texte valide
  > Résultat attendu :
  >
  > - Liste affichée
  > - Aucun crash si résultat vide
  > - Boutons info & navigation actifs

- Liste complète

  > Résultat attendu :
  >
  > - Tous les parkings affichés
  > - Boutons info & navigation actifs

- Détails parking

  > Résultat attendu :
  >
  > - Infos complètes affichées
  > - Tarifs conditionnels (gratuit / payant)

- Navigation vers parking

  > Résultat attendu :
  >
  > - Preview affichée
  > - Itinéraire tracé
  > - Camera orientée
  > - Storage destination mise a jour

- Annulation navigation

  > Résultat attendu :
  >
  > - Route supprimée
  > - UI réinitialisée
  > - Storage destination supprimé

- Redirection automatique
  > Condition : parking plein
  > Résultat attendu :
  >
  > - Recherche parking proche
  > - Notification redirection
  > - Nouvelle navigation lancée

### Tests Storage & persistance

- Reload page en navigation

  > Résultat attendu :
  >
  > - Destination restaurée
  > - notification
  > - Preview affichée

- Storage corrompu
  > Résultat attendu :
  >
  > - Erreur gérée
  > - App continue à fonctionner

### Tests erreurs globales

- API indisponible

  > Résultat attendu :
  >
  > - Notification générique
  > - Aucun crash

- Données invalides (lat/lng)
  > Résultat attendu :
  >
  > - AppError levée
  > - Message utilisateur
