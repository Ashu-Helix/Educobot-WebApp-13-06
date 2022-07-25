import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

import M from 'materialize-css';
import {
  AUTO,
  Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

let _gameThis = null;
const baseURL = "../img/images/f48757f4-f612-41dc-b882-614fe3c6544a";
const gameWidth = 960;
const gameHeight = 540;


let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

const GAME_CONSTANT = {
  images: {
    bg: { key: "bg", loc: "bg.png" },
    car1: { key: "car1", loc: "car1.png" },
    car2: { key: "car2", loc: "car2.png" },
    car3: { key: "car3", loc: "car3.png" },
  },
  spritesheets: {
    dice1: {
      key: "dice1",
      frameWidth: 150,
      frameHeight: 150,
      frameCount: 27,
      loc: "dice1.png",
    },
    dice2: {
      key: "dice2",
      frameWidth: 150,
      frameHeight: 150,
      frameCount: 29,
      loc: "dice2.png",
    },
    dice3: {
      key: "dice3",
      frameWidth: 150,
      frameHeight: 150,
      frameCount: 22,
      loc: "dice3.png",
    },
    dice4: {
      key: "dice4",
      frameWidth: 150,
      frameHeight: 150,
      frameCount: 24,
      loc: "dice4.png",
    },
    dice5: {
      key: "dice5",
      frameWidth: 150,
      frameHeight: 150,
      frameCount: 20,
      loc: "dice5.png",
    },
    dice6: {
      key: "dice6",
      frameWidth: 150,
      frameHeight: 150,
      frameCount: 23,
      loc: "dice6.png",
    },
  },
};

const LOCATIONS = {
  START: 0,
  CHECKPOINT: [4, 9, 22],
  REVERSE: [7, 15, 19, 26],
  FINISH: 31,
};

const COORDINATES = [
  { x: 391, y: 509 }, //START
  { x: 390, y: 452 }, //1
  { x: 388, y: 399 },
  { x: 381, y: 345 },
  { x: 342, y: 307 },
  { x: 299, y: 267 }, //5
  { x: 299, y: 213 },
  { x: 303, y: 159 },
  { x: 303, y: 101 },
  { x: 354, y: 89 },
  { x: 406, y: 92 }, //10
  { x: 431, y: 137 },
  { x: 483, y: 140 },
  { x: 528, y: 121 },
  { x: 562, y: 84 },
  { x: 619, y: 88 }, //15
  { x: 663, y: 118 },
  { x: 662, y: 170 },
  { x: 632, y: 216 },
  { x: 579, y: 213 },
  { x: 525, y: 216 }, //20
  { x: 469, y: 216 },
  { x: 430, y: 255 },
  { x: 460, y: 299 },
  { x: 515, y: 299 },
  { x: 571, y: 300 }, //25
  { x: 625, y: 301 },
  { x: 666, y: 341 },
  { x: 626, y: 372 },
  { x: 586, y: 401 },
  { x: 586, y: 455 }, //30
  { x: 585, y: 509 }, //FIN
];

let hasWrongSelection = false;
let _oMSPhaserLib;

//TODO Set Game Variables here
let gameOver = false;
let carSelected = false;
let carCanMove = false;
let carIsMoving = false;
let carInBoard = false;
let carGoingToDest = false;
let car;
let position = 0;
let destination = 0;
let timer = 60;
let counter = 0;
let dice;
let sleeping = false;
let run_ = true;
let timerText;
let diceSprite;
let i = 0;
let canRollDice = true;
let curvePath;
let gfx;
let cursors;
let justClicked = false;
let itemClicked;
let timerSet = false;
let diceRollDone = true;
let dummy = 0;

// Phaser config
let config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  backgroundColor: "#eeeeee",
  parent: "sprite-container",
  //canvas: canvas1,
  canvasStyle: `width: 100%;
  object-fit: revert;
  aspect-ratio: 738 / 436;`,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Initialize Phaser with config
let game = new Phaser.Game(config);

function sleep(T) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, T);
  });
}

// Re-initialize the game variables
function reInitValues() {
  // TODO: Re-initialize the game variables here for reset
  gameOver = false;
  carSelected = false;
  carCanMove = false;
  carInBoard = false;
  carIsMoving = false;
  carGoingToDest = false;
  canRollDice = true;
  diceRollDone = true;
  timerSet = false;
  position = 0;
  destination = 0;
  justClicked = false;
  itemClicked = undefined;
  timerSet = false;
  car = undefined;
}

// Reset the game
function reset_output() {
  reInitValues();
  _gameThis.scene.restart();
}

// Phaser preload function
function preload() {
  _gameThis = this;
  _gameThis.load.setBaseURL(baseURL);

  // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
  _oMSPhaserLib = new MSPhaserLib(this, true, 100);
  loadImages();
}

function loadImages() {
  let images = GAME_CONSTANT.images;
  let spritesImages = GAME_CONSTANT.spritesheets;

  for (const key in images) {
    if (Object.hasOwnProperty.call(images, key)) {
      const element = images[key];
      _gameThis.load.image(element.key, element.loc);
    }
  }

  for (const key in spritesImages) {
    if (Object.hasOwnProperty.call(spritesImages, key)) {
      const element = spritesImages[key];
      _gameThis.load.spritesheet(element.key, element.loc, {
        frameWidth: element.frameWidth,
        frameHeight: element.frameHeight,
      });
    }
  }
}

// Phaser create function
function create() {
  //TODO Set Initial Objects
  createBG();
  createCarSelection();
  createTimerText();
  createDice();
  init();

  cursors = _gameThis.input.keyboard.createCursorKeys();
  enableHandler();
}

function handleClickEvent(pointer, gameObject) {
  itemClicked = gameObject.name;
  if (!justClicked) {
    justClicked = true;
  }
}

function enableHandler() {
  // try {
  console.log(this, window)
  _gameThis.input.on("gameobjectdown", handleClickEvent);
  // } catch (err) {
  //   console.log(err)
  // }
}


function createPath(pos, dest) {
  let points = [];

  for (
    let i = pos;
    pos < dest ? i <= dest : i >= dest;
    pos < dest ? i++ : i--
  ) {
    let { x, y } = COORDINATES[i];
    points.push(new Phaser.Math.Vector2(x, y));
  }

  curvePath = new Phaser.Curves.Spline(points);

  // drawPath()
}

function drawPath() {
  if (gfx) gfx.clear();
  gfx = _gameThis.add.graphics();
  gfx.lineStyle(1, 0xffffff, 1);

  curvePath.draw(gfx, 64);
}

function createTimerText() {
  timerText = _gameThis.add.text(
    gameWidth * 0.1,
    gameHeight * 0.1,
    `Timer: ${timer}`,
    {
      fontSize: 25,
      fill: "#000000",
    }
  );
  timerText.setOrigin(0.5);
}

function createDice() {
  diceSprite = _gameThis.add.sprite(gameWidth * 0.9, gameHeight * 0.1, "dice1");
  diceSprite.setOrigin(0.5);
  diceSprite.scale = 0.6;
  diceSprite.name = "dice";
  diceSprite.setInteractive();

  for (let i = 1; i <= 6; i++) {
    let dc = GAME_CONSTANT.spritesheets[`dice${i}`];
    _gameThis.anims.create({
      key: `${dc.key}_roll`,
      frames: _gameThis.anims.generateFrameNumbers(dc.key, {
        start: 0,
        end: dc.frameCount - 1,
        first: 0,
      }),
      frameRate: 30,
      repeat: 0,
    });
  }
}

function createBG() {
  let bg = _gameThis.add.image(gameWidth / 2, gameHeight / 2, "bg");
  bg.setOrigin(0.5);
  bg.scale = gameWidth / bg.width;
}

function createCarSelection() {
  let offsetX = 70;
  for (let i = 1; i < 4; i++) {
    let car = _gameThis.add.sprite(
      gameWidth * 0.03 + offsetX * i,
      gameHeight * 0.87,
      `car${i}`
    );
    car.setOrigin(0.5);
    car.setInteractive();
    car.scale = 0.6;
    car.name = `car${i}`;
  }
}

function selectCar(index) {
  if (!car && !gameOver) {
    let { x, y } = COORDINATES[0];
    createPath(0, COORDINATES.length - 1);
    car = _gameThis.add.follower(curvePath, x, y, `car${index}`);
    car.setOrigin(0.5);
    car.scale = 0.5;
  } else {
    car.frame = `car${index}`;
  }
}

// Initialize animation functions
function init() { }

//Dummy function for Forever Loop, do not use this.
function update() { }

function updateWorld() {
  timerText.setText(`Timer: ${timer}`);
  if (!gameOver && destination != 0) {
    driveToDestination();
  }
}

function enter_game() {
  if (!carInBoard) {
    selectCar(Phaser.Math.Between(1, 3));
    carCanMove = true;
    carInBoard = true;
    canRollDice = true;
  }
}

function game_over() {
  gameOver = true;
}

function show_message(text) {
  M.toast({ html: text });
}

function mathRandomInt(min, max) {
  if (canRollDice) {
    i = Phaser.Math.Between(min, max);
    if (min < 1 || min > 6 || max < 1 || max > 6) {
      show_message("Please set min/max at 1-6 only.");
      game_over();
      return 0;
    }
  }
  return i;
};

function roll_dice() {
  if (!gameOver && canRollDice && !carGoingToDest && diceRollDone) {
    canRollDice = false;
    diceRollDone = false;

    diceSprite.anims.play(`dice${dice}_roll`);
    diceSprite.on("animationcomplete", function () {
      diceRollDone = true;

      if (!carInBoard) {
        canRollDice = true;
      }
    });
  }
}

function check_location(obj1, obj2) {
  let checkLoc = false;
  if (carInBoard) position = getPosition();
  if (obj1 == "car" && !carGoingToDest) {
    switch (obj2) {
      case "board":
        checkLoc = carInBoard;
        break;
      case "start":
        checkLoc = position === LOCATIONS.START;
        break;
      case "finish":
        checkLoc = position === LOCATIONS.FINISH;
        break;
      case "checkpoint":
        checkLoc = LOCATIONS.CHECKPOINT.includes(position);
        break;
      case "reverse":
        checkLoc = LOCATIONS.REVERSE.includes(position);
        break;
    }
  }
  return checkLoc;
}

// function show_message(text) {
//   M.toast({ html: text });
// }

function move_car_steps(obj) {
  let num = 0;
  switch (obj) {
    case "dice":
      num = dice;
      break;
    case "timer":
      num = timer;
      break;
  }
  if (!carGoingToDest && diceRollDone) {
    if (destination + num > LOCATIONS.FINISH) {
      destination = LOCATIONS.FINISH;
    } else {
      destination += num;
    }
    carGoingToDest = true;
  }
}

function driveToDestination() {
  if (!carCanMove || !carGoingToDest || carIsMoving) return;

  position = getPosition();

  if (position != destination) {
    startJourney();
  }
}

function startJourney() {
  carIsMoving = true;
  let duration = 500 * Math.abs(destination - position);
  createPath(position, destination);
  car.setPath(curvePath);
  car.startFollow({
    duration: duration,
    yoyo: false,
    repeat: 0,
    positionOnPath: true,
    rotateToPath: true,
    rotationOffset: 90,
  });
  setTimeout(() => {
    carIsMoving = false;
    carGoingToDest = false;
    canRollDice = true;
  }, duration + 300);
}

function getPosition() {
  let pos = position;

  for (let i = 0; i < COORDINATES.length; i++) {
    let { x, y } = COORDINATES[i];
    if (Math.abs(car.x - x) < 5 && Math.abs(car.y - y) < 5) {
      pos = i;
      break;
    }
  }
  return pos;
}

function move_to_checkpoint() {
  switch (position) {
    case LOCATIONS.REVERSE[0]:
      destination = LOCATIONS.CHECKPOINT[0];
      break;
    case LOCATIONS.REVERSE[1]:
    case LOCATIONS.REVERSE[2]:
      destination = LOCATIONS.CHECKPOINT[1];
      break;
    case LOCATIONS.REVERSE[3]:
      destination = LOCATIONS.CHECKPOINT[2];
      break;
  }
  carGoingToDest = true;
  show_message("Moving to checkpoint.");
}

function touch_dice() {
  if (justClicked) {
    justClicked = false;
    return itemClicked == "dice";
  }
  return false;
}

function touch_car() {
  if (justClicked) {
    justClicked = false;
    return itemClicked.includes("car");
  }
  return false;
}

function change_car() {
  if (carInBoard) {
    car.setTexture(itemClicked);
  } else {
    show_message("Car not yet in board.");
  }
}

var repeat_forever_flag = true;

function runCode() {
  // tour_over && tour.complete();
  reInitValues();
  window.LoopTrap = 1e3;
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
    'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
  var a =
    "async function c(){" +
    Blockly.JavaScript.workspaceToCode(demoWorkspace) +
    "} c();";
  try {
    run_ = true;
    eval(a);
    repeat_forever_flag = false;
    setTimeout(() => {
      eval(a);
    }, 700);
    setTimeout(() => {
      repeat_forever_flag = true;
    }, 3000);
  } catch (b) {
    alert(b);
  }
  // try {
  //   if (tour.getCurrentStep().options.title.includes("Run")) {
  //     let btns = document.querySelectorAll(".shepherd-button");
  //     btns[btns.length - 1].click();
  //   }
  // } catch { }
}

// function helpCode() {
//   var xml = Blockly.Xml.textToDom(
//     '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="fstj:3J=w.P1+fU7=rfE" x="244" y="-167"><field name="Variable name">timer</field><value name="NAME"><block type="math_number" id="FzO-UA4u0tbDM)R+fJ`o"><field name="NUM">60</field></block></value><next><block type="forever_repeat_block" id="y{Gv~Wu}OMYn8*PSzFqV"><statement name="NAME"><block type="set_variable_holder" id="z.-p[PTa0tE2I|z/bB@O"><field name="Variable name">dice</field><value name="NAME"><block type="math_random_int" id="6st=Z.7d3kAIzESR=?j["><value name="FROM"><block type="math_number" id="=:?SNzHqUosQd{:]:|o1"><field name="NUM">1</field></block></value><value name="TO"><block type="math_number" id="9Ge)TtcfLU2:WV0DkSz^"><field name="NUM">6</field></block></value></block></value><next><block type="diceaction_block" id="]=y|Z,_/sA^q|.HgZWNL"><next><block type="controls_if" id="bw1^GQ0QRkFOp7p:`ra|"><mutation else="1"></mutation><value name="IF0"><block type="sprite_locationblock" id="Id:;:XyL0{lcPlU`BN.."><field name="options1">car</field><field name="options2">board</field></block></value><statement name="DO0"><block type="controls_if" id="y.!WK}=F.^Q]`qaZR(!;"><mutation elseif="1" else="1"></mutation><value name="IF0"><block type="sprite_locationblock" id="h:3616r3Z12$xqmTA*w,"><field name="options1">car</field><field name="options2">reverse</field></block></value><statement name="DO0"><block type="action_block" id="F?.MK4Vq,7eyLjbxLc}!"></block></statement><value name="IF1"><block type="sprite_locationblock" id="=+%ZTEag,fYKmM.FU:x;"><field name="options1">car</field><field name="options2">finish</field></block></value><statement name="DO1"><block type="say_block" id="zB(o-FfkQ/3:$7Hi93$M"><field name="NAME">Yay! We did it!</field><next><block type="end_block" id="b16c2!Rb[/wN|UN7o+E7"></block></next></block></statement><statement name="ELSE"><block type="move_block" id="3ffk#?P~vq`#M1}?d*O?"><field name="options1">dice</field></block></statement></block></statement><statement name="ELSE"><block type="controls_if" id="g6-[q!zDlo@Vq:xb+.KS"><value name="IF0"><block type="logic_compare" id="lT/N#ftV1)8q.(e{,%$B"><field name="OP">EQ</field><value name="A"><block type="variables" id="UcX|CBU.sdCpSOiLQ!=3"><field name="Options">dice</field></block></value><value name="B"><block type="math_number" id="S(8D+j@B_7so7ScC/HHc"><field name="NUM">1</field></block></value></block></value><statement name="DO0"><block type="secondary_action_block" id="LMn[n|_?3;e.9By*nf7v"></block></statement></block></statement><next><block type="controls_if" id="HLjUQ`4g6}P);yfj+}Zu"><value name="IF0"><block type="touch_car" id="{ik$D#-$^zV,Zu..i`Ro"></block></value><statement name="DO0"><block type="change_car" id="cW@1H*P#Dzr?3A!L`[ZH"></block></statement><next><block type="controls_if" id="RIX#uDe;3[^}CPflV0;x"><value name="IF0"><block type="logic_compare" id="]Wlgu)_)?8AownJU=zZr"><field name="OP">EQ</field><value name="A"><block type="variables" id="3no*e1BmsE~U1S=o6#7R"><field name="Options">timer</field></block></value><value name="B"><block type="math_number" id="6n4768wizJi-]w)uu.~r"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="say_block" id="/Jb3B*h?r06#k]`]Bol."><field name="NAME">You have failed to reach the finish line!</field><next><block type="say_block" id="zfv*TUl1$69x_*#%VgF2"><field name="NAME">Try Again!</field><next><block type="end_block" id="H]8}A1_x3K+sV.-#y/?a"></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>'
//   );
//   demoWorkspace.clear();
//   Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="fstj:3J=w.P1+fU7=rfE" x="244" y="-167"><field name="Variable name">timer</field><value name="NAME"><block type="math_number" id="FzO-UA4u0tbDM)R+fJ`o"><field name="NUM">60</field></block></value><next><block type="forever_repeat_block" id="y{Gv~Wu}OMYn8*PSzFqV"><statement name="NAME"><block type="set_variable_holder" id="z.-p[PTa0tE2I|z/bB@O"><field name="Variable name">dice</field><value name="NAME"><block type="math_random_int" id="6st=Z.7d3kAIzESR=?j["><value name="FROM"><block type="math_number" id="=:?SNzHqUosQd{:]:|o1"><field name="NUM">1</field></block></value><value name="TO"><block type="math_number" id="9Ge)TtcfLU2:WV0DkSz^"><field name="NUM">6</field></block></value></block></value><next><block type="diceaction_block" id="]=y|Z,_/sA^q|.HgZWNL"><next><block type="controls_if" id="bw1^GQ0QRkFOp7p:`ra|"><mutation else="1"></mutation><value name="IF0"><block type="sprite_locationblock" id="Id:;:XyL0{lcPlU`BN.."><field name="options1">car</field><field name="options2">board</field></block></value><statement name="DO0"><block type="controls_if" id="y.!WK}=F.^Q]`qaZR(!;"><mutation elseif="1" else="1"></mutation><value name="IF0"><block type="sprite_locationblock" id="h:3616r3Z12$xqmTA*w,"><field name="options1">car</field><field name="options2">reverse</field></block></value><statement name="DO0"><block type="action_block" id="F?.MK4Vq,7eyLjbxLc}!"></block></statement><value name="IF1"><block type="sprite_locationblock" id="=+%ZTEag,fYKmM.FU:x;"><field name="options1">car</field><field name="options2">finish</field></block></value><statement name="DO1"><block type="say_block" id="zB(o-FfkQ/3:$7Hi93$M"><field name="NAME">Yay! We did it!</field><next><block type="end_block" id="b16c2!Rb[/wN|UN7o+E7"></block></next></block></statement><statement name="ELSE"><block type="move_block" id="3ffk#?P~vq`#M1}?d*O?"><field name="options1">dice</field></block></statement></block></statement><statement name="ELSE"><block type="controls_if" id="g6-[q!zDlo@Vq:xb+.KS"><value name="IF0"><block type="logic_compare" id="lT/N#ftV1)8q.(e{,%$B"><field name="OP">EQ</field><value name="A"><block type="variables" id="UcX|CBU.sdCpSOiLQ!=3"><field name="Options">dice</field></block></value><value name="B"><block type="math_number" id="S(8D+j@B_7so7ScC/HHc"><field name="NUM">1</field></block></value></block></value><statement name="DO0"><block type="secondary_action_block" id="LMn[n|_?3;e.9By*nf7v"></block></statement></block></statement><next><block type="controls_if" id="HLjUQ`4g6}P);yfj+}Zu"><value name="IF0"><block type="touch_car" id="{ik$D#-$^zV,Zu..i`Ro"></block></value><statement name="DO0"><block type="change_car" id="cW@1H*P#Dzr?3A!L`[ZH"></block></statement><next><block type="controls_if" id="RIX#uDe;3[^}CPflV0;x"><value name="IF0"><block type="logic_compare" id="]Wlgu)_)?8AownJU=zZr"><field name="OP">EQ</field><value name="A"><block type="variables" id="3no*e1BmsE~U1S=o6#7R"><field name="Options">timer</field></block></value><value name="B"><block type="math_number" id="6n4768wizJi-]w)uu.~r"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="say_block" id="/Jb3B*h?r06#k]`]Bol."><field name="NAME">You have failed to reach the finish line!</field><next><block type="say_block" id="zfv*TUl1$69x_*#%VgF2"><field name="NAME">Try Again!</field><next><block type="end_block" id="H]8}A1_x3K+sV.-#y/?a"></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
  var code = Blockly.Python.workspaceToCode(demoWorkspace);
  var import_statement = "from dice_and_car import *\n";
  document.getElementById("pycode").innerHTML = import_statement + code;
  document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function completedFlag() {
  return gameOver;
}

function getNoOfBlocks() {
  demoWorkspace = Blockly.getMainWorkspace();
  noOfBlocks = demoWorkspace.getAllBlocks();
  return noOfBlocks.length
}

const updateImports = ["from dice_and_car import *"]

const instruction = {
  "heading": "Let's roll the dice and move the car to the finish line before timer runs out",
  "steps": [
    {
      "checkbox": true,
      "rescue": true,
      "text": "set timer as 60",
      "title": "Initialize variables",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "The following statements should function within the loop",
      "title": "Repeat forever",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "set dice as random integer from 1 to 6",
      "title": "Dice number",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "Roll Dice !",
      "title": "Roll",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "If car in Board, do statements 1, else do statements 2",
      "title": "Move car logic",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "If Car in Reverse, Move to nearest checkpoint",
      "title": "Statements 1",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement></block></statement></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "else if Car in Finish, say \"Yay! We did it\", End all",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement></block></statement></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "else, Move Dice Steps",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "If Dice equals 1, Enter game",
      "title": "Statements 2",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement><statement name=\"ELSE\"><block type=\"controls_if\" id=\"g6-[q!zDlo@Vq:xb+.KS\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lT/N#ftV1)8q.(e{,%$B\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"UcX|CBU.sdCpSOiLQ!=3\"><field name=\"Options\">dice</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S(8D+j@B_7so7ScC/HHc\"><field name=\"NUM\">1</field></block></value></block></value><statement name=\"DO0\"><block type=\"secondary_action_block\" id=\"LMn[n|_?3;e.9By*nf7v\"></block></statement></block></statement></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "If I touch car, Change Car",
      "title": "Car Change",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement><statement name=\"ELSE\"><block type=\"controls_if\" id=\"g6-[q!zDlo@Vq:xb+.KS\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lT/N#ftV1)8q.(e{,%$B\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"UcX|CBU.sdCpSOiLQ!=3\"><field name=\"Options\">dice</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S(8D+j@B_7so7ScC/HHc\"><field name=\"NUM\">1</field></block></value></block></value><statement name=\"DO0\"><block type=\"secondary_action_block\" id=\"LMn[n|_?3;e.9By*nf7v\"></block></statement></block></statement><next><block type=\"controls_if\" id=\"HLjUQ`4g6}P);yfj+}Zu\"><value name=\"IF0\"><block type=\"touch_car\" id=\"{ik$D#-$^zV,Zu..i`Ro\"></block></value><statement name=\"DO0\"><block type=\"change_car\" id=\"cW@1H*P#Dzr?3A!L`[ZH\"></block></statement></block></next></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "If timer equals 0,",
      "title": "Game Over",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement><statement name=\"ELSE\"><block type=\"controls_if\" id=\"g6-[q!zDlo@Vq:xb+.KS\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lT/N#ftV1)8q.(e{,%$B\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"UcX|CBU.sdCpSOiLQ!=3\"><field name=\"Options\">dice</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S(8D+j@B_7so7ScC/HHc\"><field name=\"NUM\">1</field></block></value></block></value><statement name=\"DO0\"><block type=\"secondary_action_block\" id=\"LMn[n|_?3;e.9By*nf7v\"></block></statement></block></statement><next><block type=\"controls_if\" id=\"HLjUQ`4g6}P);yfj+}Zu\"><value name=\"IF0\"><block type=\"touch_car\" id=\"{ik$D#-$^zV,Zu..i`Ro\"></block></value><statement name=\"DO0\"><block type=\"change_car\" id=\"cW@1H*P#Dzr?3A!L`[ZH\"></block></statement><next><block type=\"controls_if\" id=\"RIX#uDe;3[^}CPflV0;x\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]Wlgu)_)?8AownJU=zZr\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"3no*e1BmsE~U1S=o6#7R\"><field name=\"Options\">timer</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"6n4768wizJi-]w)uu.~r\"><field name=\"NUM\">0</field></block></value></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "say \"You have failed to reach the finish line!\"",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement><statement name=\"ELSE\"><block type=\"controls_if\" id=\"g6-[q!zDlo@Vq:xb+.KS\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lT/N#ftV1)8q.(e{,%$B\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"UcX|CBU.sdCpSOiLQ!=3\"><field name=\"Options\">dice</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S(8D+j@B_7so7ScC/HHc\"><field name=\"NUM\">1</field></block></value></block></value><statement name=\"DO0\"><block type=\"secondary_action_block\" id=\"LMn[n|_?3;e.9By*nf7v\"></block></statement></block></statement><next><block type=\"controls_if\" id=\"HLjUQ`4g6}P);yfj+}Zu\"><value name=\"IF0\"><block type=\"touch_car\" id=\"{ik$D#-$^zV,Zu..i`Ro\"></block></value><statement name=\"DO0\"><block type=\"change_car\" id=\"cW@1H*P#Dzr?3A!L`[ZH\"></block></statement><next><block type=\"controls_if\" id=\"RIX#uDe;3[^}CPflV0;x\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]Wlgu)_)?8AownJU=zZr\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"3no*e1BmsE~U1S=o6#7R\"><field name=\"Options\">timer</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"6n4768wizJi-]w)uu.~r\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"/Jb3B*h?r06#k]`]Bol.\"><field name=\"NAME\">You have failed to reach the finish line!</field></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "say \"Try Again!\"",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement><statement name=\"ELSE\"><block type=\"controls_if\" id=\"g6-[q!zDlo@Vq:xb+.KS\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lT/N#ftV1)8q.(e{,%$B\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"UcX|CBU.sdCpSOiLQ!=3\"><field name=\"Options\">dice</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S(8D+j@B_7so7ScC/HHc\"><field name=\"NUM\">1</field></block></value></block></value><statement name=\"DO0\"><block type=\"secondary_action_block\" id=\"LMn[n|_?3;e.9By*nf7v\"></block></statement></block></statement><next><block type=\"controls_if\" id=\"HLjUQ`4g6}P);yfj+}Zu\"><value name=\"IF0\"><block type=\"touch_car\" id=\"{ik$D#-$^zV,Zu..i`Ro\"></block></value><statement name=\"DO0\"><block type=\"change_car\" id=\"cW@1H*P#Dzr?3A!L`[ZH\"></block></statement><next><block type=\"controls_if\" id=\"RIX#uDe;3[^}CPflV0;x\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]Wlgu)_)?8AownJU=zZr\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"3no*e1BmsE~U1S=o6#7R\"><field name=\"Options\">timer</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"6n4768wizJi-]w)uu.~r\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"/Jb3B*h?r06#k]`]Bol.\"><field name=\"NAME\">You have failed to reach the finish line!</field><next><block type=\"say_block\" id=\"zfv*TUl1$69x_*#%VgF2\"><field name=\"NAME\">Try Again!</field></block></next></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": true,
      "rescue": true,
      "text": "End all",
      "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"fstj:3J=w.P1+fU7=rfE\" x=\"244\" y=\"-167\"><field name=\"Variable name\">timer</field><value name=\"NAME\"><block type=\"math_number\" id=\"FzO-UA4u0tbDM)R+fJ`o\"><field name=\"NUM\">60</field></block></value><next><block type=\"forever_repeat_block\" id=\"y{Gv~Wu}OMYn8*PSzFqV\"><statement name=\"NAME\"><block type=\"set_variable_holder\" id=\"z.-p[PTa0tE2I|z/bB@O\"><field name=\"Variable name\">dice</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"6st=Z.7d3kAIzESR=?j[\"><value name=\"FROM\"><block type=\"math_number\" id=\"=:?SNzHqUosQd{:]:|o1\"><field name=\"NUM\">1</field></block></value><value name=\"TO\"><block type=\"math_number\" id=\"9Ge)TtcfLU2:WV0DkSz^\"><field name=\"NUM\">6</field></block></value></block></value><next><block type=\"diceaction_block\" id=\"]=y|Z,_/sA^q|.HgZWNL\"><next><block type=\"controls_if\" id=\"bw1^GQ0QRkFOp7p:`ra|\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"Id:;:XyL0{lcPlU`BN..\"><field name=\"options1\">car</field><field name=\"options2\">board</field></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"y.!WK}=F.^Q]`qaZR(!;\"><mutation elseif=\"1\" else=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_locationblock\" id=\"h:3616r3Z12$xqmTA*w,\"><field name=\"options1\">car</field><field name=\"options2\">reverse</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"F?.MK4Vq,7eyLjbxLc}!\"></block></statement><value name=\"IF1\"><block type=\"sprite_locationblock\" id=\"=+%ZTEag,fYKmM.FU:x;\"><field name=\"options1\">car</field><field name=\"options2\">finish</field></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"zB(o-FfkQ/3:$7Hi93$M\"><field name=\"NAME\">Yay! We did it!</field><next><block type=\"end_block\" id=\"b16c2!Rb[/wN|UN7o+E7\"></block></next></block></statement><statement name=\"ELSE\"><block type=\"move_block\" id=\"3ffk#?P~vq`#M1}?d*O?\"><field name=\"options1\">dice</field></block></statement></block></statement><statement name=\"ELSE\"><block type=\"controls_if\" id=\"g6-[q!zDlo@Vq:xb+.KS\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"lT/N#ftV1)8q.(e{,%$B\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"UcX|CBU.sdCpSOiLQ!=3\"><field name=\"Options\">dice</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S(8D+j@B_7so7ScC/HHc\"><field name=\"NUM\">1</field></block></value></block></value><statement name=\"DO0\"><block type=\"secondary_action_block\" id=\"LMn[n|_?3;e.9By*nf7v\"></block></statement></block></statement><next><block type=\"controls_if\" id=\"HLjUQ`4g6}P);yfj+}Zu\"><value name=\"IF0\"><block type=\"touch_car\" id=\"{ik$D#-$^zV,Zu..i`Ro\"></block></value><statement name=\"DO0\"><block type=\"change_car\" id=\"cW@1H*P#Dzr?3A!L`[ZH\"></block></statement><next><block type=\"controls_if\" id=\"RIX#uDe;3[^}CPflV0;x\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]Wlgu)_)?8AownJU=zZr\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"3no*e1BmsE~U1S=o6#7R\"><field name=\"Options\">timer</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"6n4768wizJi-]w)uu.~r\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"/Jb3B*h?r06#k]`]Bol.\"><field name=\"NAME\">You have failed to reach the finish line!</field><next><block type=\"say_block\" id=\"zfv*TUl1$69x_*#%VgF2\"><field name=\"NAME\">Try Again!</field><next><block type=\"end_block\" id=\"H]8}A1_x3K+sV.-#y/?a\"></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
    },
    {
      "checkbox": null,
      "rescue": null,
      "text": "Roll the dice, you need to get 1 to be able to make your 1st move, once you get the number 1 select anyone car out of the 3 and keep rolling dice till you reach the finish, beware to not land on the reverse icon that will push you back few steps to nearest check point marked as reverse arrorw",
      "title": "Instructions to play the game",
      "workspace": null
    }
  ]
};

export {
  completedFlag,
  myUpdateFunction,
  // helpCode,
  instruction,
  runCode,
  reset_output,
  reInitValues,
  // update,
  // time,
  // delta,
  counter,
  gameOver,
  updateWorld,
  game_over,
  dummy,
  dice,
  timer,
  sleep,
  roll_dice,
  enter_game,
  move_car_steps,
  move_to_checkpoint,
  // game_over,
  show_message,
  check_location,
  touch_dice,
  change_car,
  mathRandomInt,
  getNoOfBlocks,
  updateImports,
  update,
  game,
  preload,
  create,
  gameHeight,
  gameWidth,
  repeat_forever_flag,
  touch_car
};
