let token = localStorage.getItem("token")
const editMode = document.querySelector(".editMode")
const editButton = document.querySelector(".editButton")
const logStatus = document.querySelector(".logStatus")
let loginStatusValue = logStatus.innerHTML


// Fonction d'affichage du mode edit

function afficherEditMode() {
    if (token != null) {
        editMode.style.display = "flex";
        editButton.style.display = "flex";
        loginStatusValue = "logout"
    } else {
        userLogOut()
    }
}

// Fonction de deconnexion de l'utilisateur

function userLogOut() {
    loginStatusValue = 'login';
    localStorage.clear();
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

afficherEditMode()