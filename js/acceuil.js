const hourEl = document.getElementById('hour');
const minuteEl = document.getElementById('minute');
const secondeEl = document.getElementById('seconde');
const yearEl = document.getElementById('year');
const monthEl = document.getElementById('month');
const dayEl = document.getElementById('day');

document.addEventListener('DOMContentLoaded', () => {
  acceuilInit();
});

function acceuilInit() {
  scheduleDateUpdate(); // lancement cyclique de la date
  scheduleTimeUpdate(); // lancement cyclique de l’heure
}

// ⏳ Mise à jour toutes les 12h (43_200_000 ms)
function scheduleDateUpdate() {
  updateDate().finally(() => {
    setTimeout(scheduleDateUpdate, 43200000);
  });
}

// ⏱️ Mise à jour toutes les secondes
function scheduleTimeUpdate() {
  updateTime().finally(() => {
    setTimeout(scheduleTimeUpdate, 1000);
  });
}

// 📆 Mise à jour de la date
async function updateDate() {
  const url_date = "/getDate";
  try {
    const response = await fetchESP(url_date);
    if (!response) {
      console.log("Aucune donnée du serveur pour la date");
      return;
    }
    if (response?.data) {
      const { annee, mois, jour } = response.data;
      console.log("Données reçues pour la date :", response.data);
      yearEl.textContent = annee ?? "--";
      monthEl.textContent = mois ?? "--";
      dayEl.textContent = jour ?? "--";
    } else {
      console.warn("Réponse inattendue du serveur (date) :", response);
    }
  } catch (err) {
    console.error("Erreur lors de la récupération de la date :", err);
  }
}

// ⌚ Mise à jour de l’heure
async function updateTime() {
  const url_time = "/getTime";
  try {
    const response = await fetchESP(url_time);
    if (!response) {
      console.log("Aucune réponse du serveur pour l’heure");
      return;
    }
    if (response?.data) {
      const { heure, minute, seconde } = response.data;
      console.log("Données reçues pour l’heure :", response.data);
      hourEl.textContent = heure ?? "--";
      minuteEl.textContent = minute ?? "--";
      secondeEl.textContent = seconde ?? "--";
    } else {
      console.warn("Réponse inattendue du serveur (heure) :", response);
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l’heure :", err);
  }
}

// 🔌 Requête générique vers l’ESP
async function fetchESP(url, data = null) {
  const options = data
    ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }
    : { method: "GET" };

  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Erreur HTTP! ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Erreur fetchESP (${url}):`, err);
    return null;
  }
}
