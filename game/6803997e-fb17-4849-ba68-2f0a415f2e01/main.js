// import M from 'materialize-css';
// import {
//     AUTO,
//     Game,
// } from 'phaser';

// import MSPhaserLib from '../msPhaserLib.min';

import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img/images/";
const gameWidth = 4001;
const gameHeight = 2251;
const gameScale = 1;

const spritesElement = {
    firstBoyFever: { x: 2003, y: 1123, stayAt: 4, frameWidth: 2073, frameHeight: 2251, frameFrom: 0, frameTo: 4, frameRate: 1 },
    firstBoyFeverOk: { x: 2003, y: 1123, stayAt: 3, frameWidth: 2073, frameHeight: 2251, frameFrom: 0, frameTo: 3, frameRate: 1 },
    firstGirlFever: { x: 2003, y: 1123, stayAt: 4, frameWidth: 2073, frameHeight: 2251, frameFrom: 0, frameTo: 4, frameRate: 1 },
    firstGirlFeverOk: { x: 2003, y: 1123, stayAt: 3, frameWidth: 2073, frameHeight: 2251, frameFrom: 0, frameTo: 3, frameRate: 1 },
    secondGirlFever: { x: 2003, y: 1123, stayAt: 4, frameWidth: 2073, frameHeight: 2251, frameFrom: 0, frameTo: 4, frameRate: 1 },
    secondGirlFeverOk: { x: 2003, y: 1123, stayAt: 3, frameWidth: 2073, frameHeight: 2251, frameFrom: 0, frameTo: 3, frameRate: 1 },
    patientTemp: { x: 300, y: 1400, stayAt: 62, frameWidth: 120, frameHeight: 750, frameFrom: 0, frameTo: 62, frameRate: 38 },
    patientTempHigh: { x: 300, y: 1400, stayAt: 99, frameWidth: 120, frameHeight: 750, frameFrom: 0, frameTo: 99, frameRate: 38 },
    tempIndicator: { x: 300, y: 290, stayAt: 6, frameWidth: 270, frameHeight: 235, frameFrom: 0, frameTo: 3, frameFromHigh: 4, frameToHigh: 6, frameRate: 1 },
}

const temperatureRange = { min: 37, max: 37.5 };
const randomTemperatureRange = [36.1, 36.2, 36.3, 37.0, 39.1, 39.2, 39.3];
let _oMSPhaserLib;
let speechBubble;
let speechText;
let patientList = ['firstGirlFever', 'firstBoyFever', 'secondGirlFever'];
let patientIndex = 0;
let patientTemperature = -1;
let patientName = '';
let patient_temperature;
let default_;
let run_ = false;
let is_game_completed = false;
let patient_seen_count = 0;

const GAME_CONSTANT = {
    images: {
        medicinBG: "medicinBG",
        speechBubble: "speechBubble"
    },
    spritesImages: {
        firstBoyFever: "firstBoyFever",
        firstBoyFeverOk: "firstBoyFeverOk",
        firstGirlFever: "firstGirlFever",
        firstGirlFeverOk: "firstGirlFeverOk",
        secondGirlFever: "secondGirlFever",
        secondGirlFeverOk: "secondGirlFeverOk",
        patientTemp: "patientTemp",
        patientTempHigh: "patientTempHigh",
        tempIndicator: "tempIndicator"
    }
};
const INCORRECT_MESSAGE = 'Wrong temperature entry.';
const CORRECT_MESSAGE = 'Correct Message: <Write correct message here>';

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
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
    loadImages();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    //used for  static image
    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis[element] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
        }
    }
    initSpeechBubble();
    // used for dynamic sprite image
    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
            _gameThis[element].visible = false;
        }
    }

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
            _gameThis.load.image(element, "" + element + ".png");
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis.load.spritesheet(element, "" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

// Initialize animation functions
async function init() {
    // getPatientTemperature();
    shuffleArray(patientList);
    //_gameThis['highTemp39_1'].visible = true;
    _gameThis['patientTemp'].scale = 2.3;
    _gameThis['patientTempHigh'].scale = 2.3;
    // _gameThis['tempIndicator'].visible = true;
    _gameThis['tempIndicator'].scale = 2.2;
    //checkTemp(36, 'firstGirlFever');
    //createDialogue('Hello');
}

function getRandomNumberBetween(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

// Get patient's temperature
async function getPatientTemperature() {
    if (run_) {
        if (JSON.stringify(patientList) !== JSON.stringify([])) {
            patient_seen_count++;
            const index = getRandomNumberBetween(0, randomTemperatureRange.length);
            patientTemperature = randomTemperatureRange[index];

            patientIndex = patientIndex % patientList.length;
            patientName = patientList[patientIndex++];

            // console.log(patientTemperature, patientIndex, patientName);
            hideAll();
            let elementValue = spritesElement[patientName];
            let oTarget = _gameThis[patientName];

            oTarget.visible = true;
            if (run_) _oMSPhaserLib.spriteAnimation(oTarget, patientName, 0, 1, elementValue.frameRate, 0);

            let temperatureMeter = isTemperatureHigh(patientTemperature) ? 'patientTempHigh' : 'patientTemp';
            let elementValue2 = spritesElement[temperatureMeter];
            let oTarget2 = _gameThis[temperatureMeter];
            oTarget2.visible = true;
            if (run_) _oMSPhaserLib.spriteAnimation(oTarget2, temperatureMeter, elementValue2.frameFrom, elementValue2.frameTo, elementValue2.frameRate, 0);

            let oTarget3 = _gameThis['tempIndicator'];
            oTarget3.visible = true;
            const frameNumber = randomTemperatureRange.indexOf(patientTemperature);
            if (run_) _oMSPhaserLib.stopSpriteAt(oTarget3, 'tempIndicator', frameNumber);

            if (run_) await sleep(5000);
            // callNextPatient();
            return patientTemperature;
        } else {
            M.toast({ html: "All patients consulted for today. No more left" });
            return;
        }
    }
}

function isTemperatureHigh(temperature) {
    return temperature > temperatureRange.max;
}

// Randomize array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Hide all element
function hideAll() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            _gameThis[element].visible = false;
        }
    }

}

function checkTemp(temperature, patientName) {
    if (temperature) {
        if (temperature > temperatureRange.max)
            showResult(patientName, 'patientTempHigh', 'High');
        else if (temperature >= temperatureRange.min && temperature <= temperatureRange.max)
            showResult(patientName + 'Ok', 'patientTemp', '');
        else
            M.toast({ html: INCORRECT_MESSAGE });
    } else
        M.toast({ html: INCORRECT_MESSAGE });
}

async function showResult(patientName, temperature, tempIndicatorType) {
    if (run_) {
        hideAll();
        let elementValue = spritesElement[patientName];
        let oTarget = _gameThis[patientName];

        oTarget.visible = true;
        _oMSPhaserLib.spriteAnimation(oTarget, patientName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 0);

        let temperatureMeter = isTemperatureHigh(patientTemperature) ? 'patientTempHigh' : 'patientTemp';
        let elementValue2 = spritesElement[temperatureMeter];
        let oTarget2 = _gameThis[temperatureMeter];
        oTarget2.visible = true;
        _oMSPhaserLib.spriteAnimation(oTarget2, temperatureMeter, elementValue2.frameFrom, elementValue2.frameTo, elementValue2.frameRate, 0);

        let oTarget3 = _gameThis['tempIndicator'];
        oTarget3.visible = true;
        const frameNumber = randomTemperatureRange.indexOf(patientTemperature);
        _oMSPhaserLib.stopSpriteAt(oTarget3, 'tempIndicator', frameNumber);

        if (run_) await sleep(5000);
    }
}

async function checkTempUsingBlockly(_obj) {
    patientIndex = patientIndex % patientList.length;
    checkTemp(_obj.temperature, patientList[patientIndex++]);
    if (run_) await sleep(1000);
    createDialogue(_obj.sayMsg[0]);
}

async function giveMedicine() {
    if (run_) await showResult(patientName, 'patientTempHigh', 'High');
}

async function normalTemperature() {
    if (run_) await showResult(patientName + 'Ok', 'patientTemp', '');
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.7;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 100;
    speechBubble.y = 100;
    speechBubble.setOrigin(0);

    let speechTextWidth = speechBubble.width * speechBubble.scale - 40;
    speechText = _gameThis.add.text(0, 0, 'Hello World', {
        font: '64pt arial',
        color: '#000000',
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true }
    });
    speechText.x = speechBubble.x + 40;
    speechText.y = speechBubble.y + (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
    speechBubble.alpha = speechText.alpha = 0;
}

// Create dialogue
function createDialogue(dialogue) {
    return new Promise(function (myResolve, myReject) {
        if (run_) {
            speechText.text = dialogue;
            speechBubble.alpha = 1;
            _oMSPhaserLib.fadeIn(speechBubble);
            _oMSPhaserLib.fadeIn(speechText);
            setTimeout(() => {
                _oMSPhaserLib.fadeOut(speechBubble);
                _oMSPhaserLib.fadeOut(speechText);
                setTimeout(() => {
                    myResolve();
                }, 1000);
            }, 3000);

        } else {
            myResolve();
        }
    });
}

async function callNextPatient(_nextPatient) {
    patientList.shift();
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) await _oMSPhaserLib.sleep(ms);
}

function reInitValues() {
    is_game_completed = false;
    run_ = false;
    patientIndex = 0;
    patientTemperature = -1;
    patient_seen_count = 0;
    patientList = ['firstGirlFever', 'firstBoyFever', 'secondGirlFever'];
}

// Reset the game
function reset_output() {
    reInitValues()
    _gameThis.scene.restart();
}


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

// function helpCode() {
//     var xml_code = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="_]1MU]1Iq5~K_d7TdjhG" x="8" y="44"><value name="TIMES"><block type="math_number" id="U:kSY/sd}@EQH,8=qQOC"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="OyZ2!B8V2T22-xqtk(*!"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="TI1qN3j5-9vER(E19!ZV"></block></value><next><block type="controls_if" id="RT;-!31$vY-o!^-Nx}]T"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id=";-gBLo^@oWxDLfDGoZR+"><field name="OP">GTE</field><value name="A"><block type="variables" id=";3)TL)~Scq{HxIcYUYL,"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="ES80%B2F_z6q-)RUZSNr"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id="V]@kd?i`?e|71d3jp`]["><field name="NAME">Please eat these medicines</field><next><block type="action_block" id="^YJOQ=^6e4:eJarSkkBq"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="TVY]f%R-1e-5o:rRSHyc"><field name="NAME">You don\'t have fever!</field><next><block type="normal_temperature" id="|sH24j*/`K+Tt,];bRr["></block></next></block></statement><next><block type="wait_block" id="zS[:ZC*|},`$e95FMX=:"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="V;4SJ|[CwDR`ub0nGP~;"><field name="NUM">3</field></block></value><next><block type="say_block" id="D{z41q3#Pp5R]/2XKJ`F"><field name="NAME">Next Patient please</field></block></next></block></next></block></next></block></statement><next><block type="say_block" id="27K3sl9N{9u;Ek/9liw@"><field name="NAME">All Patients have been consulted today</field></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_code);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="_]1MU]1Iq5~K_d7TdjhG" x="8" y="44"><value name="TIMES"><block type="math_number" id="U:kSY/sd}@EQH,8=qQOC"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="OyZ2!B8V2T22-xqtk(*!"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="TI1qN3j5-9vER(E19!ZV"></block></value><next><block type="controls_if" id="RT;-!31$vY-o!^-Nx}]T"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id=";-gBLo^@oWxDLfDGoZR+"><field name="OP">GTE</field><value name="A"><block type="variables" id=";3)TL)~Scq{HxIcYUYL,"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="ES80%B2F_z6q-)RUZSNr"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id="V]@kd?i`?e|71d3jp`]["><field name="NAME">Please eat these medicines</field><next><block type="action_block" id="^YJOQ=^6e4:eJarSkkBq"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="TVY]f%R-1e-5o:rRSHyc"><field name="NAME">You don\'t have fever!</field><next><block type="normal_temperature" id="|sH24j*/`K+Tt,];bRr["></block></next></block></statement><next><block type="wait_block" id="zS[:ZC*|},`$e95FMX=:"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="V;4SJ|[CwDR`ub0nGP~;"><field name="NUM">3</field></block></value><next><block type="say_block" id="D{z41q3#Pp5R]/2XKJ`F"><field name="NAME">Next Patient please</field></block></next></block></next></block></next></block></statement><next><block type="say_block" id="27K3sl9N{9u;Ek/9liw@"><field name="NAME">All Patients have been consulted today</field></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "import doctor\nimport time\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);



function get_number_of_blocks() {
    return demoWorkspace.getAllBlocks(false).length;
}

function final_check() {
    setTimeout(() => {
        // if (JSON.stringify(patientList) == JSON.stringify([])) {
        if (patient_seen_count >= 3) {
            M.toast({ html: "Great! All patients consulted today" });
            setTimeout(() => { is_game_completed = true; }, 2500)
        } else {
            M.toast({ html: "Oops! there are more patients left to consult" });
        }

    }, 2500)
}

function completedFlag() {
    return is_game_completed;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import doctor", "import time"];

export {
    completedFlag,
    myUpdateFunction,
    get_number_of_blocks,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    final_check,
    patient_temperature,
    sleep,
    normalTemperature,
    giveMedicine,
    createDialogue,
    getPatientTemperature,
    getNoOfBlocks,
    updateImports
}

// var xml = Blockly.Xml.workspaceToDom(demoWorkspace);
// Blockly.Xml.domToText(xml);