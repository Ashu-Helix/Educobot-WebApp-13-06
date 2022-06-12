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

const magicElement = {
    bunnySprite: {
        x: 980,
        y: 340,
        stay: 15,
        frameWidth: 233,
        frameHeight: 382,
        frameFrom: 0,
        frameTo: 15,
        frameRate: 8,
    },
    appleSprite: {
        x: 960,
        y: 550,
        stay: 15,
        frameWidth: 1920,
        frameHeight: 1080,
        frameFrom: 0,
        frameTo: 7,
        frameRate: 6,
    },
    confettiDownward: {
        x: 960,
        y: 300,
        stay: 15,
        frameWidth: 498,
        frameHeight: 467,
        frameFrom: 0,
        frameTo: 8,
        frameRate: 5,
    },
    magicWandUpward: {
        x: 1300,
        y: 500,
        stay: 15,
        frameWidth: 324,
        frameHeight: 321,
        frameFrom: 0,
        frameTo: 107,
        frameRate: 20,
    },
};

const dialogue = [
    "Welcome!",
    "Let’s start the magic show",
    "Tada",
    "Next Magic",
    "Next magic",
    "Last magic of the day",
    "Thankyou everyone",
];

const TOTAL_MAGIC_COUNT = 3;

const INCORRECT_MESSAGE = "You need to show it first before hiding the ";
const CORRECT_MESSAGE = "You have successfully completed the magic.";

const GAME_CONSTANT = {
    images: {
        magicianBG: "magicianBG",
        speechBubble: "speechBubble",
    },
    spritesImages: {
        appleSprite: "appleSprite",
        bunnySprite: "bunnySprite",
        confettiDownward: "confettiDownward",
        magicWandUpward: "magicWandUpward",
    },
};

let _oMSPhaserLib;
let speechBubble;
let speechText;
let completedMagics = [];
let sequence_history = [];
let run_ = true;

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
    },
};

// Initialize Phaser with config
let game = new Phaser.Game(config);

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
    speechBubbleInit();

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
            if (element == GAME_CONSTANT.spritesImages.confettiDownward)
                _gameThis[element].scale = 3;
        }
    }

    // init();
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
            const elementValue = magicElement[element];

            _gameThis.load.spritesheet(element, "images/" + element + ".png", {
                frameWidth: elementValue.frameWidth,
                frameHeight: elementValue.frameHeight,
            });
        }
    }
}

// Initialize animation functions
async function init() { }

// Show magic wand effect
function showMagicEffect(elementName) {
    if (run_) {
        let oTarget = _gameThis[elementName];
        let elementValue = magicElement[elementName];

        oTarget.visible = true;
        _oMSPhaserLib.spriteAnimation(
            oTarget,
            elementName,
            elementValue.frameFrom,
            elementValue.frameTo,
            elementValue.frameRate,
            0
        );
        sequence_history.push("show " + elementName);
    }
}

// Hide element
function hideElement(elementName) {
    if (run_) {
        if (_gameThis[elementName].visible && _gameThis[elementName].alpha == 1) {
            _oMSPhaserLib.fadeOut(_gameThis[elementName]);

            if (completedMagics.indexOf(elementName) == -1)
                completedMagics.push(elementName);

            if (completedMagics.length == TOTAL_MAGIC_COUNT) {
                M.toast({ html: CORRECT_MESSAGE });
            }
        } else M.toast({ html: INCORRECT_MESSAGE + magicName[elementName] });
        sequence_history.push("hide " + elementName);
    }
}

// Initialize speech bubble
function speechBubbleInit() {
    speechBubble = _gameThis[GAME_CONSTANT.images.speechBubble];
    speechBubble.scale = 0.45;
    speechBubble.x = gameWidth - speechBubble.width * speechBubble.scale - 100;
    speechBubble.y = 100;
    speechBubble.setOrigin(0);

    let speechTextWidth = speechBubble.width * speechBubble.scale - 50;
    speechText = _gameThis.add.text(0, 0, "Hello World", {
        font: "32pt arial",
        color: "#000000",
        wordWrap: { width: speechTextWidth, useAdvancedWrap: true },
    });
    speechText.x =
        speechBubble.x +
        ((speechBubble.width * speechBubble.scale) / 2 - speechText.width) / 2;
    speechText.y =
        speechBubble.y +
        (speechBubble.height * speechBubble.scale * 0.66 - speechText.height) / 2;
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
                sequence_history.push("dialogue");
                myResolve();
            }, 2000);
        } else {
            myResolve();
        }
    });
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    if (run_) {
        await _oMSPhaserLib.sleep(ms);
        sequence_history.push("wait");
    }
}
// Re-initialize the game variables
function reInitValues() {
    completedMagics = [];
}

function isEqual(a, b) {
    // If length is not equal
    if (a.length != b.length) return false;
    else {
        // Comparing each element of array
        for (var i = 0; i < a.length; i++)
            if (a[i] != b[i]) return false;
        return true;
    }
}

function completedFlag() {
    var ans = [
        "dialogue",
        "dialogue",
        "show magicWandUpward",
        "wait",
        "show bunnySprite",
        "wait",
        "dialogue",
        "wait",
        "hide bunnySprite",
        "wait",
        "dialogue",
        "wait",
        "show magicWandUpward",
        "wait",
        "show appleSprite",
        "wait",
        "dialogue",
        "wait",
        "hide appleSprite",
        "wait",
        "dialogue",
        "wait",
        "show magicWandUpward",
        "wait",
        "show confettiDownward",
        "wait",
        "dialogue",
        "hide confettiDownward",
    ];
    return isEqual(sequence_history, ans);
}

// Reset the game
function reset_output() {
    sequence_history = [];
    run_ = false;
    reInitValues();
    _gameThis.scene.restart();
}

const helpCode =
    '<xml xmlns="https://developers.google.com/blockly/xml"><block type="speak_block" id="ULk#vu#Y|L05K#t154X:" x="63" y="-12"><field name="dialogue">Welcome</field><next><block type="speak_block" id="-;_{bozAOYO,ek~Q]qJu"><field name="dialogue">Let\'s start the Magic show</field><next><block type="effect_block" id="]Ad4y;A,6TPJz_Kd)R36"><next><block type="wait_block" id="Sv#o-xW[hfz$KMKC[?vY"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="YQ`EtA@T#p$5dvJs$-br"><field name="NUM">2</field></block></value><next><block type="show_block" id="gz(|o);uyE:*=LruEW@V"><field name="magicItems">bunnySprite</field><next><block type="wait_block" id="A@Q*GZM3I1.6jn5?ACYf"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id=";N:9fz|yMR6ISq3W/+!%"><field name="NUM">2</field></block></value><next><block type="speak_block" id=":W0e^4),^2Z-mivq#aS)"><field name="dialogue">Tada</field><next><block type="wait_block" id="t@E%%h(^4q-=YgM=Rh(!"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="-aSi:cavd-/JspWie?[O"><field name="NUM">3</field></block></value><next><block type="hide_block" id="2cEwJQdq%{Be~O7yJgh9"><field name="magicItems">bunnySprite</field><next><block type="wait_block" id="xh}UurbSHrYM~Aa05jO4"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="#dPZ#NqQL[i||[r)CmQ|"><field name="NUM">2</field></block></value><next><block type="speak_block" id="MwhI00z:A*lb~Bl@UsWP"><field name="dialogue">Next magic</field><next><block type="wait_block" id="@vMKCm,p5Eh#vG2#2$D8"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="F1Ma4;5l:E*I~b$/G%(Y"><field name="NUM">1</field></block></value><next><block type="effect_block" id="Dw{YT%wOQ72j3)0gf6!Y"><next><block type="wait_block" id="%FU5mm5J^aY%+WMf=BBS"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="[$j[KuarEd_Ci+=+jw^v"><field name="NUM">2</field></block></value><next><block type="show_block" id="6mCs!(w0dS?Y3Y`%]_.+"><field name="magicItems">appleSprite</field><next><block type="wait_block" id="?k.*7Ky,u`iS!1H*W7Yx"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="}/QBPs]tNk+7ejRUh?)?"><field name="NUM">2</field></block></value><next><block type="speak_block" id="f%oXknyJ40F+NXC/o?*p"><field name="dialogue">Tada</field><next><block type="wait_block" id="Eqx1+g`YPS0E|8MN.~a["><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="bB2Vm0x-nQ|qvV}}U9s;"><field name="NUM">3</field></block></value><next><block type="hide_block" id=":C`!-zga2}OID]Fk`a%}"><field name="magicItems">appleSprite</field><next><block type="wait_block" id=":jbCcL}hRNuJJR43y5At"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="8V;Y~2!E#epHS8ap#vMl"><field name="NUM">2</field></block></value><next><block type="speak_block" id="{MhwtP}P/wROLI:(_C[t"><field name="dialogue">Final Magic</field><next><block type="wait_block" id="uX7.`6p.x0Y125hO[HoB"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="^:ZrnSW];?t/JX~B:mF`"><field name="NUM">1</field></block></value><next><block type="effect_block" id="rr#K0AKc7z_mpB3]-r5{"><next><block type="wait_block" id="bByk4T^9VP=?4~~_%;7l"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="B^P75;5D.[O,ZTyj;*Mf"><field name="NUM">2</field></block></value><next><block type="show_block" id="$z0}oyT(mvg:ife.e*3D"><field name="magicItems">confettiDownward</field><next><block type="wait_block" id="-54jxMx*C%+Hi!B^`Exx"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id=")4@gliCdo2xDu+Xh+R_E"><field name="NUM">1</field></block></value><next><block type="speak_block" id="PH!=4y6sY|=`(YZjhE3q"><field name="dialogue">Thank you everyone!</field><next><block type="hide_block" id="l6};{f|,)1|Tko`ETdp/"><field name="magicItems">confettiDownward</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';

function runCode() {
    // tour_over && tour.complete();
    // Re-initialize the game variables
    reset_output();
    setTimeout(() => {
        run_ = true;
        window.LoopTrap = 1e3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP =
            'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a =
            "async function c(){" +
            Blockly.JavaScript.workspaceToCode(demoWorkspace) +
            "} c();";
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
    }, 500);
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

export { reset_output, completedFlag, helpCode, runCode, getNoOfBlocks };