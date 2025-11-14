export async function phpFetch(php, data) {
  try {
    const resp = await fetch(
      `https://devweb.iutmetz.univ-lorraine.fr/~e58632u/sae3/src/controller/php/` +
        php,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!resp.ok) {
      throw new Error(`Erreur serveur (${resp.status})`);
    }

    const json = await resp.json();
    return json;
  } catch (erreur) {
    console.log("Erreur : ", erreur);
    return null;
  }
}
