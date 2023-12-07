let reponseWorks = await fetch('http://localhost:5678/api/works');
let works = await reponseWorks.json();
const modal1 = document.querySelector(".modal1")
const modal2 = document.querySelector(".modal2")
let modal = null
const focusableSelector = "input, a, textarena, button"
let focusables = []
let token = localStorage.getItem("token")


// Fonction d'ouverture de la modale 1

const openModal = function (e) {
    e.preventDefault();
    console.log("openModal - href:", e.target.getAttribute("href")); // Log pour vérifier le href
    const target = document.querySelector(e.target.getAttribute("href"));
    console.log("openModal - target:", target);
    focusables = Array.from(target.querySelectorAll(focusableSelector))
    target.style.display = "flex"
    target.removeAttribute('aria-hidden')
    modal = target
    modal.addEventListener("click", closeModal)
    modal.querySelector('.js-modal-close').addEventListener("click", closeModal)
    modal.querySelector('.js-modal-stop').addEventListener("click", stopPropagation)
}

// Fonction de fermeture de la modale 1

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', "true")
    modal.querySelector('.js-modal-close').removeEventListener("click", closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener("click", stopPropagation)
    modal = null
}

// Fonction empechant la propagation d'un evenement

const stopPropagation = function (e) {
    e.stopPropagation()
}

// Fonction changeant le comportement du focus dans la fênetre modale

const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    if(e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

// Boucle ajoutant un event listener à chaque js-modal pour ouvrir la fenetre modale cible

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

// Ajout d'un event listener pour pouvoir quitter la fenetre modale avec Echap

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if(e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

async function updateWorks() {
    reponseWorks = await fetch('http://localhost:5678/api/works');
    works = await reponseWorks.json();
}

// Fonction d'affichage des Works dans la fenetre modale 1

function afficherWorksModal() {
    // Récupération de l'élément du DOM qui accueillera les images
    const pictureModifier = document.querySelector(".pictureModifier");
    pictureModifier.innerHTML = '';

    for (let i = 0; i < works.length; i++) {

        const worksObject = works[i];
        // Création d’une balise dédiée à une figure
        const figure = document.createElement("figure");
        // Création des balises 
        const img = document.createElement("img");
        img.src = worksObject.imageUrl;
        img.id = worksObject.id

        // Ajout de l'icone remove
        const trashIcon = document.createElement("i");
        trashIcon.classList = "fa-regular fa-trash-can";
        trashIcon.id = worksObject.id;
        figure.appendChild(trashIcon);

        // On rattache la balise figure a la pictureModifier

        pictureModifier.appendChild(figure);

        // On rattache l'ensemble de l'image à la figure
        figure.appendChild(img);

        //Ajout d'un Event Listener pour les trashIcons
        trashIcon.addEventListener("click", function (e) {
            e.preventDefault()
            deletePic(worksObject.id)
        })
        console.log("afficherWorksModal - Creating trash icon for ID:", worksObject.id);
    }
}

afficherWorksModal(works)


// Fonction de suppression des photos

async function deletePic(id) {
    console.log("deletePic - ID:", id);
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:5678/api/works/" + id, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        // Retirer l'élément du DOM si la suppression est réussie
        const elementToRemove = document.getElementById(id);
        console.log("deletePic - elementToRemove:", elementToRemove);
        if (elementToRemove) {
            elementToRemove.parentElement.remove(); // Supprime la figure entière
        }

        // mettre à jour les données (optionnel si la suppression visuelle est suffisante)
        await updateWorks();
        afficherWorksModal(); // pas besoin de passer 'works' car il est déjà à jour

    } catch (error) {
        console.error("Error:", error);
    }
}


function refreshWorks (works) {
    updateWorks()
    afficherWorksModal(works);
}
// Fonction pour passer de la fenetre modale 1 à 2 avec un event listener

function listenAddPic () {
    const addPic = document.querySelector(".addPic")
    addPic.addEventListener("click", function (e) {
        e.preventDefault();
        showModal2();
    });
}

listenAddPic ()

// Fonction pour passer de la fenetre modale 2 à 1 avec un event listener

function listenArrowLeft() {
    const arrowLeft = document.querySelector('.fa-arrow-left');
    arrowLeft.addEventListener('click', function (e) {
      e.preventDefault();
      showModal1();
    });
}


// Fonction pour afficher la fenetre modale 1

function showModal1() {
    const modal2 = document.querySelector('.modal2');
    const modal1 = document.querySelector('.modal1');
  
    modal2.style.display = 'none';
    modal1.style.display = "flex";
}

// Fonction pour afficher la fenetre modale 2

function showModal2() {
    const modal2 = document.querySelector('.modal2');
    const modal1 = document.querySelector('.modal1');
    listenArrowLeft();
    modal2.style.display = "flex";
    modal1.style.display = 'none';
}

function sendPicture(event) {
    event.preventDefault();

    let token = localStorage.getItem("token");
    console.log("Token:", token);
    const fichierPhoto = document.getElementById("addPhoto").files[0];
    if (!fichierPhoto) {
        alert("Aucun fichier sélectionné.");
        return;
    }

    const chargeUtile = new FormData();
    chargeUtile.append("image", fichierPhoto);
    chargeUtile.append("title", document.getElementById("photoTitle").value);
    chargeUtile.append("category", parseInt(document.getElementById("photoCat").options[document.getElementById("photoCat").selectedIndex].value));
    console.log(chargeUtile)

    try {
        const response = fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: chargeUtile
        });

        if (response.ok) {
            const responseData = response.json();
            console.log("Réponse:", responseData);
            // Gérez ici la mise à jour de l'interface utilisateur après l'envoi réussi
        } else {
            // Gestion des différentes réponses d'erreur
            if (response.status === 400) {
                alert("Mauvaise requête");
            } else if (response.status === 401) {
                alert("Vous n'êtes pas autorisé à faire cela");
            } else if (response.status === 500) {
                alert("Erreur serveur");
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi:", error);
    }
}

function getWorksCategories(works) {
    // Création d'un Array pour lister les catégories

    const filterCat = [];

    for (let i = 0; i < works.length; i++) {
      const work = works[i];
      if (!filterCat.includes(work.category.name)) {
        filterCat.push(work.category.name);
      };
    } 

    // Création des options dédiées au modale 2, attributions des valeurs et ID.

    const categories = document.getElementById("photoCat")

    for (let i = 0; i < filterCat.length; i++) {
        const option = document.createElement("option");
        option.innerHTML = filterCat[i];
        option.value = filterCat[i];
        option.id = i + 1;

        // On rattache les options à la div de tous filtres

        categories.appendChild(option);
    }
}

getWorksCategories(works)
const photoForm = document.getElementById("photoForm") 
photoForm.addEventListener("submit", sendPicture)