async function afficherWorks() {
    const reponseWorks = await fetch("http://localhost:5678/api/works");
    const works = await reponseWorks.json();

    // Récupération de l'élément du DOM qui accueillera les images
    const gallery = document.querySelector(".gallery")
    for (let i = 0; i < works.length; i++) {

        const worksObject = works[i];
        // Création d’une balise dédiée à une figure
        const figure = document.createElement("figure");
        // Création des balises 
        const img = document.createElement("img");
        img.src = works[i].imageUrl;
        const imgLegend = document.createElement("figcaption");
        imgLegend.innerText = works[i].title;

        // On rattache la balise figure a la gallery
        gallery.appendChild(figure);

        // On rattache l'ensemble de l'image à la figure
        figure.appendChild(img);
        figure.appendChild(imgLegend)
    }

    const reponseCategories = await fetch("http://localhost:5678/api/categories");
    const categories = await reponseCategories.json();

    for (let i = 0; i < categories.length; i++) {

        const categoriesFilters = categories[i];
        // Récupération de la section du DOM qui accueillera les filtres
        const portofoliotitle = document.querySelector("#portfolio h2");
        // Création d’une balise dédiée aux filtres
        const input = document.createElement("input");
        input.type = "submit";
        input.value = categories[i].name;

        // On rattache la balise figure a la gallery
        portofoliotitle.after(input);
    }

}


afficherWorks()