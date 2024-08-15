const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('game-over');
const retryButton = document.getElementById('retry');
const menuButton = document.getElementById('menu');
const controls = document.querySelector('.controls'); // Obtenemos los controles

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];

const foodImage = new Image();
foodImage.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'; // URL de la imagen del logo

let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};

let score = 0;
let d = null; // Inicializamos la dirección en null

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        d = "DOWN";
    }

    // Iniciar el juego cuando se presiona una tecla por primera vez
    if (!game) {
        game = setInterval(draw, 100);
    }
}

function move(dir) {
    if (dir == 'LEFT' && d != "RIGHT") {
        d = "LEFT";
    } else if (dir == 'UP' && d != "DOWN") {
        d = "UP";
    } else if (dir == 'RIGHT' && d != "LEFT") {
        d = "RIGHT";
    } else if (dir == 'DOWN' && d != "UP") {
        d = "DOWN";
    }

    // Iniciar el juego cuando se presiona un botón por primera vez
    if (!game) {
        game = setInterval(draw, 100);
    }
}

function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x == array[i].x && newHead.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(foodImage, food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // Si la dirección es null, no mover la serpiente
    if (d === null) return;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        game = null; // Para evitar múltiples intervalos
        gameOver(); // Llamamos a la función de Game Over
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puntaje: " + score, 10, 20);
}

function gameOver() {
    gameOverText.classList.remove('hidden'); // Mostrar el contenedor de Game Over
    controls.classList.add('hidden'); // Ocultar los controles cuando el juego termina

    // Mostrar el contenedor de Game Over al final del juego
    gameOverText.style.display = 'flex';
}

// Manejo del botón de "Volver a jugar"
retryButton.addEventListener('click', () => {
    location.reload(); // Recargar la página para reiniciar el juego
});

// Manejo del botón de "Menú"
menuButton.addEventListener('click', () => {
    window.location.href = "../index.html"; // Redirigir al menú principal
});

// Ocultar los botones de Game Over y mantener los controles visibles al inicio del juego
window.onload = function() {
    gameOverText.classList.add('hidden'); // Asegura que el contenedor de Game Over esté oculto al cargar la página
    controls.classList.remove('hidden'); // Asegura que los controles estén visibles al cargar la página
};

let game = null; // Inicialmente el juego no está corriendo
