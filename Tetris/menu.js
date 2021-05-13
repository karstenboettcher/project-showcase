function newGameButton() {
  document.getElementById("new-game").className += " active";
  document.getElementById("main-menu").className = "screen";
  document.getElementById("game-back").className += " active";
  initialize();
}

function highScoresButton() {
  inMenu = true;
  document.getElementById("high-scores").className += " active";
  document.getElementById("main-menu").className = "screen";
  document.getElementById("high-scores-list").innerHTML = "";
  let scores = localStorage.getItem("highScores");
  if (scores !== null) {
    scores = JSON.parse(scores);
  }
  else {
    for (let i = 0; i < 5; i++) {
      document.getElementById("high-scores-list").innerHTML += "<li>0</li>";
    }
  }
  for (const score in scores) {
    document.getElementById("high-scores-list").innerHTML += "<li>" + scores[score] + "</li>";
  }
}

function controlsButton() {
  inMenu = true;
  document.getElementById("controls").className += " active";
  document.getElementById("main-menu").className = "screen";
  let controls = localStorage.getItem("controls");
  if (controls !== null) {
      controls = JSON.parse(controls);
  }

  document.getElementById("l").innerHTML = controls.left;
  document.getElementById("r").innerHTML = controls.right;
  document.getElementById("clock").innerHTML = controls.rotClock;
  document.getElementById("count").innerHTML = controls.rotCount;
  document.getElementById("soft").innerHTML = controls.soft;
  document.getElementById("hard").innerHTML = controls.hard;
}

function creditsButton() {
  inMenu = true;
  document.getElementById("credits").className += " active";
  document.getElementById("main-menu").className = "screen";
}

function mainMenuButton() {
  let current = document.getElementsByClassName("active");
  if (current.length > 0) {
    current[0].className = current[0].className.replace(" active", "");
  }
  document.getElementById("main-menu").className += " active";
  reset();
  menuInit();
}

function exitGameButton() {
  document.getElementById("game-back").className = "screen";
  document.getElementById("main-menu").className += " active";
  document.getElementById("new-game").className = "screen";
  reset();
  menuInit();
}

function getControls() {
  let controls = localStorage.getItem("controls");
  if (controls === null) {
    localStorage.setItem("controls", JSON.stringify({
      left: "ArrowLeft",
      right: "ArrowRight",
      rotCount: "Home",
      rotClock: "PageUp",
      soft: "ArrowDown",
      hard: "ArrowUp"
    }));
  }

  return controls;
}

async function changeControl(c) {
  document.getElementById("l").disabled = true;
  document.getElementById("r").disabled = true;
  document.getElementById("clock").disabled = true;
  document.getElementById("count").disabled = true;
  document.getElementById("soft").disabled = true;
  document.getElementById("hard").disabled = true;
  document.getElementById("back").disabled = true;

  let newKeySet = false;
  let controls = localStorage.getItem("controls");
  if (controls !== null) {
      controls = JSON.parse(controls);
  }

  let newControl = await waitingKeyPress();
  controls[c] = newControl;
  localStorage.setItem("controls", JSON.stringify(controls));
  document.getElementById("l").innerHTML = controls.left;
  document.getElementById("r").innerHTML = controls.right;
  document.getElementById("clock").innerHTML = controls.rotClock;
  document.getElementById("count").innerHTML = controls.rotCount;
  document.getElementById("soft").innerHTML = controls.soft;
  document.getElementById("hard").innerHTML = controls.hard;
}

function waitingKeyPress() {
  return new Promise((resolve) => {
    document.addEventListener("keydown", onKeyHandler);
    function onKeyHandler(e) {
      document.removeEventListener("keydown", onKeyHandler);
      document.getElementById("l").disabled = false;
      document.getElementById("r").disabled = false;
      document.getElementById("clock").disabled = false;
      document.getElementById("count").disabled = false;
      document.getElementById("soft").disabled = false;
      document.getElementById("hard").disabled = false;
      document.getElementById("back").disabled = false;
      resolve(e.key);
    }
  });
}
