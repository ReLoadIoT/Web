window.addEventListener("DOMContentLoaded", () => {
    const path = 'https://d7f4767f6c5d.ngrok.io/'
    const JWTToken = localStorage.getItem("JWT");
    let parsedJWT, sub;
    if (JWTToken !== null) {
        parsedJWT = parseJwt(JWTToken);
        sub = parsedJWT.sub;

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
