import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Math, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const correctCounts = 40;
const magicElement = {
    girl: {
        x: 600,
        y: 550,
        stay: 5,
        frameWidth: 760,
        frameHeight: 1358,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
        repeat: 0,
    },
    robot: {
        x: 1260,
        y: 550,
        stay: 5,
        frameWidth: 516,
        frameHeight: 817,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
        repeat: 0,
    },
    numbers: {
        x: 1260,
        y: 565,
        stay: 99,
        frameWidth: 132,
        frameHeight: 86,
        frameFrom: 0,
        frameTo: 100,
        frameRate: 5,
        repeat: 0,
    },
};

const GAME_CONSTANT = {
    images: {
        healthNotiferBg: "healthNotiferBg",
        speechBubble: "speechBubble",
    },
    spritesImages: {
        girl: "girl",
        robot: "robot",
        numbers: "numbers",
    },
};
const ERROR_MESSAGE =
    "Oops! You have not completed the 40 jumps correctly with 5 sec rest";
const CORRECT_MESSAGE =
    "Congratulations! You have completed todays exercise to stay healthy";

let _oMSPhaserLib;
let jumpCount = 0;
let jump_count = 0;
let speechBubble;
let speechText;
let run_ = true;
let instructions = "";
let restTime = -1;
let maxJumpLimit = -1;
let is_game_completed = false;
let is_5_sec_rest = false;
let default_ = 0;

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
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
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
            //_gameThis[element].visible = false;
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
function init() {
    _gameThis.healthNotiferBg.scale = 0.5;

    _gameThis.girl.scale = 0.5;
    _gameThis.robot.scale = 0.5;
    _gameThis.numbers.scale = 0.5;

    _gameThis[GAME_CONSTANT.spritesImages.numbers].visible = false;
}

// Add instructions
function addInstructions(instructions) {
    for (const key in instructions) {
        if (Object.hasOwnProperty.call(instructions, key)) {
            updateInstructions(key, instructions[key]);
        }
    }
}

// Update instructions
function updateInstructions(key, value) {
    switch (key) {
        case "say_block":
            instructions = value;
            break;

        case "wait_block":
            restTime = value;
            break;

        case "compare_block":
            maxJumpLimit = value;
            break;
    }
}

async function fnPlayRobot() {
    if (run_) {
        let spritesImages = GAME_CONSTANT.spritesImages;
        let robot = _gameThis[spritesImages.robot];
        let robotValue = magicElement.robot;
        if (run_)
            await _oMSPhaserLib.spriteAnimation(
                robot,
                spritesImages.robot,
                robotValue.frameFrom,
                robotValue.frameTo,
                robotValue.frameRate,
                0
            );

        if (run_) await sleep(1000);
        _gameThis[GAME_CONSTANT.spritesImages.numbers].visible = true;
        if (run_) fnJumpGirl();
    }
}

async function fnJumpGirl() {
    if (run_) {
        let spritesImages = GAME_CONSTANT.spritesImages;
        let girl = _gameThis[spritesImages.girl];
        let girlValue = magicElement.girl;
        if (run_)
            await _oMSPhaserLib.spriteAnimation(
                girl,
                spritesImages.girl,
                girlValue.frameFrom,
                girlValue.frameTo,
                girlValue.frameRate,
                0
            );
        fnIncreaseNumber();
        if (run_) await sleep(500);
    }
}

// function for increase the numbers when step is complete
async function fnIncreaseNumber() {
    _oMSPhaserLib.spriteAnimation(
        _gameThis[GAME_CONSTANT.spritesImages.numbers],
        GAME_CONSTANT.spritesImages.numbers,
        jumpCount - 1,
        jumpCount,
        magicElement.numbers.frameRate,
        0
    );
    jumpCount += 1;
}

// function for jump step completed or game completed
async function final_check() {
    setTimeout(() => {
        if (jumpCount == correctCounts && is_5_sec_rest) {
            M.toast({
                html: CORRECT_MESSAGE,
            });

            is_game_completed = true;
        } else {
            M.toast({
                html: ERROR_MESSAGE,
            });
        }
    }, 2000);
}

// Initialize speech bubble
function initSpeechBubble() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.32;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 100;
    speechBubble.y = 100;
    speechBubble.setOrigin(0);
    const padding = 20;

    let speechTextWidth = speechBubble.width * speechBubble.scale - padding * 2;
    speechText = _gameThis.add.text(0, 0, "It's time to take rest", {
        font: "28pt arial",
        color: "#000000",
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true },
    });
    speechText.x = speechBubble.x + padding;
    speechText.y = speechBubble.y + padding;
    speechBubble.alpha = speechText.alpha = 0;
}

// Create dialogue
function createDialogue(dialogue) {
    speechText.text = dialogue;
    speechBubble.alpha = 1;
    _oMSPhaserLib.fadeIn(speechBubble);
    _oMSPhaserLib.fadeIn(speechText);
    setTimeout(() => {
        _oMSPhaserLib.fadeOut(speechBubble);
        _oMSPhaserLib.fadeOut(speechText);
    }, 5000);
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) {
        await _oMSPhaserLib.sleep(ms);
        if (ms == 5000) is_5_sec_rest = true;
    }
}

// Initialize animation functions
async function jump() {
    if (run_) {
        if (jumpCount == 0) {
            if (run_) await fnPlayRobot();
        } else {
            if (run_) await fnJumpGirl();
        }
    }
}

// Re-initialize the game variables
function reInitValues() {
    run_ = false;
    is_game_completed = false;
    jumpCount = 0;
    instructions = "";
    restTime = -1;
    maxJumpLimit = -1;
    is_5_sec_rest = false;
}

// Reset the game
async function reset_output() {
    reInitValues();
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

// function helpCode() {
//     let block_code =
//         '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="3{e#GCr93N__5{qht{pO" x="66" y="99"><field name="Variable name">jump_count</field><value name="NAME"><block type="math_number" id="o%[*{26$PL0jH1Fp?Y!$"><field name="NUM">0</field></block></value><next><block type="controls_repeat_ext" id="FHgToy[fv[Jt80j]Hhj,"><value name="TIMES"><block type="math_number" id="-2`*Rv;d4o`+N?fTvL6r"><field name="NUM">40</field></block></value><statement name="DO"><block type="controls_if" id=")[aj^7I?B%l^]rF,rw*k"><value name="IF0"><block type="logic_compare" id="VUa%v:Wi;+Da5nJNp}j1"><field name="OP">EQ</field><value name="A"><block type="variables" id="6_)]+/r`=|BL_]J?VAV)"><field name="Options">jump_count</field></block></value><value name="B"><block type="math_number" id="7C^adtdShLbX4irnX3Mh"><field name="NUM">20</field></block></value></block></value><statement name="DO0"><block type="say_block" id="c^L5jRQsekb[_$KN^9w2"><field name="dialogue">Taking rest</field><next><block type="wait_block" id="4FIsA^y~KJy2AI)wL5wJ"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="g}irJ,c]=VVKFdzMWFM_"><field name="NUM">5</field></block></value></block></next></block></statement><next><block type="action_block" id="XV074BO+BTQ?JLNF;8Bn"><next><block type="change_variable_holder" id="$G_j*Bc.cw9XU8i;]m#s"><field name="Variable name">jump_count</field><value name="NAME"><block type="math_number" id="I`ozDv}pwo)=nv^:CQ?x"><field name="NUM">1</field></block></value><next><block type="wait_block" id="D={lQsSv)#Tr~/:K6:6O"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="A$H+KEXIuDO](J8sd[U*"><field name="NUM">0.2</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(block_code);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
//     return block_code;
// }

const helpCode =
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="3{e#GCr93N__5{qht{pO" x="66" y="99"><field name="Variable name">jump_count</field><value name="NAME"><block type="math_number" id="o%[*{26$PL0jH1Fp?Y!$"><field name="NUM">0</field></block></value><next><block type="controls_repeat_ext" id="FHgToy[fv[Jt80j]Hhj,"><value name="TIMES"><block type="math_number" id="-2`*Rv;d4o`+N?fTvL6r"><field name="NUM">40</field></block></value><statement name="DO"><block type="controls_if" id=")[aj^7I?B%l^]rF,rw*k"><value name="IF0"><block type="logic_compare" id="VUa%v:Wi;+Da5nJNp}j1"><field name="OP">EQ</field><value name="A"><block type="variables" id="6_)]+/r`=|BL_]J?VAV)"><field name="Options">jump_count</field></block></value><value name="B"><block type="math_number" id="7C^adtdShLbX4irnX3Mh"><field name="NUM">20</field></block></value></block></value><statement name="DO0"><block type="say_block" id="c^L5jRQsekb[_$KN^9w2"><field name="dialogue">Taking rest</field><next><block type="wait_block" id="4FIsA^y~KJy2AI)wL5wJ"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="g}irJ,c]=VVKFdzMWFM_"><field name="NUM">5</field></block></value></block></next></block></statement><next><block type="action_block" id="XV074BO+BTQ?JLNF;8Bn"><next><block type="change_variable_holder" id="$G_j*Bc.cw9XU8i;]m#s"><field name="Variable name">jump_count</field><value name="NAME"><block type="math_number" id="I`ozDv}pwo)=nv^:CQ?x"><field name="NUM">1</field></block></value><next><block type="wait_block" id="D={lQsSv)#Tr~/:K6:6O"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="A$H+KEXIuDO](J8sd[U*"><field name="NUM">0.2</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function get_number_of_blocks() {
    return demoWorkspace.getAllBlocks(false).length;
}

function completedFlag() {
    return is_game_completed;
}

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "import girl\nimport time\n";
    document.getElementById("pycode").innerHTML = import_statement + code;
    document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);
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
    createDialogue,
    jump,
    sleep,
    getNoOfBlocks
};