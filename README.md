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

Si l'apk ne fonctionne pas, suivre les étapes suivantes (nécessite cordova d'installé globalement):

- Cloner ce repo

```
git clone https://github.com/Lecasly10/SAE_3.01.git
```

- Créer le projet :

```
cordova create monApp com.exemple.monapp MonApp cd monApp
```

- Copier les fichiers dans monApp/www

```
.
├── controller
│   └── js
│       ├── api
│       │   └── apiService.js
│       ├── errors
│       │   ├── errors.js
│       │   └── globalErrorHandling.js
│       ├── events
│       │   ├── event.js
│       │   ├── map.events.js
│       │   ├── settings.events.js
│       │   ├── user.events.js
│       │   └── vehicule.events.js
│       ├── maps
│       │   ├── mapService.js
│       │   └── styles.js
│       ├── navigation
│       │   ├── geolocationService.js
│       │   └── navigationService.js
│       ├── storage
│       │   └── storageService.js
│       ├── ui
│       │   ├── htmlElement.js
│       │   └── UI.js
│       ├── user
│       │   ├── user.js
│       │   └── userService.js
│       ├── vehicule
│       │   └── vehiculeService.js
│       ├── main.js
│       ├── services.js
│       └── utils.js
├── vue
│   └── style
│       ├── images
│       │   └── vehicule.png
│       └── style.css
└── index.html
```

- Ajouter android et générer l'apk

```
cordova platform add android
cordova build android
```

- le fichier ce trouve ici :

```
monApp/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## FONCTIONS

- Recherche des parkings
- Recherche du parking le plus proche
- Gestion des véhicules
- Création et gestion de Compte
