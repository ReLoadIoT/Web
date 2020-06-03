const path = 'https://d7f4767f6c5d.ngrok.io/'

window.addEventListener("DOMContentLoaded", () => {
    const matrix = document.getElementById('matrix');

    setInterval(() => {
        fetch(`${path}coordinates`)
            .then(response => response.json())
            .then(data => {
                if(data.length === 0) {
                    for (i = 1; i <= 360; i++) {
                        let id = document.getElementById('b'+i);
                        id.style.backgroundColor = "";
                        id.disabled = false;
                    }
                }
                data.forEach(element => {
                    let id = document.getElementById(element);
                    id.style.backgroundColor = "black";
                    id.disabled = true;

                })
            });
    }, 1000);


    matrix.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        let id = event.target.id;

        fetch(`${path}coordinates?coordinate=${id}`, {
            method: 'POST',
            headers: {
                "Authorization": localStorage.getItem("JWT") ? localStorage.getItem("JWT") : ""
            },
            credentials: "include"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let b1 = document.getElementById(id);
                b1.style.backgroundColor = "black";
                b1.disabled = true;
            })
            .catch((error) => {
                alert("You aren't signed in!");
            });

    })

    const JWTToken = localStorage.getItem("JWT");
    let parsedJWT, sub;
    if (JWTToken !== null) {
        parsedJWT = parseJwt(JWTToken);
        sub = parsedJWT.sub;

        parsedJWT.authorities.forEach(authority => {
            if (authority.authority === "ROLE_ADMIN") {
                let div = document.getElementById("matrix-div");
                let button = document.createElement("button");
                button.className = "btn btn-secondary mt-3";
                button.setAttribute("type", "button");
                button.innerText = "Clear";
                button.style.textAlign = "center";
                div.appendChild(button);
                button.onclick = () => {
                    fetch(`${path}coordinates`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": localStorage.getItem("JWT") ? localStorage.getItem("JWT") : ""
                        },
                        credentials: "include"
                    }).then(() => location.reload())
                }
                console.log("admin");
            }
        });

        let divLog = document.querySelector(".log");
        divLog.remove();
        let navbar = document.querySelector(".navbar-nav");
        let li = document.createElement("li");
        li.className = "dropdown nav-item";
        let a = document.createElement("a");
        a.setAttribute("data-toggle", "dropdown");
        a.setAttribute("aria-haspopup", "true");
        a.setAttribute("aria-expanded", "false");
        a.id = "navbarDropdownMenuLink";
        a.className = "nav-link dropdown-toggle";
        a.innerText = sub;
        let innerDiv = document.createElement("div");
        innerDiv.setAttribute("aria-labelledby", "navbarDropdownMenuLink");
        innerDiv.className = "dropdown-menu-right dropdown-menu";
        let innerA = document.createElement("a");
        innerA.className = "dropdown-item";
        innerA.id = "logout"
        innerA.innerText = "Log out";
        innerDiv.appendChild(innerA);
        li.appendChild(a);
        li.appendChild(innerDiv);
        navbar.appendChild(li);

        innerA.addEventListener('click', () => {
            localStorage.removeItem("JWT")
            location.reload();
        })
    }

})

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
