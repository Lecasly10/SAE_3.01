# SMART PARKING

Application de navigations vers les différents parking de Metz disponible dans notre BDD.
Possible de trouver le parking le plus proche en 1 clique !

> [!WARNING]
>
> - Actuellement compatible avec les parkings de Londre et de Metz
> - Android et web seulement
> - VPN de l'iut OBLIGATOIRE en attendant un hebergement

---

## INFORMATION

- HTML / JS / CSS => FrontEnd
- PHP => BackEnd
- Cordova => Version Android
- PHPmyAdmin => Notre BDD

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
monApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk
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

### Tests

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
