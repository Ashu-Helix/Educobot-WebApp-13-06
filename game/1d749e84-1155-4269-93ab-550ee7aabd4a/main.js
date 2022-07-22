/* Developed by Marvsoft LLP */

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";


import { CANVAS, Game, AUTO } from "phaser";
import M from 'materialize-css'
import {
  _gameThis,
  baseURL,
  gameWidth,
  gameHeight,
  gameScale,
  muteSound
} from "./config";
import {
  GAME_CONSTANT,
  ERROR_MESSAGE,
  CORRECT_MESSAGE,
  ANIMAL_NAME,
  SHELTER_NAME,
  CORRECT_COMBINATION,
  SOUND_CONSTANT
} from "./constant";
import MSPhaserLib from "../msPhaserLib.min";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let hasWrongSelection = false;
let _oMSPhaserLib;
let isStageCompleted = false;
let bg = null;
let red = null;
let green = null;
let amber = null;
let leftLights = [];
let rightLights = [];
let bgm = null;
let player_history = null;
let hasWrongMessage = null;
let sleepEvent = null;
let lesson_complete = false;

// Phaser config
const config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  backgroundColor: "#eeeeee",
  parent: "sprite-container",
  //canvas: canvas1,
  canvasStyle: `width: 100%;
  object-fit: revert;
  aspect-ratio: 738 / 436;`,
  scene: {
    preload: preload,
    create: create,
  },
};

// Initialize Phaser with config
const game = new Phaser.Game(config);

// Phaser preload function
function preload() {
  _gameThis = this;

  _gameThis.sound.mute = muteSound;

  this.load.setBaseURL(baseURL);

  _oMSPhaserLib = new MSPhaserLib(this, true, 100);

  for (const key in GAME_CONSTANT) {
    let item = GAME_CONSTANT[key];
    switch (item.type) {
      case "img":
        this.load.image(item.name, item.src);
        break;
      case "spritesheet":
        this.load.spritesheet(item.name, item.src, {
          frameWidth: item.frameWidth,
          frameHeight: item.frameHeight,
        });
        break;
    }
  }

  for (const key in SOUND_CONSTANT) {
    let item = SOUND_CONSTANT[key];

    this.load.audio(key, item.urls);
  }
}

// Phaser create function
function create() {
  // add background
  this.add.image(gameWidth * 0.5, gameHeight * 0.5, GAME_CONSTANT.bg.name);

  let topY = gameHeight * 0.18;
  let midY = gameHeight * 0.405;
  let botY = gameHeight * 0.625;

  let radius = 150;
  let intensity = 0.5;

  if (leftLights[0] == null) {
    leftLights.push(
      this.add.pointlight(gameWidth * 0.13, topY, 0, radius, intensity)
    );
    leftLights[0].color.setTo(255, 0, 0);
  } else {
    this.add.existing(leftLights[0]);
  }

  if (leftLights[1] == null) {
    leftLights.push(
      this.add.pointlight(gameWidth * 0.13, midY, 0, radius, intensity)
    );
    leftLights[1].color.setTo(255, 255, 3);
  } else {
    this.add.existing(leftLights[1]);
  }

  if (leftLights[2] == null) {
    leftLights.push(
      this.add.pointlight(gameWidth * 0.13, botY, 0, radius, intensity)
    );
    leftLights[2].color.setTo(42, 255, 24);
  } else {
    this.add.existing(leftLights[2]);
  }

  if (rightLights[0] == null) {
    rightLights.push(
      this.add.pointlight(gameWidth * 0.43, topY, 0, radius, intensity)
    );
    rightLights[0].color.setTo(255, 0, 0);
  } else {
    this.add.existing(rightLights[0]);
  }

  if (rightLights[1] == null) {
    rightLights.push(
      this.add.pointlight(gameWidth * 0.43, midY, 0, radius, intensity)
    );
    rightLights[1].color.setTo(255, 255, 3);
  } else {
    this.add.existing(rightLights[1]);
  }

  if (rightLights[2] == null) {
    rightLights.push(
      this.add.pointlight(gameWidth * 0.43, botY, 0, radius, intensity)
    );
    rightLights[2].color.setTo(42, 255, 24);
  } else {
    this.add.existing(rightLights[2]);
  }

  this.add.image(
    gameWidth * 0.28,
    gameHeight * 0.52,
    GAME_CONSTANT.trafficSignal.name
  );

  radius = 200;
  intensity = 0.25;

  if (red == null) {
    let pl = this.add.pointlight(0, 0, 0, radius, intensity);
    pl.color.setTo(216, 66, 66);

    red = this.add.image(gameWidth * 0.273, topY, GAME_CONSTANT.red.name);
    red.setScale(1.05, 1.05);
    red.pl = pl;
    red.pl.x = red.x;
    red.pl.y = red.y;
    red.leftPl = leftLights[2];
    red.rightPl = rightLights[2];
  } else {
    this.add.existing(red.pl);
    this.add.existing(red);
  }

  if (amber == null) {
    let pl = this.add.pointlight(0, 0, 0, radius, intensity);
    pl.color.setTo(243, 195, 3);

    amber = this.add.image(gameWidth * 0.273, midY, GAME_CONSTANT.amber.name);
    amber.setScale(1.05, 1.05);
    amber.pl = pl;
    amber.pl.x = amber.x;
    amber.pl.y = amber.y;
    amber.leftPl = leftLights[1];
    amber.rightPl = rightLights[1];
  } else {
    this.add.existing(amber.pl);
    this.add.existing(amber);
  }

  if (green == null) {
    let pl = this.add.pointlight(0, 0, 0, radius, intensity);
    pl.color.setTo(42, 161, 24);

    green = this.add.image(gameWidth * 0.273, botY, GAME_CONSTANT.green.name);
    green.setScale(1.05, 1.05);
    green.pl = pl;
    green.pl.x = green.x;
    green.pl.y = green.y;
    green.leftPl = leftLights[0];
    green.rightPl = rightLights[0];
  } else {
    this.add.existing(green.pl);
    this.add.existing(green);
  }

  // add sound effects
  if (bgm == null) {
    bgm = this.sound.add("bgm", { loop: true });
    bgm.play();
  }

  init();
}

// Initialize animation functions
function init() {
  // await sleep(1000);
  for (let i = 0; i < 3; i++) {
    leftLights[i].visible = false;
    rightLights[i].visible = false;
  }

  red.visible = false;
  red.pl.visible = false;

  amber.visible = false;
  amber.pl.visible = false;

  green.visible = false;
  green.pl.visible = false;

  player_history = [];
  isStageCompleted = false;
  hasWrongMessage = false;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
  return new Promise((resolve, reject) => {
    sleepEvent = _gameThis.scene.scene.time.delayedCall(ms, function () {
      resolve();

      player_history.push("s-" + ms);
      evaluate_task();
    });
  });
}

// Re-initialize the game variables
function reInitValues() {
  // TODO: Re-initialize the game variables here for reset
  for (let i = 0; i < 3; i++) {
    leftLights[i].visible = false;
    rightLights[i].visible = false;
  }

  red.visible = false;
  red.pl.visible = false;

  amber.visible = false;
  amber.pl.visible = false;

  green.visible = false;
  green.pl.visible = false;

  player_history = [];
  isStageCompleted = false;
  hasWrongMessage = false;
  lesson_complete = false;

  _gameThis.scene.scene.tweens.killAll();
}

// Reset the game
function reset_output() {
  if (green.lightTween && green.lightTween.isPlaying) green.lightTween.stop();
  if (red.lightTween && red.lightTween.isPlaying) red.lightTween.stop();
  if (amber.lightTween && amber.lightTween.isPlaying) amber.lightTween.stop();
  if (sleepEvent && !sleepEvent.paused) sleepEvent.remove();

  reInitValues();
  _gameThis.scene.restart();
}

// validate code blocks
function evaluate_task() {
  let correctTask = [
    "r-1",
    "s-1000",
    "r-0",
    "a-1",
    "s-1000",
    "a-0",
    "g-1",
    "s-1000",
    "g-0",
    "r-1",
    "s-1000",
    "r-0",
    "a-1",
    "s-1000",
    "a-0",
    "g-1",
    "s-1000",
    "g-0",
    "r-1",
    "s-1000",
    "r-0",
    "a-1",
    "s-1000",
    "a-0",
    "g-1",
    "s-1000",
    "g-0",
    "r-1",
    "s-1000",
    "r-0",
    "a-1",
    "s-1000",
    "a-0",
    "g-1",
    "s-1000",
    "g-0",
    "r-1",
    "s-1000",
    "r-0",
    "a-1",
    "s-1000",
    "a-0",
    "g-1",
    "s-1000",
    "g-0",
  ];
  //   for (let i = 0; i < 3; i++) {
  //     correctTask.push("r-1");
  //     correctTask.push("s-1000");
  //     correctTask.push("r-0");
  //     correctTask.push("s-1000");
  //     correctTask.push("a-1");
  //     correctTask.push("s-1000");
  //     correctTask.push("a-0");
  //     correctTask.push("s-1000");
  //     correctTask.push("g-1");
  //     correctTask.push("s-1000");
  //     correctTask.push("g-0");
  //     correctTask.push("s-1000");
  //   }

  let j = 0;
  for (let i = 0; i < player_history.length; i++) {
    if (player_history[i] == correctTask[j]) {
      if (j + 1 <= correctTask.length - 1) {
        j++;
      }
    } else {
      j = 0;
    }
  }

  if (!isStageCompleted) {
    if (j == correctTask.length - 1) {
      isStageCompleted = true;
      lesson_complete = true;

      M.toast({
        html: "Nice, Well Done!",
      });
    } else if (player_history.length >= 46 && !hasWrongMessage) {
      hasWrongMessage = true;
      M.toast({
        html: "Oops, the traffic light sequence is incorrect.",
      });
    }
  }
}

function initTween(target, from, to, callback) {
  target.visible = true;
  target.pl.visible = true;
  target.leftPl.visible = true;
  target.rightPl.visible = true;

  target.alpha = from;
  target.pl.alpha = from;
  target.leftPl.alpha = from;
  target.rightPl.alpha = from;

  let tween = _gameThis.scene.scene.add.tween({
    targets: target,
    duration: 100,
    alpha: to,
    onComplete: function () {
      target.visible = target.alpha != 0;

      evaluate_task();
      callback();
    },
    onUpdate: function (tween, target) {
      target.pl.alpha = target.alpha;
      target.leftPl.alpha = target.alpha;
      target.rightPl.alpha = target.alpha;
    },
  });

  return tween;
}

// toggle green light
function green_light_control(val) {
  return new Promise((resolve, reject) => {
    let from = 0;
    let to = 0;
    if (val == "on" || val == true) {
      from = 0;
      to = 1;
      player_history.push("g-1");
    } else if (val == "off" || val == false) {
      from = 1;
      to = 0;
      player_history.push("g-0");
    }

    green.lightTween = initTween(green, from, to, resolve);
  });
}

// toggle red light
function red_light_control(val) {
  return new Promise((resolve, reject) => {
    let from = 0;
    let to = 0;
    if (val == "on" || val == true) {
      from = 0;
      to = 1;
      player_history.push("r-1");
    } else if (val == "off" || val == false) {
      from = 1;
      to = 0;
      player_history.push("r-0");
    }

    red.lightTween = initTween(red, from, to, resolve);
  });
}

// toggle amber light
function amber_light_control(val) {
  return new Promise((resolve, reject) => {
    let from = 0;
    let to = 0;
    if (val == "on" || val == true) {
      from = 0;
      to = 1;
      player_history.push("a-1");
    } else if (val == "off" || val == false) {
      from = 1;
      to = 0;
      player_history.push("a-0");
    }

    amber.lightTween = initTween(amber, from, to, resolve);
  });
}

async function test() {
  for (let i = 0; i < 3; i++) {
    await red_light_control("on");
    await sleep(1000);
    await red_light_control("off");
    await sleep(1000);
    await amber_light_control("on");
    await sleep(1000);
    await amber_light_control("off");
    await sleep(1000);
    await green_light_control("on");
    await sleep(1000);
    await green_light_control("off");
    await sleep(1000);
  }
}

function completedFlag() {
  return lesson_complete;
}

function runCode() {
  // tour_over && tour.complete();
  let run_ = true;
  reset_output();
  reInitValues();
  setTimeout(() => {
    window.LoopTrap = 1e3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
      'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a =
      "async function c(){" +
      Blockly.JavaScript.workspaceToCode(demoWorkspace) +
      "} c();";
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
      run_ = true;
      eval(a);
    } catch (b) {
      alert(b);
    }
    // try {
    //   if (tour.getCurrentStep().options.title.includes("Run")) {
    //     let btns = document.querySelectorAll(".shepherd-button");
    //     btns[btns.length - 1].click();
    //   }
    // } catch { }
  }, 1000);
}

function helpCode() {
  if (!tour.isActive()) tour.show(tour_step);
}

function myUpdateFunction(a) {
  var code = Blockly.Python.workspaceToCode(demoWorkspace);
  var import_statement = "import traffic_signal\n";
  document.getElementById("pycode").innerHTML = import_statement + code;
  document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function getNoOfBlocks() {
  demoWorkspace = Blockly.getMainWorkspace();
  noOfBlocks = demoWorkspace.getAllBlocks();
  return noOfBlocks.length
}

const updateImports = ["import traffic_signal"]

export {
  reset_output,
  runCode,
  sleep,
  green_light_control,
  red_light_control,
  amber_light_control,
  completedFlag,
  updateImports,
  getNoOfBlocks
};
