document.addEventListener('DOMContentLoaded', () => {
    const bouton1 = document.getElementById('sortie-1-button');
    const bouton2 = document.getElementById('sortie-2-button');
    const etat1 = document.getElementById('sortie-1-state');
    const etat2 = document.getElementById('sortie-2-state');

    // Fonction pour récupérer l'état d'une sortie
    function getState(sortie, bouton, affichage) {
        fetch(`/getState/${sortie}`)
            .then(res => res.json())
            .then(data => {
                const etat = data.state;
                affichage.textContent = etat ? "ON" : "OFF";
                bouton.textContent = etat ? "Désactiver" : "Activer";
                bouton.dataset.state = etat; // On mémorise l'état actuel
            })
            .catch(err => console.error(`Erreur getState ${sortie} :`, err));
    }

    // Fonction pour changer l'état
    function toggleState(sortie, bouton, affichage) {
        const nouvelEtat = !(bouton.dataset.state === 'true');
        fetch(`/setState/${sortie}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state: nouvelEtat })
        })
        .then(res => res.json())
        .then(data => {
            // Mise à jour de l'interface
            affichage.textContent = data.state ? "ON" : "OFF";
            bouton.textContent = data.state ? "Désactiver" : "Activer";
            bouton.dataset.state = data.state;
        })
        .catch(err => console.error(`Erreur setState ${sortie} :`, err));
    }

    // Ajouter les événements de clic
    bouton1.addEventListener('click', () => toggleState("sortie1", bouton1, etat1));
    bouton2.addEventListener('click', () => toggleState("sortie2", bouton2, etat2));

    // Appel initial pour récupérer l'état dès le chargement
    getState("sortie1", bouton1, etat1);
    getState("sortie2", bouton2, etat2);
});
