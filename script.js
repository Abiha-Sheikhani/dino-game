const dino = document.getElementById('dino');
const scoreEl = document.getElementById('score');
const main = document.querySelector('.main-container');

let dinoY = 0;
let velocity = 0;
let gravity = 0.9;
let jumpPower = 18;
let isJumping = false;
let isRunning = false;
let score = 0;
let obstacleSpeed = 8; // faster
let obstacles = [];

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  obstacle.style.left = window.innerWidth + 'px';
  const img = document.createElement('img');
  img.src = './obstacle.png';
  obstacle.appendChild(img);
  main.appendChild(obstacle);
  obstacles.push(obstacle);
}

function resetGame() {
  obstacles.forEach(o => o.remove());
  obstacles = [];
  dinoY = 0;
  velocity = 0;
  isJumping = false;
  score = 0;
  obstacleSpeed = 8;
  scoreEl.textContent = 'Score: 0';
  dino.style.bottom = (window.innerHeight * 0.12 + dinoY) + 'px';
}

function startGame() {
  if (isRunning) return;
  isRunning = true;
  resetGame();
  loop();
}

function endGame() {
  isRunning = false;
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `<div>Game Over</div><button class="play-btn">Play Again</button>`;
  document.body.appendChild(overlay);
  overlay.querySelector('.play-btn').addEventListener('click', () => {
    overlay.remove();
    startGame();
  });
}

function jump() {
  if (!isJumping) {
    isJumping = true;
    velocity = jumpPower;
  }
}

function loop() {
  if (!isRunning) return;

  velocity -= gravity;
  if (isJumping) {
    dinoY += velocity;
    if (dinoY <= 0) {
      dinoY = 0;
      velocity = 0;
      isJumping = false;
    }
  }

  dino.style.bottom = (window.innerHeight * 0.12 + dinoY) + 'px';

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].offsetLeft < window.innerWidth - 400) {
    createObstacle();
  }

  obstacles.forEach((obs, i) => {
    const newLeft = obs.offsetLeft - obstacleSpeed;
    obs.style.left = newLeft + 'px';

    if (newLeft + obs.offsetWidth < 0) {
      obs.remove();
      obstacles.splice(i, 1);
      score++;
      scoreEl.textContent = 'Score: ' + score;
      if (score % 5 === 0 && obstacleSpeed < 18) obstacleSpeed += 0.8;
    }

    const dRect = dino.getBoundingClientRect();
    const oRect = obs.getBoundingClientRect();
    const hit =
      dRect.right - 10 > oRect.left + 10 &&
      dRect.left + 10 < oRect.right - 10 &&
      dRect.bottom - 10 > oRect.top + 10;
    if (hit) {
      endGame();
      return;
    }
  });

  requestAnimationFrame(loop);
}

// 🔹 PC: Start + Jump
document.addEventListener('keydown', e => {
  if ((e.code === 'Space' || e.code === 'ArrowUp')) {
    if (!isRunning) startGame();
    else jump();
  }
});

// 🔹 Mobile: First tap starts, next taps make jump
let gameStartedOnce = false;
document.addEventListener('touchstart', () => {
  if (!gameStartedOnce) {
    startGame();
    gameStartedOnce = true;
  } else {
    jump();
  }
});

resetGame();
