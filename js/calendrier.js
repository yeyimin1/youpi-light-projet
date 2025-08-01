// Fonction générique pour interagir avec l’ESP
async function fetchESP(url, data = null) {
  const options = data
    ? {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    : { method: "GET" };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! ${response.status}`);
    }

    // On tente de parser la réponse JSON si possible
    try {
      const responseData = await response.json();
      console.log("Réponse du serveur :", responseData);
      return responseData;
    } catch {
      console.log("Réponse texte :", await response.text());
      return null;
    }
  } catch (err) {
    console.error("Erreur lors du fetch avec l'ESP !", err);
    return null;
  }
}

// Fonction pour envoyer une tâche à l'API
async function envoyerTache(sortie) {
  const onTime = document.getElementById(`sortie-${sortie}-on`).value;
  const offTime = document.getElementById(`sortie-${sortie}-off`).value;

  // Séparer heure et minute
  const [onHour, onMinute] = onTime.split(':').map(Number);
  const [offHour, offMinute] = offTime.split(':').map(Number);

  // Construire le JSON
  const tache = {
    allumage: { heure: onHour, minute: onMinute },
    extinction: { heure: offHour, minute: offMinute }
  };

  // Route API
  const route = `/sortie-${sortie}/tache-1`;
  const url = `http://192.168.1.100${route}`;

  // Utiliser fetchESP pour envoyer la requête
  const reponse = await fetchESP(url, tache);

  if (reponse !== null) {
    alert(`✅ Tâche envoyée avec succès à sortie ${sortie}`);
  } else {
    alert(`❌ Impossible d'envoyer la tâche à sortie ${sortie}`);
  }
}

// Gestion de la soumission des formulaires
document.getElementById("sortie-1-form").addEventListener("submit", function (e) {
  e.preventDefault();
  envoyerTache(1);
});

document.getElementById("sortie-2-form").addEventListener("submit", function (e) {
  e.preventDefault();
  envoyerTache(2);
});


