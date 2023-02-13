/*fetch pour contacter l'API*/
fetch("http://localhost:5678/api/works")
    .then(function(response){
        if(response.ok){
             response.json()

             /*generation de la galerie*/
            .then(function(value){
                console.log(value);
            
                for (let i = 0; i < value.length; i++)   {
                    let article = value[i]
                    let gallery = document.querySelector(".gallery");
                    /*crée la div figure*/
                    let figure = document.createElement ("figure")
                    /*création des images*/
                    let images = document.createElement ("img")
                    console.log(article)
                    images.src = article.imageUrl;
                    images.crossOrigin = "anonymous";
                    let figcaption = document.createElement ("figcaption")
                    figcaption.innerHTML = article.title;
            
                    gallery.appendChild(figure)
                    figure.appendChild(images)
                    figure.appendChild(figcaption)
                    
                }      
             })
        }
    })



    