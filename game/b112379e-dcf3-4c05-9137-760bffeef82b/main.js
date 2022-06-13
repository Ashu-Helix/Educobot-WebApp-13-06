import M from 'materialize-css';
import {
    AUTO,
    Game,
} from 'phaser';

import MSPhaserLib from '../msPhaserLib.min';


import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;


let _gameThis = null;
const baseURL = '../img/images/b112379e-dcf3-4c05-9137-760bffeef82b';
const gameWidth = 960;
const gameHeight = 540;


const GAME_CONSTANT = {
    images: {
        BG1: "bg1.png",
        BG2: "bg2.png",
        BG3: "bg3.png",
        BG4: "bg4.png",
        BG5: "bg5.png",
        CHEESE: "cheese.png",
        SCORE: "Button_Score.png",
        UP: "Button_Up.png",
        DOWN: "Button_Down.png",
        FWD: "Button_Forward.png",
        TIMER: "Button_Timer_Km.png",
        SMASH: "smash_01.png"
    },
    spritesImages: {
        CAT: { key: "spritesheets/cat.png", frameWidth: 1460, frameHeight: 1460 },
        MOUSE: { key: "spritesheets/mouse.png", frameWidth: 440, frameHeight: 324 }
    }
};


const LOSE_MESSAGE = 'You were caught';
const LOSE_MESSAGE_MISSED = 'You forgot to get the cheese!';
const WIN_MESSAGE = 'You escaped with the cheese!';
const CAT_CANT_ENTER = 'Cat doesn\'t fit in the hole!';
const NO_HOLE_SELECTED = 'No hole selected!';

let hasWrongSelection = false;
let _oMSPhaserLib;

let cat
let mouse
let cheese1
let cheese2
let cheese3
let cheese4
let cheese5
let cheeseGUI = []
let score = 0;
let cheeseCount
let cheeseEaten = 0;
let scorePerCheese = 100;
let scoreText
let lives = 0;
// let startChase = false;
window['startChase'] = false;
let runSpeed = 8;
let isRunning = false;
let isEating = false;
let canAct = true;
let holeSelected = 0
let currentLane = 0
let lanes = [440, 470, 500, 535]
let test = true
let backgrounds = []
let changingLane = false
let wallPosition = []
let wall
let isCatRunning = true
let finalToastDisplayed = false
let roughedUp = false
let game_is_over = false;

// Phaser config
let config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    backgroundColor: "#eeeeee",
    parent: "sprite-container",
    canvasStyle: `width: 100%;
    object-fit: revert;
    aspect-ratio: 738 / 436;`,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

// Initialize Phaser with config
let game = new Phaser.Game(config);

// This function will sleep/pause code execution for given miliseconds.
async function sleep(ms) {
    await _oMSPhaserLib.sleep(ms);
}

// Re-initialize the game variables
function reInitValues() {
    cheeseEaten = 0
    finalToastDisplayed = false
    isRunning = false
    canAct = true
    isEating = false
    changingLane = false
    isCatRunning = true
    window['startChase'] = false
    finalToastDisplayed = false
    roughedUp = false
    game_is_over = false;
}

// Reset the game
function reset_output() {
    reInitValues();
    _gameThis.scene.restart();
}

// Phaser preload function
function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);

    // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
    loadImages();
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
            const element = spritesImages[key];
            _gameThis.load.spritesheet(key, element.key, {
                frameWidth: element.frameWidth,
                frameHeight: element.frameHeight
            });
        }
    }
}

// Phaser create function
function create() {
    //set background image
    let nextX = gameWidth / 2;

    let offsets = [0, -50, -500, -400, 0]
    for (let i = 1; i < 6; i++) {
        let bg = _gameThis.add.sprite(nextX, gameHeight / 2, "BG" + i)
        bg.scale = 0.24
        bg.width = gameWidth
        nextX += gameWidth + offsets[i]

        backgrounds.push(bg)
    }

    mouse = _gameThis.physics.add.sprite(gameWidth * 0.5, lanes[2], 'MOUSE')
    currentLane = 2
    mouse.scale = 0.2
    mouse.setOrigin(0.5, 1)

    cat = _gameThis.physics.add.sprite(gameWidth * 0.2, lanes[2], 'CAT')
    cat.scale = 0.1
    cat.setOrigin(0.5, 1)

    let minMaxX = [backgrounds[1].x, backgrounds[backgrounds.length - 1].x];
    let minMaxY = [lanes[0] - 150, lanes[lanes.length - 1]]
    let range = minMaxX[1] - minMaxX[0]

    cheese1 = _gameThis.add.sprite(minMaxX[0] + range * 0.1, Phaser.Math.Between(minMaxY[0], minMaxY[1]), 'CHEESE')
    cheese1.scale = 0.15
    if (cheeseCount < 1) {
        removeCheese(cheese2)
    }
    cheese2 = _gameThis.add.sprite(minMaxX[0] + range * 0.3, Phaser.Math.Between(minMaxY[0], minMaxY[1]), 'CHEESE')
    cheese2.scale = 0.15
    if (cheeseCount < 2) {
        removeCheese(cheese2)
    }
    cheese3 = _gameThis.add.sprite(minMaxX[0] + range * 0.5, Phaser.Math.Between(minMaxY[0], minMaxY[1]), 'CHEESE')
    cheese3.scale = 0.15
    if (cheeseCount < 3) {
        removeCheese(cheese3)
    }
    cheese4 = _gameThis.add.sprite(minMaxX[0] + range * 0.7, Phaser.Math.Between(minMaxY[0], minMaxY[1]), 'CHEESE')
    cheese4.scale = 0.15
    if (cheeseCount < 4) {
        removeCheese(cheese4)
    }
    cheese5 = _gameThis.add.sprite(minMaxX[0] + range * 0.9, Phaser.Math.Between(minMaxY[0], minMaxY[1]), 'CHEESE')
    cheese5.scale = 0.15
    if (cheeseCount < 5) {
        removeCheese(cheese5)
    }

    let firstHole = backgrounds[backgrounds.length - 1].x + (gameWidth * 0.24)
    wallPosition = [{ x: firstHole, y: lanes[0] },
    { x: firstHole + 43, y: lanes[1] },
    { x: firstHole + 115, y: lanes[2] },
    { x: firstHole + 180, y: lanes[3] }
    ]

    wall = _gameThis.physics.add.image(wallPosition[currentLane].x, wallPosition[currentLane].y, 'UP')
    wall.setOrigin(0, 0.8)
    wall.scale = 3
    wall.visible = false

    _gameThis.physics.add.overlap(mouse, wall, handleWallHit)
    _gameThis.physics.add.overlap(cat, wall, handleCatHit)

    createGUI()
    setupCamera()
    init()

    _gameThis.cursors = _gameThis.input.keyboard.createCursorKeys()
}

function createGUI() {
    var scoreSprite = _gameThis.add.sprite(gameWidth * 0.5, gameHeight * 0.07, 'SCORE')
    var up = _gameThis.add.sprite(gameWidth * 0.85, gameHeight * 0.07, 'UP')
    var down = _gameThis.add.sprite(gameWidth * 0.9, gameHeight * 0.07, 'DOWN')
    var fwd = _gameThis.add.sprite(gameWidth * 0.95, gameHeight * 0.07, 'FWD')
    var timer = _gameThis.add.sprite(gameWidth * 0.7, gameHeight * 0.07, 'TIMER')

    scoreText = _gameThis.add.text(scoreSprite.x + 10, scoreSprite.y, score)
    scoreText.setOrigin(0, 0.5)
    scoreText.fontSize = 6
    scoreText.scale = 1.5
    scoreText.stroke = '#444444'

    scoreSprite.scale = 0.45
    up.scale = 0.45
    down.scale = 0.45
    fwd.scale = 0.45
    timer.scale = 0.45

    scoreSprite.setScrollFactor(0)
    up.setScrollFactor(0)
    down.setScrollFactor(0)
    fwd.setScrollFactor(0)
    timer.setScrollFactor(0)
    scoreText.setScrollFactor(0)

    let offset = 50;
    for (let i = 0; i < cheeseCount; i++) {
        let cheese = _gameThis.add.sprite(50 + (offset * i), 40, 'CHEESE')
        cheese.scale = 0.095
        cheese.setScrollFactor(0)
        cheeseGUI.push(cheese)
    }
}

function handleWallHit(mouse, wall) {
    let mask = wall.createBitmapMask()
    mask.invertAlpha = true

    if (currentLane == 0 || currentLane == 3) {
        //cat and mouse doesn't fit on first and last lane
        isRunning = false
    } else if (currentLane == 2) {
        //for lane 3, both cat and mouse fits, cat will be able to follow and capture mouse
        mouse.mask = mask
        cat.mask = mask
    } else {
        //for lane 2, only mouse fits in this hole, mouse will be able to escape
        mouse.mask = mask
    }
}

function handleCatHit(cat, wall) {
    let mask = wall.createBitmapMask()
    mask.invertAlpha = true

    if (currentLane == 0 || currentLane == 3) {
        //cat and mouse doesn't fit on first and last lane but can chase mouse
    } else if (currentLane == 2) {
        //for lane 3, both cat and mouse fits, cat will be able to follow and capture mouse
        cat.mask = mask
    } else {
        roughUp(cat)
        isCatRunning = false
        cat.visible = false
    }
}



function sprite_touched(sprite1, sprite2) {
    if (window['startChase']) {
        if ((sprite1 == 'mouse' && sprite2 == 'cheese') ||
            (sprite1 == 'cheese' && sprite2 == 'mouse')) {
            return checkMouseCheeseTouch()
        } else if ((sprite1 == 'mouse' && sprite2 == 'cat') ||
            (sprite1 == 'cat' && sprite2 == 'mouse')) {
            return checkOverlap(mouse, cat)
        } else if ((sprite1 == 'cheese' && sprite2 == 'cat') ||
            (sprite1 == 'cat' && sprite2 == 'cheese')) { } else {
            return checkCatCheeseTouch()
        }
    }
}

function checkMouseCheeseTouch() {
    return checkOverlap(mouse, cheese1) ||
        checkOverlap(mouse, cheese2) ||
        checkOverlap(mouse, cheese3) ||
        checkOverlap(mouse, cheese4) ||
        checkOverlap(mouse, cheese5)
}

function checkCatCheeseTouch() {
    return checkOverlap(cat, cheese1) ||
        checkOverlap(cat, cheese2) ||
        checkOverlap(cat, cheese3) ||
        checkOverlap(cat, cheese4) ||
        checkOverlap(cat, cheese5)
}

function checkOverlap(spriteA, spriteB) {
    if (!spriteA.active || !spriteB.active) return
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);

}

function setupCamera() {
    _gameThis.cameras.main.startFollow(mouse)
    _gameThis.cameras.main.followOffset.set(-100, 162)
    _gameThis.cameras.main.setBounds(0, 0,
        backgrounds[backgrounds.length - 1].x + gameWidth / 2,
        gameHeight / 2)
}


// Initialize animation functions
function init() {
    // await sleep(1000);
    _gameThis.anims.create({
        key: 'runMouse',
        frames: _gameThis.anims.generateFrameNumbers('MOUSE', { start: 0, end: 4, first: 4 }),
        frameRate: 30,
        repeat: -1
    })

    _gameThis.anims.create({
        key: 'runCat',
        frames: _gameThis.anims.generateFrameNumbers('CAT', { start: 0, end: 5, first: 5 }),
        frameRate: 20,
        repeat: -1
    })
}

function startTheChase() {
    if (!window['startChase']) {
        window['startChase'] = true
    }
    cheeseEaten = 0
    finalToastDisplayed = false
    isRunning = false
    canAct = true
    isEating = false
    changingLane = false
    isCatRunning = true
    finalToastDisplayed = false
    roughedUp = false
}

function update() { }

function updateWorld() {
    if (window['startChase']) {
        catRun()
        mouseRun()

        if (checkOverlap(cat, mouse)) {
            mouseCaptured()
        }
    }
}

function catRun() {
    if (!cat.anims.isPlaying) {
        cat.anims.play('runCat')
    }
    if (isCatRunning) {
        cat.x += runSpeed
    }
}

function mouseRun() {
    if (isRunning) {
        mouse.x += runSpeed
        if (!mouse.anims.isPlaying) {
            mouse.anims.play('runMouse')
        }
    }
}

function mouseCaptured() {
    window['startChase'] = false

    cat.visible = false
    mouse.visible = false

    roughUp(mouse)
}

function roughUp(char) {
    if (!roughedUp) {
        roughedUp = true
        var roughUpSprite = _gameThis.add.sprite(char.x, char.y, 'SMASH')
        roughUpSprite.setOrigin(0.5)
        roughUpSprite.scale = 0.3

        _gameThis.tweens.add({
            targets: roughUpSprite,
            rotation: 500,
            duration: 1500
        })
    }
}

function game_win() {
    if (finalToastDisplayed) return
    M.toast({ html: WIN_MESSAGE })
    finalToastDisplayed = true;
    setTimeout(() => { game_is_over = true; }, 2500)
}

function game_over() {
    if (finalToastDisplayed) return
    M.toast({ html: LOSE_MESSAGE })
    finalToastDisplayed = true;
    setTimeout(() => { game_is_over = true; }, 2500)

}

function key_pressed(key) {
    let cursors = _gameThis.cursors
    switch (key) {
        case 1:
            return cursors.up.isDown
        case 2:
            return cursors.down.isDown;
        case 3:
            return cursors.left.isDown;
        case 4:
            return cursors.right.isDown;
        case 5:
            return cursors.space.isDown;
        default:
            return false;
    }
}

function hole_touched() {
    return checkOverlap(mouse, wall)
}

function setVariable(variable, value) {
    switch (variable) {
        case 'score':
            score = parseInt(value)
            break
        case 'cheeseCount':
            cheeseCount = parseInt(value)
            break
        default:
            break
    }
}

function removeCheese(cheese) {
    cheese.setVisible(false)
    cheese.setActive(false)
}

function changeVariable(variable, value) {
    switch (variable) {
        case 'score':
            score += parseInt(value)
            break
        case 'cheeseCount':
            break
        default:
            break
    }
}

//This is just validation of hole selected
function select_hole(num) {
    return currentLane + 1 == num
}

function eat_the_cheese() {
    if (!isEating && cheeseEaten <= cheeseCount) {
        isEating = true
        eatOverlappedCheese()
    }
}

function eatOverlappedCheese() {
    if (checkOverlap(mouse, cheese1)) {
        eat(cheese1)
    } else if (checkOverlap(mouse, cheese2)) {
        eat(cheese2)
    } else if (checkOverlap(mouse, cheese3)) {
        eat(cheese3)
    } else if (checkOverlap(mouse, cheese4)) {
        eat(cheese4)
    } else if (checkOverlap(mouse, cheese5)) {
        eat(cheese5)
    }
}

function eat(cheese) {
    removeCheese(cheese)
    cheeseEaten += 1
    score += scorePerCheese
    scoreText.setText(score)
    let gui = cheeseGUI.pop()
    removeCheese(gui)
    setTimeout(() => {
        isEating = false
    }, 500)
}

function jump() {
    //Mouse jump
    if (canAct && !changingLane) {
        canAct = false
        var origY = mouse.y
        _gameThis.tweens.add({
            targets: mouse,
            y: mouse.y - 200,
            duration: 500
        })

        _gameThis.tweens.add({
            targets: mouse,
            y: origY,
            duration: 500,
            delay: 500
        })

        setTimeout(() => {
            canAct = true
        }, 1000)
    }
}

function runMouse() {
    if (!isRunning) {
        isRunning = true
    }
}

function move_up() {
    if (!changingLane && canAct && !finalApproach()) {
        if (currentLane > 0) {
            changingLane = true
            currentLane -= 1
            updateCharPos()
        }
    }
}

function move_down() {
    if (!changingLane && canAct && !finalApproach()) {
        if (currentLane < 3) {
            changingLane = true
            currentLane += 1
            updateCharPos()
        }
    }
}

function finalApproach() {
    return mouse.x >= backgrounds[backgrounds.length - 1].x
}

function updateCharPos() {
    _gameThis.tweens.add({
        targets: [mouse, cat],
        y: lanes[currentLane],
        duration: 200
    })
    wall.setPosition(wallPosition[currentLane].x, wallPosition[currentLane].y)
    setTimeout(() => {
        changingLane = false
    }, 200)
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
    //     if (tour.getCurrentStep().options.title.includes("Run")) {
    //         let btns = document.querySelectorAll('.shepherd-button');
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}




// function helpCode() {
//     // tour.isActive() || tour.start()
//     var xml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="c}ZM9`-m7YJwZ(](W?L[" x="87" y="87"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="tLe*10w8]b}O2*=KFK|/"><field name="NUM">7</field></block></value><next><block type="set_variable_holder" id="%5HTozs#h^^$r%hZglO@"><field name="Variable name">cheeseCount</field><value name="NAME"><block type="math_number" id="9BIRt`%#,(@pbFV;q3-m"><field name="NUM">4</field></block></value><next><block type="single_action_block" id="kIa12JMYW8R-_iwzSV6."><next><block type="forever_repeat_block" id="MVr-7wiV(+QjzQuwJ6**"><statement name="NAME"><block type="run" id="?)u$n7.c09}C`06$DJFU"><next><block type="controls_if" id="dEa1M?N$ZEkewkVmFvm`"><mutation elseif="2"></mutation><value name="IF0"><block type="key_sensing" id="W[k(1gig..M#ylzEl[HE"><field name="option1">5</field></block></value><statement name="DO0"><block type="action_block" id="s^86G*+KC0FBZ5*l}Mz]"></block></statement><value name="IF1"><block type="key_sensing" id="5Fwcjh_fVaQZG}NkN#_A"><field name="option1">1</field></block></value><statement name="DO1"><block type="move_up" id="(Bp!mj.b_g|?[e+b@E8!"></block></statement><value name="IF2"><block type="key_sensing" id="IX*Spw)?E_dkk=ildc@^"><field name="option1">2</field></block></value><statement name="DO2"><block type="move_down" id="@Uv=-Osz?38Be$xcg{N8"></block></statement><next><block type="controls_if" id="t??:$Oga*UTmuJO0k)+U"><mutation elseif="1"></mutation><value name="IF0"><block type="spritetouch__block" id="%Q@v%ae_l*05S|/66n|$"><field name="options1">mouse</field><field name="options2">cheese</field></block></value><statement name="DO0"><block type="secondary_action_block" id="pbqXqSR@pgA#L_`g8-J6"></block></statement><value name="IF1"><block type="pointertouch__block" id="[KXP%[=RyP=n~%3+~GY$"></block></value><statement name="DO1"><block type="controls_if" id="A,U]by.r$7rz`EW2}B%."><mutation else="1"></mutation><value name="IF0"><block type="options_block" id="+zDpN_RB0cUf{cvEb~q0"><field name="NAME">2</field></block></value><statement name="DO0"><block type="win_block" id="5(3o~P7BZEwo/Lh48iKl"></block></statement><statement name="ELSE"><block type="end_block" id="qiq./4gO2boY;)cMO_5X"></block></statement></block></statement></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>');
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="c}ZM9`-m7YJwZ(](W?L[" x="87" y="87"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="tLe*10w8]b}O2*=KFK|/"><field name="NUM">7</field></block></value><next><block type="set_variable_holder" id="%5HTozs#h^^$r%hZglO@"><field name="Variable name">cheeseCount</field><value name="NAME"><block type="math_number" id="9BIRt`%#,(@pbFV;q3-m"><field name="NUM">4</field></block></value><next><block type="single_action_block" id="kIa12JMYW8R-_iwzSV6."><next><block type="forever_repeat_block" id="MVr-7wiV(+QjzQuwJ6**"><statement name="NAME"><block type="run" id="?)u$n7.c09}C`06$DJFU"><next><block type="controls_if" id="dEa1M?N$ZEkewkVmFvm`"><mutation elseif="2"></mutation><value name="IF0"><block type="key_sensing" id="W[k(1gig..M#ylzEl[HE"><field name="option1">5</field></block></value><statement name="DO0"><block type="action_block" id="s^86G*+KC0FBZ5*l}Mz]"></block></statement><value name="IF1"><block type="key_sensing" id="5Fwcjh_fVaQZG}NkN#_A"><field name="option1">1</field></block></value><statement name="DO1"><block type="move_up" id="(Bp!mj.b_g|?[e+b@E8!"></block></statement><value name="IF2"><block type="key_sensing" id="IX*Spw)?E_dkk=ildc@^"><field name="option1">2</field></block></value><statement name="DO2"><block type="move_down" id="@Uv=-Osz?38Be$xcg{N8"></block></statement><next><block type="controls_if" id="t??:$Oga*UTmuJO0k)+U"><mutation elseif="1"></mutation><value name="IF0"><block type="spritetouch__block" id="%Q@v%ae_l*05S|/66n|$"><field name="options1">mouse</field><field name="options2">cheese</field></block></value><statement name="DO0"><block type="secondary_action_block" id="pbqXqSR@pgA#L_`g8-J6"></block></statement><value name="IF1"><block type="pointertouch__block" id="[KXP%[=RyP=n~%3+~GY$"></block></value><statement name="DO1"><block type="controls_if" id="A,U]by.r$7rz`EW2}B%."><mutation else="1"></mutation><value name="IF0"><block type="options_block" id="+zDpN_RB0cUf{cvEb~q0"><field name="NAME">2</field></block></value><statement name="DO0"><block type="win_block" id="5(3o~P7BZEwo/Lh48iKl"></block></statement><statement name="ELSE"><block type="end_block" id="qiq./4gO2boY;)cMO_5X"></block></statement></block></statement></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>';

// function myUpdateFunction(a) {
//     var code = Blockly.Python.workspaceToCode(demoWorkspace);
//     var import_statement = "from cat_and_mouse import *\n";
//     document.getElementById('pycode').innerHTML = import_statement + code;
//     document.getElementById('modal1').innerHTML = import_statement + code;
// }
// demoWorkspace.addChangeListener(myUpdateFunction);


function completedFlag() {
    return game_is_over;
}


function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from cat_and_mouse import *"]

export {
    completedFlag,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    // startChase,
    updateWorld,
    startTheChase,
    jump,
    sprite_touched,
    eat_the_cheese,
    hole_touched,
    select_hole,
    key_pressed,
    game_win,
    game_over,
    move_up,
    move_down,
    runMouse,
    setVariable,
    changeVariable,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
}