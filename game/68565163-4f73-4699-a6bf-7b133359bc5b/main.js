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
        whereAmIBg: "whereAmIBg",
        speechBubble: 'speechBubble'
    },
    spritesImages: {
        robSpritesheet_1: "robSpritesheet_1",
        robSpritesheet_2: "robSpritesheet_2",
        robSpritesheet_3: "robSpritesheet_3",
        robSpritesheet_4: "robSpritesheet_4",
        copSpritesheet: "copSpritesheet",
    }
};
const INCORRECT_MESSAGE = 'Incorrect coordinates for robber entered';
const CORRECT_MESSAGE = 'Robber ';
const CAUGHT_ALL = 'Congratulations! All the robbers are caught!';



let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const totalRob = 4;

const spriteElement = {
    robSpritesheet_1: { x: 200, stayAt: 0, frameWidth: 403, frameHeight: 363, frameFrom: 0, frameTo: 10, frameRate: 6 },
    robSpritesheet_2: { x: 650, stayAt: 0, frameWidth: 473, frameHeight: 378, frameFrom: 0, frameTo: 10, frameRate: 6 },
    robSpritesheet_3: { x: 1280, stayAt: 0, frameWidth: 461, frameHeight: 386, frameFrom: 0, frameTo: 10, frameRate: 6 },
    robSpritesheet_4: { x: 1725, stayAt: 0, frameWidth: 392, frameHeight: 406, frameFrom: 0, frameTo: 10, frameRate: 6 },
    copSpritesheet: { x: 920, y: 760, stayAt: 0, happyAt: 2, sadAt: 1, frameWidth: 427, frameHeight: 1500, frameFrom: 0, frameTo: 2, frameRate: 6, scale: 0.63 }
}

const hitPoints = [
    { x1: 1, y1: 722, x2: 354, y2: 1071, name: 'robSpritesheet_1' },
    { x1: 434, y1: 717, x2: 792, y2: 1071, name: 'robSpritesheet_2' },
    { x1: 1071, y1: 704, x2: 1460, y2: 1071, name: 'robSpritesheet_3' },
    { x1: 1574, y1: 704, x2: 1902, y2: 1071, name: 'robSpritesheet_4' }
]
let _oMSPhaserLib;
let speechBubble;
let speechText;
let catchedRobber = [];
let run_ = false;
let is_game_completed = false;

// Phaser config
const config = {
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
            gravity: { y: 0 },
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Initialize Phaser with config
const game = new Phaser.Game(config);

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
            const elementValue = spriteElement[element];

            _gameThis[element] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
            _gameThis[element].visible = false;
        }
    }

    _gameThis.input.on("pointerdown", createDialogue);
    _gameThis.input.on("pointermove", createDialogue);
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
            const elementValue = spriteElement[element];

            _gameThis.load.spritesheet(element, "images/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

// Initialize animation functions
async function init() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementName = spritesImages.copSpritesheet;
    let oTarget = _gameThis[elementName];
    let elementValue = spriteElement.copSpritesheet;

    oTarget.x = elementValue.x;
    oTarget.y = elementValue.y;
    oTarget.scale = elementValue.scale;
    oTarget.visible = true;

    for (let i = 1; i <= totalRob; i++) {
        elementName = 'robSpritesheet_' + i;
        oTarget = _gameThis[elementName];
        elementValue = spriteElement[elementName];

        oTarget.x = elementValue.x;
        oTarget.y = gameHeight - elementValue.frameHeight / 2;
        oTarget.visible = true;
    }
    for (let i = 1; i <= totalRob; i++) {
        elementName = 'robSpritesheet_' + i;
        oTarget = _gameThis[elementName];
        elementValue = spriteElement[elementName];

        _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate);
        await sleep(500);
    }
}

// function catchRob(coordinates) {
function catchRob(x, y) {
    if (run_) {
        // console.log(x, y);
        let catchedRob = '';

        for (let i = 0; i < hitPoints.length; i++) {
            const element = hitPoints[i];

            if (element.x1 <= x && x <= element.x2 && element.y1 <= y && y <= element.y2) {
                catchedRob = element.name;
                break;
            }
        }

        if (catchedRobber.indexOf(catchedRob) != -1)
            return;

        const copName = GAME_CONSTANT.spritesImages.copSpritesheet;
        const oCop = _gameThis[copName];
        const copElementValue = spriteElement[copName];

        if (catchedRob != '') {
            catchedRobber.push(catchedRob);
            const elementValue = spriteElement[catchedRob];
            const oTarget = _gameThis[catchedRob];
            _oMSPhaserLib.stopSpriteAt(oTarget, catchedRob, elementValue.stayAt);
            // _oMSPhaserLib.fadeOut(oTarget, 3000);

            _oMSPhaserLib.stopSpriteAt(oCop, copName, copElementValue.happyAt);
            const robberNum = catchedRob.split('_')[1];
            M.toast({ html: CORRECT_MESSAGE + robberNum + " is caught" });

            if (catchedRobber.length == hitPoints.length)
                if (run_) setTimeout(() => {
                    M.toast({ html: CAUGHT_ALL });
                    is_game_completed = true;
                }, 1000);
        } else {
            if (run_) _oMSPhaserLib.stopSpriteAt(oCop, copName, copElementValue.sadAt);
            M.toast({ html: INCORRECT_MESSAGE });
        }

        if (run_) setTimeout(() => {
            _oMSPhaserLib.stopSpriteAt(oCop, copName, copElementValue.stayAt);
        }, 2000);
    }
}

// Initialize speech bubble
function initSpeechBubble() {

    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.25;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 50;
    speechBubble.y = 50;
    speechBubble.setOrigin(0);

    let speechTextWidth = speechBubble.width * speechBubble.scale - 50;
    speechText = _gameThis.add.text(0, 0, 'x: 1920, y: 1080', {
        font: '28pt arial',
        color: '#000000',
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true }
    });
    speechText.x = speechBubble.x + (speechBubble.width * speechBubble.scale - speechText.width) / 2;
    speechText.y = speechBubble.y + (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
}

// Create dialogue
function createDialogue(pointer) {
    console.log(pointer.x)
    speechText.text = 'x: ' + Math.round(pointer.x) + ', y: ' + Math.round(pointer.y);
    speechText.x = speechBubble.x + (speechBubble.width * speechBubble.scale - speechText.width) / 2;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    catchedRobber = [];
    run_ = false;
    is_game_completed = false;
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

function completedFlag() {
    return is_game_completed;
}

function runCode() {
    // tour_over && tour.complete();
    reset_output();
    setTimeout(() => {
        run_ = true;
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            eval(a);
        } catch (b) { alert(b) }
        // try {
        //     //Shepherd goes into next 
        //     if (tour.getCurrentStep().options.title.includes("Run")) {
        //         let btns = document.querySelectorAll('.shepherd-button');
        //         btns[btns.length - 1].click();
        //     }
        // } catch {}
    }, 1000)
}

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="oXYJ0ycCgwNlC?|evVNV" x="104" y="72"><value name="NAME"><block type="xy" id="Hk}mLt,MgOHrpp61osb."><field name="x_coordinate">136</field><field name="y_coordinate">804</field></block></value><next><block type="wait_block" id="(de?Qv/51ioOFXT]jM?0"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Ai9|75)AK)w{Rn3D:`iG"><field name="NUM">2</field></block></value><next><block type="catch_block" id="9[C7:y~whk4C5-1s_%{*"><value name="NAME"><block type="xy" id="f15v+jkLln{.1k/amb8a"><field name="x_coordinate">685</field><field name="y_coordinate">788</field></block></value><next><block type="wait_block" id="]priHRpfrn56T9d3LBl*"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="%`cn$K6,R6s)s}-~xpuo"><field name="NUM">2</field></block></value><next><block type="catch_block" id="nKOl~Xh^z@dy(RceSIdn"><value name="NAME"><block type="xy" id="wJ/0SR#9Y;V+pOnL[!cj"><field name="x_coordinate">1230</field><field name="y_coordinate">785</field></block></value><next><block type="wait_block" id="_ov!/ZSx;V.:KKwx0rQh"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="J~_P)=zNTmMPa}9FLon:"><field name="NUM">2</field></block></value><next><block type="catch_block" id="ELVQ0^l.xcrb/0!|+ihw"><value name="NAME"><block type="xy" id="9PZ+2W4{tlalTOT~3]wa"><field name="x_coordinate">1690</field><field name="y_coordinate">778</field></block></value><next><block type="wait_block" id="[o`4R{)nqX9:)Wv;vW5*"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="hC#zGFV7^-,s[-|enT-F"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import waterer", "import time"]


export {
    reset_output,
    completedFlag,
    runCode,
    helpCode,
    getNoOfBlocks,
    updateImports
}