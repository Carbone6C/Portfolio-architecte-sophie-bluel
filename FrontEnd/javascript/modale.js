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
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute("href"))
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
    }
}

afficherWorksModal(works)

// Fonction de suppression des photos

function deletePic(id, works) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }
        if (response.status === 204) {
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (data !== null) {
            console.log("Data:", data);
        } else {
            refreshWorks (works)
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
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

function acceptForm () {
    const picture = document.getElementById("addPic")
    const titre = document.getElementById("photoTitle")
    const photoCat = document.getElementById("photoCat")
    const envoiPhoto = document.getElementById("envoiPhoto")
    if (picture != null && titre != null && photoCat != null) {
        envoiPhoto.disabled = false
    }
}

acceptForm () 
