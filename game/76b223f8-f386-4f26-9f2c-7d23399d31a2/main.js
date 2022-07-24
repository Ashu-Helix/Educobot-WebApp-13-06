import M from 'materialize-css';
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;


let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const rocketSpeed = 200; //300;
const cometSpeed = 350;
const randomTimingRange = 2000;
let game_is_over = false;

const spritesElement = {
    rocket: { x: 50, y: 1080, stayAt: 0, frameWidth: 447, frameHeight: 329, frameFrom: 0, frameTo: 1, frameRate: 8, targetX: 1900, targetY: 44, time: 8000, scaleTo: 0.6 },
    slowComet: { x: 90, y: 90, stayAt: 0, frameWidth: 454, frameHeight: 280, frameFrom: 0, frameTo: 5, frameRate: 8, targetX: 1800, targetY: 800, time: 3000 },
    fastComet1: { x: 1900, y: 500, stayAt: 15, frameWidth: 454, frameHeight: 280, frameFrom: 0, frameTo: 2, frameRate: 8, targetX: -100, targetY: 500, time: 3500 },
    fastComet2: { x: 900, y: 0, stayAt: 15, frameWidth: 454, frameHeight: 280, frameFrom: 0, frameTo: 2, frameRate: 8, targetX: 900, targetY: 1100, time: 1600 },
    explosion: { x: 900, y: 0, stayAt: 15, frameWidth: 64, frameHeight: 64, frameFrom: 0, frameTo: 15, frameRate: 8, scale: 4 }
}

const GAME_CONSTANT = {
    images: {
        spaceshipStoryBG: "spaceshipStoryBG"
    },
    spritesImages: {
        rocket: "rocket",
        slowComet: "slowComet",
        fastComet1: "fastComet1",
        fastComet2: "fastComet2",
        explosion: "explosion"
    }
};

const INCORRECT_MESSAGE = 'Spaceship crashed!';
const CORRECT_MESSAGE = 'Spaceship reached planet successfully!';

let _oMSPhaserLib;
let canHideComet = false;
let canHideRocket = false;
let canBlastRocket = false;
let canEndAll = false;
let isGameOver = false;
window['isGameOver'] = isGameOver;
let touchedComet = null;
window['touchedComet'] = touchedComet;
let isRocketHitComet = false;
window['isRocketHitComet'] = false

// Phaser config
let config = {
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
window['game'] = new Phaser.Game(config);

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
            _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.physics.add.sprite(elementValue.x, elementValue.y, element);
            _gameThis[element].visible = false;
        }
    }

    // init();
}

// Phaser update function
function update() {
    /*  if (!isGameOver) {
       if (rocket_touches_planet()) {
         win_game();
       }
     } */
}

function rocket_touches_planet() {
    let elementName = GAME_CONSTANT.spritesImages.rocket;
    let oTarget = _gameThis[elementName];

    return oTarget.x > gameWidth - oTarget.width / 2
}

function hideRocket() {
    console.log('hideRocket');
    let rocket = _gameThis[GAME_CONSTANT.spritesImages.rocket];
    rocket.visible = false;
}

function win_game() {
    let elementName = GAME_CONSTANT.spritesImages.rocket;
    let oTarget = _gameThis[elementName];
    let elementValue = spritesElement[elementName];

    isGameOver = true;
    window['isGameOver'] = true;
    oTarget.setVelocityX(0);
    oTarget.setVelocityY(0);
    _oMSPhaserLib.stopSpriteAt(oTarget, elementName, elementValue.stayAt);
    M.toast({ html: CORRECT_MESSAGE });
    setTimeout(() => { game_is_over = true; }, 2500)
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

            _gameThis.load.spritesheet(element, "images/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

// Initialize animation functions
async function init() {
    await sleep(1100);
    setCollision();
    flyRocket();
    flyComet();
}

function setCollision() {
    let rocket = _gameThis[GAME_CONSTANT.spritesImages.rocket];
    let slowComet = _gameThis[GAME_CONSTANT.spritesImages.slowComet];
    let fastComet1 = _gameThis[GAME_CONSTANT.spritesImages.fastComet1];
    let fastComet2 = _gameThis[GAME_CONSTANT.spritesImages.fastComet2];

    _gameThis.physics.add.overlap(rocket, slowComet, onRocketHitComet, null, _gameThis);
    _gameThis.physics.add.overlap(rocket, fastComet1, onRocketHitComet, null, _gameThis);
    _gameThis.physics.add.overlap(rocket, fastComet2, onRocketHitComet, null, _gameThis);

    // _gameThis.physics.add.overlap(rocket, slowComet, blastRocket, null, _gameThis);
    // _gameThis.physics.add.overlap(rocket, fastComet1, blastRocket, null, _gameThis);
    // _gameThis.physics.add.overlap(rocket, fastComet2, blastRocket, null, _gameThis);
}

function onRocketHitComet() {
    isRocketHitComet = true;
    window['isRocketHitComet'] = true;
}

// Blast Rocket
function blastRocket(rocket, comet) {
    // if ((canHideRocket || canBlastRocket) && !isGameOver) {
    if (!isGameOver) {
        let rocket = _gameThis[GAME_CONSTANT.spritesImages.rocket];
        isGameOver = true;
        window['isGameOver'] = true;
        // if (canBlastRocket) {
        let elementName = GAME_CONSTANT.spritesImages.explosion;
        let oTarget = _gameThis[elementName];
        let elementValue = spritesElement[elementName];

        oTarget.x = rocket.x;
        oTarget.y = rocket.y;
        oTarget.scale = elementValue.scale;
        oTarget.visible = true;
        _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 0);

        rocket.destroy();
        M.toast({ html: INCORRECT_MESSAGE });
    }
    // comet.destroy();
}


// Fly rocket
function flyRocket() {
    let elementName = GAME_CONSTANT.spritesImages.rocket;
    let oTarget = _gameThis[elementName];
    let elementValue = spritesElement[elementName];

    oTarget.visible = true;
    _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, -1);
    oTarget.setVelocityX(rocketSpeed);
    oTarget.setVelocityY(-rocketSpeed * gameHeight / gameWidth);
    oTarget.setBodySize(oTarget.width * 0.9, oTarget.height * 0.8, true);
    _oMSPhaserLib.scaleTo(oTarget, elementValue.scaleTo, elementValue.time)
}

// Fly rocket
async function flyComet() {
    let oTarget = _gameThis[GAME_CONSTANT.spritesImages.slowComet];
    oTarget.x = Math.random() * gameWidth / 2;
    animateComet(GAME_CONSTANT.spritesImages.slowComet);
    oTarget.setVelocityX(cometSpeed);
    oTarget.setVelocityY(cometSpeed * gameHeight / gameWidth);
    oTarget.setCircle(70, 300, 140);

    await sleep(Math.floor(Math.random() * randomTimingRange));
    oTarget = _gameThis[GAME_CONSTANT.spritesImages.fastComet1];
    oTarget.y = Math.random() * gameHeight * 0.8 + gameHeight * 0.1;
    animateComet(GAME_CONSTANT.spritesImages.fastComet1);
    oTarget.setVelocityX(-cometSpeed);
    oTarget.scaleX = -oTarget.scaleX;
    oTarget.setCircle(70, 440, 140);

    await sleep(Math.floor(Math.random() * randomTimingRange));
    oTarget = _gameThis[GAME_CONSTANT.spritesImages.fastComet2];
    oTarget.x = Math.random() * gameWidth / 2 + gameWidth / 4;
    animateComet(GAME_CONSTANT.spritesImages.fastComet2);
    oTarget.setVelocityY(cometSpeed);
    oTarget.setCircle(70, 300, 140);
}

// Animaten sprite images
function animateComet(elementName) {
    let oTarget = _gameThis[elementName];
    let elementValue = spritesElement[elementName];

    oTarget.visible = true;
    _oMSPhaserLib.spriteAnimation(oTarget, elementName, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, -1);
    oTarget.setInteractive();
    oTarget.on('pointerdown', onClickComet);
    // oTarget.on('pointerdown', hideComet);
}

function reset_looper() {
    touchedComet = null;
    window['touchedComet'] = null;
    isRocketHitComet = false;
    window['isRocketHitComet'] = false;
}

// Clicked on comet
function onClickComet() {
    touchedComet = this;
    window['touchedComet'] = this;
}

// Remove comet
function hideComet() {

    // canHideComet && this.destroy();
    //(touchedComet != null) && touchedComet.destroy();
    (window['touchedComet'] != null) && window['touchedComet'].destroy();


}

// Add event to hide comet
function addEventToHideMeteorite() {
    canHideComet = true;
}

// Add event to end all
function addEventToEndAll() {
    canEndAll = true;
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    game_is_over = false;
    canHideComet = false;
    canHideRocket = false;
    canBlastRocket = false;
    canEndAll = false;
    isGameOver = false;
    window['isGameOver'] = false
    touchedComet = null;
    window['touchedComet'] = null;
    isRocketHitComet = false;
    window['isRocketHitComet'] = false;
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

function completedFlag() {
    return game_is_over;
}
var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    reInitValues();
    init();
    window.LoopTrap = 1E3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
    try {
        eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
        }, 500);
        setTimeout(() => {
            repeat_forever_flag = true;
        }, 1000);
    } catch (b) { alert(b) }
    // try {
    //     if (tour.getCurrentStep().options.title.includes("Run")) {
    //         let btns = document.querySelectorAll('.shepherd-button');
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="sJqcU9xT8$WLGjjE[wI:" x="37" y="43"><statement name="NAME"><block type="controls_if" id="~)M/SMWWN9njnuZ|v96l"><value name="IF0"><block type="pointertouch__block" id="QBUO}SdI!6CN(1AVjw65"><field name="options2">meteorite</field></block></value><statement name="DO0"><block type="hide_block" id="WY16/.B[k{9gW]K$4-l,"><field name="NAME">meteorite</field></block></statement><next><block type="controls_if" id="uZLPE|u%DUq%N`4=[CJV"><value name="IF0"><block type="spritetouch__block" id="*;}~SEfavxXk=r?4R^D6"><field name="options1">rocket</field><field name="options2">meteorite</field></block></value><statement name="DO0"><block type="action_block" id="90py`[I[EV9DdDK;MQfd"></block></statement><next><block type="controls_if" id="Co0:Uk,whPB7**/K*B$9"><value name="IF0"><block type="spritetouch__block" id="F2z$nb:UjV40dGG0(]^}"><field name="options1">rocket</field><field name="options2">planet</field></block></value><statement name="DO0"><block type="end_block" id="=%:SuhDej[r%[rEJI?3@"></block></statement></block></next></block></next></block></statement></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="sJqcU9xT8$WLGjjE[wI:" x="37" y="43"><statement name="NAME"><block type="controls_if" id="~)M/SMWWN9njnuZ|v96l"><value name="IF0"><block type="pointertouch__block" id="QBUO}SdI!6CN(1AVjw65"><field name="options2">meteorite</field></block></value><statement name="DO0"><block type="hide_block" id="WY16/.B[k{9gW]K$4-l,"><field name="NAME">meteorite</field></block></statement><next><block type="controls_if" id="uZLPE|u%DUq%N`4=[CJV"><value name="IF0"><block type="spritetouch__block" id="*;}~SEfavxXk=r?4R^D6"><field name="options1">rocket</field><field name="options2">meteorite</field></block></value><statement name="DO0"><block type="action_block" id="90py`[I[EV9DdDK;MQfd"></block></statement><next><block type="controls_if" id="Co0:Uk,whPB7**/K*B$9"><value name="IF0"><block type="spritetouch__block" id="F2z$nb:UjV40dGG0(]^}"><field name="options1">rocket</field><field name="options2">planet</field></block></value><statement name="DO0"><block type="end_block" id="=%:SuhDej[r%[rEJI?3@"></block></statement></block></next></block></next></block></statement></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from cab_rush import *\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from space_story import *"]

const instruction = {
    "heading": "Help Reach the rocket to the planet and destroy the meteorite by touching them before they hit the rocket",
    "steps": [
        {
            "checkbox": true,
            "rescue": true,
            "text": "The following statements should function within the loop",
            "title": "Repeat forever",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"forever_repeat_block\" id=\"sJqcU9xT8$WLGjjE[wI:\" x=\"37\" y=\"43\"></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If I touch Meteorite, Hide Metiorite",
            "title": "Destroy Meteorite",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"forever_repeat_block\" id=\"sJqcU9xT8$WLGjjE[wI:\" x=\"37\" y=\"43\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"~)M/SMWWN9njnuZ|v96l\"><value name=\"IF0\"><block type=\"pointertouch__block\" id=\"QBUO}SdI!6CN(1AVjw65\"><field name=\"options2\">meteorite</field></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"WY16/.B[k{9gW]K$4-l,\"><field name=\"NAME\">meteorite</field></block></statement></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If Rocket touches meteorite, Rocket Blasts",
            "title": "Destroy Rocket",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"forever_repeat_block\" id=\"sJqcU9xT8$WLGjjE[wI:\" x=\"37\" y=\"43\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"~)M/SMWWN9njnuZ|v96l\"><value name=\"IF0\"><block type=\"pointertouch__block\" id=\"QBUO}SdI!6CN(1AVjw65\"><field name=\"options2\">meteorite</field></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"WY16/.B[k{9gW]K$4-l,\"><field name=\"NAME\">meteorite</field></block></statement><next><block type=\"controls_if\" id=\"uZLPE|u%DUq%N`4=[CJV\"><value name=\"IF0\"><block type=\"spritetouch__block\" id=\"*;}~SEfavxXk=r?4R^D6\"><field name=\"options1\">rocket</field><field name=\"options2\">meteorite</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"90py`[I[EV9DdDK;MQfd\"></block></statement></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If Rocket touches the Planet, win Game",
            "title": "Win Game",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"forever_repeat_block\" id=\"sJqcU9xT8$WLGjjE[wI:\" x=\"37\" y=\"43\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"~)M/SMWWN9njnuZ|v96l\"><value name=\"IF0\"><block type=\"pointertouch__block\" id=\"QBUO}SdI!6CN(1AVjw65\"><field name=\"options2\">meteorite</field></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"WY16/.B[k{9gW]K$4-l,\"><field name=\"NAME\">meteorite</field></block></statement><next><block type=\"controls_if\" id=\"uZLPE|u%DUq%N`4=[CJV\"><value name=\"IF0\"><block type=\"spritetouch__block\" id=\"*;}~SEfavxXk=r?4R^D6\"><field name=\"options1\">rocket</field><field name=\"options2\">meteorite</field></block></value><statement name=\"DO0\"><block type=\"action_block\" id=\"90py`[I[EV9DdDK;MQfd\"></block></statement><next><block type=\"controls_if\" id=\"Co0:Uk,whPB7**/K*B$9\"><value name=\"IF0\"><block type=\"spritetouch__block\" id=\"F2z$nb:UjV40dGG0(]^}\"><field name=\"options1\">rocket</field><field name=\"options2\">planet</field></block></value><statement name=\"DO0\"><block type=\"end_block\" id=\"=%:SuhDej[r%[rEJI?3@\"></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": false,
            "rescue": false,
            "text": "Touch the flying meteors to destroy them and protect the rocket until it safely reaches the planet.",
            "title": "Instructions to play the game",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"></xml>"
        }
    ]
};


export {
    completedFlag,
    // myUpdateFunction,
    // helpCode,
    instruction,
    runCode,
    reset_output,
    reInitValues,
    onRocketHitComet,
    reset_looper,
    // meteorite,
    // touchedComet,
    blastRocket,
    hideComet,
    //  isRocketHitComet,
    rocket_touches_planet,
    win_game,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    update,
    hideRocket,
    preload,
    create,
    gameHeight,
    gameWidth,
}