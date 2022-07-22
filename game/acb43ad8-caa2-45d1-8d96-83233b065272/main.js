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
const baseURL = "../img/images/acb43ad8-caa2-45d1-8d96-83233b065272";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
let moonT = null;


const GAME_CONSTANT = {
    images: {
        Full_Moon_Background: 'Full_Moon_Background.png',
        NO_MOON_Background: 'NO_MOON_Background.jpg',
        ma: 'ma.png',
        mb: 'mb.png',
        mc: 'mc.png',
        md: 'md.png',
        me: 'me.png',
        mf: 'mf.png',
        mg: 'mg.png',
        mh: 'mh.png',

        Smoon: 'Smoon.png',

    },
    spritesImages: {
        //bird: "Bird",
        Star: { key: "stars", starConfig: { frameWidth: 20, frameHeight: 20 } },
    }
};

let default_ = 0;
let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;

let run_ = true;
let shape;
let BG1, BG2, Star;
let DayText = 0;
var moon;
let day = 0;
let Day;
let repeat_no = 2;
let validations = {
    hide: false,
    crescent: false,
    first_quarter: false,
    gibbous: false,
    full: false,
    gibbous_rev: false,
    first_quarter_rev: false,
    crescent_rev: false,
};

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
    //------------------------------ADD BACKGROUND IMAGE------------------------------

    BG2 = this.add.image(gameWidth / 2, gameHeight / 2, "Full_Moon_Background");
    _gameThis["BG2"] = BG2;

    BG1 = this.add.image(gameWidth / 2, gameHeight / 2, "NO_MOON_Background");
    _gameThis["BG1"] = BG1;
    //----------------------------CREATE STARS ANIMATION--------------------------------
    this.anims.create({
        key: "light",
        frames: this.anims.generateFrameNumbers("Star"),
        frameRate: 15,
    });

    var Star0 = this.add.sprite(gameWidth * 0.1, gameHeight * 0.1, "Star");
    var Star1 = this.add.sprite(gameWidth * 0.3, gameHeight * 0.3, "Star");
    var Star2 = this.add.sprite(gameWidth * 0.5, gameHeight * 0.05, "Star");
    var Star3 = this.add.sprite(gameWidth * 0.85, gameHeight * 0.4, "Star");

    Star0.play({ key: "light", repeat: -1, delay: 500 });
    Star1.play({ key: "light", repeat: -1, delay: 1000 });
    Star2.play({ key: "light", repeat: -1, delay: 1500 });
    Star3.play({ key: "light", repeat: -1, delay: 2000 });

    //----------------------------------------No TO Full MOON ANIMATION----------------------
    let Smoon = this.add
        .sprite(gameWidth * 0.5, gameHeight * 0.3, "Smoon")
        .setScale(0.98, 0.98);

    moon = this.add.sprite(gameWidth * 0.5, gameHeight * 0.3, "ma");
    _gameThis["moon"] = moon;

    moonT = this.add.sprite(gameWidth * 0.5, gameHeight * 0.3, "ma");
    _gameThis["moonT"] = moonT;

    shape = this.add.graphics();
    shape.fillStyle(0xff0000);
    shape.beginPath();
    shape.fillRect(
        moonT.x + moonT.displayWidth * 1,
        moonT.y - moonT.displayHeight * 0.5,
        moonT.displayWidth * 1.5,
        moonT.displayHeight
    );
    const mask = shape.createGeometryMask();
    moonT.setMask(mask);
    shape.setVisible(false);
    moonT.setVisible(false);

    //-----------------------------------DAY TEXT-------------------------------
    Day = _gameThis.add
        .text(gameWidth * 0.5, gameHeight * 0.5, "", {
            font: "bold 56px Arial",
            fill: "#FFFFFF",
        })
        .setOrigin(0.5, 0.5);

    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);
}

function Playmask1(tx) {
    moonT.setVisible(true);
    _gameThis.tweens.add({
        targets: shape,
        x: shape.x - moonT.displayWidth * 2,
        duration: 1000,
        onComplete: () => {
            moon.setTexture(tx);
            moonT.setVisible(false);
            shape.x = 0;
        },
    });
}

function tweenbg(hide, show) {
    // if(hide.alpha == 1){
    _gameThis.tweens.add({
        targets: hide,
        alpha: 0,
        delay: 250,
        duration: 1000,
    });
    // }

    // if(hide.alpha == 0){
    _gameThis.tweens.add({
        targets: show,
        alpha: 1,
        duration: 250,
    });
    //}
}

function game_over() {
    GameIsOver = true;
}

function say(str) {
    console.log("say", str);
}

function update() {
    Day.setText("Day: " + day + " -" + " 8:00pm");
}

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
            const element = spritesImages[key].key;
            const elementValue = spritesImages[key].starConfig;
            _gameThis.load.spritesheet(key, "" + element + ".png", {
                frameWidth: elementValue.frameWidth,
                frameHeight: elementValue.frameHeight,
            });
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
    run_ = false;
    GameIsOver = false;
    day = 0;
}
// Reset the game
function reset_output() {
    console.log("reset_output");
    reInitValues();
    _gameThis.scene.restart();
}

function hide_moon() {

    if (run_) {
        moonT.setTexture("ma");
        Playmask1("ma");
        tweenbg(BG2, BG1);
        validations.hide = true;
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1200);
        });
    }
}

function show_crescent_moon() {
    if (run_) {
        if (day < 20) {
            moonT.setTexture("mb");
            Playmask1("mb");
            tweenbg(BG2, BG1);
            validations.crescent = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        } else {
            moonT.setTexture("mh");
            Playmask1("mh");
            tweenbg(BG2, BG1);
            validations.crescent_rev = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        }
    }
}

function show_first_quarter_moon() {
    if (run_) {
        if (day < 20) {
            moonT.setTexture("mc");
            Playmask1("mc");
            tweenbg(BG2, BG1);
            validations.first_quarter = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        } else {
            moonT.setTexture("mg");
            Playmask1("mg");
            tweenbg(BG2, BG1);
            validations.first_quarter_rev = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        }
    }
}

function show_gibbous_moon() {
    if (run_) {
        if (day < 20) {
            moonT.setTexture("md");
            Playmask1("md");
            tweenbg(BG1, BG2);
            validations.gibbous = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        } else {
            moonT.setTexture("mf");
            Playmask1("mf");
            tweenbg(BG1, BG2);
            validations.gibbous_rev = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        }
    }
}

function show_full_moon() {
    if (run_) {
        if (day < 20) {
            moonT.setTexture("me");
            Playmask1("me");
            tweenbg(BG1, BG2);
            validations.full = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        } else {
            moonT.setTexture("me");
            Playmask1("me");
            tweenbg(BG1, BG2);
            validations.full = true;
            if (run_) return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, 1200);
            });
        }
    }
}

async function validate() {
    if (run_) return new Promise((resolve) => {
        setTimeout(() => {
            if (validations.hide &&
                validations.crescent &&
                validations.first_quarter &&
                validations.gibbous &&
                validations.full &&
                validations.gibbous_rev &&
                validations.first_quarter_rev &&
                validations.crescent_rev)
                GameIsOver = true;
            resolve(true);
        }, 1200);
    });

}

function runCode() {
    // tour_over && tour.complete();
    reset_output();
    setTimeout(() => {
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + " await validate();} c();";
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            run_ = true;
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
//     var xml_wkspace = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="-HEDBHm]H-l,5SHvEU1N" x="173" y="-1676"><value name="TIMES"><block type="math_number" id="/,Ug:.%w8St9w*gf^sDU"><field name="NUM">2</field></block></value><statement name="DO"><block type="variable_holder" id="j;WazlW_^E-fVBUlN3J,"><field name="Variable name">day</field><value name="NAME"><block type="math_number" id="HB^H)3j_1R]zuW?EWLi1"><field name="NUM">0</field></block></value><next><block type="wait" id="bD{NQ7@gLC_,pEqa|9;N"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="^9A6K+j2a@+`+Nwp?x0F"><field name="NUM">1</field></block></value><next><block type="controls_repeat_ext" id="D)Zs9fRp.cK#K:e{T($0"><value name="TIMES"><block type="math_number" id="],qLO%S02{C2XeoMhi5r"><field name="NUM">30</field></block></value><statement name="DO"><block type="controls_if" id="(5mAGpv|9N]WnRVTWQYT"><value name="IF0"><block type="logic_compare" id="Tlyu=:}txzb#A_n.:`oM"><field name="OP">EQ</field><value name="A"><block type="variables" id="G:E,6D#k=]djEn-xW;j8"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="gpt~162@Y*k!uR0Z:f@p"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="hide_block" id="A@HO3sD5cG3.`E;G]X+T"><field name="NAME">hide_moon()</field></block></statement><next><block type="controls_if" id="bb{WRb-PZOy`s6nxCGqG"><value name="IF0"><block type="logic_compare" id="EL=?jaAEaDfVmchMH{g."><field name="OP">EQ</field><value name="A"><block type="variables" id="?V^i|}dq8gH*jVy7a6W)"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="+Ye34imvF)E5)I^gk~B|"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="u|T}TVC_,_-E||~6^!(!"><field name="options">show_crescent_moon</field></block></statement><next><block type="controls_if" id="IHy:Gw1$k.y!-P}R[hF}"><value name="IF0"><block type="logic_compare" id="yB*TNt*5{,o4Uco=;P$-"><field name="OP">EQ</field><value name="A"><block type="variables" id="zF=JWe^%OAo|u}uTp9a:"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="17s^]kXzgsN;{mB?KiY-"><field name="NUM">6</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="Y}Q[87^0:Anwd@Q~[Jlb"><field name="options">show_first_quarter_moon</field></block></statement><next><block type="controls_if" id="V|{9F~d:1s%L-d`jdUwm"><value name="IF0"><block type="logic_compare" id="c*R,kdPkFBpdvdZUO)Q2"><field name="OP">EQ</field><value name="A"><block type="day_block" id="n.?=O2__-9_cY8kIoKiI"></block></value><value name="B"><block type="math_number" id="DiVe;laV-k9p(.Smak)@"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="kSZh!zYKs!YJYnl{L5V2"><field name="options">show_gibbous_moon</field></block></statement><next><block type="controls_if" id="5djW[KQLbjfLlU.t}1.r"><value name="IF0"><block type="logic_compare" id="gQ|2m`gMVQFwJzG[?Ou{"><field name="OP">EQ</field><value name="A"><block type="variables" id="Cz*Nf]cAIa[33WYV1UCB"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="]p3}oR8lJ_jLe@7EWN_["><field name="NUM">15</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="u|]X+M1YZnJr?Bb~QeVw"><field name="options">show_full_moon</field></block></statement><next><block type="controls_if" id=".@leJYdNc2lc9vLSzF1|"><value name="IF0"><block type="logic_compare" id=")lVKX8i:_tRD#X@YGd]/"><field name="OP">EQ</field><value name="A"><block type="variables" id="mSkpO=.1je}T-k#WxPa$"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="wqbGWhgZb)Ub$-ix0PG="><field name="NUM">20</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="D/;g%(6iC$$oId~ioShw"><field name="options">show_gibbous_moon</field></block></statement><next><block type="controls_if" id="vhm(noX+y6KvU}@663cN"><value name="IF0"><block type="logic_compare" id="]K_N1`lMB-Ev6qH|:%mq"><field name="OP">EQ</field><value name="A"><block type="variables" id="XM}3KY*e6*xl!X=#/vz5"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="/hE{/{i4DV`MbM}By~G#"><field name="NUM">25</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="QD$L{c1UQ.t)D/(5TEnC"><field name="options">show_first_quarter_moon</field></block></statement><next><block type="controls_if" id="B.;|g-1_,39`sfDRy_2k"><value name="IF0"><block type="logic_compare" id="9eYW|Pak$tx4`=PW%%$$"><field name="OP">EQ</field><value name="A"><block type="variables" id="mX`.PiqC0ne15P!+D0nf"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="dC(dHK~Zj/Q=,e%-*|Lx"><field name="NUM">28</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="n*1aJ#a;eowYvFYp;wM8"><field name="options">show_crescent_moon</field></block></statement><next><block type="controls_if" id="/+.p6Sd0cp*Gs+`,wJH`"><value name="IF0"><block type="logic_compare" id="vN(?hAH`7pro,4=+j=O%"><field name="OP">EQ</field><value name="A"><block type="variables" id="+#og:?J.)a!~c3?{Y}HT"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="3wQhD8)msO+qbg#fI04_"><field name="NUM">30</field></block></value></block></value><statement name="DO0"><block type="hide_block" id="3m#9tecpi8OFRnEg4}`t"><field name="NAME">hide_moon()</field></block></statement><next><block type="change_variable_holder" id="5uL@UnG9`^6C}_!mjY@?"><field name="Variable name">day</field><value name="NAME"><block type="math_number" id="I{S]#^0kNjq0O7cJqpw}"><field name="NUM">1</field></block></value><next><block type="wait" id="`DRU$mKtmqXBzk.{{kL."><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="V{EPMH$Xj8@8Ze|vbq^f"><field name="NUM">0.3</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>';
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="-HEDBHm]H-l,5SHvEU1N" x="173" y="-1676"><value name="TIMES"><block type="math_number" id="/,Ug:.%w8St9w*gf^sDU"><field name="NUM">2</field></block></value><statement name="DO"><block type="variable_holder" id="j;WazlW_^E-fVBUlN3J,"><field name="Variable name">day</field><value name="NAME"><block type="math_number" id="HB^H)3j_1R]zuW?EWLi1"><field name="NUM">0</field></block></value><next><block type="wait" id="bD{NQ7@gLC_,pEqa|9;N"><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="^9A6K+j2a@+`+Nwp?x0F"><field name="NUM">1</field></block></value><next><block type="controls_repeat_ext" id="D)Zs9fRp.cK#K:e{T($0"><value name="TIMES"><block type="math_number" id="],qLO%S02{C2XeoMhi5r"><field name="NUM">30</field></block></value><statement name="DO"><block type="controls_if" id="(5mAGpv|9N]WnRVTWQYT"><value name="IF0"><block type="logic_compare" id="Tlyu=:}txzb#A_n.:`oM"><field name="OP">EQ</field><value name="A"><block type="variables" id="G:E,6D#k=]djEn-xW;j8"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="gpt~162@Y*k!uR0Z:f@p"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="hide_block" id="A@HO3sD5cG3.`E;G]X+T"><field name="NAME">hide_moon()</field></block></statement><next><block type="controls_if" id="bb{WRb-PZOy`s6nxCGqG"><value name="IF0"><block type="logic_compare" id="EL=?jaAEaDfVmchMH{g."><field name="OP">EQ</field><value name="A"><block type="variables" id="?V^i|}dq8gH*jVy7a6W)"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="+Ye34imvF)E5)I^gk~B|"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="u|T}TVC_,_-E||~6^!(!"><field name="options">show_crescent_moon</field></block></statement><next><block type="controls_if" id="IHy:Gw1$k.y!-P}R[hF}"><value name="IF0"><block type="logic_compare" id="yB*TNt*5{,o4Uco=;P$-"><field name="OP">EQ</field><value name="A"><block type="variables" id="zF=JWe^%OAo|u}uTp9a:"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="17s^]kXzgsN;{mB?KiY-"><field name="NUM">6</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="Y}Q[87^0:Anwd@Q~[Jlb"><field name="options">show_first_quarter_moon</field></block></statement><next><block type="controls_if" id="V|{9F~d:1s%L-d`jdUwm"><value name="IF0"><block type="logic_compare" id="c*R,kdPkFBpdvdZUO)Q2"><field name="OP">EQ</field><value name="A"><block type="day_block" id="n.?=O2__-9_cY8kIoKiI"></block></value><value name="B"><block type="math_number" id="DiVe;laV-k9p(.Smak)@"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="kSZh!zYKs!YJYnl{L5V2"><field name="options">show_gibbous_moon</field></block></statement><next><block type="controls_if" id="5djW[KQLbjfLlU.t}1.r"><value name="IF0"><block type="logic_compare" id="gQ|2m`gMVQFwJzG[?Ou{"><field name="OP">EQ</field><value name="A"><block type="variables" id="Cz*Nf]cAIa[33WYV1UCB"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="]p3}oR8lJ_jLe@7EWN_["><field name="NUM">15</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="u|]X+M1YZnJr?Bb~QeVw"><field name="options">show_full_moon</field></block></statement><next><block type="controls_if" id=".@leJYdNc2lc9vLSzF1|"><value name="IF0"><block type="logic_compare" id=")lVKX8i:_tRD#X@YGd]/"><field name="OP">EQ</field><value name="A"><block type="variables" id="mSkpO=.1je}T-k#WxPa$"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="wqbGWhgZb)Ub$-ix0PG="><field name="NUM">20</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="D/;g%(6iC$$oId~ioShw"><field name="options">show_gibbous_moon</field></block></statement><next><block type="controls_if" id="vhm(noX+y6KvU}@663cN"><value name="IF0"><block type="logic_compare" id="]K_N1`lMB-Ev6qH|:%mq"><field name="OP">EQ</field><value name="A"><block type="variables" id="XM}3KY*e6*xl!X=#/vz5"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="/hE{/{i4DV`MbM}By~G#"><field name="NUM">25</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="QD$L{c1UQ.t)D/(5TEnC"><field name="options">show_first_quarter_moon</field></block></statement><next><block type="controls_if" id="B.;|g-1_,39`sfDRy_2k"><value name="IF0"><block type="logic_compare" id="9eYW|Pak$tx4`=PW%%$$"><field name="OP">EQ</field><value name="A"><block type="variables" id="mX`.PiqC0ne15P!+D0nf"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="dC(dHK~Zj/Q=,e%-*|Lx"><field name="NUM">28</field></block></value></block></value><statement name="DO0"><block type="moon_block" id="n*1aJ#a;eowYvFYp;wM8"><field name="options">show_crescent_moon</field></block></statement><next><block type="controls_if" id="/+.p6Sd0cp*Gs+`,wJH`"><value name="IF0"><block type="logic_compare" id="vN(?hAH`7pro,4=+j=O%"><field name="OP">EQ</field><value name="A"><block type="variables" id="+#og:?J.)a!~c3?{Y}HT"><field name="Options">day</field></block></value><value name="B"><block type="math_number" id="3wQhD8)msO+qbg#fI04_"><field name="NUM">30</field></block></value></block></value><statement name="DO0"><block type="hide_block" id="3m#9tecpi8OFRnEg4}`t"><field name="NAME">hide_moon()</field></block></statement><next><block type="change_variable_holder" id="5uL@UnG9`^6C}_!mjY@?"><field name="Variable name">day</field><value name="NAME"><block type="math_number" id="I{S]#^0kNjq0O7cJqpw}"><field name="NUM">1</field></block></value><next><block type="wait" id="`DRU$mKtmqXBzk.{{kL."><field name="WAIT">Wait for</field><value name="WAIT"><block type="math_number" id="V{EPMH$Xj8@8Ze|vbq^f"><field name="NUM">0.3</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>';

function retrieveCode() {
    var xml = Blockly.Xml.workspaceToDom(demoWorkspace);
    let text = Blockly.Xml.domToText(xml);
    return text;
}

function myUpdateFunction(a) {
    var import_statements = "from no_moon_to_full_moon import *\n";
    var code = import_statements + Blockly.Python.workspaceToCode(demoWorkspace);
    document.getElementById('pycode').innerHTML = code;
    document.getElementById('modal1').innerHTML = code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

async function sleep(secs) {
    if (run_) {
        if (run_) return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, secs * 1000);
        });
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

const updateImports = ["from no_moon_to_full_moon import *"]

const instruction = {
    "heading": "Simulate the look of the moon in 2 months",
    "steps": [
        {
            "checkbox": true,
            "rescue": true,
            "text": "Add repeat 2 times, inside that statements 1",
            "title": "2 Months",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "set day as 0",
            "title": "Statements 1",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "wait for 1 sec",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "Repeat 30 times (30 days), inside that statements 2",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 0, hide Moon",
            "title": "Statements 2",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 3, Show Crescent moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 6, Show First quarter moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 10, Show Gibbous moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 15 Show Full  moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 20, Show Gibbous moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement><next><block type=\"controls_if\" id=\".@leJYdNc2lc9vLSzF1|\"><value name=\"IF0\"><block type=\"logic_compare\" id=\")lVKX8i:_tRD#X@YGd]/\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mSkpO=.1je}T-k#WxPa$\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"wqbGWhgZb)Ub$-ix0PG=\"><field name=\"NUM\">20</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"D/;g%(6iC$$oId~ioShw\"><field name=\"options\">show_gibbous_moon</field></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 25, Show First quarter moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement><next><block type=\"controls_if\" id=\".@leJYdNc2lc9vLSzF1|\"><value name=\"IF0\"><block type=\"logic_compare\" id=\")lVKX8i:_tRD#X@YGd]/\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mSkpO=.1je}T-k#WxPa$\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"wqbGWhgZb)Ub$-ix0PG=\"><field name=\"NUM\">20</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"D/;g%(6iC$$oId~ioShw\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"vhm(noX+y6KvU}@663cN\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]K_N1`lMB-Ev6qH|:%mq\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"XM}3KY*e6*xl!X=#/vz5\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"/hE{/{i4DV`MbM}By~G#\"><field name=\"NUM\">25</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"QD$L{c1UQ.t)D/(5TEnC\"><field name=\"options\">show_first_quarter_moon</field></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 28, Show Crescent moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement><next><block type=\"controls_if\" id=\".@leJYdNc2lc9vLSzF1|\"><value name=\"IF0\"><block type=\"logic_compare\" id=\")lVKX8i:_tRD#X@YGd]/\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mSkpO=.1je}T-k#WxPa$\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"wqbGWhgZb)Ub$-ix0PG=\"><field name=\"NUM\">20</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"D/;g%(6iC$$oId~ioShw\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"vhm(noX+y6KvU}@663cN\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]K_N1`lMB-Ev6qH|:%mq\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"XM}3KY*e6*xl!X=#/vz5\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"/hE{/{i4DV`MbM}By~G#\"><field name=\"NUM\">25</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"QD$L{c1UQ.t)D/(5TEnC\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"B.;|g-1_,39`sfDRy_2k\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"9eYW|Pak$tx4`=PW%%$$\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mX`.PiqC0ne15P!+D0nf\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"dC(dHK~Zj/Q=,e%-*|Lx\"><field name=\"NUM\">28</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"n*1aJ#a;eowYvFYp;wM8\"><field name=\"options\">show_crescent_moon</field></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if day equals 30, Hide Moon",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement><next><block type=\"controls_if\" id=\".@leJYdNc2lc9vLSzF1|\"><value name=\"IF0\"><block type=\"logic_compare\" id=\")lVKX8i:_tRD#X@YGd]/\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mSkpO=.1je}T-k#WxPa$\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"wqbGWhgZb)Ub$-ix0PG=\"><field name=\"NUM\">20</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"D/;g%(6iC$$oId~ioShw\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"vhm(noX+y6KvU}@663cN\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]K_N1`lMB-Ev6qH|:%mq\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"XM}3KY*e6*xl!X=#/vz5\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"/hE{/{i4DV`MbM}By~G#\"><field name=\"NUM\">25</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"QD$L{c1UQ.t)D/(5TEnC\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"B.;|g-1_,39`sfDRy_2k\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"9eYW|Pak$tx4`=PW%%$$\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mX`.PiqC0ne15P!+D0nf\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"dC(dHK~Zj/Q=,e%-*|Lx\"><field name=\"NUM\">28</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"n*1aJ#a;eowYvFYp;wM8\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"/+.p6Sd0cp*Gs+`,wJH`\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"vN(?hAH`7pro,4=+j=O%\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"+#og:?J.)a!~c3?{Y}HT\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"3wQhD8)msO+qbg#fI04_\"><field name=\"NUM\">30</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"3m#9tecpi8OFRnEg4}`t\"><field name=\"NAME\">hide_moon()</field></block></statement></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "change day by 1 (increase)",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement><next><block type=\"controls_if\" id=\".@leJYdNc2lc9vLSzF1|\"><value name=\"IF0\"><block type=\"logic_compare\" id=\")lVKX8i:_tRD#X@YGd]/\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mSkpO=.1je}T-k#WxPa$\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"wqbGWhgZb)Ub$-ix0PG=\"><field name=\"NUM\">20</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"D/;g%(6iC$$oId~ioShw\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"vhm(noX+y6KvU}@663cN\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]K_N1`lMB-Ev6qH|:%mq\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"XM}3KY*e6*xl!X=#/vz5\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"/hE{/{i4DV`MbM}By~G#\"><field name=\"NUM\">25</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"QD$L{c1UQ.t)D/(5TEnC\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"B.;|g-1_,39`sfDRy_2k\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"9eYW|Pak$tx4`=PW%%$$\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mX`.PiqC0ne15P!+D0nf\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"dC(dHK~Zj/Q=,e%-*|Lx\"><field name=\"NUM\">28</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"n*1aJ#a;eowYvFYp;wM8\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"/+.p6Sd0cp*Gs+`,wJH`\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"vN(?hAH`7pro,4=+j=O%\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"+#og:?J.)a!~c3?{Y}HT\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"3wQhD8)msO+qbg#fI04_\"><field name=\"NUM\">30</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"3m#9tecpi8OFRnEg4}`t\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"change_variable_holder\" id=\"5uL@UnG9`^6C}_!mjY@?\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"I{S]#^0kNjq0O7cJqpw}\"><field name=\"NUM\">1</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "wait for 0.3 secs",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"controls_repeat_ext\" id=\"-HEDBHm]H-l,5SHvEU1N\" x=\"173\" y=\"-1676\"><value name=\"TIMES\"><block type=\"math_number\" id=\"/,Ug:.%w8St9w*gf^sDU\"><field name=\"NUM\">2</field></block></value><statement name=\"DO\"><block type=\"variable_holder\" id=\"j;WazlW_^E-fVBUlN3J,\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"HB^H)3j_1R]zuW?EWLi1\"><field name=\"NUM\">0</field></block></value><next><block type=\"wait\" id=\"bD{NQ7@gLC_,pEqa|9;N\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"^9A6K+j2a@+`+Nwp?x0F\"><field name=\"NUM\">1</field></block></value><next><block type=\"controls_repeat_ext\" id=\"D)Zs9fRp.cK#K:e{T($0\"><value name=\"TIMES\"><block type=\"math_number\" id=\"],qLO%S02{C2XeoMhi5r\"><field name=\"NUM\">30</field></block></value><statement name=\"DO\"><block type=\"controls_if\" id=\"(5mAGpv|9N]WnRVTWQYT\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"Tlyu=:}txzb#A_n.:`oM\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"G:E,6D#k=]djEn-xW;j8\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"gpt~162@Y*k!uR0Z:f@p\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"A@HO3sD5cG3.`E;G]X+T\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"controls_if\" id=\"bb{WRb-PZOy`s6nxCGqG\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"EL=?jaAEaDfVmchMH{g.\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"?V^i|}dq8gH*jVy7a6W)\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"+Ye34imvF)E5)I^gk~B|\"><field name=\"NUM\">3</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|T}TVC_,_-E||~6^!(!\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"IHy:Gw1$k.y!-P}R[hF}\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"yB*TNt*5{,o4Uco=;P$-\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"zF=JWe^%OAo|u}uTp9a:\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"17s^]kXzgsN;{mB?KiY-\"><field name=\"NUM\">6</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"Y}Q[87^0:Anwd@Q~[Jlb\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"V|{9F~d:1s%L-d`jdUwm\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"c*R,kdPkFBpdvdZUO)Q2\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"day_block\" id=\"n.?=O2__-9_cY8kIoKiI\"></block></value><value name=\"B\"><block type=\"math_number\" id=\"DiVe;laV-k9p(.Smak)@\"><field name=\"NUM\">10</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"kSZh!zYKs!YJYnl{L5V2\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"5djW[KQLbjfLlU.t}1.r\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"gQ|2m`gMVQFwJzG[?Ou{\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"Cz*Nf]cAIa[33WYV1UCB\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"]p3}oR8lJ_jLe@7EWN_[\"><field name=\"NUM\">15</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"u|]X+M1YZnJr?Bb~QeVw\"><field name=\"options\">show_full_moon</field></block></statement><next><block type=\"controls_if\" id=\".@leJYdNc2lc9vLSzF1|\"><value name=\"IF0\"><block type=\"logic_compare\" id=\")lVKX8i:_tRD#X@YGd]/\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mSkpO=.1je}T-k#WxPa$\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"wqbGWhgZb)Ub$-ix0PG=\"><field name=\"NUM\">20</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"D/;g%(6iC$$oId~ioShw\"><field name=\"options\">show_gibbous_moon</field></block></statement><next><block type=\"controls_if\" id=\"vhm(noX+y6KvU}@663cN\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"]K_N1`lMB-Ev6qH|:%mq\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"XM}3KY*e6*xl!X=#/vz5\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"/hE{/{i4DV`MbM}By~G#\"><field name=\"NUM\">25</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"QD$L{c1UQ.t)D/(5TEnC\"><field name=\"options\">show_first_quarter_moon</field></block></statement><next><block type=\"controls_if\" id=\"B.;|g-1_,39`sfDRy_2k\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"9eYW|Pak$tx4`=PW%%$$\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"mX`.PiqC0ne15P!+D0nf\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"dC(dHK~Zj/Q=,e%-*|Lx\"><field name=\"NUM\">28</field></block></value></block></value><statement name=\"DO0\"><block type=\"moon_block\" id=\"n*1aJ#a;eowYvFYp;wM8\"><field name=\"options\">show_crescent_moon</field></block></statement><next><block type=\"controls_if\" id=\"/+.p6Sd0cp*Gs+`,wJH`\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"vN(?hAH`7pro,4=+j=O%\"><field name=\"OP\">EQ</field><value name=\"A\"><block type=\"variables\" id=\"+#og:?J.)a!~c3?{Y}HT\"><field name=\"Options\">day</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"3wQhD8)msO+qbg#fI04_\"><field name=\"NUM\">30</field></block></value></block></value><statement name=\"DO0\"><block type=\"hide_block\" id=\"3m#9tecpi8OFRnEg4}`t\"><field name=\"NAME\">hide_moon()</field></block></statement><next><block type=\"change_variable_holder\" id=\"5uL@UnG9`^6C}_!mjY@?\"><field name=\"Variable name\">day</field><value name=\"NAME\"><block type=\"math_number\" id=\"I{S]#^0kNjq0O7cJqpw}\"><field name=\"NUM\">1</field></block></value><next><block type=\"wait\" id=\"`DRU$mKtmqXBzk.{{kL.\"><field name=\"WAIT\">Wait for</field><value name=\"WAIT\"><block type=\"math_number\" id=\"V{EPMH$Xj8@8Ze|vbq^f\"><field name=\"NUM\">0.3</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></statement></block></xml>"
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
    reInitValues,
    sleep,
    default_,
    day,
    hide_moon,
    show_crescent_moon,
    show_first_quarter_moon,
    show_gibbous_moon,
    show_full_moon,
    Day,
    getNoOfBlocks,
    updateImports
}