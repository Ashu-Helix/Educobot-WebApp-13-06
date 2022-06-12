// import M from 'materialize-css';
// import {
//     AUTO,
//     Game,
// } from 'phaser';

// import MSPhaserLib from '../msPhaserLib.min';

import { CANVAS, Game, AUTO } from "phaser";

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
// import MSPhaserLib from "../msPhaserLib.min";
// import { CANVAS, Math, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
let dummy_increment = 0;

const GAME_CONSTANT = {
    images: {
        BG: "images/Background honey-sweeper.png",
        Tile1: "images/1.png",
        Tile2: "images/2.png",
        Tile3: "images/3.png",

        Empty: "images/empty_jar.png",
        Golden: "images/golden_jar.png",
        Im: "images/topimage.png",
        bee: "images/bee-sting.png",
        fulljar: "images/fulljar.png",

    },
    spritesImages: {}
};
const ERROR_MESSAGE = '';
const CORRECT_MESSAGE = '';

let JustCliked = false;
let CLickedTile = null;
let SmallJarFounded = false;
let BigJarFounded = false;
let BeeFounded = false;
let MaxScore;
let EmptyJar_index;
let BigJajIndex;
let BigJarTiles = []
let arraTiles = [];
let BG, Empty, Golden, Im, smallfull1, smallfull2
let Bee;


let count0 = 0,
    count1 = 0,
    count2 = 0,
    count3 = 0,
    count4 = 0;


let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;
let Scoretext;
let score = 0;
let Narray;
// Phaser config
var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    //canvas: canvas1,
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


    Narray = range(0, 62);

    BG = this.add.image(gameWidth / 2, gameHeight / 2, "BG").setName("BG");
    _gameThis["BG"] = BG;
    //add tiles
    let w, h;
    let arr = [
        2, 2, 6, 10, 14, 18, 24, 28, 32, 36, 40, 44, 48, 2, 1, 6, 10, 14, 18, 24,
        28, 32, 36, 40, 44, 2, 2, 6, 10, 14, 18, 24, 28, 32, 36, 40, 44, 48, 2, 1,
        6, 10, 14, 18, 24, 28, 32, 36, 40, 44, 2, 2, 6, 10, 14, 18, 24, 28, 32, 36,
        40, 44, 48,
    ];

    for (let i = 0; i < 63; i++) {

        let key = Phaser.Math.Between(1, 3);

        let Tile = this.add.image(0, 0, "Tile" + key.toString())
            .setScale(1, 1)
            .setDepth(1)
            .setInteractive();
        //Tile.setAlpha(0.5)
        Tile.setName(arraTiles.length);
        arraTiles.push(Tile);
        _gameThis[key] = Tile;

        if (key == 2 && Math.random() * 10 < 5) { Tile.setFlipX(true); }

        Tile.on('pointerdown', () => { ClickTile(Tile) });

        if (i < 13) {
            w = arr[i] - 58 + ((count0 += 1) * BG.width) / 13.4;
            h = 270;
        }
        if (i >= 13 && i < 25) {
            w = arr[i] + 15 + ((count1 += 1) * BG.width) / 13.4;
            h = 395;
        }
        if (i >= 25 && i < 38) {
            w = arr[i] - 58 + ((count2 += 1) * BG.width) / 13.4;
            h = 520;
        }
        if (i >= 38 && i < 50) {

            w = arr[i] + 15 + ((count3 += 1) * BG.width) / 13.4;
            h = 650;
        }
        if (i >= 50) {
            w = arr[i] - 58 + ((count4 += 1) * BG.width) / 13.4;
            h = 775;
        }
        Tile.setPosition(w, h);
    }


    EmptyJar_index = Math.floor(Math.random() * Narray.length);
    console.log("empty jar index", EmptyJar_index)
    console.log("Len N array", Narray.length)


    //Empty jar
    console.log('@1 EmptyJar_index', EmptyJar_index)
    let p = arraTiles[Narray[EmptyJar_index]];
    Empty = this.add.image(p.x, p.y, 'Empty').setName(p.name);

    console.log("Array tiles", arraTiles)
    _gameThis['Empty'] = Empty;
    // console.log('empty in ',p.name)

    // Big jar
    let min = 1;
    let max = 11;
    if (Math.random() * 20 < 5) {
        min = 13;
        max = 23
    }
    if (5 <= Math.random() * 20 < 10) {
        min = 26;
        max = 36
    }
    if (10 <= Math.random() * 20 < 15) {
        min = 38;
        max = 48
    }

    let BigJajIndex = Phaser.Math.Between(min, max);
    //console.log('big jar in',BigJajIndex);

    do {
        if (Math.random() * 20 < 5) {
            min = 13;
            max = 23
        }
        if (5 <= Math.random() * 20 < 10) {
            min = 26;
            max = 36
        }
        if (10 <= Math.random() * 20 < 15) {
            min = 38;
            max = 48
        }

        BigJajIndex = Phaser.Math.Between(min, max);
        console.log('-----------> new big jar in', BigJajIndex);
    }
    while (BigJajIndex == Narray[EmptyJar_index] || BigJajIndex + 12 == Narray[EmptyJar_index] || BigJajIndex + 13 == Narray[EmptyJar_index]);

    //add bee
    let randomTile = arraTiles[Narray[BigJajIndex]];
    Golden = this.add.image(randomTile.x, randomTile.y, 'Golden').setScale(0.9).setOrigin(0.5, 0.3).setName(randomTile.name);
    _gameThis['Golden'] = Golden;
    // console.log(randomTile.name)
    BigJarTiles = [parseInt(randomTile.name) + 12, parseInt(randomTile.name) + 13]
    //bee 
    Narray[EmptyJar_index] = null;
    Narray[BigJajIndex] = null;
    Narray[BigJarTiles[0]] = null;
    Narray[BigJarTiles[1]] = null;


    Narray.remove(null);
    let Bee_index = Math.floor(Math.random() * Narray.length);
    console.log('@1 Bee_index', Bee_index, Narray[Bee_index])
    let p1 = arraTiles[Narray[Bee_index]];
    Bee = this.add.image(p1.x, p1.y, 'bee').setName(p1.name);

    _gameThis['Bee'] = Bee;
    Narray[Bee_index] = null;
    Narray.remove(null);



    let smallfull1_index = Math.floor(Math.random() * Narray.length);
    console.log('@1 smallfull1_index', smallfull1_index, Narray[smallfull1_index])
    let p2 = arraTiles[Narray[smallfull1_index]];
    console.log('p2', p2)
    smallfull1 = this.add.image(p2.x, p2.y, 'Empty').setName(p2.name);
    _gameThis['smallfull1'] = smallfull1;

    Narray[smallfull1_index] = null;
    Narray.remove(null);

    let smallfull2_index = Math.floor(Math.random() * Narray.length);
    console.log('@1 smallfull2_index', smallfull2_index)
    let p3 = arraTiles[Narray[smallfull2_index]];
    smallfull2 = this.add.image(p3.x, p3.y, 'Empty').setName(p3.name);
    _gameThis['smallfull2'] = smallfull2;

    //set randomly 1 or 2 fulljar
    if (Math.random() * 10 < 5) {
        smallfull1.setTexture('fulljar');
        smallfull2.setTexture('fulljar');
        MaxScore = 5;
    } else {
        smallfull1.setTexture('fulljar');
        MaxScore = 4;
    }


    Empty.setAlpha(0);
    Golden.setAlpha(0);
    Bee.setAlpha(0);
    smallfull1.setAlpha(0);
    smallfull2.setAlpha(0);

    //top image
    Im = this.add
        .image(gameWidth / 2, 155, "Im")
        .setScale(1, 0.8)
        .setName("Im")
    _gameThis["Im"] = Im;



    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);
    console.log(ErrorText);

    Scoretext = _gameThis.add.text(
        550,
        1000,
        "Your score: 00", { font: "bold 68px Arial", fill: "#ffffff" }).setDepth(8);
    Scoretext.setOrigin(0.5, 0.5);
}

function ClickTile(Tile) {
    if (GameIsOver) { return; }
    //console.log(Tile.name);
    JustCliked = true;
    CLickedTile = Tile;

    if (Tile.name == Empty.name) {
        //do noyhing this is an empty jar
        Empty.setAlpha(1);
    } else if (Tile.name == smallfull1.name) {
        smallfull1.setAlpha(1);
        //check full or empty :
        if (smallfull1.texture.key == 'fulljar') { SmallJarFounded = true; }
    } else if (Tile.name == smallfull2.name) {
        smallfull2.setAlpha(1);
        //check full or empty :
        if (smallfull2.texture.key == 'fulljar') { SmallJarFounded = true; }
    } else if ((Tile.name == Golden.name) || (BigJarTiles.indexOf(Tile.name) != -1)) {
        BigJarFounded = true;
        Golden.setAlpha(1);
    } else if (Tile.name == Bee.name) {
        BeeFounded = true;
        AnimeBee();
        Bee.setAlpha(1);
        console.log("game is over");
    } else { }

    setTimeout(() => {
        if (!GameIsOver)
            Scoretext.setText("Your score: " + score);
    }, 400)

}

function AnimeBee() {
    Bee.setDepth(3);
    var timeline = _gameThis.tweens.createTimeline();
    timeline.add({
        targets: Bee,
        delay: 300,
        scale: 1.75,
        angle: 25,
        ease: 'Power1',
        duration: 400,
        yoyo: true,
        repeat: -1

    });

    timeline.play();
}

function game_over() {
    GameIsOver = true;
}

function say(str) {
    Scoretext.setText(str);
    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, 100); })
}


function reset_inside_update_tasks() {
    JustCliked = false;
    BigJarFounded = false;
    SmallJarFounded = false;
}

function update() {

    // if (is_honey_comb_touched()) {
    //     hide_touched_honey_comb();

    //     if (is_small_jar()) {
    //         score += 1;
    //     }
    //     if (is_big_jar()) {
    //         score += 1;
    //     }
    //     if (is_bee()) {
    //         say("You Lose!");
    //         game_over();
    //     }
    // }
    // if (score >= MaxScore) {
    //     say("You Win!");
    //     say("You have captured all honey!");

    // }

    // reset_inside_update_tasks();
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
    arraTiles = [];
    score = 0;
    ErrorInnerText = "";
    GameIsOver = false;
    JustCliked = false;
    CLickedTile = null;
    SmallJarFounded = false;
    BigJarFounded = false;
    BeeFounded = false;
    BigJarTiles = []
    arraTiles = [];


    count0 = 0;
    count1 = 0;
    count2 = 0;
    count3 = 0;
    count4 = 0;
    ErrorInnerText = "";
    GameIsOver = false;
    Scoretext;
    score = 0;
}
// Reset the game
function reset_output() {
    console.log("reset_output");
    reInitValues();
    _gameThis.scene.restart();
}



function range(start, end) {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}




Array.prototype.remove = function (value) {
    for (var i = this.length; i--;) {
        if (this[i] === value) {
            this.splice(i, 1);
        }
    }
}



function is_honey_comb_touched() {
    return JustCliked;
}

function hide_touched_honey_comb() {
    if (CLickedTile) { CLickedTile.setVisible(false); }
}

function is_small_jar() {
    return SmallJarFounded;
}

function is_big_jar() {
    return BigJarFounded;
}

function is_bee() {
    return BeeFounded;
}

function display_score() {
    Scoretext.setText(str);
}


var repeat_forever_flag = true;

function runCode() {
    validation();
    // tour_over && tour.complete();
    reset_output();
    window.LoopTrap = 1e3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a =
        "async function c(){" +
        Blockly.JavaScript.workspaceToCode(demoWorkspace) +
        "} c();";
    try {
        eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
        }, 1500);
        setTimeout(() => {
            repeat_forever_flag = true;
        }, 3000);
    } catch (b) {
        alert(b);
    }
    // try {
    //     if (tour.getCurrentStep().options.title.includes("Run")) {
    //         let btns = document.querySelectorAll(".shepherd-button");
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     var xml_wkspace =
//         '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id=":,;BIU--`u!mlF%2vwt%" x="0" y="-38"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="VPDa0#`J;J*[|~Q}c@k;"><field name="NUM">0</field></block></value><next><block type="forever_repeat_block" id="Kn2n^+~[b+rv7p)oWL?y"><statement name="NAME"><block type="controls_if" id="w^u=vu!0uYH2yQ9~hD2K"><value name="IF0"><block type="i_touch_block" id="s:h_9_GQceDX]z(.Sp=/"></block></value><statement name="DO0"><block type="hide_block" id="OAuz!2C/?,}rtPL[0(K3"><field name="NAME">Comb cell</field><next><block type="controls_if" id="E,M-eb4xCtw^CV`Vt[2L"><value name="IF0"><block type="variables" id="o3^I+_9.}~QwMd(5=+$V"><field name="Options">small_jar</field></block></value><statement name="DO0"><block type="arithmetic_block" id="E?Neg#[E;HRstXUx+F1I"><field name="NAME">OPTIONNAME</field><field name="options">option1</field><field name="NAME2">1</field></block></statement><next><block type="controls_if" id="n|ULb+N0+~Uf,P^@P4.e"><value name="IF0"><block type="variables" id="Cw2lq:Pd~i=)SKd]hW`H"><field name="Options">big_jar</field></block></value><statement name="DO0"><block type="arithmetic_block" id="Hczr}RLzCQ^rhB]URn:h"><field name="NAME">OPTIONNAME</field><field name="options">option1</field><field name="NAME2">3</field></block></statement><next><block type="controls_if" id="tJ/3HX070:Fq~W`V6?c2"><value name="IF0"><block type="variables" id="Tu?emkMT7vf_m*QE:8(D"><field name="Options">bees</field></block></value><statement name="DO0"><block type="say_block" id="x1#CRo|WpfCD*B@nzFsz"><field name="say">You lose!</field><next><block type="end_block" id="EBIWWHU%{wPsi0%F))h~"></block></next></block></statement></block></next></block></next></block></next></block></statement><next><block type="controls_if" id="}1B(.[6Awi]m~|EtAdW_"><value name="IF0"><block type="logic_compare" id="9Hss$t2wj*kn4Hr7XM{U"><field name="OP">GTE</field><value name="A"><block type="variables" id="1SLKP)O5H-vN@{qgHOhm"><field name="Options">score</field></block></value><value name="B"><block type="math_number" id="`GXRmb608ikgu.VDv*{3"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="say_block" id="1!^`/$8As-}N{demb|3?"><field name="say">You win !!</field><next><block type="say_block" id="dNtRXLpMat,W:`A6~t;E"><field name="say">You have captured all the honey</field><next><block type="end_block" id="KZ$j:v}oh+/j:.EfDoMm"></block></next></block></next></block></statement></block></next></block></statement></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id=":,;BIU--`u!mlF%2vwt%" x="0" y="-38"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="VPDa0#`J;J*[|~Q}c@k;"><field name="NUM">0</field></block></value><next><block type="forever_repeat_block" id="Kn2n^+~[b+rv7p)oWL?y"><statement name="NAME"><block type="controls_if" id="w^u=vu!0uYH2yQ9~hD2K"><value name="IF0"><block type="i_touch_block" id="s:h_9_GQceDX]z(.Sp=/"></block></value><statement name="DO0"><block type="hide_block" id="OAuz!2C/?,}rtPL[0(K3"><field name="NAME">Comb cell</field><next><block type="controls_if" id="E,M-eb4xCtw^CV`Vt[2L"><value name="IF0"><block type="variables" id="o3^I+_9.}~QwMd(5=+$V"><field name="Options">small_jar</field></block></value><statement name="DO0"><block type="arithmetic_block" id="E?Neg#[E;HRstXUx+F1I"><field name="NAME">OPTIONNAME</field><field name="options">option1</field><field name="NAME2">1</field></block></statement><next><block type="controls_if" id="n|ULb+N0+~Uf,P^@P4.e"><value name="IF0"><block type="variables" id="Cw2lq:Pd~i=)SKd]hW`H"><field name="Options">big_jar</field></block></value><statement name="DO0"><block type="arithmetic_block" id="Hczr}RLzCQ^rhB]URn:h"><field name="NAME">OPTIONNAME</field><field name="options">option1</field><field name="NAME2">3</field></block></statement><next><block type="controls_if" id="tJ/3HX070:Fq~W`V6?c2"><value name="IF0"><block type="variables" id="Tu?emkMT7vf_m*QE:8(D"><field name="Options">bees</field></block></value><statement name="DO0"><block type="say_block" id="x1#CRo|WpfCD*B@nzFsz"><field name="say">You lose!</field><next><block type="end_block" id="EBIWWHU%{wPsi0%F))h~"></block></next></block></statement></block></next></block></next></block></next></block></statement><next><block type="controls_if" id="}1B(.[6Awi]m~|EtAdW_"><value name="IF0"><block type="logic_compare" id="9Hss$t2wj*kn4Hr7XM{U"><field name="OP">GTE</field><value name="A"><block type="variables" id="1SLKP)O5H-vN@{qgHOhm"><field name="Options">score</field></block></value><value name="B"><block type="math_number" id="`GXRmb608ikgu.VDv*{3"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="say_block" id="1!^`/$8As-}N{demb|3?"><field name="say">You win !!</field><next><block type="say_block" id="dNtRXLpMat,W:`A6~t;E"><field name="say">You have captured all the honey</field><next><block type="end_block" id="KZ$j:v}oh+/j:.EfDoMm"></block></next></block></next></block></statement></block></next></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "import dog\n";
    document.getElementById("pycode").innerHTML = import_statement + code;
    document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

// this for validation check.
function validation() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    let code = Blockly.Python.workspaceToCode(demoWorkspace);

    // checking score
    if (!code.includes("score")) {
        M.toast({ html: "Score variable block missing" });
        return true;
    }

    if ((code.match(/is_small/g) || []).length > 1) {
        M.toast({ html: "Small jar is already used" });
        return true;
    }

    if ((code.match(/is_big/g) || []).length > 1) {
        M.toast({ html: "Big jar is already used" });
        return true;
    }
    if ((code.match(/is_bee/g) || []).length > 1) {
        M.toast({ html: "Bees is already used" });
        return true;
    }
}

function completedFlag() {
    return GameIsOver;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import honey"]

export {
    completedFlag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    // sleep,
    score,
    say,
    game_over,
    hide_touched_honey_comb,
    is_bee,
    is_big_jar,
    is_small_jar,
    dummy_increment,
    is_honey_comb_touched,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    reset_inside_update_tasks
}