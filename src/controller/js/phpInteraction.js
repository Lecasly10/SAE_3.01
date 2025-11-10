export async function phpFetch(php, data) {
  try {
    const resp = await fetch(php, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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
