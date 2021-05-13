class GameModel {
  constructor(aiModel = false) {
    this.width = 10;
    this.height = 20;
    this.level = 0;
    this.grid = this.createGrid();
    this.pieces = this.shuffle(["i", "j", "l", "o", "s", "t", "z"]);
    this.playerPiece = this.getPiece();
    this.nextPiece = this.getPiece();
    this.gameOver = false;
    this.dropCount = 0;
    this.dropRate = 1;
    this.score = 0;
    this.cleared = 0;
    this.particleSystem = new ParticleSystem();
    this.renderFire = particleRender(this.particleSystem, "textures/poof.png");
    this.ai = new AI(
      {
        heightWeight: 0.510066,
        linesWeight: 0.760666,
        holesWeight: 0.35663,
        bumpinessWeight: 0.184483,
      },
      this.width,
      this.height
    )
    this.aiModel = aiModel;

    if (aiModel) {
      let workingPieces = [this.playerPiece, this.nextPiece];
      this.playerPiece = this.ai.getBest(this.grid, workingPieces);
    }

    bgMusic.play();
  }

  update(elapsedTime) {
    if (!this.aiModel) {
      this.updatePlayer(elapsedTime);
    }
    else {
      this.updateAI(elapsedTime);
    }
  }

  updateAI(elapsedTime) {
    if (!this.gameOver) {
      this.getLevel();
      this.dropRate = 0.1;
      this.dropCount += elapsedTime / 1000;
      if (this.dropCount > this.dropRate) {
        if (!this.checkCollision(this.playerPiece.x, this.playerPiece.y + 1, this.playerPiece.getMatrix())) {
          this.playerPiece.y++;
        } else {
          this.mergeGrid();
          this.clearLines();
          this.playerPiece = this.nextPiece;
          this.nextPiece = this.getPiece();
          let workingPieces = [this.playerPiece, this.nextPiece];
          this.playerPiece = this.ai.getBest(this.grid, workingPieces);
          if (!this.attemptSpawn()) {
            this.gameOver = true;
          }
        }

        this.dropCount -= this.dropRate;
      }
    }

    this.particleSystem.update(elapsedTime);
  }

  updatePlayer(elapsedTime) {
    if (!this.gameOver) {
      this.getLevel();
      this.dropCount += elapsedTime / 1000;
      if (this.dropCount > this.dropRate) {
        if (!this.checkCollision(this.playerPiece.x, this.playerPiece.y + 1, this.playerPiece.getMatrix())) {
          this.playerPiece.y++;
        } else {
          this.mergeGrid();
          this.clearLines();
          this.playerPiece = this.nextPiece;
          this.nextPiece = this.getPiece();
          if (!this.attemptSpawn()) {
            this.gameOver = true;
            this.setHighScore();
          }
        }

        this.dropCount -= this.dropRate;
      }
    }

    this.particleSystem.update(elapsedTime);
  }

  createGrid() {
    let grid = [];
    for (let row = 0; row < this.height; row++) {
      let line = [];
      for (let col = 0; col < this.width; col++) {
        line.push(0);
      }
      grid.push(line);
    }
    return grid;
  }

  getPiece() {
    let piece = null;
    if (this.pieces.length > 0) {
      piece = this.pieces.shift();
    } else {
      this.pieces = this.shuffle(["i", "j", "l", "o", "s", "t", "z"]);
      piece = this.pieces.shift();
    }

    switch (piece) {
      case "i":
        return new IPiece();
      case "j":
        return new JPiece();
      case "l":
        return new LPiece();
      case "o":
        return new OPiece();
      case "s":
        return new SPiece();
      case "t":
        return new TPiece();
      case "z":
        return new ZPiece();
      default:
        console.log("Default case: gameModel getPiece()");
        return new IPiece();
    }
  }

  attemptSpawn() {
    let canSpawn = false;
    while (this.playerPiece.y >= -1) {
      if (
        this.checkCollision(
          this.playerPiece.x,
          this.playerPiece.y,
          this.playerPiece.getMatrix()
        )
      ) {
        this.playerPiece.y--;
      } else {
        canSpawn = true;
        break;
      }
    }

    return canSpawn;
  }

  moveLeft(elapsedTime, piece = this.playerPiece, grid = this.grid) {
    if (
      !this.gameOver &&
      !this.checkCollision(piece.x - 1, piece.y, piece.getMatrix(), grid)
    ) {
      piece.x--;
      return true;
    }
  }

  moveRight(elapsedTime, piece = this.playerPiece, grid = this.grid) {
    if (
      !this.gameOver &&
      !this.checkCollision(piece.x + 1, piece.y, piece.getMatrix(), grid)
    ) {
      piece.x++;
      return true;
    }
  }

  softDrop(elapsedTime, piece = this.playerPiece, grid = this.grid) {
    if (
      !this.gameOver &&
      !this.checkCollision(piece.x, piece.y + 1, piece.getMatrix(), grid)
    ) {
      piece.y++;
      this.score += 1;
      this.dropCount = 0;
    }
  }

  hardDrop(elapsedTime, piece = this.playerPiece, grid = this.grid) {
    if (this.gameOver) {
      return;
    }

    for (let i = piece.y; i < this.height; i++) {
      if (this.checkCollision(piece.x, i + 1, piece.getMatrix(), grid)) {
        this.score += i - piece.y;
        piece.y = i;
        this.dropCount = this.dropRate - 0.1;
        break;
      }
    }
  }

  rotateClockwise(elapsedTime) {
    if (this.gameOver) {
      return;
    }

    let seq = this.playerPiece.getTestSequence("clockwise");
    for (let i = 0; i < seq.length; i++) {
      if (
        !this.checkCollision(
          this.playerPiece.x + seq[i][0],
          this.playerPiece.y + seq[i][1],
          this.playerPiece.nextClockwiseRot()
        )
      ) {
        this.playerPiece.x += seq[i][0];
        this.playerPiece.y += seq[i][1];
        this.playerPiece.rotateClockwise();
        break;
      }
    }
  }

  rotateCounterclockwise(elapsedTime) {
    if (this.gameOver) {
      return;
    }

    let seq = this.playerPiece.getTestSequence("counterclockwise");
    for (let i = 0; i < seq.length; i++) {
      if (
        !this.checkCollision(
          this.playerPiece.x + seq[i][0],
          this.playerPiece.y + seq[i][1],
          this.playerPiece.nextCounterclockwiseRot()
        )
      ) {
        this.playerPiece.x += seq[i][0];
        this.playerPiece.y += seq[i][1];
        this.playerPiece.rotateCounterclockwise();
        break;
      }
    }
  }

  checkCollision(pX, pY, pMatrix, grid = this.grid) {
    for (let row = 0; row < pMatrix.length; row++) {
      for (let col = 0; col < pMatrix[row].length; col++) {
        if (pMatrix[row][col] && grid[pY + row] && grid[pY + row][pX + col]) {
          return true;
        } else if (pMatrix[row][col] && pY + row > this.height - 1) {
          return true;
        } else if (
          pMatrix[row][col] &&
          (pX + col < 0 || pX + col > this.width - 1)
        ) {
          return true;
        }
      }
    }
  }

  mergeGrid(piece = this.playerPiece, grid = this.grid) {
    let blockArray = [];
    let playerMatrix = piece.getMatrix();
    for (let row = 0; row < piece.area; row++) {
      for (let col = 0; col < piece.area; col++) {
        if (grid[piece.y + row]) {
          if (!grid[piece.y + row][piece.x + col] && playerMatrix[row][col]) {
            blockArray.push([piece.x + col, piece.y + row]);
          }
          grid[piece.y + row][piece.x + col] =
            grid[piece.y + row][piece.x + col] || playerMatrix[row][col];
        }
      }
    }

    this.particleSystem.land(blockArray);
  }

  clearLines() {
    let lines = [];
    let cleared = 0;
    for (let i = 0; i < this.height; i++) {
      let clear = true;
      for (let j = 0; j < this.width; j++) {
        if (!this.grid[i][j]) clear = false;
        continue;
      }

      if (clear) {
        let a = new Array(this.width).fill(0);
        this.grid.splice(i, 1);
        this.grid.splice(0, 0, a);
        lines.push(i);
        cleared++;
      }
    }

    this.cleared += cleared;
    this.score += this.getClearPoints(cleared);

    if (cleared > 0) {
      clearSound.play();
    }

    if (lines.length > 0) {
      this.particleSystem.clear(lines, gameModel.width);
    }
  }

  getClearPoints(lines) {
    switch(lines) {
      case 1:
        return 40 * (this.level + 1);
      case 2:
        return 100 * (this.level + 1);
      case 3:
        return 300 * (this.level + 1);
      case 4:
        return 1200 * (this.level + 1);
      default:
        return 0;
    }
  }

  getLevel() {
    if (this.level <= 5) {
      this.level = Math.floor(this.cleared / 15);  // Increase level every 15 lines
      this.dropRate = 1 - (this.level * 0.1);  // Decrease drop rate by 0.1 every level
    }
    else if (this.level <= 12) {
      this.level = Math.floor(this.cleared / 15); // Increase level every 15 lines
      this.dropRate = 1 - ((this.level * 0.05) + 0.25); // Decrease drop rate by 0.05 every level
    }
  }

  setHighScore() {
    let highScores = [];
    let previousScores = localStorage.getItem('highScores');
    if (previousScores !== null) {
        highScores = JSON.parse(previousScores);
    }

    while (highScores.length < 5) {
      highScores.push(0);
    }

    highScores.push(this.score);
    highScores.sort((a, b) => b - a);
    if (highScores.length > 5) {
      highScores.pop();
    }

    localStorage.setItem("highScores", JSON.stringify(highScores));
  }

  // Credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}
