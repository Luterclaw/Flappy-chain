
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("scoreDisplay");

let gravity = 0.25;
let lift = -4.6;
let score = 0;
let frame = 0;
let gameRunning = false;

const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 40;
const OBSTACLE_WIDTH = 70;
const CHAIN_SEGMENT_HEIGHT = 80;

const birdImg = new Image();
birdImg.src = "character_gold_centered.webp";

const chainImg = new Image();
chainImg.src = "chain_segment_gold.webp";

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

function drawChainStack(x, yStart, height) {
  ctx.drawImage(chainImg, x, yStart, OBSTACLE_WIDTH, height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    drawChainStack(pipe.x, 0, pipe.top);
    drawChainStack(pipe.x, pipe.bottom, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 100 === 0) {
    let gap = 130;
    let centerY = Math.random() * (canvas.height - gap - 100) + 50;
    let top = centerY - gap / 2;
    let bottom = centerY + gap / 2;
    pipes.push({ x: canvas.width, top: top, bottom: bottom, scored: false });
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
  document.getElementById("finalScoreText").innerText = `Puntaje final: ${score}`;
  updateRanking();
}

function saveScore() {
  const name = document.getElementById("playerNameInput").value || "Anónimo";
  let scores = JSON.parse(localStorage.getItem("ranking") || "[]");
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);
  localStorage.setItem("ranking", JSON.stringify(scores));
  updateRanking();
}

function updateRanking() {
  const scores = JSON.parse(localStorage.getItem("ranking") || "[]");

  const startList = document.getElementById("rankingListStart");
  const endList = document.getElementById("rankingListEnd");

  [startList, endList].forEach(list => {
    if (list) {
      list.innerHTML = "";
      scores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.name}: ${s.score}`;
        list.appendChild(li);
      });
    }
  });
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
  gameRunning = false;
  frame = 0;
  drawBird(); // dibuja el personaje esperando
  drawPipes(); // dibuja fondo vacío

  // El juego empieza con el primer salto
  function handleFirstJump() {
    bird.velocity = lift;
    gameRunning = true;
    requestAnimationFrame(gameLoop);
    document.removeEventListener("keydown", handleFirstJump);
    canvas.removeEventListener("click", handleFirstJump);
  }

  document.addEventListener("keydown", handleFirstJump);
  canvas.addEventListener("click", handleFirstJump);

  canvas.style.display = "block";
  scoreDisplay.style.display = "block";
  bird.y = 200;
  bird.velocity = 0;
  score = 0;
  pipes = [];
  gameRunning = true;
  frame = 0;
  updateRanking();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", () => bird.velocity = lift);
canvas.addEventListener("click", () => bird.velocity = lift);
