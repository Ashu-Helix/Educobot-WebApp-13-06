/* Developed by Marvsoft LLP */
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { Math, Game, AUTO } from "phaser";
import M from "materialize-css";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const mouseSpeed = 250;

const magicElement = {
    mouseUpDown: {
        x: 100,
        y: 100,
        stay: 0,
        frameWidth: 24,
        frameHeight: 38,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
    },
    mouseLeftRight: {
        x: 100,
        y: 100,
        stay: 0,
        frameWidth: 38,
        frameHeight: 24,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
    },

    leftArrowSprite: {
        x: 1690,
        y: 975,
        stay: 3,
        frameWidth: 206,
        frameHeight: 217,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
    rightArrowSprite: {
        x: 1865,
        y: 975,
        stay: 3,
        frameWidth: 212,
        frameHeight: 217,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
    upArrowSprite: {
        x: 1780,
        y: 885,
        stay: 3,
        frameWidth: 210,
        frameHeight: 213,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
    downArrowSprite: {
        x: 1780,
        y: 975,
        stay: 3,
        frameWidth: 203,
        frameHeight: 225,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
};

const mouseMovement = {
    left: { frameStart: 0, frameEnd: 2, state: 0 },
    right: { frameStart: 3, frameEnd: 5, state: 3 },
    up: { frameStart: 3, frameEnd: 5, state: 3 },
    down: { frameStart: 0, frameEnd: 2, state: 0 },
};

const mazeLines = [
    { x: 315, y: 40, scaleX: 128, scaleY: 2 },
    { x: 439, y: 132, scaleX: 103.5, scaleY: 2 },
    { x: 573, y: 235, scaleX: 76.5, scaleY: 2 },
    { x: 706, y: 335, scaleX: 49.9, scaleY: 2 },
    { x: 815, y: 437, scaleX: 27, scaleY: 2 },
    { x: 572, y: 565, scaleX: 25, scaleY: 2 },
    { x: 314, y: 655, scaleX: 14.5, scaleY: 2 },
    { x: 707, y: 700, scaleX: 13, scaleY: 2 },
    { x: 959, y: 698, scaleX: 24.2, scaleY: 2 },
    { x: 318, y: 765, scaleX: 26, scaleY: 2 },
    { x: 718, y: 800, scaleX: 33, scaleY: 2 },
    { x: 1188, y: 800, scaleX: 15, scaleY: 2 },
    { x: 439, y: 902, scaleX: 42, scaleY: 2 },
    { x: 976, y: 904, scaleX: 49.8, scaleY: 2 },
    { x: 318, y: 995, scaleX: 127.8, scaleY: 2 },

    { x: 315, y: 51, scaleX: 2, scaleY: 61 },
    { x: 1575, y: 48, scaleX: 2, scaleY: 14 },
    { x: 439, y: 140, scaleX: 2, scaleY: 52 },
    { x: 1455, y: 148, scaleX: 2, scaleY: 76 },
    { x: 572, y: 244, scaleX: 2, scaleY: 57 },
    { x: 1321, y: 238, scaleX: 2, scaleY: 58 },
    { x: 705, y: 348, scaleX: 2, scaleY: 12 },
    { x: 1185, y: 344, scaleX: 2, scaleY: 37 },
    { x: 812, y: 438, scaleX: 2, scaleY: 20 },
    { x: 1080, y: 438, scaleX: 2, scaleY: 20 },
    { x: 705, y: 579, scaleX: 2, scaleY: 13 },
    { x: 957, y: 624, scaleX: 2, scaleY: 9 },
    { x: 1040, y: 702, scaleX: 2, scaleY: 22 },
    { x: 318, y: 771, scaleX: 2, scaleY: 24 },
    { x: 438, y: 771, scaleX: 2, scaleY: 13 },
    { x: 1575, y: 282, scaleX: 2, scaleY: 72 },
];

const arrowKeysConst = {
    left: { x: 1650, y: 930, w: 80, h: 80, c: 0xff0000, a: 0 },
    right: { x: 1825, y: 930, w: 80, h: 80, c: 0xff0000, a: 0 },
    up: { x: 1740, y: 840, w: 80, h: 80, c: 0xff0000, a: 0 },
    down: { x: 1740, y: 930, w: 80, h: 80, c: 0xff0000, a: 0 },
};

const GAME_CONSTANT = {
    images: {
        cheeseHuntBg: "cheeseHuntBg",
    },
    spritesImages: {
        mouseLeftRight: "mouseLeftRight",
        mouseUpDown: "mouseUpDown",
        leftArrowSprite: "leftArrowSprite",
        rightArrowSprite: "rightArrowSprite",
        upArrowSprite: "upArrowSprite",
        downArrowSprite: "downArrowSprite",
    },
    physicsImages: {
        lineDot: "lineDot",
        cheese: "cheese",
    },
};
var repeat_forever_flag = true;

const CORRECT_MESSAGE = "Congratulations! Mouse ate the cheese!";

let _oMSPhaserLib;
let cursors = null;
let _mouseUpDown = null;
let _mouseLeftRight = null;
let platforms = null;
let lastKeyDown = "left";
window['lastKeyDown'] = "left";
let lastMoveDirection = "";
let isGameCompleted = false;
let isClicking = false;
window['isClicking'] = false;
let isLeftActive = true;
let isRightActive = true;
let isUpActive = true;
let isDownActive = true;
let moveDirOnLeftArrow = "left",
    moveDirOnRightArrow = "right",
    moveDirOnUpArrow = "up",
    moveDirOnDownArrow = "down";
let canEatCheese = false;

// Phaser config
let config = {
    type: AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
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
let game = new Game(config);

// Phaser preload function
function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);

    // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
    _oMSPhaserLib = new MSPhaserLib(this, false, 100);
    loadImages();
}

// Phaser create function
function create() {
    let images = GAME_CONSTANT.images;
    let physicsImages = GAME_CONSTANT.physicsImages;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis[element] = _gameThis.add.image(
                gameWidth / 2,
                gameHeight / 2,
                element
            );
        }
    }

    // for physics images
    for (const key in physicsImages) {
        if (
            Object.hasOwnProperty.call(physicsImages, key) &&
            physicsImages[key] == physicsImages.cheese
        ) {
            const element = physicsImages[key];
            _gameThis[element] = _gameThis.physics.add.sprite(
                gameWidth / 2,
                gameHeight / 2,
                element
            );
            _gameThis[element].setCollideWorldBounds(true);
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = magicElement[element];

            _gameThis[element] = _gameThis.physics.add.sprite(
                elementValue.x,
                elementValue.y,
                element
            );
        }
    }
    cursors = this.input.keyboard.createCursorKeys();
    // defining cursors on global level
    window['cursors'] = cursors
    fnInit();

    // for check game is run on desktop or mobile
    /* if(this.sys.game.device.os.desktop){
                                                                                                            this.leftArrowSprite.visible = false;
                                                                                                            this.rightArrowSprite.visible = false;                                                                                                    this.upArrowSprite.visible = false;                                                                                 this.downArrowSprite.visible = false;
                                                                                                          }else{ */
    fnArrowKeys();
    // }
}

// Phaser update function
function update() {

}

// this function will stop the mouse movement e.g. left, right, up or down
function fnStopMouseMovement() {
    _mouseUpDown.setVelocity(0, 0);
    _mouseLeftRight.setVelocity(0, 0);

    if (canStop()) {
        if (lastMoveDirection == "left" || lastMoveDirection == "right")
            _oMSPhaserLib.stopSpriteAt(
                _mouseLeftRight,
                GAME_CONSTANT.spritesImages.mouseLeftRight,
                mouseMovement[lastMoveDirection].state
            );
        if (lastMoveDirection == "up" || lastMoveDirection == "down")
            _oMSPhaserLib.stopSpriteAt(
                _mouseUpDown,
                GAME_CONSTANT.spritesImages.mouseUpDown,
                mouseMovement[lastMoveDirection].state
            );
    }
}

// Validate if mouse can stop after run
function canStop() {
    return (
        (isUpActive && moveDirOnUpArrow != "") ||
        (isDownActive && moveDirOnDownArrow != "") ||
        (isLeftActive && moveDirOnLeftArrow != "") ||
        (isRightActive && moveDirOnRightArrow != "")
    );
}

// function for mouse move left or right on left or right arrow key
function fnMoveLeftOrRight(direction) {
    _mouseUpDown.visible = false;
    _mouseLeftRight.visible = true;
    lastMoveDirection = direction;
    let speed = direction == "left" ? -mouseSpeed : mouseSpeed;
    _mouseLeftRight.setVelocityY(0);
    _mouseLeftRight.anims.play(direction, true);
    _mouseLeftRight.setVelocityX(speed);
    _mouseLeftRight.setBodySize(30, 14, true);
    _mouseUpDown.x = _mouseLeftRight.x;
    _mouseUpDown.y = _mouseLeftRight.y;
}

// function for mouse move up or down on up or down arrow key
function fnMoveUpOrDown(direction) {
    _mouseLeftRight.visible = false;
    _mouseUpDown.visible = true;
    lastMoveDirection = direction;
    let speed = direction == "up" ? -mouseSpeed : mouseSpeed;
    _mouseUpDown.setVelocityX(0);
    _mouseUpDown.anims.play(direction, true);
    _mouseUpDown.setVelocityY(speed);
    _mouseUpDown.setBodySize(14, 14, true);
    _mouseLeftRight.x = _mouseUpDown.x;
    _mouseLeftRight.y = _mouseUpDown.y;
}

// Load images
function loadImages() {
    let images = GAME_CONSTANT.images;
    let physicsImages = GAME_CONSTANT.physicsImages;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element, "images/" + element + ".png");
        }
    }

    // for physics images
    for (const key in physicsImages) {
        if (Object.hasOwnProperty.call(physicsImages, key)) {
            const element = physicsImages[key];
            _gameThis.load.image(element, "images/" + element + ".png");
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = magicElement[element];

            _gameThis.load.spritesheet(element, "images/" + element + ".png", {
                frameWidth: elementValue.frameWidth,
                frameHeight: elementValue.frameHeight,
            });
        }
    }
}

// mouse
function fnInit() {
    // for mouse up and down
    _mouseUpDown = _gameThis.mouseUpDown;
    _mouseUpDown.scale = gameScale * 3;
    _mouseUpDown.setVelocity(0, 0);
    _mouseUpDown.setCollideWorldBounds(true);
    _mouseUpDown.body.allowGravity = false;

    // for mouse left and right
    _mouseLeftRight = _gameThis.mouseLeftRight;
    _mouseLeftRight.scale = gameScale * 3;
    _mouseLeftRight.setVelocity(0, 0);
    _mouseLeftRight.setCollideWorldBounds(true);
    _mouseLeftRight.body.allowGravity = false;
    _mouseLeftRight.visible = false;

    fnCreateLines();

    for (const key in mouseMovement) {
        let dir = "mouseUpDown";
        if (key == "left" || key == "right") {
            dir = "mouseLeftRight";
        }
        if (Object.hasOwnProperty.call(mouseMovement, key)) {
            _gameThis.anims.create({
                key: key,
                frames: _gameThis.anims.generateFrameNumbers(
                    GAME_CONSTANT.spritesImages[dir], {
                    start: mouseMovement[key].frameStart,
                    end: mouseMovement[key].frameEnd,
                }
                ),
                frameRate: magicElement[dir].frameRate,
                repeat: -1,
            });
        }
    }

    _gameThis.anims.create({
        key: "turnUpDown",
        frames: [{
            key: GAME_CONSTANT.spritesImages.mouseUpDown,
            frame: mouseMovement[lastKeyDown].state,
        },],
        frameRate: magicElement.mouseUpDown.frameRate,
    });

    _gameThis.anims.create({
        key: "turnLeftRight",
        frames: [{
            key: GAME_CONSTANT.spritesImages.mouseLeftRight,
            frame: mouseMovement[lastKeyDown].state,
        },],
        frameRate: magicElement.mouseLeftRight.frameRate,
    });

    _gameThis.physics.add.overlap(
        _mouseUpDown,
        _gameThis.cheese,
        eatCheese,
        null,
        _gameThis
    );
    _gameThis.physics.add.overlap(
        _mouseLeftRight,
        _gameThis.cheese,
        eatCheese,
        null,
        _gameThis
    );
}

// for create arrow keys
function fnArrowKeys() {
    for (let key in arrowKeysConst) {
        const arrow = arrowKeysConst[key];
        const element = _gameThis.add.rectangle(
            arrow.x,
            arrow.y,
            arrow.w,
            arrow.h,
            arrow.c,
            arrow.a
        );
        element.setOrigin(0, 0);
        element.setInteractive();

        // pointer down event add on key arrows left, right, up and down
        element.on("pointerdown", function (pointer, x, y, event) {
            lastKeyDown = this.key;
            window['lastKeyDown'] = this.key;
            isClicking = true;
            window['isClicking'] = true;
            fnChangeArrowState(this.key, 1);
        });

        // pointer up event add on key arrows left, right, up and down
        element.on("pointerup", function (pointer, x, y, event) {
            isClicking = false;
            window['isClicking'] = false;
            fnChangeArrowState(this.key, 0);
        });
        element.key = key;
        _gameThis[key + "Arrow"] = element;

        // for arrow keys sprite
        _gameThis[key + "ArrowSprite"].scale = 0.4;
        _oMSPhaserLib.bringOnTop(_gameThis[key + "ArrowSprite"]);
    }
}

// function to handle the arrow keys state
function fnChangeArrowState(direction, stateIndex) {
    let arrowKey = direction + "ArrowSprite";
    _oMSPhaserLib.stopSpriteAt(_gameThis[arrowKey], arrowKey, stateIndex);
}

// for create lines
function fnCreateLines() {
    platforms = _gameThis.physics.add.staticGroup();

    for (let line of mazeLines) {
        platforms
            .create(line.x, line.y, GAME_CONSTANT.physicsImages.lineDot)
            .setOrigin(0)
            .setScale(line.scaleX, line.scaleY)
            .refreshBody();
    }

    _gameThis.physics.add.collider(_mouseUpDown, platforms);
    _gameThis.physics.add.collider(_mouseLeftRight, platforms);
}

function eatCheese(mouse, cheese) {
    if (canEatCheese) {
        cheese.disableBody(true, true);
        isGameCompleted = true;
        M.toast({
            html: CORRECT_MESSAGE,
        });
        fnStopMouseMovement();
    }
}

function fnCanEatCheese() {
    canEatCheese = true;
}

function activeKey(key_sensing, move_mouse) {
    // console.log(key_sensing, move_mouse);
    console.log(moveDirOnLeftArrow, "key sensing");
    switch (key_sensing) {
        case "left":
            isLeftActive = true;
            moveDirOnLeftArrow = move_mouse;
            break;
        case "right":
            isRightActive = true;
            moveDirOnRightArrow = move_mouse;
            break;
        case "up":
            isUpActive = true;
            moveDirOnUpArrow = move_mouse;
            break;
        case "down":
            isDownActive = true;
            moveDirOnDownArrow = move_mouse;
            break;
    }
}

function reInitValues() {
    // isLeftActive = isRightActive = isUpActive = isDownActive = false
    // moveDirOnLeftArrow = moveDirOnRightArrow = moveDirOnUpArrow = moveDirOnDownArrow = '';
    isClicking = false;
    // canEatCheese = true;
    lastKeyDown = "left";
    isGameCompleted = false;
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

let is_mouse_touching_cheese = () => {
    return (
        Math.Distance.Between(
            _mouseUpDown.x,
            _mouseUpDown.y,
            _gameThis.cheese.x,
            _gameThis.cheese.y
        ) <= 80
    );
};

function completedFlag() {
    return isGameCompleted;
}

function runCode() {
    window.LoopTrap = 1E3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
    // Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
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
}
const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="l!HT39zj+#jHqT_Eglvo" x="54" y="22"><statement name="NAME"><block type="controls_if" id=";n`$_Y,T|!)jHOQsH+gk"><mutation elseif="3"></mutation><value name="IF0"><block type="key_sensing" id="S/`m}8%nGj8=oY3htlKT"><field name="NAME">left</field></block></value><statement name="DO0"><block type="move_mouse" id="7u9/5]~]G![NoyAJ$27J"><field name="NAME">left</field></block></statement><value name="IF1"><block type="key_sensing" id="OTln:Oju.p67}pnIB:^Q"><field name="NAME">right</field></block></value><statement name="DO1"><block type="move_mouse" id="~969Qwc$a(.!*}6d-rhk"><field name="NAME">right</field></block></statement><value name="IF2"><block type="key_sensing" id="9#^]Cb3g.iGn#JkLft!`"><field name="NAME">up</field></block></value><statement name="DO2"><block type="move_mouse" id="M-daxtC3m=~cJu5vF5S|"><field name="NAME">up</field></block></statement><value name="IF3"><block type="key_sensing" id=",@nqoe:=IL%.t}A?+}tH"><field name="NAME">down</field></block></value><statement name="DO3"><block type="move_mouse" id="BL5%C.R,jRR*dYlN-!~y"><field name="NAME">down</field></block></statement><next><block type="controls_if" id="}`V$P:;RT;]+}@mp?)H("><value name="IF0"><block type="spritetouch__block" id="^Ox?9SQCSuG:3?7a-@|c"><field name="options1">mouse</field><field name="options2">cheese</field></block></value><statement name="DO0"><block type="eat_block" id="fl3B?jYi0Cvk*)2pPhTa"></block></statement></block></next></block></statement></block></xml>';

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

export {
    fnCanEatCheese,
    fnMoveUpOrDown,
    reset_output,
    completedFlag,
    runCode,
    helpCode,
    repeat_forever_flag,
    moveDirOnLeftArrow,
    moveDirOnRightArrow,
    moveDirOnUpArrow,
    moveDirOnDownArrow,
    fnMoveLeftOrRight,
    fnStopMouseMovement,
    update,
    game,
    preload,
    create,
    isGameCompleted,
    isLeftActive,
    isRightActive,
    isDownActive,
    isUpActive,
    is_mouse_touching_cheese,
    getNoOfBlocks
};
