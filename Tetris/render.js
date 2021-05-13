let renderer = function (canvas, ctx) {
  let colors = ["#ffffff", "#020045", "#300000", "#00290f", "#220029", "#302200", "#002233", "#3f0042"];
  // let colors = ["#ffffff", "#e60000", "#ff8c00", "#ffee00", "#00db04", "#0071db", "#4e00eb", "#d100ca"];
  // let colors = ["#ffffff", "#ffb1d9", "#a55781", "#c8c8c8", "#2e3b65", "#129cca", "#7ec8b4", "#2a5b57"];

  let imgLeftBorder = new Image();
  imgLeftBorder.isReady = false;
  imgLeftBorder.onload = function () {
    this.isReady = true;
  };
  imgLeftBorder.src = "textures/leftborder.png";

  let imgRightBorder = new Image();
  imgRightBorder.isReady = false;
  imgRightBorder.onload = function () {
    this.isReady = true;
  };
  imgRightBorder.src = "textures/rightborder.png";

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function render(gameModel) {
    clear();
    drawGrid(gameModel);
    drawPlayer(gameModel);
    drawHUD(gameModel);
    gameModel.renderFire.render();

    if (aiRunning) {
      drawAIText();
    }

    if (gameModel.gameOver && !gameModel.aiModel) {
      drawGameOver();
    }
  }

  function drawGrid(gameModel) {
    for (let row = 0; row < gameModel.height; row++) {
      for (let col = 0; col < gameModel.width; col++) {
        if (gameModel.grid[row][col]) {
          ctx.fillStyle = getColor(gameModel.grid[row][col]);
          ctx.fillRect((col * cellSize) + (canvas.width / 4) + 1, row * cellSize + 1, cellSize - 2, cellSize - 2);
        }
        else {
          ctx.fillStyle = "#010005";
          ctx.fillRect((col * cellSize) + (canvas.width / 4), row * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  function drawPlayer(gameModel) {
    let playerMatrix = gameModel.playerPiece.getMatrix();
    for (let row = 0; row < gameModel.playerPiece.area; row++) {
      for (let col = 0; col < gameModel.playerPiece.area; col++) {
        if (playerMatrix[row][col]) {
          ctx.strokeStyle = "#d1d1d1";
          ctx.strokeRect(
            (gameModel.playerPiece.x + col) * cellSize + (canvas.width / 4),
            (gameModel.playerPiece.y + row) * cellSize,
            cellSize + 1,
            cellSize + 1
          );
          ctx.fillStyle = getColor(playerMatrix[row][col]);
          ctx.fillRect(
            (gameModel.playerPiece.x + col) * cellSize + (canvas.width / 4) + 1,
            (gameModel.playerPiece.y + row) * cellSize + 1,
            cellSize - 1,
            cellSize - 1
          );
        }
      }
    }
  }

  function drawHUD(gameModel) {
    drawHUDBG();
    drawNextPiece(gameModel);
    drawLevel(gameModel);
    drawLinesCleared(gameModel);
    drawScore(gameModel);
  }

  function drawHUDBG() {
    // ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, (canvas.width / 4) - 1, canvas.height - 1);
    // ctx.fillRect((canvas.width * 0.75) + 1, 0, (canvas.width / 4), canvas.height - 1);
    ctx.drawImage(imgLeftBorder, 0, 0, (canvas.width / 4) - 1, (canvas.height - 1));
    ctx.drawImage(imgRightBorder, (canvas.width * 0.75) + 1, 0, (canvas.width / 4), (canvas.height - 1));
  }

  function drawNextPiece(gameModel) {
    ctx.fillStyle = "#03184A";
    ctx.fillRect((canvas.width * 0.75) + 8, 8, (canvas.width / 4) - 16, 150);
    ctx.fillStyle = "#034991";
    ctx.fillRect((canvas.width * 0.75) + 8, 8, (canvas.width / 4) - 16, 40);
    ctx.fillStyle = "#1579C6"
    ctx.fillRect((canvas.width * 0.75) + 8, 46, (canvas.width / 4) - 16, 2);
    ctx.fillStyle = "#0D5E99"
    ctx.fillRect((canvas.width * 0.75) + 8, 158, (canvas.width / 4) - 16, 2);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#D5F3F8";
    ctx.fillText("Next", (canvas.width * 0.75) + 12, 36);

    let nextPiece = gameModel.nextPiece.getMatrix(0);
    for (let row = 0; row < gameModel.nextPiece.area; row++) {
      for (let col = 0; col < gameModel.nextPiece.area; col++) {
        if (nextPiece[row][col]) {
          ctx.fillStyle = getColor(nextPiece[row][col]);
          ctx.fillRect(
            (col * cellSize) + (80 - ((cellSize * gameModel.nextPiece.area) / 2)) + 533,
            (row * cellSize) + (55 - ((cellSize * 2) / 2)) + 48,
            cellSize - 1,
            cellSize - 1
          );
          ctx.strokeStyle = getColor(0);
          ctx.strokeRect(
            (col * cellSize) + (80 - ((cellSize * gameModel.nextPiece.area) / 2)) + 533,
            (row * cellSize) + (55 - ((cellSize * 2) / 2)) + 48,
            cellSize - 1,
            cellSize - 1
          );
        }
      }
    }
  }

  function drawLevel(gameModel) {
    ctx.fillStyle = "#03184A";
    ctx.fillRect(8, 8, (canvas.width / 4) - 16, 77);
    ctx.fillStyle = "#034991";
    ctx.fillRect(8, 8, (canvas.width / 4) - 16, 40);
    ctx.fillStyle = "#1579C6"
    ctx.fillRect(8, 45, (canvas.width / 4) - 16, 2);
    ctx.fillStyle = "#0D5E99"
    ctx.fillRect(8, 82, (canvas.width / 4) - 16, 2);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#D5F3F8";
    ctx.fillText("Level", 12, 35);
    ctx.fillText(gameModel.level, 12, 75);
  }

  function drawLinesCleared(gameModel) {
    ctx.fillStyle = "#03184A";
    ctx.fillRect(8, 110, (canvas.width / 4) - 16, 75);
    ctx.fillStyle = "#034991";
    ctx.fillRect(8, 110, (canvas.width / 4) - 16, 40);
    ctx.fillStyle = "#1579C6"
    ctx.fillRect(8, 148, (canvas.width / 4) - 16, 2);
    ctx.fillStyle = "#0D5E99"
    ctx.fillRect(8, 184, (canvas.width / 4) - 16, 2);
    ctx.font = "24px Arial";
    ctx.fillStyle = "#D5F3F8";
    ctx.fillText("Lines Cleared", 12, 135);
    ctx.font = "28px Arial";
    ctx.fillText(gameModel.cleared, 12, 177);
  }

  function drawScore(gameModel) {
    ctx.fillStyle = "#03184A";
    ctx.fillRect(8, 212, (canvas.width / 4) - 16, 75);
    ctx.fillStyle = "#034991";
    ctx.fillRect(8, 212, (canvas.width / 4) - 16, 40);
    ctx.fillStyle = "#1579C6"
    ctx.fillRect(8, 250, (canvas.width / 4) - 16, 2);
    ctx.fillStyle = "#0D5E99"
    ctx.fillRect(8, 286, (canvas.width / 4) - 16, 2);
    ctx.font = "28px Arial";
    ctx.fillStyle = "#D5F3F8";
    ctx.fillText("Score", 12, 240);
    ctx.fillText(gameModel.score, 12, 279);
  }

  function drawAIText() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#eb006d";
    ctx.fillText("DEMO GAMEPLAY", (canvas.width / 4) + 20, 220);
  }

  function drawGameOver() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "#d90000";
    ctx.fillText("GAME OVER", (canvas.width / 4) + 60, 220);
  }

  function getColor(id) {
    return colors[id];
  }


  let api = {
    get canvas() {
      return canvas;
    },
    clear: clear,
    render: render,
  };

  return api;
};
