// Credit: Dean Mathias - USU CS 5410

// This is the mouse input handler used to distribute inputs to the game objects
let inputMouse = (function () {
  "use strict";

  function Mouse() {
    let that = {};

    function mouseDown(e) {
      inactivityCount = 0;
      if (aiRunning) {
        exitGameButton();
      }
    }

    function mouseUp(e) {
      inactivityCount = 0;
      if (aiRunning) {
        exitGameButton();
      }
    }

    function mouseMove(e) {
      inactivityCount = 0;
      if (aiRunning) {
        exitGameButton();
      }
    }

    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mousemove", mouseMove);

    return that;
  }

  return {
    Mouse: Mouse,
  };
})();
