const character = document.getElementById("character");
const gameContainer = document.querySelector(".game-container");
const statusText = document.getElementById("status");
const gameOverText = document.getElementById("game-over");
const retryButton = document.getElementById("retry");
const menuButton = document.getElementById("menu");


let gameActive = true;
let bullets = []; // Almacena los disparos
let obstacles = []; // Almacena los obstáculos
let obstacleSpeed = 2; // Velocidad inicial de caída de los obstáculos
let rows = 3; // Número de filas de obstáculos
let columns = 7; // Número de columnas de obstáculos
let gameWon = false; // Nueva bandera para verificar si el juego se ha ganado

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

// Función para disparar
function shoot() {
    if (!gameActive) return;

    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = `${character.offsetLeft + character.clientWidth / 2 - 5}px`;
    bullet.style.bottom = `${character.clientHeight}px`;
    gameContainer.appendChild(bullet);
    bullets.push(bullet);

    const bulletInterval = setInterval(() => {
        bullet.style.bottom = `${parseInt(bullet.style.bottom) + 10}px`;

        // Verifica si el disparo golpea un obstáculo
        obstacles.forEach((obstacle, index) => {
            if (obstacle) { // Verificamos que el obstáculo exista antes de proceder
                const obstacleRect = obstacle.getBoundingClientRect();
                const bulletRect = bullet.getBoundingClientRect();

                // Verificamos si el obstáculo ya está cayendo para evitar dispararle de nuevo
                if (!obstacle.classList.contains('falling') &&
                    bulletRect.left < obstacleRect.right &&
                    bulletRect.right > obstacleRect.left &&
                    bulletRect.top < obstacleRect.bottom &&
                    bulletRect.bottom > obstacleRect.top
                ) {
                    clearInterval(bulletInterval);
                    bullet.remove();
                    bullets.splice(bullets.indexOf(bullet), 1);

                    // Marcamos el obstáculo como "falling" para que no pueda ser disparado de nuevo
                    obstacle.classList.add('falling');
                    obstacle.style.animation = `fallObstacle ${obstacleSpeed}s linear`;

                    obstacle.addEventListener('animationend', () => {
                        obstacle.remove();
                        obstacles[index] = null; // Marcamos como nulo
                        checkWin(); // Verifica si ganaste después de eliminar el obstáculo
                    });
                }
            }
        });

        // Elimina el disparo si sale del contenedor
        if (parseInt(bullet.style.bottom) > gameContainer.clientHeight) {
            clearInterval(bulletInterval);
            bullet.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    }, 20);
}

// Generar obstáculos en 3 filas y 7 columnas (más bloques y mejor distribuidos)
function createObstacle() {
    if (!gameActive) return;

    const obstacleWidth = gameContainer.clientWidth / columns;
    const verticalSpacing = 60; // Espacio vertical entre las filas
    const horizontalPadding = (gameContainer.clientWidth - obstacleWidth * columns) / 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const obstacle = document.createElement("div");
            obstacle.classList.add("obstacle");
            obstacle.style.left = `${horizontalPadding + col * obstacleWidth}px`;
            obstacle.style.top = `${row * verticalSpacing}px`; 
            gameContainer.appendChild(obstacle);
            obstacles.push(obstacle);
        }
    }
}

// Función para manejar la lógica de ganar
function checkWin() {
    // Verificamos si ya no quedan obstáculos
    if (obstacles.filter(obst => obst !== null).length === 0 && gameActive) {
        gameActive = false;
        gameWon = true; // Marcamos que el juego se ha ganado
        setTimeout(() => { // Retrasamos un poco la ejecución para asegurarnos que se procesen las últimas acciones
            statusText.textContent = "You Win!";
            document.getElementById("message").textContent = "¡Ganaste!";
            gameOverText.classList.remove("hidden"); // Mostrar mensaje de ganar
            gameOverText.style.display = "block"; // Mostrar el contenedor de Game Over
        }, 100);
    }
}

// Aumentar la dificultad
function increaseDifficulty() {
    if (!gameActive) return;

    obstacleSpeed *= 0.9; // Aumenta la velocidad disminuyendo el tiempo de caída
    setTimeout(increaseDifficulty, 5000); // Incrementa la dificultad cada 5 segundos
}

// Función de fin de juego
function gameOver() {
    if (gameActive && !gameWon) {
        gameActive = false;
        statusText.textContent = "Game Over";
        document.getElementById("message").textContent = "Juego Terminado";
        gameOverText.classList.remove("hidden"); // Mostrar mensaje de Game Over
        gameOverText.style.display = "block"; // Mostrar el contenedor de Game Over
        document.querySelectorAll(".obstacle").forEach(obstacle => obstacle.remove());
    }
}

// Verificar colisiones con el jugador
function checkCollisions() {
    if (!gameActive || gameWon) return; // No verificar colisiones si el juego ha terminado o se ha ganado

    obstacles.forEach((obstacle) => {
        if (obstacle) { // Verificamos que el obstáculo exista antes de proceder
            const obstacleRect = obstacle.getBoundingClientRect();
            const characterRect = character.getBoundingClientRect();

            if (
                obstacleRect.left < characterRect.right &&
                obstacleRect.right > characterRect.left &&
                obstacleRect.bottom > characterRect.top &&
                obstacleRect.top < characterRect.bottom
            ) {
                gameOver();
            }
        }
    });

    if (gameActive) {
        requestAnimationFrame(checkCollisions);
    }
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
document.addEventListener('click', shoot); // Permite disparar al hacer clic
checkCollisions(); // Inicia la verificación de colisiones
