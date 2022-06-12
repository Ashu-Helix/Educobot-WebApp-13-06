/* Developed by Marvsoft LLP */
import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let is_game_completed = false;
let plate1 = 0;
let plate2 = 0;
let baseURL = "../img";
let gameWidth = 960;
let gameHeight = 540;
let gameScale = 0.5;
let depthMngr = 100;
let platesPos = [{
    x: 490,
    y: 190,
},
{
    x: 220,
    y: 350,
},
{
    x: 760,
    y: 350,
},
];
let pizzaSlicePos = [{
    x: 530,
    y: 125,
},
{
    x: 555,
    y: 160,
},
{
    x: 555,
    y: 245,
},
{
    x: 500,
    y: 255,
},
{
    x: 430,
    y: 250,
},
{
    x: 425,
    y: 170,
},
{
    x: 440,
    y: 125,
},
];

let emptyPlate = {
    emptyPlate1: [{
        x: 260,
        y: 285,
    },
    {
        x: 285,
        y: 320,
    },
    {
        x: 285,
        y: 405,
    },
    {
        x: 230,
        y: 415,
    },
    {
        x: 160,
        y: 410,
    },
    {
        x: 155,
        y: 330,
    },
    {
        x: 170,
        y: 285,
    },
    ],
    emptyPlate2: [{
        x: 800,
        y: 285,
    },
    {
        x: 825,
        y: 320,
    },
    {
        x: 825,
        y: 405,
    },
    {
        x: 770,
        y: 415,
    },
    {
        x: 700,
        y: 410,
    },
    {
        x: 695,
        y: 330,
    },
    {
        x: 710,
        y: 285,
    },
    ],
};

const GAME_CONSTANT = {
    masterChefBg: "masterChefBg",
    plate0: "plate0",
    plate1: "plate1",
    plate2: "plate2",
    pizzaSlice0: "pizzaSlice0",
    pizzaSlice1: "pizzaSlice1",
    pizzaSlice2: "pizzaSlice2",
    pizzaSlice3: "pizzaSlice3",
    pizzaSlice4: "pizzaSlice4",
    pizzaSlice5: "pizzaSlice5",
    pizzaSlice6: "pizzaSlice6",
};
const CORRECT_MESSAGE =
    "Congrats...! You have served the correct pizza slices in both plates.";
const ERROR_MESSAGE = "Ohh...! You have not served the correct pizza slices.";

let _oMSPhaserLib;

let arrPizzaSlice = [];
let randomNoArr = [];
let randomNoArrIndex = 0;
let validation = {
    noOfPizzaSlices: 7,
    serveNoOfPizzaSlice: 0,
    plateCount: 2,
    servePlateCount: 0,
    limit: [2, 4],
    plate1: {
        count: 0,
        correct: false,
    },
    plate2: {
        count: 0,
        correct: false,
    },
};

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
            gravity: {
                y: 200,
            },
        },
    },
    scene: {
        preload: preload,
        create: create,
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
        GAME_CONSTANT.masterChefBg
    );
    gameBg.scale = gameScale;

    for (let i = 0; i < platesPos.length; i++) {
        let plate = _gameThis.add.image(
            platesPos[i].x,
            platesPos[i].y,
            GAME_CONSTANT["plate" + i]
        );
        plate.scale = gameScale;
    }

    for (let i = 0; i < pizzaSlicePos.length; i++) {
        var pizzaSlice = _gameThis.add.image(
            pizzaSlicePos[i].x,
            pizzaSlicePos[i].y,
            GAME_CONSTANT["pizzaSlice" + i]
        );
        pizzaSlice.scale = gameScale;
        pizzaSlice.setDepth(50 + i);
        arrPizzaSlice[i] = pizzaSlice;
    }

    //movePizzaSliceToPlate(2, 1);
}

// Move pizza slices to plate
async function movePizzaSliceToPlate(pizzaSlicesCount, plate) {
    console.log(pizzaSlicesCount);
    if (pizzaSlicesCount == 0) {
        M.toast({ html: ERROR_MESSAGE });
    } else {
        for (let i = 0; i < pizzaSlicesCount; i++) {
            if (validation.noOfPizzaSlices != validation.serveNoOfPizzaSlice) {
                randomNumber(plate);
                const element = arrPizzaSlice[randomNoArr[randomNoArrIndex]];
                fnBringOnTop(element, true);
                await _oMSPhaserLib.scaleTo(element, gameScale * 1.4, 500, true);
                console.log("241", emptyPlate["emptyPlate" + plate][randomNoArr[randomNoArrIndex]])
                try {
                    await _oMSPhaserLib.moveOneByOneToXY(
                        element,
                        emptyPlate["emptyPlate" + plate][randomNoArr[randomNoArrIndex]].x,
                        emptyPlate["emptyPlate" + plate][randomNoArr[randomNoArrIndex]].y
                    );
                } catch (err) {
                    console.log(err)
                }
                randomNoArrIndex += 1;
                validation.serveNoOfPizzaSlice += 1;
                _oMSPhaserLib.scaleTo(element, gameScale, 500, true);
                fnBringOnTop(element, false);
                validation["plate" + plate].count++;
            }
        }
        fnCheckServePizzaSlices(plate);
    }
}

// Bring element on top
function fnBringOnTop(oTarget, isDepthUp) {
    try {
        isDepthUp ? depthMngr++ : depthMngr--;
        oTarget.setDepth(depthMngr);
    } catch (err) {
        console.log(err);
    }
}

// check the combination for pizza slices 2 by 7 and 4 by 7 vice versa also.
function fnCheckServePizzaSlices(plate) {
    let index = validation.limit.indexOf(validation["plate" + plate].count);
    if (index > -1) {
        validation.limit.splice(index, 1);
        validation["plate" + plate].correct = true;
    }
    let isCorrect = true;
    validation.servePlateCount = 0;
    for (let p in validation) {
        if (validation[p].count > 0) {
            validation.servePlateCount++;
        }
        if (!validation[p].correct &&
            typeof validation[p] == "object" &&
            !Array.isArray(validation[p])
        ) {
            isCorrect = false;
        }
    }

    if (validation.plateCount == validation.servePlateCount) {
        if (isCorrect) {
            console.log(CORRECT_MESSAGE);
            M.toast({
                html: CORRECT_MESSAGE,
            });
            is_game_completed = true;
        } else {
            console.log(ERROR_MESSAGE);
            M.toast({
                html: ERROR_MESSAGE,
            });
        }
    }
}

// generating random number
function randomNumber(plate) {
    let len = emptyPlate["emptyPlate" + plate].length;
    let no = Math.floor(Math.random() * len);
    if (randomNoArr.indexOf(no) > -1) {
        randomNumber(plate);
    } else {
        randomNoArr.push(no);
    }
}

// Load images
function loadImages() {
    _gameThis.load.image(
        GAME_CONSTANT.masterChefBg,
        "images/" + GAME_CONSTANT.masterChefBg + ".png"
    );

    for (let i = 0; i < platesPos.length; i++) {
        _gameThis.load.image(
            GAME_CONSTANT["plate" + i],
            "images/" + GAME_CONSTANT["plate" + i] + ".png"
        );
    }

    for (let i = 0; i < pizzaSlicePos.length; i++) {
        _gameThis.load.image(
            GAME_CONSTANT["pizzaSlice" + i],
            "images/" + GAME_CONSTANT["pizzaSlice" + i] + ".png"
        );
    }
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

function reInitValues() {
    is_game_completed = false;
    randomNoArr = [];
    randomNoArrIndex = 0;
    validation = {
        noOfPizzaSlices: 7,
        serveNoOfPizzaSlice: 0,
        plateCount: 2,
        servePlateCount: 0,
        limit: [2, 4],
        plate1: {
            count: 0,
            correct: false,
        },
        plate2: {
            count: 0,
            correct: false,
        },
    };
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
    // Re-initialize the game variables
    reset_output();
    setTimeout(() => {
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
        // } catch { }
    }, 500)
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import chef"]

export {
    completedFlag,
    reset_output,
    plate1,
    plate2,
    movePizzaSliceToPlate,
    platesPos,
    pizzaSlicePos,
    emptyPlate,
    runCode,
    getNoOfBlocks,
    updateImports
};