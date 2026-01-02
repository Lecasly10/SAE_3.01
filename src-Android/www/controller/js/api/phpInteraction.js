// Fct pour call PHP avec cordova-plugin-advanced-http
export function phpFetch(php, data = {}, options = {}) {
  const url = `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/${php}.php`;

  return new Promise((resolve) => {
    cordova.plugin.http.post(
      url,
      data,
      { 'Content-Type': 'application/json' },
      function (resp) {
        try {
          resolve(JSON.parse(resp.data));
        } catch (err) {
          console.error('Erreur parsing JSON :', err);
          resolve(null);
        }
      },
      function (err) {
        console.error('Erreur Serveur :', JSON.stringify(err, null, 2));
        resolve(null);
      }
    );
  });
}
