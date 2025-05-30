
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");
let gravity = 0.25;
let lift = -4.6;
let bird = { x: 50, y: 150, radius: 12, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameRunning = false;

function drawBird() {
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFD700";
  ctx.fill();
  ctx.stroke();
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.fillStyle = "#333";
    ctx.fillRect(pipe.x, 0, 40, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 40, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
    let top = Math.random() * 180 + 20;
    let gap = 100;
    pipes.push({ x: canvas.width, top: top, bottom: top + gap, scored: false });
  }
  pipes.forEach(pipe => {
    pipe.x -= 2;
    if (!pipe.scored && pipe.x + 40 < bird.x) {
      score += 1;
      scoreDisplay.innerText = "Puntaje: " + score;
      pipe.scored = true;
    }
  });
  pipes = pipes.filter(pipe => pipe.x + 40 > 0);
}

function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x + bird.radius > pipe.x &&
      bird.x - bird.radius < pipe.x + 40 &&
      (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
    ) {
      endGame();
    }
  }
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    endGame();
  }
}

function endGame() {
  gameRunning = false;
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScoreText").innerText = "Puntaje final: " + score;
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updatePipes();

  bird.velocity += gravity;
  bird.y += bird.velocity;

  checkCollision();

  frame++;
  requestAnimationFrame(gameLoop);
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  gameRunning = true;
  gameLoop();
}

document.addEventListener("keydown", () => bird.velocity = lift);
canvas.addEventListener("click", () => bird.velocity = lift);
