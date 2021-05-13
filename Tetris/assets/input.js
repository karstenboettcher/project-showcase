// Credit: Dean Mathias - USU CS 5410

// This is the input handler used to distribute inputs to the game objects
let input = (function () {
  "use strict";

  function Keyboard(gameModel) {
    let that = {
      heldKeyBuffer: 100, // 250ms
      heldKeys: {},
      heldHandlers: {},
      heldLast: {},
      releaseKeys: {},
      releaseHandlers: {}
    };

    function keyPress(e) {
      that.heldKeys[e.key] = e.timeStamp;
    }

    function keyRelease(e) {
      delete that.heldKeys[e.key];
      that.releaseKeys[e.key] = e.timeStamp;
    }

    // Allows the client code to register a keyboard handler
    that.registerCommand = function (key, handlerType, handler) {
      that[handlerType][key] = handler;
      if (handlerType === "heldHandlers") {
        that.heldLast[handler] = 0;
      }
    };

    // Allows the client to invoke all the handlers for the registered key/handlers.
    that.update = function (elapsedTime) {
      for (let key in that.heldKeys) {
        if (that.heldKeys.hasOwnProperty(key)) {
          if (that.heldHandlers[key] && that.heldLast[that.heldHandlers[key]] <= 0) {
            gameModel[that.heldHandlers[key]](elapsedTime);
            that.heldLast[that.heldHandlers[key]] += that.heldKeyBuffer;
          }
        }
      }

      for (let key in that.releaseKeys) {
        if (that.releaseKeys.hasOwnProperty(key)) {
          if (that.releaseHandlers[key]) {
            gameModel[that.releaseHandlers[key]](elapsedTime);
          }
        }
      }
      that.releaseKeys = {};

      for (let key in that.heldLast) {
        if (that.heldLast[key] > 0) {
          that.heldLast[key] -= elapsedTime;
        }
      }
    };

    // These are used to keep track of which keys are currently pressed
    window.addEventListener("keydown", keyPress);
    window.addEventListener("keyup", keyRelease);

    return that;
  }

  return {
    Keyboard: Keyboard,
  };
})();
