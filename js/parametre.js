const ssidEl = document.getElementById("ssid");
const passwordEL = document.getElementById("password");
const timeEl = document.getElementById("time");
const wifiEl = document.getElementById("wifi-form");
const hourFormEl = document.getElementById('hour-form');

if (!ssidEl || !passwordEL || !timeEl || !wifiEl) {
  console.error("L'élément n'existe pas dans le DOM");
}

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

// 📡 Événement sur la soumission du formulaire
wifiEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const wifi_url = "/setInfos-wifi";
  const ssid = ssidEl.value.trim();
  const password = passwordEL.value.trim();

  console.log("Données du formulaire :", ssid, password);

  if (ssid === "" || password === "") {
    console.error("La configuration est vide !");
    return;
  }

  const configData = {
    ssid: ssid,
    password: password
  };

  try {
    const responseData = await fetchESP(wifi_url, configData);

    if (!responseData) {
      console.error("Aucune réponse du serveur");
      return;
    }

    if (responseData?.data) {
      console.log("Données envoyées : ", responseData.data);
    } else {
      console.warn("Réponse inattendue du serveur :", responseData);
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi de la configuration du wifi :", err);
  } finally {
    wifiEl.reset();
  }
});

hourFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url_time = "/setTime";
   // console.log("Réglage");
    //console.log(timeEl.value);
   // console.log(typeof(timeEl.value));
   try {
    const responseData = await fetchESP(url_time,parseInput(timeEl));
    if(!responseData) {
        console.log("Aucune reponse du serveur")
    }
    if (responseData?.data) {
      console.log("Données envoyées : ", responseData.data);
    } else {
      console.warn("Réponse inattendue du serveur :", responseData);
    }
   }
   catch (err){
    console.error("Erreur lors de l'envoi du réglage du temps",err);
   }
   finally {
    hourFormEl.reset();
   }

})

function parseInput(input) {
    if(!input || input.value.trim() === "") {
        console.error("Données invalides pour être parsé");
        return;
    }
    const hour = parseInt(input.value.trim().split(':')[0],10);
    const minute = parseInt(input.value.trim().split(':')[1],10);
    const seconde = 0;
    return {
        heure : hour,
        minute : minute,
        seconde : seconde
    };
}