/****************************
 * API pour la Date et Heure *
 ****************************/

const timeAPI = {
    getTime: async () => {
        // Utilisation de fetchESP pour récupérer l'heure
        const response = await fetchESP('/api/time');
        if (response) {
            return {
                heure: response.hours,
                minute: response.minutes,
                seconde: response.seconds
            };
        } else {
            // Fallback local si l'ESP ne répond pas
            const now = new Date();
            return {
                heure: now.getHours(),
                minute: now.getMinutes(),
                seconde: now.getSeconds()
            };
        }
    }
};

const dateAPI = {
    getDate: async () => {
        // Utilisation de fetchESP pour récupérer la date
        const response = await fetchESP('/api/date');
        if (response) {
            return {
                annee: response.year,
                mois: response.month,
                jour: response.day
            };
        } else {
            // Fallback local
            const now = new Date();
            return {
                annee: now.getFullYear(),
                mois: now.getMonth() + 1,
                jour: now.getDate()
            };
        }
    }
};

/************************
 * API pour les Langues *
 ************************/

const languageAPI = {
    setLanguage: async (lang) => {
        // Envoi de la préférence linguistique à l'ESP
        await fetchESP('/api/language', { language: lang });
        
        // Récupération des traductions depuis l'ESP
        const translations = await fetchESP(`/api/translations/${lang}`);
        
        return translations || {
            'fr': {
                welcome: 'Bienvenue',
                date: 'Date',
                time: 'Heure',
                language: 'Langue',
                version: 'Version'
            },
            'en': {
                welcome: 'Welcome',
                date: 'Date',
                time: 'Time',
                language: 'Language',
                version: 'Version'
            }
        }[lang];
    }
};

/************************
 * API pour la Version *
 ************************/

const versionAPI = {
    getVersion: async () => {
        const response = await fetchESP('/api/version');
        return response || {
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
    await updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 2. Initialiser la langue
    const savedLang = localStorage.getItem('preferredLanguage') || 'fr';
    await changeLanguage(savedLang);
    
    // 3. Initialiser la version
    await displayVersion();
}

async function updateDateTime() {
    try {
        const time = await timeAPI.getTime();
        const date = await dateAPI.getDate();
        
        const timeStr = `${time.heure}:${time.minute}:${time.seconde}`;
        const dateStr = `${date.annee}-${date.mois}-${date.jour}`;
        
        document.getElementById('system-time').textContent = timeStr;
        document.getElementById('system-date').textContent = dateStr;
    } catch (error) {
        console.error("Erreur mise à jour date/heure:", error);
    }
}

// 🔌 Fonction générique pour interagir avec l'ESP
async function fetchESP(url, data = null) {
    const options = data ? {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    } : { method: "GET" };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Erreur HTTP! ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error(`Erreur fetchESP (${url}):`, err);
        return null;
    }
}

/********************
 * Événements DOM  *
 ********************/

document.addEventListener('DOMContentLoaded', initializePage);

// Gestion du sélecteur de langue
document.getElementById("langue").addEventListener("change", function() {
    const lang = this.value;
    changeLanguage(lang);
});

// Fonction de vérification de langue (optionnelle)
function verifierLangue() {
    const select = document.getElementById("langue");
    const langueChoisie = select.value;
    changeLanguage(langueChoisie);
}