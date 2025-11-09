<!DOCTYPE html>
<html>

<head>
  <title>Carte qui suit l'utilisateur</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.cdnfonts.com/css/sf-pro-display" rel="stylesheet">
  <link rel="stylesheet" href="../../vue/style/style.css">
  <script type="module" src="../js/main.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>

<body>

  <div id="topnav" class="navbar blur-bg">
      <div class="search-bar" id="search-bar">
        <i class="fa fa-search" aria-hidden="true"></i>
        <form method="post" action='map.php'>
          <input type="text" placeholder="Rechercher..." id="searchbox" name="search"
          value="<?php echo isset($search) ? htmlspecialchars($search, ENT_QUOTES, 'UTF-8') : ''; ?>">
        </form>
      </div>
      <form method ="post" action="map.php">
        <button class="button" type="submit" name="list" value="true">
          <i class="fa fa-list-ol" aria-hidden="true"></i>
        </button>
      </form>
  </div>
  
  <?php
        if(isset($search) && !empty($search)) {
             echo '<div id="rbox" class="blur-bg box">';
             echo '<div class="titlebox"><p>Résultat :</p> 
             <a class="button" id="closeButton"><i class="fa fa-window-close" aria-hidden="true"></i></a></div><hr>';
             if(!empty($lignes)) {
                foreach ($lignes as $ligne) {
                  echo $ligne;
                };
             } else {
                echo "<p>Aucun résultats</p>";
             }
             echo "</div>";
        } 
        if($list == true) {
             echo '<div id="lbox" class="blur-bg box">';
             echo '<div class="titlebox"><p>Listes des Parkings :</p>
             <a class="button" id="closeButton"><i class="fa fa-window-close" aria-hidden="true"></i></a></div><hr>';
             if(!empty($lignesList)) {
                foreach ($lignesList as $ligne) {
                  echo $ligne;
                };
             } else {
                echo "<p>Aucun parkings</p>";
             }
             echo "</div>";
        }
        if(isset($info)) {
            echo '<div id="ibox" class="blur-bg box infobox">';
            echo '<div class="titlebox"><p>' . $parkingName . ' :</p>
            <a class="button" id="closeButton"><i class="fa fa-window-close" aria-hidden="true"></i></a></div><hr>';
            if(!empty($lignesInfo)) {
                foreach ($lignesInfo as $ligne) {
                  echo $ligne;
                };
            } else {
                echo "<p>Aucune Informations</p>";
             }
             echo "</div>";
        } 
  ?>
  <div id="map"></div>
  <div id="bottomnav" class="navbar blur-bg">

    <div id="centerButton" class="button" title="Recentrer">
      <a><i class="fa fa-map-marker" aria-hidden="true"></i></a>
    </div>

    <div id="autoSearchButton" class="button" title="Trouver le parking le plus proche">
        <a><i class="fa fa-flag" aria-hidden="true"></i></a>
    </div>

    <div id="homebutton" class="button" >
      <a href="./map.php" title="Home">
        <i class="fa fa-home" aria-hidden="true" id="home"></i></a>
        <a href="./map.php" title="Annuler">
        <i class="fa fa-times" aria-hidden="true" id="cross"></i></a>
    </div>
    <div id="settingsbutton" class="button" title="Paramètres">
      <a><i class="fa fa-cog" aria-hidden="true"></i></a>
    </div>
  </div>

  <!-- SOURCE : DOCUMENTATION API GOOGLE MAPS -->
  <script>
    (g => {
      var h, a, k, p = "The Google Maps JavaScript API",
        c = "google",
        l = "importLibrary",
        q = "__ib__",
        m = document,
        b = window;
      b = b[c] || (b[c] = {});
      var d = b.maps || (b.maps = {}),
        r = new Set,
        e = new URLSearchParams,
        u = () => h || (h = new Promise(async (f, n) => {
          await (a = m.createElement("script"));
          e.set("libraries", [...r] + "");
          for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
          e.set("callback", c + ".maps." + q);
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
          d[q] = f;
          a.onerror = () => h = n(Error(p + " could not load."));
          a.nonce = m.querySelector("script[nonce]")?.nonce || "";
          m.head.append(a)
        }));
      d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })
    ({
      key: "AIzaSyChCXJQtsRQb2vHdPMbbFMWN3pPX_Q2pzw",
      v: "weekly"
    });
  </script>

</body>

</html>
