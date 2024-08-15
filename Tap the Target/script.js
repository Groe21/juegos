const target = document.getElementById("target");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const gameOverText = document.getElementById("game-over");
const retryButton = document.getElementById("retry");
const menuButton = document.getElementById("menu");
let score = 0;
let timeLeft = 30;
let gameActive = true;

// Mover el objetivo a una nueva posición aleatoria dentro del contenedor
function moveTarget() {
    const containerRect = document.querySelector(".game-container").getBoundingClientRect();
    const maxX = containerRect.width - target.clientWidth;
    const maxY = containerRect.height - target.clientHeight;

    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
}

// Aumentar la puntuación cuando se toca el objetivo
target.addEventListener("click", () => {
    if (!gameActive) return;
    score++;
    scoreText.textContent = `Puntuación: ${score}`;
    moveTarget();
});

// Temporizador del juego
function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        } else if (gameActive) {
            timeLeft--; // Asegura que solo se reduce el tiempo si el juego está activo
            timerText.textContent = `Tiempo: ${timeLeft}s`;
        }
    }, 1000);
}

// Terminar el juego y mostrar la puntuación
function endGame() {
    gameActive = false;
    target.style.display = "none";
    gameOverText.style.display = "block";
    document.getElementById("message").textContent = `Juego Terminado! Tu puntuación es: ${score}`;
}

// Redirigir al menú principal
menuButton.addEventListener("click", () => {
    window.location.href = "../index.html"; // Ajusta la ruta según la ubicación de tu archivo index.html
});

// Reiniciar el juego
retryButton.addEventListener("click", () => {
    location.reload(); // Recargar la página para reiniciar el juego
});

// Iniciar el juego
moveTarget();
startTimer();
