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

let timer = 0;
let _gameThis = null;
const baseURL = "../img/images/b4b92f4d-5149-491e-b652-f1e9c83cb858";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const mosquitoSpeed = 3;
let default_ = 0;
const spritesElement = {
    mosquitoSprites: { x: gameWidth / 2, y: gameHeight / 2, stayAt: 0, frameWidth: 49, frameHeight: 53, frameFrom: 0, frameTo: 4, frameRate: 10, deadFrame: 5 },
    batSprites: { x: 200, y: gameHeight / 2, stayAt: 1, frameWidth: 484, frameHeight: 427, frameFrom: 0, frameTo: 3, frameRate: 10, scale: 0.8 }
}

let game_is_over = false;

const GAME_CONSTANT = {
    images: {
        mosquitoHuntBG: "mosquitoHuntBG",
        speechBubble: "speechBubble"
    },
    spritesImages: {
        mosquitoSprites: "mosquitoSprites",
        batSprites: "batSprites"
    }
};
const INCORRECT_MESSAGE = 'Time up!!!';
const CORRECT_MESSAGE = 'You have killed all the mosquitos.';

let _oMSPhaserLib;
let speechBubble;
let speechText;
const totalMosquito = 5;
let killedMosquito = 0;
let healthValue = 50;
let healthReduceBy = 1;
let healthIncreaseBy = 3;
let timerValue = 30;
let timerReduceBy = 1;
let canShowHealth = false;
let canShowTimer = false;
let canHideMosquitoOnTouch = false;
let canShowGameOverMsg = false;
let timerInterval = null;
// let isMosquitoHitByBat = false;
window['isMosquitoHitByBat'] = false;
let health = 0;
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
    initSpeechBubble();

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
            _gameThis[element].visible = false;
        }
    }

    const mosquitoSprites = spritesImages.mosquitoSprites;
    for (let i = 1; i < totalMosquito; i++) {
        const element = mosquitoSprites;
        const elementValue = spritesElement[mosquitoSprites];

        _gameThis[element + i] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
        _gameThis[element + i].visible = false;
        _gameThis[element + i].x = Math.round(gameWidth * Math.random());
        _gameThis[element + i].y = 200 + Math.round((gameHeight - 400) * Math.random());
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

// Display element by name
function displayElementByName(value, healthVal, timerVal) {
    // healthValue = parseInt(healthVal) || 50;
    // timerValue = parseInt(timerVal) || 30;

    switch (value) {
        case 'health':
            canShowHealth = true;
            break;
        case 'timer':
            canShowTimer = true;
            break;
    }

    updateHealthAndTimer();
    startTimer();
}

// Update health and timer
function updateHealthAndTimer() {
    let speachTextVal = '';
    if (canShowHealth)
        speachTextVal += 'Health: ' + healthValue;
    if (canShowTimer)
        speachTextVal += (canShowHealth ? ', ' : '') + 'Timer: ' + timerValue;

    if (canShowHealth || canShowTimer) {
        speechBubble.alpha = speechText.alpha = 1;
        createDialogue(speachTextVal);
    }
}

// Initialize animation functions
async function init() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementNameBat = spritesImages.batSprites;
    let oTargetBat = _gameThis[elementNameBat];
    let elementValueBat = spritesElement.batSprites;
    let angle = 0.25;

    oTargetBat.visible = true;
    _oMSPhaserLib.stopSpriteAt(oTargetBat, elementNameBat, elementValueBat.stayAt);
    oTargetBat.setOrigin(0.46, 0.28);
    oTargetBat.scale = elementValueBat.scale;

    let elementNameMosquito = spritesImages.mosquitoSprites;
    let oTargetMosquito = _gameThis[elementNameMosquito];
    let elementValueMosquito = spritesElement.mosquitoSprites;

    for (let i = 0; i < totalMosquito; i++) {
        if (i > 0)
            oTargetMosquito = _gameThis[elementNameMosquito + i];

        oTargetMosquito.visible = true;
        _oMSPhaserLib.spriteAnimation(oTargetMosquito, elementNameMosquito, elementValueMosquito.frameFrom, elementValueMosquito.frameTo, elementValueMosquito.frameRate);

        mosquitoRandomMove(oTargetMosquito);
        oTargetMosquito.setInteractive();
        oTargetMosquito.on('pointerdown', async function (pointer, x, y, event) {
            window['isMosquitoHitByBat'] = true;
            this.x = pointer.position.x;
            this.y = pointer.position.y;
            await moveBat({ x: pointer.position.x, y: pointer.position.y });
            _oMSPhaserLib.stopSpriteAt(this, elementNameMosquito, elementValueMosquito.deadFrame);
            setTimeout((oDeadMosquito) => {
                canHideMosquitoOnTouch && oDeadMosquito.destroy();
                killedMosquito++;
                /* healthValue += healthIncreaseBy;
                updateHealthAndTimer(); */
                if (killedMosquito == totalMosquito) {
                    gameOver();
                    M.toast({ html: CORRECT_MESSAGE });
                }
            }, 200, this);
        });
    }
}

// Move bat to the position of mosquito
async function moveBat(position) {
    let elementName = GAME_CONSTANT.spritesImages.batSprites;
    let oTarget = _gameThis[elementName];
    let distance = _oMSPhaserLib.distanceBetweenPoints(oTarget.x, oTarget.y, position.x, position.y);
    let duration = distance * 0.7; // 500;
    duration = duration > 500 ? 500 : duration;
    await _oMSPhaserLib.moveOneByOneToXY(oTarget, position.x, position.y, duration);
}

// Set mosquito random movement
function mosquitoRandomMove(oTarget) {
    let x = Math.round(gameWidth * Math.random());
    let y = 200 + Math.round((gameHeight - 400) * Math.random());
    let distance = _oMSPhaserLib.distanceBetweenPoints(oTarget.x, oTarget.y, x, y);
    let duration = 50 / mosquitoSpeed * distance;
    let angle = _oMSPhaserLib.angleBetweenPoints(oTarget.x, oTarget.y, x, y);

    oTarget.rotation = angle - Math.PI / 2;
    _oMSPhaserLib.moveToXY(oTarget, x, y, duration);

    setTimeout((oTarget) => {
        mosquitoRandomMove(oTarget);
    }, duration, oTarget);
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scaleX = 0.3;
    speechBubble.scaleY = 0.25;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 100;
    speechBubble.y = 40;
    speechBubble.setOrigin(0);
    const padding = 20;

    let speechTextWidth = speechBubble.width * speechBubble.scale - padding;
    speechText = _gameThis.add.text(0, 0, 'Health: 50, Timer: 30', {
        font: '28pt arial',
        color: '#000000',
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true }
    });
    speechText.x = speechBubble.x + (speechBubble.width * speechBubble.scale - speechText.width) / 2 + padding / 2;
    speechText.y = speechBubble.y + (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
    speechBubble.alpha = speechText.alpha = 0;
}

// Create dialogue
function createDialogue(dialogue) {
    speechText.text = dialogue;
}

// Enable mosquito hiding on touch
function hideMosquitoOnTouch() {
    canHideMosquitoOnTouch = true;
}

// Update canShowGameOverMsg to show the game over message
function showGameOverMsg() {
    canShowGameOverMsg = true;
    gameOver();
}

// Update healthIncreaseBy variable
function increaseHealthBy(sign, value) {
    if (sign == '+')
        healthIncreaseBy = parseInt(value);
    else
        healthIncreaseBy = -parseInt(value);

    healthValue += healthIncreaseBy;
    updateHealthAndTimer();
}

// Stop timer
function stopTimer() {
    timerInterval && clearInterval(timerInterval);
}

// Start timer
function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        healthValue--;
        timerValue--;
        updateHealthAndTimer();
        if (timerValue <= 0) {
            gameOver();
            M.toast({ html: INCORRECT_MESSAGE });
            game_is_over = true;
        }
    }, 1000);
}

// Function to add game over text
function gameOver() {
    stopTimer();
    _gameThis.scene.pause();
    // if (canShowGameOverMsg) {
    let text = _gameThis.add.text(gameWidth / 2, gameHeight / 2, 'Game Over', {
        fontFamily: 'Arial',
        fontSize: '20em',
        color: '#f0f0f0 ',
        shadow: { offsetX: 0, offsetY: 0, color: '#000', fill: true, blur: 40 }
    });
    text.setOrigin(0.5, 0.5);
    _oMSPhaserLib.bringOnTop(text);

    game_is_over = true;
    // }
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    game_is_over = false;
    killedMosquito = 0;
    healthValue = 0;
    timerValue = 0;
    canShowHealth = false;
    canShowTimer = false;
    canHideMosquitoOnTouch = false;
    canShowGameOverMsg = false;
    window['isMosquitoHitByBat'] = false;
    stopTimer();
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
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
        }, 500);
        setTimeout(() => {
            repeat_forever_flag = true;
        }, 1000);
    } catch (b) { alert(b) }
    // try {
    //     if (tour.getCurrentStep().options.title.includes("Run")) {
    //         let btns = document.querySelectorAll('.shepherd-button');
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="BChs[87}Rh#_cK0Y7f=_" x="39" y="83"><field name="Variable name">healthValue</field><value name="NAME"><block type="math_number" id="%4keyWJFqnqig]MLV_`F"><field name="NUM">50</field></block></value><next><block type="set_variable_holder" id="HVg0]Ff+H$X0HRoaSi?Q"><field name="Variable name">timerValue</field><value name="NAME"><block type="math_number" id="jB4xt*0{kS:YMzx3OcDi"><field name="NUM">30</field></block></value><next><block type="show_variable_block" id=",c[99{|bOdq5MowonI)}"><field name="NAME">health</field><next><block type="show_variable_block" id="NvrkHQD?^Xhjkl1e}_O2"><field name="NAME">timer</field><next><block type="forever_repeat_block" id="xP~m1|Ei4,RQf2{Ifzzp"><statement name="NAME"><block type="controls_if" id="xRA=m2D(sAua7V9B|H6L"><value name="IF0"><block type="pointertouch__block" id="j9GealsiBsLFO.+3!cBm"><field name="options2">mosquito</field></block></value><statement name="DO0"><block type="change_variable_holder" id=":cSvG]s42DEy*|BZo(V~"><field name="Variable name">healthValue</field><value name="NAME"><block type="math_number" id="/}Q6jVrO5tu.T=)+s-~U"><field name="NUM">5</field></block></value><next><block type="hide_block" id=";|9vw}@n6$-v.aM:PWmL"><field name="NAME">option1</field></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="BChs[87}Rh#_cK0Y7f=_" x="39" y="83"><field name="Variable name">healthValue</field><value name="NAME"><block type="math_number" id="%4keyWJFqnqig]MLV_`F"><field name="NUM">50</field></block></value><next><block type="set_variable_holder" id="HVg0]Ff+H$X0HRoaSi?Q"><field name="Variable name">timerValue</field><value name="NAME"><block type="math_number" id="jB4xt*0{kS:YMzx3OcDi"><field name="NUM">30</field></block></value><next><block type="show_variable_block" id=",c[99{|bOdq5MowonI)}"><field name="NAME">health</field><next><block type="show_variable_block" id="NvrkHQD?^Xhjkl1e}_O2"><field name="NAME">timer</field><next><block type="forever_repeat_block" id="xP~m1|Ei4,RQf2{Ifzzp"><statement name="NAME"><block type="controls_if" id="xRA=m2D(sAua7V9B|H6L"><value name="IF0"><block type="pointertouch__block" id="j9GealsiBsLFO.+3!cBm"><field name="options2">mosquito</field></block></value><statement name="DO0"><block type="change_variable_holder" id=":cSvG]s42DEy*|BZo(V~"><field name="Variable name">healthValue</field><value name="NAME"><block type="math_number" id="/}Q6jVrO5tu.T=)+s-~U"><field name="NUM">5</field></block></value><next><block type="hide_block" id=";|9vw}@n6$-v.aM:PWmL"><field name="NAME">option1</field></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></xml>';

// function myUpdateFunction(a) {
//     var code = Blockly.Python.workspaceToCode(demoWorkspace);
//     var import_statement = "from mosquito_room_lesson import *\n";
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

const updateImports = ["from mosquito_room_lesson import *"]



export {
    completedFlag,
    // myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    // isMosquitoHitByBat,
    increaseHealthBy,
    displayElementByName,
    showGameOverMsg,
    hideMosquitoOnTouch,
    healthValue,
    timerValue,
    health,
    timer,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
}