import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
// import MSPhaserLib from "../msPhaserLib.min";
// import { CANVAS, Math, Game, AUTO } from "phaser";
const demoWorkspace = Blockly.getMainWorkspace();

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
let run_ = false;
let is_game_completed = false;
let checked_bags = 0;
let dummy = 0;

const GAME_CONSTANT = {
    images: {
        BG: "images/BG.png",
        machine: "images/machine.png",

        bag1: "images/__Blue_Bag.png",
        bag2: "images/__Green_Bag.png",
        bag3: "images/__Meganta_Bag.png",
        bag4: "images/__Red_Bag.png",
        bag5: "images/__White_Bag.png",

        bander: "images/br.png",
        bandev: "images/bv.png",


        line: "images/traitinter.png",

    },
    spritesImages: {
        //bird: "Bird",
    }
};
const ERROR_MESSAGE = '';
const CORRECT_MESSAGE = '';




let weight;

let _weightBlockly; //set value uing blockly

let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;

let MiddleText; //welcome
let KGText; //KG
let wightText; //welcome

let _line1;
let _line2;
let _bande;
let Allbags = [];
let bagCounter = 0;
let CurrentBag;
// Phaser config
var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    canvasStyle: `width: 100%;
    object-fit: revert;
    aspect-ratio: 738 / 436;`,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

// Initialize Phaser with config
let game = new Phaser.Game(config);

// Phaser preload function
function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);
    loadImages();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            console.log(key);
            if (key == "BG") {
                _gameThis[key] = _gameThis.add.image(
                    gameWidth / 2,
                    gameHeight / 2,
                    key
                );
                _gameThis[key].setName(key);
            }
            if (key == "machine") {
                _gameThis[key] = _gameThis.add.image(gameWidth / 2, 0, key);
                _gameThis[key].setName(key);
                _gameThis[key].setY(gameHeight - _gameThis[key].displayHeight * 0.5);
            }
            if (key == "line") {
                _gameThis["line1"] = _gameThis.add.image(0, 0, key);
                _gameThis["line1"].setName("line1");
                _gameThis["line1"].setY(
                    _gameThis["machine"].y + _gameThis["machine"].displayHeight * 0.305
                );
                _line1 = _gameThis["line1"];

                _gameThis["line2"] = _gameThis.add.image(gameWidth / 2, 0, key);
                _gameThis["line2"].setName("line2");
                _gameThis["line2"].setY(
                    _gameThis["machine"].y + _gameThis["machine"].displayHeight * 0.305
                );
                _line2 = _gameThis["line2"];
            }
            if (key == "bander") {
                _gameThis[key] = _gameThis.add.image(
                    _gameThis["machine"].x + _gameThis["machine"].displayWidth * 0.006,
                    0,
                    key
                );
                _gameThis[key].setName(key);
                _gameThis[key].setY(
                    _gameThis["machine"].y - _gameThis["machine"].displayHeight * 0.161
                );
                _bande = _gameThis[key];
            }
            if (key.indexOf("bag") != -1) {
                _gameThis[key] = _gameThis.add.image(-600,
                    _gameThis["machine"].y + _gameThis["machine"].displayHeight * 0.1,
                    key
                );
                _gameThis[key].setName(key);
                Allbags.push(_gameThis[key]);
            }
        }
    }

    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);

    MiddleText = _gameThis.add.text(
        _gameThis["machine"].x + _gameThis["machine"].displayWidth * 0.006,
        _gameThis["machine"].y - _gameThis["machine"].displayHeight * 0.27,
        "WELCOME", { font: "bold 48px Arial", fill: "#000000" }
    );
    MiddleText.setOrigin(0.5, 0.5);
    MiddleText.setVisible(false);

    KGText = _gameThis.add.text(
        _gameThis["machine"].x + _gameThis["machine"].displayWidth * 0.047,
        _gameThis["machine"].y - _gameThis["machine"].displayHeight * 0.27,
        "KG", { font: "bold 48px Arial", fill: "#000000" }
    );
    KGText.setOrigin(0.5, 0);
    KGText.setVisible(false);

    wightText = _gameThis.add.text(
        _gameThis["machine"].x - _gameThis["machine"].displayWidth * 0.015,
        _gameThis["machine"].y - _gameThis["machine"].displayHeight * 0.345,
        "88", { font: "bold 128px Arial", fill: "#000000" }
    );
    wightText.setOrigin(0.5, 0);
    wightText.setVisible(false);

    //left mask
    const shape1 = this.add.graphics();
    shape1.fillStyle(0xffffff);
    shape1.beginPath();
    shape1.fillRect(0, _line1.y - 25, gameWidth / 2, 50);

    //right mask
    const shape2 = this.add.graphics();
    shape2.fillStyle(0xff0000);
    shape2.beginPath();
    shape2.fillRect(10 + gameWidth / 2, _line1.y - 25, gameWidth / 2, 50);

    //apply the first mask
    const mask1 = shape1.createGeometryMask();
    _line1.setMask(mask1);
    shape1.setVisible(false);

    //apply the second mask
    const mask2 = shape2.createGeometryMask();
    _line2.setMask(mask2);
    shape2.setVisible(false);
}

function game_over() {
    GameIsOver = true;
}

function start_checking() {
    //random bags
    shuffle(Allbags);
    MiddleText.setVisible(true);
}

function get_weight_of_luggage_from_weighing_scale_display() {
    _weightBlockly = Math.round(Math.random() * 40); //just for testing, must be set using blockly
    _weightBlockly = mathRandomInt(12, 45);
    return _weightBlockly;
}

function pass_luggage() {
    if (run_) {
        _bande.setTexture("bandev");
        //move bag and line
        if (run_) _gameThis.tweens.add({
            targets: _line2,
            x: gameWidth * 1,
            duration: 2000,
            delay: 1000,
            ease: "Linear",
        });
        if (run_) _gameThis.tweens.add({
            targets: CurrentBag,
            x: gameWidth * 1.2,
            duration: 2800,
            delay: 1000,
            ease: "Linear",
        });

        //totla time :3800
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 3800);
        });
    }
}

function reject_luggage() {
    if (run_) {
        _bande.setTexture("bander");

        //move bag and line
        if (run_) _gameThis.tweens.add({
            targets: _line1,
            x: 0,
            duration: 2000,
            delay: 1000,
            ease: "Linear",
        });
        if (run_) _gameThis.tweens.add({
            targets: CurrentBag,
            x: -CurrentBag.displayWidth * 0.6,
            duration: 2500,
            delay: 1000,
            ease: "Linear",
        });
        //totla time : 3500
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 3500);
        });
    }
}

function sleep(T) {
    if (run_) return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, T);
    });
}

function next_luggage() {
    if (run_) {
        checked_bags++;
        KGText.setVisible(false);
        wightText.setVisible(false);

        _line1.setX(0);
        _line2.setX(gameWidth * 0.5);
        //select next bag
        CurrentBag = Allbags[bagCounter];
        bagCounter++;
        if (bagCounter >= Allbags.length) {
            bagCounter = 0;
        }
        //set the bag in the correct position
        CurrentBag.setX(-CurrentBag.displayWidth * 0.4);
        //move bag and line
        if (run_) _gameThis.tweens.add({
            targets: _line1,
            x: gameWidth * 0.5,
            duration: 2000,
            ease: "Linear",
        });
        if (run_) _gameThis.tweens.add({
            targets: CurrentBag,
            x: gameWidth * 0.5,
            duration: 2200,
            ease: "Linear",
            onComplete: () => {
                MiddleText.setVisible(false);
                KGText.setVisible(true);
                wightText.setText(weight);
                wightText.setVisible(true);

                // if (weight > 30) {
                //     _bande.setTexture("bander");
                // } else {
                //     _bande.setTexture("bandev");
                // }
            },
        });
        //totla time : 2200
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2200);
        });
    }
}

function update() {
    // testing correctly on browser console
    // start_checking();
    // for (let i = 0; i <= 4; i++) {
    //     _weightBlockly = Math.round(Math.random() * 40); //just for testing, must be set using blockly
    //     weight = get_weight_of_luggage_from_weighing_scale_display();
    //     await next_luggage()
    //     if (weight <= 30) {
    //         await pass_luggage();
    //     } else {
    //         await reject_luggage();
    //     }
    //     await sleep(3000);
    // }
}

function loadImages() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            //console.log(key,element)
            _gameThis.load.image(key, element);
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            // _gameThis.load.spritesheet(key, "SpriteSheet/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

function ShowError() {
    ErrorText.setAlpha(1);
    ErrorText.setText(ErrorInnerText); //use error text
    //hide after 3 seconds
    _gameThis.tweens.add({
        targets: ErrorText,
        alpha: 0,
        duration: 500,
        delay: 2500,
    });
}

function Start_Game() {
    console.log("------------------->Start_Game");
}
// Re-initialize the game variables
function reInitValues() {
    run_ = false;
    is_game_completed = false;
    Allbags = [];
    bagCounter = 0;
    GameIsOver = false;
    MiddleText.setVisible(false);
    KGText.setVisible(false);
    wightText.setVisible(false);
}
// Reset the game
function reset_output() {
    console.log("reset_output");
    reInitValues();
    _gameThis.registry.destroy();
    _gameThis.events.off();
    _gameThis.scene.restart();
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

async function test() {
    start_checking();
    for (let i = 0; i <= 4; i++) {
        weight = get_weight_of_luggage_from_weighing_scale_display();
        await next_luggage();
        if (weight <= 30) {
            await pass_luggage();
        } else {
            await reject_luggage();
        }
        await sleep(3000);
    }
}

function mathRandomInt(min, max) {
    max += 1;
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
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
        // } catch { }
    }, 1000)
}



// function helpCode() {
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="single_action_block" id="%!(`([BxZrE[J;Yc{^CP" x="73" y="62"><next><block type="controls_repeat_ext" id="5eT:uEEvr.$C0pmmxP.r"><value name="TIMES"><block type="math_number" id="ZbQImS%XtSu|E*z2@sCJ"><field name="NUM">4</field></block></value><statement name="DO"><block type="repeated_action_block" id="Rn-f6m:{mw{T_.s^[[dM"><next><block type="set_variable_holder" id="06/-?1TJ/YE)=reriuYl"><field name="Variable name">weight</field><value name="NAME"><block type="display_block" id="oh2TYh;/mrZ}ooj9p$)l"></block></value><next><block type="controls_if" id="]_=$@fOwz9I1[ZP;PB/Y"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="W(`(C04B@+FY!dx|$KSI"><field name="OP">LTE</field><value name="A"><block type="variables" id="g1rt}3=#[T26R^^5EB74"><field name="Options">weight</field></block></value><value name="B"><block type="math_number" id="NN5p$JIC=Ywzv/xspdMo"><field name="NUM">30</field></block></value></block></value><statement name="DO0"><block type="action_block" id="(c|d5Rn~g.3~(D=?j1E`"></block></statement><statement name="ELSE"><block type="secondary_action_block" id="fp+)+3/+A.vfmz7`Aigo"></block></statement><next><block type="wait_block" id=",NxBE6qT,jR?P6pRELRU"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="p-l$ze*}7s62va2jyTOv"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="single_action_block" id="%!(`([BxZrE[J;Yc{^CP" x="73" y="62"><next><block type="controls_repeat_ext" id="5eT:uEEvr.$C0pmmxP.r"><value name="TIMES"><block type="math_number" id="ZbQImS%XtSu|E*z2@sCJ"><field name="NUM">4</field></block></value><statement name="DO"><block type="repeated_action_block" id="Rn-f6m:{mw{T_.s^[[dM"><next><block type="set_variable_holder" id="06/-?1TJ/YE)=reriuYl"><field name="Variable name">weight</field><value name="NAME"><block type="display_block" id="oh2TYh;/mrZ}ooj9p$)l"></block></value><next><block type="controls_if" id="]_=$@fOwz9I1[ZP;PB/Y"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="W(`(C04B@+FY!dx|$KSI"><field name="OP">LTE</field><value name="A"><block type="variables" id="g1rt}3=#[T26R^^5EB74"><field name="Options">weight</field></block></value><value name="B"><block type="math_number" id="NN5p$JIC=Ywzv/xspdMo"><field name="NUM">30</field></block></value></block></value><statement name="DO0"><block type="action_block" id="(c|d5Rn~g.3~(D=?j1E`"></block></statement><statement name="ELSE"><block type="secondary_action_block" id="fp+)+3/+A.vfmz7`Aigo"></block></statement><next><block type="wait_block" id=",NxBE6qT,jR?P6pRELRU"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="p-l$ze*}7s62va2jyTOv"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from baggage_check import *\nimport time\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function final_check() {
    setTimeout(() => {
        if (checked_bags > 3) is_game_completed = true;
    }, 2500);

}

function completedFlag() {
    return is_game_completed;
}


export {
    completedFlag,
    myUpdateFunction,
    // get_number_of_blocks,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    final_check,
    sleep,
    weight,
    dummy,
    start_checking,
    pass_luggage,
    reject_luggage,
    next_luggage,
    get_weight_of_luggage_from_weighing_scale_display
}