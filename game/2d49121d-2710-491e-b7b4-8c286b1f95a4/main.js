// import M from 'materialize-css';
// import {
//     AUTO,
//     Game,
// } from 'phaser';

// import MSPhaserLib from '../msPhaserLib.min';

import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
let is_game_completed = false;

const GAME_CONSTANT = {
    images: {
        cleverCrowBG: "cleverCrowBG"
    },
    spritesImages: {
        potSprites: "potSprites",
        cleverCrowSprite: "cleverCrowSprite"
    }
};
const INCORRECT_MESSAGE = 'Drop pabbel before drinking water.';
const CORRECT_MESSAGE = 'Successfully completed.';


const spritesElement = {
    potSprites: { x: 1230, y: 655, stayAt: 0, frameWidth: 277, frameHeight: 252, frameFrom: 0, frameTo: 4, frameRate: 30, anim: { anim13: 1, anim16: 2, anim19: 3, anim22: 4 } },
    cleverCrowSprite: { x: 1330, y: 680, stayAt: 0, frameWidth: 509, frameHeight: 764, frameFrom: 0, frameTo: 27, frameRate: 1, pabelPickAnim: 10, dropPabel: [14, 16, 19, 22, 23], pabelAnim: 23, drinkWater: { frameFrom: 24, frameTo: 26 }, afterDrinkWater: 27 },
}

let _oMSPhaserLib;
let currentFrameCrow = 0;
let hasDroppedpabel = false;
let hasDrunkWater = false;
let afterDrinkInterval = null;
let isDropping = false;
let pabelCount = 0;

// Phaser config
let config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    canvasStyle: `width: 100%;
    object-fit: revert;
    aspect-ratio: 738 / 436;`,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 },
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
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
    loadImages();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
            _oMSPhaserLib.stopSpriteAt(_gameThis[element], element, elementValue.stayAt);
            // _gameThis[element].visible = false;
        }
    }

    init();
}

// Phaser update function
function update() { }

// Load images
function loadImages() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element, "images/" + element + ".png");
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis.load.spritesheet(element, "images/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

// Initialize animation functions
async function init() {
    // await dropPabel();
    // await sleep(500);
    // drinkWater();
}

// Drink water
async function drinkWater() {
    if (hasDroppedpabel && !hasDrunkWater) {
        let spritesImages = GAME_CONSTANT.spritesImages;
        let elementNameCrow = spritesImages.cleverCrowSprite;
        let oTargetCrow = _gameThis[elementNameCrow];
        let elementValueCrow = spritesElement.cleverCrowSprite;

        hasDrunkWater = true;
        _oMSPhaserLib.spriteAnimation(oTargetCrow, elementNameCrow, elementValueCrow.drinkWater.frameFrom, elementValueCrow.drinkWater.frameTo, elementValueCrow.frameRate, 0);

        clearTimeout(afterDrinkInterval);
        afterDrinkInterval = setTimeout(async () => {
            await sleep(3000);
            afterDrinkWater();
            M.toast({ html: CORRECT_MESSAGE });
            setTimeout(() => { is_game_completed = true; }, 2500)
        }, 500);
    }
    /* else {
      M.toast({ html: INCORRECT_MESSAGE });
    } */
}

// Show crow action after drink water
function afterDrinkWater() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementNameCrow = spritesImages.cleverCrowSprite;
    let oTargetCrow = _gameThis[elementNameCrow];
    let elementValueCrow = spritesElement.cleverCrowSprite;
    _oMSPhaserLib.stopSpriteAt(oTargetCrow, elementNameCrow, elementValueCrow.afterDrinkWater);
}

// Wait till drinking
async function waitDuration(time) {
    if (hasDrunkWater) {
        clearTimeout(afterDrinkInterval);
        await sleep(time);

        afterDrinkWater();
        M.toast({ html: CORRECT_MESSAGE });
    }
}

// Drop pabel and drink water
async function dropPabel() {
    pabelCount++;
    isDropping = true;
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementNameCrow = spritesImages.cleverCrowSprite;
    let oTargetCrow = _gameThis[elementNameCrow];
    let elementValueCrow = spritesElement.cleverCrowSprite;

    let elementNamePot = spritesImages.potSprites;
    let oTargetPot = _gameThis[elementNamePot];
    let elementValuePot = spritesElement.potSprites;
    let pabelAnim = elementValueCrow.dropPabel[pabelCount - 1];
    let waitTime = pabelAnim - currentFrameCrow;

    if (waitTime > 0) {
        let interval = setInterval(() => {
            currentFrameCrow++;
            if (currentFrameCrow <= pabelAnim) {
                _oMSPhaserLib.stopSpriteAt(oTargetCrow, elementNameCrow, currentFrameCrow);

                const potAnimFrame = elementValuePot.anim['anim' + currentFrameCrow];
                if (potAnimFrame)
                    _oMSPhaserLib.stopSpriteAt(oTargetPot, elementNamePot, potAnimFrame);
            } else {
                clearInterval(interval);
            }
        }, 500);

        await sleep(500 * waitTime);
        isDropping = false;
    } else {
        hasDroppedpabel = true;
    }
}

// Re-initialize the game variables
function reInitValues() {
    is_game_completed = false;
    currentFrameCrow = 0;
    hasDroppedpabel = false;
    hasDrunkWater = false;
    isDropping = false;
    pabelCount = 0;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
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
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="?.1;M:QWDG@)8HUMfijU" x="59" y="96"><statement name="NAME"><block type="action_block" id="bP?jnNh~:pd/rI!mduhi"><next><block type="controls_if" id=";IR(;LAz(VF{/;gciUZa"><value name="IF0"><block type="spritetouch__block" id=";rzhdWCH$Jbc$I?YU8OU"><field name="options1">water</field><field name="options2">potLid</field></block></value><statement name="DO0"><block type="drink_block" id="XTiUFisBE!hzpFt}$jB]"><next><block type="wait_block" id="8p]XMWw85`/r+-QUq,{;"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="ApUIp!9a-4dd_dmRjTp)"><field name="NUM">3</field></block></value></block></next></block></statement></block></next></block></statement></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="?.1;M:QWDG@)8HUMfijU" x="59" y="96"><statement name="NAME"><block type="action_block" id="bP?jnNh~:pd/rI!mduhi"><next><block type="controls_if" id=";IR(;LAz(VF{/;gciUZa"><value name="IF0"><block type="spritetouch__block" id=";rzhdWCH$Jbc$I?YU8OU"><field name="options1">water</field><field name="options2">potLid</field></block></value><statement name="DO0"><block type="drink_block" id="XTiUFisBE!hzpFt}$jB]"><next><block type="wait_block" id="8p]XMWw85`/r+-QUq,{;"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="ApUIp!9a-4dd_dmRjTp)"><field name="NUM">3</field></block></value></block></next></block></statement></block></next></block></statement></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from clever_crow import *\nfrom time import sleep\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function completedFlag() {
    return is_game_completed;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from clever_crow import *", "from time import sleep"]


export {
    completedFlag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    waitDuration,
    // drink_Water,
    hasDroppedpabel,
    // water,
    // potLid,
    dropPabel,
    isDropping,
    updateImports,
    getNoOfBlocks,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    repeat_forever_flag
}