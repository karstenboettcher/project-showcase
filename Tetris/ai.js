class AI {
  constructor(weights, width, height) {
    this.heightWeight = weights.heightWeight;
    this.linesWeight = weights.linesWeight;
    this.holesWeight = weights.holesWeight;
    this.bumpinessWeight = weights.bumpinessWeight;
    this.width = width;
    this.height = height;
  }

  best(grid, workingPieces, index) {
    let best = null;
    let bestScore = null;
    let workingPiece = workingPieces[index];

    for (let rot = 0; rot < 4; rot++) {
      let piece = this.clonePiece(workingPiece); // Create a dummy working piece
      piece.state = rot; // Rotate the piece
      while (this.moveLeft(piece, grid)); // Move all the way left
      while (!this.checkCollision(piece.x, piece.y, piece.getMatrix(), grid)) {
        // While no collision (with right wall here)
        let pieceClone = this.clonePiece(piece); // Get a copy of the clone piece
        this.hardDrop(pieceClone, grid);
        let gridClone = this.cloneGrid(grid);
        let merge = this.mergeGrid(pieceClone, gridClone);

        let score = null;
        if (index == workingPieces.length - 1) {
          score =
            -this.heightWeight * this.aggregateHeight(gridClone) +
            this.linesWeight * this.completeLines(gridClone) -
            this.holesWeight * this.holes(gridClone) -
            this.bumpinessWeight * this.bumpiness(gridClone);
        } else {
          score = this.best(gridClone, workingPieces, index + 1).score;
        }

        if (score > bestScore || bestScore == null) {
          bestScore = score;
          best = this.clonePiece(piece);
        }

        piece.x++;
      }
    }

    return {piece: best, score: bestScore};
  }

  getBest(grid, workingPieces) {
    return this.best(grid, workingPieces, 0).piece;
  }

  getPiece(piece) {
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

  moveLeft(piece, grid) {
    if (!this.checkCollision(piece.x - 1, piece.y, piece.getMatrix(), grid)) {
      piece.x--;
      return true;
    }
  }

  moveRight(piece, grid) {
    if (!this.checkCollision(piece.x + 1, piece.y, piece.getMatrix(), grid)) {
      piece.x++;
      return true;
    }
  }

  hardDrop(piece, grid) {
    for (let i = piece.y; i < this.height; i++) {
      if (this.checkCollision(piece.x, i + 1, piece.getMatrix(), grid)) {
        piece.y = i;
        break;
      }
    }
  }

  checkCollision(pX, pY, pMatrix, grid) {
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

  mergeGrid(piece, grid) {
    let playerMatrix = piece.getMatrix();
    for (let row = 0; row < piece.area; row++) {
      for (let col = 0; col < piece.area; col++) {
        if (grid[piece.y + row]) {
          grid[piece.y + row][piece.x + col] =
            grid[piece.y + row][piece.x + col] || playerMatrix[row][col];
        }
      }
    }

    return grid;
  }

  cloneGrid(grid) {
    let clone = [];
    for (let i = 0; i < grid.length; i++) {
      let line = [];
      for (let j = 0; j < grid[0].length; j++) {
        line.push(grid[i][j]);
      }
      clone.push(line);
    }
    return clone;
  }

  clonePiece(piece) {
    let clone = this.getPiece(piece.type());
    clone.state = piece.state;
    clone.x = piece.x;
    clone.y = piece.y;
    return clone;
  }

  aggregateHeight(grid) {
    let aggHeight = 0;
    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        if (grid[row][col]) {
          aggHeight += this.height - row;
          break;
        }
      }
    }

    return aggHeight;
  }

  completeLines(grid) {
    let lines = 0;
    for (let i = 0; i < this.height; i++) {
      let clear = true;
      for (let j = 0; j < this.width; j++) {
        if (!grid[i][j]) clear = false;
        continue;
      }

      if (clear) {
        lines++;
      }
    }
    return lines;
  }

  holes(grid) {
    var holes = 0;
    for (let col = 0; col < this.width; col++) {
      var block = false;
      for (let row = 0; row < this.height; row++) {
        if (grid[row][col]) {
          block = true;
        } else if (!grid[row][col] && block) {
          holes++;
        }
      }
    }
    return holes;
  }

  bumpiness(grid) {
    let heights = [];
    for (let col = 0; col < this.width; col++) {
      for (let row = 0; row < this.height; row++) {
        if (grid[row][col]) {
          heights.push(this.height - row);
          break;
        } else if (row == this.height - 1 && !grid[row][col]) {
          heights.push(0);
        }
      }
    }

    let bumpiness = 0;
    for (let i = 0; i < heights.length - 1; i++) {
      bumpiness += Math.abs(heights[i] - heights[i + 1]);
    }
    return bumpiness;
  }
}
