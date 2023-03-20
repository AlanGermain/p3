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

// Fonction appelée pour faire apparaître les projets dans la modale
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
    const icon = document.createElement("span");
    icon.innerHTML =
      '<i class="fa-solid fa-trash-can icone-modale-delete"></i>';
    const moveIcone = document.querySelector(".move-icone");
    divProjects.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    figureElement.appendChild(deleteButton);
    figureElement.appendChild(moveIcone);
    deleteButton.appendChild(icon);
  });
  // Ajouter l'icône pour déplacer les projets (déco)
  let moveFigure = document.createElement("span");
  moveFigure.innerHTML =
    '<i class="fa-solid fa-arrows-up-down-left-right move-icone"></i>';
  console.log(moveFigure);
  let test = json[0];
  console.log(test);
  // test.appendChild(moveFigure);
  // test.push(moveFigure);
}

// Arrêter la propagation de la modale
function stopPropagation(e) {
  e.stopPropagation();
}

// Fonction pour ouvrir la modale
function openModal(modal, button, cross, wrapper) {
  // Les paramètres sont utiles pour choisir quelle modale on souhaite ouvrir
  const chooseModal = document.getElementById(modal);
  const chooseButton = document.getElementById(button);
  if (chooseButton !== null) {
    chooseButton.addEventListener("click", function () {
      chooseModal.style.display = "flex";
    });
    chooseModal.addEventListener("click", closeModal);
    // Fermer la modale au clic sur la croix
    chooseModal.querySelector(cross).addEventListener("click", closeModal);
    // Fermer la modale au clic à l'extérieur de la modale
    chooseModal
      .querySelector(wrapper)
      .addEventListener("click", stopPropagation);
  }
}

// Fonction pour fermer la modale
function closeModal() {
  const chooseModal = document.getElementById("modal1");
  chooseModal.style.display = "none";
}

// Appel des fonctions pour la modale dans une fonction globale (une pour chaque modale)
function openFirstModal() {
  document.querySelectorAll(".open-modal1").forEach((call) => {
    call.addEventListener(
      "click",
      openModal("modal1", "open-modal-wrapper", ".icone", ".modal-wrapper")
    );
    showProjectsModal();
  });
}

openFirstModal();

//\\\\\\\\\\\\\\\\\Suppression de projet/////////////////////\\

async function deleteProject(clicked_id) {
  const response = await fetch(
    `http://localhost:5678/api/works/${clicked_id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getToken}`,
      },
    }
  );

  // Ne pas rafraîchir la page quand on supprime un projet
  const deleteModalProjectsNoRefresh = document.getElementById(
    "projets " + clicked_id
  );
  deleteModalProjectsNoRefresh.remove();

  const deleteProjectsNoRefresh = document.getElementById(
    "galery " + clicked_id
  );
  deleteProjectsNoRefresh.remove();
}

//\\\\\\\\\\\\\\\\\Modale d'ajout/////////////////////\\

// Fonction pour choisir la modale à afficher
function changeModal(modal1, modalDirection, modal2) {
  document.querySelector(".modal-wrapper").style.display = modal1;
  // Ici on change la direction de la modale, afin de lui redonner son état d'origine (qui est en colonne)
  document.querySelector(".modal-wrapper").style.flexDirection = modalDirection;
  document.querySelector(".modale-upload").style.display = modal2;
}

// Fonction pour ouvrir la 2e modale
function openSecondModal() {
  document.querySelectorAll(".open-modal-upload").forEach((call) => {
    call.addEventListener("click", () => {
      changeModal("none", "", "flex");
      openModal(
        "modal1",
        "open-second-modal",
        ".cross-upload",
        ".modale-upload"
      );
    });
  });
}

openSecondModal();

// Sert à utiliser la flèche de la 2e modale afin de revenir en arrière
let returnFirstModale = document.querySelector(".arrow");
returnFirstModale.addEventListener("click", () => {
  changeModal("flex", "column", "none");
});
