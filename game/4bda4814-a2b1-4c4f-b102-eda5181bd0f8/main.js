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
    SOUND_CONSTANT
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
let bg = null;
let item = null;
let bunny = null;
let player_visit_history = [];
let jumpSfx = null;
let collectSfx = null;
let winSfx = null;
let loseSfx = null;
let wrongSfx = null;
let run_ = true;

// Phaser config
const config = {
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

        this.load.audio(key, item.urls);
    }
}

// Phaser create function
function create() {
    // add background
    this.add.image(gameWidth * 0.5, gameHeight * 0.5, GAME_CONSTANT.bg.name);

    bunny = this.add.sprite(gameWidth * 0.09, gameHeight * 0.7, GAME_CONSTANT.bunny.name);
    for (const key in GAME_CONSTANT.bunny.anims) {
        let anim = GAME_CONSTANT.bunny.anims[key];
        bunny.anims.create({
            key: key,
            frames: this.anims.generateFrameNumbers(GAME_CONSTANT.bunny.name, { start: anim.start, end: anim.end }),
            frameRate: GAME_CONSTANT.bunny.frameRate,
            repeat: anim.repeat
        });
    }
    bunny.anims.play('idle');

    item = this.add.image(gameWidth * 0.87, gameHeight * 0.78, GAME_CONSTANT.item.name);
    item.setScale(0.1, 0.1);

    item.floatTween = this.add.tween({
        targets: item,
        duration: 700,
        paused: true,
        y: gameHeight * 0.74,
        ease: Phaser.Math.Easing.Quadratic.InOut,
        yoyo: true,
        repeat: -1
    });

    item.eatTween = this.add.tween({
        targets: item,
        duration: 500,
        paused: true,
        scaleX: 0.3,
        scaleY: 0.3,
        alpha: 0,
        onComplete: function () {
            item.visible = false;
        }
    });

    item.floatTween.play();

    // add sound effects
    jumpSfx = this.sound.add("jump", { loop: false });
    collectSfx = this.sound.add("collect", { loop: false });
    winSfx = this.sound.add("win", { loop: false });
    loseSfx = this.sound.add("lose", { loop: false });
    wrongSfx = this.sound.add("wrong", { loop: false });

    init();
}

// Initialize animation functions
function init() {
    // await sleep(1000);
}

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    run_ = false;
    player_visit_history = [];

    item.visible = true;
    item.setScale(0.1, 0.1);

    bunny.anims.play('idle');
    if (bunny.timeline1 && bunny.timeline1.isPlaying()) bunny.timeline1.stop();
    if (bunny.timeline2 && bunny.timeline2.isPlaying()) bunny.timeline2.stop();

}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

// validate code blocks
function evaluate_task() {
    if (player_visit_history[player_visit_history.length - 1] == "home") {
        if (!item.visible) {
            if (Blockly.getMainWorkspace().getAllBlocks(false).length > 3) {
                M.toast({
                    html: "Task complete, good try! However we can do it more efficiently using not more than 3 blocks. Try again!"
                });
            } else {
                M.toast({
                    html: "Nice, Well Done!"
                });
            }
            isStageCompleted = true;
            winSfx.play();
        } else {
            M.toast({
                html: "Oops, Poor bunny has forgotten to eat the carrot! Instruct him to do so."
            });

            loseSfx.play();
        }
    }
}

function checkDestination() {
    if (bunny.x == 72) {
        player_visit_history.push("home");
    } else if (bunny.x == 672) {
        player_visit_history.push("factory");
    } else {
        player_visit_history.push("extra_block");
    }

    evaluate_task();
}

// move left
function right(distance) {

    if (run_) return new Promise((resolve, reject) => {
        if (run_) {
            let jumpDistance = 100;

            if (bunny.x + distance * jumpDistance > gameWidth * 0.09 + jumpDistance * 6) {
                M.toast({ html: "End of screen!" });
                wrongSfx.play();
                return;
            }

            bunny.timeline1 = _gameThis.scene.scene.tweens.createTimeline();

            for (let i = 0; i < distance; i++) {
                bunny.timeline1.add({
                    targets: bunny,
                    duration: 500,
                    x: bunny.x + jumpDistance * (i + 1),
                    ease: Phaser.Math.Easing.Quadratic.In,
                    delay: 200,
                    onStart: function () {
                        bunny.anims.play('moveRight');

                        bunny.timeline2 = _gameThis.scene.scene.tweens.createTimeline();

                        bunny.timeline2.add({
                            targets: bunny,
                            duration: 250,
                            y: gameHeight * 0.65,
                            ease: Phaser.Math.Easing.Quadratic.In
                        });

                        bunny.timeline2.add({
                            targets: bunny,
                            duration: 250,
                            y: gameHeight * 0.7,
                            ease: Phaser.Math.Easing.Quadratic.Out
                        });

                        bunny.timeline2.play();
                        jumpSfx.play();
                    }
                })
            }

            bunny.timeline1.on('complete', function () {
                checkDestination();
                resolve();
            });
            bunny.timeline1.play();
        }
    });
}

// move left
async function left(distance) {
    if (run_) return new Promise((resolve, reject) => {
        if (run_) {
            let jumpDistance = 100;

            if (bunny.x - distance * jumpDistance < gameWidth * 0.09) {
                M.toast({ html: "End of screen!" });
                wrongSfx.play();
                return;
            }

            bunny.timeline1 = _gameThis.scene.scene.tweens.createTimeline();

            for (let i = 0; i < distance; i++) {
                bunny.timeline1.add({
                    targets: bunny,
                    duration: 500,
                    x: bunny.x - jumpDistance * (i + 1),
                    ease: Phaser.Math.Easing.Quadratic.In,
                    delay: 200,
                    onStart: function () {
                        bunny.anims.play('moveLeft');

                        bunny.timeline2 = _gameThis.scene.scene.tweens.createTimeline();

                        bunny.timeline2.add({
                            targets: bunny,
                            duration: 250,
                            y: gameHeight * 0.65,
                            ease: Phaser.Math.Easing.Quadratic.In
                        });

                        bunny.timeline2.add({
                            targets: bunny,
                            duration: 250,
                            y: gameHeight * 0.7,
                            ease: Phaser.Math.Easing.Quadratic.Out
                        });

                        bunny.timeline2.play();
                        jumpSfx.play();
                    }
                })
            }

            bunny.timeline1.on('complete', function () {
                checkDestination();
                resolve();
            });
            bunny.timeline1.play();
        }
    });
}

async function eat_carrot() {
    if (run_) return new Promise((resolve, reject) => {
        if (run_) {
            if (bunny.x == 672) {
                if (item.visible) {
                    item.eatTween.play();
                    collectSfx.play();
                } else {
                    M.toast({ html: "Carrot is already Eaten!" })
                    wrongSfx.play();
                }
            } else {
                M.toast({ html: "Carrot is not in Bunny's reach!" })
                wrongSfx.play();
            }

            resolve();
        }
    });
}

async function test() {
    await right(6);
    await eat_carrot();
    await left(6);
}

function runCode() {
    // tour_over && tour.complete();
    run_ = true;
    reset_output();
    reInitValues();
    setTimeout(() => {
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
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

function completedFlag() {
    return isStageCompleted;
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import bunny"]

export {
    reset_output,
    sleep,
    evaluate_task,
    eat_carrot,
    left,
    right,
    completedFlag,
    runCode,
    getNoOfBlocks,
    updateImports
};