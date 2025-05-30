
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let gravity = 0.25;
let lift = -4.6;
let bird = { x: 50, y: 150, radius: 10, velocity: 0 };
let pipes = [];
let frame = 0;
let gameOver = false;

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.stroke();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = "#000000";
        ctx.fillRect(pipe.x, 0, 40, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 40, canvas.height - pipe.bottom);
    });
}

function updatePipes() {
    if (frame % 90 === 0) {
        let top = Math.random() * 200 + 20;
        let gap = 100;
        pipes.push({ x: canvas.width, top: top, bottom: top + gap });
    }
    pipes.forEach(pipe => pipe.x -= 2);
    pipes = pipes.filter(pipe => pipe.x + 40 > 0);
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + 40 &&
            (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
        ) {
            gameOver = true;
        }
    });
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        gameOver = true;
    }
}

function showGameOver() {
    document.getElementById("gameOver").style.display = "block";
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updatePipes();

    bird.velocity += gravity;
    bird.y += bird.velocity;

    checkCollision();

    if (!gameOver) {
        frame++;
        requestAnimationFrame(gameLoop);
    } else {
        showGameOver();
    }
}

document.addEventListener("keydown", () => {
    bird.velocity = lift;
});

canvas.addEventListener("click", () => {
    bird.velocity = lift;
});

gameLoop();
