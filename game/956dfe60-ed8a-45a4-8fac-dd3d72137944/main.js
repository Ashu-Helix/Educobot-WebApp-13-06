import M from "materialize-css";
// import { AUTO, Game } from "phaser";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
// import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Math, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

import MSPhaserLib from "../msPhaserLib.min";

const GAME_CONSTANT = {
    images: {
        wondersOfTheWorldBg: "wondersOfTheWorldBg",
        tajMahal: "tajMahal",
        statueOfLib: "statueOfLib",
        lotus: "lotus",
        london: "london",
        egypt: "egypt",
        brazil: "brazil",
        dubai: "dubai",
        france: "france",
        hungry: "hungry",
        india: "india",
        italy: "italy",
        uk: "uk",
        egyptZoom: "egyptZoom",
        speechBubble: "speechBubble",
    },
};

const MONOMENTS = {
    tajMahal: "tajMahal",
    statueOfLib: "statueOfLib",
    lotus: "lotus",
    london: "london",
    egypt: "egypt",
    brazil: "brazil",
};

const COUNTRIES = {
    India: "India",
    UnitedStates: "UnitedStates",
    Australia: "Australia",
    London: "London",
    Egypt: "Egypt",
    Brazil: "Brazil",
};

const MAP = {
    dubai: "dubai",
    france: "france",
    hungry: "hungry",
    india: "india",
    italy: "italy",
    uk: "uk",
    egyptZoom: "egyptZoom",
};

let _gameThis = null;
const baseURL = "../img/images";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const monumentsLocation = {
    tajMahal_India: { x: 1269, y: 638, duration: 2 },
    statueOfLib_UnitedStates: { x: 441, y: 551, duration: 0.7 },
    lotus_Australia: { x: 1518, y: 865, duration: 2 },
    london_London: { x: 978, y: 373, duration: 1.5 },
    egypt_Egypt: { x: 1033, y: 623, duration: 1.5 },
    brazil_Brazil: { x: 666, y: 800, duration: 1 },
};

const monumentsInitPosition = {
    tajMahal: { x: 180, y: 570 },
    statueOfLib: { x: 75, y: 750 },
    lotus: { x: 250, y: 750 },
    london: { x: 85, y: 950 },
    egypt: { x: 260, y: 950 },
    brazil: { x: 400, y: 950 },
};

const mapPosition = {
    dubai: { x: 1150, y: 630, scaleMin: 0.05, scaleMax: 0.5 },
    france: { x: 914, y: 515, scaleMin: 0.05, scaleMax: 0.5 },
    hungry: { x: 995, y: 501, scaleMin: 0.05, scaleMax: 0.5 },
    india: { x: 1280, y: 655, scaleMin: 0.15, scaleMax: 0.5 },
    italy: { x: 951, y: 517, scaleMin: 0.05, scaleMax: 0.5 },
    uk: { x: 894, y: 451, scaleMin: 0.05, scaleMax: 0.5 },
    egyptZoom: { x: 1040, y: 625, scaleMin: 0.05, scaleMax: 0.8 },
};

const hitPoints = {
    India: { x1: 1234, y1: 564, x2: 1340, y2: 712 },
    UnitedStates: { x1: 340, y1: 493, x2: 595, y2: 617 },
    Australia: { x1: 1423, y1: 812, x2: 1607, y2: 931 },
    London: { x1: 870, y1: 425, x2: 920, y2: 480 },
    Egypt: { x1: 1021, y1: 599, x2: 1068, y2: 646 },
    Brazil: { x1: 589, y1: 735, x2: 719, y2: 895 },
};

const INCORRECT_COUNTRY = "You have selected incorrect country  ";
const INCORRECT_COUNTRY_CORDS =
    "You have selected incorrect coordinates for country  ";
const INCORRECT_MESSAGE = "You have selected wrong monument for ";
const CORRECT_MESSAGE = "You have selected correct monument for ";
let _oMSPhaserLib;
let speechBubble;
let speechText;
let countryCordsByUser = {
    India: { x: 0, y: 0 },
    UnitedStates: { x: 0, y: 0 },
    Australia: { x: 0, y: 0 },
    London: { x: 0, y: 0 },
    Egypt: { x: 0, y: 0 },
    Brazil: { x: 0, y: 0 },
};

let run_ = false;
let correct_countries = [];
let is_game_completed = false;

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

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis[element] = _gameThis.add.image(
                gameWidth / 2,
                gameHeight / 2,
                element
            );
            element != "wondersOfTheWorldBg" &&
                element != "speechBubble" &&
                (_gameThis[element].alpha = 0);
        }
    }
    initSpeechBubble();

    _gameThis.input.on("pointerdown", createDialogue);
    _gameThis.input.on("pointermove", createDialogue);
    init();
}

// Phaser update function
function update() { }

// Load images
function loadImages() {
    let images = GAME_CONSTANT.images;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element, element + ".png");
        }
    }
}

// Initialize animation functions
async function init() {
    for (const key in MONOMENTS) {
        if (Object.hasOwnProperty.call(MONOMENTS, key)) {
            const element = MONOMENTS[key];
            const elementInitPosition = monumentsInitPosition[element];
            _gameThis[element].scale = 0.5;
            _gameThis[element].x = elementInitPosition.x;
            _gameThis[element].y = elementInitPosition.y;
            _gameThis[element].alpha = 1;
        }
    }

    for (const key in MAP) {
        if (Object.hasOwnProperty.call(MAP, key)) {
            const element = MAP[key];
            const elementInitPosition = mapPosition[element];
            _gameThis[element].scale = elementInitPosition.scaleMin;
            _gameThis[element].x = elementInitPosition.x;
            _gameThis[element].y = elementInitPosition.y;
            _gameThis[element].alpha = 0.01;
            _gameThis[element].scaleMin = elementInitPosition.scaleMin;
            _gameThis[element].scaleMax = elementInitPosition.scaleMax;
            _gameThis[element].setInteractive();
            _gameThis[element].on("pointerover", function (pointer) {
                _oMSPhaserLib.setAlphaFromTo(this, 0.01, 1, 500);
                _oMSPhaserLib.scaleTo(this, this.scaleMax, 500);
            });
            _gameThis[element].on("pointerout", async function (pointer) {
                await _oMSPhaserLib.scaleTo(this, this.scaleMin, 500, true);
                _oMSPhaserLib.setAlphaFromTo(this, 1, 0.01, 500);
            });
        }
    }
}

function storeCountryCords(countryName, x, y) {
    if (countryCordsByUser[countryName]) {
        countryCordsByUser[countryName].x = x;
        countryCordsByUser[countryName].y = y;
    } else {
        M.Toast.dismissAll();
        // M.toast({ html: INCORRECT_COUNTRY + countryName });
        whichToast("error", INCORRECT_COUNTRY + countryName);
    }
}

// Move  wonders to their country.
async function moveWondersTo(monument, country) {
    // console.log(monument, country);
    if (run_) {
        let location = monumentsLocation[monument + "_" + country];
        let objMonument = _gameThis[monument];
        let duration = 1000;

        if (location) {
            let isCorrect = false;

            if (countryCordsByUser[country]) {
                let x = countryCordsByUser[country].x;
                let y = countryCordsByUser[country].y;
                let element = hitPoints[country];

                if (
                    element.x1 <= x &&
                    x <= element.x2 &&
                    element.y1 <= y &&
                    y <= element.y2
                )
                    isCorrect = true;
            } else {
                M.Toast.dismissAll();
                // M.toast({ html: INCORRECT_COUNTRY + country });
                whichToast("error", INCORRECT_COUNTRY + countryName);
            }

            if (isCorrect) {
                _oMSPhaserLib.bringOnTop(objMonument);
                if (run_) await _oMSPhaserLib.scaleTo(objMonument, 2, duration, true);
                if (run_)
                    await _oMSPhaserLib.moveOneByOneToXY(
                        objMonument,
                        location.x,
                        location.y,
                        location.duration * 1000
                    );
                if (run_) await _oMSPhaserLib.scaleTo(objMonument, 1, duration, true);
                // M.toast({ html: CORRECT_MESSAGE + country });
                whichToast("success", CORRECT_MESSAGE + country);
                correct_countries.push(country);
            } else {
                // M.toast({ html: INCORRECT_COUNTRY_CORDS + country });
                whichToast("error", INCORRECT_COUNTRY_CORDS + country);
            }
        } else {
            // M.toast({ html: INCORRECT_MESSAGE + country })
            whichToast("error", INCORRECT_MESSAGE + country);
        };
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
    try {
        let x = Math.FloorTo(pointer.x),
            y = Math.FloorTo(pointer.y);

        speechText.text = "x: " + x + ", y: " + y;
    } catch (err) {
        console.log(err);
    }
    speechText.x =
        speechBubble.x +
        (speechBubble.width * speechBubble.scale - speechText.width) / 2;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    countryCordsByUser = {
        India: { x: 0, y: 0 },
        UnitedStates: { x: 0, y: 0 },
        Australia: { x: 0, y: 0 },
        London: { x: 0, y: 0 },
        Egypt: { x: 0, y: 0 },
        Brazil: { x: 0, y: 0 },
    };
}

// Reset the game
function reset_output() {
    run_ = false;
    correct_countries = [];
    is_game_completed = false;
    reInitValues();
    _gameThis.scene.restart();
}
// function get_number_of_blocks() {
//     return demoWorkspace.getAllBlocks(false).length;
// }

function final_check() {
    setTimeout(() => {
        let ind = false,
            us = false,
            au = false,
            uk = false,
            af = false,
            bz = false;
        correct_countries.forEach((obj) => {
            if (obj == "India") {
                ind = true;
            }
            if (obj == "UnitedStates") {
                us = true;
            }
            if (obj == "Australia") {
                au = true;
            }
            if (obj == "London") {
                uk = true;
            }
            if (obj == "Egypt") {
                af = true;
            }
            if (obj == "Brazil") {
                bz = true;
            }
        });
        if (ind && au && uk && af && bz && us) is_game_completed = true;
    }, 2500);
}

function completedFlag() {
    return is_game_completed;
}

function myUpdateFunction(a) {
    // var code = Blockly.Python.workspaceToCode(demoWorkspace);
    // var import_statement = "import wonders\n";
    // document.getElementById("pycode").innerHTML = import_statement + code;
    // document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);
// const helpCode =
//     '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field><next><block type="variable_holder" id="j@G6vf(#2Jzp;p1_$*Jd"><field name="countryName">Brazil</field><value name="NAME"><block type="xy" id="6IHd)bAdr(_w/8cQol5R"><field name="x_coordinate">600</field><field name="y_coordinate">800</field></block></value><next><block type="place_block" id="qN2+:UF[er)z[^zdr!Zm"><field name="options1">brazil</field><field name="options2">Brazil</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';

function runCode() {
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
    });
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import wonders"]

function whichToast(toastType, message) {
    var toastHTML1;
    if (toastType == "success") {
        toastHTML1 = ` <div class="grid-container" >
          <img src="/assets/success-toast.png" class="custom-toast-icon"/>
          <div class="custom-toast-text"> ${message}</div>`;
    } else if (toastType == "warning") {
        toastHTML1 = `<div class="grid-container" >
          <img src="/assets/warning-toast.png" class="custom-toast-icon"/>
          <div class="custom-toast-text"> ${message}</div>`;
    } else if (toastType == "error") {
        toastHTML1 = `<div class="grid-container" >
          <img src="/assets/error-toast.png" class="custom-toast-icon"/>
          <div class="custom-toast-text"> ${message}</div>`;
    } else if (toastType == "info") {
        toastHTML1 = `<div class="grid-container" >
          <img src="/assets/info-toast.png" class="custom-toast-icon"/>
          <div class="custom-toast-text"> ${message}</div>`;
    }
    M.toast({ html: toastHTML1 });
}

// const instruction = [
//     {
//         type: "heading",
//         text: `The task is to place the monument at the appropriate country through blocks`,
//     },
//     {
//         type: "title",
//         text: `Touch the country and obtain the x,y coordinate for placing the monument at thier respective country`,
//     },
//     {
//         type: "title",
//         text: `Send Monument to respective Country (India)`,
//     },
//     {
//         type: "step",
//         text: `Set Country's x & y coordinates`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value></block></xml>',
//     },
//     {
//         type: "step",
//         text: `place monument in Country`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field></block></next></block></xml>',
//     },
//     {
//         type: "title",
//         text: `Similarly, Finish rest of the countries`,
//     },
//     {
//         type: "step",
//         text: `USA`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field></block></next></block></next></block></next></block></xml>',
//     },
//     {
//         type: "step",
//         text: `Australia`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field></block></next></block></next></block></next></block></next></block></next></block></xml>',
//     },
//     {
//         type: "step",
//         text: `UK`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
//     },
//     {
//         type: "step",
//         text: `Egypt`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
//     },
//     {
//         type: "step",
//         text: `Brazil`,
//         rescue: true,
//         checkbox: true,
//         workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field><next><block type="variable_holder" id="j@G6vf(#2Jzp;p1_$*Jd"><field name="countryName">Brazil</field><value name="NAME"><block type="xy" id="6IHd)bAdr(_w/8cQol5R"><field name="x_coordinate">600</field><field name="y_coordinate">800</field></block></value><next><block type="place_block" id="qN2+:UF[er)z[^zdr!Zm"><field name="options1">brazil</field><field name="options2">Brazil</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
//     },
// ]

const instruction = {
    heading: `The task is to place the monument at the appropriate country through blocks`,
    steps: [
        {
            title: `Touch the country and obtain the x,y coordinate for placing the monument at thier respective country`,
            text: ``,
            rescue: false,
            checkbox: false,
            workspace: '',
        },
        {
            title: `Send Monument to respective Country (India)`,
            text: `Set Country's x & y coordinates`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value></block></xml>',
        },
        {
            text: `place monument in Country`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field></block></next></block></xml>',
        },
        {
            title: `Similarly, Finish rest of the countries`,
            text: `USA`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field></block></next></block></next></block></next></block></xml>',
        },
        {
            text: `Australia`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field></block></next></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            text: `UK`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            text: `Egypt`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            text: `Brazil`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field><next><block type="variable_holder" id="j@G6vf(#2Jzp;p1_$*Jd"><field name="countryName">Brazil</field><value name="NAME"><block type="xy" id="6IHd)bAdr(_w/8cQol5R"><field name="x_coordinate">600</field><field name="y_coordinate">800</field></block></value><next><block type="place_block" id="qN2+:UF[er)z[^zdr!Zm"><field name="options1">brazil</field><field name="options2">Brazil</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
        }
    ]
}


export {
    completedFlag,
    final_check,
    // helpCode,
    reset_output,
    reInitValues,
    moveWondersTo,
    storeCountryCords,
    runCode,
    getNoOfBlocks,
    updateImports,
    instruction
};