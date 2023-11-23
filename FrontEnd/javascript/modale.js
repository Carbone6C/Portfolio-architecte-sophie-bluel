let reponseWorks = await fetch('http://localhost:5678/api/works');
let works = await reponseWorks.json();
const editMode = document.querySelector(".editMode")
const editButton = document.querySelector(".editButton")
const logStatus = document.querySelector(".logStatus")
const modal1 = document.querySelector(".modal1")
const modal2 = document.querySelector(".modal2")
let modal = null
const focusableSelector = "input, a, textarena, button"
let focusables = []

function afficherEditMode() {
    editMode.style.display = "flex";
    editButton.style.display = "flex";
    logStatus.innerHTML = "logout"
}

afficherEditMode();

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

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', "true")
    modal.querySelector('.js-modal-close').removeEventListener("click", closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

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

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if(e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})


function afficherWorksModal(works) {
    // Récupération de l'élément du DOM qui accueillera les images
    const pictureModifier = document.querySelector(".pictureModifier");
    for (let i = 0; i < works.length; i++) {

        const worksObject = works[i];
        // Création d’une balise dédiée à une figure
        const figure = document.createElement("figure");
        // Création des balises 
        const img = document.createElement("img");
        img.src = worksObject.imageUrl;

        // Ajout de l'icone remove
        const trashIcon = document.createElement("i");
        trashIcon.classList = "fa-regular fa-trash-can";
        figure.appendChild(trashIcon);

        // On rattache la balise figure a la pictureModifier

        pictureModifier.appendChild(figure);

        // On rattache l'ensemble de l'image à la figure
        figure.appendChild(img);
    }
}

function trashListener() {
    const trashIcons = document.querySelectorAll(".fa-trash-can")

    for (let i = 0; i > deletePic.length; i++) {
        trashIcons[i].addEventListener("click", deletePic())
    }
}

function deletePic() {
    //Création de la charge utile du login

    const id = i;

    // Envoie des données à l'API

    fetch('http://localhost:5678/api/works/', {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(id)
    })
        // Redirection vers la page index.html si la reponse est le code 200
        .then((response) => {
            if (response === 401) {
                alert("Action non autorisé, veuillez vous connecter en tant qu'administrateur");
                throw new Error("Action non autorisé, veuillez vous connecter en tant qu'administrateur");
            } else if (response === 500) {
                alert("Action non reconnue");
                throw new Error("Action non reconnue");
            } else if (response.ok == true) {

            }
            // On transforme la promesse du serv en format JSON
            return response.json();
        })
}

function listenAddPic () {
    const addPic = document.querySelector(".addPic")
    addPic.addEventListener("click", function (e) {
        e.preventDefault();
        showModal2();
    });
}

function listenArrowLeft() {
    const arrowLeft = document.querySelector('.fa-arrow-left');
    arrowLeft.addEventListener('click', function (e) {
      e.preventDefault();
      showModal1();
    });
}

function showModal2() {
    const modal2 = document.querySelector('.modal2');
    const modal1 = document.querySelector('.modal1');
    listenArrowLeft();
    modal2.style.display = "flex";
    modal1.style.display = 'none';
}

function showModal1() {
    const modal2 = document.querySelector('.modal2');
    const modal1 = document.querySelector('.modal1');
  
    modal2.style.display = 'none';
    modal1.style.display = "flex";
}


afficherWorksModal(works)
listenAddPic ()