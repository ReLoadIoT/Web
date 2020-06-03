const path = 'https://d7f4767f6c5d.ngrok.io'

let data = {}
let repeatPassword = ""
document.getElementById("email").addEventListener("keyup", (e) => {
    data.email = e.target.value;
})

document.getElementById("password").addEventListener("keyup", (e) => {
    if (e.target.value === "") {
        document.getElementById("submit").disabled = true;
    }
    data.password = e.target.value;
})


document.getElementById("repeatPassword").addEventListener("keyup", (e) => {
    const submitButton = document.getElementById("submit");
    repeatPassword = e.target.value;
    if (data.password === e.target.value && data.password !== "" && repeatPassword !== "") {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }

})

document.getElementById("nickname").addEventListener("keyup", (e) => {
    data.username = e.target.value;
})

document.getElementById("firstName").addEventListener("keyup", (e) => {
    data.firstName = e.target.value;
})

document.getElementById("secondName").addEventListener("keyup", (e) => {
    data.secondName = e.target.value;
})

document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault();
    console.log(data)
    fetch(`${path}/registration`, {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                response.json()
                    .then(data => {
                        document.getElementById("error").innerText = JSON.parse(data.message).dublicationEmail;
                        document.getElementById("error").style.display = "block";
                    })
            } else {
                console.log("success")
            }
        })
})
