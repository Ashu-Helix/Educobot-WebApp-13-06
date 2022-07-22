//============================================================================================
//========================================IMPORT STATEMENTS=========================================
//========================================DO NOT DELETE===================================

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

//============================================================================================
//========================================CONFIG.JS=========================================
//============================================================================================

let _gameThis = null;
const baseURL = "../img/images/8befdcc1-fe04-469e-90bc-33733d1b3c3d";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const muteSound = false;

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

//============================================================================================
//========================================CONSTANT.JS=========================================
//============================================================================================
const GAME_CONSTANT = {
    bg: { name: "bg", type: "img", src: "bg.png" },
    gun_1: { name: "gun_1", type: "img", src: "gun_1.png" },
    gun_2: { name: "gun_2", type: "img", src: "gun_2.png" },
    gun_3: { name: "gun_3", type: "img", src: "gun_3.png" },
    gun_4: { name: "gun_4", type: "img", src: "gun_4.png" },
    gun_5: { name: "gun_5", type: "img", src: "gun_5.png" },
    gun_6: { name: "gun_6", type: "img", src: "gun_6.png" },
    gun_7: { name: "gun_7", type: "img", src: "gun_7.png" },
    gun_8: { name: "gun_8", type: "img", src: "gun_8.png" },
    gun_1_shot: { name: "gun_1_shot", type: "img", src: "gun_1_shot.png" },
    gun_2_shot: { name: "gun_2_shot", type: "img", src: "gun_2_shot.png" },
    gun_3_shot: { name: "gun_3_shot", type: "img", src: "gun_3_shot.png" },
    gun_4_shot: { name: "gun_4_shot", type: "img", src: "gun_4_shot.png" },
    gun_5_shot: { name: "gun_5_shot", type: "img", src: "gun_5_shot.png" },
    gun_6_shot: { name: "gun_6_shot", type: "img", src: "gun_6_shot.png" },
    gun_7_shot: { name: "gun_7_shot", type: "img", src: "gun_7_shot.png" },
    gun_8_shot: { name: "gun_8_shot", type: "img", src: "gun_8_shot.png" },
    pearl: { name: "pearl", type: "img", src: "pearl.png" },
    shell: { name: "shell", type: "img", src: "shell.png" },
    target: { name: "target", type: "img", src: "target.png" },
    burst: {
        name: "burst",
        type: "spritesheet",
        src: "pearl_burst.png",
        frameWidth: 182,
        frameHeight: 206,
        frameRate: 12,
        anims: {
            anim: { start: 0, end: 15, frames: null, repeat: 0 },
        },
    },
};

const SOUND_CONSTANT = {
    win: { name: "win", urls: ["sounds/win.mp3", "sounds/win.ogg"] },
    lose: { name: "lose", urls: ["sounds/lose.mp3", "sounds/lose.ogg"] },
    correct: {
        name: "correct",
        urls: ["sounds/correct.mp3", "sounds/correct.ogg"],
    },
    wrong: { name: "wrong", urls: ["sounds/wrong.mp3", "sounds/wrong.ogg"] },
    shot: { name: "shot", urls: ["sounds/shot.mp3", "sounds/shot.ogg"] },
};

const ERROR_MESSAGE = "Opps, Wrong!";
const CORRECT_MESSAGE = "Congrats, Correct!";

//============================================================================================
//========================================SCRIPT2_BLOCKLY.JS=========================================
//============================================================================================

function completedFlag() {
    return GameIsOver; // *===== use this variable name ======*
}

var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    // Reset variables
    // let a = `update = ()=>{if (!isGameCompleted) {` + Blockly.JavaScript.workspaceToCode(demoWorkspace) + `}}`;
    // let a = `Blockly.JavaScript.workspaceToCode(demoWorkspace)`;
    reInitValues();
    window.LoopTrap = 1e3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a =
        "async function c(){" +
        Blockly.JavaScript.workspaceToCode(demoWorkspace) +
        "} c();";
    // Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        // eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
            repeat_forever_flag = true;
        }, 2000);
    } catch (b) {
        alert(b);
    }
    // try {
    //     if (tour.getCurrentStep().options.title === "Run and see what happens") {
    //         let btns = document.querySelectorAll(".shepherd-button");
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     // tour.isActive() || tour.start()
//     var xml_wkspace =
//         '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="+g^PCDWEXr,qQL6wlhr{" x="-431" y="-338"><field name="Variable name">option1</field><value name="NAME"><block type="math_number" id="@a3ar}JPe=o(=C|No%p}"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="rb}U/9Aa{LR.seO?Cv{a"><field name="Variable name">option3</field><value name="NAME"><block type="math_number" id="jn~fT.DH!L@ok$l2rCa^"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="#C#hweC8HArfrKpp6[SN"><field name="Variable name">option2</field><value name="NAME"><block type="math_number" id="nbWwoTj/x4f|2ELSopeS"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="a8J8$7)P%I9u8R2oIgHE"><field name="Variable name">option5</field><value name="NAME"><block type="math_number" id="z~@Bzhq;Z).r`AD66#(W"><field name="NUM">3</field></block></value><next><block type="variable_holder" id="8~d2Mi#qU!#uv0W2_uDP"><field name="Variable name">option4</field><value name="NAME"><block type="generate_number" id="aX)LI5YrjLXCQP6uc@!!"></block></value><next><block type="forever_repeat_block" id="]3rNnf[`+JWCEvV={MEZ"><statement name="NAME"><block type="controls_if" id="gxoJWgR~Cvp5k[UIg7vk"><value name="IF0"><block type="i_touch_pearl" id="T,cP.PVYc~@FKXQ@Nc(]"></block></value><statement name="DO0"><block type="variable_holder" id="x}]^x+,UP_(h2aWv5$#h"><field name="Variable name">option6</field><value name="NAME"><block type="shoot_pearl" id="{BurF8B}H-%]+~DO)X%("></block></value><next><block type="variable_holder" id="%IA3QC,MQk^gW|@7L1H4"><field name="Variable name">option1</field><value name="NAME"><block type="math_arithmetic" id="9HCoW/_VV;yrWi:IiExI"><field name="OP">ADD</field><value name="A"><block type="variables" id="^#1Wff=Y3dj,.U2Ya2q:"><field name="Options">option1</field></block></value><value name="B"><block type="variables" id="Qe3s#[!e3g/~Umq-+~kr"><field name="Options">option6</field></block></value></block></value><next><block type="controls_if" id="JVZADLL*^P|{;aK$ALwl"><value name="IF0"><block type="logic_compare" id="fh]#1Ch]T.h$f}^eO%-r"><field name="OP">EQ</field><value name="A"><block type="variables" id="Mj6l@?IuZkw,B!.3Y$yg"><field name="Options">option1</field></block></value><value name="B"><block type="variables" id="0LQP,sm{kmteHcb%7X(_"><field name="Options">option4</field></block></value></block></value><statement name="DO0"><block type="variable_holder" id="uNE?78`a`2ym#qGA}Mz6"><field name="Variable name">option3</field><value name="NAME"><block type="math_arithmetic" id="r*hP,d)T17e.fY#=;|g7"><field name="OP">ADD</field><value name="A"><block type="variables" id="Z:wv$^=e6%7E_AIUAwV!"><field name="Options">option3</field></block></value><value name="B"><block type="math_number" id="%$dn!R{BZ]|fn4K+,~Bs"><field name="NUM">1</field></block></value></block></value><next><block type="say_block" id="9~Mz?Q~f}46Kl2YcC4(W"><field name="string">Congrats Correct!</field><next><block type="wait_block" id="t;PjUo#^`m|)S!_(?3S`"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="cSW,7cKq7JVi%SFJeX64"><field name="NUM">3</field></block></value><next><block type="reset_pearl" id="LsfUGsT_ipOh?BW1ZA.*"><next><block type="variable_holder" id=":P7p#4K+U!,i4Ek,66~C"><field name="Variable name">option4</field><value name="NAME"><block type="generate_number" id="2Rr4o.:s;l1@_l-9{A#V"></block></value><next><block type="variable_holder" id="iXUxsV,bMBAmQ}k!4^C8"><field name="Variable name">option2</field><value name="NAME"><block type="math_arithmetic" id="MiY}s+MoV$BPMM)a+2@a"><field name="OP">ADD</field><value name="A"><block type="variables" id="P-GBrvTM@=tHWf#L[WkY"><field name="Options">option2</field></block></value><value name="B"><block type="math_number" id="_u3v3tcgy|Ymf~^y0o*o"><field name="NUM">1</field></block></value></block></value><next><block type="variable_holder" id="yg$b;fF=%`2,#aKu[_,="><field name="Variable name">option1</field><value name="NAME"><block type="math_number" id="B_9C%vYy:;|PxNaAto[="><field name="NUM">0</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement><next><block type="controls_if" id="3tWL@0U?E0[D;BB]}Efw"><value name="IF0"><block type="game_started" id="OGZ*?R.8rf1c1o%)}:TP"></block></value><statement name="DO0"><block type="controls_if" id="Jm[V7q),q|L3*4fwKOco"><value name="IF0"><block type="logic_compare" id="7/,KdOAonbHbAmX1;UCb"><field name="OP">GT</field><value name="A"><block type="variables" id="X12~,qru8q?yx6rea)u*"><field name="Options">option1</field></block></value><value name="B"><block type="variables" id=",){?6~Tx37syA07!B=*0"><field name="Options">option4</field></block></value></block></value><statement name="DO0"><block type="say_block" id="Y/-tUSFBTE@RYw_zY7i;"><field name="string">Oops, Wrong!</field><next><block type="end_game" id="]50;7XVJ=gzr+PK6-3!9"></block></next></block></statement><next><block type="controls_if" id="R_8!z-^3V,FCypG;B}Nz"><value name="IF0"><block type="logic_compare" id="W.edQag5[#.X;$T[YV}}"><field name="OP">EQ</field><value name="A"><block type="variables" id="}(I=jf/+04y30?5:{0bE"><field name="Options">option2</field></block></value><value name="B"><block type="variables" id="Eb+0,yn!PsVv:L-0Pz7n"><field name="Options">option5</field></block></value></block></value><statement name="DO0"><block type="end_game" id="=cM@-yXBxZ0%`#tByt4]"></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="+g^PCDWEXr,qQL6wlhr{" x="-431" y="-338"><field name="Variable name">option1</field><value name="NAME"><block type="math_number" id="@a3ar}JPe=o(=C|No%p}"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="rb}U/9Aa{LR.seO?Cv{a"><field name="Variable name">option3</field><value name="NAME"><block type="math_number" id="jn~fT.DH!L@ok$l2rCa^"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="#C#hweC8HArfrKpp6[SN"><field name="Variable name">option2</field><value name="NAME"><block type="math_number" id="nbWwoTj/x4f|2ELSopeS"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="a8J8$7)P%I9u8R2oIgHE"><field name="Variable name">option5</field><value name="NAME"><block type="math_number" id="z~@Bzhq;Z).r`AD66#(W"><field name="NUM">3</field></block></value><next><block type="variable_holder" id="8~d2Mi#qU!#uv0W2_uDP"><field name="Variable name">option4</field><value name="NAME"><block type="generate_number" id="aX)LI5YrjLXCQP6uc@!!"></block></value><next><block type="forever_repeat_block" id="]3rNnf[`+JWCEvV={MEZ"><statement name="NAME"><block type="controls_if" id="gxoJWgR~Cvp5k[UIg7vk"><value name="IF0"><block type="i_touch_pearl" id="T,cP.PVYc~@FKXQ@Nc(]"></block></value><statement name="DO0"><block type="variable_holder" id="x}]^x+,UP_(h2aWv5$#h"><field name="Variable name">option6</field><value name="NAME"><block type="shoot_pearl" id="{BurF8B}H-%]+~DO)X%("></block></value><next><block type="variable_holder" id="%IA3QC,MQk^gW|@7L1H4"><field name="Variable name">option1</field><value name="NAME"><block type="math_arithmetic" id="9HCoW/_VV;yrWi:IiExI"><field name="OP">ADD</field><value name="A"><block type="variables" id="^#1Wff=Y3dj,.U2Ya2q:"><field name="Options">option1</field></block></value><value name="B"><block type="variables" id="Qe3s#[!e3g/~Umq-+~kr"><field name="Options">option6</field></block></value></block></value><next><block type="controls_if" id="JVZADLL*^P|{;aK$ALwl"><value name="IF0"><block type="logic_compare" id="fh]#1Ch]T.h$f}^eO%-r"><field name="OP">EQ</field><value name="A"><block type="variables" id="Mj6l@?IuZkw,B!.3Y$yg"><field name="Options">option1</field></block></value><value name="B"><block type="variables" id="0LQP,sm{kmteHcb%7X(_"><field name="Options">option4</field></block></value></block></value><statement name="DO0"><block type="variable_holder" id="uNE?78`a`2ym#qGA}Mz6"><field name="Variable name">option3</field><value name="NAME"><block type="math_arithmetic" id="r*hP,d)T17e.fY#=;|g7"><field name="OP">ADD</field><value name="A"><block type="variables" id="Z:wv$^=e6%7E_AIUAwV!"><field name="Options">option3</field></block></value><value name="B"><block type="math_number" id="%$dn!R{BZ]|fn4K+,~Bs"><field name="NUM">1</field></block></value></block></value><next><block type="say_block" id="9~Mz?Q~f}46Kl2YcC4(W"><field name="string">Congrats Correct!</field><next><block type="wait_block" id="t;PjUo#^`m|)S!_(?3S`"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="cSW,7cKq7JVi%SFJeX64"><field name="NUM">3</field></block></value><next><block type="reset_pearl" id="LsfUGsT_ipOh?BW1ZA.*"><next><block type="variable_holder" id=":P7p#4K+U!,i4Ek,66~C"><field name="Variable name">option4</field><value name="NAME"><block type="generate_number" id="2Rr4o.:s;l1@_l-9{A#V"></block></value><next><block type="variable_holder" id="iXUxsV,bMBAmQ}k!4^C8"><field name="Variable name">option2</field><value name="NAME"><block type="math_arithmetic" id="MiY}s+MoV$BPMM)a+2@a"><field name="OP">ADD</field><value name="A"><block type="variables" id="P-GBrvTM@=tHWf#L[WkY"><field name="Options">option2</field></block></value><value name="B"><block type="math_number" id="_u3v3tcgy|Ymf~^y0o*o"><field name="NUM">1</field></block></value></block></value><next><block type="variable_holder" id="yg$b;fF=%`2,#aKu[_,="><field name="Variable name">option1</field><value name="NAME"><block type="math_number" id="B_9C%vYy:;|PxNaAto[="><field name="NUM">0</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement><next><block type="controls_if" id="3tWL@0U?E0[D;BB]}Efw"><value name="IF0"><block type="game_started" id="OGZ*?R.8rf1c1o%)}:TP"></block></value><statement name="DO0"><block type="controls_if" id="Jm[V7q),q|L3*4fwKOco"><value name="IF0"><block type="logic_compare" id="7/,KdOAonbHbAmX1;UCb"><field name="OP">GT</field><value name="A"><block type="variables" id="X12~,qru8q?yx6rea)u*"><field name="Options">option1</field></block></value><value name="B"><block type="variables" id=",){?6~Tx37syA07!B=*0"><field name="Options">option4</field></block></value></block></value><statement name="DO0"><block type="say_block" id="Y/-tUSFBTE@RYw_zY7i;"><field name="string">Oops, Wrong!</field><next><block type="end_game" id="]50;7XVJ=gzr+PK6-3!9"></block></next></block></statement><next><block type="controls_if" id="R_8!z-^3V,FCypG;B}Nz"><value name="IF0"><block type="logic_compare" id="W.edQag5[#.X;$T[YV}}"><field name="OP">EQ</field><value name="A"><block type="variables" id="}(I=jf/+04y30?5:{0bE"><field name="Options">option2</field></block></value><value name="B"><block type="variables" id="Eb+0,yn!PsVv:L-0Pz7n"><field name="Options">option5</field></block></value></block></value><statement name="DO0"><block type="end_game" id="=cM@-yXBxZ0%`#tByt4]"></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "import decimal_shooter\n";
    document.getElementById("pycode").innerHTML = import_statement + code;
    document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

//============================================================================================
//========================================MAIN.JS=========================================
//============================================================================================

let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;
var MiddleText;
let GameOverText;
let ResultText;
let bg;
let shellConts = [];
let gunConts = [];
let target = null;
let mouse = null;
let currentGun = null;
let currentShell = null;
let total = 0;
let count = 0;
let score = 0;
let win_score = 0;
let number = 0;
let i_touch_pearl = false;
let pearlNumbers = [];
let targetHeaderText = null;
let targetNumberText = null;
let yourHeaderText = null;
let yourNumberText = null;
let scoreHeaderText = null;
let scoreNumberText = null;
let firstTimeLoad = true;
let targetTween = null;
let numberTween = null;
let lesson_complete = false;
let game_started = false;

let shotSfx = null;
let winSfx = null;
let loseSfx = null;
let correctSfx = null;
let wrongSfx = null;
//================= GAME VARIABLES ====================================================================================================
//=====================================================================================================================================

//=====================================================================================================================================
var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    //canvas: canvas1,
    canvasStyle: `width: 100%;
    object-fit: revert;
    aspect-ratio: 738 / 436;`,
    physics: { default: "arcade", arcade: {} },
    scene: { preload: preload, create: create, update: update },
};
let game = new Phaser.Game(config);

function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);
    _gameThis.sound.mute = muteSound;

    loadImages();

    loadSounds();
}

function create() {
    bg = this.add.image(gameWidth / 2, gameHeight / 2, "bg").setName("bg");

    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);

    this.input.on("pointermove", onPointerMove);
    this.input.on("gameobjectmove", onObjectMove);
    this.input.on("gameobjectdown", onObjectDown);

    //=====================================================================================================================================
    //============ ADDING GRAPHICS ========================================================================================================
    //=====================================================================================================================================
    let positions = [
        { x: gameWidth * 0.25, y: gameHeight * 0.175 },
        { x: gameWidth * 0.5, y: gameHeight * 0.165 },
        { x: gameWidth * 0.75, y: gameHeight * 0.175 },
        { x: gameWidth * 0.07, y: gameHeight * 0.64 },
        { x: gameWidth * 0.26, y: gameHeight * 0.55 },
        { x: gameWidth * 0.5, y: gameHeight * 0.5 },
        { x: gameWidth * 0.74, y: gameHeight * 0.55 },
        { x: gameWidth * 0.93, y: gameHeight * 0.64 },
    ];

    // add shells
    shellConts = [];
    for (let i = 0, shellCont = null; i < 8; i++) {
        shellCont = this.add.container(positions[i].x, positions[i].y);
        shellCont.id = i;

        shellCont.shell = this.add.image(0, 0, "shell");
        shellCont.shell.id = i;
        shellCont.shell.setInteractive();
        shellCont.pearl = this.add.image(0, 0, "pearl");

        shellCont.text = this.add.text(0, 0, "0.0", {
            font: "bold 60px Arial",
            fill: "#ffffff",
            align: "center",
            stroke: "#0000ff",
            strokeThickness: 5,
        });

        shellCont.text.setAlign("center");
        shellCont.text.setOrigin(0.5, 0.5);

        shellCont.burst = initAnim("burst");
        shellCont.burst.setScale(2, 2);
        shellCont.burst.visible = false;

        shellCont.add([
            shellCont.shell,
            shellCont.pearl,
            shellCont.text,
            shellCont.burst,
        ]);
        shellConts.push(shellCont);
    }

    gunConts = [];
    for (let i = 0, gunCont = null; i < 8; i++) {
        gunCont = this.add.container(0, 0);
        gunCont.visible = false;

        gunCont.gun = this.add.image(0, 0, "gun_" + (i + 1));
        gunCont.gun.setOrigin(0, 0);

        gunCont.shot = this.add.image(0, 0, "gun_" + (i + 1) + "_shot");
        gunCont.shot.visible = false;
        switch (i) {
            case 0:
                gunCont.shot.setPosition(gameWidth * 0.28, gameHeight * 0.3);
                break;
            case 1:
                gunCont.shot.setPosition(gameWidth * 0.49, gameHeight * 0.23);
                break;
            case 2:
                gunCont.shot.setPosition(gameWidth * 0.72, gameHeight * 0.27);
                break;
            case 3:
                gunCont.shot.setPosition(gameWidth * 0.105, gameHeight * 0.68);
                break;
            case 4:
                gunCont.shot.setPosition(gameWidth * 0.28, gameHeight * 0.63);
                break;
            case 5:
                gunCont.shot.setPosition(gameWidth * 0.49, gameHeight * 0.56);
                break;
            case 6:
                gunCont.shot.setPosition(gameWidth * 0.73, gameHeight * 0.61);
                break;
            case 7:
                gunCont.shot.setPosition(gameWidth * 0.91, gameHeight * 0.65);
                break;
        }

        gunCont.add([gunCont.shot, gunCont.gun]);
        gunConts.push(gunCont);
    }

    targetHeaderText = this.add.text(10, 10, "Target Number:", {
        font: "bold 40px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#0000ff",
        strokeThickness: 5,
    });

    targetNumberText = this.add.text(20, 50, "0.0", {
        font: "bold 100px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#0000ff",
        strokeThickness: 5,
    });

    yourHeaderText = this.add.text(gameWidth * 0.85, 10, "Your Number:", {
        font: "bold 40px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#0000ff",
        strokeThickness: 5,
    });

    yourNumberText = this.add.text(gameWidth * 0.85, 50, "0.0", {
        font: "bold 100px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#0000ff",
        strokeThickness: 5,
    });

    scoreHeaderText = this.add.text(
        gameWidth * 0.85,
        gameHeight * 0.85,
        "Your Score:", {
        font: "bold 40px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#0000ff",
        strokeThickness: 5,
    }
    );

    scoreNumberText = this.add.text(
        gameWidth * 0.85,
        gameHeight * 0.85 + 40,
        "0 / 0", {
        font: "bold 100px Arial",
        fill: "#ffffff",
        align: "center",
        stroke: "#0000ff",
        strokeThickness: 5,
    }
    );

    currentGun = gunConts[5];
    currentGun.visible = true;

    target = this.add
        .image(gameWidth / 2, gameHeight / 2, "target")
        .setName("target");

    MiddleText = _gameThis.add.text(gameWidth / 2, 850, "", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 12,
    });
    MiddleText.setOrigin(0.5, 0.5);

    GameOverText = _gameThis.add.text(gameWidth / 2, 100, "Game Over", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 12,
    });
    GameOverText.setOrigin(0.5, 0.5);
    GameOverText.visible = false;

    ResultText = _gameThis.add.text(gameWidth / 2, 100, "", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 12,
    });
    ResultText.setOrigin(0.5, 0.5);
    ResultText.visible = false;

    //=====================================================================================================================================
    //============ ADDING SOUNDS ========================================================================================================
    //=====================================================================================================================================

    shotSfx = this.sound.add("shot", { loop: false });
    winSfx = this.sound.add("win", { loop: false });
    loseSfx = this.sound.add("lose", { loop: false });
    wrongSfx = this.sound.add("wrong", { loop: false });
    correctSfx = this.sound.add("correct", { loop: false });
}

//=====================================================================================================================================
//=========== THE UPDATE CODE =========================================================================================================
//=====================================================================================================================================
async function update() {
    if (i_touch_pearl) {
        i_touch_pearl = false;

        let val = await shoot_pearl();

        set_total(parseFloat(total) + val);

        if (parseFloat(total) == number) {
            set_score(score + 1);
            say("Congrats, Correct!");
            await sleep(3);
            reset_pearl();
            set_number(generate_number());
            set_count(count + 1);
            set_total(0);
        }
    }

    if (game_started) {
        if (parseFloat(total) > number) {
            say("Opps, Wrong!");
            game_over();
        }

        if (count == win_score) {
            game_over();
        }
    }
}
//=====================================================================================================================================
//================ NEW METHODS ========================================================================================================
//=====================================================================================================================================
function start_game() {
    reset_output();
}

function set_total(val) {
    total = val.toFixed(1);

    yourNumberText.setText(total);
}

function set_count(val) {
    count = val;

    if (game_started && count == win_score) {
        lesson_complete = true;
        winSfx.play();
    }
}

function set_score(val) {
    if (val > score) {
        correctSfx.play();
    }
    score = val;

    scoreNumberText.setText(score + " / " + win_score);
}

function set_number(val) {
    number = parseFloat(val).toFixed(1);

    targetNumberText.setText(number);
}

function set_win_score(val) {
    win_score = val;

    scoreNumberText.setText(score + " / " + win_score);
}

function generate_number() {
    game_started = true;
    let ones = Math.floor(Math.random() * 9) + 1;
    let decimals = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
    let randDecimal = decimals[Math.floor(Math.random() * decimals.length)];
    let rand = ones + randDecimal;

    let selectedOnes = [];
    switch (ones) {
        case 1:
            selectedOnes.push(1);
            break;
        case 2:
            selectedOnes.push(1);
            selectedOnes.push(1);
            break;
        case 3:
            selectedOnes.push(1);
            selectedOnes.push(2);
            break;
        case 4:
            selectedOnes.push(1);
            selectedOnes.push(1);
            selectedOnes.push(2);
            break;
        case 5:
            selectedOnes.push(2);
            selectedOnes.push(3);
            break;
        case 6:
            selectedOnes.push(1);
            selectedOnes.push(2);
            selectedOnes.push(3);
            break;
        case 7:
            selectedOnes.push(2);
            selectedOnes.push(2);
            selectedOnes.push(3);
            break;
        case 8:
            selectedOnes.push(2);
            selectedOnes.push(2);
            selectedOnes.push(4);
            break;
        case 9:
            selectedOnes.push(5);
            selectedOnes.push(3);
            selectedOnes.push(1);
            break;
    }

    let selectedDecimals = [];
    switch (randDecimal) {
        case 0.1:
            selectedDecimals.push(0.1);
            break;
        case 0.2:
            selectedDecimals.push(0.1);
            selectedDecimals.push(0.1);
            break;
        case 0.3:
            selectedDecimals.push(0.1);
            selectedDecimals.push(0.1);
            selectedDecimals.push(0.1);
            break;
        case 0.4:
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.2);
            break;
        case 0.5:
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.1);
            break;
        case 0.6:
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.2);
            break;
        case 0.7:
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.3);
            break;
        case 0.8:
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.4);
            break;
        case 0.9:
            selectedDecimals.push(0.2);
            selectedDecimals.push(0.3);
            selectedDecimals.push(0.4);
            break;
    }

    selectedDecimals = shuffle(selectedDecimals);
    selectedOnes = shuffle(selectedOnes);

    pearlNumbers = [];
    if (selectedDecimals.length > selectedOnes.length) {
        for (let i = 0, number = 0; i < selectedDecimals.length; i++) {
            number = 0;

            if (selectedOnes[i]) {
                number = selectedOnes[i];
            }

            number += selectedDecimals[i];

            pearlNumbers.push(number);
        }
    } else {
        for (let i = 0, number = 0; i < selectedOnes.length; i++) {
            number = selectedOnes[i];

            if (selectedDecimals[i]) {
                number += selectedDecimals[i];
            }

            pearlNumbers.push(number);
        }
    }

    let pearlDecimals = [0.1, 0.2, 0.3, 0.4];
    let pearlOnes = [1, 2, 3, 4];
    do {
        let number =
            pearlOnes[Math.floor(Math.random() * pearlOnes.length)] +
            pearlDecimals[Math.floor(Math.random() * pearlDecimals.length)];

        if (number != rand) {
            pearlNumbers.push(number);
        }
    } while (pearlNumbers.length < shellConts.length);

    // console.log (rand);
    // console.log (pearlNumbers);

    targetNumberText.setText(rand);
    setPearlNumbers(pearlNumbers);

    return rand;
}

function shoot_pearl() {
    return new Promise((resolve) => {
        if (currentShell == null || !currentShell.pearl.visible) return;

        currentShell.pearl.visible = false;
        currentShell.text.visible = false;
        currentShell.burst.visible = true;
        currentShell.burst.anims.play("anim");

        _gameThis.scene.scene.cameras.main.shake(200, 0.005);

        currentGun.shot.visible = true;
        _gameThis.scene.scene.time.delayedCall(100, function () {
            currentGun.shot.visible = false;

            resolve(currentShell.number);
        });

        shotSfx.play();
    });
}

function reset_pearl() {
    i_touch_pearl = false;
    currentShell = null;

    if (currentGun) {
        currentGun.visible = false;
    }

    currentGun = gunConts[5];
    currentGun.visible = true;

    targetNumberText.setText("0.0");
    yourNumberText.setText("0.0");

    for (let i = 0, shellCont = null; i < shellConts.length; i++) {
        shellCont = shellConts[i];

        shellCont.pearl.visible = true;

        shellCont.text.visible = true;
        shellCont.text.setText("0.0");
        shellCont.burst.visible = false;
    }

    target.setPosition(gameWidth / 2, gameHeight / 2);

    _gameThis.scene.scene.tweens.killAll();
}

function setPearlNumbers(numbers) {
    let shuffledNumbers = shuffle(numbers);

    for (let i = 0, shellCont = null; i < shellConts.length; i++) {
        shellCont = shellConts[i];
        shellCont.number = shuffledNumbers[i];
        shellCont.text.setText(shuffledNumbers[i]);
    }
}

function onPointerMove(pointer, gameObject) {
    if (!game_started) return;

    target.setPosition(pointer.x, pointer.y);
}

function onObjectMove(pointer, gameObject) {
    if (!game_started) return;
    // console.log ("on object move")
    if (currentGun != null) {
        currentGun.visible = false;
    }

    currentGun = gunConts[gameObject.id];
    currentGun.visible = true;
}

function onObjectDown(pointer, gameObject) {
    // console.log ("ob object down")
    if (gameObject.visible && game_started) {
        i_touch_pearl = true;
    } else {
        i_touch_pearl = false;
    }

    currentShell = shellConts[gameObject.id];

    // shoot_pearl ();
}

function game_over() {
    if (GameIsOver) return;

    GameIsOver = true;

    _gameThis.scene.scene.input.off("pointermove", onPointerMove);
    _gameThis.scene.scene.input.off("gameobjectmove", onObjectMove);
    _gameThis.scene.scene.input.off("gameobjectdown", onObjectDown);

    GameOverText.visible = true;
    GameOverText.y = -gameHeight * 0.2;

    ResultText.visible = true;
    ResultText.y = -gameHeight * 0.2;
    ResultText.setText(lesson_complete ? "YOU WIN!" : "YOU LOSE!");

    lesson_complete ? winSfx.play() : loseSfx.play();

    var timeline = _gameThis.scene.scene.tweens.createTimeline();
    timeline.add({
        targets: GameOverText,
        duration: 500,
        y: 100,
        ease: Phaser.Math.Easing.Back.Out,
    });

    timeline.add({
        targets: ResultText,
        duration: 500,
        y: 300,
        ease: Phaser.Math.Easing.Back.Out,
    });

    timeline.play();
}

function say(str) {
    MiddleText.setText(str);
    MiddleText.visible = true;
    MiddleText.y = gameHeight * 1.2;

    var timeline = _gameThis.scene.scene.tweens.createTimeline();
    timeline.add({
        targets: MiddleText,
        duration: 500,
        y: 850,
        ease: Phaser.Math.Easing.Back.Out,
    });

    timeline.add({
        targets: MiddleText,
        duration: 500,
        y: gameHeight * 1.2,
        delay: 2000,
        ease: Phaser.Math.Easing.Back.In,
    });

    timeline.play();
}

function hideSay() {
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
    MiddleText.visible = false;
}

async function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}

function test() {
    set_total(0);
    set_count(0);
    set_score(0);
    set_win_score(3);
    set_number(generate_number());
}
//=====================================================================================================================================
//=====================================================================================================================================
function loadImages() {
    for (const key in GAME_CONSTANT) {
        let item = GAME_CONSTANT[key];
        switch (item.type) {
            case "img":
                _gameThis.scene.scene.load.image(item.name, item.src);
                break;
            case "spritesheet":
                _gameThis.scene.scene.load.spritesheet(item.name, item.src, {
                    frameWidth: item.frameWidth,
                    frameHeight: item.frameHeight,
                });
                break;
        }
    }
}

function loadSounds() {
    for (const key in SOUND_CONSTANT) {
        let item = SOUND_CONSTANT[key];

        _gameThis.scene.scene.load.audio(key, item.urls, { instances: 1 });
    }
}

function initAnim(texture) {
    let sprite = _gameThis.scene.scene.add.sprite(0, 0, texture);
    for (const key in GAME_CONSTANT[texture].anims) {
        let anim = GAME_CONSTANT[texture].anims[key];

        sprite.anims.create({
            key: key,
            frames: anim.frames != null ?
                this.anims.generateFrameNumbers(GAME_CONSTANT[texture].name, {
                    frames: anim.frames,
                }) : _gameThis.scene.scene.anims.generateFrameNumbers(texture, {
                    start: anim.start,
                    end: anim.end,
                }),
            frameRate: GAME_CONSTANT[texture].frameRate,
            repeat: anim.repeat,
        });
    }

    return sprite;
}

function ShowError() {
    ErrorText.setAlpha(1);
    ErrorText.setText(ErrorInnerText); //use error text
    _gameThis.tweens.add({
        targets: ErrorText,
        alpha: 0,
        duration: 500,
        delay: 2500,
    });
}
//function Start_Game() { console.log('------------------->Start_Game'); }
// Re-initialize the game variables
function reInitValues() {
    GameIsOver = false;
    game_started = false;

    total = 0;
    count = 0;
    score = 0;
    win_score = 0;
    number = 0;
    i_touch_pearl = false;
    currentShell = null;
    currentGun = gunConts[5];
    currentGun.visible = true;
    lesson_complete = false;

    targetNumberText.setText("0.0");
    yourNumberText.setText("0.0");
    scoreNumberText.setText("0/0");

    GameOverText.y = -gameHeight * 0.2;

    _gameThis.scene.scene.tweens.killAll();
}

function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}
//=====================================================================================================================================
//=====================================================================================================================================
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import decimal_shooter"]

const instruction = {
    "heading": "Program the maths game where there is a target number and you have to shoot the pears containing the value, add it up to reach the target value each round. There are 3 rounds. If your added value exceeds target number, you lose the round. Win all 3 rounds to win the game.",
    "steps": [{
        "checkbox": true,
        "rescue": true,
        "text": "set total, score, count as 0",
        "title": "Initialize variables",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set win_score as 3",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set number as generate_random_number",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "The following statements should function within the loop",
        "title": "Repeat forever",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "If i_touch_pearl, do statements 1",
        "title": "Shoot Pearl logic",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set val as shoot_pearl",
        "title": "Statements 1",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set total as total + totalValue",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "if total equals number,",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set score as score + 1",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "say \"Congrats Correct!\"",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field></block></next></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "wait for 3 sec",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value></block></next></block></next></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "reset_pearl",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set number as generate_random_number",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"><next><block type=\"variable_holder\" id=\":P7p#4K+U!,i4Ek,66~C\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"2Rr4o.:s;l1@_l-9{A#V\"></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set count as count + 1",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"><next><block type=\"variable_holder\" id=\":P7p#4K+U!,i4Ek,66~C\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"2Rr4o.:s;l1@_l-9{A#V\"></block></value><next><block type=\"variable_holder\" id=\"iXUxsV,bMBAmQ}k!4^C8\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"MiY}s+MoV$BPMM)a+2@a\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"P-GBrvTM@=tHWf#L[WkY\"><field name=\"Options\">option2</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"_u3v3tcgy|Ymf~^y0o*o\"><field name=\"NUM\">1</field></block></value></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "set total as 0",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"><next><block type=\"variable_holder\" id=\":P7p#4K+U!,i4Ek,66~C\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"2Rr4o.:s;l1@_l-9{A#V\"></block></value><next><block type=\"variable_holder\" id=\"iXUxsV,bMBAmQ}k!4^C8\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"MiY}s+MoV$BPMM)a+2@a\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"P-GBrvTM@=tHWf#L[WkY\"><field name=\"Options\">option2</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"_u3v3tcgy|Ymf~^y0o*o\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"variable_holder\" id=\"yg$b;fF=%`2,#aKu[_,=\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"B_9C%vYy:;|PxNaAto[=\"><field name=\"NUM\">0</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "If is_game_running, do statements 2",
        "title": "Game run logic",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"><next><block type=\"variable_holder\" id=\":P7p#4K+U!,i4Ek,66~C\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"2Rr4o.:s;l1@_l-9{A#V\"></block></value><next><block type=\"variable_holder\" id=\"iXUxsV,bMBAmQ}k!4^C8\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"MiY}s+MoV$BPMM)a+2@a\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"P-GBrvTM@=tHWf#L[WkY\"><field name=\"Options\">option2</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"_u3v3tcgy|Ymf~^y0o*o\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"variable_holder\" id=\"yg$b;fF=%`2,#aKu[_,=\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"B_9C%vYy:;|PxNaAto[=\"><field name=\"NUM\">0</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement><next><block type=\"controls_if\" id=\"3tWL@0U?E0[D;BB]}Efw\"><value name=\"IF0\"><block type=\"game_started\" id=\"OGZ*?R.8rf1c1o%)}:TP\"></block></value></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "If total is greater than number, say \"Oops wrong\", end_game",
        "title": "Statements 2",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"><next><block type=\"variable_holder\" id=\":P7p#4K+U!,i4Ek,66~C\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"2Rr4o.:s;l1@_l-9{A#V\"></block></value><next><block type=\"variable_holder\" id=\"iXUxsV,bMBAmQ}k!4^C8\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"MiY}s+MoV$BPMM)a+2@a\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"P-GBrvTM@=tHWf#L[WkY\"><field name=\"Options\">option2</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"_u3v3tcgy|Ymf~^y0o*o\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"variable_holder\" id=\"yg$b;fF=%`2,#aKu[_,=\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"B_9C%vYy:;|PxNaAto[=\"><field name=\"NUM\">0</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement><next><block type=\"controls_if\" id=\"3tWL@0U?E0[D;BB]}Efw\"><value name=\"IF0\"><block type=\"game_started\" id=\"OGZ*?R.8rf1c1o%)}:TP\"></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"Jm[V7q),q|L3*4fwKOco\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"7/,KdOAonbHbAmX1;UCb\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables\" id=\"X12~,qru8q?yx6rea)u*\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\",){?6~Tx37syA07!B=*0\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"Y/-tUSFBTE@RYw_zY7i;\"><field name=\"string\">Oops, Wrong!</field><next><block type=\"end_game\" id=\"]50;7XVJ=gzr+PK6-3!9\"></block></next></block></statement></block></statement></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "If count equals win_score, end_game",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"variable_holder\" id=\"+g^PCDWEXr,qQL6wlhr{\" x=\"-431\" y=\"-338\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"@a3ar}JPe=o(=C|No%p}\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"rb}U/9Aa{LR.seO?Cv{a\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_number\" id=\"jn~fT.DH!L@ok$l2rCa^\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"#C#hweC8HArfrKpp6[SN\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_number\" id=\"nbWwoTj/x4f|2ELSopeS\"><field name=\"NUM\">0</field></block></value><next><block type=\"variable_holder\" id=\"a8J8$7)P%I9u8R2oIgHE\"><field name=\"Variable name\">option5</field><value name=\"NAME\"><block type=\"math_number\" id=\"z~@Bzhq;Z).r`AD66#(W\"><field name=\"NUM\">3</field></block></value><next><block type=\"variable_holder\" id=\"8~d2Mi#qU!#uv0W2_uDP\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"aX)LI5YrjLXCQP6uc@!!\"></block></value><next><block type=\"forever_repeat_block\" id=\"]3rNnf[`+JWCEvV={MEZ\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"gxoJWgR~Cvp5k[UIg7vk\"><value name=\"IF0\"><block type=\"i_touch_pearl\" id=\"T,cP.PVYc~@FKXQ@Nc(]\"></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"x}]^x+,UP_(h2aWv5$#h\"><field name=\"Variable name\">option6</field><value name=\"NAME\"><block type=\"shoot_pearl\" id=\"{BurF8B}H-%]+~DO)X%(\"></block></value><next><block type=\"variable_holder\" id=\"%IA3QC,MQk^gW|@7L1H4\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"9HCoW/_VV;yrWi:IiExI\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"^#1Wff=Y3dj,.U2Ya2q:\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Qe3s#[!e3g/~Umq-+~kr\"><field name=\"Options\">option6</field></block></value></block></value><next><block type=\"controls_if\" id=\"JVZADLL*^P|{;aK$ALwl\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"fh]#1Ch]T.h$f}^eO%-r\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Mj6l@?IuZkw,B!.3Y$yg\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"0LQP,sm{kmteHcb%7X(_\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"variable_holder\" id=\"uNE?78`a`2ym#qGA}Mz6\"><field name=\"Variable name\">option3</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"r*hP,d)T17e.fY#=;|g7\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"Z:wv$^=e6%7E_AIUAwV!\"><field name=\"Options\">option3</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"%$dn!R{BZ]|fn4K+,~Bs\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"say_block\" id=\"9~Mz?Q~f}46Kl2YcC4(W\"><field name=\"string\">Congrats Correct!</field><next><block type=\"wait_block\" id=\"t;PjUo#^`m|)S!_(?3S`\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"cSW,7cKq7JVi%SFJeX64\"><field name=\"NUM\">3</field></block></value><next><block type=\"reset_pearl\" id=\"LsfUGsT_ipOh?BW1ZA.*\"><next><block type=\"variable_holder\" id=\":P7p#4K+U!,i4Ek,66~C\"><field name=\"Variable name\">option4</field><value name=\"NAME\"><block type=\"generate_number\" id=\"2Rr4o.:s;l1@_l-9{A#V\"></block></value><next><block type=\"variable_holder\" id=\"iXUxsV,bMBAmQ}k!4^C8\"><field name=\"Variable name\">option2</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"MiY}s+MoV$BPMM)a+2@a\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"P-GBrvTM@=tHWf#L[WkY\"><field name=\"Options\">option2</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"_u3v3tcgy|Ymf~^y0o*o\"><field name=\"NUM\">1</field></block></value></block></value><next><block type=\"variable_holder\" id=\"yg$b;fF=%`2,#aKu[_,=\"><field name=\"Variable name\">option1</field><value name=\"NAME\"><block type=\"math_number\" id=\"B_9C%vYy:;|PxNaAto[=\"><field name=\"NUM\">0</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement><next><block type=\"controls_if\" id=\"3tWL@0U?E0[D;BB]}Efw\"><value name=\"IF0\"><block type=\"game_started\" id=\"OGZ*?R.8rf1c1o%)}:TP\"></block></value><statement name=\"DO0\"><block type=\"controls_if\" id=\"Jm[V7q),q|L3*4fwKOco\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"7/,KdOAonbHbAmX1;UCb\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables\" id=\"X12~,qru8q?yx6rea)u*\"><field name=\"Options\">option1</field></block></value><value name=\"B\"><block type=\"variables\" id=\",){?6~Tx37syA07!B=*0\"><field name=\"Options\">option4</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"Y/-tUSFBTE@RYw_zY7i;\"><field name=\"string\">Oops, Wrong!</field><next><block type=\"end_game\" id=\"]50;7XVJ=gzr+PK6-3!9\"></block></next></block></statement><next><block type=\"controls_if\" id=\"R_8!z-^3V,FCypG;B}Nz\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"W.edQag5[#.X;$T[YV}}\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"}(I=jf/+04y30?5:{0bE\"><field name=\"Options\">option2</field></block></value><value name=\"B\"><block type=\"variables\" id=\"Eb+0,yn!PsVv:L-0Pz7n\"><field name=\"Options\">option5</field></block></value></block></value><statement name=\"DO0\"><block type=\"end_game\" id=\"=cM@-yXBxZ0%`#tByt4]\"></block></statement></block></next></block></statement></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>"
    },
    {
        "checkbox": null,
        "rescue": null,
        "text": "Touch the right pearls to shoot it and keep adding value until it reaches target value. If your added value exceeds target number, you lose the round. There are 3 rounds. Win all 3 rounds to win the game.",
        "title": "Instructions to play the game:",
        "workspace": null
    }
    ]
};

//============================================================================================
//========================================EXPORT STATEMENTS=========================================
//========================================DO NOT DELETE===================================
export {
    completedFlag,
    myUpdateFunction,
    // helpCode,
    instruction,
    runCode,
    reset_output,
    reInitValues,
    say,
    set_total,
    set_count,
    set_score,
    set_number,
    generate_number,
    i_touch_pearl,
    reset_pearl,
    shoot_pearl,
    getNoOfBlocks,
    repeat_forever_flag,
    updateImports,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    game_started
}