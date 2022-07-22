/* Developed by Marvsoft LLP */

import { CANVAS, Game, AUTO } from "phaser";
import M from 'materialize-css'
import {
    _gameThis,
    baseURL,
    gameWidth,
    gameHeight,
    gameScale,
    muteSound
} from "./config";
import {
    GAME_CONSTANT,
    ERROR_MESSAGE,
    CORRECT_MESSAGE,
    ANIMAL_NAME,
    SHELTER_NAME,
    CORRECT_COMBINATION,
    SOUND_CONSTANT,
} from "./constant";
import MSPhaserLib from "../msPhaserLib.min";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";


let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let hasWrongSelection = false;
let _oMSPhaserLib;
let isStageCompleted = false;
let lesson_complete = false;
let bg = null;

let targetItem = null;
let targetTrash = null;

let bgm = null;
let player_history = null;
let hasWrongMessage = null;
let sleepEvent = null;
let robotCont = null;
let layerObj = null;

let walkSfx = null;
let winSfx = null;
let loseSfx = null;
let correctSfx = null;
let wrongSfx = null;
let pickupSfx = null;
let robot;

let itemTypes = [
    "leaf",
    "cup",
    "screw",
    "spects",
    "candy",
    "watermelon"
]

let trashTypes = [
    "wet",
    "dry"
]

let items = {
    leaf: null,
    cup: null,
    screw: null,
    spects: null,
    candy: null,
    watermelon: null
}

let trashes = {
    wet: null,
    dry: null
}

// Phaser config
const config = {
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
        create: create
    },
};

// Initialize Phaser with config
const game = new Phaser.Game(config);

// Phaser preload function
function preload() {
    _gameThis = this;

    _gameThis.sound.mute = muteSound;

    this.load.setBaseURL(baseURL);

    _oMSPhaserLib = new MSPhaserLib(this, true, 100);

    for (const key in GAME_CONSTANT) {
        let item = GAME_CONSTANT[key];
        switch (item.type) {
            case 'img':
                this.load.image(item.name, item.src);
                break;
            case 'spritesheet':
                this.load.spritesheet(item.name, item.src, { frameWidth: item.frameWidth, frameHeight: item.frameHeight });
                break;
        }
    }

    for (const key in SOUND_CONSTANT) {
        let item = SOUND_CONSTANT[key];

        this.load.audio(key, item.urls, { instances: 1 });
    }
}

// Phaser create function
function create() {
    // add background
    this.add.image(gameWidth * 0.5, gameHeight * 0.5, GAME_CONSTANT.bg.name);

    robot = this.add.sprite(0, 0, GAME_CONSTANT.robot.name);
    for (const key in GAME_CONSTANT.robot.anims) {
        let anim = GAME_CONSTANT.robot.anims[key];

        robot.anims.create({
            key: key,
            frames: anim.frames != null ? this.anims.generateFrameNumbers(GAME_CONSTANT.robot.name, { frames: anim.frames }) : this.anims.generateFrameNumbers(GAME_CONSTANT.robot.name, { start: anim.start, end: anim.end }),
            frameRate: GAME_CONSTANT.robot.frameRate,
            repeat: anim.repeat
        });
    }

    layerObj = this.add.layer();

    robot.setScale(2.5, 2.5);
    robot.anims.play('idle');

    robotCont = layerObj.add(this.add.container(gameWidth * 0.5, gameHeight * 0.5, [robot]));
    robotCont.setDepth(robotCont.y);

    items.leaf = createItem(gameWidth * 0.18, gameHeight * 0.68, GAME_CONSTANT.leaf.name, "wet");
    items.cup = createItem(gameWidth * 0.3, gameHeight * 0.57, GAME_CONSTANT.cup.name, "dry");
    items.screw = createItem(gameWidth * 0.4, gameHeight * 0.72, GAME_CONSTANT.screw.name, "dry");
    items.spects = createItem(gameWidth * 0.55, gameHeight * 0.6, GAME_CONSTANT.spects.name, "dry");
    items.candy = createItem(gameWidth * 0.7, gameHeight * 0.65, GAME_CONSTANT.candy.name, "wet");
    items.watermelon = createItem(gameWidth * 0.85, gameHeight * 0.7, GAME_CONSTANT.watermelon.name, "wet");

    trashes.dry = layerObj.add(this.add.image(gameWidth * 0 + 140, gameHeight * 1 - 150, GAME_CONSTANT.dry.name));
    trashes.dry.setScale(0.65, 0.65);
    trashes.dry.setDepth(trashes.dry.y + 1000);

    trashes.wet = layerObj.add(this.add.image(gameWidth * 1 - 140, trashes.dry.y, GAME_CONSTANT.wet.name));
    trashes.wet.setScale(0.65, 0.65);
    trashes.wet.setDepth(trashes.wet.y + 1000);

    // robotCont.bringToTop(image2);

    // add sound effects
    walkSfx = this.sound.add("walk", { loop: true, volume: 0.1 });
    winSfx = this.sound.add("win", { loop: false });
    loseSfx = this.sound.add("lose", { loop: false });
    correctSfx = this.sound.add("correct", { loop: false });
    wrongSfx = this.sound.add("wrong", { loop: false });
    pickupSfx = this.sound.add("pickup", { loop: false });

    init();
}

function createItem(x, y, texture, correctType) {
    let item = layerObj.add(_gameThis.scene.scene.add.image(x, y, texture));
    item.setScale(1.5, 1.5);
    item.available = true;
    item.origPos = { x: x, y: y };
    item.setDepth(y);
    item.trashType = "none";
    item.correctType = correctType;

    return item;
}

// Initialize animation functions
function init() {
    // await sleep(1000);

}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    return new Promise((resolve, reject) => {
        sleepEvent = _gameThis.scene.scene.time.delayedCall(ms, function () {
            resolve();
        });
    });
}

// Re-initialize the game variables
function reInitValues() {
    // TODO: Re-initialize the game variables here for reset

    player_history = [];
    isStageCompleted = false;
    hasWrongMessage = false;
    lesson_complete = false;

    _gameThis.scene.scene.tweens.killAll();

    let allSprites = _gameThis.scene.scene.children.list.filter(x => x instanceof Phaser.GameObjects.Sprite);
    allSprites.forEach(x => x.destroy());

    let allImages = _gameThis.scene.scene.children.list.filter(x => x instanceof Phaser.GameObjects.Image);
    allImages.forEach(x => x.destroy());
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

// validate code blocks
function evaluate_task() {
    var c = 0;
    if (items.leaf.trashType == 'dry') {
        M.toast({ html: "Leaf is not a Dry type" });
        c++;
    }
    if (items.cup.trashType == 'wet') {
        M.toast({ html: "Plastic Cup is not a Wet type" });
        c++;
    }
    if (items.screw.trashType == 'wet') {
        M.toast({ html: "Screw is not a Wet type" });
        c++;
    }
    if (items.spects.trashType == 'wet') {
        M.toast({ html: "Spectacles is not a Wet type" });
        c++;
    }
    if (items.candy.trashType == 'dry') {
        M.toast({ html: "Toffee is not a Dry type" });
        c++;
    }
    if (items.watermelon.trashType == 'dry') {
        M.toast({ html: "Water Melon is not a Dry type" });
        c++;
    }

    if (items.leaf.trashType == 'none') {
        M.toast({ html: "Leaf was not cleared" });
        c++;
    }
    if (items.cup.trashType == 'none') {
        M.toast({ html: "Plastic Cup was not cleared" });
        c++;
    }
    if (items.screw.trashType == 'none') {
        M.toast({ html: "Screw was not cleared" });
        c++;
    }
    if (items.spects.trashType == 'none') {
        M.toast({ html: "Spectacles was not cleared" });
        c++;
    }
    if (items.candy.trashType == 'none') {
        M.toast({ html: "Toffee was not cleared" });
        c++;
    }
    if (items.watermelon.trashType == 'none') {
        M.toast({ html: "Water Melon was not cleared" });
        c++;
    }

    if (c == 0) {
        lesson_complete = true;
        M.toast({ html: "Wow, You've cleaned the beach very well" });
        winSfx.play();
    } else {
        loseSfx.play();
    }
}

function drop(item, trash, timeline) {
    timeline.add({
        targets: item,
        duration: 300,
        x: trash.x,
        y: trash.y - trash.height * 0.5,
        ease: Phaser.Math.Easing.Quadratic.Out,
        onStart: function () {
            robotCont.remove(item);
            item.x = robotCont.x;
            item.y = robotCont.y - 120;
            layerObj.addAt(item, layerObj.getChildren().indexOf(trashes.dry) - 1);
            robot.anims.play(trash.x > robotCont.x ? 'itemRight' : 'itemLeft');
        },
        onComplete: function () {
            if (item.trashType == item.correctType) {
                correctSfx.play();
            } else {
                wrongSfx.play();
            }

        }
    })

    timeline.add({
        targets: item,
        duration: 300,
        x: trash.x,
        y: trash.y,
        scaleX: 0.1,
        scaleY: 0.1,
        ease: Phaser.Math.Easing.Quadratic.In,
        onComplete: function () {
            robot.anims.play('idle');
        }
    });
}

function pickup(item, timeline) {
    timeline.add({
        targets: item,
        duration: 100,
        x: item.x,
        y: item.y,
        ease: Phaser.Math.Easing.Quadratic.In,
        onComplete: function () {
            robotCont.add(item);
            item.x = 0;
            item.y = -120;
            pickupSfx.play();
        }
    });
}

function move_item(item, timeline) {

    let distX = Math.abs(robotCont.x - item.x);
    let distY = Math.abs(robotCont.y - item.y);
    let maxMs = 5000;

    timeline.add({
        targets: robotCont,
        duration: maxMs * distX / gameWidth,
        x: item.x + (item.x > robotCont.x ? (-10) : (10)),
        ease: Phaser.Math.Easing.Quadratic.Out,
        onStart: function () {
            robot.anims.play(item.x > robotCont.x ? 'right' : 'left');
            walkSfx.play();
        },
        onUpdate: function () {
            robotCont.setDepth(robotCont.y);
        }
    })

    timeline.add({
        targets: robotCont,
        duration: maxMs * 0.5 * distY / (gameHeight),
        y: item.y + (item.y > robotCont.y ? (-robot.height * 0.5) : (robot.height * 0.2)),
        ease: Phaser.Math.Easing.Quadratic.Out,
        onStart: function () {
            robot.anims.play(item.y > robotCont.y ? 'down' : 'up');
        },
        onComplete: function () {
            robot.anims.play(item.y > robotCont.y ? 'itemDown' : 'itemUp');
        },
        onUpdate: function () {
            robotCont.setDepth(robotCont.y);
            walkSfx.stop();
        }
    })
}

function move_trash(item, trash, timeline) {

    let distX = Math.abs(item.origPos.x - trash.x);
    let distY = Math.abs(item.origPos.y - trash.y);
    let maxMs = 5000;

    timeline.add({
        targets: robotCont,
        duration: maxMs * 0.5 * distY / (gameHeight),
        delay: 1000,
        y: trash.y + (trash.y > item.origPos.y ? (-robot.height * 0.8) : (robot.height * 0.2)),
        ease: Phaser.Math.Easing.Quadratic.Out,
        onStart: function () {
            robot.anims.play(item.origPos.y > trash.y ? 'up' : 'down');
            walkSfx.play();
        },
        onUpdate: function () {
            robotCont.setDepth(robotCont.y);
        }
    })

    timeline.add({
        targets: robotCont,
        duration: maxMs * distX / gameWidth,
        x: trash.x + (trash.x > item.origPos.x ? (-200) : (200)),
        ease: Phaser.Math.Easing.Quadratic.Out,
        onStart: function () {
            robot.anims.play(item.origPos.x > trash.x ? 'left' : 'right');
        },
        onComplete: function () {
            robot.anims.play(item.origPos.x > trash.x ? 'itemLeft' : 'itemRight');
            walkSfx.stop();
        },
        onUpdate: function () {
            robotCont.setDepth(robotCont.y);
        }
    })
}

function go_back_to_center() {
    return new Promise((resolve, reject) => {
        let distX = Math.abs(robotCont.x - gameWidth * 0.5);
        let distY = Math.abs(robotCont.y - gameHeight * 0.5);
        let maxMs = 5000;

        robot.timeline2 = _gameThis.scene.scene.tweens.createTimeline();

        robot.timeline2.add({
            targets: robotCont,
            duration: maxMs * distX / gameWidth,
            x: gameWidth * 0.5,
            ease: Phaser.Math.Easing.Quadratic.Out,
            onStart: function () {
                robot.anims.play(gameWidth * 0.5 > robotCont.x ? 'right' : 'left');
                walkSfx.play();
            },
            onUpdate: function () {
                robotCont.setDepth(robotCont.y);
            }
        });

        robot.timeline2.add({
            targets: robotCont,
            duration: maxMs * 0.5 * distY / (gameHeight),
            y: gameHeight * 0.5,
            ease: Phaser.Math.Easing.Quadratic.Out,
            onStart: function () {
                robot.anims.play(gameHeight * 0.5 > robotCont.y ? 'down' : 'up');
                walkSfx.play();
            },
            onComplete: function () {
                if (lesson_complete) {
                    robot.anims.play('celebrate');
                } else {
                    robot.anims.play('idle');
                }

                walkSfx.stop();
                resolve();
            },
            onUpdate: function () {
                robotCont.setDepth(robotCont.y);
            }
        })

        robot.timeline2.play();
    });
}

function move_robot(itemType, trashType) {
    return new Promise((resolve, reject) => {
        if (itemTypes.indexOf(itemType) > -1 &&
            trashTypes.indexOf(trashType) > -1) {
            // valid command

            let item = getItem(itemType);
            let trash = getTrash(trashType);

            if (item.available) {
                item.available = false;
                item.trashType = trashType;

                robot.timeline = _gameThis.scene.scene.tweens.createTimeline();
                move_item(item, robot.timeline);
                pickup(item, robot.timeline);
                move_trash(item, trash, robot.timeline);
                drop(item, trash, robot.timeline);

                robot.timeline.on('complete', function () {
                    console.log('resolved')
                    resolve();
                });

                robot.timeline.play();
            } else {
                M.toast({ html: itemType + " has already been thrown." });
            }
        }
    });
}

function getItem(itemType) {
    return items[itemType];
}

function getTrash(trashType) {
    return trashes[trashType];
}

async function test() {
    await move_robot("leaf", "wet");
    await move_robot("cup", "dry");
    await move_robot("screw", "dry");
    await move_robot("spects", "dry");
    await move_robot("candy", "wet");
    await move_robot("watermelon", "wet");
    await evaluate_task();
    await go_back_to_center();
}


function completedFlag() {
    return lesson_complete;
}


function runCode() {
    // tour_over && tour.complete();
    let run_ = true;
    reset_output();
    reInitValues();
    setTimeout(() => {
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + " await evaluate_task();await go_back_to_center();} c();";
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


function helpCode() { $('#help_practice').modal('open'); }

// function myUpdateFunction(a) {
//     var code = Blockly.Python.workspaceToCode(demoWorkspace);
//     var import_statement = "from beach.robot import move_trash\n";
//     document.getElementById('pycode').innerHTML = import_statement + code;
//     document.getElementById('modal1').innerHTML = import_statement + code;
// }
// demoWorkspace.addChangeListener(myUpdateFunction);

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from beach.robot import move_trash\n"];

const instruction = {
    heading: `Let's clean the beach by programming our robot to move the right waste in the right bin`,
    steps: [
        {
            title: `Program to move each trash to the right bin by selecting dry or wet waste`,
            text: `Move leaf to trashcan`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="trash" id="GB..plytX^B5ox+:=./{" x="33" y="139"><field name="trash">leaf</field><value name="NAME"><block type="move_trash" id="p9M`y*wvC{hDyeTBZ$[6"><field name="trash_can">wet</field></block></value></block></xml>',
        },
        {
            text: `Move plastic cup to trashcan`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="trash" id="GB..plytX^B5ox+:=./{" x="33" y="139"><field name="trash">leaf</field><value name="NAME"><block type="move_trash" id="p9M`y*wvC{hDyeTBZ$[6"><field name="trash_can">wet</field></block></value><next><block type="trash" id="ET#0,oV$j0ivvxHG$^3Y"><field name="trash">cup</field><value name="NAME"><block type="move_trash" id="S*P?KUKO|-Lk=vF5g!^7"><field name="trash_can">dry</field></block></value></block></next></block></xml>',
        },
        {
            text: `Move screw to trashcan`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="trash" id="GB..plytX^B5ox+:=./{" x="33" y="139"><field name="trash">leaf</field><value name="NAME"><block type="move_trash" id="p9M`y*wvC{hDyeTBZ$[6"><field name="trash_can">wet</field></block></value><next><block type="trash" id="ET#0,oV$j0ivvxHG$^3Y"><field name="trash">cup</field><value name="NAME"><block type="move_trash" id="S*P?KUKO|-Lk=vF5g!^7"><field name="trash_can">dry</field></block></value><next><block type="trash" id="4~s,r82Y.m@*3XMw4dQ9"><field name="trash">screw</field><value name="NAME"><block type="move_trash" id="~,;hvxoT12l9/?quk8}O"><field name="trash_can">dry</field></block></value></block></next></block></next></block></xml>',
        },
        {
            text: `Move spectacles to trashcan`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="trash" id="GB..plytX^B5ox+:=./{" x="33" y="139"><field name="trash">leaf</field><value name="NAME"><block type="move_trash" id="p9M`y*wvC{hDyeTBZ$[6"><field name="trash_can">wet</field></block></value><next><block type="trash" id="ET#0,oV$j0ivvxHG$^3Y"><field name="trash">cup</field><value name="NAME"><block type="move_trash" id="S*P?KUKO|-Lk=vF5g!^7"><field name="trash_can">dry</field></block></value><next><block type="trash" id="4~s,r82Y.m@*3XMw4dQ9"><field name="trash">screw</field><value name="NAME"><block type="move_trash" id="~,;hvxoT12l9/?quk8}O"><field name="trash_can">dry</field></block></value><next><block type="trash" id="D;dtyK)/kPg8^EVN_q~*"><field name="trash">spects</field><value name="NAME"><block type="move_trash" id="iIT$XR7epI(+4rIt2Qg6"><field name="trash_can">dry</field></block></value></block></next></block></next></block></next></block></xml>',
        },
        {
            text: `Move toffee to trashcan`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="trash" id="GB..plytX^B5ox+:=./{" x="33" y="139"><field name="trash">leaf</field><value name="NAME"><block type="move_trash" id="p9M`y*wvC{hDyeTBZ$[6"><field name="trash_can">wet</field></block></value><next><block type="trash" id="ET#0,oV$j0ivvxHG$^3Y"><field name="trash">cup</field><value name="NAME"><block type="move_trash" id="S*P?KUKO|-Lk=vF5g!^7"><field name="trash_can">dry</field></block></value><next><block type="trash" id="4~s,r82Y.m@*3XMw4dQ9"><field name="trash">screw</field><value name="NAME"><block type="move_trash" id="~,;hvxoT12l9/?quk8}O"><field name="trash_can">dry</field></block></value><next><block type="trash" id="D;dtyK)/kPg8^EVN_q~*"><field name="trash">spects</field><value name="NAME"><block type="move_trash" id="iIT$XR7epI(+4rIt2Qg6"><field name="trash_can">dry</field></block></value><next><block type="trash" id="YZb5!(f]Y)bw!.$NiITO"><field name="trash">candy</field><value name="NAME"><block type="move_trash" id="6=W=Tksns}Eeq_xW7ng:"><field name="trash_can">wet</field></block></value></block></next></block></next></block></next></block></next></block></xml>',
        },
        {
            text: `Move watermelon to trashcan`,
            rescue: true,
            checkbox: true,
            workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="trash" id="GB..plytX^B5ox+:=./{" x="33" y="139"><field name="trash">leaf</field><value name="NAME"><block type="move_trash" id="p9M`y*wvC{hDyeTBZ$[6"><field name="trash_can">wet</field></block></value><next><block type="trash" id="ET#0,oV$j0ivvxHG$^3Y"><field name="trash">cup</field><value name="NAME"><block type="move_trash" id="S*P?KUKO|-Lk=vF5g!^7"><field name="trash_can">dry</field></block></value><next><block type="trash" id="4~s,r82Y.m@*3XMw4dQ9"><field name="trash">screw</field><value name="NAME"><block type="move_trash" id="~,;hvxoT12l9/?quk8}O"><field name="trash_can">dry</field></block></value><next><block type="trash" id="D;dtyK)/kPg8^EVN_q~*"><field name="trash">spects</field><value name="NAME"><block type="move_trash" id="iIT$XR7epI(+4rIt2Qg6"><field name="trash_can">dry</field></block></value><next><block type="trash" id="YZb5!(f]Y)bw!.$NiITO"><field name="trash">candy</field><value name="NAME"><block type="move_trash" id="6=W=Tksns}Eeq_xW7ng:"><field name="trash_can">wet</field></block></value><next><block type="trash" id=":+!|FKOUf-O*`;X.Eu(g"><field name="trash">watermelon</field><value name="NAME"><block type="move_trash" id="5sI6YBczn`U9CdSTxQIT"><field name="trash_can">wet</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>',
        }
    ]
}

export {
    reset_output,
    sleep,
    move_robot,
    completedFlag,
    getNoOfBlocks,
    updateImports,
    instruction,
    runCode
};