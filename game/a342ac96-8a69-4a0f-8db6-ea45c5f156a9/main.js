import M from 'materialize-css';
import {
  AUTO,
  Game,
} from 'phaser';

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

import MSPhaserLib from '../msPhaserLib.min';

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img/images/a342ac96-8a69-4a0f-8db6-ea45c5f156a9";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

let students_counted = 0;

const GAME_CONSTANT = {
  images: {
    BG: "Background.png",
    officer_nailcheck: "officer_nailcheck.png",
    officer_Stain_Check: "officer_Stain_Check.png",
    officer_teethcheck: "officer_teethcheck.png",
    speechBubble: "speechBubble.png",
    nails0: "nails0.png",
    nails1: "nails1.png",
    teeth0: "teeth0.png",
    teeth1: "teeth1.png",
    s1_0: "s1_0.png",
    s1_1: "s1_1.png",
    s2_0: "s2_0.png",
    s2_1: "s2_1.png",
    s3_0: "s3_0.png",
    s3_1: "s3_1.png",
    s4_0: "s4_0.png",
    s4_1: "s4_1.png",
  },
  spritesImages: {
    Officer_Walk_Spritesheet: "Officer_Walk_Spritesheet.png",
    st1a: "st1a.png",
    st2a: "st2a.png",
    st3a: "st3a.png",
    st4a: "st4a.png",
    st1: "st1.png",
    st2: "st2.png",
    st3: "st3.png",
    st4: "st4.png",
  },
};

let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;
let speechBubble;
let Middletext;
let BG;

let nails = "";
let teeth = "";
let clothes = "";

let officier;
let students = [];
let StudentCounter = -1;
let CurrentStudent;
let lens;
let good = "";
let bad = "";
// Phaser config
var config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  backgroundColor: "#eeeeee",
  parent: "sprite-container",
  canvasStyle: `width: 100%;
  object-fit: revert;
  aspect-ratio: 738 / 436;`,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Initialize Phaser with config
let game = new Phaser.Game(config);

// Phaser preload function
function preload() {
  _gameThis = this;
  _gameThis.load.setBaseURL(baseURL);
  loadImages();
}
// Phaser create function
function create() {
  BG = this.add.image(gameWidth / 2, gameHeight / 2, "BG").setName("BG");
  _gameThis["BG"] = BG;

  //prepare animations
  this.anims.create({
    key: "officier_walk",
    frames: this.anims.generateFrameNumbers("Officer_Walk_Spritesheet", {
      frames: [0, 1, 2, 3],
    }),
    frameRate: 6,
    repeat: -1,
  });

  this.anims.create({
    key: "st1_walk",
    frames: this.anims.generateFrameNumbers("st1", { frames: [0, 1, 2, 3] }),
    frameRate: 5,
    repeat: -1,
  });
  this.anims.create({
    key: "st2_walk",
    frames: this.anims.generateFrameNumbers("st2", { frames: [3, 2, 1, 0] }),
    frameRate: 5,
    repeat: -1,
  });
  this.anims.create({
    key: "st3_walk",
    frames: this.anims.generateFrameNumbers("st3", { frames: [3, 2, 1, 0] }),
    frameRate: 5,
    repeat: -1,
  });
  this.anims.create({
    key: "st4_walk",
    frames: this.anims.generateFrameNumbers("st4", { frames: [3, 2, 1, 0] }),
    frameRate: 5,
    repeat: -1,
  });

  //add 4 students
  students = [
    this.add
      .sprite(gameWidth * 0.5, gameHeight * 0.7, "st1a", "0")
      .setScale(0.8)
      .setName("st1n"),
    this.add
      .sprite(gameWidth * 0.63, gameHeight * 0.7, "st2a", "0")
      .setScale(0.8)
      .setName("st2n"),
    this.add
      .sprite(gameWidth * 0.76, gameHeight * 0.7, "st3a", "0")
      .setScale(0.8)
      .setName("st3n"),
    this.add
      .sprite(gameWidth * 0.89, gameHeight * 0.7, "st4a", "0")
      .setScale(0.8)
      .setName("st4n"),
  ];

  officier = this.add.sprite(
    -gameWidth * 0.2,
    gameHeight * 0.75,
    "Officer_Walk_Spritesheet",
    "0"
  );

  ErrorText = _gameThis.add.text(0, 0, "Error...", {
    font: "bold 36px Arial",
    fill: "#ff0000",
  });
  ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
  ErrorText.setOrigin(0, 0.5);
  ErrorText.setAlpha(0);

  speechBubble = _gameThis.add.image(0, 180, "speechBubble").setScale(0.8, 0.5);
  speechBubble.setX(speechBubble.displayWidth * 0.51);
  speechBubble.setAlpha(0);

  Middletext = _gameThis.add.text(
    speechBubble.x,
    speechBubble.y - speechBubble.displayHeight * 0.2,
    "",
    {
      font: "bold 48px Arial",
      fill: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
    }
  );
  Middletext.setOrigin(0.5, 0.5);

  lens = this.add.image(630, 340, "nails0").setScale(1.5, 1.5);
  lens.setAlpha(0);
}

function sleep(T) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, T * 1000);
  });
}

function next_student_is_available() {
  return StudentCounter < students.length - 1;
}

function start_checking() {
  officier.play("officier_walk");
  _gameThis.tweens.add({
    targets: officier,
    x: gameWidth * 0.2,
    duration: 1400,
    delay: 200,
    onComplete: () => {
      officier.stop();
      officier.setTexture("Officer_Walk_Spritesheet", "3");
    },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1650);
  });
}

function next_student() {
  if (CurrentStudent) {
    lens.setAlpha(0);
    _gameThis.tweens.add({
      targets: CurrentStudent,
      alpha: 0,
      duration: 1000,
      delay: 200,
      onComplete: () => {
        Middletext.setText("");
        speechBubble.setAlpha(0);
      },
    });
  }
  StudentCounter++;
  students_counted++;

  CurrentStudent = students[StudentCounter];
  let _name = CurrentStudent.name;
  CurrentStudent.play(_name.replace("n", "") + "_walk");
  _gameThis.tweens.add({
    targets: CurrentStudent,
    x: gameWidth * 0.32,
    duration: 400 + StudentCounter * 500,
    delay: 200,
    onComplete: () => {
      CurrentStudent.stop();
      CurrentStudent.setTexture(_name.replace("n", "a"), "0");
    },
  });
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 400 + StudentCounter * 500 + 1000);
  });
}

function check_nails() {
  let nailsValue;
  if (Math.random() > 0.5) nailsValue = "bad";
  else nailsValue = "good";

  officier.setTexture("officer_nailcheck");
  CurrentStudent.setTexture(CurrentStudent.name.replace("n", "a"), "2");
  lens.setAlpha(1);
  if (nailsValue == "good") {
    lens.setTexture("nails0");
  } else {
    lens.setTexture("nails1");
  }
  //
  return nailsValue;
}

function check_teeth() {
  let teethValue;
  if (Math.random() > 0.5) teethValue = "bad";
  else teethValue = "good";

  officier.setTexture("officer_teethcheck");
  CurrentStudent.setTexture(CurrentStudent.name.replace("n", "a"), "2");
  lens.setAlpha(1);
  if (teethValue == "good") {
    lens.setTexture("teeth0");
  } else {
    lens.setTexture("teeth1");
  }

  return teethValue;
}

function check_clothes() {
  let clotheValue;
  if (Math.random() > 0.5) clotheValue = "bad";
  else clotheValue = "good";

  officier.setTexture("officer_Stain_Check");
  CurrentStudent.setTexture(CurrentStudent.name.replace("n", "a"), "0");
  lens.setAlpha(1);
  let str = CurrentStudent.name.replace("t", "");
  str = str.replace("n", "");

  if (clotheValue == "good") {
    lens.setTexture(str + "_0");
  } else {
    lens.setTexture(str + "_1");
  }

  return clotheValue;
}

function game_over() {
  GameIsOver = true;
}

function say(str) {
  Middletext.setText(str);
  if (str.length > 0) {
    speechBubble.setAlpha(1);
  } else {
    speechBubble.setAlpha(0);
  }
}

function update() { }

function loadImages() {
  let images = GAME_CONSTANT.images;
  let spritesImages = GAME_CONSTANT.spritesImages;

  for (const key in images) {
    if (Object.hasOwnProperty.call(images, key)) {
      const element = images[key];
      _gameThis.load.image(key, element);
    }
  }

  for (const key in spritesImages) {
    if (Object.hasOwnProperty.call(spritesImages, key)) {
      const element = spritesImages[key];
      if (key == "Officer_Walk_Spritesheet")
        _gameThis.load.spritesheet(key, element, {
          frameWidth: 1200 / 4,
          frameHeight: 800,
        });
      if (key == "st1" || key == "st2" || key == "st3" || key == "st4")
        _gameThis.load.spritesheet(key, element, {
          frameWidth: 1600 / 4,
          frameHeight: 800,
        });
      if (key == "st1a" || key == "st2a" || key == "st3a" || key == "st4a")
        _gameThis.load.spritesheet(key, element, {
          frameWidth: 1200 / 3,
          frameHeight: 800,
        });
    }
  }
}

function ShowError() {
  ErrorText.setAlpha(1);
  ErrorText.setText(ErrorInnerText); //use error text
  //hide after 3 seconds
  _gameThis.tweens.add({
    targets: ErrorText,
    alpha: 0,
    duration: 500,
    delay: 2500,
  });
}

function Start_Game() {
  console.log("------------------->Start_Game");
}
// Re-initialize the game variables
function reInitValues() {
  students_counted = 0;
  StudentCounter = -1;
  GameIsOver = false;
}
// Reset the game
function reset_output() {
  console.log("reset_output");
  reInitValues();
  _gameThis.scene.restart();
}

var repeat_forever_flag = true;
function runCode() {
  // tour_over && tour.complete();
  reInitValues();
  window.LoopTrap = 1e3;
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
    'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
  var aa = ``;
  var a =
    "async function c(){" +
    Blockly.JavaScript.workspaceToCode(demoWorkspace) +
    aa +
    "completion_check();} c();";
  try {
    eval(a);
    repeat_forever_flag = false;
  } catch (b) {
    alert(b);
  }
  // try {
  //   if (tour.getCurrentStep().options.title === "Run and see what happens") {
  //     let btns = document.querySelectorAll(".shepherd-button");
  //     btns[btns.length - 1].click();
  //   }
  // } catch { }
}

// function helpCode() {
//   var xml_wkspace =
//     '<xml xmlns="https://developers.google.com/blockly/xml"><block type="single_action_block" id="`,s_9E`EZZ9HhYAV:}g@" x="-300" y="-2680"><next><block type="controls_whileUntil" id="9XuD*P;~B*DMNgWhJT`p"><field name="MODE">WHILE</field><value name="BOOL"><block type="next_student_is_available" id="x(?2U})y.?s?e3KvcU7C"></block></value><statement name="DO"><block type="custom_text" id="01{:$(4mCHU]F/lEMx9l"><next><block type="set_variable_holder" id="HnbhIA_JHS%qrC5x5y9T"><field name="Variable name">nails</field><value name="NAME"><block type="variables" id="8=r/L`5jd_fwD]#]cW[E"><field name="Options">check_nails()</field></block></value><next><block type="wait" id="Y;IKYIFR%IV4(6aKjQ,g"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="RvxVuzl|.!2^ut0R15!9"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="]m-cu8R`Jo:m$YqM!tSX"><field name="Variable name">teeth</field><value name="NAME"><block type="variables" id="*a!juCnj6KK-/)Q:7;Pw"><field name="Options">check_teeth()</field></block></value><next><block type="wait" id="F([I/#mqo$sT~/8,]2Zo"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="[^X97J`)?@`M;%|-N4/="><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="o3Jg.5[I2Vp05tyV}P1L"><field name="Variable name">clothes</field><value name="NAME"><block type="variables" id="^_LWOcEkF#DbHKfU{G-{"><field name="Options">check_clothes()</field></block></value><next><block type="wait" id="i7HWO6Qn]z.[r^LCjjLO"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="6eyF*e^x/)p_f5eQi@;2"><field name="NUM">2</field></block></value><next><block type="controls_if" id="?4%JswZE7|zrJD:8d2iT"><mutation else="1"></mutation><value name="IF0"><block type="logic_operation" id="H{{:U_e:bSuCc/(+6fFN"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="VLQhqawlH9nlFfI0S[LB"><field name="OP">EQ</field><value name="A"><block type="value_block" id="zrw$E76jPRio)c5z@3AL"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="_9S^w87j}Cq0(M_,ZSqG"><field name="Variable name">good</field></block></value></block></value><value name="B"><block type="logic_operation" id="tuhGQS_9N6qWd2px9{g["><field name="OP">AND</field><value name="A"><block type="logic_compare" id="{OOw%c4Xz_tyZIJ(kD*m"><field name="OP">EQ</field><value name="A"><block type="value_block" id="_67NL/Er$Fxc7ku-LJ8i"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="vir}/bMmI4e(+3w86n8@"><field name="Variable name">good</field></block></value></block></value><value name="B"><block type="logic_compare" id="S/yS)U2~ni6/YofzjiK;"><field name="OP">EQ</field><value name="A"><block type="value_block" id="2ys+8ODq83**8s/{-^X1"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="%R!e+/F,#{nNN,8qPR8i"><field name="Variable name">good</field></block></value></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="U^l(BuZ3V]TkGyP?5y:H"><field name="dialogue">Good, please go to classroom</field></block></statement><statement name="ELSE"><block type="controls_if" id="JG)!#qid2XCj0A;~9%*#"><mutation else="1"></mutation><value name="IF0"><block type="logic_operation" id="2nzKUqm65h~CQ}q_X$cp"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="-#9#;?8vOCjimoij`$U}"><field name="OP">EQ</field><value name="A"><block type="value_block" id="]WFfI|8ruraNZwg|0@fT"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="AS~wHOBGUNlL6JPgN1X["><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="J+X$;E-LQ8si?S%PYH2A"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="aBPs`Js3kC,Y?Q,qyDrg"><field name="OP">EQ</field><value name="A"><block type="value_block" id="?sTO|F4G6fg3~7[lI[,X"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="{4KnTur!8G(_%g~h$u`l"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id=";)HRTSao?E-xcBEhKsK`"><field name="OP">EQ</field><value name="A"><block type="value_block" id="0p~1e^s$0s@)iL?PWw^T"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id=",;ii{|(KT1Hv,_52G7v6"><field name="Variable name">bad</field></block></value></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="lmw4N8c;}i;/oNyb~9+g"><field name="dialogue">Very Bad, please go home</field><next><block type="wait" id="$rx6QG,g.+,GDZ(j#/bS"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="Ub49`cp,J?Cy4+OQrAQS"><field name="NUM">2</field></block></value><next><block type="say_block" id="nC5=X`6+y5WS0VuUHNyS"><field name="dialogue">300KPI fine</field></block></next></block></next></block></statement><statement name="ELSE"><block type="controls_if" id="/oyCTd%WA(=nNZ^S-rRX"><mutation else="1"></mutation><value name="IF0"><block type="logic_operation" id="DctUvwuY$a}QqRI3F$f."><field name="OP">OR</field><value name="A"><block type="logic_operation" id="_Hv3)g,=|v]~^MW%K}8t"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="NE$A6Sm53dZjJ|YT}f)F"><field name="OP">EQ</field><value name="A"><block type="value_block" id="4PZC5PkJ]W?m{`6@M}v."><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="M`!~L^)[m@iN`4,B0:f|"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="KFBB#c/S?*InmBPsuM)q"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="]FSECEiv[$+j,tfaRxnU"><field name="OP">EQ</field><value name="A"><block type="value_block" id="^5LkUjFFGo!_R~B7?);V"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="%,mPFxU1-/QYiQyEaiB/"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id="i;wNyeSDr9657xSWubmR"><field name="OP">EQ</field><value name="A"><block type="value_block" id="fHQIx4f7,`1FH4l|!0(s"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="*h++ES)BxzRK.zcZ|DjT"><field name="Variable name">good</field></block></value></block></value></block></value></block></value><value name="B"><block type="logic_operation" id=".%,ireU{+jtxvrmYF0uY"><field name="OP">OR</field><value name="A"><block type="logic_operation" id="{#`#zazTJCo4Mt0pI0By"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="YiOTJ3oE8Ici]r+4E{LR"><field name="OP">EQ</field><value name="A"><block type="value_block" id=")|M@-#Y~z71pV/YxURh-"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="k5*2*4?6uk%q-}4]ZOoE"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="{5gcn1M$]mKtlme,R%9h"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="[8itlV$P!tNxHN6vYC.z"><field name="OP">EQ</field><value name="A"><block type="value_block" id="f2[ZZE.47!?u^`h}7`Ss"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="H{SuT4be29*va{u+rtKJ"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id="E@rY1Pg~6`ZzIT-OnftC"><field name="OP">EQ</field><value name="A"><block type="value_block" id="5g5[h9x??RIvQ$KN7,B+"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="{r=uSYQffas21ALY`8(]"><field name="Variable name">good</field></block></value></block></value></block></value></block></value><value name="B"><block type="logic_operation" id="bm|1ZT!zW-bL%YA(0h7Y"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="b2-S.q;@Vx~;Q/zO8C^("><field name="OP">EQ</field><value name="A"><block type="value_block" id="Psm!XBQm32vEpfvH(};/"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="hH]MFb187`rlkjfz%K-P"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="j#B~Cqrih26dI%Ch4KyR"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="-]pWRjA7#6ds6ycNofzI"><field name="OP">EQ</field><value name="A"><block type="value_block" id="n,[:95u6XvMgb(E^f^ER"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="U3f(_qejkAE/AWFHtS[0"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id="UV~kR}n!agEchXU@lA^d"><field name="OP">EQ</field><value name="A"><block type="value_block" id="sOA;ML.{_8W#Aghv#S7Y"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="lHFY3IBBc/wQ_Sk#|pQb"><field name="Variable name">good</field></block></value></block></value></block></value></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="@VVpW#,`[JxUE:Ve7sl$"><field name="dialogue">Bad, KPI 200 Fine</field><next><block type="wait" id="|*|ISxP4c5LAZp9sl9en"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="Gc-Kapld,gm@Z~*WjsTU"><field name="NUM">2</field></block></value></block></next></block></statement><statement name="ELSE"><block type="say_block" id="@)CAX=fovv+E`:X|pfJi"><field name="dialogue">KPI 100 Fine</field><next><block type="wait" id="`zTMdegp=p+ZTfAb#UVK"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="R:baPA,MYD3aX6fJHIux"><field name="NUM">2</field></block></value></block></next></block></statement></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';
//   var xml = Blockly.Xml.textToDom(xml_wkspace);
//   demoWorkspace.clear();
//   Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="single_action_block" id="`,s_9E`EZZ9HhYAV:}g@" x="-300" y="-2680"><next><block type="controls_whileUntil" id="9XuD*P;~B*DMNgWhJT`p"><field name="MODE">WHILE</field><value name="BOOL"><block type="next_student_is_available" id="x(?2U})y.?s?e3KvcU7C"></block></value><statement name="DO"><block type="custom_text" id="01{:$(4mCHU]F/lEMx9l"><next><block type="set_variable_holder" id="HnbhIA_JHS%qrC5x5y9T"><field name="Variable name">nails</field><value name="NAME"><block type="variables" id="8=r/L`5jd_fwD]#]cW[E"><field name="Options">check_nails()</field></block></value><next><block type="wait" id="Y;IKYIFR%IV4(6aKjQ,g"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="RvxVuzl|.!2^ut0R15!9"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="]m-cu8R`Jo:m$YqM!tSX"><field name="Variable name">teeth</field><value name="NAME"><block type="variables" id="*a!juCnj6KK-/)Q:7;Pw"><field name="Options">check_teeth()</field></block></value><next><block type="wait" id="F([I/#mqo$sT~/8,]2Zo"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="[^X97J`)?@`M;%|-N4/="><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="o3Jg.5[I2Vp05tyV}P1L"><field name="Variable name">clothes</field><value name="NAME"><block type="variables" id="^_LWOcEkF#DbHKfU{G-{"><field name="Options">check_clothes()</field></block></value><next><block type="wait" id="i7HWO6Qn]z.[r^LCjjLO"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="6eyF*e^x/)p_f5eQi@;2"><field name="NUM">2</field></block></value><next><block type="controls_if" id="?4%JswZE7|zrJD:8d2iT"><mutation else="1"></mutation><value name="IF0"><block type="logic_operation" id="H{{:U_e:bSuCc/(+6fFN"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="VLQhqawlH9nlFfI0S[LB"><field name="OP">EQ</field><value name="A"><block type="value_block" id="zrw$E76jPRio)c5z@3AL"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="_9S^w87j}Cq0(M_,ZSqG"><field name="Variable name">good</field></block></value></block></value><value name="B"><block type="logic_operation" id="tuhGQS_9N6qWd2px9{g["><field name="OP">AND</field><value name="A"><block type="logic_compare" id="{OOw%c4Xz_tyZIJ(kD*m"><field name="OP">EQ</field><value name="A"><block type="value_block" id="_67NL/Er$Fxc7ku-LJ8i"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="vir}/bMmI4e(+3w86n8@"><field name="Variable name">good</field></block></value></block></value><value name="B"><block type="logic_compare" id="S/yS)U2~ni6/YofzjiK;"><field name="OP">EQ</field><value name="A"><block type="value_block" id="2ys+8ODq83**8s/{-^X1"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="%R!e+/F,#{nNN,8qPR8i"><field name="Variable name">good</field></block></value></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="U^l(BuZ3V]TkGyP?5y:H"><field name="dialogue">Good, please go to classroom</field></block></statement><statement name="ELSE"><block type="controls_if" id="JG)!#qid2XCj0A;~9%*#"><mutation else="1"></mutation><value name="IF0"><block type="logic_operation" id="2nzKUqm65h~CQ}q_X$cp"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="-#9#;?8vOCjimoij`$U}"><field name="OP">EQ</field><value name="A"><block type="value_block" id="]WFfI|8ruraNZwg|0@fT"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="AS~wHOBGUNlL6JPgN1X["><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="J+X$;E-LQ8si?S%PYH2A"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="aBPs`Js3kC,Y?Q,qyDrg"><field name="OP">EQ</field><value name="A"><block type="value_block" id="?sTO|F4G6fg3~7[lI[,X"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="{4KnTur!8G(_%g~h$u`l"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id=";)HRTSao?E-xcBEhKsK`"><field name="OP">EQ</field><value name="A"><block type="value_block" id="0p~1e^s$0s@)iL?PWw^T"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id=",;ii{|(KT1Hv,_52G7v6"><field name="Variable name">bad</field></block></value></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="lmw4N8c;}i;/oNyb~9+g"><field name="dialogue">Very Bad, please go home</field><next><block type="wait" id="$rx6QG,g.+,GDZ(j#/bS"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="Ub49`cp,J?Cy4+OQrAQS"><field name="NUM">2</field></block></value><next><block type="say_block" id="nC5=X`6+y5WS0VuUHNyS"><field name="dialogue">300KPI fine</field></block></next></block></next></block></statement><statement name="ELSE"><block type="controls_if" id="/oyCTd%WA(=nNZ^S-rRX"><mutation else="1"></mutation><value name="IF0"><block type="logic_operation" id="DctUvwuY$a}QqRI3F$f."><field name="OP">OR</field><value name="A"><block type="logic_operation" id="_Hv3)g,=|v]~^MW%K}8t"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="NE$A6Sm53dZjJ|YT}f)F"><field name="OP">EQ</field><value name="A"><block type="value_block" id="4PZC5PkJ]W?m{`6@M}v."><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="M`!~L^)[m@iN`4,B0:f|"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="KFBB#c/S?*InmBPsuM)q"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="]FSECEiv[$+j,tfaRxnU"><field name="OP">EQ</field><value name="A"><block type="value_block" id="^5LkUjFFGo!_R~B7?);V"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="%,mPFxU1-/QYiQyEaiB/"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id="i;wNyeSDr9657xSWubmR"><field name="OP">EQ</field><value name="A"><block type="value_block" id="fHQIx4f7,`1FH4l|!0(s"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="*h++ES)BxzRK.zcZ|DjT"><field name="Variable name">good</field></block></value></block></value></block></value></block></value><value name="B"><block type="logic_operation" id=".%,ireU{+jtxvrmYF0uY"><field name="OP">OR</field><value name="A"><block type="logic_operation" id="{#`#zazTJCo4Mt0pI0By"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="YiOTJ3oE8Ici]r+4E{LR"><field name="OP">EQ</field><value name="A"><block type="value_block" id=")|M@-#Y~z71pV/YxURh-"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="k5*2*4?6uk%q-}4]ZOoE"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="{5gcn1M$]mKtlme,R%9h"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="[8itlV$P!tNxHN6vYC.z"><field name="OP">EQ</field><value name="A"><block type="value_block" id="f2[ZZE.47!?u^`h}7`Ss"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="H{SuT4be29*va{u+rtKJ"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id="E@rY1Pg~6`ZzIT-OnftC"><field name="OP">EQ</field><value name="A"><block type="value_block" id="5g5[h9x??RIvQ$KN7,B+"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="{r=uSYQffas21ALY`8(]"><field name="Variable name">good</field></block></value></block></value></block></value></block></value><value name="B"><block type="logic_operation" id="bm|1ZT!zW-bL%YA(0h7Y"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="b2-S.q;@Vx~;Q/zO8C^("><field name="OP">EQ</field><value name="A"><block type="value_block" id="Psm!XBQm32vEpfvH(};/"><field name="Options">clothes</field></block></value><value name="B"><block type="new_block_good_bad" id="hH]MFb187`rlkjfz%K-P"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_operation" id="j#B~Cqrih26dI%Ch4KyR"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="-]pWRjA7#6ds6ycNofzI"><field name="OP">EQ</field><value name="A"><block type="value_block" id="n,[:95u6XvMgb(E^f^ER"><field name="Options">nails</field></block></value><value name="B"><block type="new_block_good_bad" id="U3f(_qejkAE/AWFHtS[0"><field name="Variable name">bad</field></block></value></block></value><value name="B"><block type="logic_compare" id="UV~kR}n!agEchXU@lA^d"><field name="OP">EQ</field><value name="A"><block type="value_block" id="sOA;ML.{_8W#Aghv#S7Y"><field name="Options">teeth</field></block></value><value name="B"><block type="new_block_good_bad" id="lHFY3IBBc/wQ_Sk#|pQb"><field name="Variable name">good</field></block></value></block></value></block></value></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="@VVpW#,`[JxUE:Ve7sl$"><field name="dialogue">Bad, KPI 200 Fine</field><next><block type="wait" id="|*|ISxP4c5LAZp9sl9en"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="Gc-Kapld,gm@Z~*WjsTU"><field name="NUM">2</field></block></value></block></next></block></statement><statement name="ELSE"><block type="say_block" id="@)CAX=fovv+E`:X|pfJi"><field name="dialogue">KPI 100 Fine</field><next><block type="wait" id="`zTMdegp=p+ZTfAb#UVK"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="R:baPA,MYD3aX6fJHIux"><field name="NUM">2</field></block></value></block></next></block></statement></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function retrieveCode() {
  var xml = Blockly.Xml.workspaceToDom(demoWorkspace);
  let text = Blockly.Xml.domToText(xml);
  return text;
}

function myUpdateFunction(a) {
  var code = Blockly.Python.workspaceToCode(demoWorkspace);
  var import_statement = "import dog\n";
  document.getElementById("pycode").innerHTML = import_statement + code;
  document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function completion_check() {
  if (students_counted >= 4) GameIsOver = true;
}

function completedFlag() {
  return GameIsOver;
}

async function test() {
  await start_checking();

  while (next_student_is_available()) {
    await next_student();
    nails = check_nails();
    await sleep(2);

    teeth = check_teeth();
    await sleep(2);

    clothes = check_clothes();
    await sleep(2);

    if (nails == "good" && teeth == "good" && clothes == "good") {
      say("Good, please go to classroom");
    } else {
      if (nails == "bad" && teeth == "bad" && clothes == "bad") {
        say("Very Bad, please go home");
        await sleep(2);
        say("300KPI fine");
      }

      if (
        (nails == "bad" && teeth == "bad" && clothes == "good") ||
        (teeth == "bad" && clothes == "bad" && nails == "good") ||
        (clothes == "bad" && nails == "bad" && teeth == "good")
      ) {
        await say("Bad, KPI 200 Fine.");
        sleep(2);
      } else {
        await say("KPI 100 Fine.");
        sleep(2);
      }
    }
  }
}

function getNoOfBlocks() {
  demoWorkspace = Blockly.getMainWorkspace();
  noOfBlocks = demoWorkspace.getAllBlocks();
  return noOfBlocks.length
}

const updateImports = ["import officer"]

export {
  completedFlag,
  myUpdateFunction,
  helpCode,
  runCode,
  reset_output,
  reInitValues,
  say,
  start_checking,
  nails,
  teeth,
  clothes,
  check_nails,
  check_teeth,
  check_clothes,
  sleep,
  next_student,
  next_student_is_available,
  getNoOfBlocks,
  updateImports
};
