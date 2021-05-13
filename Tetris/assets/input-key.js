// Credit: Dean Mathias - USU CS 5410

// This is the input handler used to distribute inputs to the game objects
let inputKey = (function () {
  "use strict";

  function Keyboard() {
    let that = {};

    function keyPress(e) {
      inactivityCount = 0;
      if (aiRunning) {
        exitGameButton();
      }
    }

    function keyRelease(e) {
      inactivityCount = 0;
      if (aiRunning) {
        exitGameButton();
      }
    }

    // These are used to keep track of which keys are currently pressed
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyRelease);

    return that;
  }

  return {
    Keyboard: Keyboard,
  };
})();
