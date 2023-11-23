async function userAuthentification (event) {
    // Empêche le rechargement de la page
    event.preventDefault();

    //Création de la charge utile du login

    const login = {
        email: document.querySelector("[name=email]").value,
        password: document.querySelector("[name=password]").value,
    };

    // Envoie des données à l'API

    await fetch('http://localhost:5678/api/users/login', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(login)
    })
        // Redirection vers la page index.html si la reponse est le code 200
        .then((response) => {
            if (response.ok != true) {
                alert("Email ou mot de passe incorrect");
                throw new Error("L'adresse Email ou le mot de passe est incorrect");
            } else {
                window.location.assign("./index.html");
            }
            // On transforme la promesse du serv en format JSON
            return response.json();
        })
        // Stockage du token
        .then((data) => {
            const token = data.token;
            localStorage.setItem("token", token);
        });
}

//Event listener du formulaire

const form = document.querySelector(".form");
form.addEventListener("submit", userAuthentification)
