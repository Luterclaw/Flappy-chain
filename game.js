
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let bird = { x: 50, y: 150, width: 40, height: 40, velocity: 0 };
let gravity = 0.6;
let lift = -10;
let pipes = [];
let frame = 0;
let score = 0;
let gameRunning = true;
let OBSTACLE_WIDTH = 60;
let characterImg = new Image();
characterImg.src = "character_gold_centered.webp";
let columnImg = new Image();
columnImg.src = "chain_segment_gild.webp";
let scoreDisplay = document.getElementById("score");

function drawBird() {
  ctx.drawImage(characterImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(columnImg, pipe.x, 0, OBSTACLE_WIDTH, pipe.top);
    ctx.drawImage(columnImg, pipe.x, pipe.bottom, OBSTACLE_WIDTH, canvas.height - pipe.bottom);
  });
}

function updatePipes() {
  if (frame % 90 === 0) {
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
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
}

function update() {
  bird.velocity += gravity;
  bird.y += bird.velocity;

  updatePipes();

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }

  pipes.forEach(pipe => {
    if (
      bird.x < pipe.x + OBSTACLE_WIDTH &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      endGame();
    }
  });
}

function gameLoop() {
  if (gameRunning) {
    draw();
    update();
    frame++;
    requestAnimationFrame(gameLoop);
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

document.addEventListener("keydown", () => {
  if (gameRunning) bird.velocity = lift;
});

gameLoop();
