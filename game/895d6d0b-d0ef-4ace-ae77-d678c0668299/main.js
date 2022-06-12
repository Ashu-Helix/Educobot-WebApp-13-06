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

const GAME_CONSTANT = {
    images: {
        catchTheFishBG: 'catchTheFishBG',
        fish_1: 'fish_1',
        fish_2: 'fish_2',
        fish_3: 'fish_3',
        fish_4: 'fish_4',
        fish_5: 'fish_5',
        speechBubble: "speechBubble"
    },
    spritesImages: {
        fish_1_pull: 'fish_1_pull',
        fish_2_pull: 'fish_2_pull',
        fish_3_pull: 'fish_3_pull',
        fish_4_pull: 'fish_4_pull',
        fish_5_pull: 'fish_5_pull',
        hook: 'hook'
    }
};
const INCORRECT_MESSAGE = 'There is no fish.';
const CORRECT_MESSAGE = 'You have catched all fishes.';

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const fishSpeed = 2;
const fishAvgHalfWidth = 100;
let dummy = 0;
const spritesElement = {
    fish_1_pull: { x: 1700, y: 300, stay: 0, frameWidth: 207.16, frameHeight: 751, frameFrom: 0, frameTo: 5, frameRate: 5 },
    fish_2_pull: { x: 1675, y: 300, stay: 0, frameWidth: 213, frameHeight: 1080, frameFrom: 0, frameTo: 8, frameRate: 8 },
    fish_3_pull: { x: 1725, y: 300, stay: 0, frameWidth: 151, frameHeight: 1080, frameFrom: 0, frameTo: 10, frameRate: 8 },
    fish_4_pull: { x: 1695, y: 300, stay: 0, frameWidth: 173, frameHeight: 880, frameFrom: 0, frameTo: 6, frameRate: 8 },
    fish_5_pull: { x: 1710, y: 300, stay: 0, frameWidth: 153, frameHeight: 590, frameFrom: 0, frameTo: 4, frameRate: 8 },
    hook: { x: 1720, y: 480, stay: 0, frameWidth: 150, frameHeight: 1080, frameFrom: 0, frameTo: 20, frameRate: 30 }
}
const fishInitPos = {
    fish_1: { x: 803, y: 580, dir: 1 },
    fish_2: { x: 1700, y: 690, dir: 1 },
    fish_3: { x: 119, y: 514, dir: -1 },
    fish_4: { x: 464, y: 284, dir: 1 },
    fish_5: { x: 1275, y: 406, dir: -1 },
}

let _oMSPhaserLib;
let isPlaying = false;
let hookClicked = false;
let activeHook = true;
let activeFish = [];
let hook = null;
let fishCount = 0;
let speechBubble;
let speechText;
let isActiveFishing = false;
let isBlockActiveFishing = false;
let addFishCountBy = 0;
let catchedFishCount = 0
let repeat_forever_flag = true;

// Development testing begin here
// isPlaying = true;
// isActiveFishing = true;
// activeHook = true;
// Development testing end here

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
            _gameThis[element].name = element;
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

    init();
}

// Active hook for pointer event
function addPointerEvent() {
    activeHook = true;
}

// Update fish count
function updateFishCount() {
    fishCount += addFishCountBy;
    catchedFishCount++;
    createDialogue('Fish count: ' + fishCount);
    if (catchedFishCount == activeFish.length) {
        isPlaying = false;
        M.toast({ html: CORRECT_MESSAGE });
    }
}

// Empty hook animation
function emptyHookAnimation() {
    const elementName = 'hook';
    const elementValue = spritesElement[elementName];
    const hook = _gameThis[elementName];
    hook.visible = true;
    /* hook.on('animationcomplete', (hookAnim, hook, a, b) => {
      setTimeout(() => {
        // hook.visible = true;
      }, 100);
    }); */
    _oMSPhaserLib.spriteAnimation(hook, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 0);
}

// Fishing animation
function fishing(index) {
    hook.visible = false;

    const elementName = 'fish_' + index + '_pull';
    const elementValue = spritesElement[elementName];
    const fishPull = _gameThis[elementName];
    fishPull.visible = true;
    fishPull.on('animationcomplete', (fishPullAnim, fishPull, a, b) => {
        setTimeout(() => {
            hook.visible = true;
            _gameThis[fishPull.textureKey].destroy();
        }, 100);
    });
    _oMSPhaserLib.spriteAnimation(fishPull, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 0);
}

// Update all state on catch the fish
function catchTheFish(oFish) {
    hookClicked = false;
    const index = oFish.name.split('fish_')[1];
    oFish.destroy();
    fishing(index);
    updateFishCount();
}

// Check to catch the fish if it is in range on click the hook
function canCatchTheFish(pointer, x, y, event) {
    if (activeHook) {
        hookClicked = true;
        emptyHookAnimation();
    }
}

// Phaser update function
function update() {
    if (isPlaying) {
        moveFish();

        let isCatchedFished = false;
        let catchedFish = getFishTouchesHook();
        if (isActiveFishing && hookClicked && catchedFish) {
            isCatchedFished = true;
            isActiveFishing = false;
            catchTheFish(catchedFish);
        }

        if (!isCatchedFished && isActiveFishing && hookClicked) {
            M.Toast.dismissAll();
            M.toast({ html: INCORRECT_MESSAGE });
        }
        hookClicked = false;
    }
}

function moveFish() {
    for (let i = 0; i < activeFish.length; i++) {
        const element = activeFish[i];
        if (element.x < fishAvgHalfWidth || element.x > gameWidth - fishAvgHalfWidth) {
            element.dir *= -1;
            element.scaleX *= -1;
        }

        /* if (isActiveFishing && hookClicked && element.scene && (gameWidth - element.x) < fishAvgHalfWidth * 4) {
          isCatchedFished = true;
          catchTheFish(element);
        }
        else { */
        element.x += fishSpeed * element.dir;
        // }
    }
}

function getFishTouchesHook() {
    let catchedFish = null;

    for (let i = 0; i < activeFish.length; i++) {
        const element = activeFish[i];
        if (element.scene && (gameWidth - element.x) < fishAvgHalfWidth * 4) {
            catchedFish = element;
            break;
        }
    }

    return catchedFish;
}

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
    isPlaying = true;
    showFishCount('');
    for (const key in fishInitPos) {
        if (Object.hasOwnProperty.call(fishInitPos, key)) {
            const element = fishInitPos[key];

            _gameThis[key].x = element.x;
            _gameThis[key].y = element.y;
            _gameThis[key].dir = element.dir;
            activeFish.push(_gameThis[key]);
        }
    }

    const elementName = 'hook';
    hook = _gameThis[elementName];
    hook.visible = true;
    hook.setInteractive();
    hook.on('pointerdown', canCatchTheFish);
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.22;
    speechBubble.x = (gameWidth - speechBubble.width * speechBubble.scale) / 2;
    speechBubble.y = 10;
    speechBubble.setOrigin(0);

    let speechTextWidth = speechBubble.width * speechBubble.scale;
    speechText = _gameThis.add.text(0, 0, 'Fish count: 0', {
        font: '28pt arial',
        color: '#000000',
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true }
    });
    speechText.x = speechBubble.x + (speechBubble.width * speechBubble.scale - speechText.width) / 2;
    speechText.y = speechBubble.y + (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
    // speechBubble.alpha = speechText.alpha = 0;
}

// Create dialogue
function createDialogue(dialogue) {
    speechText.text = dialogue;
}

// Set variable to add fish count by n number.
function increaseFishCountBy(value) {
    addFishCountBy = value;
}

// Set initial fish count to n.
function initializeFishCount(value) {
    fishCount = value;
}

// Active fishing
function activeFishing() {
    isActiveFishing = isBlockActiveFishing = true;
}

// for use to show or hide the point text
function showFishCount(value) {
    if (value == 'fishCount') {
        speechBubble.visible = true;
        speechText.visible = true;
    } else {
        speechBubble.visible = false;
        speechText.visible = false;
    }
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    hookClicked = false;
    isActiveFishing = false;
    isBlockActiveFishing = false;
    // activeHook = false;
    fishCount = 0;
    addFishCountBy = 0;
    isPlaying = true;
    catchedFishCount = 0;
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

function runCode() {
    // tour_over && tour.complete();
    reInitValues();
    window.LoopTrap = 1E3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
    try {
        // eval(a);
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
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="show_variable_block" id="o9?wI@}%m,5({wylt2Jw" x="67" y="87"><field name="NAME">fishCount</field><next><block type="forever_repeat_block" id="D$Zv$s6mxII_?^C9:qbT"><statement name="NAME"><block type="controls_if" id=";zbX9[sueq_Zdf4|$1+d"><value name="IF0"><block type="spritetouch__block" id="Y]l3U0}2-G$NCF|c$Md)"><field name="options1">fish</field><field name="options2">hook</field></block></value><statement name="DO0"><block type="action_block" id="2lqY+Ze8t~{T~f_udxr%"><next><block type="addition_block" id="jakL]kzr3J7h~%-mwnKu"><field name="NAME">fishCount</field><field name="NAME2">5</field></block></next></block></statement></block></statement></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="show_variable_block" id="o9?wI@}%m,5({wylt2Jw" x="67" y="87"><field name="NAME">fishCount</field><next><block type="forever_repeat_block" id="D$Zv$s6mxII_?^C9:qbT"><statement name="NAME"><block type="controls_if" id=";zbX9[sueq_Zdf4|$1+d"><value name="IF0"><block type="spritetouch__block" id="Y]l3U0}2-G$NCF|c$Md)"><field name="options1">fish</field><field name="options2">hook</field></block></value><statement name="DO0"><block type="action_block" id="2lqY+Ze8t~{T~f_udxr%"><next><block type="addition_block" id="jakL]kzr3J7h~%-mwnKu"><field name="NAME">fishCount</field><field name="NAME2">5</field></block></next></block></statement></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from catch_the_fish import *\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function completedFlag() {
    return catchedFishCount >= 5;
}

function update_top() {
    if (isPlaying) {
        isActiveFishing = isBlockActiveFishing;
        moveFish();
    }
}

function update_bottom() {
    let isCatchedFished = false;
    let catchedFish = getFishTouchesHook();
    if (isActiveFishing && hookClicked && catchedFish) {
        isCatchedFished = true;
        isActiveFishing = false;
        catchTheFish(catchedFish);
    }

    if (!isCatchedFished && isActiveFishing && hookClicked) {
        M.Toast.dismissAll();
        M.toast({ html: INCORRECT_MESSAGE });
    }
    hookClicked = false;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from catch_the_fish import *"]

export {
    completedFlag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    update_top,
    update_bottom,
    // fish,
    hook,
    dummy,
    fishCount,
    activeFishing,
    showFishCount,
    increaseFishCountBy,
    repeat_forever_flag,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    updateImports,
    getNoOfBlocks
}