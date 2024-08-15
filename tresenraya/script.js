document.addEventListener("DOMContentLoaded", function () {
    const casillas = document.querySelectorAll(".casilla");
    let turno = "X";
    let juegoTerminado = false;

    casillas.forEach(function (casilla) {
        casilla.addEventListener("click", function () {
            if (!juegoTerminado && casilla.innerHTML === "") {
                casilla.innerHTML = turno;
                if (hayGanador()) {
                    alert("¡El jugador " + turno + " ha ganado!");
                    reiniciarJuego();
                } else if (tableroCompleto()) {
                    alert("¡Empate!");
                    reiniciarJuego();
                } else {
                    turno = turno === "X" ? "O" : "X";
                }
            }
        });
    });

    function hayGanador() {
        const lineasGanadoras = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]             // Diagonales
        ];

        for (let linea of lineasGanadoras) {
            const [a, b, c] = linea;
            if (casillas[a].innerHTML !== "" && casillas[a].innerHTML === casillas[b].innerHTML && casillas[a].innerHTML === casillas[c].innerHTML) {
                juegoTerminado = true;
                return true;
            }
        }

        return false;
    }

    function tableroCompleto() {
        return Array.from(casillas).every(casilla => casilla.innerHTML !== "");
    }

    function reiniciarJuego() {
        casillas.forEach(casilla => {
            casilla.innerHTML = "";
        });
        turno = "X";
        juegoTerminado = false;
    }
});
