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
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 0.5;

const animalNameArr = ['cow', 'sheep', 'hen', 'chicken', 'pig'];

const spritesElement = {
    cowSprite: { x: 615, y: 745, stayAt: 4, frameWidth: 307, frameHeight: 242, frameFrom: 0, frameTo: 4, frameRate: 10, scale: 1.5 },
    sheepSprite: { x: 940, y: 870, stayAt: 12, frameWidth: 395, frameHeight: 336, frameFrom: 0, frameTo: 12, frameRate: 5, scale: 0.8 },
    henSprite: { x: 960, y: 620, stayAt: 13, frameWidth: 545, frameHeight: 336, frameFrom: 0, frameTo: 13, frameRate: 10, scale: 0.8 },
    chickenSprite: { x: 960, y: 620, stayAt: 84, frameWidth: 172, frameHeight: 107, frameFrom: 0, frameTo: 84, frameRate: 20, scale: 2.5 },
    pigSprite: { x: 300, y: 700, stayAt: 13, frameWidth: 395, frameHeight: 336, frameFrom: 0, frameTo: 13, frameRate: 10, scale: 0.8 }
}

const GAME_CONSTANT = {
    images: {
        farmBg: "farmBg",
        farmGirl: "farmGirl",
        speechBubble: "speechBubble"
    },
    spritesImages: {
        chickenSprite: "chickenSprite",
        henSprite: "henSprite",
        cowSprite: "cowSprite",
        pigSprite: "pigSprite",
        sheepSprite: "sheepSprite"
    },
    sounds: {
        cowSound: 'cowSound',
        henSound: 'henSound',
        sheepSound: 'sheepSound',
        pigSound: 'pigSound',
        chickenSound: 'chickenSound'
    }
};
const INCORRECT_MESSAGE = 'Incorrect Message: <Write error message here>';
const CORRECT_MESSAGE = 'Correct Message: <Write correct message here>';
const END_MESSAGE = 'You are not add the End Block in blockly.';

let _oMSPhaserLib;
let speechBubble;
let speechText;

let is_game_completed = false;
let animalNameRandomize = [];
let animRdmArrIndex = 0;
let isAudioMuted = false;
let totalNoOfAnimal = 0;
let counter = 0;
let activeAnimal = [];
let canRandom = false;
let isEndBlockAvail = false;

let called_animal;
let listOfAnimals = [];
let run_ = true;

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
    loadSounds();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis[element] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);
            _gameThis[element].scale = gameScale;

        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = spritesElement[element];

            _gameThis[element] = _gameThis.add.sprite(elementValue.x, elementValue.y, element);
            //_gameThis[element].scale = gameScale;
        }
    }

    this.farmGirl.setPosition(1375, 510);
    initSpeechBubble();
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

// load sounds
function loadSounds() {
    let sounds = GAME_CONSTANT.sounds;
    for (const key in sounds) {
        if (Object.hasOwnProperty.call(sounds, key)) {
            const element = sounds[key];
            _gameThis.load.audio(element, ["sounds/" + element + ".mp3"]);
        }
    }
}

// add sounds in create method
function addSoundsInCreate() {
    let sounds = GAME_CONSTANT.sounds;
    for (const key in sounds) {
        if (Object.hasOwnProperty.call(sounds, key)) {
            const element = sounds[key];
            _gameThis[element] = _gameThis.sound.add(element);
            _gameThis[element].on('complete', fnAudioCompelete);
        }
    }
}

// this function call when the audio complete
async function fnAudioCompelete() {
    // activeAnimal[animRdmArrIndex].time && await sleep(activeAnimal[animRdmArrIndex].time);
    animRdmArrIndex += 1;

    if (animRdmArrIndex == animalNameRandomize.length) {
        fnShowEndBlockErrorMsg();
        return false;
    }
    // fnGetAttendance(animalNameRandomize[animRdmArrIndex])
}

// Initialize animation functions
function init() {
    listOfAnimals = [...animalNameArr];
    console.log(listOfAnimals);

    for (let key in spritesElement) {
        let oTarget = _gameThis[key];
        let elementValue = spritesElement[key];
        oTarget.scale = elementValue.scale;
        //_oMSPhaserLib.spriteAnimation(oTarget, key, elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, -1);
    }
    addSoundsInCreate();
    //callAnimal();

    let animalName = 'chicken';
    let oTarget = _gameThis[animalName + 'Sprite'];
    let elementValue = spritesElement[animalName + 'Sprite'];
    oTarget.scale = elementValue.scale;
    _oMSPhaserLib.spriteAnimation(oTarget, (animalName + 'Sprite'), elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, -1);
}

// Farm girl chooses an animal randomly and sets in called_animal;
async function farmGirlCallsRandomAnimal() {
    const randomIndex = Math.floor(listOfAnimals.length * Math.random());
    let ca = listOfAnimals.splice(randomIndex, 1)[0];
    if (ca && run_) {
        // await animationAndSoundOfAnimal(calledAnimal);
        await createDialogue(ca)
        // console.log(ca)
        return ca;
    }
}

// Play audio and animation of the called animal.
async function animationAndSoundOfAnimal(calledAnimal) {
    if (run_) {
        let animalName = calledAnimal;
        let oTarget = _gameThis[animalName + 'Sprite'];
        let elementValue = spritesElement[animalName + 'Sprite'];
        oTarget.scale = elementValue.scale;

        _oMSPhaserLib.spriteAnimation(oTarget, (animalName + 'Sprite'), elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 2);
        _gameThis[animalName + 'Sound'].play();
        if (run_) await sleep((_gameThis[animalName + 'Sound'].duration) * 1000);
    }
}

// function to play the animal sounds
function fnGetAttendance(animalObj) {
    if (animalObj.canAnim) {
        let animalName = animalObj.name;

        let oTarget = _gameThis[animalName + 'Sprite'];
        let elementValue = spritesElement[animalName + 'Sprite'];
        oTarget.scale = elementValue.scale;
        //animalName = (animalName == 'hen') ? 'chicken' : animalName;
        if (animalName != 'chicken') {
            _oMSPhaserLib.spriteAnimation(oTarget, (animalName + 'Sprite'), elementValue.frameFrom, elementValue.frameTo, elementValue.frameRate, 2);
            _gameThis[animalName + 'Sound'].play();
        }
        createDialogue(animalObj.animalDialog, animalName);
    } else {
        fnAudioCompelete();
    }
}

// function to call animal names randomlly
async function callAnimal() {
    await sleep(500);
    animalNameRandomize = canRandom ? activeAnimal.sort(function () { return Math.random() - 0.5 }) : activeAnimal;
    await sleep(500);
    fnGetAttendance(animalNameRandomize[animRdmArrIndex]);
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) {
        await _oMSPhaserLib.sleep(ms);
    }
}


// function to set audio mute or unmute
function fuAudioMute() {
    isAudioMuted != isAudioMuted;
    _gameThis.sound.mute = isAudioMuted;
}

function updateTotalAnimalCount(_repeatCount) {
    totalNoOfAnimal = _repeatCount;
}

function canCallRandomAnimal(_canRandom) {
    canRandom = _canRandom || false;
}

function updateActiveAnimal(_animalObj) {
    if (activeAnimal.findIndex((element) => element.name == _animalObj.name) == -1) {
        activeAnimal.push({ name: _animalObj.name, canAnim: _animalObj.canAnim || false, animalDialog: _animalObj.animalDialog });
    }
    if (totalNoOfAnimal == 0) {
        totalNoOfAnimal = _animalObj.totalNoOfAnimal
    }
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.3;
    //speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 100;
    speechBubble.x = (gameWidth / 2);
    speechBubble.y = 40;
    speechBubble.setOrigin(0);
    const padding = 40;

    let speechTextWidth = speechBubble.width * speechBubble.scale - padding;
    speechText = _gameThis.add.text(0, 0, '', {
        font: '32pt arial',
        color: '#000000',
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true }
    });
    speechText.x = speechBubble.x + padding;
    speechText.y = speechBubble.y + (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
    speechBubble.alpha = speechText.alpha = 0;
}

// Create dialogue
async function createDialogue(dialogue) {
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

function fnShowEndBlockErrorMsg() {
    if (!isEndBlockAvail) {
        M.toast({ html: END_MESSAGE });
    }
}

function endBlock() {
    isEndBlockAvail = true;
}

async function waitDuration(time) {
    await sleep(time)
}

function reInitValues() {
    animRdmArrIndex = 0;
    animalNameRandomize = [];
    totalNoOfAnimal = 0;
    counter = 0;
    activeAnimal = [];
    canRandom = false;
    isEndBlockAvail = false;
}

// Reset the game
function reset_output() {
    run_ = false;
    reInitValues();
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
            console.log(a)
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
//     var xml_code = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="%sE~qs)HGsvm[A6O0VI$" x="-105" y="-66"><value name="TIMES"><block type="math_number" id="]:s)$c=8Ej}d?|]UC3lf"><field name="NUM">5</field></block></value><statement name="DO"><block type="say_block" id="6!.KvN/S/3vZ#Ho/D-tL"><field name="dialogue">Next is</field><next><block type="set_variable_holder" id=";o_^%rErWFVjM3,Bzl!A"><field name="Variable name">called_animal</field><value name="NAME"><block type="farm_girl_calls" id="i-xZqbj/ng4c2NgqCP;Q"></block></value><next><block type="controls_if" id="bU-!54XI+Y(FiJ5_Lr%s"><mutation elseif="4"></mutation><value name="IF0"><block type="logic_compare" id="8{e?^N@BW)2Mn9LNIMJs"><field name="OP">EQ</field><value name="A"><block type="variables" id="W.~84N[$0s?NgpI]VL6E"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="..HZ8hMM|dmMjJcT|Bd5"><field name="Options">pig</field></block></value></block></value><statement name="DO0"><block type="calls_block" id="+3+y^z#2%-p!;@DZnjxv"><field name="farmGirl">pig</field></block></statement><value name="IF1"><block type="logic_compare" id="c|cqYjq{6q%3#tO[H8Xi"><field name="OP">EQ</field><value name="A"><block type="variables" id="bo-h1%pgf8,]@Q.H~`9i"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="RlrglY,x8k1L4txSAta3"><field name="Options">hen</field></block></value></block></value><statement name="DO1"><block type="calls_block" id="IItcfyknnMLHW?.6s8l,"><field name="farmGirl">hen</field></block></statement><value name="IF2"><block type="logic_compare" id="X1tzk#`SfB8k6rW?N=Kh"><field name="OP">EQ</field><value name="A"><block type="variables" id=",CeB-r(O0}4l$1^|aHC-"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="g}O#c@eLP;.f49)=`2~1"><field name="Options">chicken</field></block></value></block></value><statement name="DO2"><block type="calls_block" id="|@-VsuA6Y`BCN//}Ou?a"><field name="farmGirl">chicken</field></block></statement><value name="IF3"><block type="logic_compare" id="NfS9Ht3.vnyp}BgWGcbr"><field name="OP">EQ</field><value name="A"><block type="variables" id="}i=77v@b55Cwkh(]HYMp"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="q8jf8p`jU.A*W#aL+9P6"><field name="Options">sheep</field></block></value></block></value><statement name="DO3"><block type="calls_block" id="1jv}?q3Q`m]0g2u~[DPZ"><field name="farmGirl">sheep</field></block></statement><value name="IF4"><block type="logic_compare" id="B#*%NiFiLBht:h`-^`9y"><field name="OP">EQ</field><value name="A"><block type="variables" id="knOUl3xk8Vke+?LV%)Z`"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="XE9-0GXUVi`?Rxoq16mg"><field name="Options">cow</field></block></value></block></value><statement name="DO4"><block type="calls_block" id="4sI;J?fk,phCHzD.mAe,"><field name="farmGirl">cow</field></block></statement><next><block type="wait_block" id="u}2)tuL}^GTI8E#9KtB%"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="FQ,2wCzSHV2rCyX/R.qe"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></statement></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_code);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="%sE~qs)HGsvm[A6O0VI$" x="-105" y="-66"><value name="TIMES"><block type="math_number" id="]:s)$c=8Ej}d?|]UC3lf"><field name="NUM">5</field></block></value><statement name="DO"><block type="say_block" id="6!.KvN/S/3vZ#Ho/D-tL"><field name="dialogue">Next is</field><next><block type="set_variable_holder" id=";o_^%rErWFVjM3,Bzl!A"><field name="Variable name">called_animal</field><value name="NAME"><block type="farm_girl_calls" id="i-xZqbj/ng4c2NgqCP;Q"></block></value><next><block type="controls_if" id="bU-!54XI+Y(FiJ5_Lr%s"><mutation elseif="4"></mutation><value name="IF0"><block type="logic_compare" id="8{e?^N@BW)2Mn9LNIMJs"><field name="OP">EQ</field><value name="A"><block type="variables" id="W.~84N[$0s?NgpI]VL6E"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="..HZ8hMM|dmMjJcT|Bd5"><field name="Options">pig</field></block></value></block></value><statement name="DO0"><block type="calls_block" id="+3+y^z#2%-p!;@DZnjxv"><field name="farmGirl">pig</field></block></statement><value name="IF1"><block type="logic_compare" id="c|cqYjq{6q%3#tO[H8Xi"><field name="OP">EQ</field><value name="A"><block type="variables" id="bo-h1%pgf8,]@Q.H~`9i"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="RlrglY,x8k1L4txSAta3"><field name="Options">hen</field></block></value></block></value><statement name="DO1"><block type="calls_block" id="IItcfyknnMLHW?.6s8l,"><field name="farmGirl">hen</field></block></statement><value name="IF2"><block type="logic_compare" id="X1tzk#`SfB8k6rW?N=Kh"><field name="OP">EQ</field><value name="A"><block type="variables" id=",CeB-r(O0}4l$1^|aHC-"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="g}O#c@eLP;.f49)=`2~1"><field name="Options">chicken</field></block></value></block></value><statement name="DO2"><block type="calls_block" id="|@-VsuA6Y`BCN//}Ou?a"><field name="farmGirl">chicken</field></block></statement><value name="IF3"><block type="logic_compare" id="NfS9Ht3.vnyp}BgWGcbr"><field name="OP">EQ</field><value name="A"><block type="variables" id="}i=77v@b55Cwkh(]HYMp"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="q8jf8p`jU.A*W#aL+9P6"><field name="Options">sheep</field></block></value></block></value><statement name="DO3"><block type="calls_block" id="1jv}?q3Q`m]0g2u~[DPZ"><field name="farmGirl">sheep</field></block></statement><value name="IF4"><block type="logic_compare" id="B#*%NiFiLBht:h`-^`9y"><field name="OP">EQ</field><value name="A"><block type="variables" id="knOUl3xk8Vke+?LV%)Z`"><field name="Options">called_animal</field></block></value><value name="B"><block type="options_block" id="XE9-0GXUVi`?Rxoq16mg"><field name="Options">cow</field></block></value></block></value><statement name="DO4"><block type="calls_block" id="4sI;J?fk,phCHzD.mAe,"><field name="farmGirl">cow</field></block></statement><next><block type="wait_block" id="u}2)tuL}^GTI8E#9KtB%"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="FQ,2wCzSHV2rCyX/R.qe"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></statement></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "import farm\nimport time\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);



function get_number_of_blocks() {
    return demoWorkspace.getAllBlocks(false).length;
}

function final_check() {
    setTimeout(() => {
        if (JSON.stringify(listOfAnimals) == JSON.stringify([])) {
            M.toast({ html: "Attendance Successful! All animals have been called by the girl" });
            setTimeout(() => { is_game_completed = true; }, 2500)
        } else {
            M.toast({ html: "Attendance Incomplete!" });
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

export {
    completedFlag,
    myUpdateFunction,
    get_number_of_blocks,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    final_check,
    farmGirlCallsRandomAnimal,
    sleep,
    called_animal,
    waitDuration,
    createDialogue,
    animationAndSoundOfAnimal,
    getNoOfBlocks
}