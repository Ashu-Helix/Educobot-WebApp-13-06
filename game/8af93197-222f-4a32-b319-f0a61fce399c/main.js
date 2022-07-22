import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

let _gameThis = null;
const baseURL = "../img/images/8af93197-222f-4a32-b319-f0a61fce399c";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

const GAME_CONSTANT = {
    images: {
        BG: "Background.png",
        Bloc: "Block.png",

    },
    spritesImages: {
        Images: "Images.png",
    }
};
const ERROR_MESSAGE = '';
const CORRECT_MESSAGE = '';

let possibilities = Array.from(Array(26).keys());
let Stepper = 0;
let QuestionExist = false;
let correct_spelling = "";
let NewTry = false;
let isCompleted = false;

let ErrorText;
let ErrorInnerText = "";
let GameIsOver = true;
let ScoreText;
let Middletext;
let BG;
let TimeText;
let TimerEvent;
let run_ = true;
let Letters = [];
//================= GAME VARIABLES ====================================================================================================
//=====================================================================================================================================
let Score = 0;
let Timer = 30;
let spelling = "";
let Index_Image;
let The_Image;
let Bloc = [];

let Names = [
    "bananas",
    "bicycle",
    "butterfly",
    "cabbage",
    "caterpillar",
    "coconut",
    "compass",
    "dolphin",
    "dragon",
    "eggplants",
    "eraser",
    "helicopter",
    "hippopotamus",
    "keyboard",
    "lollipop",
    "mountains",
    "pineapple",
    "puppy",
    "ruler",
    "skateboard",
    "socks",
    "tomatoes",
    "tractor",
    "train",
    "wheel",
    "window",
];
//=====================================================================================================================================
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
    scene: { preload: preload, create: create, update: update },
};
let game = new Phaser.Game(config);

function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);
    loadImages();
}

function create() {
    possibilities = shuffle(possibilities);

    BG = this.add.image(gameWidth / 2, gameHeight / 2, "BG").setName("BG");
    _gameThis["BG"] = BG;
    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);
    Middletext = _gameThis.add.text(300, 100, "", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 10,
    });
    Middletext.setOrigin(0.5, 0.5);
    ScoreText = _gameThis.add.text(1550, 100, "Score:", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#ff0000",
        strokeThickness: 8,
    });
    ScoreText.setOrigin(0.5, 0.5);
    TimeText = _gameThis.add.text(1550, 250, "Time:", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#00ff00",
        strokeThickness: 6,
    });
    TimeText.setOrigin(0.5, 0.5);
    //=====================================================================================================================================
    //============ ADDING GRAPHICS ========================================================================================================
    //=====================================================================================================================================
    The_Image = _gameThis.add
        .sprite(700 + 250, 200 + 250, "Images")
        .setScale(1.5);
    The_Image.setFrame(29);
    //letters
    Letters = [];
    for (let t = 0; t < 16; t++) {
        let L = _gameThis.add
            .text(100, 100, "", { font: "bold 74px Arial", fill: "#ffff00" })
            .setOrigin(0.5, 0.5);
        L.setAlpha(0);
        Letters.push(L);
    }
    //=====================================================================================================================================
    //=========== THE UPDATE CODE =========================================================================================================
} //====================================================================================================================================
function ShowLetters(answerd) {
    console.log('-------------> ShowLetters', spelling)
    if (spelling) {
        for (let t = 0; t < Names[Index_Image].length; t++) {
            Letters[t].setAlpha(1);
            Letters[t].setText(spelling.charAt(t));
            if (answerd) {
                Letters[t].setStyle({ font: "bold 74px Arial", fill: "#ffff00" });
            } else {
                Letters[t].setStyle({ font: "bold 74px Arial", fill: "#ff0000" });
            }
        }
    }
}
async function update() {
    //   if (!QuestionExist || GameIsOver) {
    //     return;
    //   }
    //   QuestionExist = false;
    //   console.log("we have a question");
    //   await display_picture();
    //   await sleep(1);
    //   spelling = get_string_input_from_user();
    //   if (spelling == correct_spelling) {
    //     say("Correct spelling");
    //     Score += 2;
    //     ShowLetters(true);
    //     await sleep(2);
    //     NewTry = false;
    //     next_question();
    //   } else {
    //     ShowLetters(false);
    //     say("Wrong spelling");
    //     Score -= 1;
    //     NewTry = true;
    //     await sleep(1);
    //     await try_again();
    //   }
    //   if (Score >= 15) {
    //     say("Congratulations! you won the game");
    //     game_over();
    //   }
    //   if (Timer <= 0) {
    //     say("Time up!");
    //     game_over();
    //   }
}
//=====================================================================================================================================
//================= WORK SPACE ========================================================================================================
//=====================================================================================================================================
function start_Game() {
    QuestionExist = false;
    correct_spelling = "";
    Stepper = 0;
    GameIsOver = false;

    ScoreText.text = "Score: " + Score.toString();
}

function start_timer(Sec) {
    Timer = Sec;
    TimeText.setText("Time: " + Timer);
    TimerEvent = _gameThis.time.addEvent({
        delay: 1000,
        callback: () => {
            Timer--;
            TimeText.setText("Time: " + Timer);
            if (Timer == 0) {
                TimerEvent.remove();
            }
        },
        callbackScope: this,
        loop: true,
    });

    QuestionExist = true;
}

function try_again() {
    if (run_) {
        if (Score < 0) {
            Score = 0;
        }
        ScoreText.text = "Score = " + Score.toString();
        say("Try Again");
    }

    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                QuestionExist = true;
                resolve(true);
            }, 1500);
        });
}

function display_picture() {
    console.log("ok", run_);
    Letters.forEach((L) => {
        L.setAlpha(0);
    });
    let T = 100;
    if (run_) {
        console.log("ok1");

        if (!NewTry) {
            console.log("ok2");
            T = 1500;
            say("");
            console.log(possibilities);
            console.log(Stepper, possibilities[Stepper]);
            Index_Image = possibilities[Stepper];
            The_Image.setFrame(Index_Image);
            console.log("It's : ", Names[Index_Image]);
            correct_spelling = Names[Index_Image];
            //Putting Letter Blocs : >>
            for (let i = 0; i < Names[Index_Image].length; i++) {
                Bloc[i] = _gameThis.add.image(
                    200 + (12 - Names[Index_Image].length) * 50 + i * 150,
                    900,
                    "Bloc"
                );
                //Putting letters
                Letters[i].setPosition(Bloc[i].x, Bloc[i].y);
                Letters[i].setAlpha(0);
            }
        }
    }

    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, T);
        });
}

function next_question() {
    say("");
    if (Score < 0) {
        Score = 0;
    }
    ScoreText.text = "Score = " + Score.toString();
    for (let i = 0; i < Names[Index_Image].length; i++) {
        Bloc[i].destroy();
    } //<< Remove Blocs..
    Stepper++;
    console.log("Stepper", Stepper);
    QuestionExist = true;
}

function game_over() {
    for (let i = 0; i < Names[Index_Image].length; i++) {
        Bloc[i].destroy();
    } //<< Remove Blocs..
    The_Image.setFrame(29);
    GameIsOver = true;
    isCompleted = true;
}

function say(str) {
    Middletext.setText(str);
}

function sleep(seconds) {
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, seconds * 1000);
        });
}

function get_string_input_from_user(txt) {
    return prompt(txt, "Enter Picture Name");
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
            if (key == "Images") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 250,
                    frameHeight: 250,
                });
            }
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
// Re-initialize the game variables
function reInitValues() {
    isCompleted = false;
    QuestionExist = false;
    correct_spelling = "";
    Stepper = 0;
    Score = 0;
    Timer = 30;
    spelling = "";
    GameIsOver = true;
    run_ = true;
}
// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}
//=====================================================================================================================================
//=====================================================================================================================================
function rand(a) {
    return Math.floor(Math.random() * a) + 1;
}

//FOR TESTING :
async function test() {
    start_Game();
    start_timer(30);
    //The "Update" Will Run The Rest Of The Game...
}

function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

function completedFlag() {
    return isCompleted;
}


var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    reInitValues();
    window.LoopTrap = 1E3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
    try {
        // eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
        }, 700);
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
//     // tour.isActive() || tour.start()
//     var xml_wkspace =
//         '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="ibxS#at,([[qu7]h1I%," x="10" y="-151"><field name="Variable name">op2</field><value name="NAME"><block type="math_number" id="o!Iq:9XRPgK{OzM!*.Pm"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="C=I7N_]Ak#yBv7?4,1Ry"><field name="Variable name">op1</field><value name="NAME"><block type="math_number" id="zCLh8p,Y{}n({W3:a.FC"><field name="NUM">30</field></block></value><next><block type="action1" id="XFII2[ch68]3fXU]_PDT"><next><block type="action2" id=":[X(n_A+6$=JWc6CB#}y"><next><block type="forever_repeat_block" id="H*?^Z;CB4j2Xq+C?B2m}"><statement name="NAME"><block type="action3" id="0)M2ruD~xlr%?IWj;BYR"><next><block type="wait_block" id="!}x|jdZxoJ=2,$l`RFQD"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="XW6yI^^jV47/z#7/L_lP"><field name="NUM">1</field></block></value><next><block type="variable_holder" id="/n6RF$?0wGe5lzRu7MNO"><field name="Variable name">op3</field><value name="NAME"><block type="input_bock" id="N0)NI-lO4Ez*eYX;lGf)"></block></value><next><block type="controls_if" id=":O$9T(9-MvO919J:KZ`0"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="gBWWrNJfJ~8dK-_Q60U|"><field name="OP">EQ</field><value name="A"><block type="variables" id="UIcXK5/;5w`%*1B|2Ti3"><field name="Options">op1</field></block></value><value name="B"><block type="variables" id=")Umq%PMu(._D*0ecjzXG"><field name="Options">op2</field></block></value></block></value><statement name="DO0"><block type="say_block" id="b2=j:mfX^ck)6Hv=D.T3"><field name="say">Correct spelling</field><next><block type="variable_holder" id="N{84k:tQ;altBTUdz%O-"><field name="Variable name">op2</field><value name="NAME"><block type="math_arithmetic" id="Q^GH_X$RD`h)gGB=p,f`"><field name="OP">ADD</field><value name="A"><block type="variables" id="/c8wd$Yiv,r=99kDt)s5"><field name="Options">op4</field></block></value><value name="B"><block type="math_number" id="$3zgkbwf%s,{I{oG7M/Z"><field name="NUM">2</field></block></value></block></value><next><block type="wait_block" id="UMNMG,*U5biU$4cfGpkG"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="sCPNkCMJH@npNtAxO[b/"><field name="NUM">2</field></block></value><next><block type="action_block" id="_rDYx#=Ff;w~AiipdIGi"></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="say_block" id="D4s!BH?]gT9=#}.1~vX."><field name="say">Wrong spelling</field><next><block type="variable_holder" id="xj4HF#VY@[L1F/j*^k:h"><field name="Variable name">op2</field><value name="NAME"><block type="math_arithmetic" id="_z,[(V{koq`)^F002.@O"><field name="OP">MINUS</field><value name="A"><block type="variables" id="xs]avF80%w~isP*GkDc6"><field name="Options">op4</field></block></value><value name="B"><block type="math_number" id="Pq.=EmCk.k+D^x+h:#IA"><field name="NUM">1</field></block></value></block></value><next><block type="wait_block" id="D)xoT8A%)~4$LHiX=w4}"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Mwy^4z.WRG%_y$mD8,,a"><field name="NUM">1</field></block></value><next><block type="actrion_try_again" id="=U5#hz?a]#^aF^i_//,0"></block></next></block></next></block></next></block></statement><next><block type="controls_if" id="e-,)u7};TkIW%iG6W=w,"><value name="IF0"><block type="logic_compare" id="m;2f_8!3LXA1SgOYa[aU"><field name="OP">GTE</field><value name="A"><block type="variables" id="EXE,%9(dom94W!GNR%k!"><field name="Options">op4</field></block></value><value name="B"><block type="math_number" id="1Z772G[Q??B,cTK,l!]4"><field name="NUM">15</field></block></value></block></value><statement name="DO0"><block type="say_block" id="}nEO/JuPxq^}!o|+oCKa"><field name="say">Congratulations! you won the game</field><next><block type="end_block" id="_hMvP:fR@3B?djB:zT4y"></block></next></block></statement><next><block type="controls_if" id="PbiXr,=w`V#|nhCF;q/:"><value name="IF0"><block type="logic_compare" id="510Pksq*,%Mtd?*?Jk5-"><field name="OP">LTE</field><value name="A"><block type="variables" id="z@0;%]qlM5JBO;]g)IQz"><field name="Options">op3</field></block></value><value name="B"><block type="math_number" id="d.a+9z?9O|8@|}munz~r"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="say_block" id="PQ!MnA{GvDj/X5aM{jD5"><field name="say">Time up</field><next><block type="end_block" id="j8e=rjR0XUw5{Y23[W#^"></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="ibxS#at,([[qu7]h1I%," x="10" y="-151"><field name="Variable name">op2</field><value name="NAME"><block type="math_number" id="o!Iq:9XRPgK{OzM!*.Pm"><field name="NUM">0</field></block></value><next><block type="variable_holder" id="C=I7N_]Ak#yBv7?4,1Ry"><field name="Variable name">op1</field><value name="NAME"><block type="math_number" id="zCLh8p,Y{}n({W3:a.FC"><field name="NUM">30</field></block></value><next><block type="action1" id="XFII2[ch68]3fXU]_PDT"><next><block type="action2" id=":[X(n_A+6$=JWc6CB#}y"><next><block type="forever_repeat_block" id="H*?^Z;CB4j2Xq+C?B2m}"><statement name="NAME"><block type="action3" id="0)M2ruD~xlr%?IWj;BYR"><next><block type="wait_block" id="!}x|jdZxoJ=2,$l`RFQD"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="XW6yI^^jV47/z#7/L_lP"><field name="NUM">1</field></block></value><next><block type="variable_holder" id="/n6RF$?0wGe5lzRu7MNO"><field name="Variable name">op3</field><value name="NAME"><block type="input_bock" id="N0)NI-lO4Ez*eYX;lGf)"></block></value><next><block type="controls_if" id=":O$9T(9-MvO919J:KZ`0"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="gBWWrNJfJ~8dK-_Q60U|"><field name="OP">EQ</field><value name="A"><block type="variables" id="UIcXK5/;5w`%*1B|2Ti3"><field name="Options">op1</field></block></value><value name="B"><block type="variables" id=")Umq%PMu(._D*0ecjzXG"><field name="Options">op2</field></block></value></block></value><statement name="DO0"><block type="say_block" id="b2=j:mfX^ck)6Hv=D.T3"><field name="say">Correct spelling</field><next><block type="variable_holder" id="N{84k:tQ;altBTUdz%O-"><field name="Variable name">op2</field><value name="NAME"><block type="math_arithmetic" id="Q^GH_X$RD`h)gGB=p,f`"><field name="OP">ADD</field><value name="A"><block type="variables" id="/c8wd$Yiv,r=99kDt)s5"><field name="Options">op4</field></block></value><value name="B"><block type="math_number" id="$3zgkbwf%s,{I{oG7M/Z"><field name="NUM">2</field></block></value></block></value><next><block type="wait_block" id="UMNMG,*U5biU$4cfGpkG"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="sCPNkCMJH@npNtAxO[b/"><field name="NUM">2</field></block></value><next><block type="action_block" id="_rDYx#=Ff;w~AiipdIGi"></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="say_block" id="D4s!BH?]gT9=#}.1~vX."><field name="say">Wrong spelling</field><next><block type="variable_holder" id="xj4HF#VY@[L1F/j*^k:h"><field name="Variable name">op2</field><value name="NAME"><block type="math_arithmetic" id="_z,[(V{koq`)^F002.@O"><field name="OP">MINUS</field><value name="A"><block type="variables" id="xs]avF80%w~isP*GkDc6"><field name="Options">op4</field></block></value><value name="B"><block type="math_number" id="Pq.=EmCk.k+D^x+h:#IA"><field name="NUM">1</field></block></value></block></value><next><block type="wait_block" id="D)xoT8A%)~4$LHiX=w4}"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Mwy^4z.WRG%_y$mD8,,a"><field name="NUM">1</field></block></value><next><block type="actrion_try_again" id="=U5#hz?a]#^aF^i_//,0"></block></next></block></next></block></next></block></statement><next><block type="controls_if" id="e-,)u7};TkIW%iG6W=w,"><value name="IF0"><block type="logic_compare" id="m;2f_8!3LXA1SgOYa[aU"><field name="OP">GTE</field><value name="A"><block type="variables" id="EXE,%9(dom94W!GNR%k!"><field name="Options">op4</field></block></value><value name="B"><block type="math_number" id="1Z772G[Q??B,cTK,l!]4"><field name="NUM">15</field></block></value></block></value><statement name="DO0"><block type="say_block" id="}nEO/JuPxq^}!o|+oCKa"><field name="say">Congratulations! you won the game</field><next><block type="end_block" id="_hMvP:fR@3B?djB:zT4y"></block></next></block></statement><next><block type="controls_if" id="PbiXr,=w`V#|nhCF;q/:"><value name="IF0"><block type="logic_compare" id="510Pksq*,%Mtd?*?Jk5-"><field name="OP">LTE</field><value name="A"><block type="variables" id="z@0;%]qlM5JBO;]g)IQz"><field name="Options">op3</field></block></value><value name="B"><block type="math_number" id="d.a+9z?9O|8@|}munz~r"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="say_block" id="PQ!MnA{GvDj/X5aM{jD5"><field name="say">Time up</field><next><block type="end_block" id="j8e=rjR0XUw5{Y23[W#^"></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></xml>';

// function myUpdateFunction(a) {
//     var code = Blockly.Python.workspaceToCode(demoWorkspace);
//     var import_statement = "from spellmaster import *\n";
//     document.getElementById("pycode").innerHTML = import_statement + code;
//     document.getElementById("modal1").innerHTML = import_statement + code;
// }
// demoWorkspace.addChangeListener(myUpdateFunction);

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from spellmaster import *"];


export {
    completedFlag,
    // myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    start_Game,
    Timer,
    Score,
    spelling,
    start_timer,
    // QuestionExist,
    display_picture,
    get_string_input_from_user,
    ShowLetters,
    NewTry,
    sleep,
    next_question,
    try_again,
    say,
    game_over,
    // update,
    QuestionExist,
    GameIsOver,
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