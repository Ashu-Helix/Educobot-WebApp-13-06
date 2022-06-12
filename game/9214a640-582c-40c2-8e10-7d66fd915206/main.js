import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let is_game_completed = false;
let _gameThis = null;
const baseURL = "../img";
let is_mixed = false;
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
let depthMngr = 100;
const POT_COORDINATE = { x1: 180, y1: 390, x2: 570, y2: 770 };
const CORRECT_FRUIT_COUNT = 2;
let fruit_history = [],
    quantity_history = [];
let run_ = false;
const BANANA = [
    { x: 884, y: 666 },
    { x: 946, y: 639 },
    { x: 1038, y: 738 },
    { x: 887, y: 738 },
    { x: 951, y: 726 },
    { x: 1020, y: 666 },
    { x: 966, y: 805 },
];
const GRAPE = [
    { x: 1383, y: 684 },
    { x: 1462, y: 686 },
    { x: 1365, y: 753 },
    { x: 1435, y: 743 },
    { x: 1420, y: 805 },
    { x: 1492, y: 763 },
];
const BLACK_BERRY = [
    { x: 1474, y: 284 },
    { x: 1494, y: 344 },
    { x: 1385, y: 374 },
];
const BLUE_BERY = [
    { x: 1393, y: 269 },
    { x: 1425, y: 334 },
    { x: 1474, y: 393 },
];
const STRAWBERRY = [
    { x: 909, y: 250 },
    { x: 998, y: 220 },
    { x: 894, y: 351 },
    { x: 981, y: 312 },
    { x: 1053, y: 317 },
    { x: 993, y: 391 },
];

const GAME_CONSTANT = {
    saladBG: "saladBG",
};
const FRUITS = {
    banana: "banana",
    blackBerry: "blackBerry",
    blueBerry: "blueBerry",
    grape: "grape",
    strawberry: "strawberry",
};
const CORRECT_MESSAGE = "Well done, Perfect salad!";
const ERROR_MESSAGE = "Imperfect salad! Try again.";
const MORE_THAN_AVAIL = "Ohh...! You have selected more than available fruits.";

let fruitCounter = 0;
let bananaArr, blackBerryArr, blueBerryArr, grapeArr, strawberryArr;
let _oMSPhaserLib;
let arrAddedFruits = [];

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
    let gameBg = _gameThis.add.image(
        gameWidth / 2,
        gameHeight / 2,
        GAME_CONSTANT.saladBG
    );

    renderFruits();
    // init();
    // mixSalad();
}

async function init() {
    // await moveFruitSliceToPot(FRUITS.banana, 2);
    // await moveFruitSliceToPot(FRUITS.strawberry, 2);
    // await moveFruitSliceToPot(FRUITS.grape, 3);
    // await mixSalad();
    // await moveFruitSliceToPot(FRUITS.blackBerry, 2);
    // await moveFruitSliceToPot(FRUITS.strawberry, 2);
    // await mixSalad();
    // await moveFruitSliceToPot(FRUITS.banana, 6);
}

// Load images
function loadImages() {
    _gameThis.load.image(
        GAME_CONSTANT.saladBG,
        "images/" + GAME_CONSTANT.saladBG + ".png"
    );

    for (let i = 0; i < BANANA.length; i++) {
        _gameThis.load.image(
            FRUITS.banana + i,
            "images/" + (FRUITS.banana + i) + ".png"
        );
    }

    for (let i = 0; i < BLACK_BERRY.length; i++) {
        _gameThis.load.image(
            FRUITS.blackBerry + i,
            "images/" + (FRUITS.blackBerry + i) + ".png"
        );
    }

    for (let i = 0; i < BLUE_BERY.length; i++) {
        _gameThis.load.image(
            FRUITS.blueBerry + i,
            "images/" + (FRUITS.blueBerry + i) + ".png"
        );
    }

    for (let i = 0; i < GRAPE.length; i++) {
        _gameThis.load.image(
            FRUITS.grape + i,
            "images/" + (FRUITS.grape + i) + ".png"
        );
    }

    for (let i = 0; i < STRAWBERRY.length; i++) {
        _gameThis.load.image(
            FRUITS.strawberry + i,
            "images/" + (FRUITS.strawberry + i) + ".png"
        );
    }

}

function renderFruits() {
    bananaArr = [];
    for (let i = 0; i < BANANA.length; i++) {
        const element = BANANA[i];
        bananaArr[i] = _gameThis.add.image(element.x, element.y, FRUITS.banana + i);
    }
    blackBerryArr = [];
    for (let i = 0; i < BLACK_BERRY.length; i++) {
        const element = BLACK_BERRY[i];
        blackBerryArr[i] = _gameThis.add.image(
            element.x,
            element.y,
            FRUITS.blackBerry + i
        );
    }

    blueBerryArr = [];
    for (let i = 0; i < BLUE_BERY.length; i++) {
        const element = BLUE_BERY[i];
        blueBerryArr[i] = _gameThis.add.image(
            element.x,
            element.y,
            FRUITS.blueBerry + i
        );
    }

    grapeArr = [];
    for (let i = 0; i < GRAPE.length; i++) {
        const element = GRAPE[i];
        grapeArr[i] = _gameThis.add.image(element.x, element.y, FRUITS.grape + i);
    }

    strawberryArr = [];
    for (let i = 0; i < STRAWBERRY.length; i++) {
        const element = STRAWBERRY[i];
        strawberryArr[i] = _gameThis.add.image(
            element.x,
            element.y,
            FRUITS.strawberry + i
        );
    }

}

function getRandomElement(fruitName) {
    let oTarget = null;
    let nLen = 0,
        nRndNum = 0;
    let arrTarget = eval(fruitName + "Arr");

    nLen = arrTarget.length;
    if (nLen > 0) {
        nRndNum = Math.floor(Math.random() * (nLen - 1));
        oTarget = arrTarget[nRndNum];
        arrTarget.splice(nRndNum, 1);
    }

    return oTarget;
}

// Move fruit slices to pot
async function moveFruitSliceToPot(fruitName, quantity) {
    if (run_) {
        // console.log(fruitName, quantity)
        for (let i = 0; i < quantity; i++) {
            if (!run_) return;
            const element = getRandomElement(fruitName);
            if (element == null) {
                M.toast({ html: "We don't have " + quantity + " " + fruitName + "s" });
                // M.toast({ html: "We only have " + (i + 1).toString() + " " + fruitName + "s" });
                return;
            } else {
                if (i == 0) {
                    fruit_history.push(fruitName);
                    quantity_history.push(parseInt(quantity));
                    if (fruitName == "banana") {
                        if (quantity == 5) {
                            M.toast({ html: quantity + " " + fruitName + "s are perfect!" });
                        } else {
                            M.toast({
                                html: quantity + " " + fruitName + "s are incorrect.",
                            });
                        }
                    }
                    if (fruitName == "blackBerry") {
                        if (quantity == 3) {
                            M.toast({ html: quantity + " " + fruitName + "s are perfect!" });
                        } else {
                            M.toast({
                                html: quantity + " " + fruitName + "s are incorrect.",
                            });
                        }
                    }
                    if (fruitName == "blueBerry") {
                        if (quantity == 3) {
                            M.toast({ html: quantity + " " + fruitName + "s are perfect!" });
                        } else {
                            M.toast({
                                html: quantity + " " + fruitName + "s are incorrect.",
                            });
                        }
                    }
                    if (fruitName == "grape") {
                        if (quantity == 6) {
                            M.toast({ html: quantity + " " + fruitName + "s are perfect!" });
                        } else {
                            M.toast({
                                html: quantity + " " + fruitName + "s are incorrect.",
                            });
                        }
                    }
                    if (fruitName == "strawberry") {
                        if (quantity == 6) {
                            M.toast({ html: quantity + " " + fruitName + "s are perfect!" });
                        } else {
                            M.toast({
                                html: quantity + " " + fruitName + "s are incorrect.",
                            });
                        }
                    }
                }
                arrAddedFruits.push(element);
                _oMSPhaserLib.bringOnTop(element, true);
                if (run_) await _oMSPhaserLib.scaleTo(element, gameScale * 1.5, 500);
                let xPos =
                    (Math.random() * (POT_COORDINATE.x2 - POT_COORDINATE.x1)) / 2 +
                    (Math.random() * (POT_COORDINATE.x2 - POT_COORDINATE.x1)) / 2 +
                    POT_COORDINATE.x1;
                let yPos =
                    (Math.random() * (POT_COORDINATE.y2 - POT_COORDINATE.y1)) / 2 +
                    (Math.random() * (POT_COORDINATE.y2 - POT_COORDINATE.y1)) / 2 +
                    POT_COORDINATE.y1;
                if (run_) await _oMSPhaserLib.moveOneByOneToXY(element, xPos, yPos);
                _oMSPhaserLib.scaleTo(element, gameScale, 500);
                _oMSPhaserLib.bringOnTop(element, false);
            }
        }

        // checkMixSaladCount();
    }
}

// Mix the salad
async function mixSalad() {
    if (run_) {
        is_mixed = true;
        for (let i = 0; i < arrAddedFruits.length; i++) {
            const element = arrAddedFruits[i];
            // Shake object with given radius (object, radius)
            _oMSPhaserLib.shake(element, 50);
        }
        if (run_) await sleep(2000);
        // if (fruitCounter < CORRECT_FRUIT_COUNT) {
        //     M.toast({ html: ERROR_MESSAGE });
        // } else if (fruitCounter == CORRECT_FRUIT_COUNT) {
        //     M.toast({ html: CORRECT_MESSAGE });
        //     is_game_completed = true;
        // }
        // fruitCounter = 0;
    }
}

function final_check() {
    // if (!checkMixSaladCount()) {
    //     M.toast({ html: "Imperfect Salad." });
    // }
    checkMixSaladCount();
}

// check wheter mix salad count is correct or wrong
function checkMixSaladCount() {
    // fruitCounter++;
    // if (fruitCounter > CORRECT_FRUIT_COUNT)
    //     M.toast({ html: ERROR_MESSAGE });
    let counter = 0;
    fruit_history.forEach((obj, i) => {
        let fruitName = obj;
        let quantity = quantity_history[i];
        if (fruitName == "banana") {
            if (quantity == 5) {
                counter++;
            }
        }
        if (fruitName == "blackBerry") {
            if (quantity == 3) {
                counter++;
            }
        }
        if (fruitName == "blueBerry") {
            if (quantity == 3) {
                counter++;
            }
        }
        if (fruitName == "grape") {
            if (quantity == 6) {
                counter++;
            }
        }
        if (fruitName == "strawberry") {
            if (quantity == 6) {
                counter++;
            }
        }
        // if (obj == "banana" && quantity_history[i] == 5) {}
        // console.log(obj, i)
        if (counter >= 5 && is_mixed) {
            M.toast({ html: "Perfect Salad achieved!" });
            is_game_completed = true;
            return true;
        }
    });
    if (!is_game_completed) M.toast({ html: "Imperfect Salad." });
    return false;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) {
        await _oMSPhaserLib.sleep(ms);
    }
}

// Reset the game
function reset_output() {
    run_ = false;
    is_mixed = false;
    is_game_completed = false;
    fruit_history = [];
    quantity_history = [];
    is_game_completed = false;
    arrAddedFruits = [];
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
        run_ = true;
        window.LoopTrap = 1e3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP =
            'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a =
            "async function c(){" +
            Blockly.JavaScript.workspaceToCode(demoWorkspace) +
            "final_check(); } c();";
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
    }, 1000);
}

const helpCode =
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="fruits" id="`JDe^S}vAuoVOq%xFM.}" x="81" y="150"><field name="fruit">banana</field><field name="counts">5</field><next><block type="fruits" id="se^mIM3YGx0hspYA.Y3S"><field name="fruit">blackBerry</field><field name="counts">3</field><next><block type="mix_salad" id="XSKQ/0W#?W!/9t=K4v,X"><next><block type="fruits" id="peX5:w?=d=Imq!4!JBn_"><field name="fruit">blueBerry</field><field name="counts">3</field><next><block type="fruits" id="UfLz#+pL1rxGQGvTc]VD"><field name="fruit">grape</field><field name="counts">6</field><next><block type="fruits" id="Fi94RiRk+2WU`[r2-FSh"><field name="fruit">strawberry</field><field name="counts">6</field><next><block type="mix_salad" id=":`kf34bA7?,-/.Qc`}Yu"></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';

`
5 bananas
3 black berry
3 blueberry
6 strawberries
6 grapes
mix

reset not working
multiple error messages
non specific error messages
validation algorithm needs to be fixed
`;

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import salad"]

export {
    reset_output,
    completedFlag,
    helpCode,
    moveFruitSliceToPot,
    mixSalad,
    runCode,
    getNoOfBlocks,
    updateImports
};