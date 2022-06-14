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
        gardenBg: "gardenBg",
        speechBubble: 'speechBubble'
    },
    spritesImages: {
        meterSprite: "meterSprite",
        waterCaneSprite: "waterCaneSprite",
    },
};
const INCORRECT_PLANT_FOR_WATER = "You have selected wrong plant for watering";
const INCORRECT_PLANT_TYPE = "You have selected wrong plant type for ";
const INCORRECT_MESSAGE = "You have selected wrong coordinates for ";
const INCORRECT_DOUBLE_WATERING = " is getting watered again!";
const OVER_WATERED = "Over watering ";
const UNDER_WATERED = "Under watering ";
const CORRECT_MESSAGE = " got watered correctly";

let correct_counter = 0;
let is_game_completed = false;
let run_ = false;
let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const magicElement = {
    meterSprite: { x: 545, y: 400, stay: 1, frameWidth: 212, frameHeight: 169, frameFrom: 0, frameTo: 24, frameRate: 6 },

    meter_tree: { x: 545, y: 400, frameFrom: 0, frameTo: 3, frameRate: 3 },
    meter_shrub: { x: 1010, y: 400, frameFrom: 0, frameTo: 3, frameRate: 6 },
    meter_grass: { x: 1545, y: 400, frameFrom: 0, frameTo: 3, frameRate: 6 },

    meter_normal: { frameFrom: 3, frameTo: 5, frameRate: 6 },
    meter_over: { frameFrom: 3, frameTo: 14, frameRate: 6 },

    waterCaneSprite: { x: 445, y: 600, stay: 1, frameWidth: 300, frameHeight: 363, frameFrom: 0, frameTo: 49, frameRate: 6 },

    cane_tree: { x: 445, y: 700, frameFrom: 0, frameTo: 24, frameRate: 6, time: 10 },
    cane_shrub: { x: 1010, y: 700, frameFrom: 0, frameTo: 24, frameRate: 6, time: 8 },
    cane_grass: { x: 1545, y: 700, frameFrom: 0, frameTo: 24, frameRate: 6, time: 15 },
};

const hitPoints = {
    tree: [
        { x1: 0, y1: 220, x2: 480, y2: 500 },
        { x1: 0, y1: 800, x2: 450, y2: 950 },
        { x1: 150, y1: 520, x2: 190, y2: 800 }
    ],
    shrub: [{ x1: 640, y1: 740, x2: 1150, y2: 920 }],
    grass: [{ x1: 1230, y1: 720, x2: 1900, y2: 910 }]
};


let _oMSPhaserLib;
let speechBubble;
let speechText;
let selectedPlants = [];
let wateringPlants = [];
let lastWateringPlant = '';

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
            const elementValue = magicElement[element];

            _gameThis[element] = _gameThis.add.sprite(
                elementValue.x,
                elementValue.y,
                element
            );
            _gameThis[element].visible = false;
        }
    }

    _gameThis.input.on("pointerdown", createDialogue);
    _gameThis.input.on("pointermove", createDialogue);
    // init();
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
            const elementValue = magicElement[element];

            _gameThis.load.spritesheet(element, "images/" + element + ".png", {
                frameWidth: elementValue.frameWidth,
                frameHeight: elementValue.frameHeight,
            });
        }
    }
}

// Initialize animation functions
async function init() {

}

// show action for selected plant type.
function showActionByCordXY(plantType, x, y) {
    if (hitPoints[plantType]) {
        let isCorrect = false;
        let plantCords = hitPoints[plantType];

        for (let i = 0; i < plantCords.length; i++) {
            const element = plantCords[i];

            if (element.x1 <= x && x <= element.x2 && element.y1 <= y && y <= element.y2) {
                isCorrect = true;
                break;
            }
        }

        if (isCorrect) {
            if (selectedPlants.indexOf(plantType) == -1) {
                selectedPlants.push(plantType);
            }
        } else
            M.toast({ html: INCORRECT_MESSAGE + plantType });
    } else
        M.toast({ html: INCORRECT_PLANT_TYPE });
}

// Meter animation
async function meterAnimation(meterFor) {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementName = spritesImages.meterSprite;
    let oTarget = _gameThis[elementName];
    let elementValue = magicElement["meter_" + meterFor];
    // let elementValue = magicElement["meter_" + meterFor];

    oTarget.x = elementValue.x;
    oTarget.y = elementValue.y;
    oTarget.scale = 1;
    oTarget.visible = true;

    await _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 0);
}

// WaterCane animation
function waterSelectedPlant(plantType) {
    if (run_) {
        // console.log(plantType);
        if (hitPoints[plantType]) {
            if (selectedPlants.indexOf(plantType) == -1)
                M.toast({ html: INCORRECT_MESSAGE + plantType });
            else {
                if (wateringPlants.indexOf(plantType) == -1) {
                    wateringPlants.push(plantType)
                    // M.toast({ html: plantType + CORRECT_MESSAGE });
                    // correct_counter++;
                } else {
                    M.Toast.dismissAll();
                    M.toast({ html: plantType + INCORRECT_DOUBLE_WATERING });
                }

                lastWateringPlant = plantType;
                let spritesImages = GAME_CONSTANT.spritesImages;
                let elementName = spritesImages.waterCaneSprite;
                let oTarget = _gameThis[elementName];
                let elementValue = magicElement["cane_" + plantType];

                oTarget.x = elementValue.x;
                oTarget.y = elementValue.y;
                oTarget.scale = 1;
                oTarget.visible = true;

                _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, -1);
                meterAnimation(plantType);
            }
        } else
            M.toast({ html: INCORRECT_PLANT_FOR_WATER });
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
    speechText.text = 'x: ' + Math.round(pointer.x) + ', y: ' + Math.round(pointer.y);
    speechText.x = speechBubble.x + (speechBubble.width * speechBubble.scale - speechText.width) / 2;
}

function updateMeter(range) {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementName = spritesImages.meterSprite;
    let oTarget = _gameThis[elementName];
    let elementValue = magicElement["meter_" + range];
    _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 0);
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) {
        const time = ms / 1000;
        if (magicElement['cane_' + lastWateringPlant]) {
            if (time > magicElement['cane_' + lastWateringPlant].time) {
                setTimeout(() => { updateMeter('over') }, magicElement['cane_' + lastWateringPlant].time * 1000);
                setTimeout(() => {
                    M.toast({ html: OVER_WATERED + lastWateringPlant });
                    _gameThis['waterCaneSprite'].anims.pause(_gameThis['waterCaneSprite'].anims.currentAnim.frames[0]);
                }, ms);
            } else if (time < magicElement['cane_' + lastWateringPlant].time)
                setTimeout(() => {
                    M.toast({ html: UNDER_WATERED + lastWateringPlant });
                    _gameThis['waterCaneSprite'].anims.pause(_gameThis['waterCaneSprite'].anims.currentAnim.frames[0]);
                }, ms);
            else {
                setTimeout(() => { updateMeter('normal') }, ms / 2);
                setTimeout(() => {
                    M.toast({ html: lastWateringPlant + CORRECT_MESSAGE });
                    correct_counter++;
                    _gameThis['waterCaneSprite'].anims.pause(_gameThis['waterCaneSprite'].anims.currentAnim.frames[0]);
                }, ms);
            }
        }

        if (run_) await _oMSPhaserLib.sleep(ms);
    }
}

// Re-initialize the game variables
function reInitValues() {
    run_ = false;
    selectedPlants = [];
    wateringPlants = [];
    lastWateringPlant = '';
    correct_counter = 0;
    is_game_completed = false;

}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

function final_check() {
    setTimeout(() => {
        if (correct_counter == 3) {
            M.toast({ html: "All plants watered correctly!" })
            is_game_completed = true;
        }
    }, 1300)

}

function completedFlag() {
    return is_game_completed;
}

var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    reset_output();
    setTimeout(() => {
        run_ = true;
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "final_check();} c();";
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

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="sgrUEAjuam,0v5X|LDAP" x="130" y="36"><field name="plantType">tree</field><value name="NAME"><block type="xy" id=";mhBd#C#dR+^pVzStaF["><field name="x_coordinate">331</field><field name="y_coordinate">452</field></block></value><next><block type="water_block" id="%[:*4P2H-$KxhAEOc@.O"><field name="options1">tree</field><next><block type="wait_block" id="(RsqV$S#^}9{,(SkYB0."><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Ze(rmMIG?g6PHi;.(E%/"><field name="NUM">10</field></block></value><next><block type="variable_holder" id="=I,{Yaz@|]KXaX-38I={"><field name="plantType">shrub</field><value name="NAME"><block type="xy" id="20j6^N!BKs:?AOelp|}u"><field name="x_coordinate">876</field><field name="y_coordinate">815</field></block></value><next><block type="water_block" id="5k~|rrDic?U(Op7PO]Zx"><field name="options1">shrub</field><next><block type="wait_block" id="Zd%yVhbY+RaocjT-bE.a"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="f@x]SK;7IM/]yFR#3)+f"><field name="NUM">8</field></block></value><next><block type="variable_holder" id="KuFh]BPH5JrYFw5qsv@A"><field name="plantType">grass</field><value name="NAME"><block type="xy" id="=:}(r,yo3P?y/EoC[9c`"><field name="x_coordinate">1572</field><field name="y_coordinate">772</field></block></value><next><block type="water_block" id="54k`zy5v.)H/D-7UJ+QX"><field name="options1">grass</field><next><block type="wait_block" id="1/C{B{g.|RAsu!]TW+p]"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="II8BR;ok=2|ts-{a.i64"><field name="NUM">15</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';


function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

export {
    completedFlag,
    reset_output,
    runCode,
    helpCode,
    getNoOfBlocks
}