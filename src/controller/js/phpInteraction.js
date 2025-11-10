function getBaseURL() {
  const { origin, pathname } = window.location;

  const basePath = pathname.substring(0, pathname.lastIndexOf("/") + 1);

  return `${origin}${basePath}controller/php/`;
}

export async function phpFetch(php, data) {
  const BASE_URL = getBaseURL();
  try {
    const resp = await fetch(BASE_URL + php, {
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
