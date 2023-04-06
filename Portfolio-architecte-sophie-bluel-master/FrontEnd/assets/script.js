//  Récupérer le token
const getToken = window.sessionStorage.getItem("token");
//  Pouvoir se déconnecter :
function deconnexion() {
  // Vider le sessionStorage et donc le token stocker
  sessionStorage.clear();
  // Retourner à la page d'accueil
  window.location.href = "index.html";
}

// création d'un tableau vide
const articles = [];
//
function displayArticles(arts) {
  let gallery = document.querySelector(".gallery");
  //vide les éléments html
  gallery.innerHTML = "";
  console.log(arts);
  // inséré les images dynamiquement
  arts.forEach(function (article) {
    let figure = document.createElement("figure");
    figure.setAttribute("data-id", article.id);
    let images = document.createElement("img");
    images.src = article.imageUrl;
    images.crossOrigin = "anonymous";
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = article.title;
    console.log(figure);

    gallery.appendChild(figure);
    figure.appendChild(images);
    figure.appendChild(figcaption);
  });
}
// appelle a l'api works pour les images
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then(function (response) {
    response.forEach(function (article) {
      articles.push(article);
    });
    displayArticles(articles);
  });

function filtres() {
  // appelle api pour les catégorie.
  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then(function (response) {
      // création  boutons tous
      const buttonsContainer = document.getElementById("btnFilters");
      const allButton = document.createElement("button");
      allButton.classList.add("btn-tous");
      allButton.innerText = "Tous";
      // création d'un intéraction au click
      buttonsContainer.appendChild(allButton);
      allButton.addEventListener("click", function () {
        displayArticles(articles);
      });
      // création des boutons via api
      response.forEach(function (category) {
        let button = document.createElement("button");
        button.innerText = category.name;
        button.classList.add("btn");
        // création d'un intéraction au click affiché chaque catégorie.
        buttonsContainer.appendChild(button);
        button.addEventListener("click", function () {
          displayArticles(
            //parcours chaque objet et compare leur catégories
            articles.filter((objet) => objet.categoryId == category.id)
          );
        });
      });
    });
}
if (!getToken) {
  filtres();
}
//--------------------------------------------------------------------------Admin mode ----------------------------------------------------

// 2 Afficher les éléments du mode edit si c'est l'admin :
if (getToken) {
  adminMode();
}

function adminMode() {
  const login = document.querySelector(".connexion-admin");
  login.remove();
  //création logout
  const ul = document.querySelector("ul");
  const logout = document.createElement("li");
  logout.innerText = "logout";
  ul.appendChild(logout);
  //mettre le logo insta aprés logout
  const insta = document.querySelector(".insta");
  ul.insertBefore(logout, insta);
  logout.addEventListener("click", deconnexion);
  //création de la barre mode édition
  const header = document.getElementById("header");
  const adminBarre = document.createElement("aside");
  adminBarre.classList.add("barre-modification");
  header.appendChild(adminBarre);

  const modeEdition = document.createElement("div");
  modeEdition.classList.add("mode-edition");
  adminBarre.appendChild(modeEdition);

  const icone = document.createElement("i");
  icone.classList.add("fa", "fa-pen-to-square");
  modeEdition.appendChild(icone);

  const p = document.createElement("p");
  p.classList.add("titre-barre");
  p.innerText = "Mode édition";
  modeEdition.appendChild(p);

  const buttonEdit = document.createElement("button");
  buttonEdit.classList.add("bouton-edition");
  buttonEdit.innerText = "publier les changements";
  adminBarre.appendChild(buttonEdit);
  // icone modifier
  const figureIntro = document.querySelector(".figureIntro");
  const modifInactif = document.createElement("div");
  modifInactif.classList.add("modification-photo");
  figureIntro.appendChild(modifInactif);

  const iconeModifier = document.createElement("i");
  iconeModifier.classList.add("fa", "fa-pen-to-square");
  modifInactif.appendChild(iconeModifier);

  const modifier = document.createElement("p");
  modifier.innerText = "modifier";
  modifInactif.appendChild(modifier);

  const articleIntro = document.querySelector(".articleIntro");
  const modifInactif2 = document.createElement("div");
  modifInactif2.classList.add("modification-texte");
  articleIntro.appendChild(modifInactif2);

  const iconeModifier2 = document.createElement("i");
  iconeModifier2.classList.add("fa", "fa-pen-to-square");
  modifInactif2.appendChild(iconeModifier2);

  const modifier2 = document.createElement("p");
  modifier2.innerText = "modifier";
  modifInactif2.appendChild(modifier2);

  const h2Intro = document.querySelector(".h2Intro");
  articleIntro.insertBefore(modifInactif2, h2Intro);

  const divTitre = document.querySelector(".projets-titre-modifications");
  const divModif = document.createElement("div");
  divModif.addEventListener("click", modale);
  divModif.classList.add("modification-projets");
  divTitre.appendChild(divModif);

  const iconeModifActif = document.createElement("i");
  iconeModifActif.classList.add("fa", "fa-pen-to-square");
  divModif.appendChild(iconeModifActif);

  const pModif = document.createElement("p");
  pModif.innerText = "modifier";
  divModif.appendChild(pModif);
}
//-----------------------------------------------------Modale-----------------------------------------------
//création de la modale
function modale() {
  const body = document.querySelector("body");
  const backModale = document.createElement("aside");
  backModale.id = "aside-modals";
  body.appendChild(backModale);

  const fenetreModale = document.createElement("div");
  backModale.appendChild(fenetreModale);
  fenetreModale.classList.add("modal-wrapper");
  //fermeture
  backModale.addEventListener("click", function (event) {
    if (event.target === backModale) {
      backModale.remove();
    }
  });
  const crossClose = document.createElement("i");
  crossClose.classList.add("fa", "fa-xmark", "x-close");
  crossClose.addEventListener("click", function (event) {
    event.preventDefault();
    backModale.remove();
  });
  fenetreModale.appendChild(crossClose);

  const tilteModale = document.createElement("p");
  tilteModale.innerText = "Galerie photo";
  tilteModale.classList.add("title-modal");
  fenetreModale.appendChild(tilteModale);

  const divProjects = document.createElement("div");
  divProjects.classList.add("gallery-modale");
  fenetreModale.appendChild(divProjects);
  //--------appel à la fonction pour afficher la galerie modale----------------------
  modalegallery();

  const btnAjout = document.createElement("button");
  btnAjout.innerText = "Ajouter une photo";
  btnAjout.classList.add("modale-ajout-btn");
  fenetreModale.appendChild(btnAjout);
  //--------------------------------------Création de la modale Ajout----------------------------------------------

  ////////////////////////////////////////////////////////////////////////////////////////ici
  btnAjout.addEventListener("click", async function (event) {
    event.preventDefault();
    const modaleBox = document.querySelector(".modal-wrapper");
    modaleBox.remove();
    const fenetreModale = document.createElement("div");
    backModale.appendChild(fenetreModale);
    fenetreModale.classList.add("modale-upload");
    const divIcon = document.createElement("div");
    divIcon.classList.add("icones");
    fenetreModale.appendChild(divIcon);
    const arrowIcon = document.createElement("i");
    arrowIcon.classList.add("fa", "fa-arrow-left", "icone-retour-ajout");
    divIcon.appendChild(arrowIcon);
    const crossClose = document.createElement("i");
    crossClose.classList.add("fa", "fa-xmark", "x-close");
    divIcon.appendChild(crossClose);
    crossClose.addEventListener("click", function (event) {
      event.preventDefault();
      backModale.remove();
    });
    const contenuModale = document.createElement("div");
    contenuModale.classList.add("modale-contenu");
    fenetreModale.appendChild(contenuModale);
    const titleModaleAjout = document.createElement("p");
    titleModaleAjout.innerText = "Ajout photo";
    titleModaleAjout.classList.add("ajouttitle");
    contenuModale.appendChild(titleModaleAjout);
    //------------------------------------------Création du formulaire-----------------------------------
    const formAdd = document.createElement("form");
    formAdd.action = "submit";
    formAdd.id = "form-post";
    contenuModale.appendChild(formAdd);

    const previewImg = document.createElement("div");
    previewImg.classList.add("blocAjout");
    formAdd.appendChild(previewImg);

    const iconImg = document.createElement("i");
    iconImg.classList.add("fa", "fa-image", "fa-3x");
    previewImg.appendChild(iconImg);

    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = ".png, .jpg";
    inputFile.size = "4000000";
    inputFile.id = "input-file";
    inputFile.name = "image";
    previewImg.appendChild(inputFile);

    inputFile.addEventListener("change", function () {
      // Vérifier que l'utilisateur a sélectionné un fichier
      if (inputFile.files && inputFile.files[0]) {
        //Création d'une instance  de FileReader pour lire le fichier en mode asynchrone
        const reader = new FileReader();
        // fonction de rappel  qui sera appelée lorsque le fichier aura chargé
        reader.onload = function (e) {
          // Créer une balise <img> et définir sa source
          const img = document.createElement("img");
          img.classList.add("image-upload");
          img.src = e.target.result;
          previewImg.appendChild(img);
          btnFile.remove();
          condition.remove();
          iconImg.remove();
        };
        reader.readAsDataURL(inputFile.files[0]);
      }
    });
    const btnFile = document.createElement("button");
    btnFile.id = "files-button";
    btnFile.type = "button";
    btnFile.innerText = "+ Ajout photo";
    previewImg.appendChild(btnFile);

    const condition = document.createElement("p");
    condition.classList.add("image-load");
    condition.innerText = "jpg, png : 4mo max";
    previewImg.appendChild(condition);

    const divInput = document.createElement("div");
    divInput.classList.add("divInput");
    formAdd.appendChild(divInput);

    const labelTitle = document.createElement("label");
    labelTitle.innerHTML = "Titre";
    labelTitle.setAttribute("for", "Titre");
    divInput.appendChild(labelTitle);

    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.id = "title";
    inputTitle.name = "title";
    divInput.appendChild(inputTitle);

    const labelCategorie = document.createElement("label");
    labelCategorie.innerHTML = "Categorie";
    labelCategorie.setAttribute("for", "displayArticles");
    divInput.appendChild(labelCategorie);

    const selectCat = document.createElement("select");
    selectCat.classList.add("niveau-cat");
    divInput.appendChild(selectCat);

    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();
    selectCat.id = "categorie";
    selectCat.name = "catagory";
    divInput.appendChild(selectCat);
    if (selectCat.options.length === 0) {
      //Ajout de l'option vide
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "";
      selectCat.appendChild(emptyOption);
      //Pour chaque catégorie on associe son nom et son id pour créer les options du select
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.textContent = category.name;
        option.setAttribute("data-id", category.id);
        option.id = "option";
        selectCat.appendChild(option);
      });
    }
    const submitBtn = document.createElement("button");
    submitBtn.innerText = "Valider";
    submitBtn.type = "submit";
    submitBtn.classList.add("btn-valider");
    submitBtn.id = "postForm";
    formAdd.appendChild(submitBtn);
    if (fenetreModale) {
      //fonction addProject à l'envois du formulaire
      formAdd.addEventListener("submit", addProjet);
    }
    //Vérification des champs remplis, si tous rempli le bouton valider passe au vert
    inputFile.addEventListener("change", checkInputs);
    inputTitle.addEventListener("change", checkInputs);
    selectCat.addEventListener("change", checkInputs);
    function checkInputs() {
      // Vérifier si tous les éléments ont une valeur
      if (inputFile.value && inputTitle.value && selectCat.value) {
        // Changer la couleur du bouton Valider
        submitBtn.classList.add("green");
      } else {
        submitBtn.classList.remove("green");
      }
    }
  });

  /////////////////////////////////////////////////////////ici
  const btnSuppr = document.createElement("button");
  btnSuppr.innerText = "Supprimer la galerie";
  btnSuppr.classList.add("modale-supprimer-btn");
  fenetreModale.appendChild(btnSuppr);
}
async function modalegallery() {
  //Fetch pour faire en sorte que les projet s'ajoute dynamiquement à l'ouverture de la modale
  const reponse = await fetch("http://localhost:5678/api/works");
  const works = await reponse.json();
  const modale = document.querySelector(".gallery-modale");
  for (let i = 0; i < works.length; i++) {
    //Recupération des données pour les images
    const article = works[i];
    let figureModale = document.createElement("figure");
    figureModale.classList.add("figure-modale");
    figureModale.setAttribute("data-id", works[i].id);
    let contenairImg = document.createElement("div");
    contenairImg.classList.add("containerImg");
    let imgModale = document.createElement("img");
    imgModale.classList.add("imgModale");
    imgModale.src = article.imageUrl;
    imgModale.crossOrigin = "anonymous";
    const editImg = document.createElement("figcaption");
    editImg.innerText = "éditer";
    //Ajout des icones et de leurs fonds
    const containerIconTrash = document.createElement("div");
    containerIconTrash.classList.add("containerIconTrash");
    containerIconTrash.addEventListener("click", supprimerProjet);
    containerIconTrash.setAttribute("data-id", works[i].id);
    //Exécution de la fonction de suppression au clic sur la poubelle

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa", "fa-trash-can");
    const containerIconCross = document.createElement("div");
    containerIconCross.classList.add("containerIconCross");
    containerIconCross.setAttribute("data-id", works[i].id);
    // Ajouter un événement mouseenter à la figure pour afficher containerIconCross
    figureModale.addEventListener("mouseenter", function () {
      containerIconCross.style.display = "flex";
    });
    // Ajouter un événement mouseleave à la figure pour masquer containerIconCross
    figureModale.addEventListener("mouseleave", function () {
      containerIconCross.style.display = "none";
    });
    const crossIcon = document.createElement("i");
    crossIcon.classList.add("fa", "fa-up-down-left-right");
    crossIcon.crossOrigin = "anonymous";
    figureModale.appendChild(contenairImg);
    contenairImg.appendChild(containerIconTrash);
    contenairImg.appendChild(containerIconCross);
    containerIconTrash.appendChild(trashIcon);
    containerIconCross.appendChild(crossIcon);
    modale.appendChild(figureModale);
    contenairImg.append(imgModale);
    figureModale.append(editImg);
  }
}
//-----------------------------------------------------fonction pour la fermeture des modales après l'envoi-------------------------
function fermerModale() {
  const backModale = document.querySelector(".modale");
  if (backModale) {
    backModale.remove();
  }
}
// -----------------------------------fonction pour supprimer un projet-----------------------------------------
async function supprimerProjet(event) {
  event.preventDefault();
  // récupérer l'ID du projet à supprimer
  const id = this.getAttribute("data-id");
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
    });
    if (response.ok) {
      console.log(response);
      console.log(`L'élément a été supprimé`);
      // si la requête a réussi, supprimer l'élément figure correspondant à ce projet de la page
      const figure = document.querySelector(`figure[data-id="${id}"]`);
      figure.remove();
      const figureModale = document.querySelector(
        `figure[data-id="${id}"].figure-modale`
      );
      figureModale.remove();
    } else {
      alert("Erreur lors de la suppression du projet");
    }
  } catch (error) {}
}
//------------------------------------Fin Suppr projet----------------------------------------------------------

//------------------------------------Fonction qui génére le visu du nouveau projet------------------------------
function genererFigure(article) {
  // Créer une nouvelle figure
  let figureElement = document.createElement("figure");
  figureElement.setAttribute("data-category-id", article.categoryId);
  figureElement.setAttribute("data-id", article.id);
  figureElement.classList.add("projet");
  // Créer une image pour la figure
  let imgElement = document.createElement("img");
  imgElement.src = article.imageUrl;
  imgElement.crossOrigin = "anonymous";
  figureElement.appendChild(imgElement);
  // Créer un titre pour la figure
  let titleElement = document.createElement("figcaption");
  titleElement.innerText = article.title;
  figureElement.appendChild(titleElement);
  // Ajouter la figure à la galerie
  const sectionGallery = document.querySelector(".gallery");
  sectionGallery.appendChild(figureElement);
}
//--------------------------------------Ajout de projet---------------------------------------------------------
async function addProjet(event) {
  //prevent defaut pour pas rafraichir
  event.preventDefault();
  //Récupération des inputs
  const inputFile = document.getElementById("input-file");
  const inputTitle = document.getElementById("title");
  const selectCat = document.getElementById("categorie");
  // Vérification des champs obligatoires
  if (!inputFile.value) {
    alert("Veuillez sélectionner une image.");
    return;
  }
  if (!inputTitle.value) {
    alert("Veuillez entrer un titre.");
    return;
  }
  const formData = new FormData();
  formData.append("image", inputFile.files[0]);
  formData.append("title", inputTitle.value);
  formData.append(
    "category",
    selectCat.options[selectCat.selectedIndex].dataset.id
  );
  try {
    const response = await fetch(`http://localhost:5678/api/works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken}`,
      },
      body: formData,
    });
    if (response.ok) {
      const newWork = await response.json();
      console.log(newWork);
      genererFigure(newWork);
      fermerModale();
      console.log(`L'image a bien été envoyée`);
    } else {
      console.log(response);
      console.log(`Erreur lors de l'ajout du projet`);
    }
  } catch (error) {
    console.error(error);
  }
}

//----------------------------------------fin ajout ------------------------------------------------------
