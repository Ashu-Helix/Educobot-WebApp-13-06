//============================================================================================
//========================================IMPORT STATEMENTS=========================================
//========================================DO NOT DELETE===================================

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

let _gameThis = null;
const baseURL = "../img/images/36a8dd48-0436-453d-8b66-79803fcc4061";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;



const GAME_CONSTANT = {
    images: {
        BG: "Background.png",

    },
    spritesImages: {
        Car: "Car.png",
        Indicator: "Indicator.png",
    }
};

let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;
let MiddleText;
let BG;
//================= GAME VARIABLES ====================================================================================================
//=====================================================================================================================================
let Car;
let Nb_Cars = 0;
let Car_Is_Waiting = false;
let Key = "";
let Indicator;
let Key_;
let Number_cars = 0;
let Indicator_1;
let Indicator_2;
let Current_Car;
//=====================================================================================================================================
var config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    canvasStyle: `width: 100%;
    object-fit: revert;
    aspect-ratio: 738 / 436;`,
    physics: { default: "arcade", arcade: { debug: true } },
    //backgroundColor: "#eeeeee", parent: "circle", physics: {default:"arcade", arcade:{}},
    scene: { preload: preload, create: create, update: update },
};
let game = new Phaser.Game(config);

function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);
    loadImages();
}

function create() {
    BG = this.add.image(gameWidth / 2, gameHeight / 2, "BG").setName("BG");
    _gameThis["BG"] = BG;
    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);

    MiddleText = _gameThis.add.text(gameWidth / 2, 200, "", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 12,
    });
    MiddleText.setOrigin(0.5, 0.5);

    //=====================================================================================================================================
    //============ ADDING GRAPHICS ========================================================================================================
    //=====================================================================================================================================
    Car = _gameThis.add.sprite(-700, 800, "Car");
    Indicator_1 = _gameThis.add.sprite(850, -400, "Indicator");
    Indicator_1.setFrame(4);
    Indicator_2 = _gameThis.add.sprite(1650, -400, "Indicator");
    Indicator_2.setFrame(6);

    prepare_animations();

    //Key Event :
    Key_ = _gameThis.input.keyboard.on("keydown", function (event) {
        if (!Car_Is_Waiting) return;
        //console.log(Key);
        Key = String.fromCharCode(Key_.prevCode);
        Key = Key.toLowerCase();
    });

    // test();
    //=========== THE UPDATE CODE =========================================================================================================
} //====================================================================================================================================
function update() { }
//=====================================================================================================================================
//================= WORK SPACE ========================================================================================================
//=====================================================================================================================================
function start_game() {
    say("Opening Fuel Station...");
    _gameThis.tweens.add({
        targets: Indicator_1,
        y: 400,
        ease: "Power1",
        duration: 250,
        delay: 250,
    });
    _gameThis.tweens.add({
        targets: Indicator_2,
        y: 400,
        ease: "Power1",
        duration: 250,
        delay: 250,
    });

    setTimeout(() => {
        Indicator_1.setFrame(5);
        Indicator_2.setFrame(7);
    }, 1500);
    setTimeout(() => {
        Indicator_1.setFrame(4);
        Indicator_2.setFrame(6);
    }, 1700);
    setTimeout(() => {
        Indicator_1.setFrame(5);
        Indicator_2.setFrame(7);
    }, 1900);
    setTimeout(() => {
        Indicator_1.setFrame(4);
        Indicator_2.setFrame(6);
    }, 2100);
    setTimeout(() => {
        Indicator_1.setFrame(5);
        Indicator_2.setFrame(7);
    }, 2300);
    setTimeout(() => {
        Indicator_1.setFrame(4);
        Indicator_2.setFrame(6);
    }, 2500);
}

function next_car() {
    //Prepare The Car :
    Key = "";
    say("");
    Car.x = -700;
    Current_Car = rand(6);
    let CF = (Current_Car - 1) * 3;
    Car.stop();
    Car.setFrame(CF);

    //The Car Arrives :
    setTimeout(() => {
        Car.play("go" + Current_Car.toString());
    }, 250);
    _gameThis.tweens.add({
        targets: Car,
        x: 400,
        ease: "Power1",
        duration: 500,
        delay: 250,
    });

    setTimeout(() => {
        Car.stop();
        say("What's The Type Of Fuel ? (e/f)");
        Car_Is_Waiting = true;
        Number_cars++;
    }, 250);
}

function move_to_fuel_bunk() {
    if (Current_Car == 2 || Current_Car == 5 || Current_Car == 6) {
        //The Car Is The "Fuel" Kind :
        say("Fueling...");
        setTimeout(() => {
            Car.play("go" + Current_Car.toString());
        }, 250);
        _gameThis.tweens.add({
            targets: Car,
            x: 1650,
            ease: "Power1",
            duration: 1500,
            delay: 250,
        });
        setTimeout(() => {
            Car.stop();
            Indicator_2.setFrame(2);
        }, 750);
    } else {
        //
        M.toast({ html: "You have selected the wrong bunk for the car" });
        //
        say("Wrong Fuel Type !");
        setTimeout(() => {
            Car.play("go" + Current_Car.toString());
        }, 250);
        _gameThis.tweens.add({
            targets: Car,
            x: 1650,
            ease: "Power1",
            duration: 1500,
            delay: 250,
        });
        setTimeout(() => {
            Car.stop();
            Indicator_2.setFrame(3);
        }, 750);
    }
    //Car Leaves :
    setTimeout(() => {
        say("");
    }, 1750);
    setTimeout(() => {
        Indicator_2.setFrame(6);
        Car.play("go" + Current_Car.toString());
        _gameThis.tweens.add({
            targets: Car,
            x: 2300,
            ease: "Power1",
            duration: 500,
        });
        if (Number_cars >= 4) GameIsOver = true;
    }, 3000);
}

function move_to_electricity_bunk() {
    if (Current_Car == 1 || Current_Car == 3 || Current_Car == 4) {
        //The Car Is The "Electric" Kind :
        say("Charging...");
        setTimeout(() => {
            Car.play("go" + Current_Car.toString());
        }, 250);
        _gameThis.tweens.add({
            targets: Car,
            x: 850,
            ease: "Power1",
            duration: 1500,
            delay: 250,
        });
        setTimeout(() => {
            Car.stop();
            Indicator_1.setFrame(0);
        }, 750);
    } else {
        //
        M.toast({ html: "You have selected the wrong bunk for the car" });
        //
        say("Wrong Fuel Type !");
        setTimeout(() => {
            Car.play("go" + Current_Car.toString());
        }, 250);
        _gameThis.tweens.add({
            targets: Car,
            x: 850,
            ease: "Power1",
            duration: 1500,
            delay: 250,
        });
        setTimeout(() => {
            Car.stop();
            Indicator_1.setFrame(1);
        }, 750);
    }
    //Car Leaves :
    setTimeout(() => {
        say("");
    }, 1750);
    setTimeout(() => {
        Indicator_1.setFrame(4);
        Car.play("go" + Current_Car.toString());
        _gameThis.tweens.add({
            targets: Car,
            x: 2300,
            ease: "Power1",
            duration: 500,
        });
        if (Number_cars >= 4) GameIsOver = true;
    }, 3000);
}
async function wait_for_key_press() {
    await waiting_key();
    return Key;
}
async function waiting_key() {
    //console.log(Key);
    Car_Is_Waiting = true;
    while (Key != "e" && Key != "f") {
        //sconsole.log(Key);
        await sleep(0.5);
    }

    Car_Is_Waiting = false;
    return;
    //return new Promise((resolve)=>{setTimeout(()=>{resolve(true)},500000);});
}

function prepare_animations() {
    _gameThis.anims.create({
        key: "go1",
        frames: _gameThis.anims.generateFrameNumbers("Car", { frames: [0, 1, 2] }),
        frameRate: 8,
        repeat: -1,
    });
    _gameThis.anims.create({
        key: "go2",
        frames: _gameThis.anims.generateFrameNumbers("Car", { frames: [3, 4, 5] }),
        frameRate: 8,
        repeat: -1,
    });
    _gameThis.anims.create({
        key: "go3",
        frames: _gameThis.anims.generateFrameNumbers("Car", { frames: [6, 7, 8] }),
        frameRate: 8,
        repeat: -1,
    });
    _gameThis.anims.create({
        key: "go4",
        frames: _gameThis.anims.generateFrameNumbers("Car", {
            frames: [9, 10, 11],
        }),
        frameRate: 8,
        repeat: -1,
    });
    _gameThis.anims.create({
        key: "go5",
        frames: _gameThis.anims.generateFrameNumbers("Car", {
            frames: [12, 13, 14],
        }),
        frameRate: 8,
        repeat: -1,
    });
    _gameThis.anims.create({
        key: "go6",
        frames: _gameThis.anims.generateFrameNumbers("Car", {
            frames: [15, 16, 17],
        }),
        frameRate: 8,
        repeat: -1,
    });
}

function game_over() {
    GameIsOver = true;
}

function finish_game() {
    // if(Nb_Cars==5){ say(""); //Game Finished..
    //    _gameThis.tweens.add({targets:Indicator_1,y:-400,ease:'Power1',duration:250,delay:250});
    //    _gameThis.tweens.add({targets:Indicator_2,y:-400,ease:'Power1',duration:250,delay:250});
    // }
    _gameThis.tweens.add({ targets: Indicator_1, y: -400, ease: 'Power1', duration: 250, delay: 250 });
    _gameThis.tweens.add({ targets: Indicator_2, y: -400, ease: 'Power1', duration: 250, delay: 250 });
}

function say(str) {
    setTimeout(() => {
        MiddleText.setText(str);
    }, 1200);
}
async function sleep(seconds) {
    finish_game();
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}
//=====================================================================================================================================
//=====================================================================================================================================
function loadImages() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;
    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(key, element);
        }
    }
    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            if (key == "Car") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 680,
                    frameHeight: 300,
                });
            }
            if (key == "Indicator") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 264,
                    frameHeight: 241,
                });
            }
        }
    }
}

function ShowError() {
    ErrorText.setAlpha(1);
    ErrorText.setText(ErrorInnerText); //use error text
    _gameThis.tweens.add({
        targets: ErrorText,
        alpha: 0,
        duration: 500,
        delay: 2500,
    });
}
// Re-initialize the game variables
function reInitValues() {
    Number_cars = 0;
    GameIsOver = false;
    Nb_Cars = 0;
    Car_Is_Waiting = false;
    Key = "";
}

function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}
//=====================================================================================================================================
//=====================================================================================================================================
function rand(a) {
    return Math.floor(Math.random() * a) + 1;
}

async function test() {
    start_game();
    await sleep(4);
    for (Nb_Cars = 0; Nb_Cars <= 4; Nb_Cars++) {
        next_car();
        await sleep(2);

        Key = await wait_for_key_press(); //this fn waits and returns key press
        if (Key == "f") {
            move_to_fuel_bunk();
        }
        if (Key == "e") {
            move_to_electricity_bunk();
        }
        await sleep(5);
    }
}

function completedFlag() {
    return GameIsOver
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import fuel_electric_station"]

// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="single_action_block" id="`!39$9m.u-Smo{b=zt_u" x="100" y="65"><next><block type="wait_block" id="u#uW+0CW)oKb/{!DWgrq"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="mOp:pMzd=30s+F?b:*$:"><field name="NUM">4</field></block></value><next><block type="controls_repeat_ext" id="Y!(vx{WEG([0;tf+i_%s"><value name="TIMES"><block type="math_number" id="k%jpX%x`bG=:x:sC`a=$"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_block" id="ExYi649i_+;0cQ-jA7m9"><next><block type="wait_block" id="_$MMDa[pQbh*=J1BB#tr"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="PtHC?yh!PpxSO,k:eF3Y"><field name="NUM">2</field></block></value><next><block type="key_block" id="9=/:21%yS$qJR8qRt!lI"><next><block type="controls_if" id="RS5BHgLA07B;SZ)HP!g;"><mutation elseif="1"></mutation><value name="IF0"><block type="key_sensing" id="Bf^%=r9o-rinsel:.:P8"><field name="NAME">option5</field></block></value><statement name="DO0"><block type="move_to_block" id="ldr%R}|a6I@ui6?z}In+"><field name="options1">option1</field></block></statement><value name="IF1"><block type="key_sensing" id="zw~x$reG:nz8adpE/Oln"><field name="NAME">option6</field></block></value><statement name="DO1"><block type="move_to_block" id="d29:M2T7u/aAJ0GNlo}|"><field name="options1">OPTIONNAME</field></block></statement><next><block type="wait_block" id="6L;~FV1U{Q^lS`QsY9oM"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="y0?sLyt~4ql7FFbzl:|g"><field name="NUM">5</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>';

function validation() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    let code = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    // checking start
    if (code.includes(`Key == "f"`)) {
        if (!code.includes(`(Key == "f") {\n    move_to_fuel_bunk();\n  }`)) {
            M.toast({ html: "You have chosen the wrong bunk for F/E key" });
            return true;
        }
    }

    if (code.includes(`Key == "e"`)) {
        if (
            !code.includes(`(Key == "e") {\n    move_to_electricity_bunk();\n  }`)
        ) {
            M.toast({ html: "You have chosen the wrong bunk for F/E key" });
            return true;
        }
    }
}


var repeat_forever_flag = true;
function runCode() {
    // tour_over && tour.complete();
    // Reset variables
    // let a = `update = ()=>{if (!isGameCompleted) {` + Blockly.JavaScript.workspaceToCode(demoWorkspace) + `}}`;
    // let a = `Blockly.JavaScript.workspaceToCode(demoWorkspace)`;
    reInitValues();
    validation();
    window.LoopTrap = 1e3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a =
        "async function c(){" +
        Blockly.JavaScript.workspaceToCode(demoWorkspace) +
        "} c();";
    // Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        // eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
            repeat_forever_flag = true;
        }, 2000);
    } catch (b) {
        alert(b);
    }
    // try {
    //     if (tour.getCurrentStep().options.title === "Run and see what happens") {
    //         let btns = document.querySelectorAll(".shepherd-button");
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

const instruction = {
    "heading": "Send the electric car to the electric station and the fuel car to the fuel station",
    "steps": [{
        "checkbox": true,
        "rescue": true,
        "text": "Start game",
        "title": "Start game",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "wait for 4 secs",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "Add the loop and do all the following operations in it",
        "title": "Repeat 4 times",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "Next car",
        "title": "Next car",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value><statement name=\"DO\"><block type=\"next_block\" id=\"ExYi649i_+;0cQ-jA7m9\"></block></statement></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "wait for 2 sec",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value><statement name=\"DO\"><block type=\"next_block\" id=\"ExYi649i_+;0cQ-jA7m9\"><next><block type=\"wait_block\" id=\"_$MMDa[pQbh*=J1BB#tr\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"PtHC?yh!PpxSO,k:eF3Y\"><field name=\"NUM\">2</field></block></value></block></next></block></statement></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "Wait for key press",
        "title": "Key press",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value><statement name=\"DO\"><block type=\"next_block\" id=\"ExYi649i_+;0cQ-jA7m9\"><next><block type=\"wait_block\" id=\"_$MMDa[pQbh*=J1BB#tr\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"PtHC?yh!PpxSO,k:eF3Y\"><field name=\"NUM\">2</field></block></value><next><block type=\"key_block\" id=\"9=/:21%yS$qJR8qRt!lI\"></block></next></block></next></block></statement></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "if Key pressed is F, Move to Fuel Bunk",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value><statement name=\"DO\"><block type=\"next_block\" id=\"ExYi649i_+;0cQ-jA7m9\"><next><block type=\"wait_block\" id=\"_$MMDa[pQbh*=J1BB#tr\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"PtHC?yh!PpxSO,k:eF3Y\"><field name=\"NUM\">2</field></block></value><next><block type=\"key_block\" id=\"9=/:21%yS$qJR8qRt!lI\"><next><block type=\"controls_if\" id=\"RS5BHgLA07B;SZ)HP!g;\"><value name=\"IF0\"><block type=\"key_sensing\" id=\"Bf^%=r9o-rinsel:.:P8\"><field name=\"NAME\">option5</field></block></value><statement name=\"DO0\"><block type=\"move_to_block\" id=\"ldr%R}|a6I@ui6?z}In+\"><field name=\"options1\">option1</field></block></statement></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "else if, Key pressed is E, Move to Electricity Bunk",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value><statement name=\"DO\"><block type=\"next_block\" id=\"ExYi649i_+;0cQ-jA7m9\"><next><block type=\"wait_block\" id=\"_$MMDa[pQbh*=J1BB#tr\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"PtHC?yh!PpxSO,k:eF3Y\"><field name=\"NUM\">2</field></block></value><next><block type=\"key_block\" id=\"9=/:21%yS$qJR8qRt!lI\"><next><block type=\"controls_if\" id=\"RS5BHgLA07B;SZ)HP!g;\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"Bf^%=r9o-rinsel:.:P8\"><field name=\"NAME\">option5</field></block></value><statement name=\"DO0\"><block type=\"move_to_block\" id=\"ldr%R}|a6I@ui6?z}In+\"><field name=\"options1\">option1</field></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"zw~x$reG:nz8adpE/Oln\"><field name=\"NAME\">option6</field></block></value><statement name=\"DO1\"><block type=\"move_to_block\" id=\"d29:M2T7u/aAJ0GNlo}|\"><field name=\"options1\">OPTIONNAME</field></block></statement></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>"
    },
    {
        "checkbox": true,
        "rescue": true,
        "text": "wait for 5 secs",
        "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"single_action_block\" id=\"`!39$9m.u-Smo{b=zt_u\" x=\"100\" y=\"65\"><next><block type=\"wait_block\" id=\"u#uW+0CW)oKb/{!DWgrq\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"mOp:pMzd=30s+F?b:*$:\"><field name=\"NUM\">4</field></block></value><next><block type=\"controls_repeat_ext\" id=\"Y!(vx{WEG([0;tf+i_%s\"><value name=\"TIMES\"><block type=\"math_number\" id=\"k%jpX%x`bG=:x:sC`a=$\"><field name=\"NUM\">4</field></block></value><statement name=\"DO\"><block type=\"next_block\" id=\"ExYi649i_+;0cQ-jA7m9\"><next><block type=\"wait_block\" id=\"_$MMDa[pQbh*=J1BB#tr\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"PtHC?yh!PpxSO,k:eF3Y\"><field name=\"NUM\">2</field></block></value><next><block type=\"key_block\" id=\"9=/:21%yS$qJR8qRt!lI\"><next><block type=\"controls_if\" id=\"RS5BHgLA07B;SZ)HP!g;\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"Bf^%=r9o-rinsel:.:P8\"><field name=\"NAME\">option5</field></block></value><statement name=\"DO0\"><block type=\"move_to_block\" id=\"ldr%R}|a6I@ui6?z}In+\"><field name=\"options1\">option1</field></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"zw~x$reG:nz8adpE/Oln\"><field name=\"NAME\">option6</field></block></value><statement name=\"DO1\"><block type=\"move_to_block\" id=\"d29:M2T7u/aAJ0GNlo}|\"><field name=\"options1\">OPTIONNAME</field></block></statement><next><block type=\"wait_block\" id=\"6L;~FV1U{Q^lS`QsY9oM\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"y0?sLyt~4ql7FFbzl:|g\"><field name=\"NUM\">5</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>"
    },
    {
        "checkbox": null,
        "rescue": null,
        "text": "Look for the icon near the fuel tank of the car to know if it's an an electric or fuel car, then send them to the correct station. Press e to send them to electric charging station and f to send them to fuel station",
        "title": "Instructions",
        "workspace": null
    }
    ]
};

//============================================================================================
//========================================EXPORT STATEMENTS=========================================
//========================================DO NOT DELETE===================================
export {
    completedFlag,
    // myUpdateFunction,
    // helpCode,
    instruction,
    runCode,
    reset_output,
    reInitValues,
    start_game,
    Key,
    move_to_fuel_bunk,
    move_to_electricity_bunk,
    next_car,
    sleep,
    wait_for_key_press,
    getNoOfBlocks,
    updateImports,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    repeat_forever_flag
}