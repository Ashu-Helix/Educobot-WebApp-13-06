/* Developed by Marvsoft LLP */

import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let selectedVehicle = null;
let selectedPath = null;
let nIndexPath = 0;
let createdPath = null;
let graphics;
let isVehicleMoving = false;
let fnCallback = null;
let speechBubble;
let speechText;
let run_ = false;
let d1 = false;
let d2 = false;
let d3 = false;
let d4 = false;
let is_game_completed = false;

let baseURL = "../img";
let gameWidth = 960;
let gameHeight = 540;
let gameScale = 0.5;
let road = [
    { x: gameWidth * 0.3, y: 0 },
    { x: gameWidth * 0.706, y: 0 },
    { x: 0, y: gameHeight * 0.8 },
];
let directionAngle = { right: 0, bottom: 1, left: 2, top: 3 };
let rotateDirAngle = Math.PI / 2;
let roadWidth = gameWidth * 0.1;
let vehicleInitialPosition = {
    ambulance: {
        direction: "bottom",
        road: 1,
        position: { x: 677, y: 305 },
        source: null,
        target: null,
    },
    bus: {
        direction: "right",
        road: 1,
        position: { x: 85, y: 445 },
        source: null,
        target: null,
    },
    fireBrigade: {
        direction: "bottom",
        road: 1,
        position: { x: 323, y: 60 },
        source: null,
        target: null,
    },
    policeCar: {
        direction: "left",
        road: 1,
        position: { x: 900, y: 500 },
        source: null,
        target: null,
    },
};
let buildingPosition = [
    { x1: 100, y1: 250, x2: 140, y2: 280, name: 'hospital' },
    { x1: 450, y1: 230, x2: 490, y2: 260, name: 'busStand' },
    { x1: 810, y1: 210, x2: 850, y2: 240, name: 'fireStation' },
    { x1: 450, y1: 160, x2: 490, y2: 190, name: 'policeStation' }
];
let paths = {
    ambulance_hospital: [
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 505, duration: 1500, direction: "bottom" },
        { x: 266, y: 505, duration: 2000, direction: "left" },
        { x: 266, y: 267, duration: 2000, direction: "top" },
        { x: 100, y: 267, duration: 2000, direction: "left" },
    ],
    ambulance_busStand: [
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 242, duration: 1500, direction: "bottom" },
        { x: 477, y: 242, duration: 1500, direction: "left" },
    ],
    ambulance_fireStation: [
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 228, duration: 1500, direction: "bottom" },
        { x: 797, y: 228, duration: 1500, direction: "right" },
    ],
    ambulance_policeStation: [
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 305, duration: 1, direction: "bottom" },
        { x: 677, y: 170, duration: 1500, direction: "bottom" },
        { x: 450, y: 170, duration: 2000, direction: "left" },

    ],

    bus_hospital: [
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 266, y: 445, duration: 1500, direction: "right" },
        { x: 266, y: 267, duration: 2000, direction: "top" },
        { x: 100, y: 267, duration: 2000, direction: "left" },
    ],
    bus_busStand: [
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 266, y: 445, duration: 1500, direction: "right" },
        { x: 266, y: 244, duration: 1500, direction: "top" },
        { x: 460, y: 244, duration: 1500, direction: "right" },
    ],
    bus_fireStation: [
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 620, y: 448, duration: 2000, direction: "right" },
        { x: 620, y: 225, duration: 1000, direction: "top" },
        { x: 840, y: 225, duration: 1000, direction: "right" },
    ],
    bus_policeStation: [
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 85, y: 445, duration: 1, direction: "right" },
        { x: 266, y: 445, duration: 1500, direction: "right" },
        { x: 266, y: 175, duration: 1500, direction: "top" },
        { x: 460, y: 175, duration: 1500, direction: "right" },
    ],

    fireBrigade_hospital: [
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 325, y: 260, duration: 2000, direction: "bottom" },
        { x: 70, y: 260, duration: 2000, direction: "left" },
    ],
    fireBrigade_busStand: [
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 325, y: 245, duration: 2000, direction: "bottom" },
        { x: 480, y: 245, duration: 2000, direction: "right" },
    ],
    fireBrigade_fireStation: [
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 323, y: 448, duration: 1500, direction: "bottom" },
        { x: 620, y: 448, duration: 2000, direction: "right" },
        { x: 620, y: 228, duration: 1000, direction: "top" },
        { x: 815, y: 228, duration: 1000, direction: "right" },
    ],
    fireBrigade_policeStation: [
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 323, y: 60, duration: 1, direction: "bottom" },
        { x: 325, y: 175, duration: 2000, direction: "bottom" },
        { x: 480, y: 175, duration: 2000, direction: "right" },
    ],

    policeCar_hospital: [
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 266, y: 505, duration: 2000, direction: "left" },
        { x: 266, y: 267, duration: 2000, direction: "top" },
        { x: 50, y: 267, duration: 2000, direction: "left" },
    ],
    policeCar_busStand: [
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 620, y: 500, duration: 2000, direction: "left" },
        { x: 620, y: 250, duration: 2000, direction: "top" },
        { x: 465, y: 250, duration: 2000, direction: "left" },
    ],
    policeCar_fireStation: [
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 620, y: 500, duration: 2000, direction: "left" },
        { x: 620, y: 220, duration: 2000, direction: "top" },
        { x: 815, y: 220, duration: 2000, direction: "right" },
    ],
    policeCar_policeStation: [
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 900, y: 500, duration: 1, direction: "left" },
        { x: 620, y: 500, duration: 2000, direction: "left" },
        { x: 620, y: 175, duration: 2000, direction: "top" },
        { x: 465, y: 175, duration: 2000, direction: "left" },
    ],
};

const GAME_CONSTANT = {
    vehicleRushBg: "vehicleRushBg",
    ambulance: "ambulance",
    bus: "bus",
    fireBrigade: "fireBrigade",
    policeCar: "policeCar",
    destination_0_0: "hospital",
    destination_1_0: "policeStation",
    destination_2_0: "fireStation",
    destination_1_1: "busStand",
    speechBubble: 'speechBubble'
};
const INCORRECT_MESSAGE = 'You have entered the incorrect coordinates for the building.';
const CORRECT_MESSAGE = 'You have entered the correct coordinates for the building.';



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
    loadImages();
}

// Phaser create function
function create() {
    let gameBg = _gameThis.add.image(
        gameWidth / 2,
        gameHeight / 2,
        GAME_CONSTANT.vehicleRushBg
    );
    gameBg.scale = gameScale;

    addVehicle(GAME_CONSTANT.ambulance);
    addVehicle(GAME_CONSTANT.bus);
    addVehicle(GAME_CONSTANT.fireBrigade);
    addVehicle(GAME_CONSTANT.policeCar);

    let element = GAME_CONSTANT.speechBubble;
    _gameThis[element] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
    initSpeechBubble();
    _gameThis.input.on("pointerdown", createDialogue);
    _gameThis.input.on("pointermove", createDialogue);
    // moveVehicleTo(GAME_CONSTANT.ambulance, GAME_CONSTANT.hospital);
}

// Phaser update function
function update() {
    if (isVehicleMoving) {
        // graphics.clear();
        // graphics.lineStyle(1, 0xffffff, 1);
        // createdPath.draw(graphics);

        var t = selectedVehicle.z;
        if (t > 0) {
            var vec = selectedVehicle.getData("vector");
            createdPath.getPoint(t, vec);
            selectedVehicle.setPosition(vec.x, vec.y);
        }
    }
}

// Load images
function loadImages() {
    _gameThis.load.image(
        GAME_CONSTANT.vehicleRushBg,
        "images/" + GAME_CONSTANT.vehicleRushBg + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.ambulance,
        "images/" + GAME_CONSTANT.ambulance + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.bus,
        "images/" + GAME_CONSTANT.bus + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.fireBrigade,
        "images/" + GAME_CONSTANT.fireBrigade + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.policeCar,
        "images/" + GAME_CONSTANT.policeCar + ".png"
    );
    _gameThis.load.image(
        GAME_CONSTANT.speechBubble,
        "images/" + GAME_CONSTANT.speechBubble + ".png"
    );
}

// Add vehicle to the scene
function addVehicle(vehicleName) {
    let vehicleInitialDetails = vehicleInitialPosition[vehicleName];
    let direction = vehicleInitialDetails.direction;
    let angle = directionAngle[direction];

    let vehicle = _gameThis.add.image(
        vehicleInitialDetails.position.x,
        vehicleInitialDetails.position.y,
        vehicleName
    );
    vehicle.scale = gameScale;
    vehicle.rotation = rotateDirAngle * angle;
    vehicle.name = vehicleName;
}

// Move vehicle to it's destination
function moveVehicleTo(vehicleName, destination, p_fnCallback) {
    if (run_) {
        fnCallback = p_fnCallback;
        nIndexPath = 0;
        let destinationName = '';
        let x = parseInt(destination.x);
        let y = parseInt(destination.y);

        for (let i = 0; i < buildingPosition.length; i++) {
            const element = buildingPosition[i];

            if (element.x1 <= x && x <= element.x2 && element.y1 <= y && y <= element.y2) {
                destinationName = element.name;
                break;
            }
        }

        selectedPath = paths[vehicleName + "_" + destinationName];
        if (selectedPath !== undefined) {
            isVehicleMoving = true;
            selectedVehicle = _gameThis.children.getByName(vehicleName);
            moveOnPath();

            M.Toast.dismissAll();
            M.toast({ html: "You have sent " + vehicleName + " to " + destinationName + " correctly." });
            if (destinationName == "hospital")
                d1 = true;
            if (destinationName == "policeStation")
                d2 = true;
            if (destinationName == "fireStation")
                d3 = true;
            if (destinationName == "busStand")
                d4 = true;

        } else {
            M.Toast.dismissAll();
            M.toast({ html: "Target coordinates for " + vehicleName + " is Incorrect!" });
        }
    }
}

// Move object on selected path
function moveOnPath() {
    graphics = _gameThis.add.graphics();
    selectedVehicle.setData("vector", new Phaser.Math.Vector2());

    createdPath = new Phaser.Curves.Path(
        selectedPath[nIndexPath].x,
        selectedPath[nIndexPath++].y
    );

    createdPath.lineTo(selectedPath[nIndexPath].x, selectedPath[nIndexPath].y);
    let angle = directionAngle[selectedPath[nIndexPath].direction];
    selectedVehicle.rotation = rotateDirAngle * angle;

    let tween = _gameThis.tweens.add({
        targets: selectedVehicle,
        z: 1,
        ease: "Linear",
        duration: /* 500, */ selectedPath[nIndexPath].duration,
        yoyo: false,
        repeat: 0,
    });

    tween.on("complete", () => {
        if (nIndexPath + 1 < selectedPath.length) {
            setTimeout(() => {
                moveOnPath();
            }, 1);
        } else {
            isVehicleMoving = false;
            fnCallback && fnCallback();
        }
    });
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.speechBubble];
    speechBubble.scale = 0.12;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 90;
    speechBubble.y = 0;
    speechBubble.setOrigin(0);

    let speechTextWidth = speechBubble.width * speechBubble.scale - 10;
    speechText = _gameThis.add.text(0, 0, 'x: 1920, y: 1080', {
        font: '14pt arial',
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

// Reset the game
function reset_output() {
    run_ = false;
    d1 = d2 = d3 = d4 = false;
    _gameThis.scene.restart();
}


var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    // Re-initialize the game variables
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

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="move" id="XA]$l*l/^5~kqisG_eg%" x="43" y="172"><field name="vehicle">ambulance</field><value name="NAME"><block type="xy" id=".n{-F^laf4/~!tyS_XY5"><field name="x_coordinate">119</field><field name="y_coordinate">268</field></block></value><next><block type="move" id="ufF6?X$lg!#XM!5Wl#xA"><field name="vehicle">bus</field><value name="NAME"><block type="xy" id="49FS3SZX%y:FGLH~~Zv)"><field name="x_coordinate">472</field><field name="y_coordinate">242</field></block></value><next><block type="move" id="dJcN[.Yngsz:TC`LNE]t"><field name="vehicle">fireBrigade</field><value name="NAME"><block type="xy" id="my$$,GTE|RH085FL7N|l"><field name="x_coordinate">824</field><field name="y_coordinate">226</field></block></value><next><block type="move" id="](B0K~(PhTlRUh~{hl;U"><field name="vehicle">policeCar</field><value name="NAME"><block type="xy" id=";@$MRI(vs?|1W*E#K!pN"><field name="x_coordinate">466</field><field name="y_coordinate">175</field></block></value></block></next></block></next></block></next></block></xml>';

function completedFlag() {
    if (d1 && d2 && d3 && d4)
        setTimeout(() => { is_game_completed = true; }, 10000)
    return is_game_completed
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

export { completedFlag, reset_output, runCode, helpCode, GAME_CONSTANT, moveVehicleTo, getNoOfBlocks }