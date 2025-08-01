
async function fetchESP(url, data = null) {
  const options = data
    ? {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      }
    : { method: "GET" };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Réponse du serveur : ", responseData);
    return responseData;
  } catch (err) {
    console.error("Erreur lors du fetch avec l'esp !", err);
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bouton1 = document.getElementById('sortie-1-button');
  const bouton2 = document.getElementById('sortie-2-button');
  const etat1 = document.getElementById('sortie-1-state');
  const etat2 = document.getElementById('sortie-2-state');

  async function getState(sortie, bouton, affichage) {
    const data = await fetchESP(`/getState/${sortie}`);
    if (data !== null && typeof data.state === 'boolean') {
      affichage.textContent = data.state ? "ON" : "OFF";
      bouton.textContent = data.state ? "Désactiver" : "Activer";
      bouton.dataset.state = data.state;
    }
  }

  async function toggleState(sortie, bouton, affichage) {
    const nouvelEtat = !(bouton.dataset.state === 'true');
    const data = await fetchESP(`/setState/${sortie}`, { state: nouvelEtat });

    if (data !== null && typeof data.state === 'boolean') {
      affichage.textContent = data.state ? "ON" : "OFF";
      bouton.textContent = data.state ? "Désactiver" : "Activer";
      bouton.dataset.state = data.state;
    }
  }

  bouton1.addEventListener('click', () => toggleState("sortie1", bouton1, etat1));
  bouton2.addEventListener('click', () => toggleState("sortie2", bouton2, etat2));

  getState("sortie1", bouton1, etat1);
  getState("sortie2", bouton2, etat2);
});
