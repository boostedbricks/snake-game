// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game state
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameSpeed = 100;
let gameLoop;
let isPlaying = false;
let isPaused = false;

// UI elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameStatusElement = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Initialize
highScoreElement.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
restartBtn.addEventListener('click', resetGame);

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isPlaying) {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameSpeed = parseInt(btn.dataset.speed);
        }
    });
});

// Keyboard controls
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    const key = e.key.toLowerCase();
    
    // Prevent arrow key scrolling
    if (key.startsWith('arrow')) {
        e.preventDefault();
    }
    
    // Start/Pause with Space
    if (key === ' ') {
        e.preventDefault();
        if (!isPlaying) {
            startGame();
        } else {
            togglePause();
        }
        return;
    }
    
    // Restart with R
    if (key === 'r') {
        e.preventDefault();
        resetGame();
        return;
    }
    
    // Don't change direction if paused
    if (isPaused) return;
    
    // Movement keys (Arrow keys and WASD)
    if ((key === 'arrowleft' || key === 'a') && dx === 0) {
        dx = -1;
        dy = 0;
    } else if ((key === 'arrowright' || key === 'd') && dx === 0) {
        dx = 1;
        dy = 0;
    } else if ((key === 'arrowup' || key === 'w') && dy === 0) {
        dx = 0;
        dy = -1;
    } else if ((key === 'arrowdown' || key === 's') && dy === 0) {
        dx = 0;
        dy = 1;
    }
    
    // Start moving if first key press
    if (!isPlaying && (dx !== 0 || dy !== 0)) {
        startGame();
    }
}

function startGame() {
    if (isPlaying && !isPaused) return;
    
    if (!isPlaying) {
        isPlaying = true;
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        gameStatusElement.textContent = 'Playing...';
        
        // Start with initial movement if none set
        if (dx === 0 && dy === 0) {
            dx = 1;
            dy = 0;
        }
        
        gameLoop = setInterval(updateGame, gameSpeed);
    }
}

function togglePause() {
    if (!isPlaying) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearInterval(gameLoop);
        pauseBtn.textContent = 'Resume';
        gameStatusElement.textContent = 'Paused';
    } else {
        gameLoop = setInterval(updateGame, gameSpeed);
        pauseBtn.textContent = 'Pause';
        gameStatusElement.textContent = 'Playing...';
    }
}

function resetGame() {
    clearInterval(gameLoop);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    isPlaying = false;
    isPaused = false;
    
    scoreElement.textContent = score;
    gameStatusElement.textContent = 'Press SPACE to Start';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    
    generateFood();
    draw();
}

function updateGame() {
    if (isPaused) return;
    
    moveSnake();
    
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    if (checkFoodCollision()) {
        score += 10;
        scoreElement.textContent = score;
        
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        
        generateFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }
    
    draw();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Wrap around walls
    if (head.x < 0) head.x = tileCount - 1;
    if (head.x >= tileCount) head.x = 0;
    if (head.y < 0) head.y = tileCount - 1;
    if (head.y >= tileCount) head.y = 0;
    
    snake.unshift(head);
}

function checkCollision() {
    const head = snake[0];
    
    // Check if snake hit itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function checkFoodCollision() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

function generateFood() {
    let validPosition = false;
    
    while (!validPosition) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        validPosition = !snake.some(segment => 
            segment.x === food.x && segment.y === food.y
        );
    }
}

function gameOver() {
    clearInterval(gameLoop);
    isPlaying = false;
    isPaused = false;
    
    gameStatusElement.textContent = '💀 Game Over!';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Shake animation
    canvas.classList.add('shake');
    setTimeout(() => canvas.classList.remove('shake'), 500);
    
    // Play again prompt
    setTimeout(() => {
        gameStatusElement.textContent = 'Press SPACE or R to play again';
    }, 1500);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (subtle)
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head - brighter with gradient
            const gradient = ctx.createRadialGradient(
                segment.x * gridSize + gridSize / 2,
                segment.y * gridSize + gridSize / 2,
                0,
                segment.x * gridSize + gridSize / 2,
                segment.y * gridSize + gridSize / 2,
                gridSize
            );
            gradient.addColorStop(0, '#7dd3fc');
            gradient.addColorStop(1, '#0ea5e9');
            ctx.fillStyle = gradient;
        } else {
            // Body - gradient based on position
            const opacity = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = `rgba(14, 165, 233, ${opacity})`;
        }
        
        ctx.fillRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
        
        // Add slight border to segments
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            segment.x * gridSize + 1,
            segment.y * gridSize + 1,
            gridSize - 2,
            gridSize - 2
        );
    });
    
    // Draw food with pulsing effect
    const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
    const gradient = ctx.createRadialGradient(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        0,
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize
    );
    gradient.addColorStop(0, `rgba(248, 113, 113, ${pulse})`);
    gradient.addColorStop(1, `rgba(220, 38, 38, ${pulse})`);
    ctx.fillStyle = gradient;
    
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Add sparkle to food
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 3,
        food.y * gridSize + gridSize / 3,
        2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Initial draw
generateFood();
draw();
