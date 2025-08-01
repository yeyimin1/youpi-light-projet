document.addEventListener("DOMContentLoaded", () => {
  syncSaveState(); 
  const sorties = [1, 2]; // Tu peux facilement ajouter d'autres sorties ici

  sorties.forEach(num => {
    const form = document.getElementById(`sortie-${num}-form`);

    form.addEventListener("submit", async event => {
      event.preventDefault();

      const tache = document.getElementById(`sortie-${num}-taches`).value;
      const onTime = document.getElementById(`sortie-${num}-on_heure`).value;
      const offTime = document.getElementById(`sortie-${num}-off_heure`).value;

      const url = `/sortie-${num}/tache-${tache}`;
      const payload = timeDataset(onTime, offTime);

      try {
        const response = await fetchESP(url, payload);

        if (!response) {
          console.log(`⛔ Aucune réponse du serveur pour sortie ${num}`);
          return;
        }

        if (response?.data) {
          console.log(`✅ Sortie ${num} - Données envoyées :`, response.data);
          if (response.data.message) {
            alert(`🟢 Serveur pour sortie ${num} : ${response.data.message}`);
          } else {
            alert(`🟢 Sortie ${num} programmée avec succès`);
          }
        } else {
          console.warn(`⚠️ Réponse inattendue sortie ${num} :`, response);
        }
      } catch (err) {
        console.error(`❌ Erreur lors de l'envoi pour sortie ${num}`, err);
      } finally {
        form.reset();
      }
    });
  });
});

// 🔌 Fonction générique pour interagir avec l’ESP
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

// Fonction pour parser le temps en entier 

function parseInputTime(time){
  return {
    heure : parseInt(time.split(':')[0],10),
    minute : parseInt(time.split(':')[1],10),
    seconde : 0
  }
}
function timeDataset(on_time, off_time){
  return {
    allumage : parseInputTime(on_time),
    extinction : parseInputTime(off_time)
  }
}
function syncSaveState(sorties = [1, 2]) {
  sorties.forEach(async num => {
    try {
      const response = await fetchESP(`/sortie-${num}/getSave`);
      const checkbox = document.getElementById(`save-sortie-${num}`);

      if (response?.data?.save !== undefined) {
        checkbox.checked = response.data.save;
        console.log(`📝 État sauvegarde sortie ${num} :`, response.data.save);
      } else {
        console.warn(`⚠️ Réponse invalide pour sortie ${num}`, response);
      }
    } catch (err) {
      console.error(`❌ Erreur récupération état sauvegarde sortie ${num}`, err);
    }
  });
}
