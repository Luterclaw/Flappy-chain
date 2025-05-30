
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");

let gravity = 0.25;
let lift = -4.6;
let score = 0;
let frame = 0;
let gameRunning = false;

const birdImg = new Image();
birdImg.src = "chain.png";

let bird = {
  x: 50,
  y: 150,
  width: 30,
  height: 30,
  velocity: 0
};

let pipes = [];

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "gold";
  pipes.forEach(pipe => {
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
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + 40 &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      endGame();
    }
  }
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
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
  canvas.style.display = "block";
  scoreDisplay.style.display = "block";
  gameRunning = true;
  gameLoop();
}

document.addEventListener("keydown", () => bird.velocity = lift);
canvas.addEventListener("click", () => bird.velocity = lift);
