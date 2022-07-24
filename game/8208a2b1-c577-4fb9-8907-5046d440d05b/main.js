import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;


let _gameThis = null;
const baseURL = "../img/images/8208a2b1-c577-4fb9-8907-5046d440d05b";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const GAME_CONSTANT = {
    images: {
        BG: "Background.png",
        speechBubble: "speechBubble.png",
        c1: "c1.png",
        c2: "c2.png",
        c3: "c3.png",
        c4: "c4.png",
        c7: "c7.png",
        c8: "c8.png",
        c9: "c9.png",
        c10: "c10.png",



    },
    spritesImages: {
        Mg1: "spritesheet (40).png",
        Mg2: "spritesheet (41).png",
        Mg3: "spritesheet (42).png",
        Mg4: "spritesheet (43).png",
        Mg5: "spritesheet (44).png",
        Mg6: "spritesheet (45).png",
        Mg7: "spritesheet (46).png",
        Mg8: "spritesheet (47).png",
        Mg9: "spritesheet (48).png",
        Mg10: "spritesheet (49).png",

        Boy1: "boy1.png",
        Boy2: "boy2.png",
        Boy3: "boy3.png",
        Boy4: "boy4.png",
        Boy5: "boy5.png",
        Boy6: "boy6.png",
        Boy7: "boy7.png",
        Boy8: "boy8.png",
        Boy9: "boy9.png",
        Boy10: "boy10.png",


    }
};



let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;
let Middletext;
let BG;
let number = 0;
let guess = 0;
let UserGuess;
let BubbleS;
let speechCounter = 0;
let AlertOn = false;
let StartCheck = false;
let Reset = false;
let magicien;
let boy;
let clap;
let run_ = true;
let dummy = 0;

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
    BG = this.add.image(gameWidth / 2, gameHeight / 2, "BG").setName("BG");
    _gameThis["BG"] = BG;

    magicien = this.add.sprite(gameWidth / 2, gameHeight * 0.43, "Mg1", "0");

    boy = this.add.sprite(gameWidth * 0.8, gameHeight * 0.5, "Boy1", "0");

    clap = this.add.sprite(gameWidth / 2, 0, "c1");
    clap.setY(gameHeight - clap.displayHeight * 0.5);

    //create animations
    _gameThis.anims.create({
        key: "clap1",
        frames: [{ key: "c1" }, { key: "c2" }, { key: "c3" }],
        frameRate: 8,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "clap2",
        frames: [
            { key: "c4" },
            { key: "c7" },
            { key: "c8" },
            { key: "c9" },
            { key: "c10" },
        ],
        frameRate: 8,
        repeat: 4,
    });

    create_animM("Mg1");
    create_animM("Mg2");
    create_animM("Mg3");
    create_animM("Mg4");
    create_animM("Mg5");
    create_animM("Mg6");
    create_animM("Mg7");
    create_animM("Mg8");
    create_animM("Mg9");
    create_animM("Mg10");

    create_animB("Boy1");
    create_animB("Boy2");
    create_animB("Boy3");
    create_animB("Boy4");
    create_animB("Boy5");
    create_animB("Boy6");
    create_animB("Boy7");
    create_animB("Boy8");
    create_animB("Boy9");
    create_animB("Boy10");

    //error text
    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);
    //bubble and text
    BubbleS = this.add.image(0, 0, "speechBubble").setScale(0.4);
    BubbleS.setFlipX(true);
    Middletext = _gameThis.add.text(
        0,
        0,
        "", { font: "bold 36px Arial", fill: "#000000" }
    );
    Middletext.setOrigin(0.5, 0.5);

    BubbleS.setPosition(
        _gameThis.cameras.main.width * 0.21,
        _gameThis.cameras.main.height * 0.15
    );
    Middletext.setPosition(BubbleS.x, BubbleS.y - BubbleS.displayHeight * 0.15);
    BubbleS.setVisible(false);

}

//magicien select a new number
number = mathRandomInt(1, 10);

function StartIntro() {
    console.log(number);
    console.log("StartIntro");
    if (Reset) {
        Reset = false;
    } else {
        if (run_) {
            magicien.setTexture("Mg1", "0");
            boy.setTexture("Boy1", "0");
            clap.stop();
            clap.setTexture("c1");
            speechCounter = 1;
            guess = 0;
            if (run_) say("Guess a number from 1 to 10");

            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });
        }

    }
}

function get_int_input_from_user(txt) {
    if (run_) return parseInt(prompt(txt, "Enter only numbers here"));
}

function PlayMagicien() {
    if (run_) {
        if (guess <= 0 || guess > 10) {
            number = get_int_input_from_user("Enter a number between 1 to 10");
        }
        console.log("PlayMagicien");
        magicien.play("_" + guess);
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 600);
        });
    }
}

function PlayanimBoy() {
    if (run_) {
        boy.play("b_" + number);
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 800);
        });
    }
}

function playClap() {
    if (run_) {
        clap.on(
            Phaser.Animations.Events.ANIMATION_COMPLETE,
            function () {
                console.log(clap.texture.key);
                if (clap.texture.key == "c3") {
                    clap.play("clap2");
                }
                if (clap.texture.key == "c10") {
                    clap.setTexture("c1");
                }
            },
            _gameThis
        );
        clap.play("clap1");
    }
}

function end_game() {
    if (run_) {
        playClap();
        GameIsOver = true;
    }
}

function sleep(T) {
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, T * 1000);
        });
}

function say(str) {
    if (run_) {
        if (speechCounter == 0) {
            BubbleS.setPosition(
                _gameThis.cameras.main.width * 0.21,
                _gameThis.cameras.main.height * 0.15
            );
        } else {
            BubbleS.setPosition(
                _gameThis.cameras.main.width * 0.72,
                _gameThis.cameras.main.height * 0.13
            );
        }
        Middletext.setPosition(BubbleS.x, BubbleS.y - BubbleS.displayHeight * 0.15);
        speechCounter++;
        BubbleS.setVisible(true);
        Middletext.setText(str);
    }
}

async function update() { }

function create_animM(key) {
    let N = parseInt(key.replace("Mg", ""));
    _gameThis.anims.create({
        key: "_" + N,
        frames: _gameThis.anims.generateFrameNumbers(key, {
            frames: ["0", "1", "2", "3"],
        }),
        frameRate: 8,
        repeat: 0,
    });
}

function create_animB(key) {
    let N = parseInt(key.replace("Boy", ""));
    _gameThis.anims.create({
        key: "b_" + N,
        frames: _gameThis.anims.generateFrameNumbers(key, {
            frames: ["0", "1", "2", "3"],
        }),
        frameRate: 8,
        repeat: 0,
    });
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
            const element = spritesImages[key];
            if (key.indexOf("Mg") != -1) {
                _gameThis.load.spritesheet(key, element, {
                    frameWidth: 450,
                    frameHeight: 700,
                });
            }
            if (key.indexOf("Boy") != -1) {
                _gameThis.load.spritesheet(key, element, {
                    frameWidth: 300,
                    frameHeight: 600,
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

function Start_Game() {
    console.log("------------------->Start_Game");
}
// Re-initialize the game variables
function reInitValues() {
    run_ = false;
    BubbleS.setPosition(
        _gameThis.cameras.main.width * 0.21,
        _gameThis.cameras.main.height * 0.15
    );
    Middletext.setPosition(BubbleS.x, BubbleS.y - BubbleS.displayHeight * 0.15);
    BubbleS.setVisible(false);
    speechCounter = 0;
    GameIsOver = false;
    ErrorInnerText = "";
    number = 0;
    guess = 0;
    speechCounter = 0;
    AlertOn = false;
    StartCheck = false;
    number = mathRandomInt(1, 10);
    Reset = false;

}
// Reset the game
function reset_output() {
    Reset = true;
    reInitValues();
    _gameThis.scene.restart();
}

function mathRandomInt(a, b) {
    if (a > b) {
        var c = a;
        a = b;
        b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
}


function runCode() {
    // tour_over && tour.complete();
    reset_output();
    reInitValues();
    setTimeout(() => {
        run_ = true;
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            eval(a);
        } catch (b) { alert(b) }
        // try {
        //     if (tour.getCurrentStep().options.title.includes("Run")) {
        //         let btns = document.querySelectorAll('.shepherd-button');
        //         btns[btns.length - 1].click();
        //     }
        // } catch { }
    }, 1000);
}

// function helpCode() {
//     var xml_wkspace =
//         '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="tu5ctsW1PI!`%lQzp;5x" x="-218" y="-214"><field name="Variable name">number</field><value name="NAME"><block type="math_random_int" id="0?EK=FqZ-sE3[hpVsu`O"><value name="FROM"><shadow type="math_number" id=";!yum@h|0uR**]4v,v+)"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number" id="pjcNwu0}uBKW)a%cv=~S"><field name="NUM">10</field></shadow></value></block></value><next><block type="controls_repeat_ext" id="S:R$HG5l@nq/R#~,?4P5"><value name="TIMES"><block type="math_number" id="/]%okcHm?8F+]pQ$~xCD"><field name="NUM">10</field></block></value><statement name="DO"><block type="intro_block" id="+-WB0(l05Zqb!PpsX5sH"><next><block type="wait_block" id="Al^Uh@P(-8H|cdvMRjiS"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="OydG!QgL(dh]5ytCX26F"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="rV+nA5kextf5FAn-/?$8"><field name="Variable name">guess</field><value name="NAME"><block type="input_bock" id=",l,TtG6O+q#vw9ZJ{USx"></block></value><next><block type="magician_block" id="3rx*(Zf|ugt7@n9,%Q,*"><next><block type="controls_if" id="H8ufBkgbR}t+vp`5B7]O"><mutation elseif="1"></mutation><value name="IF0"><block type="logic_operation" id="4+hqjMLWY2T9J[Y%wG|p"><field name="OP">OR</field><value name="A"><block type="logic_compare" id="$fft[Lw6#:[.2TbSd2?z"><field name="OP">EQ</field><value name="A"><block type="variables" id="qOpE0I!`q%HvTDK.^/oX"><field name="Options">op1</field></block></value><value name="B"><block type="arithmetic_block" id="2HS6!5skBwqopr/[y#{5"><field name="NAME">op2</field><field name="options">option1</field><field name="num">1</field></block></value></block></value><value name="B"><block type="logic_compare" id="8RCDX.DBQ^{}AQDR/@VR"><field name="OP">EQ</field><value name="A"><block type="variables" id="Vk89,6?DDj2k~A;nCagk"><field name="Options">op1</field></block></value><value name="B"><block type="arithmetic_block" id="ez6hrSS@[-J8=+PmZ6`U"><field name="NAME">op2</field><field name="options">option2</field><field name="num">1</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="S9_c.:X|pye:mRsME*uI"><field name="say">Hot</field><next><block type="wait_block" id="dZWB]4#Cl2)9,!wG3epV"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="P,`)E=X%GA+z8/,SJTJP"><field name="NUM">2</field></block></value></block></next></block></statement><value name="IF1"><block type="logic_compare" id="[=bdRh,3A.N#.Z;Alxg0"><field name="OP">NEQ</field><value name="A"><block type="variables" id="!e^0)p[l#B?_fbe=Q$|u"><field name="Options">op1</field></block></value><value name="B"><block type="variables" id="|+w*@lFHC7:2oj3btw;s"><field name="Options">op2</field></block></value></block></value><statement name="DO1"><block type="say_block" id="?TZsq^1fAcT8y/{kR%{:"><field name="say">Cold</field><next><block type="wait_block" id="kL]Kr8/#*eOC;YmfLgVP"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="1yf8hJ-Tc4_8^_`,m40`"><field name="NUM">2</field></block></value></block></next></block></statement><next><block type="controls_if" id="JB%)6,,/b!Q?Lkfm|tkD"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="jrXNQa0UaVf-?5P/xE6v"><field name="OP">EQ</field><value name="A"><block type="variables" id="w|gU9.@9esLPQp4xRe?r"><field name="Options">op1</field></block></value><value name="B"><block type="variables" id="#{SD_7apt~(ZTG,;mg:?"><field name="Options">op2</field></block></value></block></value><statement name="DO0"><block type="say_block" id="X%ZTgpe!r.mubDUYfR@G"><field name="say">Yes You got it</field><next><block type="wait_block" id="d*eC20fDdoGGO_7Gd});"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="D*HL)NQ620yI?:t]CGyg"><field name="NUM">2</field></block></value><next><block type="boy_block" id="[uuA8QoAmL5bXilBJ@L#"><next><block type="say_block" id="UIL?~{1K(HM#=A}Ryzhg"><field name="say">Congratulations!</field><next><block type="single_action_block" id="`v!+=/]mQ]pSc8DC){oz"></block></next></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="say_block" id="2XxtrfVMz,G!;vj,}+tR"><field name="say">Try Again</field><next><block type="wait_block" id="`uqiu,)1%;|6QktS(.co"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="$n^g4I|4MVIz;n2-C4}{"><field name="NUM">2</field></block></value></block></next></block></statement><next><block type="wait_block" id="J~cx0E?qHT_Nk*K16SH^"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id=")e@^j(0#Gf?Ee-].5Yn{"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="tu5ctsW1PI!`%lQzp;5x" x="-218" y="-214"><field name="Variable name">number</field><value name="NAME"><block type="math_random_int" id="0?EK=FqZ-sE3[hpVsu`O"><value name="FROM"><shadow type="math_number" id=";!yum@h|0uR**]4v,v+)"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number" id="pjcNwu0}uBKW)a%cv=~S"><field name="NUM">10</field></shadow></value></block></value><next><block type="controls_repeat_ext" id="S:R$HG5l@nq/R#~,?4P5"><value name="TIMES"><block type="math_number" id="/]%okcHm?8F+]pQ$~xCD"><field name="NUM">10</field></block></value><statement name="DO"><block type="intro_block" id="+-WB0(l05Zqb!PpsX5sH"><next><block type="wait_block" id="Al^Uh@P(-8H|cdvMRjiS"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="OydG!QgL(dh]5ytCX26F"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="rV+nA5kextf5FAn-/?$8"><field name="Variable name">guess</field><value name="NAME"><block type="input_bock" id=",l,TtG6O+q#vw9ZJ{USx"></block></value><next><block type="magician_block" id="3rx*(Zf|ugt7@n9,%Q,*"><next><block type="controls_if" id="H8ufBkgbR}t+vp`5B7]O"><mutation elseif="1"></mutation><value name="IF0"><block type="logic_operation" id="4+hqjMLWY2T9J[Y%wG|p"><field name="OP">OR</field><value name="A"><block type="logic_compare" id="$fft[Lw6#:[.2TbSd2?z"><field name="OP">EQ</field><value name="A"><block type="variables" id="qOpE0I!`q%HvTDK.^/oX"><field name="Options">op1</field></block></value><value name="B"><block type="arithmetic_block" id="2HS6!5skBwqopr/[y#{5"><field name="NAME">op2</field><field name="options">option1</field><field name="num">1</field></block></value></block></value><value name="B"><block type="logic_compare" id="8RCDX.DBQ^{}AQDR/@VR"><field name="OP">EQ</field><value name="A"><block type="variables" id="Vk89,6?DDj2k~A;nCagk"><field name="Options">op1</field></block></value><value name="B"><block type="arithmetic_block" id="ez6hrSS@[-J8=+PmZ6`U"><field name="NAME">op2</field><field name="options">option2</field><field name="num">1</field></block></value></block></value></block></value><statement name="DO0"><block type="say_block" id="S9_c.:X|pye:mRsME*uI"><field name="say">Hot</field><next><block type="wait_block" id="dZWB]4#Cl2)9,!wG3epV"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="P,`)E=X%GA+z8/,SJTJP"><field name="NUM">2</field></block></value></block></next></block></statement><value name="IF1"><block type="logic_compare" id="[=bdRh,3A.N#.Z;Alxg0"><field name="OP">NEQ</field><value name="A"><block type="variables" id="!e^0)p[l#B?_fbe=Q$|u"><field name="Options">op1</field></block></value><value name="B"><block type="variables" id="|+w*@lFHC7:2oj3btw;s"><field name="Options">op2</field></block></value></block></value><statement name="DO1"><block type="say_block" id="?TZsq^1fAcT8y/{kR%{:"><field name="say">Cold</field><next><block type="wait_block" id="kL]Kr8/#*eOC;YmfLgVP"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="1yf8hJ-Tc4_8^_`,m40`"><field name="NUM">2</field></block></value></block></next></block></statement><next><block type="controls_if" id="JB%)6,,/b!Q?Lkfm|tkD"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="jrXNQa0UaVf-?5P/xE6v"><field name="OP">EQ</field><value name="A"><block type="variables" id="w|gU9.@9esLPQp4xRe?r"><field name="Options">op1</field></block></value><value name="B"><block type="variables" id="#{SD_7apt~(ZTG,;mg:?"><field name="Options">op2</field></block></value></block></value><statement name="DO0"><block type="say_block" id="X%ZTgpe!r.mubDUYfR@G"><field name="say">Yes You got it</field><next><block type="wait_block" id="d*eC20fDdoGGO_7Gd});"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="D*HL)NQ620yI?:t]CGyg"><field name="NUM">2</field></block></value><next><block type="boy_block" id="[uuA8QoAmL5bXilBJ@L#"><next><block type="say_block" id="UIL?~{1K(HM#=A}Ryzhg"><field name="say">Congratulations!</field><next><block type="single_action_block" id="`v!+=/]mQ]pSc8DC){oz"></block></next></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="say_block" id="2XxtrfVMz,G!;vj,}+tR"><field name="say">Try Again</field><next><block type="wait_block" id="`uqiu,)1%;|6QktS(.co"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="$n^g4I|4MVIz;n2-C4}{"><field name="NUM">2</field></block></value></block></next></block></statement><next><block type="wait_block" id="J~cx0E?qHT_Nk*K16SH^"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id=")e@^j(0#Gf?Ee-].5Yn{"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from mind_reader import *\n";
    document.getElementById("pycode").innerHTML = import_statement + code;
    document.getElementById("modal1").innerHTML = import_statement + code;
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

const updateImports = ["from mind_reader import *"]

// async function Test() {
//     for (a = 0; a < 10; a++) {
//         await StartIntro();
//         await sleep(2);
//         guess = get_int_input_from_user("Enter your guess: ");
//         await PlayMagicien();

//         if (number == guess + 1 || number == guess - 1) {
//             say("Hot");
//             await sleep(2);
//         } else if (number != guess) {
//             say("Cold");
//             await sleep(2);
//         }
//         if (number == guess) {
//             say("Yes, you got it!");
//             await sleep(2);
//             await PlayanimBoy();
//             end_game();
//             break;
//         } else {
//             say("Try again!");
//             await sleep(2);
//         }
//         await sleep(2);
//     }
// }

const instruction = {
    "heading": "You are the magician who has to guess the number benny is hiding. Benny will help you with a hint to guess the right number, Hot if your close to the number and cold if your far",
    "steps": [
        {
            "checkbox": true,
            "rescue": true,
            "text": "set number as random integer from 1 to 10",
            "title": "Choose a number from 1 to 10",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "repeat 5 times and all the following statements are within this loop",
            "title": "Lets give 5 chances",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "Boy says \"Guess a number\"",
            "title": "Initiate Guess",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "wait for 2 sec",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "set guess as display input box",
            "title": "Get guess input",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "Magician shows guessed number",
            "title": "Show guessed number",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If number equals guess+1 or number equals guess-1, say \"Hot\", wait for 2 sec",
            "title": "Hot or cold condition",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else if number not equal to guess, say \"Cold\", wait for 2 sec",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If number equals guess, statements 1",
            "title": "Win condition",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else, say \"Try again\", wait for 2 secs",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"ELSE\"><block type=\"say_block\" id=\"2XxtrfVMz,G!;vj,}+tR\"><field name=\"say\">Try Again</field><next><block type=\"wait_block\" id=\"`uqiu,)1%;|6QktS(.co\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"$n^g4I|4MVIz;n2-C4}{\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "say \"Yes you got it\"",
            "title": "Statements 1",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"X%ZTgpe!r.mubDUYfR@G\"><field name=\"say\">Yes You got it</field></block></statement><statement name=\"ELSE\"><block type=\"say_block\" id=\"2XxtrfVMz,G!;vj,}+tR\"><field name=\"say\">Try Again</field><next><block type=\"wait_block\" id=\"`uqiu,)1%;|6QktS(.co\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"$n^g4I|4MVIz;n2-C4}{\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "wait for 2 sec",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"X%ZTgpe!r.mubDUYfR@G\"><field name=\"say\">Yes You got it</field><next><block type=\"wait_block\" id=\"d*eC20fDdoGGO_7Gd});\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"D*HL)NQ620yI?:t]CGyg\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><statement name=\"ELSE\"><block type=\"say_block\" id=\"2XxtrfVMz,G!;vj,}+tR\"><field name=\"say\">Try Again</field><next><block type=\"wait_block\" id=\"`uqiu,)1%;|6QktS(.co\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"$n^g4I|4MVIz;n2-C4}{\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "Reveal answer",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"X%ZTgpe!r.mubDUYfR@G\"><field name=\"say\">Yes You got it</field><next><block type=\"wait_block\" id=\"d*eC20fDdoGGO_7Gd});\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"D*HL)NQ620yI?:t]CGyg\"><field name=\"NUM\">2</field></block></value><next><block type=\"boy_block\" id=\"[uuA8QoAmL5bXilBJ@L#\"></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"say_block\" id=\"2XxtrfVMz,G!;vj,}+tR\"><field name=\"say\">Try Again</field><next><block type=\"wait_block\" id=\"`uqiu,)1%;|6QktS(.co\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"$n^g4I|4MVIz;n2-C4}{\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "say \"Congratulations\"",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"X%ZTgpe!r.mubDUYfR@G\"><field name=\"say\">Yes You got it</field><next><block type=\"wait_block\" id=\"d*eC20fDdoGGO_7Gd});\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"D*HL)NQ620yI?:t]CGyg\"><field name=\"NUM\">2</field></block></value><next><block type=\"boy_block\" id=\"[uuA8QoAmL5bXilBJ@L#\"><next><block type=\"say_block\" id=\"UIL?~{1K(HM#=A}Ryzhg\"><field name=\"say\">Congratulations!</field></block></next></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"say_block\" id=\"2XxtrfVMz,G!;vj,}+tR\"><field name=\"say\">Try Again</field><next><block type=\"wait_block\" id=\"`uqiu,)1%;|6QktS(.co\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"$n^g4I|4MVIz;n2-C4}{\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "End all",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"tu5ctsW1PI!`%lQzp;5x\" x=\"-218\" y=\"-214\"><field name=\"Variable name\">number</field><value name=\"NAME\"><block type=\"math_random_int\" id=\"0?EK=FqZ-sE3[hpVsu`O\"><value name=\"FROM\"><shadow type=\"math_number\" id=\";!yum@h|0uR**]4v,v+)\"><field name=\"NUM\">1</field></shadow></value><value name=\"TO\"><shadow type=\"math_number\" id=\"pjcNwu0}uBKW)a%cv=~S\"><field name=\"NUM\">10</field></shadow></value></block></value><next><block type=\"controls_repeat_ext\" id=\"S:R$HG5l@nq/R#~,?4P5\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/]%okcHm?8F+]pQ$~xCD\"><field name=\"NUM\">5</field></block></value><statement name=\"DO\"><block type=\"intro_block\" id=\"+-WB0(l05Zqb!PpsX5sH\"><next><block type=\"wait_block\" id=\"Al^Uh@P(-8H|cdvMRjiS\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"OydG!QgL(dh]5ytCX26F\"><field name=\"NUM\">2</field></block></value><next><block type=\"set_variable_holder\" id=\"rV+nA5kextf5FAn-/?$8\"><field name=\"Variable name\">guess</field><value name=\"NAME\"><block type=\"input_bock\" id=\",l,TtG6O+q#vw9ZJ{USx\"></block></value><next><block type=\"magician_block\" id=\"3rx*(Zf|ugt7@n9,%Q,*\"><next><block type=\"controls_if\" id=\"H8ufBkgbR}t+vp`5B7]O\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_operation\" id=\"4+hqjMLWY2T9J[Y%wG|p\"><field name=\"OP\">OR</field><value name=\"A\"><block type=\"logic_compare\" id=\"$fft[Lw6#:[.2TbSd2?z\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"qOpE0I!`q%HvTDK.^/oX\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"2HS6!5skBwqopr/[y#{5\"><field name=\"NAME\">op2</field><field name=\"options\">option1</field><field name=\"num\">1</field></block></value></block></value><value name=\"B\"><block type=\"logic_compare\" id=\"8RCDX.DBQ^{}AQDR/@VR\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Vk89,6?DDj2k~A;nCagk\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"arithmetic_block\" id=\"ez6hrSS@[-J8=+PmZ6`U\"><field name=\"NAME\">op2</field><field name=\"options\">option2</field><field name=\"num\">1</field></block></value></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"S9_c.:X|pye:mRsME*uI\"><field name=\"say\">Hot</field><next><block type=\"wait_block\" id=\"dZWB]4#Cl2)9,!wG3epV\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"P,`)E=X%GA+z8/,SJTJP\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><value name=\"IF1\"><block type=\"logic_compare\" id=\"[=bdRh,3A.N#.Z;Alxg0\"><field name=\"OP\">NEQ</field><value name=\"A\"><block type=\"variables\" id=\"!e^0)p[l#B?_fbe=Q$|u\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"|+w*@lFHC7:2oj3btw;s\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO1\"><block type=\"say_block\" id=\"?TZsq^1fAcT8y/{kR%{:\"><field name=\"say\">Cold</field><next><block type=\"wait_block\" id=\"kL]Kr8/#*eOC;YmfLgVP\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"1yf8hJ-Tc4_8^_`,m40`\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"controls_if\" id=\"JB%)6,,/b!Q?Lkfm|tkD\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"jrXNQa0UaVf-?5P/xE6v\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"w|gU9.@9esLPQp4xRe?r\"><field name=\"Options\">op1</field></block></value><value name=\"B\"><block type=\"variables\" id=\"#{SD_7apt~(ZTG,;mg:?\"><field name=\"Options\">op2</field></block></value></block></value><statement name=\"DO0\"><block type=\"say_block\" id=\"X%ZTgpe!r.mubDUYfR@G\"><field name=\"say\">Yes You got it</field><next><block type=\"wait_block\" id=\"d*eC20fDdoGGO_7Gd});\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"D*HL)NQ620yI?:t]CGyg\"><field name=\"NUM\">2</field></block></value><next><block type=\"boy_block\" id=\"[uuA8QoAmL5bXilBJ@L#\"><next><block type=\"say_block\" id=\"UIL?~{1K(HM#=A}Ryzhg\"><field name=\"say\">Congratulations!</field><next><block type=\"single_action_block\" id=\"`v!+=/]mQ]pSc8DC){oz\"></block></next></block></next></block></next></block></next></block></statement><statement name=\"ELSE\"><block type=\"say_block\" id=\"2XxtrfVMz,G!;vj,}+tR\"><field name=\"say\">Try Again</field><next><block type=\"wait_block\" id=\"`uqiu,)1%;|6QktS(.co\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\"$n^g4I|4MVIz;n2-C4}{\"><field name=\"NUM\">2</field></block></value></block></next></block></statement><next><block type=\"wait_block\" id=\"J~cx0E?qHT_Nk*K16SH^\"><field name=\"NAME\">Wait for</field><value name=\"NAME\"><block type=\"math_number\" id=\")e@^j(0#Gf?Ee-].5Yn{\"><field name=\"NUM\">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": false,
            "rescue": false,
            "text": "Time for Magician in you to guess the hidden number on the card Benny is holding. Once you hit the run, enter you guessed number in the shown popup",
            "title": "Instructions to Play",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"></xml>"
        }
    ]
};

export {
    completedFlag,
    myUpdateFunction,
    // helpCode,
    instruction,
    runCode,
    reset_output,
    dummy,
    number,
    guess,
    end_game,
    get_int_input_from_user,
    say,
    sleep,
    PlayMagicien,
    PlayanimBoy,
    StartIntro,
    getNoOfBlocks,
    updateImports
}