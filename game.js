const game = document.getElementById("game");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let highScore = localStorage.getItem("stackHigh") || 0;
highScoreEl.innerText = highScore;

let stack = [];
let movingBlock;
let direction = 1;
let speed = 2;
let gameOver = false;
let score = 0;

function createBlock(width, left, bottom) {
  const block = document.createElement("div");
  block.className = "block";
  block.style.width = width + "px";
  block.style.left = left + "px";
  block.style.bottom = bottom + "px";
  game.appendChild(block);
  return block;
}

function startGame() {
  game.innerHTML = "";
  stack = [];
  score = 0;
  speed = 2;
  gameOver = false;

  let base = createBlock(200, 60, 0);
  stack.push({ el: base, width: 200, left: 60 });

  spawnMoving();
  updateScore();
}

function spawnMoving() {
  let last = stack[stack.length - 1];
  let width = last.width;
  let left = 0;

  movingBlock = createBlock(width, left, stack.length * 30);
  direction = 1;
}

function moveBlock() {
  if (gameOver) return;

  let left = parseFloat(movingBlock.style.left);

  left += direction * speed;

  if (left <= 0 || left + movingBlock.offsetWidth >= 320) {
    direction *= -1;
  }

  movingBlock.style.left = left + "px";

  requestAnimationFrame(moveBlock);
}

function dropBlock() {
  if (gameOver) return;

  let last = stack[stack.length - 1];

  let currentLeft = parseFloat(movingBlock.style.left);
  let currentWidth = movingBlock.offsetWidth;

  let overlap = Math.min(
    currentLeft + currentWidth,
    last.left + last.width
  ) - Math.max(currentLeft, last.left);

  if (overlap <= 0) {
    endGame();
    return;
  }

  // trim block
  let newLeft = Math.max(currentLeft, last.left);

  movingBlock.style.width = overlap + "px";
  movingBlock.style.left = newLeft + "px";

  stack.push({
    el: movingBlock,
    width: overlap,
    left: newLeft
  });

  score++;
  speed += 0.2;

  updateScore();

  spawnMoving();
}

function updateScore() {
  scoreEl.innerText = score;
}

function endGame() {
  gameOver = true;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("stackHigh", highScore);
    highScoreEl.innerText = highScore;
  }

  setTimeout(startGame, 1000);
}

document.addEventListener("click", dropBlock);
document.addEventListener("keydown", e => {
  if (e.code === "Space") dropBlock();
});

function gameLoop() {
  if (!gameOver) moveBlock();
  requestAnimationFrame(gameLoop);
}

startGame();
gameLoop();
