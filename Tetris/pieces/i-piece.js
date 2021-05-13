class IPiece {
  constructor() {
    this.state = 0;
    this.area = 4;
    this.x = 3; // Start piece in center
    this.y = -1; // Start piece at top
  }

  // Clockwise rotation
  rotateClockwise() {
    this.state++;
    if (this.state > 3) {
      this.state = 0;
    }
  }

  // Counterclockwise rotation
  rotateCounterclockwise() {
    this.state--;
    if (this.state < 0) {
      this.state = 3;
    }
  }

  nextClockwiseRot() {
    return this.state >= 3 ? this.getMatrix(0) : this.getMatrix(this.state + 1);
  }

  nextCounterclockwiseRot() {
    return this.state <= 0 ? this.getMatrix(3) : this.getMatrix(this.state - 1);
  }

  // Returns the wall kick test sequence for a given rotation
  getTestSequence(dir) {
    if (dir === "clockwise") {
      switch(this.state) {
        case 0:
          return [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]];
        case 1:
          return [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]];
        case 2:
          return [[0, 0],	[2, 0],	[-1, 0], [2, -1], [-1, 2]];
        case 3:
          return [[0, 0],	[1, 0],	[-2, 0], [1, 2], [-2, -1]];
      }
    }
    else { // dir === "counterclockwise"
      switch(this.state) {
        case 0:
          return [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]];
        case 1:
          return [[0, 0],	[2, 0],	[-1, 0], [2, -1], [-1, 2]];
        case 2:
          return [[0, 0],	[1, 0],	[-2, 0], [1, 2], [-2, -1]];
        case 3:
          return [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]];
      }
    }
  }

  getMatrix(state = this.state) {
    switch(state) {
      case 0:
        return [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
      case 1:
        return [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
        ];
      case 2:
        return [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        ];
      case 3:
        return [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ];
      default:
        console.log("Default case: IPiece getMatrix()")
        return 0;
    }
  }

  type() {
    return "i";
  }
}
