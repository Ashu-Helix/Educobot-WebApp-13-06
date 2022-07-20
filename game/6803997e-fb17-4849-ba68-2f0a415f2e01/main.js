import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

// import { CANVAS, Game, AUTO } from "phaser";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;


let _gameThis = null;
const baseURL = "../img/images/ed897b4e-3959-40f5-a926-018643a5b99b";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

let game_is_over = false;

const spritesElement = {
    beaver: { x: 420, y: 650, stay: 0, frameWidth: 354, frameHeight: 389, frameFrom: 0, frameTo: 9, frameRate: 8, repeat: -1 },
    hammer: { x: 1300, y: 500, stay: 0, frameWidth: 650, frameHeight: 617, frameFrom: 0, frameTo: 7, frameRate: 16, repeat: 0 }
}

const beaverPos = [
    { x: 420, y: 650 },
    { x: 725, y: 514 },
    { x: 1030, y: 600 },
    { x: 1350, y: 530 },
    { x: 1623, y: 630 },
    { x: 1314, y: 800 },
    { x: 756, y: 800 }
]

const hammerPos = [
    { x: 250, y: 350, r: 0 },
    { x: 550, y: 220, r: 0 },
    { x: 850, y: 290, r: 0 },
    { x: 1180, y: 250, r: 0 },
    { x: 1450, y: 320, r: 0 },
    { x: 1150, y: 490, r: 0 },
    { x: 580, y: 490, r: 0 }
]


const GAME_CONSTANT = {
    images: {
        whackBG: "whackBG",
        bang: "bang"
    },
    spritesImages: {
        beaver: "beaver",
        hammer: "hammer"
    }
};
const ERROR_MESSAGE = 'Error Message: <Write error message here>';
const CORRECT_MESSAGE = 'Correct Message: <Write correct message here>';


let _oMSPhaserLib;
let randomNo = 0;
let isBeaverClick = false;
// let window['isBeaverHitHammer'] = false;
window['isBeaverHitHammer'] = false;
// let scorePoints = 0;
window['scorePoints'] = 0;
// let addScoreValue = 0;
window['addScoreValue'] = 0;
let molePosNo = 0;
let canRandom = false;
let canAnimalShow = false;
let canHammerShow = false;
let maxScore = 20;
let isEndAllBlock = false;
let canHideAnimal = false;
let waitTime = 100;

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
            debug: false
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

// Phaser preload function
function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);

    // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
    _oMSPhaserLib = new MSPhaserLib(this, false, 100);
    loadImages();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis[element] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
        }
    }
    _gameThis[GAME_CONSTANT.images.bang].visible = false;
    _gameThis[GAME_CONSTANT.images.bang].setDepth(101);

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.physics.add.sprite(elementValue.x, elementValue.y, element);
            // _gameThis[element].visible = false;
        }
    }
    _gameThis[GAME_CONSTANT.spritesImages.beaver].setDepth(102);

    init();
}

// Phaser update function
function update() {

}

// Load images
function loadImages() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element, "" + element + ".png");
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis.load.spritesheet(element, "" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

// Initialize animation functions
function init() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let beaver = spritesImages.beaver;
    let oBeaver = _gameThis[beaver];
    let beaverValue = spritesElement.beaver;

    let hammer = spritesImages.hammer;
    let oHammer = _gameThis[hammer];
    let hammerValue = spritesElement.hammer;

    //_oMSPhaserLib.spriteAnimation(oBeaver, beaver, beaverValue.frameFrom, beaverValue.frameTo, beaverValue.frameRate, beaverValue.repeat);

    //_oMSPhaserLib.bringOnTop(oBeaver);
    //oBeaver.visible = false;
    oBeaver.setInteractive();
    oBeaver.on('pointerdown', function (pointer, x, y, event) {
        // console.log(isBeaverClick, oBeaver.anims.isPlaying)
        if (canAnimalShow) {
            if (!isBeaverClick && oBeaver.anims.isPlaying) {
                isBeaverClick = true;
                window['isBeaverHitHammer'] = true;
                fnAddClickOnBeaver(pointer, x, y);
            }
        }
    });

    // below code for hammer sprite animation to play animation on animal click
    _gameThis.anims.create({
        key: 'hammer',
        frames: _gameThis.anims.generateFrameNumbers(GAME_CONSTANT.spritesImages.hammer, { start: spritesElement.hammer.frameFrom, end: spritesElement.hammer.frameTo }),
        frameRate: spritesElement.hammer.frameRate,
        repeat: spritesElement.hammer.repeat
    });

    oHammer.visible = false; // set the hammer visibility on game stage
    oHammer.scale = 0.8;

    // below line for add the text on game stage
    _gameThis['scorePoint'] = _gameThis.add.text(800, 20, 'Point: 0', {
        fontFamily: 'Arial',
        fontSize: '50px',
        color: '#000',
        shadow: { offsetX: 0, offsetY: 0, color: '#000', fill: true, blur: 5 }
    });

    _gameThis['scorePoint'].visible = false;

    fnStart();
}

// function use to start the animal animation and its event
function fnStart() {
    // add event on animal
    _gameThis[GAME_CONSTANT.spritesImages.beaver].on('animationrepeat', () => {
        isBeaverClick = false;
        randomNo = fnRandomNo();
        changePosBeaver(randomNo);
    });

    // add event on hammer
    _gameThis[GAME_CONSTANT.spritesImages.hammer].on('animationcomplete', async () => {
        isBeaverClick = false;
        randomNo = fnRandomNo();
        _gameThis[GAME_CONSTANT.spritesImages.hammer].visible = false;
        _gameThis[GAME_CONSTANT.images.bang].visible = false;
        // _gameThis['scorePoint'].setText('Point: ' + (scorePoints += addScoreValue));

        if ((window['scorePoints'] >= maxScore) && isEndAllBlock) {
            fnGameOverText();
        }
        await sleep(waitTime);

        if (canHideAnimal) {
            _gameThis[GAME_CONSTANT.spritesImages.beaver].visible = false;
            changePosBeaver(randomNo);
            _gameThis[GAME_CONSTANT.spritesImages.beaver].anims.restart();
            _gameThis[GAME_CONSTANT.spritesImages.beaver].visible = true;
        }
    });

    fnShowAnimalOrHammer("hammer");
}

function fnShowAnimal() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let beaver = spritesImages.beaver;
    let oBeaver = _gameThis[beaver];
    let beaverValue = spritesElement.beaver;

    _oMSPhaserLib.spriteAnimation(oBeaver, beaver, beaverValue.frameFrom, beaverValue.frameTo, beaverValue.frameRate, beaverValue.repeat);
}

// function to use for change the animal position
async function changePosBeaver(Pos) {
    _gameThis[GAME_CONSTANT.spritesImages.beaver].x = beaverPos[Pos].x;
    _gameThis[GAME_CONSTANT.spritesImages.beaver].y = beaverPos[Pos].y;
}

// function to use for change the hammer position
function changePosHammer(Pos) {
    _gameThis[GAME_CONSTANT.spritesImages.hammer].x = hammerPos[Pos].x;
    _gameThis[GAME_CONSTANT.spritesImages.hammer].y = hammerPos[Pos].y;
    _gameThis[GAME_CONSTANT.spritesImages.hammer].rotation = ((Math.PI / 2) * hammerPos[Pos].r);
}

function bothPosChange(pos) {
    changePosBeaver(pos);
    changePosHammer(pos);
}

// function to use the randow number for set the animal position as randomaly
function fnRandomNo() {
    let _no = 0;
    if (canRandom) {
        _no = Math.floor(Math.random() * 7);
    } else {
        if (molePosNo == 6)
            molePosNo = -1;
        _no = molePosNo += 1;
    }

    canRandom = false;
    return _no;
}

// function to handle the behaviour of animal and hammer animation when user click on animal
function fnAddClickOnBeaver(_pointer, _x, _y) {
    if (canHammerShow) {
        // let beaver = _gameThis[GAME_CONSTANT.spritesImages.beaver];
        let hammer = _gameThis[GAME_CONSTANT.spritesImages.hammer];
        // beaver.anims.pause(beaver.anims.currentAnim.frames[4]);
        hammer.visible = true;
        hammer.x = hammerPos[randomNo].x;
        hammer.y = hammerPos[randomNo].y;
        hammer.anims.play(GAME_CONSTANT.spritesImages.hammer);

        let bang = _gameThis[GAME_CONSTANT.images.bang];
        bang.visible = true;
        bang.x = hammerPos[randomNo].x + 100;
        bang.y = hammerPos[randomNo].y + 220;
    }
}

// function to show or hide the animal and hammer 
function fnShowOrHide(_objName, _isShow) {
    let spritesImages = GAME_CONSTANT.spritesImages;
    _gameThis[_objName].visible = _isShow;
    if (_objName == spritesImages.beaver) {
        let beaver = spritesImages.beaver;
        let oBeaver = _gameThis[beaver];
        let beaverValue = spritesElement.beaver;

        _oMSPhaserLib.spriteAnimation(oBeaver, beaver, beaverValue.frameFrom, beaverValue.frameTo, beaverValue.frameRate, beaverValue.repeat);
    }
}

function reset_for_update() {
    window['isBeaverHitHammer'] = false;
}

// function to add game over text
function fnGameOverText() {
    setTimeout(() => {
        let spritesImages = GAME_CONSTANT.spritesImages;
        let beaver = spritesImages.beaver;
        let oBeaver = _gameThis[beaver];
        let hammer = spritesImages.hammer;
        let oHammer = _gameThis[hammer];
        oBeaver.visible = false;
        oHammer.visible = false;

        _gameThis.scene.pause();
        let text = _gameThis.add.text(gameWidth / 2, gameHeight / 2, 'You Won!', {
            fontFamily: 'Arial',
            fontSize: '20em',
            color: '#f00',
            shadow: { offsetX: 0, offsetY: 0, color: '#fff', fill: true, blur: 40 }
        });
        text.setOrigin(0.5, 0.5);
        _oMSPhaserLib.bringOnTop(text);
        game_is_over = true;
    }, 500);
}

// for use to check the mole is show randomly or not
function fnShowRandomMole() {
    canRandom = true;
    fnShowAnimalOrHammer("animal");
}

// for use to show or hide, animal or hammer
function fnShowAnimalOrHammer(_str) {
    if (_str == 'animal') {
        canAnimalShow = true;
        fnShowAnimal();
    }
    if (_str == 'hammer') {
        canHammerShow = true;
    }
}

// for use to show or hide the point text
function fnShowPoints(_str) {
    if (_str == 'score') {
        _gameThis['scorePoint'].visible = true;
    } else {
        _gameThis['scorePoint'].visible = false;
    }
}
// for use to set the score value
function fnAddScoreValue(_value) {
    if (_value != undefined && !isNaN(_value)) {
        window['addScoreValue'] = parseFloat(_value);
    } else {
        window['addScoreValue'] = 0;
    }

    _gameThis['scorePoint'].setText('Point: ' + Math.round((window['scorePoints'] += window['addScoreValue']) * 100) / 100);
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// function fnSetMaxScore(sign, _maxScore) {
function fnSetMaxScore(_maxScore) {
    // if (_maxScore) {
    maxScore = _maxScore;
    // }
}

function fnSetWaitTime(_time) {
    waitTime = _time;
}

// function fnCheckEndBlock(_isEndAll) {
function fnCheckEndBlock() {
    // if (_isEndAll)
    isEndAllBlock = true;
}

function setInitScore(_score) {
    window['scorePoints'] = _score || 0;
}

function addHideAnimal() {
    canHideAnimal = true;
}

function reInitValues() {
    game_is_over = false;
    randomNo = 0;
    isBeaverClick = false;
    window['isBeaverHitHammer'] = false;
    window['scorePoints'] = 0;
    window['addScoreValue'] = 0;
    molePosNo = 0;
    canRandom = false;
    canAnimalShow = false;
    canHammerShow = false;
    maxScore = 20;
    isEndAllBlock = false;
    waitTime = 100;
    canHideAnimal = false;
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    reInitValues();
    window.LoopTrap = 1E3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
    try {
        eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
        }, 1500);
        setTimeout(() => {
            repeat_forever_flag = true;
        }, 3000);
    } catch (b) { alert(b) }
    // try {
    //     if (tour.getCurrentStep().options.title.includes("Run")) {
    //         let btns = document.querySelectorAll('.shepherd-button');
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="show_variable_block" id="Up@Zlbh+fXzZj1b,MDI!" x="66" y="61"><field name="NAME">score</field><next><block type="action_block" id="ME:G~6^Z1j+V:2Wul0{e"><next><block type="forever_repeat_block" id="H_-`I-HWU/87I]zgH*aG"><statement name="NAME"><block type="controls_if" id="h|Pf3kro[WH$]_LV}!F8"><value name="IF0"><block type="spritetouch__block" id="%?J7q4-A|~R~p(e;O!}v"><field name="options1">hammer</field><field name="options2">animal</field></block></value><statement name="DO0"><block type="addition_block" id="xekTV?lR-KHIE_.:G_ad"><field name="NAME">score</field><field name="addscorevalue">1</field></block></statement><next><block type="controls_if" id="5+5$2KO=Q@.D{J%I{-_p"><value name="IF0"><block type="compare_block" id="#^WS|MXR/!udY(Pr:Nl2"><field name="NAME">=</field><field name="number">10</field></block></value><statement name="DO0"><block type="end_block" id="S#pHxDE{$8S]S![}-;Jp"></block></statement></block></next></block></statement></block></next></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="show_variable_block" id="Up@Zlbh+fXzZj1b,MDI!" x="66" y="61"><field name="NAME">score</field><next><block type="action_block" id="ME:G~6^Z1j+V:2Wul0{e"><next><block type="forever_repeat_block" id="H_-`I-HWU/87I]zgH*aG"><statement name="NAME"><block type="controls_if" id="h|Pf3kro[WH$]_LV}!F8"><value name="IF0"><block type="spritetouch__block" id="%?J7q4-A|~R~p(e;O!}v"><field name="options1">hammer</field><field name="options2">animal</field></block></value><statement name="DO0"><block type="addition_block" id="xekTV?lR-KHIE_.:G_ad"><field name="NAME">score</field><field name="addscorevalue">1</field></block></statement><next><block type="controls_if" id="5+5$2KO=Q@.D{J%I{-_p"><value name="IF0"><block type="compare_block" id="#^WS|MXR/!udY(Pr:Nl2"><field name="NAME">=</field><field name="number">10</field></block></value><statement name="DO0"><block type="end_block" id="S#pHxDE{$8S]S![}-;Jp"></block></statement></block></next></block></statement></block></next></block></next></block></xml>';

// function myUpdateFunction(a) {
//     var code = Blockly.Python.workspaceToCode(demoWorkspace);
//     var import_statement = "from whack_a_mole import *\n";
//     document.getElementById('pycode').innerHTML = import_statement + code;
//     document.getElementById('modal1').innerHTML = import_statement + code;
// }
// demoWorkspace.addChangeListener(myUpdateFunction);

function completedFlag() {
    return game_is_over;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from whack_a_mole import *"]

export {
    completedFlag,
    // myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    fnGameOverText,
    fnShowPoints,
    fnShowRandomMole,
    // window['isBeaverHitHammer'],
    // animal,
    // hammer,
    fnAddScoreValue,
    update,
    reset_for_update,
    // scorePoints,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
}