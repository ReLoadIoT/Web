const path = 'https://d7f4767f6c5d.ngrok.io'

let data = {}

document.getElementById("email").addEventListener("keyup", (e) => {
    data.username = e.target.value;
})

document.getElementById("password").addEventListener("keyup", (e) => {
    data.password = e.target.value;
})

document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault();
    fetch(`${path}/login`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Bad credentials');
            }
            return response.json();
        })
        .then(data => localStorage.setItem("JWT", data.Authorization))
        .then(() => window.location = "/home.html")
        .catch((error) => {
            document.getElementById("error").style.display = "block";
            console.log(error);
        });
})
