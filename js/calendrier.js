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

      // Définir la route API (ex: sortie-1/tache-1)
      const route = `/sortie-${sortie}/tache-1`;

      try {
        const response = await fetch(`http://192.168.1.100${route}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tache)
        });

        if (response.ok) {
          alert(`Tâche envoyée avec succès à sortie ${sortie}`);
        } else {
          alert(`Erreur ${response.status} lors de l'envoi`);
        }
      } catch (error) {
        alert("Impossible de se connecter à l'API");
      }
    }

    // Gérer la soumission des formulaires
    document.getElementById("sortie-1-form").addEventListener("submit", function(e){
      e.preventDefault();
      envoyerTache(1);
    });

    document.getElementById("sortie-2-form").addEventListener("submit", function(e){
      e.preventDefault();
      envoyerTache(2);
    });

