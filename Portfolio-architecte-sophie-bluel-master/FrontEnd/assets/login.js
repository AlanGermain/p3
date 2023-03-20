const form = document.querySelector("form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  //allé cherché dans l'api le tokken et le mail et mdp
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: emailInput.value,
      password: passwordInput.value,
    }),
  });

  const data = await response.json();
  const token = data.token;

  if (token) {
    // Stockez le jeton d'accès dans le stockage local du navigateur
    sessionStorage.setItem("token", token);

    // Redirigez l'utilisateur vers la page index.html
    window.location.href = "index.html";

    // Recherchez les éléments avec l'id "adminMode" dans la page index.html
    const adminModeElements = document.querySelectorAll("#adminMode");

    // Affichez les éléments avec la classe "adminMode"
    adminModeElements.forEach((element) => {
      element.style.display = "flex";
    });
  } else {
    // Affichez un message d'erreur si la connexion a échoué
    alert("Erreur dans l'identifiant ou le mot de passe");
  }
  //LOGOUT
  //fonction pour faire réapparaitre et disparaitre les éléments
  function showViewModeElements() {
    const adminModeElements = document.querySelectorAll("#adminMode");
    adminModeElements.forEach((element) => {
      element.style.display = "none";
    });
  }
  function cacheViewModeElements() {
    const adminModeElements = document.querySelectorAll("#cacheMode");
    adminModeElements.forEach((element) => {
      element.style.display = "flex";
    });
  }

  const logout = document.querySelector(".deconnexion");
  logout.addEventListener("click", function () {
    sessionStorage.clear("token");
    showViewModeElements();
    cacheViewModeElements();
  });
});
//\\\\\\\\\\\\\\\\\Modales/////////////////////\\

//\\\\\\\\\\\\\\\\\Modale d'ouverture/////////////////////\\

let modal = null;

// Arrêter la propagation de la modale
function stopPropagation(e) {
  e.stopPropagation();
}

//Fonction appelée pour faire apparaître les projets dans la modale
async function showProjectsModal() {
  const response = await fetch("http://localhost:5678/api/works");
  const json = await response.json();

  json.forEach((work) => {
    const divProjects = document.querySelector(".galerie-photo");
    const figureElement = document.createElement("figure");
    figureElement.classList.add("figure-modale");
    figureElement.setAttribute("id", "projets " + work.id);
    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    imageElement.setAttribute("crossorigin", "anonymous");
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = "éditer";
    // Bouton et icône
    const deleteButton = document.createElement("button");
    // On lui donne comme id, celui dans l'API
    deleteButton.setAttribute("id", work.id);
    // Au clic du bouton, on exécute la fonction (sur l'id qu'on pointe)
    deleteButton.setAttribute("onclick", "deleteProject(this.id);");
    deleteButton.classList.add("bouton-modale-delete");
    const trashIcone = document.createElement("img");
    trashIcone.src = "assets/icons/trash-can-solid.svg";
    trashIcone.classList.add("icone-modale-delete");
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    deleteButton.appendChild(trashIcone);
    figureElement.appendChild(deleteButton);
    divProjects.appendChild(figureElement);
  });
}

// Pour ouvrir la modale
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;

  //Fermer la modale grâce à la croix
  const closeIcone = document.querySelector(".icone");
  closeIcone.addEventListener("click", closeModal);

  //Fermer la modale au clic à l'extérieur
  const closeModalOutside = document.querySelector(".modal-wrapper");
  closeModalOutside.addEventListener("click", stopPropagation);
  document.querySelector("#modal1").addEventListener("click", closeModal);
};

// Pour fermer la modale
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal = null;
};

// La fonction pour ouvrir la modale est appelée grâce à un addEventListener
document.querySelectorAll(".open-modal1").forEach((a) => {
  a.addEventListener("click", openModal);
  showProjectsModal();
});
