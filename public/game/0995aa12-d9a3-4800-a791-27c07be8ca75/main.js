import { AUTO, Game } from "phaser";

import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
// import { CANVAS, Math, Game, AUTO } from "phaser";
let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const staticImgPos = {
    bearImg: { x: 630, y: 620 },
    dogImg: { x: 630, y: 620 },
    jokerImg: { x: 630, y: 620 },
    lionImg: { x: 630, y: 620 },
    monkeyImg: { x: 630, y: 620 },
    clawMoveLR: { x: 400, y: 390 },
    clawGlass1: { x: 630, y: 560 },
    clawGlass3: { x: 435, y: 875 },
};

const spritesElement = {
    clawMoveDown: {
        x: 450,
        y: 420,
        stayAt: 4,
        frameWidth: 176,
        frameHeight: 348,
        frameFrom: 0,
        frameTo: 4,
        frameRate: 4,
        repeat: 0,
    },
    clawOC: {
        x: 450,
        y: 420,
        stayAt: 1,
        frameWidth: 195,
        frameHeight: 358,
        frameFrom: 0,
        frameTo: 1,
        frameRate: 5,
        repeat: 0,
    },
    bearPick: {
        x: 430,
        y: 480,
        stayAt: 2,
        frameWidth: 165,
        frameHeight: 473,
        frameFrom: 0,
        frameTo: 2,
        frameRate: 5,
        repeat: 0,
    },
    dogPick: {
        x: 570,
        y: 480,
        stayAt: 2,
        frameWidth: 147,
        frameHeight: 493,
        frameFrom: 0,
        frameTo: 2,
        frameRate: 5,
        repeat: 0,
    },
    jokerPick: {
        x: 500,
        y: 480,
        stayAt: 2,
        frameWidth: 149,
        frameHeight: 477,
        frameFrom: 0,
        frameTo: 2,
        frameRate: 5,
        repeat: 0,
    },
    lionPick: {
        x: 700,
        y: 480,
        stayAt: 2,
        frameWidth: 197,
        frameHeight: 468,
        frameFrom: 0,
        frameTo: 2,
        frameRate: 5,
        repeat: 0,
    },
    monkeyPick: {
        x: 800,
        y: 480,
        stayAt: 2,
        frameWidth: 169,
        frameHeight: 445,
        frameFrom: 0,
        frameTo: 2,
        frameRate: 5,
        repeat: 0,
    },

    bearDrop: {
        x: 430,
        y: 860,
        stayAt: 1,
        frameWidth: 141,
        frameHeight: 177,
        frameFrom: 0,
        frameTo: 1,
        frameRate: 4,
        repeat: 0,
    },
    dogDrop: {
        x: 430,
        y: 860,
        stayAt: 1,
        frameWidth: 116,
        frameHeight: 192,
        frameFrom: 0,
        frameTo: 1,
        frameRate: 4,
        repeat: 0,
    },
    jokerDrop: {
        x: 430,
        y: 860,
        stayAt: 1,
        frameWidth: 126,
        frameHeight: 179,
        frameFrom: 0,
        frameTo: 1,
        frameRate: 4,
        repeat: 0,
    },
    lionDrop: {
        x: 430,
        y: 860,
        stayAt: 1,
        frameWidth: 146,
        frameHeight: 184,
        frameFrom: 0,
        frameTo: 1,
        frameRate: 4,
        repeat: 0,
    },
    monkeyDrop: {
        x: 430,
        y: 860,
        stayAt: 1,
        frameWidth: 151,
        frameHeight: 194,
        frameFrom: 0,
        frameTo: 1,
        frameRate: 4,
        repeat: 0,
    },
};

const pickPoints = [
    { x1: 430, y1: 540, x2: 470, y2: 720, name: "bearPick" },
    { x1: 485, y1: 540, x2: 555, y2: 720, name: "jokerPick" },
    { x1: 560, y1: 520, x2: 645, y2: 720, name: "dogPick" },
    { x1: 665, y1: 540, x2: 770, y2: 720, name: "lionPick" },
    { x1: 775, y1: 540, x2: 850, y2: 720, name: "monkeyPick" },
];

const GAME_CONSTANT = {
    images: {
        bgImg: "bgImg",
        bearImg: "bearImg",
        dogImg: "dogImg",
        jokerImg: "jokerImg",
        lionImg: "lionImg",
        monkeyImg: "monkeyImg",
        clawGlass1: "clawGlass1",
        clawGlass2: "clawGlass2",
        clawGlass3: "clawGlass3",
        speechBubble: "speechBubble",
        clawMoveLR: "clawMoveLR",
    },
    spritesImages: {
        clawMoveDown: "clawMoveDown",
        clawOC: "clawOC",
        bearPick: "bearPick",
        dogPick: "dogPick",
        monkeyPick: "monkeyPick",
        jokerPick: "jokerPick",
        lionPick: "lionPick",
        bearDrop: "bearDrop",
        dogDrop: "dogDrop",
        monkeyDrop: "monkeyDrop",
        jokerDrop: "jokerDrop",
        lionDrop: "lionDrop",
    },
};

const INCORRECT_MESSAGE = "Wrong coordinates.";
const CORRECT_MESSAGE = "Toy is picked up.";
const ALL_TOY_MESSAGE = "All toys are picked up.";

let is_game_completed = false;
let run_ = false;
let _oMSPhaserLib;
let speechBubble;
let speechText;
let isGameComplete = false;
let isClawReverse = false;
let isPick = false;
let canPickToy = false;
const tolerance = 10;
let pickedToyList = [];
let pickCoordinates = { x: 0, y: 0 };
let toyCount = 5;
let isPickMoveLeft = false;
let currentPickToy = "";

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
            _gameThis[element] = _gameThis.add.image(
                gameWidth / 2,
                gameHeight / 2,
                element
            );
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.add.sprite(
                elementValue.x,
                elementValue.y,
                element
            );
            _gameThis[element].visible = false;
        }
    }
    this.input.on("pointerdown", createDialogue);
    this.input.on("pointermove", createDialogue);

    this.clawMoveDown.on("animationcomplete", (pointer) => {
        fnPlayToyPickAnim();
    });

    init();
}

// Phaser update function
function update() {
    if (!isPick) {
        isClawReverse ? (this.clawMoveLR.x -= 3) : (this.clawMoveLR.x += 3);
        if (this.clawMoveLR.x >= 850) isClawReverse = true;
        if (this.clawMoveLR.x <= 430) isClawReverse = false;

        if (
            Math.abs(this.clawMoveLR.x - pickCoordinates.x) < tolerance &&
            canPickToy
        ) {
            pickToy();
        }
        //this.clawMoveDown.x = this.clawMoveLR.x;
    }
    if (isPickMoveLeft) {
        this.clawMoveLR.x -= 3;
        _gameThis[currentPickToy].x -= 3;
        if (this.clawMoveLR.x <= 430) {
            //isClawReverse = false;
            isPickMoveLeft = false;
            _gameThis[currentPickToy].visible = false;
            fnToyDropAnimation(currentPickToy.replace("Pick", "Drop"));
        }
    }
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

            _gameThis.load.spritesheet(element, "images/" + element + ".png", {
                frameWidth: elementValue.frameWidth,
                frameHeight: elementValue.frameHeight,
            });
        }
    }
}

// for transparent glass bring on top
function fnBringOnTop() {
    for (let i = 1; i < 4; i++) {
        _oMSPhaserLib.bringOnTop(_gameThis[GAME_CONSTANT.images["clawGlass" + i]]);
        //_gameThis[GAME_CONSTANT.images['clawGlass' + i]].visible = false;
    }
}

// for claw animation left to right
function clawOrToySpriteAnimation(_elementName, _isShow) {
    let elementName = GAME_CONSTANT.spritesImages[_elementName];
    let oTarget = _gameThis[elementName];
    let elementValue = spritesElement[elementName];
    _oMSPhaserLib.spriteAnimation(
        oTarget,
        elementName,
        elementValue.frameFrom,
        elementValue.frameTo,
        elementValue.frameRate,
        elementValue.repeat
    );
    clawOrToyShowOrHide(elementName, _isShow, true);
}

// for static image show or hide
function clawOrToyShowOrHide(_elementName, _isShow, _isSprite) {
    let labelName = _isSprite ? "spritesImages" : "images";
    let elementName = GAME_CONSTANT[labelName][_elementName];
    let oTarget = _gameThis[elementName];
    oTarget.visible = _isShow;
}

// for set claw open or close @param _isOpen = 0 or 1 - 1 for open state and 0 for close state
function fnClawOpenOrClose(_isOpen) {
    _gameThis.clawOC.visible = true;
    _oMSPhaserLib.stopSpriteAt(_gameThis.clawOC, "clawOC", _isOpen);
}

// set position for static images
function fnSetStaticImgPos() {
    for (let key in staticImgPos) {
        let toyValue = staticImgPos[key];
        _gameThis[key].setPosition(toyValue.x, toyValue.y);
    }
    _gameThis.clawGlass2.visible = false;
}

// Initialize animation functions
function init() {
    initSpeechBubble();
    fnSetStaticImgPos();
    fnBringOnTop();
}

// function for use to pick the toy {
async function getToyByCoordinates(x, y) {
    if (run_) {
        pickCoordinates = { x: parseInt(x), y: parseInt(y) };
        let pickedToy = "";

        for (let i = 0; i < pickPoints.length; i++) {
            const element = pickPoints[i];

            if (
                element.x1 <= x &&
                x <= element.x2 &&
                element.y1 <= y &&
                y <= element.y2
            ) {
                pickedToy = element.name;
                break;
            }
        }

        if (pickedToyList.indexOf(pickedToy) != -1) return;

        pickedToyList.push(pickedToy);
        console.log(pickedToy);
        M.Toast.dismissAll();
        if (pickedToy != "") {
            canPickToy = true;
            M.toast({ html: CORRECT_MESSAGE });
        } else {
            M.toast({ html: INCORRECT_MESSAGE });
        }

        if (pickedToyList.length == toyCount) {
            M.toast({ html: ALL_TOY_MESSAGE });
        }
        if (run_) await sleep(7500);
    }
}

function pickToy() {
    canPickToy = false;
    let pickedToy = pickedToyList[pickedToyList.length - 1];
    const elementValue = spritesElement[pickedToy];
    const oTarget = _gameThis[pickedToy];

    isPick = true;
    let leftRight = _gameThis.clawMoveLR;
    leftRight.visible = false;
    _gameThis.clawMoveDown.x = leftRight.x;
    clawOrToySpriteAnimation("clawMoveDown", true, true);
}

function fnPlayToyPickAnim() {
    let toyName = pickedToyList[pickedToyList.length - 1];
    currentPickToy = toyName;
    clawOrToyShowOrHide("clawMoveDown", false, true); // for sprite hide
    clawOrToyShowOrHide(toyName.replace("Pick", "Img"), false, false); // for static hide
    clawOrToySpriteAnimation(toyName, true, true);
    _gameThis[toyName].off("animationcomplete").on("animationcomplete", () => {
        //_gameThis[toyName].visible = false;
        //fnToyDropAnimation((toyName.replace('Pick', 'Drop')));
        isPickMoveLeft = true;
    });
}

function fnToyDropAnimation(_toyName) {
    isClawReverse = false;
    _gameThis.clawMoveLR.x = _gameThis[_toyName].x;
    _gameThis.clawMoveLR.visible = true;
    clawOrToySpriteAnimation(_toyName, true, true);
    _gameThis[_toyName].off("animationcomplete").on("animationcomplete", () => {
        _gameThis[_toyName].visible = false;
        isPick = false;
        if (pickedToyList.length == toyCount) {
            fnGameOverText();
        }
    });
}

// function to add game over text
function fnGameOverText() {
    _gameThis.scene.pause();
    let text = _gameThis.add.text(gameWidth / 2, gameHeight / 2, "Game Over", {
        fontFamily: "Arial",
        fontSize: "20em",
        color: "#f00",
        shadow: { offsetX: 0, offsetY: 0, color: "#fff", fill: true, blur: 40 },
    });
    text.setOrigin(0.5, 0.5);
    _oMSPhaserLib.bringOnTop(text);
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.25;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 50;
    speechBubble.y = 50;
    speechBubble.setOrigin(0);

    let speechTextWidth = speechBubble.width * speechBubble.scale - 50;
    speechText = _gameThis.add.text(0, 0, "x: 1920, y: 1080", {
        font: "28pt arial",
        color: "#000000",
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true },
    });
    speechText.x =
        speechBubble.x +
        (speechBubble.width * speechBubble.scale - speechText.width) / 2;
    speechText.y =
        speechBubble.y +
        (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
}

// Create dialogue
function createDialogue(pointer) {
    speechText.text =
        "x: " + Math.round(pointer.x) + ", y: " + Math.round(pointer.y);
    speechText.x =
        speechBubble.x +
        (speechBubble.width * speechBubble.scale - speechText.width) / 2;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) await _oMSPhaserLib.sleep(ms);
}

function reInitValues() {
    run_ = false;
    isGameComplete = false;
    isPick = false;
    pickedToyList = [];
    pickCoordinates = { x: 0, y: 0 };
    isPickMoveLeft = false;
    currentPickToy = "";
}

// Reset the game
function reset_output() {
    isClawReverse = false;
    _gameThis.scene.restart();
}

function runCode() {
    // tour_over && tour.complete();
    reset_output();
    setTimeout(() => {
        run_ = true;
        window.LoopTrap = 1e3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP =
            'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a =
            "async function c(){" +
            Blockly.JavaScript.workspaceToCode(demoWorkspace) +
            "final_check();} c();";
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
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="a]bYz^}-dr1epRK4i1OF" x="83" y="18"><value name="NAME"><block type="xy" id=".j,fR?HM!IVjFa_n}6Bf"><field name="x_coordinate">850</field><field name="y_coordinate">654</field></block></value><next><block type="catch_block" id="vj?cvK6jys[R0(C5WUmy"><value name="NAME"><block type="xy" id=":L8%?c$=bq_X{~]+HB5D"><field name="x_coordinate">605</field><field name="y_coordinate">654</field></block></value><next><block type="catch_block" id="W:$h@ob~RGNk?-z8HD,7"><value name="NAME"><block type="xy" id="p%VexEW5S[QdS?.|)f!M"><field name="x_coordinate">432</field><field name="y_coordinate">654</field></block></value><next><block type="catch_block" id="!hfufLcNB[@MP@[I6vX="><value name="NAME"><block type="xy" id="@*iZ5Jom5OU`yI`!y{,s"><field name="x_coordinate">540</field><field name="y_coordinate">654</field></block></value><next><block type="catch_block" id="4AqD)4(G+FA)zjzRs{=H"><value name="NAME"><block type="xy" id="SbH8XxnwO2DVH;)d5fR+"><field name="x_coordinate">725</field><field name="y_coordinate">654</field></block></value></block></next></block></next></block></next></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "import dog\n";
    document.getElementById("pycode").innerHTML = import_statement + code;
    document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function get_number_of_blocks() {
    return demoWorkspace.getAllBlocks(false).length;
}

function final_check() {
    setTimeout(() => {
        let ind = false,
            us = false,
            au = false,
            uk = false,
            af = false;
        pickedToyList.forEach((obj) => {
            if (obj == "monkeyPick") {
                ind = true;
            }
            if (obj == "dogPick") {
                us = true;
            }
            if (obj == "bearPick") {
                au = true;
            }
            if (obj == "jokerPick") {
                uk = true;
            }
            if (obj == "lionPick") {
                af = true;
            }
        });
        if (ind && au && uk && af && us) is_game_completed = true;
    }, 2500);
}

function completedFlag() {
    return is_game_completed;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

export {
    completedFlag,
    myUpdateFunction,
    get_number_of_blocks,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    final_check,
    getToyByCoordinates,
    sleep,
    getNoOfBlocks
};