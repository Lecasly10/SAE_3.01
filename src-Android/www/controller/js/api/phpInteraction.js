//Fct pour call PHP
export async function phpFetch(php, data, options = null) {
  options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...options
  }

  try {
    const resp = await fetch(
      //devweb de l'iut
      `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/` +
      php + ".php", options
    );

    if (!resp.ok) {
      throw new Error(`Erreur serveur (${resp.status})`);
    }

    const json = await resp.json();
    return json;
  } catch (erreur) {
    console.log("Erreur Serveur : ", erreur);
    return null;
  }
}