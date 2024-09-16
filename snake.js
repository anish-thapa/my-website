const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Mobile controls
const upButton = document.getElementById('upButton');
const downButton = document.getElementById('downButton');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

// Game Over Overlay and buttons
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreElement = document.getElementById('finalScore'); // For displaying final score
const replayButton = document.getElementById('replayButton');
const exitButton = document.getElementById('exitButton');

// Game constants
const gridSize = 20;
const tileSize = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let velocity = {x: 0, y: 0};
let food = {x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize)};
let score = 0;
let gameInterval = null;

// Draw the grid (thin lines for graph-like appearance)
function drawGrid() {
    ctx.strokeStyle = '#333';  // Slim, dark gray lines
    ctx.lineWidth = 0.5;       // Slim line width

    for (let i = 0; i <= canvas.width; i += tileSize) {
        // Vertical lines
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        // Horizontal lines
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

// Draw the game
function drawGame() {
    moveSnake();

    if (checkCollision()) {
        gameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid first
    drawGrid();

    // Draw the snake
    snake.forEach(segment => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });

    // Draw the food as an egg
    const eggImage = new Image();
    eggImage.src = 'coin.png';  // Replace with your egg image URL

    eggImage.onload = function() {
        ctx.drawImage(eggImage, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
    };

    scoreElement.innerText = `Score: ${score}`;
}

function moveSnake() {
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = {x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize)};
    } else {
        snake.pop();
    }

    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(gameInterval);

    // Display the final score on the Game Over overlay
    finalScoreElement.innerText = `Your Score: ${score}`;

    // Hide the game canvas and show the game over overlay
    canvas.style.display = 'none';
    gameOverOverlay.style.display = 'flex';
}

function resetGame() {
    snake = [{x: 10, y: 10}];
    velocity = {x: 0, y: 0};
    food = {x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize)};
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    gameInterval = setInterval(drawGame, 100);

    // Hide the game over overlay and show the canvas
    gameOverOverlay.style.display = 'none';
    canvas.style.display = 'block';
}

function changeDirection(event) {
    switch (event.key) {
        case 'ArrowUp':
            if (velocity.y === 0) {
                velocity = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (velocity.y === 0) {
                velocity = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) {
                velocity = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (velocity.x === 0) {
                velocity = {x: 1, y: 0};
            }
            break;
    }
}

// Mobile controls event listeners
upButton.addEventListener('click', () => {
    if (velocity.y === 0) {
        velocity = {x: 0, y: -1};
    }
});

downButton.addEventListener('click', () => {
    if (velocity.y === 0) {
        velocity = {x: 0, y: 1};
    }
});

leftButton.addEventListener('click', () => {
    if (velocity.x === 0) {
        velocity = {x: -1, y: 0};
    }
});

rightButton.addEventListener('click', () => {
    if (velocity.x === 0) {
        velocity = {x: 1, y: 0};
    }
});

// Replay button event listener
replayButton.addEventListener('click', () => {
    resetGame();
});

// Exit button event listener
exitButton.addEventListener('click', () => {
    alert('Exiting the game...');
    window.location.href = 'https://anishthapa.tech';  // Replace with your desired exit URL or action
});

// Start the game
resetGame();
document.addEventListener('keydown', changeDirection);
