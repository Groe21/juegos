const character = document.getElementById("character");
const gameContainer = document.querySelector(".game-container");
const gameOverText = document.getElementById("game-over");
const retryButton = document.getElementById("retry");
const menuButton = document.getElementById("menu");

let gameActive = true;
let obstacleSpeed = 3; // Velocidad inicial de caída de los obstáculos (en segundos)
let obstacleIntervalTime = 2000; // Tiempo inicial entre la aparición de obstáculos (en milisegundos)

// Mover el personaje con el mouse o el toque
function moveCharacter(mouseX) {
    const containerRect = gameContainer.getBoundingClientRect();
    const posX = mouseX - containerRect.left;
    
    if (posX >= 0 && posX <= containerRect.width) {
        character.style.left = `${posX - character.offsetWidth / 2}px`;
    }
}

// Evento para el mouse
gameContainer.addEventListener("mousemove", (e) => {
    moveCharacter(e.clientX);
});

// Eventos táctiles para dispositivos móviles
gameContainer.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveCharacter(touch.clientX);
});

// Generar obstáculos
function createObstacle() {
    if (!gameActive) return;

    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = `${Math.random() * (gameContainer.clientWidth - 50)}px`;
    obstacle.style.animationDuration = `${obstacleSpeed}s`; // Ajusta la velocidad de caída
    gameContainer.appendChild(obstacle);

    const obstacleInterval = setInterval(() => {
        const obstacleRect = obstacle.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();

        if (obstacleRect.top > gameContainer.clientHeight) {
            obstacle.remove();
            clearInterval(obstacleInterval);
        }

        if (
            obstacleRect.left < characterRect.right &&
            obstacleRect.right > characterRect.left &&
            obstacleRect.bottom > characterRect.top
        ) {
            gameOver();
            clearInterval(obstacleInterval);
        }
    }, 10);

    setTimeout(createObstacle, obstacleIntervalTime);
}

// Aumentar la dificultad cada 5 segundos
function increaseDifficulty() {
    if (!gameActive) return;

    obstacleSpeed *= 0.9; // Aumenta la velocidad disminuyendo el tiempo de caída
    obstacleIntervalTime *= 0.9; // Reduce el tiempo entre obstáculos, aumentando la cantidad de obstáculos
    setTimeout(increaseDifficulty, 5000); // Incrementa la dificultad cada 5 segundos
}

// Función de fin de juego
function gameOver() {
    gameActive = false;
    gameOverText.style.display = "block";
    document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());
}

// Reiniciar el juego
retryButton.addEventListener("click", () => {
    location.reload(); // Recargar la página para reiniciar el juego
});

// Volver al menú
menuButton.addEventListener("click", () => {
    window.location.href = "menu.html"; // Redirige a la página del menú
});

// Iniciar el juego
createObstacle();
increaseDifficulty(); // Inicia el incremento de la dificultad
