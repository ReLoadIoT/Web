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
                console.log(response.status)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let b1 = document.getElementById(id);
                b1.style.backgroundColor = "black";
                b1.disabled = true;
            })
            .catch((error) => {
                alert("You aren't signed in!");
                console.error('Error:', error);
            });

    })
})
