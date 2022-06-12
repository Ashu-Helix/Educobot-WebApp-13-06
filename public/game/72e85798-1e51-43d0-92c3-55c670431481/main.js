import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";
const demoWorkspace = Blockly.getMainWorkspace();

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const GAME_CONSTANT = {
    images: {
        BG: "images/Background.png",
        Button_1: "images/Button_1.png",
        Button_2: "images/Button_2.png",
        Button_3: "images/Button_3.png",

        Normal_left: "images/Normal_left.png",
        Paper_left: "images/Paper_left.png",
        Scissor_left: "images/Scissor_left.png",
        Stone_left: "images/Stone_left.png",

        Normal_right: "images/Normal_right.png",
        Paper_right: "images/Paper_right.png",
        Scissor_right: "images/Scissor_right.png",
        Stone_right: "images/Stone_right.png"
    },
    spritesImages: {}
};

const ERROR_MESSAGE = '';
const CORRECT_MESSAGE = '';

let bot_score = 0;
let player_score = 0;
let player = null;
let game_count = 0;
let bot = 0;

let obj = {
    bot_score: 0
}

let default_;

let ErrorText;
let ErrorInnerText = '';
let GameIsOver = false;
let Middletext;

let ScorePlayertext;
let ScoreBotText;
let RoundText;

let CanClick = true;
let PlayerStone = false;
let PlayerPaper = false;
let PlayerScissor = false;

// Phaser config
var config = {
    type: AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    //canvas: document.getElementById('myCustomCanvas'),
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
window['game'] = new Game(config);

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

            if (key == 'BG') {
                _gameThis[key] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, key);
                _gameThis[key].setName(key)
            }
            //BG1 = _gameThis['Background/BG1'];
            if (key == 'Button_1') {
                _gameThis[key] = _gameThis.add.image(0, 0, key);
                _gameThis[key].setName(key)
                _gameThis[key].setPosition(this.cameras.main.width * 0.3, _gameThis['BG'].y + _gameThis['BG'].displayHeight * 0.33);
                _gameThis[key].setInteractive();
                _gameThis[key].on('pointerdown', () => {
                    if (!CanClick || GameIsOver) { return; }
                    Middletext.setText('');
                    CanClick = false;
                    PlayerStone = true;
                    PlayerPaper = PlayerScissor = false;
                })
            }
            if (key == 'Button_2') {
                _gameThis[key] = _gameThis.add.image(0, 0, key);
                _gameThis[key].setName(key)
                _gameThis[key].setPosition(this.cameras.main.width * 0.5, _gameThis['BG'].y + _gameThis['BG'].displayHeight * 0.33);
                _gameThis[key].setInteractive();
                _gameThis[key].on('pointerdown', () => {
                    if (!CanClick || GameIsOver) { return; }
                    Middletext.setText('');
                    CanClick = false;
                    PlayerPaper = true;
                    PlayerStone = PlayerScissor = false;
                })
            }
            if (key == 'Button_3') {
                _gameThis[key] = _gameThis.add.image(0, 0, key);
                _gameThis[key].setName(key)
                _gameThis[key].setPosition(this.cameras.main.width * 0.7, _gameThis['BG'].y + _gameThis['BG'].displayHeight * 0.33);
                _gameThis[key].setInteractive();
                _gameThis[key].on('pointerdown', () => {
                    if (!CanClick || GameIsOver) { return; }
                    Middletext.setText('');
                    CanClick = false;
                    PlayerScissor = true;
                    PlayerStone = PlayerPaper = false;
                })
            }

            if (key == 'Normal_left') {
                _gameThis[key] = _gameThis.add.image(0, 0, key);
                _gameThis[key].setOrigin(0, 0.5);
                _gameThis[key].setName(key)
                _gameThis[key].setPosition(0, _gameThis['BG'].y - _gameThis['BG'].displayHeight * 0.05);
            }
            if (key == 'Normal_right') {
                _gameThis[key] = _gameThis.add.image(0, 0, key);
                _gameThis[key].setOrigin(1, 0.5);
                _gameThis[key].setName(key)
                _gameThis[key].setPosition(this.cameras.main.width, _gameThis['BG'].y - _gameThis['BG'].displayHeight * 0.05);
            }
        }
    }



    ErrorText = _gameThis.add.text(0, 0, "Error...", { font: "bold 36px Arial", fill: "#ff0000" });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75)
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);


    Middletext = _gameThis.add.text(
        this.cameras.main.width * 0.5,
        _gameThis['Normal_right'].y,
        "", { font: "bold 68px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 12 });
    Middletext.setOrigin(0.5, 0.5);

    RoundText = _gameThis.add.text(
        this.cameras.main.width * 0.5,
        80,
        "Round :", { font: "bold 42px Arial", fill: "#000000" });
    RoundText.setOrigin(0.5, 0.5);

    ScorePlayertext = _gameThis.add.text(
        200,
        100,
        "Player Score :", { font: "bold 36px Arial", fill: "#000000" });
    ScorePlayertext.setOrigin(0.5, 0.5);

    ScoreBotText = _gameThis.add.text(
        this.cameras.main.width - 200,
        100,
        "Bot Score :", { font: "bold 36px Arial", fill: "#000000" });
    ScoreBotText.setOrigin(0.5, 0.5);


    RoundText.setText('Round:' + game_count);
    ScorePlayertext.setText('Player Score:' + player_score);
    ScoreBotText.setText('Bot Score:' + bot_score);
}



function stone_button_is_pressed() { return PlayerStone; }

function show_player_stone() { AnimHand(_gameThis['Normal_left'], 'Normal_left', 'Stone_left'); }

function paper_button_is_pressed() { return PlayerPaper; }

function show_player_paper() { AnimHand(_gameThis['Normal_left'], 'Normal_left', 'Paper_left'); }

function scissor_button_is_pressed() { return PlayerScissor; }

function show_player_scissor() { AnimHand(_gameThis['Normal_left'], 'Normal_left', 'Scissor_left'); }

function show_bot_stone() { AnimHand(_gameThis['Normal_right'], 'Normal_right', 'Stone_right'); }

function show_bot_paper() { AnimHand(_gameThis['Normal_right'], 'Normal_right', 'Paper_right'); }

function show_bot_scissor() { AnimHand(_gameThis['Normal_right'], 'Normal_right', 'Scissor_right'); }

function game_over() {
    setTimeout(() => {
        GameIsOver = true;
    }, 2000)
}

function say(str) {
    player = '';
    bot = '';
    setTimeout(() => { Middletext.setText(str) }, 1200);
}

'<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="xnwg~QF5:nvHBb-`}LX1" x="-83" y="-234"><field name="Variable name">bot_score</field><value name="NAME"><block type="math_number" id="=z^!%HW@HUA*#VYxDV|t"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="JJ|?AbT/=9%{`@85At]X"><field name="Variable name">player_score</field><value name="NAME"><block type="math_number" id="s6sWs$%|bks?8OsvfDGE"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="-FX76sRBn6jVMTjD)^!/"><field name="Variable name">game_count</field><value name="NAME"><block type="math_number" id="-z4Ocaa@VEpg[z]p2D_E"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="JPX29|U]EK41pG]*k+r/"><field name="Variable name">bot</field><value name="NAME"><block type="math_number" id="JR5[gTp7]m^dt+_P.VVc"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="`oJV}WAGO(~:t.7),XEv"><field name="Variable name">player</field><value name="NAME"><block type="math_number" id="0I6C]aGO@9|,,m6RACM:"><field name="NUM">0</field></block></value><next><block type="forever_repeat_block" id="Q39fG#)JY4|pO#kqhi);"><statement name="NAME"><block type="controls_if" id="3Ye-FCXEzNnxdHtl6`WL"><value name="IF0"><block type="logic_compare" id="S*(^3d=HdpQ5=9hPlfng"><field name="OP">LTE</field><value name="A"><block type="variables" id="648COk$]//hq9j5H{o*x"><field name="Options">game_count</field></block></value><value name="B"><block type="math_number" id="yj6g+-^n*E$/t(uIpN?B"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="controls_if" id="z`s,HiGfb-C_!Lp}=;k:"><value name="IF0"><block type="logic_compare" id="el*Fjbk%u%m*+gU#M~u$"><field name="OP">GT</field><value name="A"><block type="variables" id="%8jMa[p%b^z%:1Z{X|Ug"><field name="Options">player_score</field></block></value><value name="B"><block type="variables" id=".TkL[T[CooOQO9um}#L*"><field name="Options">bot_score</field></block></value></block></value><statement name="DO0"><block type="say_block" id="$-^Tg?)=Z`tK#e*q]w3d"><field name="dialogue">Player winz</field></block></statement><next><block type="controls_if" id="pp@yM|f^a;ACD1]26yFb"><value name="IF0"><block type="logic_compare" id="9Pm*jW5kc0!mbC;~E65F"><field name="OP">LT</field><value name="A"><block type="variables" id=";b7lybxo#oz89w$8.ubG"><field name="Options">player_score</field></block></value><value name="B"><block type="variables" id=")BCn@Byoe[,cBPHpIO0["><field name="Options">bot_score</field></block></value></block></value><statement name="DO0"><block type="say_block" id="lwy9WzuHq;982|*|Xt:q"><field name="dialogue">Bot winz</field></block></statement></block></next></block></statement></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>'

function update() {

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
        if (Object.hasOwnProperty.call(spritesImages, key)) { }
    }
}

function ShowError() {
    ErrorText.setAlpha(1);
    ErrorText.setText(ErrorInnerText); //use error text
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
    CanClick = true;
    game_count = 0;
    player_score = 0;
    bot_score = 0;
    player = '';
    bot = '';
    GameIsOver = false;
}
// Reset the game
function reset_output() {
    console.log('reset_output')
    reInitValues();
    _gameThis.scene.restart();
}

function AnimHand(hand, initTexture, endtexture) {
    var timeline = _gameThis.tweens.createTimeline();
    hand.setTexture(initTexture);

    timeline.add({
        targets: hand,
        angle: -25,
        ease: 'Linear',
        duration: 150
    });

    timeline.add({
        targets: hand,
        angle: 25,
        ease: 'Linear',
        duration: 200,
        yoyo: true,
        repeat: 1
    });

    timeline.add({
        targets: hand,
        angle: 0,
        ease: 'Linear',
        duration: 150,
        onComplete: () => {
            hand.setTexture(endtexture);
            CanClick = true;
            RoundText.setText('Round:' + game_count);
            ScorePlayertext.setText('Player Score:' + player_score);
            ScoreBotText.setText('Bot Score:' + bot_score);
        },
    });

    timeline.play();
}

function mathRandomInt(min, max) {
    max += 1;
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
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
        }, 700);
        setTimeout(() => {
            repeat_forever_flag = true;
        }, 3000);
    } catch (b) { alert(b) }
    // try {
    //     if (tour.getCurrentStep().options.title === "Run and see what happens") {
    //         let btns = document.querySelectorAll('.shepherd-button');
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}




const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="xnwg~QF5:nvHBb-`}LX1" x="-155" y="-559"><field name="Variable name">bot_score</field><value name="NAME"><block type="math_number" id="=z^!%HW@HUA*#VYxDV|t"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="JJ|?AbT/=9%{`@85At]X"><field name="Variable name">player_score</field><value name="NAME"><block type="math_number" id="s6sWs$%|bks?8OsvfDGE"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="-FX76sRBn6jVMTjD)^!/"><field name="Variable name">game_count</field><value name="NAME"><block type="math_number" id="-z4Ocaa@VEpg[z]p2D_E"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="JPX29|U]EK41pG]*k+r/"><field name="Variable name">bot</field><value name="NAME"><block type="math_number" id="JR5[gTp7]m^dt+_P.VVc"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="`oJV}WAGO(~:t.7),XEv"><field name="Variable name">player</field><value name="NAME"><block type="math_number" id="0I6C]aGO@9|,,m6RACM:"><field name="NUM">0</field></block></value><next><block type="forever_repeat_block" id="Q39fG#)JY4|pO#kqhi);"><statement name="NAME"><block type="controls_if" id="3Ye-FCXEzNnxdHtl6`WL"><value name="IF0"><block type="logic_compare" id="S*(^3d=HdpQ5=9hPlfng"><field name="OP">GTE</field><value name="A"><block type="variables" id="648COk$]//hq9j5H{o*x"><field name="Options">game_count</field></block></value><value name="B"><block type="math_number" id="yj6g+-^n*E$/t(uIpN?B"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="controls_if" id="z`s,HiGfb-C_!Lp}=;k:"><value name="IF0"><block type="logic_compare" id="el*Fjbk%u%m*+gU#M~u$"><field name="OP">GT</field><value name="A"><block type="variables" id="%8jMa[p%b^z%:1Z{X|Ug"><field name="Options">player_score</field></block></value><value name="B"><block type="variables" id=".TkL[T[CooOQO9um}#L*"><field name="Options">bot_score</field></block></value></block></value><statement name="DO0"><block type="say_block" id="$-^Tg?)=Z`tK#e*q]w3d"><field name="dialogue">Player is the Grand winner</field></block></statement><next><block type="controls_if" id="pp@yM|f^a;ACD1]26yFb"><value name="IF0"><block type="logic_compare" id="9Pm*jW5kc0!mbC;~E65F"><field name="OP">LT</field><value name="A"><block type="variables" id=";b7lybxo#oz89w$8.ubG"><field name="Options">player_score</field></block></value><value name="B"><block type="variables" id=")BCn@Byoe[,cBPHpIO0["><field name="Options">bot_score</field></block></value></block></value><statement name="DO0"><block type="say_block" id="lwy9WzuHq;982|*|Xt:q"><field name="dialogue">Bot is the Grand winner</field></block></statement><next><block type="end_block" id="Ig(9fA|bG[y_3gxk19+_"></block></next></block></next></block></statement><next><block type="controls_if" id="1;IEmzAgtgiN5ESt_U_R"><value name="IF0"><block type="button_options" id="`RkJKuD%/9PbGb|^?fD~"><field name="buttons">stone_button_is_pressed()</field></block></value><statement name="DO0"><block type="set_variable_holder" id="-Xnu0%lu`IskM=-$wk$F"><field name="Variable name">player</field><value name="NAME"><block type="values" id="7!j!KtvC+8+m0u7pjH[L"><field name="Options">\'stone\'</field></block></value><next><block type="player_hand_signs_block" id="b?*9F4`n!Pr%/GS(cNx,"><field name="NAME">show_player_stone();</field></block></next></block></statement><next><block type="controls_if" id=")lm~]|{m*ZVtZEA]q?uH"><value name="IF0"><block type="button_options" id="w~N[46dl$=,m/qdIv-|q"><field name="buttons">paper_button_is_pressed()</field></block></value><statement name="DO0"><block type="set_variable_holder" id="iuOwNjgeQM?Yr3Gq2c*e"><field name="Variable name">player</field><value name="NAME"><block type="values" id="zZo=ulqh[6s5ZKxq+$Nr"><field name="Options">\'paper\'</field></block></value><next><block type="player_hand_signs_block" id="(xz5^aB`!nBBPH`E(SMY"><field name="NAME">show_player_paper();</field></block></next></block></statement><next><block type="controls_if" id="*sh~/pzt$FYof0,UlGov"><value name="IF0"><block type="button_options" id="R%Ua=nw.gnzuCiD@1LW}"><field name="buttons">scissor_button_is_pressed()</field></block></value><statement name="DO0"><block type="set_variable_holder" id="Kb=CXpuyT#-8frrhDl%w"><field name="Variable name">player</field><value name="NAME"><block type="values" id="|_gjburQRJ`TgE3Y?5_V"><field name="Options">\'scissors\'</field></block></value><next><block type="player_hand_signs_block" id=",!rwB_CrA/r`#eVTYTT|"><field name="NAME">show_player_scissor();</field></block></next></block></statement><next><block type="controls_if" id="TfeCV-Hy|LR?F:tO$)+i"><value name="IF0"><block type="logic_operation" id="]XR-i1C][byOliTzKj`g"><field name="OP">OR</field><value name="A"><block type="button_options" id="`3PmD*J,JMf4GNoySy/)"><field name="buttons">stone_button_is_pressed()</field></block></value><value name="B"><block type="logic_operation" id="cH%cz:Cvv|W`9!15a$r,"><field name="OP">OR</field><value name="A"><block type="button_options" id="zPjg$U:DgXBb,W544U:T"><field name="buttons">paper_button_is_pressed()</field></block></value><value name="B"><block type="button_options" id="y`jY]TUB*OSUdW[SRBBd"><field name="buttons">scissor_button_is_pressed()</field></block></value></block></value></block></value><statement name="DO0"><block type="set_variable_holder" id="E~5gL{q2sm|R82zv1%[}"><field name="Variable name">bot</field><value name="NAME"><block type="math_random_int" id="W)4$;lw#.4:FICVkfeLE"><value name="FROM"><block type="math_number" id="YkpRR0b.+q;2zToFF8ps"><field name="NUM">1</field></block></value><value name="TO"><block type="math_number" id="kxq~,,Cx8[v3MF$J5`n,"><field name="NUM">3</field></block></value></block></value><next><block type="controls_if" id="z,[+GqQ|l/:|5nE_}:m7"><mutation elseif="2"></mutation><value name="IF0"><block type="logic_compare" id="bNVnVX:Bp{2l3SvO95:K"><field name="OP">EQ</field><value name="A"><block type="variables" id="gYYb`BhJvsaK#zi_$^th"><field name="Options">bot</field></block></value><value name="B"><block type="math_number" id="c9;Ahjqu:KUBF)5OEr)U"><field name="NUM">1</field></block></value></block></value><statement name="DO0"><block type="set_variable_holder" id="x,q9#j0O`d%HF?e?*j8v"><field name="Variable name">bot</field><value name="NAME"><block type="values" id="sV7}J?mu}S:~n*j]^$O`"><field name="Options">\'stone\'</field></block></value><next><block type="bot_hand_signs_block" id="FG[t#fM3a[7NlBrn7+,z"><field name="NAME">show_bot_stone();</field></block></next></block></statement><value name="IF1"><block type="logic_compare" id="3nx3s8M=3q6wD$XMA[A}"><field name="OP">EQ</field><value name="A"><block type="variables" id="7pZuH=rky:Cua[y[D[:c"><field name="Options">bot</field></block></value><value name="B"><block type="math_number" id="HtU*;K/JPH-^+2RcK8.#"><field name="NUM">2</field></block></value></block></value><statement name="DO1"><block type="set_variable_holder" id="j9OK7vcf5?0Z[qqsb[F*"><field name="Variable name">bot</field><value name="NAME"><block type="values" id="U`UK-T9n%cG9-eWrLIg:"><field name="Options">\'paper\'</field></block></value><next><block type="bot_hand_signs_block" id="$-~dPy5V2p##I*b3^bcj"><field name="NAME">show_bot_paper();</field></block></next></block></statement><value name="IF2"><block type="logic_compare" id="QqYDPketHaEe-Fyb:n5!"><field name="OP">EQ</field><value name="A"><block type="variables" id="A`{:F^U,0|ysK%8#(]*g"><field name="Options">bot</field></block></value><value name="B"><block type="math_number" id="EV%9UK-V6do3^Hu5W`IA"><field name="NUM">3</field></block></value></block></value><statement name="DO2"><block type="set_variable_holder" id="7FV33+g1-TP`c8O}qe3j"><field name="Variable name">bot</field><value name="NAME"><block type="values" id="_|W_kJjEK?XM1yLVXH.9"><field name="Options">\'scissors\'</field></block></value><next><block type="bot_hand_signs_block" id="j@[1zL#-vqrBiBm%a]x^"><field name="NAME">show_bot_scissor();</field></block></next></block></statement><next><block type="change_variable_holder" id="G7,tURHy_!z;Tim!nP=V"><field name="Variable name">game_count</field><value name="NAME"><block type="math_number" id="0Mq.M+/-}ka|Lwv4@.$$"><field name="NUM">1</field></block></value></block></next></block></next></block></statement><next><block type="controls_if" id="%=aUncta_wC[JOK3c0)~"><value name="IF0"><block type="logic_operation" id="fs%#g3KuG4uU^)Ah7(rZ"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="U0pZ6r6gQpB?Gm?u[Kv2"><field name="OP">EQ</field><value name="A"><block type="variables" id="m,t~KZI5?o6KQ7AJaupg"><field name="Options">player</field></block></value><value name="B"><block type="values" id="Z+*[2}8jK,^wo0E9YbEm"><field name="Options">\'stone\'</field></block></value></block></value><value name="B"><block type="logic_compare" id=".[ZQCyz3J`zuqL_F5?#C"><field name="OP">EQ</field><value name="A"><block type="variables" id="m0%gYMJ5WxELUZ3!x*u("><field name="Options">bot</field></block></value><value name="B"><block type="values" id="6ux|Z^BmLbWg2fD:)az#"><field name="Options">\'stone\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="piIzro8{oA43fuXQ|QFz"><field name="dialogue">Its a tie</field></block></statement><next><block type="controls_if" id="?$I,$I_b:l`9d#y%XF%V"><value name="IF0"><block type="logic_operation" id="krJX]g)MXM~B%;[y;7RY"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="|BDTlFdy;dV#}*W4o7pm"><field name="OP">EQ</field><value name="A"><block type="variables" id=")2-fE5_FwSMODJJA|Bl%"><field name="Options">player</field></block></value><value name="B"><block type="values" id="Zio8d31H)E2ut;Un1K-w"><field name="Options">\'stone\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="p:(HPGb51;;8$/bs_G{W"><field name="OP">EQ</field><value name="A"><block type="variables" id="Q~GET|v-Q)/Nj_zhD$M2"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="/f;SE`B^u2tO3Fgi#uMU"><field name="Options">\'paper\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="KUSlAtS%e0q__!u@+BrL"><field name="dialogue">Bot wins</field><next><block type="change_variable_holder" id="coE]9SG(k?yPE7a;.2.D"><field name="Variable name">bot_score</field><value name="NAME"><block type="math_number" id="SJ}2b7*wLd[*e_k=Oj:/"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id="Tt)ajRJ*;UI,CaE{@:??"><value name="IF0"><block type="logic_operation" id="F{3b0P|S2gK=[i;CU$1D"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="^y~e7PNXs}ZKM}J:ib;R"><field name="OP">EQ</field><value name="A"><block type="variables" id=";]zRgA,S!O7nlya2`20?"><field name="Options">player</field></block></value><value name="B"><block type="values" id="hqVq]c;[iBBlqsS@X)Ea"><field name="Options">\'stone\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="P07]-Bq.Vs5m6~Ut]Om;"><field name="OP">EQ</field><value name="A"><block type="variables" id="v=.)|VvQG!Mq]nqb!mPe"><field name="Options">bot</field></block></value><value name="B"><block type="values" id=")H``T=|y7_]P=d^l-MH]"><field name="Options">\'scissors\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="7jcd+PP9C@JGxy},cZ;V"><field name="dialogue">Player wins</field><next><block type="change_variable_holder" id="eAh5S8HhVh.bR%IVS;Ct"><field name="Variable name">player_score</field><value name="NAME"><block type="math_number" id="?BvOoX+,/%2U+2%QK,WP"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id="[d]*BdX03S))Y#A?-0]g"><value name="IF0"><block type="logic_operation" id="[xC2vY%E(!d8l2+/ZQ6m"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="*8+Rf6:PO`hvn]6I6Uhv"><field name="OP">EQ</field><value name="A"><block type="variables" id="Qr){S4wUuL|qOZ`pCg=2"><field name="Options">player</field></block></value><value name="B"><block type="values" id="-_3H0-C#7Lbxhrk`SJes"><field name="Options">\'paper\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="/^`J^hH^PgM}7X0C_gVR"><field name="OP">EQ</field><value name="A"><block type="variables" id="1`o$TB34U_FBaa!i}:h0"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="r)7sdz(j!ce.?OK$mrR6"><field name="Options">\'paper\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="F4AOk4I:/6L[6=~XBMDo"><field name="dialogue">Its a tie</field></block></statement><next><block type="controls_if" id="-xxO!=gn7O5f%lihrrGv"><value name="IF0"><block type="logic_operation" id="^ss[Pw(m,;Q}PXd)}LxE"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="V|fbhnu|v_M2D(H|:ocR"><field name="OP">EQ</field><value name="A"><block type="variables" id="mt=vO=#VD+:Oa|S7wc_o"><field name="Options">player</field></block></value><value name="B"><block type="values" id="NdI$RQ%v~.xaSG(0?{F$"><field name="Options">\'paper\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="Um#5sOHa{7tv}Z2Dt/$0"><field name="OP">EQ</field><value name="A"><block type="variables" id="hJtxXmkzv%OZIlkA8XuE"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="y2%h,vcIMukl$}SOH{(p"><field name="Options">\'stone\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="D3|S$SjZ+Z39!BDa1dz8"><field name="dialogue">Player wins</field><next><block type="change_variable_holder" id="OuXh_jdJHaoOIf|,@6?Z"><field name="Variable name">player_score</field><value name="NAME"><block type="math_number" id="_{W~)AJ22=`w*rDAB0i^"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id="`YSNuaOv}n;9D`UBycR("><value name="IF0"><block type="logic_operation" id="S;qCtK)7g::8*jg@UhjD"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="tYF3Xf(RE8-Se@e{]^=)"><field name="OP">EQ</field><value name="A"><block type="variables" id="U]i7l@J~{=%iyrV)6-3n"><field name="Options">player</field></block></value><value name="B"><block type="values" id=",:1!oSwz]U.avoj9h|=4"><field name="Options">\'paper\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="CXjUa*][rbpHP{hILxDA"><field name="OP">EQ</field><value name="A"><block type="variables" id="sdKXv9]FOq~K0ZE%,hhf"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="5n7muN_1j/AI19Rt0VuU"><field name="Options">\'scissors\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="rB}eP_8Od,,Kp,psk/Fd"><field name="dialogue">Bot wins</field><next><block type="change_variable_holder" id="MZ00:szf$H4,Q?EN;e/q"><field name="Variable name">bot_score</field><value name="NAME"><block type="math_number" id="$S:rtW|%PeGoo`PO@wya"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id="O,kx4M}xY*]F9r;$UQ-3"><value name="IF0"><block type="logic_operation" id="Tak,TAclbjhzhAf@m9kA"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="UJr#]lSaU[5TL8JBG}?/"><field name="OP">EQ</field><value name="A"><block type="variables" id="cQ7-Q~6:/9:VC($T!m,+"><field name="Options">player</field></block></value><value name="B"><block type="values" id="jBR[xvA26PaBEsf25mLy"><field name="Options">\'scissors\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="t{_K9C[jiWq{:ZZ}do02"><field name="OP">EQ</field><value name="A"><block type="variables" id="fE9n8n_L}1{A3uw4-ch%"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="N:jQ/q$|}WQyLupJMqsi"><field name="Options">\'scissors\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="|6Z_^$`+7zTTrf%z|:_s"><field name="dialogue">Its a tie</field></block></statement><next><block type="controls_if" id="{wtM9Q~DUD]]8@BPNO5W"><value name="IF0"><block type="logic_operation" id="^XKkVoUpxLI*p`cFp_a?"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="3|ii!@XVm*CEs`UZ38cm"><field name="OP">EQ</field><value name="A"><block type="variables" id="VY;3d_;5{u/]c8:HU5;R"><field name="Options">player</field></block></value><value name="B"><block type="values" id="Zm9#4t(EEY[wR#KF`l87"><field name="Options">\'scissors\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="AcyQ%`^q,rRo[``Su_)7"><field name="OP">EQ</field><value name="A"><block type="variables" id="quNxXB)}G7gK4f)J#Wj,"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="7bd.Z7mzqP-os;m1etjq"><field name="Options">\'paper\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="4~i.^1;*nZOi}(~n2]p,"><field name="dialogue">Player wins</field><next><block type="change_variable_holder" id="xIp}(ZN+X:F.,L/I5YoM"><field name="Variable name">player_score</field><value name="NAME"><block type="math_number" id="5rVJcPx7e9beTs?J253*"><field name="NUM">1</field></block></value></block></next></block></statement><next><block type="controls_if" id=";7$[0%N0L5M*m6(6Q7dK"><value name="IF0"><block type="logic_operation" id="-xIsB2f-1)SqZ7gA;AQX"><field name="OP">AND</field><value name="A"><block type="logic_compare" id="oat-w=zB?wIn4fJZwfH+"><field name="OP">EQ</field><value name="A"><block type="variables" id="A2FyCh1}o|D)hnWDlRBk"><field name="Options">player</field></block></value><value name="B"><block type="values" id="5lpwapDWj;58I`m|tR#k"><field name="Options">\'scissors\'</field></block></value></block></value><value name="B"><block type="logic_compare" id="fn3]z6v#H,~:N{]O$HY$"><field name="OP">EQ</field><value name="A"><block type="variables" id="yhSn}S`-spuHj8fCB|8j"><field name="Options">bot</field></block></value><value name="B"><block type="values" id="y8fo)}V1DQ5|%v[]#!!d"><field name="Options">\'stone\'</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="~y:KPOU-JD$t~(E?)g#m"><field name="dialogue">Bot wins</field><next><block type="change_variable_holder" id=":!WB=}(.mP~}v=9(Eq4#"><field name="Variable name">bot_score</field><value name="NAME"><block type="math_number" id="I50T/+.{_#:.Q*{VYwt0"><field name="NUM">1</field></block></value></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></xml>';

function completedFlag() {
    return GameIsOver;
}


export {
    completedFlag,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    game_count,
    bot_score,
    player_score,
    bot,
    player,
    stone_button_is_pressed,
    paper_button_is_pressed,
    scissor_button_is_pressed,
    show_bot_stone,
    show_bot_paper,
    show_bot_scissor,
    show_player_stone,
    show_player_paper,
    show_player_scissor,
    PlayerStone,
    PlayerScissor,
    PlayerPaper,
    game_over,
    repeat_forever_flag,
    update,
    preload,
    create,
    gameHeight,
    gameWidth,
    mathRandomInt,
    say
}