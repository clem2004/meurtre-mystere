// Données des courriels (chargées depuis emails.json)
let emails = [];

// Références aux éléments du DOM
const emailListContainer = document.getElementById("email-list");
const emailContentContainer = document.getElementById("email-content");
const welcomeMessage = document.getElementById("welcome-message");
let activeEmailItem = null;

// Fonction pour afficher la liste des emails
function renderEmailList() {
  // Inverser pour afficher les plus récents en premier
  const reversedEmails = [...emails].reverse();

  reversedEmails.forEach((email) => {
    const emailItem = document.createElement("div");
    emailItem.className =
      "p-2 cursor-pointer border border-transparent hover:border-green-500 hover:bg-green-900/20";
    emailItem.dataset.id = email.id;

    emailItem.innerHTML = `
        <div class="flex justify-between items-center">
            <p class="text-sm font-bold truncate">${email.from}</p>
        </div>
        <p class="text-xs truncate">${email.subject}</p>
        <p class="text-xs text-green-600">${email.date}</p>
    `;

    // Ajouter l'écouteur d'événement
    emailItem.addEventListener("click", () => {
      displayEmail(email.id);

      // If on small screens, switch to mobile-open mode so the message takes more space
      if (window.innerWidth < 768) {
        document.body.classList.add("mobile-open");
      }

      // Gérer le style de l'élément actif
      if (activeEmailItem) {
        activeEmailItem.classList.remove("bg-green-700/50", "border-green-500");
      }
      emailItem.classList.add("bg-green-700/50", "border-green-500");
      activeEmailItem = emailItem;
    });

    emailListContainer.appendChild(emailItem);
  });
}

// Fonction pour afficher le contenu d'un email
function displayEmail(id) {
  const email = emails.find((e) => e.id === id);
  if (!email) return;

  // Cacher le message d'accueil et afficher le conteneur de contenu
  welcomeMessage.classList.add("hidden");
  emailContentContainer.classList.remove("hidden");
  emailContentContainer.classList.add("flex");

  // Convertir le corps du texte (avec sauts de ligne) en HTML
  const bodyHtml = email.body.replace(/\n/g, "<br>");

  // Injecter le contenu
  emailContentContainer.innerHTML = `
    <div class="md:hidden mb-4">
      <button id="back-btn" class="px-3 py-1 text-sm bg-green-800 text-green-200">← Retour</button>
    </div>
    <!-- En-tête du courriel -->
    <div class="border-b border-green-500/50 pb-4 mb-4">
        <h2 class="text-2xl font-bold text-glow">${email.subject}</h2>
        <div class="mt-2 text-sm text-green-300">
            <p><span class="font-bold w-20 inline-block">DE:</span> ${email.from}</p>
            <p><span class="font-bold w-20 inline-block">À:</span> ${email.to}</p>
            <p><span class="font-bold w-20 inline-block">DATE:</span> ${email.date}</p>
        </div>
    </div>
    
    <!-- Corps du courriel -->
    <div class="flex-1 text-base leading-relaxed pb-4">
        ${bodyHtml}
    </div>
  `;

  // Attach back button handler (only present on small screens)
  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      document.body.classList.remove("mobile-open");
      // hide content and show welcome
      emailContentContainer.classList.add("hidden");
      emailContentContainer.classList.remove("flex");
      welcomeMessage.classList.remove("hidden");
      // clear active selection
      if (activeEmailItem) {
        activeEmailItem.classList.remove("bg-green-700/50", "border-green-500");
        activeEmailItem = null;
      }
    });
  }
}

// Initialisation de l'application: charger les emails depuis emails.json puis afficher
document.addEventListener("DOMContentLoaded", () => {
  fetch("emails.json")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      emails = data;
      renderEmailList();
    })
    .catch((err) => {
      console.error("Failed to load emails.json:", err);
      // En cas d'erreur, on affiche une liste vide (ou les données déjà présentes)
      renderEmailList();
    });
});
