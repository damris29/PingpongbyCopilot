const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_SPEED = 6;

// Ball settings
const BALL_SIZE = 16;
const BALL_SPEED = 7;

// Game state
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Mouse control for left paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle position
  playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, playerY));
});

// Draw paddles, ball, and scoreboard
function draw() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw center dashed line
  ctx.save();
  ctx.strokeStyle = "#fff";
  ctx.setLineDash([12, 16]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.restore();

  // Draw player paddle (left)
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw AI paddle (right)
  ctx.fillStyle = "#e91e63";
  ctx.fillRect(WIDTH - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillStyle = "#ffd600";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update ball, paddles, collisions
function update() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top/bottom walls
  if (ballY <= 0) {
    ballY = 0;
    ballVY = -ballVY;
  }
  if (ballY + BALL_SIZE >= HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballVY = -ballVY;
  }

  // Ball collision with player paddle
  if (
    ballX <= PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_WIDTH;
    ballVX = -ballVX;
    // Add some "spin" based on paddle movement
    let intersectY = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY += intersectY * 0.18;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballX = WIDTH - PADDLE_WIDTH - BALL_SIZE;
    ballVX = -ballVX;
    let intersectY = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY += intersectY * 0.18;
  }

  // Ball out of bounds (score)
  if (ballX < -BALL_SIZE) {
    aiScore++;
    resetBall(-1);
  } else if (ballX > WIDTH) {
    playerScore++;
    resetBall(1);
  }

  // AI moves paddle towards ball
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  let ballCenter = ballY + BALL_SIZE / 2;
  if (aiCenter < ballCenter - 10) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballCenter + 10) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, aiY));

  // Update scoreboard
  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('ai-score').textContent = aiScore;
}

// Reset ball to center
function resetBall(direction) {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  // Ball goes to scoring player
  ballVX = BALL_SPEED * direction;
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start
gameLoop();