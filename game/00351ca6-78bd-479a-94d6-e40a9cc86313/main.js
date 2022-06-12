/* Developed by Marvsoft LLP */

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

const GAME_CONSTANT = {
    images: {
        BG: "images/Background.png",
        Bone: "images/Bone.png",


    },
    spritesImages: {
        Dog: "images/Dog.png",
    }
};


let ErrorText;
let ErrorInnerText = '';
let GameIsOver = false;
let Middletext;

let dog;
let Bone;

let IsUp = true;

let IsDown = false;

let IsLeft = false;

let IsRight = false;

let Tmove;
let BoneEated = false;
let InHouse = false;

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



    let images = GAME_CONSTANT.images;
    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {

            if (key == 'BG') {
                _gameThis[key] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, key);
                _gameThis[key].setName(key)
            }

            if (key == 'Bone') {
                _gameThis[key] = _gameThis.add.image(_gameThis['BG'].x - _gameThis['BG'].displayWidth * 0.14, gameHeight * 0.65, key);
                _gameThis[key].setName(key);
                _gameThis[key].setScale(0.04, 0.04);
                Bone = _gameThis[key];
            }

        }
    }

    let spritesImages = GAME_CONSTANT.spritesImages;
    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            _gameThis[key] = _gameThis.add.sprite(gameWidth / 2, gameHeight / 2, key, 8);
            //dog
            if (key == 'Dog') {
                _gameThis[key].setPosition(_gameThis['BG'].x - _gameThis['BG'].displayWidth * 0.14, _gameThis['BG'].y + _gameThis['BG'].displayHeight * 0.44)
                _gameThis[key].setScale(7, 7)
                _gameThis[key].setName(key);
                dog = _gameThis[key];
                dog.setOrigin(0.5, 0.85)
            }
        }
    }



    ErrorText = _gameThis.add.text(0, 0, "Error...", { font: "bold 36px Arial", fill: "#ff0000" });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75)
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);


    Middletext = _gameThis.add.text(
        this.cameras.main.width * 0.5,
        this.cameras.main.height * 0.5,
        "", { font: "bold 68px Arial", fill: "#ffffff", stroke: '#000000', strokeThickness: 12 });
    Middletext.setOrigin(0.5, 0.5);
    Middletext.setVisible(false); //not used in this game so make it invisible

    //create dog possible animations
    this.anims.create({
        key: 'moveUp',
        frames: this.anims.generateFrameNumbers('Dog', { frames: [8, 9, 10, 11] }),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'aroundD',
        frames: this.anims.generateFrameNumbers('Dog', { frames: [16, 17, 18, 19] }),
        frameRate: 12,
        repeat: 0
    });
    this.anims.create({
        key: 'aroundU',
        frames: this.anims.generateFrameNumbers('Dog', { frames: [16, 17, 18, 19] }),
        frameRate: 12,
        repeat: 0
    });
    this.anims.create({
        key: 'movedown',
        frames: this.anims.generateFrameNumbers('Dog', { frames: [0, 1, 2, 3] }),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('Dog', { frames: [12, 13, 14, 15] }),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('Dog', { frames: [4, 5, 6, 7] }),
        frameRate: 12,
        repeat: -1
    });

    this.input.on('pointerdown', (pointer) => {
        //console.log('pointer',pointer.x,pointer.y);
        let color = this.textures.getPixel(pointer.x, pointer.y, 'BG');

        //console.log('color',color.red,color.blue,color.green);
        console.log('color', color)
    })





}

function game_over() {
    GameIsOver = true;
    console.log('game is over')
    M.toast({ html: "Good job, dog has eaten and reached home!" });
}

function completedFlag() {
    return GameIsOver;
}

function say(str) {
    //console.log('okl');
    Middletext.setText(str);
}


function dog_move_forward(N) {
    let T = 0;
    if (IsUp) {
        dog.play('moveUp');
        T = MoveNow(0, N * -1);
    } else if (IsDown) {
        dog.play('movedown');
        T = MoveNow(0, N * 1);
    } else if (IsLeft) {
        dog.play('left');
        T = MoveNow(-1 * N, 0);
    } else if (IsRight) {
        dog.play('right');
        T = MoveNow(1 * N, 0);
    }

    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, T); })
}

function dog_eat_bone_if_available() {
    let T = 0;
    //console.log(Phaser.Math.Distance.Between(dog.x, dog.y, Bone.x,Bone.y))
    if (Bone.visible && Phaser.Math.Distance.Between(dog.x, dog.y, Bone.x, Bone.y) < 96) {
        //dog eat Bone
        let sc = dog.scaleX;
        _gameThis.tweens.add({
            targets: dog,
            scaleX: sc * 1.2,
            scaleY: sc * 1.2,
            ease: 'Linear',
            duration: 100,
            yoyo: true,
            onYoyo: () => { Bone.setVisible(false); },
            onComplete: () => { BoneEated = true; }
        });
        T = 500;
    }
    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, T); })
}

function dog_turn(direction) {
    if (direction == "around") {
        //stop current animation
        dog.stop();
        //change directions
        if (IsUp) {
            IsLeft = false;
            IsUp = false;
            IsDown = true;
            IsRight = false;
            dog.play('aroundD');
        } else if (IsDown) {
            IsLeft = false;
            IsUp = true;
            dog.stop();
            dog.setTexture('Dog', '8');
            IsDown = false;
            IsRight = false;
        } else {
            IsUp = true;
            dog.stop();
            dog.setTexture('Dog', '8')
        }
    } else if (direction == "left") {
        IsLeft = true;
        IsUp = false;
        IsDown = false;
        IsRight = false;
        dog.stop();
        dog.setTexture('Dog', '12')
    } else if (direction == "right") {
        IsLeft = false;
        IsUp = false;
        IsDown = false;
        IsRight = true;
        dog.stop();
        dog.setTexture('Dog', '4')
    };

    return new Promise((resolve) => { setTimeout(() => { resolve(true) }, 500); })
}

function MoveNow(X, Y) {
    console.log('move to ', X, Y)

    //check for limits top/bottom left and right
    if (dog.y + (_gameThis.cameras.main.height / 30) * Y > _gameThis.cameras.main.height) {
        Y = Math.floor((_gameThis.cameras.main.height - dog.y) / (_gameThis.cameras.main.height / 30)) - 1;
        // console.log('correction',Y);
        ErrorInnerText = "Dog is leaving its path!";
        ShowError();
    }
    if (dog.y + (_gameThis.cameras.main.height / 30) * Y < _gameThis.cameras.main.height * 0.55) {
        Y = Math.floor((_gameThis.cameras.main.height * 0.55 - dog.y) / (_gameThis.cameras.main.height / 30));
        // console.log('correction',Y);
        ErrorInnerText = "Dog is leaving its path!";
        ShowError();
    }

    if (dog.x + (_gameThis.cameras.main.width / 30) * X > _gameThis.cameras.main.width) {
        X = Math.floor((_gameThis.cameras.main.width - dog.x) / (_gameThis.cameras.main.width / 30)) - 1;
        // console.log('correction',X);
        ErrorInnerText = "Dog is leaving its path!";
        ShowError();
    }
    if (dog.x + (_gameThis.cameras.main.width / 30) * X < 0) {
        X = Math.floor((0 - dog.x) / (_gameThis.cameras.main.width / 30)) + 1;
        // console.log('correction',X);
        ErrorInnerText = "Dog is leaving its path!";
        ShowError();
    }


    //calculate tween duration
    let S = Math.max(Math.abs(X), Math.abs(Y))

    if (Tmove) { if (Tmove.isPlaying()) { return; } }
    Tmove = _gameThis.tweens.add({
        targets: dog,
        x: dog.x + (_gameThis.cameras.main.width / 30) * X,
        y: dog.y + (_gameThis.cameras.main.height / 30) * Y,
        ease: 'Linear',
        duration: S * 100,
        onUpdate: () => {

            //scale the dog
            if (Y < 0) { dog.setScale(dog.scaleX - 0.013) }
            if (Y > 0) { dog.setScale(dog.scaleX + 0.013) }

            // console.log('moving');  check the yellow path
            let color = _gameThis.textures.getPixel(dog.x, dog.y, 'BG');
            // console.log('color',color);
            if (color.r < 220 || color.g < 190 || color.b > 185) {
                console.log('bad area color', color);
                //show the error
                ErrorInnerText = "Dog is leaving its path!";
                ShowError();
                //stop tween and animation
                Tmove.stop();
                dog.stop();
                //correct position
                if (Y < 0) { dog.setY(dog.y + 6) }
                if (Y > 0) { dog.setY(dog.y - 6) }
                if (X > 0) { dog.setX(dog.x - 6) }
                if (X < 0) { dog.setX(dog.x + 6) }
            }
        },
        onComplete: () => {
            if (Phaser.Math.Distance.Between(dog.x, dog.y, _gameThis.cameras.main.width * 0.9, _gameThis.cameras.main.height * 0.7) < 150) {
                InHouse = true;
            }
            console.log('completed', 'InHouse', InHouse);
            dog.stop();

            if (BoneEated && InHouse) {
                game_over();
            }

            if (!BoneEated && InHouse) {
                M.toast({ html: "Dog has forgotten to eat bone" });
            }

        }
    });




    return S * 100;
}



// async function doit() {
//     await dog_move_forward(7);
//     await dog_eat_bone_if_available();
//     await dog_turn("around");
//     await dog_move_forward(3);
//     await dog_turn("left");
//     await dog_move_forward(5);
//     await dog_turn("right");
//     await dog_move_forward(20);
// }


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
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            _gameThis.load.spritesheet(key, element, { frameWidth: 128 / 4, frameHeight: 288 / 9 });
        }
    }
}

function ShowError() {
    // ErrorText.setAlpha(1);
    // ErrorText.setText(ErrorInnerText); //use error text
    // //hide after 3 seconds
    // _gameThis.tweens.add({
    //     targets: ErrorText,
    //     alpha: 0,
    //     duration: 500,
    //     delay: 2500,
    //     onComplete: () => { ErrorInnerText = '' }
    // });

    M.toast({ html: "Dog is leaving its path!" });
}

function Start_Game() {
    console.log('------------------->Start_Game');
}

// Re-initialize the game variables
function reInitValues() {
    IsUp = true;
    IsDown = false;
    IsRight = false;
    IsLeft = false;
    var CanClick = true;
    BoneEated = false;
    GameIsOver = false;
    InHouse = false;
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
    var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "} c();";
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

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["import dog"]

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="move" id="Fz*0]%*jp=Y4|}#ZPjd1" x="58" y="180"><field name="NAME">Move Forward</field><value name="NAME"><block type="math_number" id="?sPpSeKwbmPrOE$?y}0R"><field name="NUM">7</field></block></value><next><block type="eat" id="/V{R[y?e1J%5w3?s.iKB"><next><block type="turn" id="9C3oFK!7eM~`8y4X1=gN"><field name="turn">around</field><next><block type="move" id="U%fCpvs*SC8sIiY8XlQr"><field name="NAME">Move Forward</field><value name="NAME"><block type="math_number" id="HVuI!7(:TzNg7`FIgzIT"><field name="NUM">3</field></block></value><next><block type="turn" id="Y@;.p%KK})LNbs.rmO%B"><field name="turn">right</field><next><block type="move" id="7dNcVuGNN8hA=(G,_7/L"><field name="NAME">Move Forward</field><value name="NAME"><block type="math_number" id="@(2d|}yGpJEKOfK8vN*~"><field name="NUM">16</field></block></value></block></next></block></next></block></next></block></next></block></next></block></xml>';

export { reset_output, completedFlag, runCode, getNoOfBlocks, updateImports, helpCode };