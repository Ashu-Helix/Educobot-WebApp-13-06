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
const gameScale = 1;


const GAME_CONSTANT = {
    images: {
        BG: "images/Background grab-the-crab.png",
        Hole: "images/Hole.png",
    },
    spritesImages: {
        //bird: "Bird",
        Crab: { key: "crabs", crabConfig: { frameWidth: 80, frameHeight: 80 } },
    },
};
const ERROR_MESSAGE = "";
const CORRECT_MESSAGE = "";

let layerOfCrabs;
let lives = 3;
let touchedCrab = null;;
let crabJustTouched = false;
let Score = 0;
let ErrorText;
let ErrorInnerText = '';
let GameIsOver = false;
// let ScoreText;
let dummy_increment = 0;

let AllTimeLines = [];
let Crab_Speed = 0.6;
let AllHolesPositions = [{ x: 0, y: -110 }, { x: -800, y: -100 }, { x: 800, y: -200 }, { x: 500, y: 100 }, { x: -500, y: 100 }]
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


    let BG = this.add.image(gameWidth / 2, gameHeight / 2, 'BG').setName('BG');
    _gameThis['BG'] = BG;


    // Create Container of holes
    const layer = this.add.container(gameWidth / 2, gameHeight * 0.8);
    var Hole0 = this.add.sprite(0, -110, 'Hole');
    var Hole1 = this.add.sprite(-800, -100, 'Hole');
    var Hole2 = this.add.sprite(800, -200, 'Hole');
    var Hole3 = this.add.sprite(500, 100, 'Hole');
    var Hole4 = this.add.sprite(-500, 100, 'Hole');
    layer.add([Hole0, Hole1, Hole2, Hole3, Hole4]);
    _gameThis['layer'] = layer;

    ErrorText = _gameThis.add.text(0, 0, "Error...", { font: "bold 36px Arial", fill: "#ff0000" });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75)
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);

    window['ScoreText'] = _gameThis.add.text(gameWidth / 2, 22, "Score : 0", { font: "bold 68px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 12 });
    window['ScoreText'].setOrigin(0.5, 0);


    //text : lives
    window['LivesTXT'] = _gameThis.add.text(
        gameWidth * 0.75,
        22,
        "Lives : " + lives, { font: "bold 68px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 12 });



    _gameThis.anims.create({
        key: 'walk',
        frames: _gameThis.anims.generateFrameNumbers('Crab'),
        frameRate: 10
    });


}

function i_touch_crab() {
    return crabJustTouched;
}

function hide_crab() {
    if (touchedCrab) {
        if (!touchedCrab.getData('counted')) {
            touchedCrab.setData({ counted: true });
            // Score++;


            touchedCrab.setVisible(false);
            touchedCrab.getData('MyTimeline').stop(true);
            crabJustTouched = false;
            if (!GameIsOver) {

                let randomPosition = Math.floor(Math.random() * AllHolesPositions.length);
                touchedCrab.setPosition(AllHolesPositions[randomPosition].x, AllHolesPositions[randomPosition].y);
                touchedCrab.setVisible(true);
                Crab_Speed += 0.001;
                touchedCrab.setData({ counted: false });
                tweenCrab(touchedCrab, 8 + Math.random() * 8, 1, 0);
                touchedCrab = null;
            }


        }


    }
}

function crab_touches_sea() {
    let Touchsea = false;
    if (layerOfCrabs) {
        for (let c = 0; c < layerOfCrabs.getAll().length; c++) {
            //console.log(layerOfCrabs.getAt(c).y)
            if (layerOfCrabs.getAt(c).y < -600 && layerOfCrabs.getAt(c).visible) {
                Touchsea = true;
                //appears again
                let _Crab = layerOfCrabs.getAt(c);
                console.log('_Crab.name', _Crab.name)
                _Crab.setVisible(false);
            }
        }
    }

    return Touchsea;
}

function start_game() {
    console.log('------------------->Start_Game');
    //remove old created layer
    if (layerOfCrabs) { layerOfCrabs.destroy(true) }
    // Add Crabs layer
    layerOfCrabs = _gameThis.add.container(gameWidth / 2, gameHeight * 0.8);

    //Crabs going to the top
    var Crab0 = _gameThis.add.sprite(0, -110, 'Crab').setScale(1.7).setInteractive();
    var Crab1 = _gameThis.add.sprite(-800, -100, 'Crab').setScale(1.7).setInteractive();
    var Crab2 = _gameThis.add.sprite(800, -200, 'Crab').setScale(1.7).setInteractive();
    var Crab3 = _gameThis.add.sprite(-500, 100, 'Crab').setScale(1.7).setInteractive();
    var Crab4 = _gameThis.add.sprite(500, 100, 'Crab').setScale(1.7).setInteractive();
    layerOfCrabs.add([Crab0, Crab1, Crab2, Crab3, Crab4]);
    //anime crab
    Crab0.play({ key: 'walk', repeat: -1 }).setName('c0');
    Crab1.play({ key: 'walk', repeat: -1 }).setName('c1');
    Crab2.play({ key: 'walk', repeat: -1 }).setName('c2');
    Crab3.play({ key: 'walk', repeat: -1 }).setName('c3');
    Crab4.play({ key: 'walk', repeat: -1 }).setName('c4');

    Crab0.setData({ counted: false });
    Crab1.setData({ counted: false });
    Crab2.setData({ counted: false });
    Crab3.setData({ counted: false });
    Crab4.setData({ counted: false });

    //ref
    _gameThis['layerOfCrabs'] = layerOfCrabs;
    //enable crabs clicks and tween crans
    layerOfCrabs.each((crab) => {

        crab.on('pointerdown', () => {
            touchedCrab = crab;
            crabJustTouched = true;
        })
        tweenCrab(crab, 8 + Math.random() * 8, 1, 0);
    });



}

function tweenCrab(Crab, y, direction, _delay) {

    let timeline = _gameThis.tweens.createTimeline();
    Crab.setData({ MyTimeline: timeline });
    AllTimeLines.push(timeline);

    timeline.add({
        targets: Crab,
        x: Crab.x + (Math.random() * 200) - 150,
        duration: 20 * y / Crab_Speed,
        delay: _delay,
        ease: 'linear',
    });

    timeline.add({
        targets: Crab,
        y: -350 * direction,
        duration: 100 * y / Crab_Speed,
        ease: 'linear',
    });
    timeline.add({
        targets: Crab,
        x: Crab.x + (Math.random() * 200) - 150,
        y: -500 * direction,
        duration: 50 * y / Crab_Speed,
        ease: 'linear',
    });
    timeline.add({
        targets: Crab,
        x: Crab.x + (Math.random() * 200) - 150,
        y: -850 * direction,
        // alpha:0,
        duration: 200 * y / Crab_Speed,
        ease: 'linear',
        onComplete: () => {


            if (!GameIsOver) {
                let randomPosition = Math.floor(Math.random() * AllHolesPositions.length);
                Crab.setPosition(AllHolesPositions[randomPosition].x, AllHolesPositions[randomPosition].y);
                Crab.setVisible(true);
                Crab.setData({ counted: false });
                tweenCrab(Crab, 8 + Math.random() * 8, 1, 0);
            }
        }
    });
    timeline.play();
}




function game_over() {
    // GameIsOver = true;
    if (!GameIsOver) {
        // for (var i = 0; i <= 50; i++) {
        //     setTimeout(() => {
        //         LivesTXT.setText('Lives: 0');
        //     }, 300)
        // }
        console.log('Game Is Over')
        GameIsOver = true;
        layerOfCrabs.setVisible(false);

    }
}

function say(str) {
    console.log('say', str);
}




function update() {
    if (!GameIsOver) {
        if (i_touch_crab()) {
            hide_crab();
            Score += 1;
        }

        if (crab_touches_sea()) {
            lives -= 1;
        }

        if (lives <= 0) {
            game_over();
        }

        if (window['LivesTXT'] >= 0) {
            window['LivesTXT'].setText("Lives : " + lives);
        }
        window['ScoreText'].setText("Score : " + Score);
    }
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
            const element = spritesImages[key].key;
            console.log(element)
            const elementValue = spritesImages[key].crabConfig
            console.log(elementValue)
            _gameThis.load.spritesheet(key, "images/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
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
        delay: 2500
    });
}

// Re-initialize the game variables
function reInitValues() {
    lives = 3;
    Crab_Speed = 0.8;
    GameIsOver = false;
}
// Reset the game
function reset_output() {
    console.log('reset_output')
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
    // } catch { }
}


// function helpCode() {
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="start_game_block" id="9#zmxMqqM[xmRnrPRHd(" x="86" y="30"><next><block type="set_variable_holder" id="hl^J0v0$dwtACaCb^P;4"><field name="Variable name">Score</field><value name="NAME"><block type="math_number" id="c_5k4};8Bv]S6U.#:%l`"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="tnPlwn$Ks8#%)Ch6Y|Hw"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="01/wWm*H1@pZ3fW[(Qq?"><field name="NUM">3</field></block></value><next><block type="forever_repeat_block" id="kY,$H?F.z|X?LWop|]0j"><statement name="NAME"><block type="controls_if" id="%1KKo4#BMJ@Udl_m@WWq"><value name="IF0"><block type="Custom_text" id="D%;[lh$ndI;Wd/[9|c0A"></block></value><statement name="DO0"><block type="hide_block" id="7g.xvw^:CG_o`v4`1#NZ"><field name="Variable_name"> crab</field><next><block type="change_variable_holder" id=",]xy+B~*4#=9P3*hp=6T"><field name="Variable name">Score</field><value name="NAME"><block type="math_number" id="W+(j$PE:m[9|g~hV+)lA"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id="ocWepK[WZ}yYdBlyJaXN"><value name="IF0"><block type="spritetouch_block" id="CQ*+aYmM_8{$!`^]?IQm"><field name="options1">Crab</field><field name="options2">Sea</field></block></value><statement name="DO0"><block type="change_variable_holder" id="4a_m!102w@~4IY9`1w3?"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="yu|0.|HViVY)Cn4Q@R-@"><field name="NUM">-1</field></block></value></block></statement><next><block type="controls_if" id="_{GNyF!A(qdJWu#fIW#}"><value name="IF0"><block type="logic_compare" id="[^f*?kr56iYz@hX@Zp5c"><field name="OP">LTE</field><value name="A"><block type="variables" id="W%%L9UYG:3%wuBxggqo#"><field name="Options">lives</field></block></value><value name="B"><block type="math_number" id="R2Uzoh0h;8vwA+yqPN8#"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="end_block" id="D?==wx7IY_G{}~la82A="></block></statement></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="start_game_block" id="9#zmxMqqM[xmRnrPRHd(" x="86" y="30"><next><block type="set_variable_holder" id="hl^J0v0$dwtACaCb^P;4"><field name="Variable name">Score</field><value name="NAME"><block type="math_number" id="c_5k4};8Bv]S6U.#:%l`"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="tnPlwn$Ks8#%)Ch6Y|Hw"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="01/wWm*H1@pZ3fW[(Qq?"><field name="NUM">3</field></block></value><next><block type="forever_repeat_block" id="kY,$H?F.z|X?LWop|]0j"><statement name="NAME"><block type="controls_if" id="%1KKo4#BMJ@Udl_m@WWq"><value name="IF0"><block type="Custom_text" id="D%;[lh$ndI;Wd/[9|c0A"></block></value><statement name="DO0"><block type="hide_block" id="7g.xvw^:CG_o`v4`1#NZ"><field name="Variable_name"> crab</field><next><block type="change_variable_holder" id=",]xy+B~*4#=9P3*hp=6T"><field name="Variable name">Score</field><value name="NAME"><block type="math_number" id="W+(j$PE:m[9|g~hV+)lA"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id="ocWepK[WZ}yYdBlyJaXN"><value name="IF0"><block type="spritetouch_block" id="CQ*+aYmM_8{$!`^]?IQm"><field name="options1">Crab</field><field name="options2">Sea</field></block></value><statement name="DO0"><block type="change_variable_holder" id="4a_m!102w@~4IY9`1w3?"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="yu|0.|HViVY)Cn4Q@R-@"><field name="NUM">-1</field></block></value></block></statement><next><block type="controls_if" id="_{GNyF!A(qdJWu#fIW#}"><value name="IF0"><block type="logic_compare" id="[^f*?kr56iYz@hX@Zp5c"><field name="OP">LTE</field><value name="A"><block type="variables" id="W%%L9UYG:3%wuBxggqo#"><field name="Options">lives</field></block></value><value name="B"><block type="math_number" id="R2Uzoh0h;8vwA+yqPN8#"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="end_block" id="D?==wx7IY_G{}~la82A="></block></statement></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>';


function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = 'import * from beach_crab\n';
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);


function completedFlag() {
    return GameIsOver;
}


function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import * from beach_crab"]

export {
    completedFlag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    lives,
    Score,
    dummy_increment,
    hide_crab,
    crab_touches_sea,
    start_game,
    i_touch_crab,
    update,
    game_over,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    GameIsOver,
}