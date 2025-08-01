/****************************
 * API pour la Date et Heure *
 ****************************/

const timeAPI = {
    getTime: () => {
        const now = new Date();
        return {
            heure: now.getHours(),
            minute: now.getMinutes(),
            seconde: now.getSeconds()
        };
    }
};

const dateAPI = {
    getDate: () => {
        const now = new Date();
        return {
            annee: now.getFullYear(),
            mois: now.getMonth() + 1, // +1 car les mois commencent à 0 en JS
            jour: now.getDate()
        };
    }
};

/************************
 * API pour les Langues *
 ************************/

// Langue par défaut

  function verifierLangue() {
    const select = document.getElementById("langue");
    const langueChoisie = select.value;

    if (langueChoisie === "fr") {
      alert("Vous avez choisi : Français");
      // ici tu peux charger le contenu en français par exemple
    } else if (langueChoisie === "en") {
      alert("You selected: English");
      // ici tu peux charger le contenu en anglais
    }
  }


/************************
 * API pour la Version *
 ************************/

const versionAPI = {
    getVersion: async () => {
        // Simulation de réponse API
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return {
            version: '1.0.2',
            releaseDate: '2023-11-15'
        };
    }
};

/******************************
 * Fonctions d'initialisation *
 ******************************/

async function initializePage() {
    // 1. Initialiser la date et l'heure
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 2. Initialiser la langue (français par défaut)
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    await changeLanguage(savedLang);
    
    // 3. Initialiser la version
    await displayVersion();
}

function updateDateTime() {
    // Utilisation des API exactes comme demandé
    const time = timeAPI.getTime();
    const date = dateAPI.getDate();
    
    // Formatage
    const timeStr = `${time.heure}:${time.minute}:${time.seconde}`;
    const dateStr = `${date.annee}-${date.mois}-${date.jour}`;
    
    // Mise à jour du DOM
    document.getElementById('system-time').textContent = timeStr;
    document.getElementById('system-date').textContent = dateStr;
}

async function changeLanguage(lang) {
    try {
        const translations = await languageAPI.setLanguage(lang);
        
        // Mise à jour des textes
        document.getElementById('welcome-text').textContent = translations.welcome;
        document.getElementById('date-label').textContent = translations.date;
        document.getElementById('time-label').textContent = translations.time;
        document.getElementById('language-label').textContent = translations.language;
        document.getElementById('version-label').textContent = translations.version;
        
        // Sauvegarde du choix
        localStorage.setItem('preferredLanguage', lang);
    } catch (error) {
        console.error("Erreur changement de langue:", error);
    }
}

async function displayVersion() {
    try {
        const versionInfo = await versionAPI.getVersion();
        document.getElementById('version-number').textContent = versionInfo.version;
        document.getElementById('version-date').textContent = versionInfo.releaseDate;
    } catch (error) {
        console.error("Erreur récupération version:", error);
        document.getElementById('version-number').textContent = '1.0.0';
    }
}

/********************
 * Événements DOM  *
 ********************/

document.addEventListener('DOMContentLoaded', initializePage);

document.getElementById('lang-fr').addEventListener('click', () => changeLanguage('fr'));
document.getElementById('lang-en').addEventListener('click', () => changeLanguage('en'));