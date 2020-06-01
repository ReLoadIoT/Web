window.addEventListener("DOMContentLoaded", () => {
    const matrix = document.getElementById('matrix');

    fetch("http://localhost:7580/coordinates")
        .then(response => response.json())
        .then(data => data.forEach(element => {

            let id = document.getElementById(element);
            id.style.backgroundColor = "black";
            id.disabled = true;

        }));

    matrix.addEventListener('click', (event) => {
        const isButton = event.target.nodeName === 'BUTTON';
        if (!isButton) {
            return;
        }

        let id = event.target.id;

        fetch(`http://localhost:7580/coordinates?coordinate=${id}`, {
            method: 'POST',
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

    let cookie = parseCookie(document.cookie)
    const parsedJWT = parseJwt(cookie.JWT);
    const sub = parseJwt(cookie.JWT).sub;

    parsedJWT.authorities.forEach(authority => {
        if(authority.authority === "ROLE_ADMIN") {
            let div = document.getElementById("matrix-div");
            let button = document.createElement("button");
            button.className = "btn btn-secondary mt-3";
            button.setAttribute("type", "button");
            button.innerText = "Clear";
            button.style.textAlign = "center";
            div.appendChild(button);
            button.onclick = () => {
                fetch("http://localhost:7580/coordinates", {
                    method: 'DELETE',
                    credentials: "include"
                }).then(() => location.reload())
            }
            console.log("admin");
        }
    });

    if (cookie.JWT) {
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
            document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            location.reload();
        })
    }

})

const parseCookie = str =>
    str
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
