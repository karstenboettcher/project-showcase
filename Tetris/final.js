let gameRunning = false;
let aiRunning = false;
let inMenu = false;
let canvas = null;
let ctx = null;
let gameModel = null;
let graphics = null;
let cellSize = null;
let playerInput = null;
let prevTime = null;
let inactivityCount = 0;
let idleMouse = null;
let idleKey = null;
let clearSound = new Audio("audio/clear.wav");
let bgMusic = new Audio("audio/bgmusic.wav");
clearSound.volume = 0.75;
bgMusic.volume = 0.5;

function menuInit() {
  prevTime = performance.now();
  idleMouse = inputMouse.Mouse();
  idleKey = inputKey.Keyboard();

  window.requestAnimationFrame(menuLoop);
}

function menuLoop(timestamp) {
  if (!gameRunning && !aiRunning && !inMenu) {
    let elapsedTime = timestamp - prevTime;
    inactivityCount += elapsedTime / 1000;
    if (inactivityCount >= 10) {
      document.getElementById("new-game").className += " active";
      document.getElementById("main-menu").className = "screen";
      document.getElementById("game-back").className += " active";
      initAI();
    }

    prevTime = timestamp;
    window.requestAnimationFrame(menuLoop);
  }
}

function initAI() {
  gameRunning = true;
  aiRunning = true;
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  prevTime = performance.now();

  gameModel = new GameModel(true);
  cellSize = (canvas.width / 2) / gameModel.width;
  graphics = renderer(canvas, ctx);
  playerInput = input.Keyboard(gameModel);

  window.requestAnimationFrame(gameLoop);
}

function initialize() {
  gameRunning = true;
  aiRunning = false;
  idleMouse = null;
  idleKey = null;
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  prevTime = performance.now();

  gameModel = new GameModel(false);
  cellSize = (canvas.width / 2) / gameModel.width;
  graphics = renderer(canvas, ctx);
  let controls = JSON.parse(getControls());
  playerInput = input.Keyboard(gameModel);
  playerInput.registerCommand(controls.left, "heldHandlers", "moveLeft");
  playerInput.registerCommand(controls.right, "heldHandlers", "moveRight");
  playerInput.registerCommand(controls.rotClock, "releaseHandlers", "rotateClockwise");
  playerInput.registerCommand(controls.rotCount, "releaseHandlers", "rotateCounterclockwise");
  playerInput.registerCommand(controls.soft, "heldHandlers", "softDrop");
  playerInput.registerCommand(controls.hard, "releaseHandlers", "hardDrop");

  window.requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (gameRunning) {
    let elapsedTime = timestamp - prevTime;
    processInput(elapsedTime);
    update(elapsedTime);
    render();

    prevTime = timestamp;
    window.requestAnimationFrame(gameLoop);
  }
}

function processInput(elapsedTime) {
  playerInput.update(elapsedTime);
}

function update(elapsedTime) {
  gameModel.update(elapsedTime);
}

function render() {
  graphics.render(gameModel);
}

function reset() {
  gameRunning = false;
  aiRunning = false;
  inMenu = false;
  canvas = null;
  ctx = null;
  gameModel = null;
  graphics = null;
  cellSize = null;
  playerInput = null;
  prevTime = null;
  inactivityCount = 0;
  idleMouse = null;
  idleKey = null;
}

bgMusic.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
