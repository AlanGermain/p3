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

/*
function displayWorksList(list) {
  document.querySelector(".gallery").innerHTML = "";
  for (let i = 0; i < list.length; i++) {
    let article = list[i];
    let gallery = document.querySelector(".gallery");
    let figure = document.createElement("figure");
    let images = document.createElement("img");
    images.src = article.imageUrl;
    images.crossOrigin = "anonymous";
    let figcaption = document.createElement("figcaption");
    figcaption.innerHTML = article.title;

    gallery.appendChild(figure);
    figure.appendChild(images);
    figure.appendChild(figcaption);
  }
}

fetch("http://localhost:5678/api/works").then(function (response) {
  if (response.ok) {
    response.json().then(function (value) {
      worksList = value;
      displayWorksList(worksList);
    });
  }
});
fetch("http://localhost:5678/api/categories").then(function (response) {
  if (response.ok)
    response
      .json()

      .then(function (value) {
        let boutons = document.querySelector("#btnFilters");
        let tousButton = document.createElement("button");
        tousButton.innerText = "Tous";
        boutons.appendChild(tousButton);
        tousButton.classList.add("btn-tous");
        tousButton.addEventListener("click", function () {
          displayWorksList(worksList);
        });

        for (let i = 0; i < value.length; i++) {
          let categorie = value[i];


          let boutons = document.querySelector("#btnFilters");

          let bouton = document.createElement("button");
          bouton.innerText = categorie.name;

          bouton.addEventListener("click", function () {
            displayWorksList(
              worksList.filter((objet) => objet.categoryId == categorie.id)
            );
          });

          boutons.appendChild(bouton);
          bouton.classList.add("btn");
        }
      });
});
*/
