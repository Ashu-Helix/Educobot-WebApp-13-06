/* Developed by Marvsoft LLP */
import { CANVAS, Game, AUTO } from "phaser";
import M from "materialize-css";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
// import MSPhaserLib from "../msPhaserLib.min";
// import { CANVAS, Math, Game, AUTO } from "phaser";

const demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

import {
    // _gameThis,
    baseURL,
    correctBirdCount,
    flyingBirdInitPos,
    gameHeight,
    gameScale,
    gameWidth,
    noOfStaticBirds,
    path,
    signInitialPosition,
    staticBirdInitialPosition,
} from "./config";

import {
    CORRECT_MESSAGE,
    GAME_CONSTANT,
    INCORRECT_MESSAGE,
    MAX_LIMIT,
} from "./constant";
import MSPhaserLib from "../msPhaserLib.min";

let countBirds = 0;
let nCurrentBirdNum = 0;
let _oMSPhaserLib;
let oInterval = null;
let default_;
let nest1;
let nest2;
let is_game_completed = false;

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
let _gameThis = null;

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
    let gameBg = _gameThis.add.image(
        gameWidth / 2,
        gameHeight / 2,
        GAME_CONSTANT.bgFillInTheBirds
    );
    addSign(GAME_CONSTANT.plusSign);
    addSign(GAME_CONSTANT.equalSign);
    addStaticBirds(GAME_CONSTANT.staticBird);
    addFlyingBirds();
    // init(3,1);
}

// Phaser update function
function update() { }

// Load images
function loadImages() {
    _gameThis.load.image(
        GAME_CONSTANT.bgFillInTheBirds,
        "images/" + GAME_CONSTANT.bgFillInTheBirds + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.plusSign,
        "images/" + GAME_CONSTANT.plusSign + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.equalSign,
        "images/" + GAME_CONSTANT.equalSign + ".png"
    );

    for (let i = 0; i < noOfStaticBirds; i++) {
        _gameThis.load.image(
            GAME_CONSTANT.staticBird + i,
            "images/" + GAME_CONSTANT.staticBird + ".png"
        );
    }

    for (let i = 0; i < flyingBirdInitPos.length; i++) {
        const element = flyingBirdInitPos[i];

        _gameThis.load.spritesheet(
            element.name + i,
            "images/" + element.name + ".png", {
            frameWidth: element.frameWidth,
            frameHeight: element.frameHeight,
        }
        );
    }
}

// Add sign to the scene
function addSign(signName) {
    let signInitialDetails = signInitialPosition[signName];
    let sign = _gameThis.add.image(
        signInitialDetails.position.x,
        signInitialDetails.position.y,
        signName
    );
    sign.name = signName;
}

// Add all static birds
function addStaticBirds(birdName) {
    for (let i = 0; i < noOfStaticBirds; i++) {
        let birdInitialDetails = staticBirdInitialPosition[birdName + i];
        let bird = _gameThis.add.image(
            birdInitialDetails.position.x,
            birdInitialDetails.position.y,
            birdName + i
        );
        bird.name = birdName + i;
    }
}

// Add all flying birds
function addFlyingBirds() {
    for (let i = 0; i < flyingBirdInitPos.length; i++) {
        const element = flyingBirdInitPos[i];

        const oTarget = (_gameThis[element.name + i] = _gameThis.add.sprite(
            element.x,
            element.y,
            element.name + i
        ));
        oTarget.scale = 0.57;
        _oMSPhaserLib.stopSpriteAt(oTarget, element.name + i, element.stayAt);
    }
}

async function init(birdCounts, nestNum) {
    clearTimeout(oInterval);

    for (let i = 0; i < birdCounts; i++) {
        if (nCurrentBirdNum < flyingBirdInitPos.length) {
            const element = "bird" + nCurrentBirdNum++;
            await moveBirdToNest(element, nestNum);
        } else {
            M.toast({ html: MAX_LIMIT });
            break;
        }
    }

    if (nCurrentBirdNum > correctBirdCount) M.toast({ html: INCORRECT_MESSAGE });

    oInterval = setTimeout(() => {
        clearTimeout(oInterval);
        if (nCurrentBirdNum == correctBirdCount) {
            M.toast({ html: CORRECT_MESSAGE });
            is_game_completed = true;
        }
    }, 1000);
}

// Move bird to selected nest
async function moveBirdToNest(birdName, nestNum) {
    let pathName = birdName + "_nest" + nestNum;
    let birdPath = path[pathName];
    let oTarget = _gameThis[birdName];

    for (let i = 0; i < birdPath.length - 1; i++) {
        const element = birdPath[i];

        _oMSPhaserLib.spriteAnimation(
            oTarget,
            birdName,
            element.frameFrom,
            element.frameTo,
            element.frameRate
        );
        if (element.angle) oTarget.rotation = Math.PI * element.angle;
        await _oMSPhaserLib.moveOneByOneToXY(
            oTarget,
            element.x,
            element.y,
            element.time
        );
    }
    _oMSPhaserLib.stopSpriteAt(
        oTarget,
        birdName,
        birdPath[birdPath.length - 1].stayAt
    );
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Reset the game
function reset_output() {
    is_game_completed = false;
    nCurrentBirdNum = 0;
    _gameThis.scene.restart();
}

function completedFlag() {
    return is_game_completed;
}

function runCode() {
    // tour_over && tour.complete();
    // Re-initialize the game variables
    reset_output();
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
            eval(a);
        } catch (b) {
            alert(b);
        }
        // try {
        //     //Shepherd goes into next
        //     if (tour.getCurrentStep().options.title.includes("Run")) {
        //         let btns = document.querySelectorAll(".shepherd-button");
        //         btns[btns.length - 1].click();
        //     }
        // } catch {}
    }, 500);
}

// function getNoOfBlocks() {
//     demoWorkspace = Blockly.getMainWorkspace();
//     noOfBlocks = demoWorkspace.getAllBlocks();
//     return 0;
// }

export { completedFlag, reset_output, nest1, nest2, default_, init, runCode };