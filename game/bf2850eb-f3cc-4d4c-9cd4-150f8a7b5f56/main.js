/* Developed by Marvsoft LLP */
import { CANVAS, Game, AUTO } from "phaser";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
// import MSPhaserLib from "../msPhaserLib.min";
// import { CANVAS, Math, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

import M from "materialize-css";
import {
    path,
    pigEatAnim,
    animalInitPos,
    baseURL,
    gameHeight,
    gameWidth,
    gameScale,
} from "./config";
import {
    GAME_CONSTANT,
    ERROR_MESSAGE,
    CORRECT_COMBINATION,
    CORRECT_MESSAGE,
    ANIMAL_NAME,
    SHELTER_NAME,
} from "./constant";
import MSPhaserLib from "../msPhaserLib.min";
let hasWrongSelection = false;
let _oMSPhaserLib;
let isStageCompleted = false;
let shelterAnimal = [];

// Phaser config
const config = {
    type: AUTO,
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
const game = new Game(config);
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
        GAME_CONSTANT.farmBG
    );
    gameBg.scale = 1.5; //gameScale;

    for (let i = 0; i < animalInitPos.length; i++) {
        const element = animalInitPos[i];

        _gameThis[element.name] = _gameThis.add.sprite(
            element.x,
            element.y,
            element.name
        );
        if (element.scaleTo) _gameThis[element.name].scale = element.scaleTo;
        _oMSPhaserLib.stopSpriteAt(
            _gameThis[element.name],
            element.name,
            element.stayAt
        );
    }

    const oTarget = _gameThis[pigEatAnim.name];
    _oMSPhaserLib.spriteAnimation(
        oTarget,
        pigEatAnim.name,
        pigEatAnim.frameFrom,
        pigEatAnim.frameTo,
        pigEatAnim.frameRate
    );
    init();
}

// Load images
function loadImages() {
    _gameThis.load.image(GAME_CONSTANT.farmBG, GAME_CONSTANT.farmBG + ".png");

    for (let i = 0; i < animalInitPos.length; i++) {
        const element = animalInitPos[i];

        _gameThis.load.spritesheet(element.name, element.name + ".png", {
            frameWidth: element.frameWidth,
            frameHeight: element.frameHeight,
        });
    }
}

// Initialize animation functions
async function init() {
    //await sleep(1000);
    // moveAnimalToShelter(ANIMAL_NAME.pig, SHELTER_NAME.sty);
}
// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Move animal to selected shelter
async function moveAnimalToShelter(animal, shelter) {
    let selectedPath = path[animal + "_" + shelter];
    const oTarget = _gameThis[animal];
    for (let i = 0; i < selectedPath.length - 1; i++) {
        const element = selectedPath[i];

        try {
            _oMSPhaserLib.spriteAnimation(
                oTarget,
                animal,
                element.frameFrom,
                element.frameTo,
                element.frameRate
            );
        } catch (err) {
            console.log(err);
        }

        if (element.scaleTo)
            _oMSPhaserLib.scaleTo(
                oTarget,
                element.scaleTo,
                element.scaleTime || element.time
            );
        await _oMSPhaserLib.moveOneByOneToXY(
            oTarget,
            element.x,
            element.y,
            element.time
        );
    }

    let elementValue = selectedPath[selectedPath.length - 1];
    try {
        _oMSPhaserLib.stopSpriteAt(oTarget, animal, elementValue.stayAt);
        validateSheler(animal, shelter);
    } catch (err) {
        console.log(err);
    }
}

function validateSheler(animal, shelter) {
    if (CORRECT_COMBINATION[animal] != shelter) {
        // console.log(ERROR_MESSAGE + animal);
        M.toast({ html: ERROR_MESSAGE + animal });
    } else {
        M.toast({ html: CORRECT_MESSAGE + animal });
        if (!shelterAnimal.includes(animal)) {
            shelterAnimal.push(animal);
        }
        console.log(shelterAnimal);
        if (shelterAnimal.length === 3) {
            isStageCompleted = true;
            console.log(isStageCompleted);
        }
    }
}

function runCode() {
    // tour_over && tour.complete();
    // Re-initialize the game variables
    reset_output();
    // reInitValues();
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
        //     if (tour.getCurrentStep().options.title.includes("Run")) {
        //         let btns = document.querySelectorAll(".shepherd-button");
        //         btns[btns.length - 1].click();
        //     }
        // } catch {}
    }, 500);
}

// Re-initialize the game variables
function reInitValues() {
    // TODO: Re-initialize the game variables here for reset
    shelterAnimal = [];
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

function completedFlag() {
    return isStageCompleted;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}


const updateImports = ["import farm", "import time"]

export {
    moveAnimalToShelter,
    reset_output,
    validateSheler,
    sleep,
    completedFlag,
    runCode,
    updateImports,
    getNoOfBlocks
};