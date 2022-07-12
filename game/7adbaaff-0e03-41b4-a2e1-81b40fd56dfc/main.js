/* Developed by Marvsoft LLP */
import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Math, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _oMSPhaserLib;
let jumpCount = 0;
let run_ = true;
var sleep_val;
var jump_ok = false;
var lesson_complete = false;

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const correctCounts = 50;
const magicElement = {
    girlSprite: {
        x: 1025,
        y: 770,
        stayAt: 0,
        frameWidth: 760,
        frameHeight: 1358,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
        scale: 0.48,
    },
};

const GAME_CONSTANT = {
    images: {
        healthIsWealthBG: "healthIsWealthBG",
    },
    spritesImages: {
        girlSprite: "girlSprite",
    },
};
const INCORRECT_MESSAGE = "You have entered incorrect number of jumps.";
const CORRECT_MESSAGE = "You have entered correct number of jumps.";

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
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: {
        preload: preload,
        create: create,
    },
};

// Initialize Phaser with config
var game = new Phaser.Game(config);

// Phaser preload function
function preload() {
    console.log("preload");
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);

    // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
    loadImages();
}

// Phaser create function
function create() {
    console.log("create");
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
            const elementValue = magicElement[element];

            _gameThis[element] = _gameThis.add.sprite(
                elementValue.x,
                elementValue.y,
                element
            );
            _gameThis[element].scale = elementValue.scale;
        }
    }

    // init(50);
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
            const elementValue = magicElement[element];
            _gameThis.load.spritesheet(element, "images/" + element + ".png", {
                frameWidth: elementValue.frameWidth,
                frameHeight: elementValue.frameHeight,
            });
        }
    }
}

// Initialize animation functions
function init(totalCounts) {
    jump(totalCounts);
}

// Initialize animation functions
async function jump(totalCounts) {
    if (run_) {
        console.log("jump...");
        // if (totalCounts > 0) {
        let spritesImages = GAME_CONSTANT.spritesImages;
        let elementName = spritesImages.girlSprite;
        let oTarget = _gameThis[elementName];
        let elementValue = magicElement.girlSprite;

        jumpCount++;

        oTarget.visible = true;
        await _oMSPhaserLib.spriteAnimation(
            oTarget,
            elementName,
            elementValue.frameFrom,
            elementValue.frameTo,
            elementValue.frameRate,
            0
        );
        await sleep(500);
    }
    // }
}

async function checkCounts() {
    if (correctCounts == jumpCount) {
        M.toast({ html: CORRECT_MESSAGE });
        jump_ok = true;
    } else {
        M.toast({ html: INCORRECT_MESSAGE });
        jump_ok = false;
    }
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) {
        await _oMSPhaserLib.sleep(ms);
        sleep_val = ms / 1000;
    }
}

// Re-initialize the game variables
function reInitValues() {
    jumpCount = 0;
}

// Reset the game
async function reset_output() {
    run_ = false;
    reInitValues();
    _gameThis.scene.restart();
}

function completedFlag() {
    if (step1_validation() && jump_ok) {
        return true;
    } else return false;
}

function runCode() {
    // tour_over && tour.complete();
    jump_ok = false;
    // Re-initialize the game variables
    run_ = true;
    // reset_output();
    reInitValues();
    setTimeout(() => {
        reInitValues();
        window.LoopTrap = 1e3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP =
            'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a =
            "async function c(){" +
            Blockly.JavaScript.workspaceToCode(demoWorkspace) +
            "await checkCounts();} c();";
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            eval(a);
        } catch (b) {
            alert(b);
        }
        // try {
        //     if (tour.getCurrentStep().options.title.includes("Run")) {
        //         let btns = document.querySelectorAll(".shepherd-button");
        //         btns[btns.length - 1].click();
        //     }
        // } catch {}
    }, 500);
}

function step1_validation() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return "for count in range(50):\n  girl.jump()\n  time.sleep(0.1)\n" ==
        Blockly.Python.workspaceToCode(demoWorkspace) ?
        !0 :
        !1;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import girl", "import time"]

const instruction = {
    heading: `Make Shivani do 50 quick jumps for today to stay healthy`,
    steps: [
        {
            title: `Repeat 50 times`,
            text: `Add the loop and do all the following operations in it`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="R]QK9Xcla{$`+t_g,nP-" x="119" y="191"><value name="TIMES"><block type="math_number" id="p#?@#CTHJzy$8f+=t,ZB"><field name="NUM">50</field></block></value></block></xml>',
        },
        {
            title: `Jump`,
            text: `Jump`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="R]QK9Xcla{$`+t_g,nP-" x="119" y="191"><value name="TIMES"><block type="math_number" id="p#?@#CTHJzy$8f+=t,ZB"><field name="NUM">50</field></block></value><statement name="DO"><block type="action_block" id="R@#1J@Zk*qD|(bvWednN"></block></statement></block></xml>',
        },
        {
            title: `Wait`,
            text: `wait for 0.1 secs`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="R]QK9Xcla{$`+t_g,nP-" x="119" y="191"><value name="TIMES"><block type="math_number" id="p#?@#CTHJzy$8f+=t,ZB"><field name="NUM">50</field></block></value><statement name="DO"><block type="action_block" id="R@#1J@Zk*qD|(bvWednN"><next><block type="wait_block" id="i=VA.TMisoUCFHB`Vr|0"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="`9k,uUB`~OeV@)fu%M+d"><field name="NUM">0.1</field></block></value></block></next></block></statement></block></xml>',
        }
    ]
}

export { reset_output, completedFlag, runCode, getNoOfBlocks, updateImports, instruction };