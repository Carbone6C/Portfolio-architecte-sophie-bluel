// Déclaration de toutes les variables :
// Tableau récupérant la liste des travaux sur le backend :
let reponseWorks = await fetch('http://localhost:5678/api/works');
let works = await reponseWorks.json();

function afficherWorks(works) {

    // Récupération de l'élément du DOM qui accueillera les images
    const gallery = document.querySelector(".gallery");
    for (let i = 0; i < works.length; i++) {

        const worksObject = works[i];
        // Création d’une balise dédiée à une figure
        const figure = document.createElement("figure");
        // Création des balises 
        const img = document.createElement("img");
        img.src = worksObject.imageUrl;
        const imgLegend = document.createElement("figcaption");
        imgLegend.innerText = worksObject.title;

        // On rattache la balise figure a la gallery
        gallery.appendChild(figure);

        // On rattache l'ensemble de l'image à la figure
        figure.appendChild(img);
        figure.appendChild(imgLegend)
    }
}

// Function pour afficher le bouton Tous

function afficherTous() {

    // Création de la div du DOM qui accueillera les filtres
    
    const portofoliotitle = document.querySelector("#portfolio h2");
    const allFilter = document.createElement("div");
    allFilter.className = "filters"; 
    portofoliotitle.after(allFilter);

    // Intégration d'un bouton affichant tous les travaux

    const tousFilter = document.createElement("button");
    tousFilter.className = "filterButton";
    tousFilter.innerText = "Tous";
    tousFilter.id = "toutFilter";
    allFilter.appendChild(tousFilter);

    setTousFilterBackground ()
    

    //Ajout du listener pour le button Tous

    tousFilter.addEventListener("click", function () {
        refreshFilters()
        afficherWorks(works)
        setTousFilterBackground ()
    });
}

// Function pour mettre a jour les filtrages

function refreshFilters () {
    document.querySelector('.gallery').innerHTML = "";
}

// Function pour le backgroud du bouton Tous

function setTousFilterBackground () {
    const firstFilter = document.querySelector('.filters').firstChild;
    firstFilter.classList.add('active');
};

// Function pour le backgroud des autres boutons filtres

function changeFilterBackground (filter, filterIndex) {
    filter.forEach((filter, index) => {
        filter.classList.remove('active');
        if (filterIndex === index) {
        filter.classList.add('active');
        }
    });
};

function creerFiltre(){

    // Création d'un Array pour lister les catégories

    const filterCat = [];

    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      if (!filterCat.includes(work.category.name)) {
        filterCat.push(work.category.name);
      };
    } 

    // Création des boutons dédiées aux filtres, attributions de classes et ID pour ces boutons

    const allFilter = document.querySelector(".filters")

    for (let i = 0; i < filterCat.length; i++) {
        const filter = document.createElement("button");
        filter.className = "filterButton";
        filter.id = `${filterCat[i]}`;
        filter.innerText = filterCat[i];

        // On rattache les boutons à la div de tous filtres

        
        allFilter.appendChild(filter);

        // Création des Listeners pour ces boutons

        filter.addEventListener("click", function () {
            const btnId = this.id;
            const filWork = works.filter(function (work) {
            return work.category.name == btnId;
            })
            refreshFilters()
            afficherWorks(filWork)
            changeFilterBackground (filter, btnId)    
        })
    }
}



afficherWorks(works);
afficherTous();
creerFiltre(works)










