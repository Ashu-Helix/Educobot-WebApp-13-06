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
let input_count = 0;
let display_count = 0;

const GAME_CONSTANT = {
    images: {
        "background": "images/Robot_Il_Background.png",
        "above": "images/Black_Above_Background.png",
        "movedrobot": "images/Robot_RtoL.png",
        "hand": "images/hand.png",
        "fixedrobot": "images/robot simple-bot.png",
        "speech": "images/Robot_Il_speech.png"

    },
    spritesImages: {
        text: "spritesheet"
    }
};
const ERROR_MESSAGE = '';
const CORRECT_MESSAGE = '';

let name_, age, grade, favourite;

let name_blockly = 'Jhon doe';
let age_blockly = '40 years old';
let grade_blockly = '2nd grade';
let favourite_blockly = 'FootBall';

let say_text = "";

let ErrorText;
let ErrorInnerText = '';
let GameIsOver = false;
let Middletext;

let anim1; //moving block
let hand; //moving hand
let robotspeech;
let robottext;
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
    let images = GAME_CONSTANT.images;
    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            if (key == 'speech') {
                _gameThis[key] = _gameThis.add.image(_gameThis['fixedrobot'].x - _gameThis['fixedrobot'].displayWidth * 0.5, _gameThis['fixedrobot'].y - _gameThis['fixedrobot'].displayHeight * 0.7, key);
                _gameThis[key].setName(key);
                robotspeech = _gameThis[key];
                robotspeech.setScale(0.65);

                robottext = _gameThis.add.text(
                    robotspeech.x - robotspeech.displayWidth * 0,
                    robotspeech.y - robotspeech.displayHeight * 0.1,
                    "okok", { font: "bold 36px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 6, align: 'center' });
                robottext.setOrigin(0.5, 0.5);

                robottext.setVisible(false);
                robotspeech.setVisible(false);
            }
            if (key == 'background') {
                _gameThis[key] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, key);
                _gameThis[key].setName(key)
            }
            if (key == "above") {
                _gameThis[key] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, key);
                _gameThis[key].setName(key)
                    .setTint(0x000000)
                    .setAlpha(0.5);
            }
            if (key == 'movedrobot') {
                _gameThis[key] = _gameThis.add.image((4 * this.cameras.main.width) / 6, 800, key);
                _gameThis[key].setName(key);
                _gameThis[key].setScale(0.7);
                _gameThis[key].flipX = true;
                this.tweens.add({
                    targets: _gameThis[key],
                    props: {
                        x: {
                            value: (5 * this.cameras.main.width) / 6,
                            duration: 2000,
                            flipX: true,
                        },
                    },
                    ease: "linear",
                    yoyo: true,
                    repeat: -1,
                });
            }
            if (key == 'hand') {
                _gameThis[key] = _gameThis.add.image(0.307 * this.cameras.main.width, this.cameras.main.height * 0.590, key);
                _gameThis[key].setName(key);
                _gameThis[key].setScale(0.18)
                _gameThis[key].setOrigin(0, 0);
                hand = _gameThis[key];

            }
            if (key == "fixedrobot") {
                _gameThis[key] = _gameThis.add.image(this.cameras.main.width * 0.245, 710, key);
                _gameThis[key].setName(key);
                _gameThis[key].setScale(0.19, 0.19);
            }

        }
    }

    this.anims.create({
        key: "animation1",
        frames: this.anims.generateFrameNames("text", {
            prefix: "font texte ",
            suffix: ".png",
            start: 1,
            end: 7,
            zeroPad: 0
        }),
        frameRate: 18,
        repeat: 1
    });
    anim1 = this.add.sprite(this.cameras.main.width, this.cameras.main.height * 0.57, 'text', 'font texte 1.png').setScale(4);



    ErrorText = _gameThis.add.text(0, 0, "Error...", { font: "bold 36px Arial", fill: "#ff0000" });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75)
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);


    Middletext = _gameThis.add.text(
        this.cameras.main.width * 0.55,
        anim1.y,
        "", { font: "bold 58px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 12 });
    Middletext.setOrigin(0.5, 0.5);
    Middletext.setVisible(false);

}

function get_input_from_user() { return prompt(say_text.replace('\n', '')); }

async function display_details() {
    return new Promise((resolve) => {
        display_detail(`Name: ${name_}\nAge: ${age}\nGrade: ${grade}\nFavourite: ${favourite}`);
        // display_detail(age);
        // display_detail(grade);
        // display_detail(favourite);
        resolve()
    });
}

function display_detail(str) {
    Middletext.setText(str);
    showUserText();
    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, 4500); })
}



function say(str) {
    str = str.match(/.{1,25}/g).join("\n");

    robottext.setText(str);
    robotspeech.setVisible(true);
    let scx = robotspeech.scaleX;
    robotspeech.setScale(0.3, 0.3);
    _gameThis.tweens.add({
        targets: robotspeech,
        scale: scx,
        ease: "linear",
        duration: 100,
        onComplete: () => { robottext.setVisible(true); }
    });
    say_text = str;
    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, 100); })
}



function sleep(T) {

    return new Promise((resolve) => {
        setTimeout(() => {
            robotspeech.setVisible(false);
            robottext.setVisible(false);
            resolve(true);
        }, T);
    })
}

function showUserText() {
    //anime the hand
    _gameThis.tweens.add({
        targets: hand,
        props: {
            angle: -50,
        },
        duration: 1000,
        ease: "linear",
        repeatDelay: 1000,
        yoyo: true,
        repeat: 1,
    });
    //anime the bloc
    anim1.play('animation1');
    _gameThis.tweens.add({
        targets: anim1,
        x: _gameThis.cameras.main.width * 0.55,
        ease: "linear",
        duration: 300,
        onComplete: () => { Middletext.setVisible(true) }
    });
    setTimeout(HideUserText, 3000);

}

function HideUserText() {
    Middletext.setVisible(false);
    _gameThis.tweens.add({
        targets: anim1,
        x: _gameThis.cameras.main.width,
        ease: "linear",
        duration: 300,
    });
}

function game_over() {
    GameIsOver = true;
}

function update() { }

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
            const element = spritesImages[key];
            console.log(key, element)
            _gameThis.load.atlas(
                key,
                "images/" + element + ".png",
                "images/" + element + ".json"
            );
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

function Start_Game() {
    console.log('------------------->Start_Game');
}
// Re-initialize the game variables
function reInitValues() {
    var CanClick = true;
    robottext.setVisible(false);
    robotspeech.setVisible(false);
    Middletext.setVisible(false);
    GameIsOver = false;
    input_count = 0;
    display_count = 0;
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
    // Reset variables
    // let a = `update = ()=>{if (!isGameCompleted) {` + Blockly.JavaScript.workspaceToCode(demoWorkspace) + `}}`;
    // let a = `Blockly.JavaScript.workspaceToCode(demoWorkspace)`;
    reInitValues();
    window.LoopTrap = 1E3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var aa = ``;
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + aa + "} c();";
    // Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    try {
        eval(a);
        repeat_forever_flag = false;
        // setTimeout(() => {
        //     eval(a);
        //     repeat_forever_flag = true;
        // }, 2000);
    } catch (b) { alert(b) }
    // try {
    //     if (tour.getCurrentStep().options.title === "Run and see what happens") {
    //         let btns = document.querySelectorAll('.shepherd-button');
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="say_block" id="Up,=srazWR)bUB^loTGd" x="-18" y="-623"><field name="dialogue">Hello I am the new bot.</field><next><block type="wait" id="sqb5!2rs!gbx%:c)Kb#@"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="5rF=V@:#+V#0QV2Ql}$o"><field name="NUM">2</field></block></value><next><block type="say_block" id="v0KVDZ:!n2Y5~rD]f{X?"><field name="dialogue">I would like to know about you</field><next><block type="wait" id=":JU~2;vV(IhEG(Wi8VF+"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="{qRyR~YI*:(.XC_.fb/k"><field name="NUM">2</field></block></value><next><block type="say_block" id="!3:||70p-vi|2Ex;U%Cr"><field name="dialogue">What is your name?</field><next><block type="wait" id="Tlge21]cSKMdhhT*}zi-"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="m{cU^LU=al^:rLR8L:dr"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="_:d;zqb~p3t.hs3)rRE9"><field name="Variable">name</field><value name="NAME"><block type="input_block" id="k=Rl{Pb(qSaHDlu=?W*k"></block></value><next><block type="say_block" id="5u,;ar0IU%6#@A.$bPv."><field name="dialogue">That is a good name!</field><next><block type="wait" id="+v|qxk6XyMw(eYN+3V(~"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="h;3dwskh~)g=eBy]osyt"><field name="NUM">2</field></block></value><next><block type="say_block" id="$E(t]VQ/q~xW#^:Ah}.7"><field name="dialogue">What is your age?</field><next><block type="wait" id="*CzB)YNI$rg,8W6[N2-t"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="S,9!h*lvS7O:svpSPxne"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="lK;WoG)mS%2mS=;qAJiu"><field name="Variable">age</field><value name="NAME"><block type="input_block" id="I~(9.ul^*Dov%oy0|P^~"></block></value><next><block type="wait" id="Z860:cJgEwYx}Nv=P5RW"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="V#8vl`|d|i??|1`#(`YH"><field name="NUM">2</field></block></value><next><block type="say_block" id="T5yv.{uRh_W0f$L%t2Z$"><field name="dialogue">Which grade you are in?</field><next><block type="wait" id="~,8.2CCegB#n4dFr-5rd"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="vFtv$]C#r2Lv!?N^5Qy("><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="ixUaS9)Eq;y)ZIFx9G8I"><field name="Variable">grade</field><value name="NAME"><block type="input_block" id="{7{o|KaS8:u-1XGZI=I!"></block></value><next><block type="say_block" id="dH3!m8Y7@5}lpX[x2o%~"><field name="dialogue">Here goes the last question.</field><next><block type="wait" id="4fOlPmz4vnT1ym;~!%%z"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="_c}_C3sdD(U4sYZ+V^Eu"><field name="NUM">2</field></block></value><next><block type="say_block" id="9zjjh(ci0U}/Nf:t.d6d"><field name="dialogue">What is your favourite thing?</field><next><block type="wait" id="dEHAY~`@f1~uoHveaC2y"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="e`Ce8pA0De;kfZ|f[cFe"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="(q|M[F[T#/]^BOHBsy7|"><field name="Variable">favourite</field><value name="NAME"><block type="input_block" id="JE#7RkC$hj.VyOGSC=MJ"></block></value><next><block type="display_details" id="zIBqplxe,3Ue-DxPh83+"><next><block type="wait" id="*Tu*kOq}.^2#g08?*GN%"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="^y0A](Ly`nT}g%bb={-t"><field name="NUM">3</field></block></value><next><block type="say_block" id="*eQfuwRK3,kzf]S;L07j"><field name="dialogue">Thank you, it was great to know you.</field><next><block type="wait" id="X!e?#Iz`p=ZryjF8JXCm"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id=".HMTYCsip=t_vvKIto**"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="say_block" id="Up,=srazWR)bUB^loTGd" x="-18" y="-623"><field name="dialogue">Hello I am the new bot.</field><next><block type="wait" id="sqb5!2rs!gbx%:c)Kb#@"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="5rF=V@:#+V#0QV2Ql}$o"><field name="NUM">2</field></block></value><next><block type="say_block" id="v0KVDZ:!n2Y5~rD]f{X?"><field name="dialogue">I would like to know about you</field><next><block type="wait" id=":JU~2;vV(IhEG(Wi8VF+"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="{qRyR~YI*:(.XC_.fb/k"><field name="NUM">2</field></block></value><next><block type="say_block" id="!3:||70p-vi|2Ex;U%Cr"><field name="dialogue">What is your name?</field><next><block type="wait" id="Tlge21]cSKMdhhT*}zi-"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="m{cU^LU=al^:rLR8L:dr"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="_:d;zqb~p3t.hs3)rRE9"><field name="Variable">name</field><value name="NAME"><block type="input_block" id="k=Rl{Pb(qSaHDlu=?W*k"></block></value><next><block type="say_block" id="5u,;ar0IU%6#@A.$bPv."><field name="dialogue">That is a good name!</field><next><block type="wait" id="+v|qxk6XyMw(eYN+3V(~"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="h;3dwskh~)g=eBy]osyt"><field name="NUM">2</field></block></value><next><block type="say_block" id="$E(t]VQ/q~xW#^:Ah}.7"><field name="dialogue">What is your age?</field><next><block type="wait" id="*CzB)YNI$rg,8W6[N2-t"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="S,9!h*lvS7O:svpSPxne"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="lK;WoG)mS%2mS=;qAJiu"><field name="Variable">age</field><value name="NAME"><block type="input_block" id="I~(9.ul^*Dov%oy0|P^~"></block></value><next><block type="wait" id="Z860:cJgEwYx}Nv=P5RW"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="V#8vl`|d|i??|1`#(`YH"><field name="NUM">2</field></block></value><next><block type="say_block" id="T5yv.{uRh_W0f$L%t2Z$"><field name="dialogue">Which grade you are in?</field><next><block type="wait" id="~,8.2CCegB#n4dFr-5rd"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="vFtv$]C#r2Lv!?N^5Qy("><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="ixUaS9)Eq;y)ZIFx9G8I"><field name="Variable">grade</field><value name="NAME"><block type="input_block" id="{7{o|KaS8:u-1XGZI=I!"></block></value><next><block type="say_block" id="dH3!m8Y7@5}lpX[x2o%~"><field name="dialogue">Here goes the last question.</field><next><block type="wait" id="4fOlPmz4vnT1ym;~!%%z"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="_c}_C3sdD(U4sYZ+V^Eu"><field name="NUM">2</field></block></value><next><block type="say_block" id="9zjjh(ci0U}/Nf:t.d6d"><field name="dialogue">What is your favourite thing?</field><next><block type="wait" id="dEHAY~`@f1~uoHveaC2y"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="e`Ce8pA0De;kfZ|f[cFe"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="(q|M[F[T#/]^BOHBsy7|"><field name="Variable">favourite</field><value name="NAME"><block type="input_block" id="JE#7RkC$hj.VyOGSC=MJ"></block></value><next><block type="display_details" id="zIBqplxe,3Ue-DxPh83+"><next><block type="wait" id="*Tu*kOq}.^2#g08?*GN%"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="^y0A](Ly`nT}g%bb={-t"><field name="NUM">3</field></block></value><next><block type="say_block" id="*eQfuwRK3,kzf]S;L07j"><field name="dialogue">Thank you, it was great to know you.</field><next><block type="wait" id="X!e?#Iz`p=ZryjF8JXCm"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id=".HMTYCsip=t_vvKIto**"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from bot import *\nfrom time import *\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from bot import *", "from time import sleep"]

function completedFlag() {
    return GameIsOver;
}

export {
    completedFlag,
    myUpdateFunction,
    // get_number_of_blocks,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    // final_check,
    say,
    get_input_from_user,
    sleep,
    display_details,
    name_,
    age,
    grade,
    favourite,
    getNoOfBlocks,
    updateImports
}