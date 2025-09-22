const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const winnerPopup = document.getElementById('winner-popup');
const winnerText = document.getElementById('winner-text');
const difficulty = document.getElementById('difficulty');

// Game constants
const paddleWidth = 12, paddleHeight = 100, ballSize = 16;
const playerX = 30, aiX = canvas.width - paddleWidth - 30;
const winningScore = 3;

// Game state
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let targetY = playerY;
let ballX, ballY, ballSpeedX, ballSpeedY;
let playerScore = 0, aiScore = 0;
let gameRunning = false;
let aiSpeed = parseInt(difficulty.value);
let playerWins = 0; 
let aiWins = 0;


// Sound
let hitSoundBuffer = new Audio("app/paddle-hit-sound.mp3");
hitSoundBuffer.volume = 0.5;
function playHitSound() { hitSoundBuffer.cloneNode().play(); }

// Mouse movement
canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    targetY = e.clientY - rect.top - paddleHeight / 2;
});

// Start button
startBtn.addEventListener('click', () => {
    resetGame();
    aiSpeed = parseInt(difficulty.value);
    gameRunning = true;
    startBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    draw();
});

// Restart button
restartBtn.addEventListener('click', restartGame);

function restartGame() {
    winnerPopup.style.display = "none";
    resetGame();
    aiSpeed = parseInt(difficulty.value);
    gameRunning = true;
    draw();
}

// Game loop
function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = "#ffffffff";
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
    ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();

    // Score
    ctx.font = "40px Arial ";
    ctx.textAlign = "center";
    ctx.fillText(`${playerScore} : ${aiScore}`, canvas.width / 2, 40);

    updateBall();
    updateAI();
    updatePlayerPaddle();

    requestAnimationFrame(draw);
}

// Smooth player paddle
function updatePlayerPaddle() {
    playerY += (targetY - playerY) * 0.2;
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
}

// Ball movement
function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision
    if (ballY - ballSize / 2 < 0 || ballY + ballSize / 2 > canvas.height) ballSpeedY *= -1;

    // Player paddle
    if (ballX - ballSize / 2 < playerX + paddleWidth &&
        ballY + ballSize / 2 > playerY &&
        ballY - ballSize / 2 < playerY + paddleHeight) {
        ballX = playerX + paddleWidth + ballSize / 2;
        ballSpeedX *= -1.07;
        ballSpeedY += (Math.random() - 0.5) * 2;
        playHitSound();
    }

    // AI paddle
    if (ballX + ballSize / 2 > aiX &&
        ballY + ballSize / 2 > aiY &&
        ballY - ballSize / 2 < aiY + paddleHeight) {
        ballX = aiX - ballSize / 2;
        ballSpeedX *= -1.07;
        ballSpeedY += (Math.random() - 0.5) * 2;
        playHitSound();
    }

 // Score
if (ballX - ballSize / 2 < 0) {
    aiScore++;
    checkWinner();
    resetBall(1);
}

if (ballX + ballSize / 2 > canvas.width) {
    playerScore++;
    checkWinner();
    resetBall(-1);
}



}

// AI movement
function updateAI() {
    const aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY - 20) aiY += aiSpeed;
    else if (aiCenter > ballY + 20) aiY -= aiSpeed;

    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;
}

// Reset ball
function resetBall(direction) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = direction * (4 + Math.random() * 2);
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    resetBall(1);
}




function checkWinner() {
    if (playerScore === winningScore || aiScore === winningScore) {
        gameRunning = false;

        if (playerScore === winningScore) {
            winnerText.textContent = "🎉 You Win!";
            playerWins++;  // add to total wins
        } else {
            winnerText.textContent = "🤖 AI Wins!";
            aiWins++;  // add to total wins
        }

        // Update overall scoreboard
        document.getElementById("player-score").textContent = `Player Wins: ${playerWins}`;
        document.getElementById("ai-score").textContent = `AI Wins: ${aiWins}`;

        winnerPopup.style.display = "flex";
    }
}


// function updateScoreboard() {
//     document.getElementById("player-score").textContent = `Player: ${playerScore}`;
//     document.getElementById("ai-score").textContent = `AI: ${aiScore}`;
// }

