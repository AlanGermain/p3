//\\\\\\\\\\\\\\\\\Admin (edit)/////////////////////\\

// 0. Vérifier si le token est bien enregistrer dans le sessionStorage :
// console.log(sessionStorage);

// 1.1. Récupérer le token
const getToken = window.sessionStorage.getItem("token");
// console.log(getToken);

// 1.2. Pouvoir se déconnecter :
function logout(e) {
  // Vider le sessionStorage
  sessionStorage.clear();
  // Retourner à la page d'accueil
  window.location.href = "index.html";
}

// 2 Afficher les éléments du mode edit si c'est l'admin :
if (getToken !== null) {
  // 2.1 Remplacer le "login" par "logout"
  let loginNavName = document.querySelector(".connexion-admin");
  loginNavName.innerHTML = " ";
  loginNavName.innerText = "logout";
  // 2.2. Pouvoir retourner sur la page d'accueil
  loginNavName.addEventListener("click", logout);
  // 2.3. Afficher les éléments de la page admin pour edit :
  // A. Afficher la barre noire :
  const elementBanner = document.querySelector(".barre-modification");
  elementBanner.style.display = null;

  // B. Afficher les boutons de modification :
  const buttonImageModifictation = document.querySelector(
    ".modification-photo"
  );
  buttonImageModifictation.style.display = null;
  const buttonTexteModification = document.querySelector(".modification-texte");
  buttonTexteModification.style.display = null;
  const buttonProjectsModification = document.querySelector(
    ".modification-projets"
  );
  buttonProjectsModification.style.display = null;
}

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
