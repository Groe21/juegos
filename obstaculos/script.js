const character = document.getElementById("character");
const gameContainer = document.querySelector(".game-container");
const gameOverText = document.getElementById("game-over");
const retryButton = document.getElementById("retry");
const menuButton = document.getElementById("menu");
const livesText = document.getElementById("lives");
const scoreText = document.getElementById("score");

let gameActive = true;
let lives = 5; // Vidas iniciales
let score = 0; // Puntuación inicial
let obstacleSpeed = 3; // Velocidad inicial de caída de los obstáculos (en segundos)
let obstacleIntervalTime = 2000; // Tiempo inicial entre la aparición de obstáculos (en milisegundos)
let obstaclesAtOnce = 3; // Número de obstáculos que caen al mismo tiempo

// Función para mover el personaje
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

// Generar múltiples obstáculos
function createObstacle() {
    if (!gameActive) return;

    for (let i = 0; i < obstaclesAtOnce; i++) {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
        obstacle.style.left = `${Math.random() * (gameContainer.clientWidth - obstacle.clientWidth)}px`;
        obstacle.style.animationDuration = `${obstacleSpeed}s`; // Ajusta la velocidad de caída
        gameContainer.appendChild(obstacle);

        const obstacleInterval = setInterval(() => {
            const obstacleRect = obstacle.getBoundingClientRect();
            const characterRect = character.getBoundingClientRect();

            if (obstacleRect.top > gameContainer.clientHeight) {
                obstacle.remove();
                clearInterval(obstacleInterval);
                increaseScore(); // Incrementa la puntuación al esquivar un obstáculo
            }

            if (
                obstacleRect.left < characterRect.right &&
                obstacleRect.right > characterRect.left &&
                obstacleRect.bottom > characterRect.top
            ) {
                obstacle.remove(); // Elimina el obstáculo después de la colisión
                clearInterval(obstacleInterval);
                loseLife(); // Llama a la función para perder una vida
            }
        }, 10);
    }

    setTimeout(createObstacle, obstacleIntervalTime);
}

// Función para incrementar la puntuación
function increaseScore() {
    score += 1;
    scoreText.textContent = `Meteoritos esquivados: ${score}`;
}

// Función para manejar la pérdida de vidas
function loseLife() {
    lives -= 1;
    livesText.textContent = `Vidas: ${lives}`;

    if (lives <= 0) {
        gameOver();
    }
}

// Aumentar la dificultad cada 3 segundos
function increaseDifficulty() {
    if (!gameActive) return;

    obstacleSpeed *= 0.9; // Aumenta la velocidad disminuyendo el tiempo de caída
    obstacleIntervalTime *= 0.9; // Reduce el tiempo entre obstáculos, aumentando la cantidad de obstáculos
    setTimeout(increaseDifficulty, 3000); // Incrementa la dificultad cada 3 segundos
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
    window.location.href = "../index.html"; // Redirige a la página del menú
});

// Iniciar el juego
createObstacle();
increaseDifficulty(); // Inicia el incremento de la dificultad
