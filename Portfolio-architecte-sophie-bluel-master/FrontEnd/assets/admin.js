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

//\\\\\\\\\\\\\\\\\Afficher projets petit format/////////////////////\\

// Création d'une méthode pour afficher des projets
function createWorksModal(work) {
  const divProjects = document.querySelector(".galerie-photo");
  const figureElement = document.createElement("figure");
  figureElement.classList.add("figure-modale");
  figureElement.setAttribute("id", "projets " + work.id); // On lui donne comme id son id dans l'API (1, 2, 3,...)
  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  imageElement.setAttribute("crossorigin", "anonymous");
  const figcaptionElement = document.createElement("figcaption");
  figcaptionElement.innerText = "éditer";
  // Bouton et icône
  const deleteButton = document.createElement("button");
  // On lui donne comme id, celui dans l'API
  deleteButton.setAttribute("id", work.id);
  // Au clic du bouton, on exécute la fonction (sur la figure avec l'id correspondant)
  deleteButton.setAttribute("onclick", "deleteProject(this.id);");
  deleteButton.classList.add("bouton-modale-delete");
  const icone = document.createElement("span");
  icone.innerHTML = '<i class="fa-solid fa-trash-can icone-modale-delete"></i>';
  const moveIcone = document.createElement("span");
  moveIcone.innerHTML =
    '<i class="fa-solid fa-arrows-up-down-left-right move-icone"></i>';

  divProjects.appendChild(figureElement);
  figureElement.appendChild(imageElement);
  figureElement.appendChild(figcaptionElement);
  figureElement.appendChild(deleteButton);
  deleteButton.appendChild(icone);
  figureElement.appendChild(moveIcone);
}

async function showProjectsModal() {
  const response = await fetch("http://localhost:5678/api/works");
  const json = await response.json();
  json.forEach((work) => {
    // On appelle la méthode qui permet afficher des projets en petit format
    createWorksModal(work);
  });
}

//\\\\\\\\\\\\\\\\\Modale d'ouverture/////////////////////\\

// Arrêter la propagation de la modale
function stopPropagation(event) {
  event.stopPropagation();
}

// Fonction pour ouvrir la modale
function showModal(aside, openButton, iconeClose, divModal) {
  // Les paramètres sont utiles pour choisir quelle modale on souhaite ouvrir
  const chooseModal = document.getElementById(aside);
  const chooseButton = document.getElementById(openButton);
  if (chooseButton !== null) {
    chooseButton.addEventListener("click", function () {
      chooseModal.style.display = "flex";
    });
    chooseModal.addEventListener("click", closeModal);
    // Fermer la modale au clic sur la croix
    chooseModal.querySelector(iconeClose).addEventListener("click", closeModal);
    // Fermer la modale au clic à l'extérieur de la modale
    chooseModal
      .querySelector(divModal)
      .addEventListener("click", stopPropagation);
  }
}

// Fonction pour fermer la modale
function closeModal() {
  const chooseModal = document.getElementById("aside-modals");
  chooseModal.style.display = "none";
  formEmpty(); // Fonction créée plus bas, pour vider le formulaire d'ajout si modale fermée
}

// Appel des fonctions pour la modale dans une fonction globale (une pour chaque modale)
function methodFirstModal() {
  // On va cherher le lien pour ouvrir la 1e modale
  document.querySelectorAll(".open-modal1").forEach((call) => {
    // On change les paramètres pour la méthode d'ouverture de modale
    call.addEventListener(
      "click",
      showModal(
        "aside-modals",
        "open-modal-wrapper",
        ".icone",
        ".modal-wrapper"
      )
    );
    // Affichage des projets
    showProjectsModal();
  });
}

methodFirstModal();

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
  // 1. Sur la page de base
  const deleteModalProjectsNoRefresh = document.getElementById(
    "projets " + clicked_id
  );
  const figure = document.querySelector(`figure[data-id="${id}"]`);
  figure.remove();
  deleteModalProjectsNoRefresh.remove();
  // 2. Dans la modale
  const deleteProjectsNoRefresh = document.getElementById(
    "galery " + clicked_id
  );
  deleteProjectsNoRefresh.remove();
}

//\\\\\\\\\\\\\\\\\Modale d'ajout/////////////////////\\

// Vider le formulaire s'il est rempli et qu'on quitte la modale
function formEmpty() {
  const addingWorksForm = document.querySelector(".form-upload");
  addingWorksForm.reset();
  // Message d'erreur' d'envoi de projet caché de base
  const errorMessage = document.getElementById("error-message-work");
  errorMessage.style.display = "none";
  // Message de validation d'envoi de projet caché de base
  const validationMessage = document.getElementById("validation-message-work");
  validationMessage.style.display = "none";
}

// Fonction pour choisir la modale à afficher (changer son style)
function changeModal(styleModal1, modalDirection, styleModal2) {
  document.querySelector(".modal-wrapper").style.display = styleModal1;
  // Ici on change la direction de la modale, afin de lui redonner son état d'origine (qui est en colonne)
  document.querySelector(".modal-wrapper").style.flexDirection = modalDirection;
  document.querySelector(".modale-upload").style.display = styleModal2;
}

// Fonction pour ouvrir la 2e modale
function methodSecondModal() {
  // On récupère le bouton qui ouvre la 2e modale
  document.querySelectorAll(".open-modal-upload").forEach((call) => {
    call.addEventListener("click", () => {
      // On lui applique ces méthodes au clic du bouton
      changeModal("none", "", "flex"); // Le 2e paramètre est inutile car il concerne la 1e modale
      showModal(
        "aside-modals",
        "open-second-modal",
        ".cross-upload",
        ".modale-upload"
      );
    });
  });
}

methodSecondModal();

// Sert à utiliser la flèche de la 2e modale afin de revenir en arrière
let returnFirstModale = document.querySelector(".arrow");
returnFirstModale.addEventListener("click", () => {
  changeModal("flex", "column", "none");
  formEmpty();
});

//\\\\\\\\\\\\\\\\\Ajouter un projet/////////////////////\\

// Afficher l'image choisie
// 1. On récupère l'input pour ajouter une image
let imageForm = document.getElementById("upload-image");
// 2. On lui applique un listener pour changer son style
imageForm.addEventListener("change", function (event) {
  let newReader = new FileReader(); // Permet de lire le fichier choisi
  // 3. On vise le 1er document (et unique ici)
  let file = event.target.files[0];
  newReader.onload = function (event) {
    let imageUpload = document.createElement("img");
    imageUpload.classList.add("image-load");
    // 4. Récupérer la source image sur le pc
    imageUpload.src = event.target.result;
    let divImageForm = document.getElementById("change-image");
    // 5. Vider la div de l'input
    divImageForm.innerHTML = "";
    // 6. Lier l'image à la div pour remplacer son ancien contenu
    divImageForm.appendChild(imageUpload);
  };
  // 7. Cette méthode sert à lire le contenu du fichier choisi (file)
  newReader.readAsDataURL(file);
});

// Fonction pour ajouter un projet :
async function AddWorksFetch() {
  // Récupération des valeurs renseignées dans le formulaire
  const addPicture = document.getElementById("upload-image");
  const addTitle = document.getElementById("title-project");
  const addCategory = document.getElementById("categorie-projet");

  // Récupération du formulaire (+ ajout d'un EventListener)
  const addingWorksForm = document.querySelector(".form-upload");
  addingWorksForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Condition pour que le formulaire s'envoie
    if (!addPicture.files[0] || !addTitle.value || !addCategory.value) {
      // Message d'erreur :
      const errorMessage = document.getElementById("error-message-work");
      errorMessage.style.display = "flex";
      // Message de validation d'envoi de projet caché de base
      const validationMessage = document.getElementById(
        "validation-message-work"
      );
      validationMessage.style.display = "none";
      return;
      // Le code s'arrête là si les conditions ne sont pas remplies
    }
    // Permet de cacher le message s'il y a eu une erreur auparavant
    const errorMessage = document.getElementById("error-message-work");
    errorMessage.style.display = "none";

    // FormData utile pour l'appel à fetch (POST)
    let formData = new FormData();
    formData.append("title", addTitle.value);
    formData.append("image", addPicture.files[0]);
    formData.append("category", addCategory.value);

    // Appel fetch (si le formulaire rempli entièrement)
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken}` },
      body: formData,
    })
      // On rend le résultat au format json, pour l'afficher
      .then((resultat) => {
        return resultat.json();
      })

      // Éviter de refresh la page
      .then((work) => {
        // On appelle la méthode pour afficher les projets sur la page
        createWork(work);
        // On appelle la méthode pour afficher les projets sur la modale
        createWorksModal(work);
      });

    // Condition exécutée si le projet a été ajouté avec succès
    if (addPicture.files[0] || addTitle.value || addCategory.value) {
      // Message de validation :
      const validationMessage = document.getElementById(
        "validation-message-work"
      );
      validationMessage.style.display = "flex";
    }
  });
}

AddWorksFetch();
