import M from 'materialize-css';
import {
    AUTO,
    Game,
    Math as MathPhaser
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
window['_gameThis'] = _gameThis
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 0.5;
const developerModeOn = false;
const cabSpeed = 250;
const fuelDecreaseConter = 60;
let fuel_percentage = 100;

const magicElement = {
    fuelSprite: { x: 1720, y: 50, stay: 21, frameWidth: 96.68, frameHeight: 27, frameFrom: 3, frameTo: 21, frameRate: 10, repeat: 0 },
    leftArrowSprite: { x: 1650, y: 1015, stay: 3, frameWidth: 206, frameHeight: 217, frameFrom: 0, frameTo: 3, frameRate: 30 },
    rightArrowSprite: { x: 1825, y: 1015, stay: 3, frameWidth: 212, frameHeight: 217, frameFrom: 0, frameTo: 3, frameRate: 30 },
    upArrowSprite: { x: 1740, y: 925, stay: 3, frameWidth: 210, frameHeight: 213, frameFrom: 0, frameTo: 3, frameRate: 30 },
    downArrowSprite: { x: 1740, y: 1015, stay: 3, frameWidth: 203, frameHeight: 225, frameFrom: 0, frameTo: 3, frameRate: 30 },
    shiftKey: { x: 150, y: 990, stay: 1, frameWidth: 484, frameHeight: 308, frameFrom: 0, frameTo: 1, frameRate: 30 }
}

/* x - x postion, y - y postion, w - width, h - height, c - color, a - alpha */
const arrowKeysConst = {
    left: { x: 1610, y: 975, w: 80, h: 80, c: 0xff0000, a: 0 },
    right: { x: 1785, y: 975, w: 80, h: 80, c: 0xff0000, a: 0 },
    up: { x: 1700, y: 890, w: 80, h: 80, c: 0xff0000, a: 0 },
    down: { x: 1700, y: 975, w: 80, h: 80, c: 0xff0000, a: 0 },
    shift: { x: 55, y: 930, w: 190, h: 120, c: 0xff0000, a: 0 }
}

/* x - x postion, y - y postion, w - width, h - height, c - color, a - alpha */
const startTrack = [
    { x: 1650, y: 250, w: 140, h: 120, c: 0xff0000, a: 0 },
    { x: 1650, y: 420, w: 140, h: 100, c: 0xff0000, a: 0 },
    { x: 1650, y: 570, w: 140, h: 100, c: 0xff0000, a: 0 }
]

const mazeLines = [
    // for horizantal lines
    { x: 480, y: 51, scaleX: 103, scaleY: 2.5 },
    { x: 483, y: 155, scaleX: 31, scaleY: 2.5 },
    { x: 889, y: 160, scaleX: 12, scaleY: 2.5 },
    { x: 1191, y: 175, scaleX: 11, scaleY: 2.5 },
    { x: 556, y: 258, scaleX: 5, scaleY: 2.5 },
    { x: 661, y: 258, scaleX: 78.5, scaleY: 2.5 },
    { x: 576, y: 360, scaleX: 74, scaleY: 2.5 },
    { x: 551, y: 462, scaleX: 6.5, scaleY: 2.5 },
    { x: 675, y: 460, scaleX: 74, scaleY: 2.5 },
    { x: 780, y: 563, scaleX: 54, scaleY: 2.5 },
    { x: 1372, y: 562, scaleX: 3, scaleY: 2.5 },
    { x: 760, y: 665, scaleX: 6.7, scaleY: 2.5 },
    { x: 1295, y: 665, scaleX: 16.1, scaleY: 2.5 },
    { x: 675, y: 768, scaleX: 12.4, scaleY: 2.5 },
    { x: 861, y: 768, scaleX: 25, scaleY: 2.5 },
    { x: 1394, y: 752, scaleX: 5.2, scaleY: 2.5 },
    { x: 472, y: 852, scaleX: 42.4, scaleY: 2.5 },
    { x: 983, y: 852, scaleX: 22.1, scaleY: 2.5 },
    { x: 1263, y: 852, scaleX: 5, scaleY: 2.5 },
    { x: 475, y: 972, scaleX: 7.4, scaleY: 2.5 },
    { x: 653, y: 972, scaleX: 45.4, scaleY: 2.5 },
    { x: 1186, y: 972, scaleX: 33.5, scaleY: 2.5 },

    // for vertical lines
    { x: 574, y: 55, scaleX: 2.5, scaleY: 5.8 },
    { x: 882, y: 63, scaleX: 2.5, scaleY: 11.1 },
    { x: 1190, y: 63, scaleX: 2.5, scaleY: 12.3 },
    { x: 1495, y: 66, scaleX: 2.5, scaleY: 90.9 },
    { x: 698, y: 122, scaleX: 2.5, scaleY: 5.3 },
    { x: 1085, y: 140, scaleX: 2.5, scaleY: 17 },
    { x: 1395, y: 170, scaleX: 2.5, scaleY: 49.7 },
    { x: 474, y: 163, scaleX: 2.5, scaleY: 54.5 },
    { x: 780, y: 159, scaleX: 2.5, scaleY: 9.6 },
    { x: 575, y: 263, scaleX: 2.5, scaleY: 65.8 },
    { x: 660, y: 259, scaleX: 2.5, scaleY: 5 },
    { x: 880, y: 240, scaleX: 2.5, scaleY: 6.5 },
    { x: 1295, y: 367, scaleX: 2.5, scaleY: 4.6 },
    { x: 675, y: 471, scaleX: 2.5, scaleY: 22 },
    { x: 780, y: 536, scaleX: 2.5, scaleY: 24.3 },
    { x: 882, y: 540, scaleX: 2.5, scaleY: 7 },
    { x: 1190, y: 544, scaleX: 2.5, scaleY: 37 },
    { x: 985, y: 578, scaleX: 2.5, scaleY: 9 },
    { x: 882, y: 665, scaleX: 2.5, scaleY: 21 },
    { x: 984, y: 729, scaleX: 2.5, scaleY: 4.6 },
    { x: 1088, y: 648, scaleX: 2.5, scaleY: 12.3 },
    { x: 1290, y: 671, scaleX: 2.5, scaleY: 18.8 },
    { x: 675, y: 744, scaleX: 2.5, scaleY: 6 },
    { x: 1390, y: 759, scaleX: 2.5, scaleY: 21.5 },
    { x: 472, y: 817, scaleX: 2.5, scaleY: 15.8 },
    { x: 985, y: 859, scaleX: 2.5, scaleY: 11.6 },

    // for small block lines
    { x: 470, y: 359, scaleX: 5, scaleY: 2.5 },
    { x: 1465, y: 465, scaleX: 3.8, scaleY: 2.5 },
    { x: 475, y: 615, scaleX: 5, scaleY: 2.5 },
    { x: 652, y: 615, scaleX: 3.5, scaleY: 2.5 },
    { x: 1188, y: 748, scaleX: 5.5, scaleY: 2.5 },
    { x: 1465, y: 850, scaleX: 4.6, scaleY: 2.5 },

    { x: 465, y: 51, scaleX: 2.5, scaleY: 4.2 },
    { x: 1395, y: 55, scaleX: 2.5, scaleY: 4.5 },
    { x: 575, y: 159, scaleX: 2.5, scaleY: 3.5 },
    { x: 780, y: 336, scaleX: 2.5, scaleY: 3.8 },
    { x: 882, y: 363, scaleX: 2.5, scaleY: 4.5 },
    { x: 1190, y: 324, scaleX: 2.5, scaleY: 5.4 },
    { x: 780, y: 436, scaleX: 2.5, scaleY: 4.2 },
    { x: 1085, y: 432, scaleX: 2.5, scaleY: 5 },
    { x: 985, y: 465, scaleX: 2.5, scaleY: 4 },
    { x: 1085, y: 565, scaleX: 2.5, scaleY: 4 },
    { x: 780, y: 933, scaleX: 2.5, scaleY: 6.2 },
    { x: 1088, y: 948, scaleX: 2.5, scaleY: 4.4 },
    { x: 1288, y: 945, scaleX: 2.5, scaleY: 5.2 }
]

const GAME_CONSTANT = {
    images: {
        carRushBg: "carRushBg",
        carRushBg1: "carRushBg1",
        carRushBg2: "carRushBg2",
        carRushBg3: "carRushBg3",
        fuelPump: "fuelPump"
    },
    spritesImages: {
        fuelSprite: "fuelSprite",
        leftArrowSprite: "leftArrowSprite",
        rightArrowSprite: "rightArrowSprite",
        upArrowSprite: "upArrowSprite",
        downArrowSprite: "downArrowSprite",
        shiftKey: "shiftKey"
    },
    physicsImages: {
        lineDot: "lineDot",
        carImg: "carImg",
    }
};
const ERROR_MESSAGE = 'Error Message: <Write error message here>';
const CORRECT_MESSAGE = 'Congratulations! Your reached at the destination';


let _oMSPhaserLib;
let cursors = null;
let platforms = null;
let lastKeyDown = 'left';
let isGameCompleted = false;
let isClicking = false;
let _cab = null;
let _fuel = null;
let isGetFuel = false;
let stopDigonal = 0; // 2 - left, 0 - right, 3 - up and 1 - down for stop the diagnoal moving
let fuelCounter = 0;
let fuelFrameNo = 1;
let isPathSet = false;
let increaseFuelBy = 5; // Set fuel decrease by
let virtualShiftKey = false;
let activeFuelStation = false;
let lastRotateDirection = '';
let decreaseBy = 1; // Update this value from blockly.
let fuelIncreaseByFuelStation = 5; // Set fuel incrasing value from blockly.

let lastMoveDirection = '';
let isShiftUp = true;
let isShiftDown = true;
let isShiftLeft = true;
let isShiftRight = true;

let isLeftActive = true;
let isRightActive = true;
let isUpActive = true;
let isDownActive = true;
let moveDirOnLeftArrow = 'left',
    moveDirOnRightArrow = 'right',
    moveDirOnUpArrow = 'up',
    moveDirOnDownArrow = 'down';

let playerPointer = { x: 0, x1: 0, y: 0, y1: 0 };
let linesArray = [];

// Phaser config
let config = {
    type: AUTO,
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
            debug: false
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Initialize Phaser with config
window['game'] = new Game(config);

// Phaser preload function
function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);

    // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
    //window['_gameThis'] = _gameThis
    loadImages();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    let physicsImages = GAME_CONSTANT.physicsImages;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis[element] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
            _gameThis[element].scale = gameScale;
            _gameThis[element].visible = false;
            //window['_gameThis'] = _gameThis
        }
    }

    // for physics images 
    for (const key in physicsImages) {
        if (Object.hasOwnProperty.call(physicsImages, key) && physicsImages[key] == physicsImages.carImg) {
            const element = physicsImages[key];
            _gameThis[element] = _gameThis.physics.add.sprite(gameWidth / 2, gameHeight / 2, element);
            //window['_gameThis'] = _gameThis
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = magicElement[element];
            _gameThis[element] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
            //window['_gameThis'] = _gameThis
        }
    }

    cursors = this.input.keyboard.createCursorKeys(); // on the key arrow event on keyboard

    _cab = this[GAME_CONSTANT.physicsImages.carImg];
    _cab.setBodySize(150, 85, true);
    _cab.setCollideWorldBounds(true);
    _cab.body.allowGravity = false;
    _cab.visible = false;
    _cab.scale = gameScale;
    _oMSPhaserLib.bringOnTop(_cab);

    _gameThis[GAME_CONSTANT.images.carRushBg].visible = true;

    _gameThis.fuelPump.setPosition(1300, 155);
    _gameThis.fuelPump.visible = true;
    _gameThis.fuelPump.scale = 0.25;
    //window['_gameThis'] = _gameThis
    init();
    fnArrowKeys();
    fnStartTrack();
}


function left_key_is_pressed() {
    return (cursors.left.isDown || (isClicking && ('left' == lastKeyDown))) && !shift_left_key_is_pressed();
}

function right_key_is_pressed() {
    return (cursors.right.isDown || (isClicking && ('right' == lastKeyDown))) && !shift_right_key_is_pressed();
}

function up_key_is_pressed() {
    return (cursors.up.isDown || (isClicking && ('up' == lastKeyDown))) && !shift_up_key_is_pressed();
}

function down_key_is_pressed() {
    return (cursors.down.isDown || (isClicking && ('down' == lastKeyDown))) && !shift_down_key_is_pressed();
}

function shift_left_key_is_pressed() {
    // console.log("shift_left_key_is_pressed");
    return (cursors.left.isDown || (isClicking && ('left' == lastKeyDown))) && (cursors.shift.isDown || virtualShiftKey);
}

function shift_right_key_is_pressed() {
    // console.log("shift_right_key_is_pressed");
    return (cursors.right.isDown || (isClicking && ('right' == lastKeyDown))) && (cursors.shift.isDown || virtualShiftKey);
}

function shift_up_key_is_pressed() {
    // console.log("shift_up_key_is_pressed");
    return (cursors.up.isDown || (isClicking && ('up' == lastKeyDown))) && (cursors.shift.isDown || virtualShiftKey);
}

function shift_down_key_is_pressed() {
    // console.log("shift_down_key_is_pressed");
    return (cursors.down.isDown || (isClicking && ('down' == lastKeyDown))) && (cursors.shift.isDown || virtualShiftKey);
}

function is_car_touching_fuel_station() {
    let touched = false;
    try {
        if (MathPhaser.Distance.Between(_cab?.x, _cab?.y,
            _gameThis.fuelPump.x, _gameThis.fuelPump.y) <= 20) {
            touched = true;
        }
    } catch (err) {
        console.log(err);
    }
    return touched;
}

function is_car_touching_house() {
    let touched = false;
    if (MathPhaser.Distance.Between(_cab.x, _cab.y, 194, 155) <= 175) {
        touched = true;
    }
    return touched;
}

function set_fuel_pump_visible(bool) {
    if (bool) {
        _gameThis.fuelPump.visible = true; //window['_gameThis'].fuelPump.visible = true
    }
    else {
        _gameThis.fuelPump.visible = false;

    } //window['_gameThis'].fuelPump.visible = false
}


function set_car_visible(bool) {
    if (bool) _cab.visible = true;
    else _cab.visible = false;
}

function set_fuel_percentage(x) {
    if (x < 0) fuel_percentage = 0;
    else if (x > 100) fuel_percentage = 100;
    else fuel_percentage = x;
    fuelFrameNo = (20 - Math.floor(fuel_percentage / 5));
    fnDecreaseFuelLevel(0);
}

function change_fuel_percentage(x) {
    if ((fuel_percentage + x) < 0) fuel_percentage = 0;
    else if ((fuel_percentage + x) > 100) fuel_percentage = 100;
    else fuel_percentage += x;
    set_fuel_percentage(fuel_percentage)
}

function get_fuel_percentage() {
    return fuel_percentage;
}

function game_over() {
    fnGameOverText();
    isGameCompleted = true;
}


// Phaser update function
function update() {

    if (!isGameCompleted) {
        fnStopCab();

        // if (shift_left_key_is_pressed()) {
        //     fnToCheckMoveDirection('left', true);
        // } else if (left_key_is_pressed()) {
        //     fnToCheckMoveDirection('left');
        // } else if (shift_right_key_is_pressed()) {
        //     fnToCheckMoveDirection('right', true);
        // } else if (right_key_is_pressed()) {
        //     fnToCheckMoveDirection('right');
        // } else if (shift_up_key_is_pressed()) {
        //     fnToCheckMoveDirection('up', true);
        // } else if (up_key_is_pressed()) {
        //     fnToCheckMoveDirection('up');
        // } else if (shift_down_key_is_pressed()) {
        //     fnToCheckMoveDirection('down', true);
        // } else if (down_key_is_pressed()) {
        //     fnToCheckMoveDirection('down');
        // }

        // if (is_car_touching_fuel_station())
        //     fnIncreaseFuelLevel()
        // if (is_car_touching_house())
        //     fnReachAtDestination();
    }
}


function fnToCheckMoveDirection(_moveDirection, canSlide) {
    if (!isPathSet)
        return;
    switch (_moveDirection) {
        case 'left':
            fnMoveCab('left', 2, canSlide);
            break;
        case 'right':
            fnMoveCab('right', 0, canSlide);
            break;
        case 'up':
            fnMoveCab('up', 3, canSlide);
            break;
        case 'down':
            fnMoveCab('down', 1, canSlide);
            break;
    }
}

// Load images
function loadImages() {
    let images = GAME_CONSTANT.images;
    let physicsImages = GAME_CONSTANT.physicsImages;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element, "images/" + element + ".png");
            //window['_gameThis'] = _gameThis
        }
    }

    // for physics images
    for (const key in physicsImages) {
        if (Object.hasOwnProperty.call(physicsImages, key)) {
            const element = physicsImages[key];
            _gameThis.load.image(element, "images/" + element + ".png");
            //window['_gameThis'] = _gameThis
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = magicElement[element];

            _gameThis.load.spritesheet(element, "images/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
            //window['_gameThis'] = _gameThis
        }
    }
}

// Initialize animation functions
function init() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let elementName = spritesImages.fuelSprite;
    _fuel = _gameThis[elementName];
    //window['_gameThis'] = _gameThis

    _fuel.visible = true;
    _fuel.scale = gameScale * 5;

    fnCreateLines();
}

// function to add game over text
function fnGameOverText() {
    setTimeout(() => {
        fnStopCab();
    }, 100);
    let text = _gameThis.add.text(gameWidth / 2, gameHeight / 2, 'Game Over', {
        fontFamily: 'Arial',
        fontSize: '20em',
        color: '#fff',
        shadow: { offsetX: 0, offsetY: 0, color: '#fff', fill: true, blur: 40 }
    });

    text.setOrigin(0.5, 0.5);
    _oMSPhaserLib.bringOnTop(text);
}

// function to decrease the fuel level
function fnDecreaseFuelLevel(decreaseBy) {
    try {
        increaseFuelBy = decreaseBy;
        let elementValue = magicElement.fuelSprite;
        _oMSPhaserLib.spriteAnimation(_fuel, GAME_CONSTANT.spritesImages.fuelSprite, fuelFrameNo, (fuelFrameNo + 1), elementValue.frameRate, 0);
        fuelFrameNo += increaseFuelBy;
        if (increaseFuelBy >= elementValue.stay) {
            fuelFrameNo = elementValue.stay;
            _oMSPhaserLib.stopSpriteAt(_fuel, GAME_CONSTANT.spritesImages.fuelSprite, fuelFrameNo);
        }
        if (fuelFrameNo < 0)
            fuelFrameNo = 0;
        // if (fuelFrameNo >= elementValue.stay) {
        //     isGameCompleted = true;
        //     fnGameOverText();
        // }
    } catch { }
}

// Active fuel station
function fnActiveFuelStation() {
    activeFuelStation = true;
}

// function to increase the fuel level
function fnIncreaseFuelLevel() {
    if (_gameThis.fuelPump.visible) {
        isGetFuel = true;
        (increaseFuelBy != 0) && (fuelFrameNo -= fuelIncreaseByFuelStation);
        let elementValue = magicElement.fuelSprite;
        _oMSPhaserLib.spriteAnimation(_fuel, GAME_CONSTANT.spritesImages.fuelSprite, fuelFrameNo, (fuelFrameNo + 1), elementValue.frameRate, 0);
        _gameThis.fuelPump.visible = false;
        //window['_gameThis'].fuelPump.visible = false;
    }
}

// function to create event on track for cab e.g. start 1, 2 or 3
function fnStartTrack() {
    let trackNo = 1;
    for (let track of startTrack) {
        const element = _gameThis.add.rectangle(track.x, track.y, track.w, track.h, track.c, track.a);
        element.setOrigin(0, 0);
        element.setInteractive();
        element.trackNo = trackNo;
        _gameThis["track_" + trackNo] = element;
        //window['_gameThis'] = _gameThis
        trackNo += 1;

    }
}

// function to show the selected track by user
function fnChooseStartPoint(_point) {
    isPathSet = true;
    isGameCompleted = false;
    _gameThis[GAME_CONSTANT.images.carRushBg].visible = false;
    _gameThis[GAME_CONSTANT.images.carRushBg + _point].visible = true;
    //window['_gameThis'] = _gameThis

    let x = 0,
        y = 0,
        r = 0;
    _cab.visible = true;

    switch (_point) {
        case 1:
            x = 489;
            y = 759;
            r = 0;
            break;
        case 2:
            x = 615;
            y = 980;
            r = 3;
            _cab.setBodySize(60, 150, true);
            break;
        case 3:
            x = 1145;
            y = 980;
            r = 3;
            _cab.setBodySize(60, 150, true);
            break;
        default:
    }
    _cab.setPosition(x, y);
    _cab.rotation = Math.PI / 2 * r;
    fnSetVisibilityForTrack(false);
}

// function to set the visibility for track buttons param isShow = true or false
function fnSetVisibilityForTrack(isShow) {
    for (let index = 1; index <= (startTrack.length); index++) {
        _gameThis["track_" + index].visible = isShow;
        //window['_gameThis'] = _gameThis
    }
}

// for create arrow keys
function fnArrowKeys() {
    for (let key in arrowKeysConst) {
        const arrow = arrowKeysConst[key];
        const element = _gameThis.add.rectangle(arrow.x, arrow.y, arrow.w, arrow.h, arrow.c, arrow.a);
        element.setOrigin(0, 0);
        element.setInteractive();

        // pointer down event add on key arrows left, right, up and down
        element.on('pointerdown', function () {
            lastKeyDown = this.key;
            isClicking = true;
            fnChangeArrowState(this.key, 1);
        });

        // pointer up event add on key arrows left, right, up and down
        element.on('pointerup', function () {
            isClicking = false;
            fnChangeArrowState(this.key, 0);
        });

        element.key = key;
        _gameThis[key + "Arrow"] = element;

        // for arrow keys sprite 
        if (key != 'shift') {
            _gameThis[key + "ArrowSprite"].scale = 0.4;
            _oMSPhaserLib.bringOnTop(_gameThis[key + "ArrowSprite"]);
        } else {
            // for shift key
            _gameThis[key + "Key"].scale = 0.4;
            _oMSPhaserLib.bringOnTop(_gameThis[key + "Key"]);
        }
    }
}

// function to handle the arrow keys state
function fnChangeArrowState(_key, stateIndex) {
    let arrowKey = (_key == 'shift') ? _key + 'Key' : _key + 'ArrowSprite';
    _oMSPhaserLib.stopSpriteAt(_gameThis[arrowKey], arrowKey, stateIndex);

    if (_key == 'shift')
        virtualShiftKey = stateIndex == 1 ? true : false;
}

// function to use for move a cab left, right, up and down
function fnMoveCab(direction, cabAngle, canSlide) {
    stopDigonal = cabAngle;
    let isShiftKey = false;
    if ((cursors.shift.isDown || virtualShiftKey) && canSlide) {
        isShiftKey = true;
    }
    lastKeyDown = direction;
    lastMoveDirection = direction;
    let speed = ((direction == 'left' || direction == 'up')) ? -cabSpeed : cabSpeed;

    if ((direction == 'left' || direction == 'right')) {
        if (!isShiftKey) {
            if (lastRotateDirection != direction) {
                _cab.setBodySize(150, 60, true);
                setTimeout(() => {
                    if (direction == 'left')
                        _cab.x += _cab.getBounds().width / 2;
                    else
                        _cab.x -= _cab.getBounds().width / 2;
                }, 1);
            }
            lastRotateDirection = direction;
        }
        setTimeout(() => {
            _cab.setVelocityX((speed));
        }, 1);
    } else {
        if (!isShiftKey) {
            if (lastRotateDirection != direction) {
                _cab.setBodySize(60, 150, true);
                setTimeout(() => {
                    if (direction == 'up')
                        _cab.y += _cab.getBounds().height / 2;
                    else
                        _cab.y -= _cab.getBounds().height / 2;
                }, 1);
            }
            lastRotateDirection = direction;
        }
        setTimeout(() => {
            _cab.setVelocityY((speed));
        }, 1);
    }

    if (!isShiftKey) {
        _cab.rotation = Math.PI / 2 * cabAngle;
    } else {
        if (!isShiftLeft && direction == 'left') {
            _cab.rotation = Math.PI / 2 * cabAngle;
        } else if (!isShiftRight && direction == 'right') {
            _cab.rotation = Math.PI / 2 * cabAngle;
        } else if (!isShiftUp && direction == 'up') {
            _cab.rotation = Math.PI / 2 * cabAngle;
        } else if (!isShiftDown && direction == 'down') {
            _cab.rotation = Math.PI / 2 * cabAngle;
        }
    }

    // fuelCounter += 1;
    // if (fuelCounter % fuelDecreaseConter == 0) {
    //     fnDecreaseFuelLevel(decreaseBy);
    // }
}

function fnStopCab() {
    stopDigonal = 0;
    _cab.setVelocity(0, 0);
}

// for create lines
function fnCreateLines() {
    platforms = _gameThis.physics.add.staticGroup();

    for (let line of mazeLines) {
        const oLine = platforms.create(line.x, line.y, GAME_CONSTANT.physicsImages.lineDot)
            .setOrigin(0).setScale(line.scaleX, line.scaleY).refreshBody();
        oLine.alpha = line.alpha || 0;
    }
    _gameThis.physics.add.collider(_cab, platforms);
}

// function to reach to destination
function fnReachAtDestination() {
    if (!isGameCompleted) {
        isGameCompleted = true;
        setTimeout(() => {
            fnStopCab();
        }, 100);
        M.toast({
            html: CORRECT_MESSAGE
        });
    }
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Set fuel meter update value
function setFuelMeterUpdateValue(sign, value) {
    increaseFuelBy = sign == '+' ? -parseInt(value) : parseInt(value);
}

// Set active keys
function activeKey(objValue) {
    const key_sensing = objValue.key_sensing;
    const move_cab = objValue.move_cab;
    const slide_cab = objValue.slide_cab;

    switch (key_sensing) {
        case 'left':
            isLeftActive = true;
            moveDirOnLeftArrow = move_cab;
            break;
        case 'right':
            isRightActive = true;
            moveDirOnRightArrow = move_cab;
            break;
        case 'up':
            isUpActive = true;
            moveDirOnUpArrow = move_cab;
            break;
        case 'down':
            isDownActive = true;
            moveDirOnDownArrow = move_cab;
            break;
        case 'shiftLeft':
            isShiftLeft = true;
            moveDirOnLeftArrow = slide_cab;
            break;
        case 'shiftRight':
            isShiftRight = true;
            moveDirOnRightArrow = slide_cab;
            break;
        case 'shiftUp':
            isShiftUp = true;
            moveDirOnUpArrow = slide_cab;
            break;
        case 'shiftDown':
            isShiftDown = true;
            moveDirOnDownArrow = slide_cab;
            break;
    }
}

function reInitValues() {

    isShiftLeft = true;
    isShiftRight = true;
    isShiftUp = true;
    isShiftDown = true;
    isLeftActive = false;
    isRightActive = false;
    isUpActive = false;
    isDownActive = false;
    moveDirOnLeftArrow = '';
    moveDirOnRightArrow = '';
    moveDirOnUpArrow = '';
    moveDirOnDownArrow = '';
    isClicking = false;
    lastKeyDown = 'left';
    isGameCompleted = false;
    isGetFuel = false;
    fuelFrameNo = 1;
    stopDigonal = 0;
    virtualShiftKey = false;
    activeFuelStation = false;
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
        eval(a);
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
    // } catch {}
}




// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="fuel_perchange_set" id="}tI@5zW.Nu1m.R@aDd0P" x="-73" y="-1054"><field name="Variable name">op1</field><field name="NAME">100</field><next><block type="choose__block" id="}ZX$u%E!}+1UWadIY5#-"><field name="Options">3</field><next><block type="forever_repeat_block" id="[?#RlRu{9CF(]_X`M6J3"><statement name="NAME"><block type="controls_if" id="JiXvi4,7:}JPntEHMvl1"><mutation elseif="7"></mutation><value name="IF0"><block type="key_sensing" id="iIZZPCqUN(R:`*,_9kN%"><field name="NAME">left</field></block></value><statement name="DO0"><block type="move_cab" id="XqpVm^i-5$v4VX~E}7@N"><field name="NAME">left</field><next><block type="fuel_perchange_change" id="SXO{zzzojR~g/wT29vy^"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF1"><block type="key_sensing" id="!],7XhT@*7f5P`v9!Xm."><field name="NAME">right</field></block></value><statement name="DO1"><block type="move_cab" id="jCxx1Qs/0@dEOXn)1#zP"><field name="NAME">right</field><next><block type="fuel_perchange_change" id="wyDoWc*Y(xY-x@%*,l.S"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF2"><block type="key_sensing" id="wcU@Nc4Q1qF~WY*~|qs:"><field name="NAME">up</field></block></value><statement name="DO2"><block type="move_cab" id="`Vc7Skyyk,+d-[k(A)fq"><field name="NAME">up</field><next><block type="fuel_perchange_change" id="gBtuKHYU3-{%OqglB^8u"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF3"><block type="key_sensing" id="4}%3zjhmu4oSs+jkJ+*:"><field name="NAME">down</field></block></value><statement name="DO3"><block type="move_cab" id="`Fw1i}L~c=p@d$$edR-Q"><field name="NAME">down</field><next><block type="fuel_perchange_change" id="~{0?r-.tsC@XiwDr6xQt"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF4"><block type="key_sensing" id="wj(B82R!|~MO#-L|9^Jl"><field name="NAME">shift_left</field></block></value><statement name="DO4"><block type="slide_cab" id="C.L_TBEC=m:w4caHpVBN"><field name="NAME">left</field><next><block type="fuel_perchange_change" id="*@SN@IN~mIVuwrO=[Vh7"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF5"><block type="key_sensing" id="}Ka9@}elumDxoH)f/J2n"><field name="NAME">shift_right</field></block></value><statement name="DO5"><block type="slide_cab" id="NeXg3EsieR,Gev$QrO/W"><field name="NAME">right</field><next><block type="fuel_perchange_change" id="Px6B}V425P.W?UT{3mRX"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF6"><block type="key_sensing" id="rpioGp}fl{z{C}5CB:^l"><field name="NAME">shift_up</field></block></value><statement name="DO6"><block type="slide_cab" id="Iskj}%$8`PO=GAC`E.55"><field name="NAME">up</field><next><block type="fuel_perchange_change" id="ZTp2n:.[LeA8d7Jb:@*T"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><value name="IF7"><block type="key_sensing" id="/V*lmbDoaTVcOtnflpOn"><field name="NAME">shift_down</field></block></value><statement name="DO7"><block type="slide_cab" id="IdtqMkmSN,LLA]$${**/"><field name="NAME">down</field><next><block type="fuel_perchange_change" id="lr7}FYe848nx$xFI9,Bp"><field name="NAME">op1</field><field name="options">-</field><field name="NAME2">0.1</field></block></next></block></statement><next><block type="controls_if" id=":+VpQz)0qr@goc+%!yq;"><value name="IF0"><block type="logic_compare" id="-G{?|3;TKUr{jhB#{t~i"><field name="OP">LTE</field><value name="A"><block type="variables" id="{Z!.j^dS^L]do7+jMO/t"><field name="Options">fp</field></block></value><value name="B"><block type="math_number" id="@07)`pkt~xSxrN)[2~UL"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="game_over" id="?N,l|WWDj?ruEA||$FGT"></block></statement><next><block type="controls_if" id="Xf+w?R7{XJyU~P6{Ua-#"><value name="IF0"><block type="spritetouch__block" id="gz2U/Y;u}O%1I@:O]XD7"><field name="options1">car</field><field name="options2">fuelstation</field></block></value><statement name="DO0"><block type="fuel_perchange_change" id="A#AEt|?DH6K.q:Bt^rs_"><field name="NAME">op1</field><field name="options">+</field><field name="NAME2">50</field><next><block type="hide_block" id="+SE$J*L3XC9NR,){K{?-"><field name="NAME">fs</field></block></next></block></statement><next><block type="controls_if" id="9t=TLJ)ovJYI%8-x]K0F"><value name="IF0"><block type="spritetouch__block" id="Bc+tH!0|R75#3culNp#g"><field name="options1">car</field><field name="options2">destination</field></block></value><statement name="DO0"><block type="hide_block" id="RgVbzMbWdQzx.{bos+Lw"><field name="NAME">car</field><next><block type="won_game" id="z7SA-D:mu@ucySU/j{v@"></block></next></block></statement></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>';


function completedFlag() {
    return isGameCompleted;
}


function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import city"]

const instruction = {
    "heading": "Navigate through the maze by choosing the best path and refuel to reach the home",
    "steps": [
        {
            "checkbox": true,
            "rescue": true,
            "text": "Set fuel meter to 100%",
            "title": "Fuel Level",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "Choose one of the 3 start points / path",
            "title": "Path for Cab",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "Add repeat forever loop and do all the following operations in it",
            "title": "Repeat forever",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"></block></next></block></next></block></xml>"
        },
        {
            "checkbox": null,
            "rescue": null,
            "text": "Fuel Level Reduces by 0.1% with every movement of cab in the below conditions",
            "title": "Reduce Fuel",
            "workspace": null
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If Key Pressed is Left_arrow, Move Left",
            "title": "Movements of cab",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is Right_arrow, Move Right",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is Up_arrow, Move Up",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"2\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is Down_arrow, Move Down",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"3\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is shift+Left_arrow, Slide Left",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"4\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is shift+Right_arrow, Slide Right",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"5\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF5\"><block type=\"key_sensing\" id=\"}Ka9@}elumDxoH)f/J2n\"><field name=\"NAME\">shift_right</field></block></value><statement name=\"DO5\"><block type=\"slide_cab\" id=\"NeXg3EsieR,Gev$QrO/W\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"Px6B}V425P.W?UT{3mRX\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is shift+Up_arrow, Slide Up",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"6\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF5\"><block type=\"key_sensing\" id=\"}Ka9@}elumDxoH)f/J2n\"><field name=\"NAME\">shift_right</field></block></value><statement name=\"DO5\"><block type=\"slide_cab\" id=\"NeXg3EsieR,Gev$QrO/W\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"Px6B}V425P.W?UT{3mRX\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF6\"><block type=\"key_sensing\" id=\"rpioGp}fl{z{C}5CB:^l\"><field name=\"NAME\">shift_up</field></block></value><statement name=\"DO6\"><block type=\"slide_cab\" id=\"Iskj}%$8`PO=GAC`E.55\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"ZTp2n:.[LeA8d7Jb:@*T\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If Key Pressed is shift+Down_arrow, Slide Down",
            "title": "",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"7\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF5\"><block type=\"key_sensing\" id=\"}Ka9@}elumDxoH)f/J2n\"><field name=\"NAME\">shift_right</field></block></value><statement name=\"DO5\"><block type=\"slide_cab\" id=\"NeXg3EsieR,Gev$QrO/W\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"Px6B}V425P.W?UT{3mRX\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF6\"><block type=\"key_sensing\" id=\"rpioGp}fl{z{C}5CB:^l\"><field name=\"NAME\">shift_up</field></block></value><statement name=\"DO6\"><block type=\"slide_cab\" id=\"Iskj}%$8`PO=GAC`E.55\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"ZTp2n:.[LeA8d7Jb:@*T\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF7\"><block type=\"key_sensing\" id=\"/V*lmbDoaTVcOtnflpOn\"><field name=\"NAME\">shift_down</field></block></value><statement name=\"DO7\"><block type=\"slide_cab\" id=\"IdtqMkmSN,LLA]$${**/\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"lr7}FYe848nx$xFI9,Bp\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If Fuel level percentage is less than or equal to 0, game over",
            "title": "Game Over",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"7\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF5\"><block type=\"key_sensing\" id=\"}Ka9@}elumDxoH)f/J2n\"><field name=\"NAME\">shift_right</field></block></value><statement name=\"DO5\"><block type=\"slide_cab\" id=\"NeXg3EsieR,Gev$QrO/W\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"Px6B}V425P.W?UT{3mRX\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF6\"><block type=\"key_sensing\" id=\"rpioGp}fl{z{C}5CB:^l\"><field name=\"NAME\">shift_up</field></block></value><statement name=\"DO6\"><block type=\"slide_cab\" id=\"Iskj}%$8`PO=GAC`E.55\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"ZTp2n:.[LeA8d7Jb:@*T\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF7\"><block type=\"key_sensing\" id=\"/V*lmbDoaTVcOtnflpOn\"><field name=\"NAME\">shift_down</field></block></value><statement name=\"DO7\"><block type=\"slide_cab\" id=\"IdtqMkmSN,LLA]$${**/\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"lr7}FYe848nx$xFI9,Bp\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><next><block type=\"controls_if\" id=\":+VpQz)0qr@goc+%!yq;\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"-G{?|3;TKUr{jhB#{t~i\"><field name=\"OP\">LTE</field><value name=\"A\"><block type=\"variables\" id=\"{Z!.j^dS^L]do7+jMO/t\"><field name=\"Options\">fp</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"@07)`pkt~xSxrN)[2~UL\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"game_over\" id=\"?N,l|WWDj?ruEA||$FGT\"></block></statement></block></next></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If car touches fuel station, fuel meter + 50%, hide fuel station",
            "title": "Refuel",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"7\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF5\"><block type=\"key_sensing\" id=\"}Ka9@}elumDxoH)f/J2n\"><field name=\"NAME\">shift_right</field></block></value><statement name=\"DO5\"><block type=\"slide_cab\" id=\"NeXg3EsieR,Gev$QrO/W\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"Px6B}V425P.W?UT{3mRX\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF6\"><block type=\"key_sensing\" id=\"rpioGp}fl{z{C}5CB:^l\"><field name=\"NAME\">shift_up</field></block></value><statement name=\"DO6\"><block type=\"slide_cab\" id=\"Iskj}%$8`PO=GAC`E.55\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"ZTp2n:.[LeA8d7Jb:@*T\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF7\"><block type=\"key_sensing\" id=\"/V*lmbDoaTVcOtnflpOn\"><field name=\"NAME\">shift_down</field></block></value><statement name=\"DO7\"><block type=\"slide_cab\" id=\"IdtqMkmSN,LLA]$${**/\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"lr7}FYe848nx$xFI9,Bp\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><next><block type=\"controls_if\" id=\":+VpQz)0qr@goc+%!yq;\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"-G{?|3;TKUr{jhB#{t~i\"><field name=\"OP\">LTE</field><value name=\"A\"><block type=\"variables\" id=\"{Z!.j^dS^L]do7+jMO/t\"><field name=\"Options\">fp</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"@07)`pkt~xSxrN)[2~UL\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"game_over\" id=\"?N,l|WWDj?ruEA||$FGT\"></block></statement><next><block type=\"controls_if\" id=\"Xf+w?R7{XJyU~P6{Ua-#\"><value name=\"IF0\"><block type=\"spritetouch__block\" id=\"gz2U/Y;u}O%1I@:O]XD7\"><field name=\"options1\">car</field><field name=\"options2\">fuelstation</field></block></value><statement name=\"DO0\"><block type=\"fuel_perchange_change\" id=\"A#AEt|?DH6K.q:Bt^rs_\"><field name=\"NAME\">op1</field><field name=\"options\">+</field><field name=\"NAME2\">50</field><next><block type=\"hide_block\" id=\"+SE$J*L3XC9NR,){K{?-\"><field name=\"NAME\">fs</field></block></next></block></statement></block></next></block></next></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If car touches house, hide car, Won game",
            "title": "Cab Reaches Home",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"fuel_perchange_set\" id=\"}tI@5zW.Nu1m.R@aDd0P\" x=\"-73\" y=\"-1054\"><field name=\"Variable name\">op1</field><field name=\"NAME\">100</field><next><block type=\"choose__block\" id=\"}ZX$u%E!}+1UWadIY5#-\"><field name=\"Options\">3</field><next><block type=\"forever_repeat_block\" id=\"[?#RlRu{9CF(]_X`M6J3\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"JiXvi4,7:}JPntEHMvl1\"><mutation elseif=\"7\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"iIZZPCqUN(R:`*,_9kN%\"><field name=\"NAME\">left</field></block></value><statement name=\"DO0\"><block type=\"move_cab\" id=\"XqpVm^i-5$v4VX~E}7@N\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"SXO{zzzojR~g/wT29vy^\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"!],7XhT@*7f5P`v9!Xm.\"><field name=\"NAME\">right</field></block></value><statement name=\"DO1\"><block type=\"move_cab\" id=\"jCxx1Qs/0@dEOXn)1#zP\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"wyDoWc*Y(xY-x@%*,l.S\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF2\"><block type=\"key_sensing\" id=\"wcU@Nc4Q1qF~WY*~|qs:\"><field name=\"NAME\">up</field></block></value><statement name=\"DO2\"><block type=\"move_cab\" id=\"`Vc7Skyyk,+d-[k(A)fq\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"gBtuKHYU3-{%OqglB^8u\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF3\"><block type=\"key_sensing\" id=\"4}%3zjhmu4oSs+jkJ+*:\"><field name=\"NAME\">down</field></block></value><statement name=\"DO3\"><block type=\"move_cab\" id=\"`Fw1i}L~c=p@d$$edR-Q\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"~{0?r-.tsC@XiwDr6xQt\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF4\"><block type=\"key_sensing\" id=\"wj(B82R!|~MO#-L|9^Jl\"><field name=\"NAME\">shift_left</field></block></value><statement name=\"DO4\"><block type=\"slide_cab\" id=\"C.L_TBEC=m:w4caHpVBN\"><field name=\"NAME\">left</field><next><block type=\"fuel_perchange_change\" id=\"*@SN@IN~mIVuwrO=[Vh7\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF5\"><block type=\"key_sensing\" id=\"}Ka9@}elumDxoH)f/J2n\"><field name=\"NAME\">shift_right</field></block></value><statement name=\"DO5\"><block type=\"slide_cab\" id=\"NeXg3EsieR,Gev$QrO/W\"><field name=\"NAME\">right</field><next><block type=\"fuel_perchange_change\" id=\"Px6B}V425P.W?UT{3mRX\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF6\"><block type=\"key_sensing\" id=\"rpioGp}fl{z{C}5CB:^l\"><field name=\"NAME\">shift_up</field></block></value><statement name=\"DO6\"><block type=\"slide_cab\" id=\"Iskj}%$8`PO=GAC`E.55\"><field name=\"NAME\">up</field><next><block type=\"fuel_perchange_change\" id=\"ZTp2n:.[LeA8d7Jb:@*T\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><value name=\"IF7\"><block type=\"key_sensing\" id=\"/V*lmbDoaTVcOtnflpOn\"><field name=\"NAME\">shift_down</field></block></value><statement name=\"DO7\"><block type=\"slide_cab\" id=\"IdtqMkmSN,LLA]$${**/\"><field name=\"NAME\">down</field><next><block type=\"fuel_perchange_change\" id=\"lr7}FYe848nx$xFI9,Bp\"><field name=\"NAME\">op1</field><field name=\"options\">-</field><field name=\"NAME2\">0.1</field></block></next></block></statement><next><block type=\"controls_if\" id=\":+VpQz)0qr@goc+%!yq;\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"-G{?|3;TKUr{jhB#{t~i\"><field name=\"OP\">LTE</field><value name=\"A\"><block type=\"variables\" id=\"{Z!.j^dS^L]do7+jMO/t\"><field name=\"Options\">fp</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"@07)`pkt~xSxrN)[2~UL\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"game_over\" id=\"?N,l|WWDj?ruEA||$FGT\"></block></statement><next><block type=\"controls_if\" id=\"Xf+w?R7{XJyU~P6{Ua-#\"><value name=\"IF0\"><block type=\"spritetouch__block\" id=\"gz2U/Y;u}O%1I@:O]XD7\"><field name=\"options1\">car</field><field name=\"options2\">fuelstation</field></block></value><statement name=\"DO0\"><block type=\"fuel_perchange_change\" id=\"A#AEt|?DH6K.q:Bt^rs_\"><field name=\"NAME\">op1</field><field name=\"options\">+</field><field name=\"NAME2\">50</field><next><block type=\"hide_block\" id=\"+SE$J*L3XC9NR,){K{?-\"><field name=\"NAME\">fs</field></block></next></block></statement><next><block type=\"controls_if\" id=\"9t=TLJ)ovJYI%8-x]K0F\"><value name=\"IF0\"><block type=\"spritetouch__block\" id=\"Bc+tH!0|R75#3culNp#g\"><field name=\"options1\">car</field><field name=\"options2\">destination</field></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"RgVbzMbWdQzx.{bos+Lw\"><field name=\"NAME\">car</field><next><block type=\"won_game\" id=\"z7SA-D:mu@ucySU/j{v@\"></block></next></block></statement></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>"
        },
        {
            "checkbox": false,
            "rescue": false,
            "text": "Choose a best path. Use arrow keys to move the cab through the maze. Press shift and arrow keys to slide the cab and navigate wherever required. Refuel the car, and reach home before fuel ends.",
            "title": "Instructions to play the game",
            "workspace": ""
        }
    ]
};

export {
    completedFlag,
    // helpCode,
    instruction,
    runCode,
    reset_output,
    reInitValues,
    sleep,
    fnChooseStartPoint,
    fnReachAtDestination,
    left_key_is_pressed,
    right_key_is_pressed,
    up_key_is_pressed,
    down_key_is_pressed,
    shift_left_key_is_pressed,
    shift_right_key_is_pressed,
    shift_up_key_is_pressed,
    shift_down_key_is_pressed,
    is_car_touching_fuel_station,
    is_car_touching_house,
    set_fuel_pump_visible,
    set_car_visible,
    set_fuel_percentage,
    change_fuel_percentage,
    get_fuel_percentage,
    game_over,
    fnToCheckMoveDirection,
    repeat_forever_flag,
    update,
    //game,
    preload,
    create,
    fnStopCab,
    isLeftActive,
    isRightActive,
    isDownActive,
    isUpActive,
    gameWidth,
    gameHeight,
    getNoOfBlocks,
    updateImports
}