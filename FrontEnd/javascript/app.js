let token = localStorage.getItem("token")
const editMode = document.querySelector(".editMode")
const editButton = document.querySelector(".editButton")
const logStatus = document.querySelector(".logStatus")


// Fonction d'affichage du mode edit

function afficherEditMode() {
    if (token != null) {
        editMode.style.display = "flex";
        editButton.style.display = "flex";
        logStatus.innerHTML = "logout"
    } else {
        userLogOut()
    }
}

// Fonction de deconnexion de l'utilisateur

function userLogOut() {
    logStatus.innerHTML = 'login';
    localStorage.removeItem("token");
    hideEditPage();
}

// Fonction pour cacher le mode Edit

function hideEditPage() {
    if (editMode != null && editButton != null) {
        if (editMode.style.display != 'none' || editButton.style.display != 'none') {

            editMode.style.display = 'none';
            editButton.style.display = 'none';
        }
    }
}

// Event listener du bouton logout

logStatus.addEventListener("click", function () {
    if (token != null) {
        userLogOut()
    }
})

afficherEditMode()