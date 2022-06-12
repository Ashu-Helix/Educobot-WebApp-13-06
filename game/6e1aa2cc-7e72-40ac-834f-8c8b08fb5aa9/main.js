// import M from 'materialize-css';
// import {
//     AUTO,
//     Game,
// } from 'phaser';

// import MSPhaserLib from '../msPhaserLib.min';

import M from "materialize-css";
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import MSPhaserLib from "../msPhaserLib.min";
import { CANVAS, Game, AUTO } from "phaser";

let demoWorkspace = Blockly.getMainWorkspace();
let noOfBlocks;


let _gameThis = null;
const baseURL = "../img/images/flappyBird";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const correctCounts = 50;
const magicElement = {
    Coins: { x: 600, y: 550, stay: 5, frameWidth: 115, frameHeight: 115, frameFrom: 0, frameTo: 8, frameRate: 10, repeat: 0 },
    bird: { x: 150, y: 550, stay: 5, frameWidth: 2668 / 4, frameHeight: 586, frameFrom: 0, frameTo: 3, frameRate: 10, repeat: 0 },
    numbers: { x: 1260, y: 565, stay: 99, frameWidth: 132, frameHeight: 86, frameFrom: 0, frameTo: 100, frameRate: 5, repeat: 0 }
}


const GAME_CONSTANT = {
    images: {
        // healthNotiferBg: "healthNotiferBg",
        background01: "Background/BG1",
        Background_0011: "Background/BG2",
        speechBubble: "speechBubble",
        topmenu: "Button_Timer_Km",
        toplives: "Lives",
        stick: "Stick/ss",
        Button_Score: "Button_Score",
        Bird_Hit: "SpriteSheet/Bird_Hit"

        // Background_0020: "Background/Background_0020",

    },
    spritesImages: {
        //bird: "Bird/frame-1",
        bird: "bird",
        Coins: "Coins",

        // numbers: "numbers",
    }
};


//blockly variables
let timer = 30;
let score = 0;
let lives = 3;
let SpeechInnerText = ''
let T1 = null; //timerevent
let TopMenu;
//functions to call by blockly
//Start_Game();
//reducetime(-1)  : reduce the timer every second
//reduceLives(-1)
//addScore(+1)
//YouWin()
//gameOver()
//ShowError
//variable to call by blockly
let ErrorText;
let ErrorInnerText = '';

let TopMenuLives;
let LivesTXT;
let is_game_over = false;


let screentouched = false;

let if_sec = '';
let else_sec = '';
let reduce_lives = false;
let timer_increment = 0;
let lives_increment = 0;
let score_increment = 0;
let dummy_increment = 0;
let dummy = 0;
let win_score = 1000;
let lose_life = -1000;



// let TimerText;
// let KMText;
let TotalTime = 0;
let TotalKm = 0;


let isflying = false;

//phaser variables
//moving backgrounds
let BG1;
let BG2;
//all coins
let AllCoins = [];
let lastCoin;
//all sticks
let AllStciks = [];
let lastStick;
let DistX = 4.5; //coef : distance between sticks
//world horizental speed
let speed = 6;
//spacekey down/up listeners
//let keySpace;

window['WorldIsMoving'] = false;
let BirdY = 0;

let _oMSPhaserLib;
let speechBubble;
let speechText;

let timerStep = -1;
let livesStep = 0;
let ScoreStep = 0;


let Button_Score;
// let ScoreTX;

let Bird_Hit;


let cursors;
// Phaser config
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
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1300 * 2 },
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};


// Initialize Phaser with config
window["game"] = new Phaser.Game(config);

// Phaser preload function
function preload() {
    // console.log('preload')
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);
    // Initialize MS phaser library - param -> phaser object, development-mode, depth-manager-start-index
    _oMSPhaserLib = new MSPhaserLib(this, true, 100);
    //  console.log('_oMSPhaserLib',_oMSPhaserLib)
    loadImages();
}

// Phaser create function
function create() {

    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;
    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            console.log('okok element', element)
            _gameThis[element] = _gameThis.add.image(gameWidth / 2, gameHeight / 2, element);

            if (element == "speechBubble") {
                speechBubble = _gameThis[element];
                speechText = _gameThis.add.text(gameWidth / 2, gameHeight / 2, "You Win!", { font: "bold 48px Arial", fill: "#000000" });
                speechText.setOrigin(0.5, 0.5);


            }

            if (element == "Button_Timer_Km") {
                TopMenu = _gameThis[element];

            }
            if (element == "Lives") {
                TopMenuLives = _gameThis[element];
                TopMenuLives.setPosition(gameWidth * 0.88, TopMenuLives.displayHeight * 0.6);
                window['LivesTXT'] = _gameThis.add.text(TopMenuLives.x + TopMenuLives.displayWidth * 0.26, TopMenuLives.y, lives, {
                    font: 'bold 38pt arial',
                    color: '#ffffff',
                }).setOrigin(0.5, 0.5);

            }

            if (element == "Background/BG2") {
                _gameThis[element].setPosition(gameWidth + _gameThis[element].displayWidth * 0.5, gameHeight / 2);
            }
            if (element == "Stick/ss") {
                //use 5 sticks
                AllStciks = [
                    _gameThis[element],
                    _gameThis.add.image(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.image(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.image(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.image(gameWidth / 2, gameHeight / 2, element)
                ]
            }
            if (element == 'Button_Score') {
                //top right score
                Button_Score = _gameThis[element];
                Button_Score.setPosition(gameWidth * 0.72, Button_Score.displayHeight * 0.6);
                window['ScoreTX'] = _gameThis.add.text(Button_Score.x + Button_Score.displayWidth * 0.26, Button_Score.y, "0", {
                    font: 'bold 38pt arial',
                    color: '#ffffff',
                }).setOrigin(0.5, 0.5);
            }
            if (element == 'SpriteSheet/Bird_Hit') {
                Bird_Hit = _gameThis[element];
                Bird_Hit.setScale(0.75);
                Bird_Hit.setAlpha(0);
            }
        }
    }

    BG1 = _gameThis['Background/BG1'];
    BG2 = _gameThis['Background/BG2'];


    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = magicElement[element];
            if (element == 'bird') {
                _gameThis[element] = _gameThis.physics.add.sprite(elementValue.x, elementValue.y, element);
                _gameThis[element].body.allowGravity = false;

            } else if (element == "Coins") {
                //use 5 sticks
                AllCoins = [
                    _gameThis.add.sprite(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.sprite(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.sprite(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.sprite(gameWidth / 2, gameHeight / 2, element),
                    _gameThis.add.sprite(gameWidth / 2, gameHeight / 2, element)
                ]
            }

        }
    }
    ArrangeStick();
    ArrangeCoins();
    init();

    ErrorText = _gameThis.add.text(0, 0, "Error...", { font: "bold 36px Arial", fill: "#ff0000" });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75)
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);

    speechBubble.setDepth(3);
    speechText.setDepth(3);
    //listen to wrong key board key
    WrongkeyAlert();

    window['TimerText'] = _gameThis.add.text(TopMenu.x - TopMenu.displayWidth * 0.2, TopMenu.y - TopMenu.displayHeight * 0.17, "00   00", { font: "bold 42px Arial", fill: "#ffffff" });
    window['KMText'] = _gameThis.add.text(TopMenu.x + TopMenu.displayWidth * 0.09, TopMenu.y - TopMenu.displayHeight * 0.26, "00", { font: "bold 52px Arial", fill: "#ffffff" });

    window['TimerText'].setDepth(3);
    window['TimerText'].setVisible(false);
    window['KMText'].setDepth(3);
}



function ShowError() {
    ErrorText.setAlpha(1);
    ErrorText.setText(ErrorInnerText); //use error text
    //hide after 3 seconds
    _gameThis.tweens.add({
        targets: ErrorText,
        alpha: 0,
        duration: 500,
        delay: 2500
    });
}



function Start_Game() {

    if (!window['WorldIsMoving']) {
        console.log('------------------->Start_Game');

        window['WorldIsMoving'] = true; //if true the update function will move the entire world ( background+obstacles+coins...)
        // _gameThis['bird'].body.allowGravity = true;
        if (T1 == null) {
            T1 = _gameThis.time.addEvent({ delay: 1000, callback: CountDownTime, callbackScope: _gameThis, loop: true });
        }
        reducetime();
    }

}



function WrongkeyAlert() {
    //listen to wrong keyboard key , only space key is allowed
    //spacekey code  = 32
    _gameThis.input.keyboard.on('keyup', function (event) {

        if (event.keyCode != 32 && window['WorldIsMoving']) {
            //set the value of the ErrorInnerText and show the error
            ErrorInnerText = ' You have selected the\n wrong key for flapping '
            ShowError();
        }
    });
}

function CountDownTime() {
    //will run automatically when user give a value to timer_increment diffrent from 0
    if (timer_increment != 0 && timer > 0) {
        timer = timer += timer_increment;
        // console.log(timer)
    }
}

function MoveWorld() {

    //move background
    BG1.x -= speed;
    BG2.x -= speed;
    if (BG1.x <= -BG1.displayWidth / 2) {
        BG1.setPosition(BG2.x + BG2.displayWidth * 0.497 + BG1.displayWidth * 0.5, gameHeight / 2);
        TotalKm++;
    }
    if (BG2.x <= -BG2.displayWidth / 2) {
        BG2.setPosition(BG1.x + BG1.displayWidth * 0.5 + BG2.displayWidth * 0.5, gameHeight / 2);
        TotalKm++;
    }
    //move obstacles
    for (let i = 0; i < AllStciks.length; i++) {
        AllStciks[i].x -= speed;
        if (AllStciks[i].x < -AllStciks[i].displayWidth * 0.5) {
            if (!lastStick) {
                AllStciks[i].x = AllStciks[AllStciks.length - 1].x + gameWidth / DistX;
                lastStick = AllStciks[i];
            } else {
                AllStciks[i].x = lastStick.x + gameWidth / DistX;
                lastStick = AllStciks[i];
            }
            if (Math.random() * 10 < 5) {
                AllStciks[i].flipY = false;
                AllStciks[i].setY(gameHeight - (AllStciks[i].displayHeight * 0.5) + (Math.random() * AllStciks[i].displayHeight * 0.5));
            } else {
                AllStciks[i].setY((AllStciks[i].displayHeight * 0.5) - (Math.random() * AllStciks[i].displayHeight * 0.5));
                AllStciks[i].flipY = true;
            }
        }
    }
    //Move Coins
    for (let c = 0; c < AllStciks.length; c++) {
        AllCoins[c].x -= speed;
        if (AllCoins[c].x < -AllCoins[c].displayWidth * 0.5) {
            if (!lastCoin) {
                AllCoins[c].x = AllCoins[AllCoins.length - 1].x + gameWidth / DistX;
                AllCoins[c].setVisible(true);
                lastCoin = AllCoins[c];
            } else {
                AllCoins[c].x = lastCoin.x + gameWidth / DistX;
                AllCoins[c].setVisible(true);
                lastCoin = AllCoins[c];
            }

        }
    }
}

function ArrangeStick() {
    for (let i = 0; i < AllStciks.length; i++) {
        AllStciks[i].setX(gameWidth + (i * gameWidth / DistX)); //
        AllStciks[i].setY((AllStciks[i].displayHeight * 0.5) - (Math.random() * AllStciks[i].displayHeight * 0.5));
        AllStciks[i].flipY = true;
        if (Math.random() * 10 < 5) {
            // console.log('flip now');
            AllStciks[i].flipY = false;
            AllStciks[i].setY(gameHeight - (AllStciks[i].displayHeight * 0.5) + (Math.random() * AllStciks[i].displayHeight * 0.5));
        }
    }
}

function ArrangeCoins() {
    let spritesImages = GAME_CONSTANT.spritesImages;
    let coinValue = magicElement.Coins;
    for (let i = 0; i < AllCoins.length; i++) {
        AllCoins[i].setX(gameWidth + (gameWidth * 0.5 / DistX) + (i * gameWidth / DistX)); //
        AllCoins[i].setY((gameHeight * 0.2) + (Math.random() * gameHeight * 0.6));
        let coin = AllCoins[i]
        _oMSPhaserLib.spriteAnimation(coin, spritesImages.Coins, coinValue.frameFrom, coinValue.frameTo, coinValue.frameRate, -1);
    }


}

function flap_wing() {
    if (window['WorldIsMoving']) {
        if (isflying) { return; }
        console.log('Fly');
        isflying = true;
        FlaptheWing();
        _gameThis['bird'].body.allowGravity = false;
        _gameThis['bird'].setVelocityY(-300 * 4);
        // _gameThis['bird'].setAccelerationY(-98 * 7);
        // _gameThis['bird'].setVelocityY(-300 * 2);
        _gameThis.time.addEvent({
            delay: 300,
            callback: () => {

                _gameThis['bird'].setVelocityY(0);
                // gravity_effect();
                // _gameThis['bird'].body.allowGravity = true;
            },
            callbackScope: _gameThis,
            loop: false
        });

    }
}
'<xml xmlns="https://developers.google.com/blockly/xml"><block type="single_action_block" id="hZZqIXSHFJ4b)g9H^)qS" x="37" y="112"><next><block type="forever_repeat_block" id="@g9]VX?h$HjX!0mgWan`"><statement name="NAME"><block type="controls_if" id=".b(DKfit9^o.ej43unXf"><mutation else="1"></mutation><value name="IF0"><block type="key_sensing" id="%0v`_boFmLY2a=qjB]UD"><field name="NAME">option5</field></block></value><statement name="DO0"><block type="fly" id="7:LslEWB%(*4Wo6S~^7}"></block></statement><statement name="ELSE"><block type="gravity" id="LD|;^2i+lXgL=Ny+n=tU"></block></statement></block></statement></block></next></block></xml>'

function gravity_effect() {
    if (window['WorldIsMoving']) {
        _gameThis['bird'].setVelocityY(200);
        _gameThis['bird'].body.setGravity(0, 9000);
        _gameThis['bird'].body.allowGravity = true;
        // console.log("gravity effect")

        // if (_gameThis['bird'].body.allowGravity)
        // _gameThis['bird'].setVelocityY(400);
        // _gameThis['bird'].setAccelerationY(98 * 25);
    }
}

function is_space_pressed() {
    if (!cursors.space.isDown) { isflying = false; }
    if (!screentouched) { isflying = false; }
    // console.log("space_key", cursors.space.isDown)
    let B = false;
    if (cursors.space.isDown) { B = true; }
    if (screentouched) { B = true; }
    return B;
}

function is_bird_touching_obstacle() {

    let touched = false;
    if (_gameThis['bird'].alpha < 1) { return touched; }


    for (let i = 0; i < AllStciks.length; i++) {
        if (
            Math.abs(AllStciks[i].x - _gameThis.bird.x) < (AllStciks[i].displayWidth * 0.5 + _gameThis.bird.displayWidth * 0.5) * 0.9 &&
            Math.abs(AllStciks[i].y - _gameThis.bird.y) < Math.abs(AllStciks[i].displayHeight * 0.5 + _gameThis.bird.displayHeight * 0.5) * 0.9
        ) {
            touched = true;

            _gameThis['bird'].setAlpha(0.9);

            Bird_Hit.setPosition(_gameThis['bird'].x, _gameThis['bird'].y);
            _gameThis.tweens.add({
                targets: Bird_Hit,
                scaleX: 1,
                alpha: 1,
                ease: "Linear",
                duration: 200,
                repeat: 1,
                yoyo: true,
                onComplete: () => { Bird_Hit.setAlpha(0) }
            });

            _gameThis.tweens.add({
                targets: _gameThis['bird'],
                alpha: 1,
                ease: "Linear",
                duration: 1000,
            });

            break;
        }
    }
    return touched;
}

function is_bird_touching_ground() {

    let touched = false;
    if (_gameThis['bird'].alpha < 1) { return touched; }

    if (_gameThis.bird.y > gameHeight - _gameThis.bird.displayHeight * 0.5) {
        touched = true;

        _gameThis['bird'].setAlpha(0.9);
        Bird_Hit.setPosition(_gameThis['bird'].x, _gameThis['bird'].y);
        _gameThis.tweens.add({
            targets: Bird_Hit,
            scaleX: 1,
            alpha: 1,
            ease: "Linear",
            duration: 200,
            repeat: 1,
            yoyo: true,
            onComplete: () => { Bird_Hit.setAlpha(0) }
        });

        _gameThis.tweens.add({
            targets: _gameThis['bird'],
            alpha: 1,
            ease: "Linear",
            delay: 2000,
            duration: 1000,
        });
    }

    return touched;
}

function is_bird_touching_coin() {
    let touched = false;
    for (let i = 0; i < AllCoins.length; i++) {
        if (
            Math.abs(AllCoins[i].x - _gameThis.bird.x) < (AllCoins[i].displayWidth * 0.5 + _gameThis.bird.displayWidth * 0.5) * 0.9 &&
            Math.abs(AllCoins[i].y - _gameThis.bird.y) < Math.abs(AllCoins[i].displayHeight * 0.5 + _gameThis.bird.displayHeight * 0.5) * 0.9
        ) {
            // console.log('collide with coins');
            if (AllCoins[i].visible) {
                AllCoins[i].visible = false;
                touched = true;
            }
        }
    }
    return touched;
}

function createDialogue(dialogue) {
    let delayTime = 1000;
    delayTime = delayTime < 3000 ? 3000 : delayTime;
    speechText.text = dialogue;
    speechBubble.alpha = 1;
    _oMSPhaserLib.fadeIn(speechBubble);
    _oMSPhaserLib.fadeIn(speechText);
    setTimeout(() => {
        _oMSPhaserLib.fadeOut(speechBubble);
        _oMSPhaserLib.fadeOut(speechText);
    }, delayTime);
}

function game_win() {
    if (SpeechInnerText.length > 0) { speechText.setText(SpeechInnerText); }
    speechBubble.alpha = speechText.alpha = 1;
    _gameThis['bird'].setVelocityY(0);
    _gameThis['bird'].body.allowGravity = false;
    window['WorldIsMoving'] = false;
    setTimeout(() => {
        is_game_over = true;
    }, 2500)
}

function game_over() {
    createDialogue("Game Over");
    window['WorldIsMoving'] = false;
    gravity_effect();
    console.log("game is over")
    setTimeout(() => {
        is_game_over = true;
    }, 2500)
}
// Phaser update function
// function update() {

//     if (WorldIsMoving) {
//         KMText.setText(TotalKm.toString());
//         TimerText.setText(FormatTime(timer * 1000));
//         ScoreTX.setText(score);
//         MoveWorld();


//         if (is_space_pressed()) {
//             flap_wing();
//         } else {
//             gravity_effect();
//         }

//     }


//     if (is_bird_touching_ground() || is_bird_touching_obstacle()) {
//         lives -= 1;
//         LivesTXT.setText(lives);
//     }

//     if (lives == 0) {
//         game_over();
//     }

//     if (is_bird_touching_coin()) {
//         score += 1;
//         console.log('score', score)
//     }
//     if (score >= 5) {
//         game_win();
//     }

// }
// }

function update() { }

// Start_Game();
// function update() {
//     if (WorldIsMoving) {
//         KMText.setText(TotalKm.toString());
//         TimerText.setText(FormatTime(timer * 1000));
//         ScoreTX.setText(score);
//         MoveWorld();

//         if (is_space_pressed()) {
//             flap_wing();
//         }

//     }
// }

// Load images
function loadImages() {
    let images = GAME_CONSTANT.images;
    let spritesImages = GAME_CONSTANT.spritesImages;

    for (const key in images) {
        if (Object.hasOwnProperty.call(images, key)) {
            const element = images[key];
            _gameThis.load.image(element, element + ".png");
        }
    }

    for (const key in spritesImages) {
        if (Object.hasOwnProperty.call(spritesImages, key)) {
            const element = spritesImages[key];
            const elementValue = magicElement[element];
            _gameThis.load.spritesheet(element, "SpriteSheet/" + element + ".png", { frameWidth: elementValue.frameWidth, frameHeight: elementValue.frameHeight });
        }
    }
}

// Initialize animation functions
function init() {
    // console.log('init')
    speechBubble.setScale(0.5);
    speechBubble.setPosition(gameWidth - speechBubble.displayWidth * 0.6, speechBubble.displayHeight);
    speechText.setPosition(speechBubble.x, speechBubble.y - speechBubble.displayHeight * 0.15)

    speechBubble.setAlpha(0);
    speechText.setAlpha(0);

    _gameThis.bird.scale = 0.25;

    TopMenu.setPosition(gameWidth / 2, TopMenu.displayHeight * 0.6);
    TopMenu.setDepth(3);




    cursors = _gameThis.input.keyboard.createCursorKeys();
    _gameThis.input.on('pointerdown', () => {

        screentouched = true;
        console.log("clicked screen - DOWN", screentouched)
    })
    _gameThis.input.on('pointerup', () => {
        screentouched = false;
        console.log("clicked screen - UP", screentouched)
    })
}


function FlaptheWing() {
    //play bird animation
    let spritesImages = GAME_CONSTANT.spritesImages;
    let bird = _gameThis[spritesImages.bird];
    let birdValue = magicElement.bird;
    _oMSPhaserLib.spriteAnimation(bird, spritesImages.bird, birdValue.frameFrom, birdValue.frameTo, birdValue.frameRate, 1);

}


function reducetime(Value) { //value is an option
    if (Value) { timerStep = Value }
    timer += timerStep;
    if (timer > 0) { _gameThis.time.addEvent({ delay: 1000, callback: reducetime, callbackScope: _gameThis, loop: false }) };
    // console.log('--> timer', timer);
}





// Re-initialize the game variables
function reInitValues() {
    // timer = 30;
    // score = 0;
    // lives = 3;





    // if_sec = '';
    // else_sec = '';
    // reduce_lives = false;
    // lives_increment = 0;
    // score_increment = 0;
    // dummy_increment = 0;
    // dummy = 0;
    // win_score = 1000;
    // lose_life = -1000;



    // WorldIsMoving = false;
    // BirdY = 0;

    // timerStep = -1;
    // livesStep = 0;
    // ScoreStep = 0;

}

// Reset the game
function reset_output() {
    console.log('reset_output')
    timer_increment = 0;
    window['WorldIsMoving'] = false;
    is_game_over = false;

    TotalKm = 0;
    //stop timer
    if (T1) {
        T1.remove(CountDownTime)
        T1 = null;
    }

    reInitValues();
    _gameThis.scene.restart();
}


function FormatTime(n, countdownfrom) {
    if (countdownfrom) {
        n = countdownfrom - n;
    }
    var m = Math.floor(n / 60000);
    var s = Math.floor((n / 1000) - (m * 60));
    var ms = n - (s * 1000) - (m * 60000);
    var M = m.toString();
    if (M.length == 1) {
        M = '0' + M;
    }
    var S = s.toString();
    if (S.length == 1) {
        S = '0' + S;
    }
    var MS = Math.floor(ms / 10).toString();
    if (MS.length == 1) {
        MS = '0' + MS;
    }
    var RS = S + '   ' + MS; //M + ':' + S + ':' + MS;
    return RS;
}

function completedFlag() {
    return is_game_over;
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
//     var xml = Blockly.Xml.textToDom('<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="+ii.L@OqUS^zz0`=r!i(" x="-94" y="-215"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="m?0:%3z`e`p)w-0D.+pd"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="=~pCi#8LZ.9`uRj+YU*2"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="qhi~IhwTybP^CZoidaq?"><field name="NUM">5</field></block></value><next><block type="single_action_block" id="U4gYX)gP6,J:D~,:pNoN"><next><block type="forever_repeat_block" id="=KZfBa{lKuuAWLFLz9.r"><statement name="NAME"><block type="controls_if" id="v(@e*Xg_?Fom6)`?;r9m"><mutation else="1"></mutation><value name="IF0"><block type="key_sensing" id="A{Be}gk9E]5a-v%#*t=V"><field name="NAME">option5</field></block></value><statement name="DO0"><block type="fly" id=";[+8hbtRvfvoc:E;CD2?"></block></statement><statement name="ELSE"><block type="gravity" id="y2*yhgCUOqZhoBleInl."></block></statement><next><block type="controls_if" id="!-EC~4)3Mog9mD%HQ:6:"><value name="IF0"><block type="spritetouch__block" id="+7FPVgHeldxuJaP=1pWq"><field name="options1">Bird</field><field name="options2">Obstacle</field></block></value><statement name="DO0"><block type="change_variable_holder" id="D3h.]+ct@~YZ9mpS.vBq"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="fip7}cVapNgZ*z+Q|22q"><field name="NUM">-1</field></block></value></block></statement><next><block type="controls_if" id="j.4NR6nltY~K.@;%mtfH"><value name="IF0"><block type="spritetouch__block" id="[%m]M{t]UbEmJ!a7j%IF"><field name="options1">Bird</field><field name="options2">Ground</field></block></value><statement name="DO0"><block type="change_variable_holder" id="p7VV-#$cJIu=Vh~y37d-"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="^Vs7?I-VNd5FFsZhpeZN"><field name="NUM">-1</field></block></value></block></statement><next><block type="controls_if" id="v)7Z6Apnc^E+8k_(?:O/"><value name="IF0"><block type="spritetouch__block" id="v(Ahx~jY2djU5,P-WG7c"><field name="options1">Bird</field><field name="options2">Coin</field></block></value><statement name="DO0"><block type="change_variable_holder" id="tA=qN3?^@j`w$rF-$MrF"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="{[LBUl30mi[!W~r+w^Qm"><field name="NUM">1</field></block></value></block></statement><next><block type="controls_if" id="7Eb7EehWt~BztAi+NP$x"><value name="IF0"><block type="logic_compare" id="3z4,Nnjp.v)DpbBkGjB9"><field name="OP">GTE</field><value name="A"><block type="variables" id="P}Ht%USXStR7G6]Eqk;I"><field name="Options">score</field></block></value><value name="B"><block type="math_number" id="s3Q,;O-FabJZmn.pbCWs"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="win_block" id="a@z+tpLlfOMfHCVjyDwE"></block></statement><next><block type="controls_if" id="7iYlc/{mc`I]L$T6rvia"><value name="IF0"><block type="logic_compare" id=")AOa6sy4vfM/;fH-8DQ,"><field name="OP">LTE</field><value name="A"><block type="variables" id="oN$d~!Hc}n!d7_6rcthS"><field name="Options">lives</field></block></value><value name="B"><block type="math_number" id="ELgh*T2_Q#;4k8?J|u#k"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="end_block" id="CS1%`Pz](5=Lfwjjn314"></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>');
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);

// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="+ii.L@OqUS^zz0`=r!i(" x="-94" y="-215"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="m?0:%3z`e`p)w-0D.+pd"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="=~pCi#8LZ.9`uRj+YU*2"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="qhi~IhwTybP^CZoidaq?"><field name="NUM">5</field></block></value><next><block type="single_action_block" id="U4gYX)gP6,J:D~,:pNoN"><next><block type="forever_repeat_block" id="=KZfBa{lKuuAWLFLz9.r"><statement name="NAME"><block type="controls_if" id="v(@e*Xg_?Fom6)`?;r9m"><mutation else="1"></mutation><value name="IF0"><block type="key_sensing" id="A{Be}gk9E]5a-v%#*t=V"><field name="NAME">option5</field></block></value><statement name="DO0"><block type="fly" id=";[+8hbtRvfvoc:E;CD2?"></block></statement><statement name="ELSE"><block type="gravity" id="y2*yhgCUOqZhoBleInl."></block></statement><next><block type="controls_if" id="!-EC~4)3Mog9mD%HQ:6:"><value name="IF0"><block type="spritetouch__block" id="+7FPVgHeldxuJaP=1pWq"><field name="options1">Bird</field><field name="options2">Obstacle</field></block></value><statement name="DO0"><block type="change_variable_holder" id="D3h.]+ct@~YZ9mpS.vBq"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="fip7}cVapNgZ*z+Q|22q"><field name="NUM">-1</field></block></value></block></statement><next><block type="controls_if" id="j.4NR6nltY~K.@;%mtfH"><value name="IF0"><block type="spritetouch__block" id="[%m]M{t]UbEmJ!a7j%IF"><field name="options1">Bird</field><field name="options2">Ground</field></block></value><statement name="DO0"><block type="change_variable_holder" id="p7VV-#$cJIu=Vh~y37d-"><field name="Variable name">lives</field><value name="NAME"><block type="math_number" id="^Vs7?I-VNd5FFsZhpeZN"><field name="NUM">-1</field></block></value></block></statement><next><block type="controls_if" id="v)7Z6Apnc^E+8k_(?:O/"><value name="IF0"><block type="spritetouch__block" id="v(Ahx~jY2djU5,P-WG7c"><field name="options1">Bird</field><field name="options2">Coin</field></block></value><statement name="DO0"><block type="change_variable_holder" id="tA=qN3?^@j`w$rF-$MrF"><field name="Variable name">score</field><value name="NAME"><block type="math_number" id="{[LBUl30mi[!W~r+w^Qm"><field name="NUM">1</field></block></value></block></statement><next><block type="controls_if" id="7Eb7EehWt~BztAi+NP$x"><value name="IF0"><block type="logic_compare" id="3z4,Nnjp.v)DpbBkGjB9"><field name="OP">GTE</field><value name="A"><block type="variables" id="P}Ht%USXStR7G6]Eqk;I"><field name="Options">score</field></block></value><value name="B"><block type="math_number" id="s3Q,;O-FabJZmn.pbCWs"><field name="NUM">10</field></block></value></block></value><statement name="DO0"><block type="win_block" id="a@z+tpLlfOMfHCVjyDwE"></block></statement><next><block type="controls_if" id="7iYlc/{mc`I]L$T6rvia"><value name="IF0"><block type="logic_compare" id=")AOa6sy4vfM/;fH-8DQ,"><field name="OP">LTE</field><value name="A"><block type="variables" id="oN$d~!Hc}n!d7_6rcthS"><field name="Options">lives</field></block></value><value name="B"><block type="math_number" id="ELgh*T2_Q#;4k8?J|u#k"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="end_block" id="CS1%`Pz](5=Lfwjjn314"></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from flappy_bird import *\n";
    document.getElementById('pycode').innerHTML = import_statement + code;
    document.getElementById('modal1').innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from flappy_bird import *"]


export {
    completedFlag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    // start_customer_arrival,
    game_over,
    game_win,
    // WorldIsMoving,
    // KMText,
    TotalKm,
    // TimerText,
    FormatTime,
    timer,
    // ScoreTX,
    score,
    MoveWorld,
    createDialogue,
    flap_wing,
    gravity_effect,
    is_space_pressed,
    Start_Game,
    is_bird_touching_ground,
    is_bird_touching_obstacle,
    is_bird_touching_coin,
    // score,
    lives,
    dummy,
    getNoOfBlocks,
    updateImports,
    repeat_forever_flag,
    update,
    // game,
    preload,
    create,
    gameHeight,
    gameWidth,
}