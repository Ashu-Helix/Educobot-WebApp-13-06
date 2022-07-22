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
const baseURL = '../img/images/907a8404-26dd-4098-bcea-22b8bb68b36d';
const gameWidth = 960;
const gameHeight = 540;

let default_ = 0;
let dummy = 0;
const GAME_CONSTANT = {
    images: {
        price_frame: { key: "price_frame", loc: "price_frame.png" }
    },
    spritesheets: {
        butter: {
            key: "butter",
            type: "product",
            frameWidth: 306,
            frameHeight: 372,
            loc: "items/butter.png",
            scale: 0.4,
            price: 250,
            discount: 0,
            side: 'left',
            shape: [
                2, 381,
                68, 222,
                120, 384,
                70, 537,
            ]
        },
        cheese: {
            key: "cheese",
            type: "product",
            frameWidth: 213,
            frameHeight: 372,
            loc: "items/cheese.png",
            scale: 0.5,
            price: 140,
            discount: 0.15,
            side: 'right',
            shape: [
                851, 79,
                958, 163,
                957, 330,
                812, 180,
            ]
        },
        choco_sauce: {
            key: "choco_sauce",
            type: "product",
            frameWidth: 159,
            frameHeight: 372,
            loc: "items/choco_sauce.png",
            scale: 0.5,
            price: 60,
            discount: 0.15,
            side: 'right',
            shape: [
                610, -300,
                830, -15,
                810, 165,
                590, -50,
            ]
        },
        cola: {
            key: "cola",
            type: "product",
            frameWidth: 213,
            frameHeight: 372,
            loc: "items/cola.png",
            scale: 0.5,
            price: 100,
            discount: 0.1,
            side: 'right',
            shape: [
                430, -360,
                585, -265,
                565, -135,
                410, -270,
            ]
        },
        corn_flakes: {
            key: "corn_flakes",
            type: "product",
            frameWidth: 188,
            frameHeight: 372,
            loc: "items/corn_flakes.png",
            scale: 0.7,
            price: 220,
            discount: 0.1,
            side: 'left',
            shape: [
                120, -30,
                228, -430,
                265, -280,
                170, 197,
            ]
        },
        garlic_bread_set: {
            key: "garlic_bread_set",
            type: "product",
            frameWidth: 382,
            frameHeight: 372,
            loc: "items/garlic_bread_set.png",
            scale: 0.6,
            price: 126,
            discount: 0,
            side: 'left',
            shape: [
                290, -650,
                400, -1100,
                440, -1000,
                330, -525,
            ]
        },
        honey: {
            key: "honey",
            type: "product",
            frameWidth: 188,
            frameHeight: 372,
            loc: "items/honey.png",
            scale: 0.7,
            price: 200,
            discount: 0.2,
            side: 'left',
            shape: [
                240, -450,
                275, -630,
                320, -480,
                275, -300
            ]
        },
        ketchup: {
            key: "ketchup",
            type: "product",
            frameWidth: 159,
            frameHeight: 372,
            loc: "items/ketchup.png",
            scale: 0.6,
            price: 150,
            discount: 0.1,
            side: 'right',
            shape: [
                0, -830,
                135, -730,
                125, -570, -90, -770,
            ]
        },
        milk_bottle: {
            key: "milk_bottle",
            type: "product",
            frameWidth: 167,
            frameHeight: 372,
            loc: "items/milk_bottle.png",
            scale: 0.6,
            price: 40,
            discount: 0,
            side: 'left',
            shape: [
                72, 211,
                138, 51,
                170, 204,
                120, 367,
            ]
        },
        milk_bottle2: {
            key: "milk_bottle",
            type: "product",
            frameWidth: 167,
            frameHeight: 372,
            loc: "items/milk_bottle.png",
            scale: 0.6,
            price: 40,
            discount: 0,
            side: 'right',
            shape: [
                135, -730,
                420, -370,
                400, -280,
                125, -570,
            ]
        },
        trolley: {
            key: "trolley",
            type: "gui",
            frameWidth: 625,
            frameHeight: 352,
            loc: "items/trolley.png",
            scale: 1.5
        },
        pay_btn: {
            key: "pay_btn",
            type: "gui",
            frameWidth: 512,
            frameHeight: 512,
            loc: "items/pay_button.png",
            scale: 1
        },
        down_button: {
            key: "down_button",
            type: "gui",
            frameWidth: 203,
            frameHeight: 225,
            loc: "downArrowSprite.png",
            scale: 1
        },
        up_button: {
            key: "up_button",
            type: "gui",
            frameWidth: 210,
            frameHeight: 213,
            loc: "upArrowSprite.png",
            scale: 1
        }
    }
};

const LOSE_MESSAGE = 'Game over';

let hasWrongSelection = false;
let _oMSPhaserLib;

//TODO Set Game Variables here
let finalToastDisplayed = false
let leftContainer
let rightContainer
let disc = '0.00% (0 KPI)'
let cost = 0
let total = 0
let tally
let mrpText
let discText
let totalText
let payBtn
let background
let backgroundFrame
let canMove = true
let selectedItem
let leftGroup
let rightGroup
let justClicked = false
let allGraphics = []
let gameTrolley
let hasInitialized = false
let allPurchases = []
let payBtnClicked = false
let gameOver = false
let textGroup
let lastKeyDown = 'left'
let isClicking

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
            debug: true
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
    cost = 0
    disc = ''
    total = 0
    hasInitialized = false
    gameOver = false
    payBtnClicked = false
    justClicked = false
    finalToastDisplayed = false
    selectedItem = undefined
    allPurchases = []
    allGraphics = []
    // TODO: Re-initialize the game variables here for reset
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
    let spritesImages = GAME_CONSTANT.spritesheets;
    let arrowSprites = GAME_CONSTANT.arrowSprites;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element.key, element.loc);
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            _gameThis.load.spritesheet(element.key, element.loc, {
                frameWidth: element.frameWidth,
                frameHeight: element.frameHeight
            });
        }
    }

    for (let i = 1; i <= 28; i++) {
        _gameThis.load.image('bg' + i, `bg/_00${(i < 10) ? `0${i}` : i}.png`)
    }
}

// Phaser create function
function create() {
    //TODO Set Initial Objects
    leftGroup = _gameThis.add.group()
    rightGroup = _gameThis.add.group()

    createBG()
    createTrolley()
    createButtons()

    let stock = ['butter', 'milk_bottle', 'corn_flakes', 'honey', 'garlic_bread_set',
        'cheese', 'choco_sauce', 'cola', 'milk_bottle2', 'ketchup']
    for (let i = 0; i < stock.length; i++) {
        createCollider(stock[i])
    }
    enableHandler()

    init()

    _gameThis.cursors = _gameThis.input.keyboard.createCursorKeys()
}

function createButtons() {
    let upBtn = _gameThis.add.sprite(gameWidth * 0.9, gameHeight * 0.7, 'up_button')
    let downBtn = _gameThis.add.sprite(gameWidth * 0.9, gameHeight * 0.9, 'down_button')
    upBtn.name = 'up_button'
    downBtn.name = 'down_button'
    upBtn.setOrigin(0.5)
    downBtn.setOrigin(0.5)
    upBtn.scale = 0.35
    downBtn.scale = 0.35
    upBtn.setInteractive()
    downBtn.setInteractive()
}

function enableHandler() {
    _gameThis.input.on('gameobjectdown', handleClickEvent)
}

function createBG() {
    background = _gameThis.add.image(gameWidth / 2, gameHeight / 2, 'bg1')
    background.setOrigin(0.5, 0.5)
    background.scale = (gameWidth / background.width)
    background.setInteractive()
    backgroundFrame = 1
}

function createCollider(name) {
    let item = GAME_CONSTANT.spritesheets[name]

    let sprite = spriteHolder(0, 0)
    let shape = new Phaser.Geom.Polygon(item.shape)

    sprite.name = name
    sprite.shape = item.shape
    sprite.type = item.type
    if (item.side === 'left') {
        leftGroup.add(sprite)
    } else {
        rightGroup.add(sprite)
    }

    drawPoly(sprite, shape)

    sprite.setInteractive(shape, Phaser.Geom.Polygon.Contains)
}

function moveInventoryDown() {
    allGraphics.forEach(gfx => {
        gfx.destroy()
    })
    Phaser.Actions.IncXY(leftGroup.getChildren(), -9, 38)
    Phaser.Actions.IncXY(rightGroup.getChildren(), 27, 29)
    redrawPoly(leftGroup)
    redrawPoly(rightGroup)
}

function moveInventoryUp() {
    allGraphics.forEach(gfx => {
        gfx.destroy()
    })
    Phaser.Actions.IncXY(leftGroup.getChildren(), 9, -38)
    Phaser.Actions.IncXY(rightGroup.getChildren(), -27, -29)
    redrawPoly(leftGroup)
    redrawPoly(rightGroup)
}

function redrawPoly(group) {
    for (let i = 0; i < group.getChildren().length; i++) {
        let child = group.getChildren()[i]
        let shape = new Phaser.Geom.Polygon(child.shape)
        drawPoly(child, shape)
    }
}

function spriteHolder() {
    let sprite = _gameThis.add.sprite(90, 180, 'corn_flakes')
    sprite.setOrigin(0.5)
    sprite.scale = 1
    sprite.alpha = 0.0001
    return sprite
}

function createTrolley() {
    gameTrolley = _gameThis.add.sprite(gameWidth / 2, gameHeight * 0.55, 'trolley')
    gameTrolley.setOrigin(0.5)
    gameTrolley.scale = 1.4
    gameTrolley.name = 'trolley'
}

function createTrolleyAnimations() {
    _gameThis.anims.create({
        key: 'initTrolley',
        frames: _gameThis.anims.generateFrameNumbers('trolley',
            { start: 0, end: 8, first: 0 }),
        frameRate: 8,
        repeat: 0
    })

    _gameThis.anims.create({
        key: 'reachRight',
        frames: _gameThis.anims.generateFrameNumbers('trolley',
            { start: 8, end: 15, first: 8 }),
        frameRate: 8,
        repeat: 0
    })

    _gameThis.anims.create({
        key: 'reachLeft',
        frames: _gameThis.anims.generateFrameNumbers('trolley',
            { start: 15, end: 23, first: 15 }),
        frameRate: 8,
        repeat: 0
    })
}

// Initialize animation functions
function init() {
    tally = _gameThis.add.sprite(gameWidth * 0.5, gameHeight * 0.53, GAME_CONSTANT.images.price_frame.key)
    tally.setOrigin(0.5)
    tally.scale = 0.7

    mrpText = _gameThis.add.text(tally.x - 20, tally.y - 30, '0.00 KPI', {
        fontSize: 30,
        fill: '#000000'
    })
    mrpText.setOrigin(0, 0.5)
    discText = _gameThis.add.text(tally.x - 20, tally.y + 20, '0.00 %', {
        fontSize: 30,
        fill: '#000000'
    })
    discText.setOrigin(0, 0.5)
    totalText = _gameThis.add.text(tally.x - 20, tally.y + 75, '0.00 KPI', {
        fontSize: 30,
        fill: '#000000'
    })
    totalText.setOrigin(0, 0.5)

    payBtn = _gameThis.add.sprite(tally.x, tally.y + 150, 'pay_btn')
    payBtn.setOrigin(0.5)
    payBtn.scale = 0.2
    payBtn.name = 'pay_btn'
    payBtn.setInteractive()

    hideGUI()

    createTrolleyAnimations()


    let spritesImages = GAME_CONSTANT.spritesheets;

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            if (['trolley', 'pay_btn', 'up_button', 'down_button', 'left_button', 'right_button'].includes(key)) continue

            let image = _gameThis.add.sprite(0, 0, element.key)
            image.scale = element.scale
            _gameThis.anims.create({
                key: `${element.key}_drop`,
                frames: _gameThis.anims.generateFrameNumbers(element.key, { start: 0, end: 3, first: 0 }),
                frameRate: 4,
                repeat: 0
            })
        }
    }
}

function hideGUI() {
    tally.visible = false
    mrpText.visible = false
    discText.visible = false
    totalText.visible = false
    payBtn.visible = false
}

function showGUI() {
    tally.visible = true
    mrpText.visible = true
    discText.visible = true
    totalText.visible = true
    payBtn.visible = true
}

//Dummy function for Forever Loop, do not use this.
function update() {
}

function initTrolley() {
    if (!gameTrolley.anims.isPlaying && !hasInitialized) {
        gameTrolley.anims.play('initTrolley')
        hasInitialized = true
        setTimeout(() => {
            showGUI()
            show_total()
        }, 1000)
    }
}

function reachLeft() {
    gameTrolley.anims.play('reachLeft')
}

function reachRight() {
    gameTrolley.anims.play('reachRight')
}

function drop_in_cart() {
    let item = GAME_CONSTANT.spritesheets[selectedItem]
    if (item.type != 'product') return
    let side = leftGroup.getChildren().find(i => i.name === selectedItem) ? 'left' : 'right'
    if (selectedItem === 'milk_bottle2')
        selectedItem = 'milk_bottle'
    let newObj = _gameThis.add.sprite(Phaser.Math.Between(400, 540), gameHeight * 0.35, 'corn_flakes')
    newObj.setOrigin(0.5, 1)
    newObj.scale = item.scale

    allPurchases.push(item)

    if (side === 'left') {
        reachLeft()
    } else {
        reachRight()
    }

    setTimeout(() => {
        newObj.anims.stop()
    }, 1000)
    newObj.anims.play(`${selectedItem}_drop`)
}

function show_total() {
    mrpText.setText(`${cost} KPI`)
    discText.setText(disc)
    totalText.setText(`${total} KPI`)
}

function game_over() {
    if (finalToastDisplayed) return;
    setTimeout(() => { gameOver = true; }, 2500)
    textGroup = _gameThis.add.group()

    hideGUI()
    let itemNames = [...new Set(allPurchases.map(i => i.key))]
    let text = ''
    for (let i = 0; i < itemNames.length; i++) {
        let qty = allPurchases.filter(j => j.key === itemNames[i]).length
        let itemDetails = allPurchases.find(k => k.key === itemNames[i])
        let discVal = itemDetails.discount * itemDetails.price * qty
        text += `(${qty}x)${itemDetails.key}(-${discVal * qty})=${qty * itemDetails.price - discVal}KPI \n`
    }
    let textObj = _gameThis.add.text(gameWidth * 0.33, gameHeight * 0.4, text, {
        fontSize: 16 - (itemNames.length > 5 ? (itemNames.length - 5) : 0),
        lineSpacing: 20 - (itemNames.length > 5 ? (itemNames.length - 5) * 4 : 0),
        fill: '#000000'
    })
    let totalObj = _gameThis.add.text(gameWidth * 0.5, gameWidth * 0.42,
        `Total: ${total} KPI`, {
        fontSize: 25,
        fill: '#000000'
    })
    totalObj.setOrigin(0.5)
    textGroup.add(textObj)
    textGroup.add(totalObj)

    M.toast({ html: LOSE_MESSAGE })
    finalToastDisplayed = true
}

//Keyboard handling, if applicable
function key_pressed(key) {
    let cursors = _gameThis.cursors
    switch (key) {
        case 1:
            return cursors.up.isDown || (justClicked && ('up_button' == selectedItem))
        case 2:
            return cursors.down.isDown || (justClicked && ('down_button' == selectedItem));
        default:
            return false;
    }
}

//Set game variables (Player driven)
function setVariable(variable, value) {
    switch (variable) {
        case 'cost':
            cost = parseFloat(value).toFixed(2)
            break
        case 'total':
            total = parseFloat(value).toFixed(2)
            break
    }
}

function move_forward() {
    if (canMove && !gameOver) {
        if (backgroundFrame < 28) {
            canMove = false
            backgroundFrame++
            updateBackgroundFrame()
            moveInventoryDown()
        }
    }
}

function move_backward() {
    if (canMove && !gameOver) {
        if (backgroundFrame > 1) {
            canMove = false
            backgroundFrame--
            updateBackgroundFrame()
            moveInventoryUp()
        }
    }
}

function updateBackgroundFrame() {
    background.setTexture(`bg${backgroundFrame}`)
    setTimeout(() => {
        canMove = true
    }, 100)
}

function sprite_touch(item) {
    if (justClicked && !gameOver) {
        justClicked = false
        if (item === 'product' && ![undefined, 'bg1', '', 'pay_btn', 'down_button', 'up_button'].includes(selectedItem)) {
            console.log('product')
            return true
        }
    }

    if (!payBtnClicked) {
        if (item === 'pay_button' && selectedItem == 'pay_btn') {
            console.log('pay_btn')
            payBtnClicked = true
            return true
        }
    }

    return false
}

function calculate(first, operator, second) {
    let res = 0.00
    switch (operator) {
        case "+":
            res = parseFloat(first) + parseFloat(second)
            break
        case "x":
            res = parseFloat(first) * parseFloat(second)
            break
        case "-":
            res = parseFloat(first) - parseFloat(second)
            break
    }
    return res.toFixed(2)
}

function getValue(variable) {
    let res = 0
    switch (variable) {
        case "cost":
            res = cost
            break
        case "total":
            res = total
            break
        case "product_discount":
            let obj = GAME_CONSTANT.spritesheets[selectedItem]
            if (!obj)
                return 0.00
            res = obj.discount * obj.price
            disc = `${obj.discount * 100}% (${res} KPI)`
            break
        case "product_cost":
            let obj2 = GAME_CONSTANT.spritesheets[selectedItem]
            if (!obj2)
                return 0.00
            res = obj2.price
            break

    }
    return res
}

function handleClickEvent(pointer, gameObject) {
    selectedItem = gameObject.name
    if (!justClicked) {
        justClicked = true
    }
}

function drawPoly(sprite, shape) {
    //  Uncomment return to show collision boxes.
    return
    var graphics = _gameThis.add.graphics({ x: sprite.x - sprite.displayOriginX, y: sprite.y - sprite.displayOriginY });

    graphics.lineStyle(2, 0x00aa00);

    graphics.beginPath();

    graphics.moveTo(shape.points[0].x, shape.points[0].y);

    for (var i = 1; i < shape.points.length; i++) {
        graphics.lineTo(shape.points[i].x, shape.points[i].y);
    }

    graphics.closePath();
    graphics.strokePath();
    allGraphics.push(graphics)
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
//     var xml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="pyN;|kI-Al_{kwR$_Bv/" x="32" y="-274"><field name="Variable name">total</field><value name="NAME"><block type="math_number" id="y{X/zP]ZGO^=/(Pwrkk+"><field name="NUM">0</field></block></value><next><block type="forever_repeat_block" id="`y3i!Q7zlA?wK^gB};k~"><statement name="NAME"><block type="controls_if" id="Qm?L-3D@U6eJ2{+d2|nN"><mutation elseif="1"></mutation><value name="IF0"><block type="key_sensing" id="H~TeCA`W}ukkBZWaC5[$"><field name="NAME">1</field></block></value><statement name="DO0"><block type="move_forward" id="xlyCA_m%Wl*BT(yM(opj"></block></statement><value name="IF1"><block type="key_sensing" id="P|lg{D@K#DYs[VDWN_-h"><field name="NAME">2</field></block></value><statement name="DO1"><block type="move_backward" id="tlWf.FY}^q;|y`N.VQhr"></block></statement><next><block type="controls_if" id="CtzKHE-y5=K~?%?.[l8P"><mutation elseif="1"></mutation><value name="IF0"><block type="sprite_touch" id="Sb}y`5ZX}3++cmQma#yV"><field name="NAME">product</field></block></value><statement name="DO0"><block type="drop_in_cart" id="P)_IdOEivA9~EdA#j[*:"><next><block type="controls_if" id="V$u*;#TUR^bs#g8PM)u+"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="rp:n5!x)BfwxOIeFdS$A"><field name="OP">GT</field><value name="A"><block type="variables" id="*f|t`6l93|$!4gi57A~E"><field name="Options">product_discount</field></block></value><value name="B"><block type="math_number" id="S2z$j^t`pk.yn#QxXh|4"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="set_variable_holder" id="*aEk)e5?)0fAgP9qy^Z8"><field name="Variable name">cost</field><value name="NAME"><block type="math_arithmetic" id="klrJJRNsFa8q[(U)a^X]"><field name="OP">MINUS</field><value name="A"><block type="variables" id="6aY-asX`VQw1NmDmjl^6"><field name="Options">product_cost</field></block></value><value name="B"><block type="variables" id="E=c*6kI2?LX1zH@,xs93"><field name="Options">product_discount</field></block></value></block></value></block></statement><statement name="ELSE"><block type="set_variable_holder" id="tRR+DXJkK1D;b!p.-5)]"><field name="Variable name">cost</field><value name="NAME"><block type="variables" id="%D42HsSk+[ZoM+gKdZ$0"><field name="Options">product_cost</field></block></value></block></statement><next><block type="set_variable_holder" id="!;@ydII{_};=vp#vltXD"><field name="Variable name">total</field><value name="NAME"><block type="math_arithmetic" id="2+~/..!m~LdcVI(+xEaP"><field name="OP">ADD</field><value name="A"><block type="variables" id="6J8R%x04XQdX09F*_k4u"><field name="Options">total</field></block></value><value name="B"><block type="variables" id="=bv@^.z}o:}Pz,isIZqe"><field name="Options">cost</field></block></value></block></value><next><block type="show_total" id="]7==)w?ZcVF]nIU]mksK"></block></next></block></next></block></next></block></statement><value name="IF1"><block type="sprite_touch" id="lwYvV+gAA;N#m[y0p^i/"><field name="NAME">pay_button</field></block></value><statement name="DO1"><block type="show_total" id="]]G3{KkB-O+2ew{de/e="><next><block type="game_over" id=":@_:tfWoz;yP#*?gR8zX"></block></next></block></statement></block></next></block></statement></block></next></block></xml>');
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

// const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="pyN;|kI-Al_{kwR$_Bv/" x="32" y="-274"><field name="Variable name">total</field><value name="NAME"><block type="math_number" id="y{X/zP]ZGO^=/(Pwrkk+"><field name="NUM">0</field></block></value><next><block type="forever_repeat_block" id="`y3i!Q7zlA?wK^gB};k~"><statement name="NAME"><block type="controls_if" id="Qm?L-3D@U6eJ2{+d2|nN"><mutation elseif="1"></mutation><value name="IF0"><block type="key_sensing" id="H~TeCA`W}ukkBZWaC5[$"><field name="NAME">1</field></block></value><statement name="DO0"><block type="move_forward" id="xlyCA_m%Wl*BT(yM(opj"></block></statement><value name="IF1"><block type="key_sensing" id="P|lg{D@K#DYs[VDWN_-h"><field name="NAME">2</field></block></value><statement name="DO1"><block type="move_backward" id="tlWf.FY}^q;|y`N.VQhr"></block></statement><next><block type="controls_if" id="CtzKHE-y5=K~?%?.[l8P"><mutation elseif="1"></mutation><value name="IF0"><block type="sprite_touch" id="Sb}y`5ZX}3++cmQma#yV"><field name="NAME">product</field></block></value><statement name="DO0"><block type="drop_in_cart" id="P)_IdOEivA9~EdA#j[*:"><next><block type="controls_if" id="V$u*;#TUR^bs#g8PM)u+"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="rp:n5!x)BfwxOIeFdS$A"><field name="OP">GT</field><value name="A"><block type="variables" id="*f|t`6l93|$!4gi57A~E"><field name="Options">product_discount</field></block></value><value name="B"><block type="math_number" id="S2z$j^t`pk.yn#QxXh|4"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="set_variable_holder" id="*aEk)e5?)0fAgP9qy^Z8"><field name="Variable name">cost</field><value name="NAME"><block type="math_arithmetic" id="klrJJRNsFa8q[(U)a^X]"><field name="OP">MINUS</field><value name="A"><block type="variables" id="6aY-asX`VQw1NmDmjl^6"><field name="Options">product_cost</field></block></value><value name="B"><block type="variables" id="E=c*6kI2?LX1zH@,xs93"><field name="Options">product_discount</field></block></value></block></value></block></statement><statement name="ELSE"><block type="set_variable_holder" id="tRR+DXJkK1D;b!p.-5)]"><field name="Variable name">cost</field><value name="NAME"><block type="variables" id="%D42HsSk+[ZoM+gKdZ$0"><field name="Options">product_cost</field></block></value></block></statement><next><block type="set_variable_holder" id="!;@ydII{_};=vp#vltXD"><field name="Variable name">total</field><value name="NAME"><block type="math_arithmetic" id="2+~/..!m~LdcVI(+xEaP"><field name="OP">ADD</field><value name="A"><block type="variables" id="6J8R%x04XQdX09F*_k4u"><field name="Options">total</field></block></value><value name="B"><block type="variables" id="=bv@^.z}o:}Pz,isIZqe"><field name="Options">cost</field></block></value></block></value><next><block type="show_total" id="]7==)w?ZcVF]nIU]mksK"></block></next></block></next></block></next></block></statement><value name="IF1"><block type="sprite_touch" id="lwYvV+gAA;N#m[y0p^i/"><field name="NAME">pay_button</field></block></value><statement name="DO1"><block type="show_total" id="]]G3{KkB-O+2ew{de/e="><next><block type="game_over" id=":@_:tfWoz;yP#*?gR8zX"></block></next></block></statement></block></next></block></statement></block></next></block></xml>'

const instruction = {
    "heading": "Write a program to navigate through the shop and put items into the cart, bill them considering discount, pay and purchase the items.",
    "steps": [
        {
            "checkbox": true,
            "rescue": true,
            "text": "set total to 0",
            "title": "Initialize variables",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "The following statements should function within the loop",
            "title": "Repeat forever loop",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If up arrow is pressed, move cart forward",
            "title": "Move the cart",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else If down arrow is pressed, move cart backward",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "If i touch product",
            "title": "Collect the Product",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": false,
            "text": "statements 1",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else if i touch pay button, show total, and game over",
            "title": "Pay button",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value><value name=\"IF1\"><block type=\"sprite_touch\" id=\"lwYvV+gAA;N#m[y0p^i/\"><field name=\"NAME\">pay_button</field></block></value><statement name=\"DO1\"><block type=\"show_total\" id=\"]]G3{KkB-O+2ew{de/e=\"><next><block type=\"game_over\" id=\":@_:tfWoz;yP#*?gR8zX\"></block></next></block></statement></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "drop product in cart",
            "title": "below are the statements 1 code:",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value><statement name=\"DO0\"><block type=\"drop_in_cart\" id=\"P)_IdOEivA9~EdA#j[*:\"></block></statement><value name=\"IF1\"><block type=\"sprite_touch\" id=\"lwYvV+gAA;N#m[y0p^i/\"><field name=\"NAME\">pay_button</field></block></value><statement name=\"DO1\"><block type=\"show_total\" id=\"]]G3{KkB-O+2ew{de/e=\"><next><block type=\"game_over\" id=\":@_:tfWoz;yP#*?gR8zX\"></block></next></block></statement></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "if product discount is greater than zero, set cost as product cost minus product discount",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value><statement name=\"DO0\"><block type=\"drop_in_cart\" id=\"P)_IdOEivA9~EdA#j[*:\"><next><block type=\"controls_if\" id=\"V$u*;#TUR^bs#g8PM)u+\"><value name=\"IF0\"><block type=\"logic_compare\" id=\"rp:n5!x)BfwxOIeFdS$A\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables\" id=\"*f|t`6l93|$!4gi57A~E\"><field name=\"Options\">product_discount</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S2z$j^t`pk.yn#QxXh|4\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"set_variable_holder\" id=\"*aEk)e5?)0fAgP9qy^Z8\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"klrJJRNsFa8q[(U)a^X]\"><field name=\"OP\">MINUS</field><value name=\"A\"><block type=\"variables\" id=\"6aY-asX`VQw1NmDmjl^6\"><field name=\"Options\">product_cost</field></block></value><value name=\"B\"><block type=\"variables\" id=\"E=c*6kI2?LX1zH@,xs93\"><field name=\"Options\">product_discount</field></block></value></block></value></block></statement></block></next></block></statement><value name=\"IF1\"><block type=\"sprite_touch\" id=\"lwYvV+gAA;N#m[y0p^i/\"><field name=\"NAME\">pay_button</field></block></value><statement name=\"DO1\"><block type=\"show_total\" id=\"]]G3{KkB-O+2ew{de/e=\"><next><block type=\"game_over\" id=\":@_:tfWoz;yP#*?gR8zX\"></block></next></block></statement></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "else set cost as product cost",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value><statement name=\"DO0\"><block type=\"drop_in_cart\" id=\"P)_IdOEivA9~EdA#j[*:\"><next><block type=\"controls_if\" id=\"V$u*;#TUR^bs#g8PM)u+\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"rp:n5!x)BfwxOIeFdS$A\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables\" id=\"*f|t`6l93|$!4gi57A~E\"><field name=\"Options\">product_discount</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S2z$j^t`pk.yn#QxXh|4\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"set_variable_holder\" id=\"*aEk)e5?)0fAgP9qy^Z8\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"klrJJRNsFa8q[(U)a^X]\"><field name=\"OP\">MINUS</field><value name=\"A\"><block type=\"variables\" id=\"6aY-asX`VQw1NmDmjl^6\"><field name=\"Options\">product_cost</field></block></value><value name=\"B\"><block type=\"variables\" id=\"E=c*6kI2?LX1zH@,xs93\"><field name=\"Options\">product_discount</field></block></value></block></value></block></statement><statement name=\"ELSE\"><block type=\"set_variable_holder\" id=\"tRR+DXJkK1D;b!p.-5)]\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"variables\" id=\"%D42HsSk+[ZoM+gKdZ$0\"><field name=\"Options\">product_cost</field></block></value></block></statement></block></next></block></statement><value name=\"IF1\"><block type=\"sprite_touch\" id=\"lwYvV+gAA;N#m[y0p^i/\"><field name=\"NAME\">pay_button</field></block></value><statement name=\"DO1\"><block type=\"show_total\" id=\"]]G3{KkB-O+2ew{de/e=\"><next><block type=\"game_over\" id=\":@_:tfWoz;yP#*?gR8zX\"></block></next></block></statement></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "add cost to total",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value><statement name=\"DO0\"><block type=\"drop_in_cart\" id=\"P)_IdOEivA9~EdA#j[*:\"><next><block type=\"controls_if\" id=\"V$u*;#TUR^bs#g8PM)u+\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"rp:n5!x)BfwxOIeFdS$A\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables\" id=\"*f|t`6l93|$!4gi57A~E\"><field name=\"Options\">product_discount</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S2z$j^t`pk.yn#QxXh|4\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"set_variable_holder\" id=\"*aEk)e5?)0fAgP9qy^Z8\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"klrJJRNsFa8q[(U)a^X]\"><field name=\"OP\">MINUS</field><value name=\"A\"><block type=\"variables\" id=\"6aY-asX`VQw1NmDmjl^6\"><field name=\"Options\">product_cost</field></block></value><value name=\"B\"><block type=\"variables\" id=\"E=c*6kI2?LX1zH@,xs93\"><field name=\"Options\">product_discount</field></block></value></block></value></block></statement><statement name=\"ELSE\"><block type=\"set_variable_holder\" id=\"tRR+DXJkK1D;b!p.-5)]\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"variables\" id=\"%D42HsSk+[ZoM+gKdZ$0\"><field name=\"Options\">product_cost</field></block></value></block></statement><next><block type=\"set_variable_holder\" id=\"!;@ydII{_};=vp#vltXD\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"2+~/..!m~LdcVI(+xEaP\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"6J8R%x04XQdX09F*_k4u\"><field name=\"Options\">total</field></block></value><value name=\"B\"><block type=\"variables\" id=\"=bv@^.z}o:}Pz,isIZqe\"><field name=\"Options\">cost</field></block></value></block></value></block></next></block></next></block></statement><value name=\"IF1\"><block type=\"sprite_touch\" id=\"lwYvV+gAA;N#m[y0p^i/\"><field name=\"NAME\">pay_button</field></block></value><statement name=\"DO1\"><block type=\"show_total\" id=\"]]G3{KkB-O+2ew{de/e=\"><next><block type=\"game_over\" id=\":@_:tfWoz;yP#*?gR8zX\"></block></next></block></statement></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": true,
            "rescue": true,
            "text": "show total",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"><block type=\"set_variable_holder\" id=\"pyN;|kI-Al_{kwR$_Bv/\" x=\"32\" y=\"-274\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_number\" id=\"y{X/zP]ZGO^=/(Pwrkk+\"><field name=\"NUM\">0</field></block></value><next><block type=\"forever_repeat_block\" id=\"`y3i!Q7zlA?wK^gB};k~\"><statement name=\"NAME\"><block type=\"controls_if\" id=\"Qm?L-3D@U6eJ2{+d2|nN\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"key_sensing\" id=\"H~TeCA`W}ukkBZWaC5[$\"><field name=\"NAME\">1</field></block></value><statement name=\"DO0\"><block type=\"move_forward\" id=\"xlyCA_m%Wl*BT(yM(opj\"></block></statement><value name=\"IF1\"><block type=\"key_sensing\" id=\"P|lg{D@K#DYs[VDWN_-h\"><field name=\"NAME\">2</field></block></value><statement name=\"DO1\"><block type=\"move_backward\" id=\"tlWf.FY}^q;|y`N.VQhr\"></block></statement><next><block type=\"controls_if\" id=\"CtzKHE-y5=K~?%?.[l8P\"><mutation elseif=\"1\"></mutation><value name=\"IF0\"><block type=\"sprite_touch\" id=\"Sb}y`5ZX}3++cmQma#yV\"><field name=\"NAME\">product</field></block></value><statement name=\"DO0\"><block type=\"drop_in_cart\" id=\"P)_IdOEivA9~EdA#j[*:\"><next><block type=\"controls_if\" id=\"V$u*;#TUR^bs#g8PM)u+\"><mutation else=\"1\"></mutation><value name=\"IF0\"><block type=\"logic_compare\" id=\"rp:n5!x)BfwxOIeFdS$A\"><field name=\"OP\">GT</field><value name=\"A\"><block type=\"variables\" id=\"*f|t`6l93|$!4gi57A~E\"><field name=\"Options\">product_discount</field></block></value><value name=\"B\"><block type=\"math_number\" id=\"S2z$j^t`pk.yn#QxXh|4\"><field name=\"NUM\">0</field></block></value></block></value><statement name=\"DO0\"><block type=\"set_variable_holder\" id=\"*aEk)e5?)0fAgP9qy^Z8\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"klrJJRNsFa8q[(U)a^X]\"><field name=\"OP\">MINUS</field><value name=\"A\"><block type=\"variables\" id=\"6aY-asX`VQw1NmDmjl^6\"><field name=\"Options\">product_cost</field></block></value><value name=\"B\"><block type=\"variables\" id=\"E=c*6kI2?LX1zH@,xs93\"><field name=\"Options\">product_discount</field></block></value></block></value></block></statement><statement name=\"ELSE\"><block type=\"set_variable_holder\" id=\"tRR+DXJkK1D;b!p.-5)]\"><field name=\"Variable name\">cost</field><value name=\"NAME\"><block type=\"variables\" id=\"%D42HsSk+[ZoM+gKdZ$0\"><field name=\"Options\">product_cost</field></block></value></block></statement><next><block type=\"set_variable_holder\" id=\"!;@ydII{_};=vp#vltXD\"><field name=\"Variable name\">total</field><value name=\"NAME\"><block type=\"math_arithmetic\" id=\"2+~/..!m~LdcVI(+xEaP\"><field name=\"OP\">ADD</field><value name=\"A\"><block type=\"variables\" id=\"6J8R%x04XQdX09F*_k4u\"><field name=\"Options\">total</field></block></value><value name=\"B\"><block type=\"variables\" id=\"=bv@^.z}o:}Pz,isIZqe\"><field name=\"Options\">cost</field></block></value></block></value><next><block type=\"show_total\" id=\"]7==)w?ZcVF]nIU]mksK\"></block></next></block></next></block></next></block></statement><value name=\"IF1\"><block type=\"sprite_touch\" id=\"lwYvV+gAA;N#m[y0p^i/\"><field name=\"NAME\">pay_button</field></block></value><statement name=\"DO1\"><block type=\"show_total\" id=\"]]G3{KkB-O+2ew{de/e=\"><next><block type=\"game_over\" id=\":@_:tfWoz;yP#*?gR8zX\"></block></next></block></statement></block></next></block></statement></block></next></block></xml>"
        },
        {
            "checkbox": false,
            "rescue": false,
            "text": "Use the up and down arrow keys to navigate the cart. Touch on the items in the shelves to drop them into the cart. When you have chosen enough items, click on the pay button to finish the purchase.",
            "title": "Instructions to play the game",
            "workspace": "<xml xmlns=\"https://developers.google.com/blockly/xml\"></xml>"
        }
    ]
};

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from shopping_cart import *\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function completedFlag() {
    return gameOver;
}


function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from shopping_cart import *"]

export {
    completedFlag,
    myUpdateFunction,
    // helpCode,
    runCode,
    reset_output,
    reInitValues,
    update,
    initTrolley,
    hasInitialized,
    drop_in_cart,
    move_forward,
    move_backward,
    show_total,
    sprite_touch,
    game_over,
    dummy,
    cost,
    total,
    default_,
    // product_discount,
    // product_cost,
    calculate,
    getNoOfBlocks,
    updateImports,
    // update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    repeat_forever_flag,
    instruction
}