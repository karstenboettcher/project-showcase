class OPiece {
  constructor() {
    this.state = 0;
    this.area = 2;
    this.x = 4; // Start piece in center (left-bias)
    this.y = 0; // Start piece at top
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
        default:
          return [[0, 0]];
      }
    }
    else { // dir === "counterclockwise"
      switch(this.state) {
        default:
          return [[0, 0]];
      }
    }
  }

  getMatrix(state = this.state) {
    switch(state) {
      case 0:
        return [
          [4, 4],
          [4, 4],
        ];
      case 1:
        return [
          [4, 4],
          [4, 4],
        ];
      case 2:
        return [
          [4, 4],
          [4, 4],
        ];
      case 3:
        return [
          [4, 4],
          [4, 4],
        ];
      default:
        console.log("Default case: OPiece getMatrix()")
        return 0;
    }
  }

  type() {
    return "o";
  }
}
