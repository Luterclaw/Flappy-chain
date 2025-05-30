
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");

let gravity = 0.25;
let lift = -4.6;
let score = 0;
let frame = 0;
let gameRunning = false;

// Nuevas dimensiones basadas en imágenes reales
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 40;
const OBSTACLE_WIDTH = 28;

const birdImg = new Image();
birdImg.src = "character_gold_full.webp";

const pipeImg = new Image();
pipeImg.src = "obstacle_chain_thick_gold.webp";

let bird = {
  x: 60,
  y: 200,
  width: BIRD_WIDTH,
  height: BIRD_HEIGHT,
  velocity: 0
};

let pipes = [];

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, OBSTACLE_WIDTH, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, pipe.bottom, OBSTACLE_WIDTH, canvas.height - pipe.bottom);
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
    if (!pipe.scored && pipe.x + OBSTACLE_WIDTH < bird.x) {
      score += 1;
      scoreDisplay.innerText = "Puntaje: " + score;
      pipe.scored = true;
    }
  });
  pipes = pipes.filter(pipe => pipe.x + OBSTACLE_WIDTH > 0);
}

function checkCollision() {
  for (let pipe of pipes) {
    if (
      bird.x + bird.width > pipe.x &&
      bird.x < pipe.x + OBSTACLE_WIDTH &&
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

  const finalMessage = score >= 30
    ? "🎉 ¡Felicidades! Obtenés un 30% de descuento con el código: FLAPPY-30"
    : "Gracias por jugar. ¡Superá los 30 puntos para ganar un premio!";

  document.getElementById("finalScoreText").innerText = `Puntaje final: ${score}\n${finalMessage}`;

  const link = document.querySelector("#gameOverScreen a");
  link.style.display = score >= 30 ? "block" : "none";
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
  bird.y = 200;
  bird.velocity = 0;
  score = 0;
  pipes = [];
  gameRunning = true;
  frame = 0;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => bird.velocity = lift);
canvas.addEventListener("click", () => bird.velocity = lift);
