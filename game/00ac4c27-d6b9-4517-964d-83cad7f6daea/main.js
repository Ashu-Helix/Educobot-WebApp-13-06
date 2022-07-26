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
const baseURL = "../img/images/00ac4c27-d6b9-4517-964d-83cad7f6daea";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
let all_seen = false;
const GAME_CONSTANT = {
    images: {
        BG: "Background.png",
        Success: "Success.png",
        Failure: "Failure.png",
        Counter: "Counter.png",
        Scale: "Scale.png",
        arrow: "arrow.png",
    },
    spritesImages: {
        Client1: "Client1.png",
        Client2: "Client2.png",
        Client3: "Client3.png",
        Client4: "Client4.png",
    },
};

let dummy = 0;
let ErrorText;
let run_ = true;
let ErrorInnerText = "";
let GameIsOver = false;
let Middletext;
let PossibleClients = shuffle([1, 2, 3, 4]);
let clientCounter = 0;
//================= GAME VARIABLES ====================================================================================================
//=====================================================================================================================================
let BG;
let Client1;
let Client2;
let Client3;
let Client4;
let Current_Client;
let CC; //<< Current Client Index
let Counter;
let Failure_Sign;
let Success_Sign;
let Roller;
let Scale;
//let Scaling1; let Scaling2;
let Arrow;
let height = 0;
//=====================================================================================================================================
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
    scene: { preload: preload, create: create, update: update },
};
// Initialize Phaser with config
let game = new Phaser.Game(config);
// Phaser preload function
function preload() {
    _gameThis = this;
    _gameThis.load.setBaseURL(baseURL);
    this.load.atlas("roller", "roller.png", "roller.json");
    loadImages();
}
// Phaser create function
function create() {
    BG = this.add.image(gameWidth / 2, gameHeight / 2, "BG").setName("BG");
    _gameThis["BG"] = BG;
    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);
    Middletext = _gameThis.add.text(500, 200, "", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 12,
    });
    Middletext.setOrigin(0.5, 0.5);
    //=====================================================================================================================================
    //================= ADDING GRAPHICS ========================================================================================================
    //=====================================================================================================================================
    Roller = this.add.sprite(2420, 80, "roller", "r1.png");

    Counter = this.add.image(1420, 1700, "Counter");
    Scale = this.add.image(800, 740, "Scale");
    Scale.alpha = 0;

    Client1 = this.add.sprite(-400, 740, "Client1").setName("Client1");
    Client2 = this.add.sprite(-400, 805, "Client2").setName("Client2");
    Client3 = this.add.sprite(-400, 820, "Client3").setName("Client3");
    Client4 = this.add.sprite(-400, 820, "Client4").setName("Client4");

    Client1.setY(gameHeight - Client1.displayHeight * 0.47);
    Client2.setY(gameHeight - Client2.displayHeight * 0.47);
    Client3.setY(gameHeight - Client3.displayHeight * 0.47);
    Client4.setY(gameHeight - Client4.displayHeight * 0.47);

    Failure_Sign = this.add.image(1430, 1630, "Failure");
    Success_Sign = this.add.image(1430, 1595, "Success");

    create_Animations();

    Arrow = this.add
        .image(Scale.x, Scale.y - Scale.displayHeight * 0.45, "arrow")
        .setAlpha(0);
    //open_ride(); measure_height_animation();
    //=====================================================================================================================================
} //====================================================================================================================================
function game_over() {
    GameIsOver = true;
}

function say(str) {
    if (run_) Middletext.setText(str);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 2800);
    });
}

function update() { }
//=====================================================================================================================================
//================= WORK SPACE ========================================================================================================
//=====================================================================================================================================
function open_ride() {
    if (run_) {
        _gameThis.time.addEvent({
            delay: 1500,
            callback: function () {
                _gameThis.tweens.add({
                    targets: Counter,
                    y: gameHeight - Counter.displayHeight * 0.5,
                    ease: "Power1",
                    duration: 250,
                });
            },
            callbackScope: this,
            loop: false,
        });
        _gameThis.time.addEvent({
            delay: 2000,
            callback: function () {
                _gameThis.tweens.add({
                    targets: Scale,
                    alpha: 1,
                    ease: "Power1",
                    duration: 250,
                });
                _gameThis.tweens.add({
                    targets: Arrow,
                    alpha: 1,
                    ease: "Power1",
                    duration: 250,
                });
                _gameThis.tweens.add({
                    targets: Roller,
                    x: 1420,
                    ease: "Power1",
                    duration: 250,
                });
            },
            callbackScope: this,
            loop: false,
        });
    }
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2500);
        });
}

function next_person() {
    if (run_) {
        Roller.setTexture("roller", "r1.png");
        say("Welcome...");
        CC = PossibleClients[clientCounter];
        clientCounter++;
        // console.log("client", clientCounter)
        if (clientCounter >= PossibleClients.length) {
            clientCounter = 0;
            all_seen = true;
        }
        if (CC == 1) Current_Client = Client1;
        if (CC == 2) Current_Client = Client2;
        if (CC == 3) Current_Client = Client3;
        if (CC == 4) Current_Client = Client4;
        Current_Client.setFlipX(false);
        //console.log(Current_Client.name);
        Current_Client.play(Current_Client.name + "Walk");
        _gameThis.tweens.add({
            targets: Current_Client,
            x: 700,
            ease: "Linear",
            duration: 2500,
            onComplete: () => {
                Current_Client.stop();
            },
        });
    }
    //Cash_00.alpha=1;
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 2700);
        });
}

function measure_height_animation() {
    if (run_) {
        say("Mesuring Height...");

        Current_Client.setX(800);
        if (CC == 1) Current_Client.play("go_Mesure1");
        if (CC == 2) Current_Client.play("go_Mesure2");
        if (CC == 3) Current_Client.play("go_Mesure3");
        if (CC == 4) Current_Client.play("go_Mesure4");

        let CorrectY = 0.52;
        if (Current_Client.name == "Client1") {
            CorrectY = 0.51;
        }
        if (Current_Client.name == "Client2") {
            CorrectY = 0.515;
        }
        if (Current_Client.name == "Client3") {
            CorrectY = 0.52;
        }
        if (Current_Client.name == "Client4") {
            CorrectY = 0.535;
        }

        _gameThis.tweens.add({
            targets: Arrow,
            y: Current_Client.y - Current_Client.displayHeight * CorrectY,
            ease: "Power1",
            duration: 500,
        });
    }
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 700);
        });
}

function allow() {
    if (run_) {
        say("OK : Height > 3");

        _gameThis.tweens.add({
            targets: Arrow,
            y: Scale.y - Scale.displayHeight * 0.45,
            ease: "Power1",
            duration: 500,
        });

        Success_Sign.y = 690;
        Current_Client.play(Current_Client.name + "Walk");
        Success_Sign.setDepth(1);
        Current_Client.setDepth(2);

        _gameThis.tweens.add({
            targets: Current_Client,
            x: 2100,
            ease: "Power1",
            duration: 2800,
        });
        _gameThis.time.addEvent({
            delay: 2000,
            callback: function () {
                Current_Client.stop();
                clear_scene();
            },
            callbackScope: this,
            loop: false,
        });
        Roller.play("roll");
    }
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        });
}

function dont_allow() {
    if (run_) {
        say("SORRY ! Height < 3");
        _gameThis.tweens.add({
            targets: Arrow,
            y: Scale.y - Scale.displayHeight * 0.45,
            ease: "Power1",
            duration: 500,
        });
        Failure_Sign.y = 690;
        Current_Client.play(Current_Client.name + "Walk");
        _gameThis.tweens.add({
            targets: Current_Client,
            x: -100,
            ease: "Power1",
            duration: 2800,
        });
        Current_Client.setFlipX(true);
    }
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 3000);
        });
}

function clear_scene() {
    say("");
    //Scaling1.x=2400; Scaling2.x=2400;
    Client1.x = -400;
    Client2.x = -400;
    Client3.x = -400;
    Client4.x = -400;
    Failure_Sign.y = 1700;
    Success_Sign.y = 1700;
}

function sleep(seconds) {
    if (run_)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, seconds * 1000);
        });
}

function create_Animations() {
    _gameThis.anims.create({
        key: "roll",
        frames: _gameThis.anims.generateFrameNames("roller", {
            prefix: "r",
            start: 1,
            end: 9,
            zeroPad: 0,
            suffix: ".png",
        }),
        repeat: 0,
        frameRate: 8,
        delay: 600,
    });

    _gameThis.anims.create({
        key: "go_Mesure1",
        frames: _gameThis.anims.generateFrameNumbers("Client1", { frames: [3, 4] }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "end_Mesure1",
        frames: _gameThis.anims.generateFrameNumbers("Client1", {
            frames: [3, 4, 5, 6],
        }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "go_Mesure2",
        frames: _gameThis.anims.generateFrameNumbers("Client2", { frames: [3, 4] }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "end_Mesure2",
        frames: _gameThis.anims.generateFrameNumbers("Client2", {
            frames: [3, 4, 5, 6],
        }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "go_Mesure3",
        frames: _gameThis.anims.generateFrameNumbers("Client3", { frames: [3, 4] }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "end_Mesure3",
        frames: _gameThis.anims.generateFrameNumbers("Client3", {
            frames: [3, 4, 5, 6],
        }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "go_Mesure4",
        frames: _gameThis.anims.generateFrameNumbers("Client4", { frames: [3, 4] }),
        frameRate: 4,
        repeat: 0,
    });
    _gameThis.anims.create({
        key: "end_Mesure4",
        frames: _gameThis.anims.generateFrameNumbers("Client4", {
            frames: [3, 4, 5, 6],
        }),
        frameRate: 4,
        repeat: 0,
    });

    _gameThis.anims.create({
        key: "Client1Walk",
        frames: _gameThis.anims.generateFrameNumbers("Client1", { frames: [0, 1] }),
        frameRate: 4,
        repeat: -1,
    });

    _gameThis.anims.create({
        key: "Client2Walk",
        frames: _gameThis.anims.generateFrameNumbers("Client2", { frames: [0, 1] }),
        frameRate: 4,
        repeat: -1,
    });

    _gameThis.anims.create({
        key: "Client3Walk",
        frames: _gameThis.anims.generateFrameNumbers("Client3", { frames: [0, 1] }),
        frameRate: 4,
        repeat: -1,
    });

    _gameThis.anims.create({
        key: "Client4Walk",
        frames: _gameThis.anims.generateFrameNumbers("Client4", { frames: [0, 1] }),
        frameRate: 4,
        repeat: -1,
    });
}
//=====================================================================================================================================
//=====================================================================================================================================
//function get_float_input_from_user(txt) {
//    return new Promise((resolve)=>{resolve(parseFloat(prompt(txt,"Enter Only Numbers Here...")));});  }
function get_float_input_from_user(txt) {
    if (run_)
        return parseFloat(prompt(txt, "Enter only numbers here"));
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
            if (key == "Client1") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 231,
                    frameHeight: 701,
                });
            }
            if (key == "Client2") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 191,
                    frameHeight: 551,
                });
            }
            if (key == "Client3") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 161,
                    frameHeight: 521,
                });
            }
            if (key == "Client4") {
                _gameThis.load.spritesheet(key, spritesImages[key], {
                    frameWidth: 200,
                    frameHeight: 515,
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

function Start_Game() {
    console.log("------------------->Start_Game");
}
// Re-initialize the game variables
function reInitValues() {
    all_seen = false;
    GameIsOver = false;
    run_ = false;
}
// Reset the game
function reset_output() {
    console.log("reset_output");
    reInitValues();
    _gameThis.scene.restart();
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

async function test() {
    await open_ride();
    for (let i = 0; i <= 4; i++) {
        await next_person();
        await measure_height_animation();
        await sleep(1);
        height = get_float_input_from_user("Enter Height in ft: ");
        console.log("height =", height);
        if (height > 3) {
            await allow();
        } else {
            await dont_allow();
        }
        await sleep(1);
    }
}

var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    reset_output();
    setTimeout(() => {
        run_ = true;
        window.LoopTrap = 1E3;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var a = "async function c(){" + Blockly.JavaScript.workspaceToCode(demoWorkspace) + "final_check();} c();";
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        try {
            eval(a);
        } catch (b) { alert(b) }
        // try {
        //     //Shepherd goes into next 
        //     if (tour.getCurrentStep().options.title.includes("Run")) {
        //         let btns = document.querySelectorAll('.shepherd-button');
        //         btns[btns.length - 1].click();
        //     }
        // } catch { }
    }, 1500)
}

function final_check() {
    setTimeout(() => {
        if (all_seen) game_over();
    }, 2000);

}

// function helpCode() {
//     // var xml_wkspace =
//     //     '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="S2SiBE2S5D~ums=-ruN7" x="39" y="2"><next><block type="controls_repeat_ext" id="OTfC{i0x1a[HN4gOy4e3"><value name="TIMES"><block type="math_number" id="=p#4dBXhYNM([TiWsMr5"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="FTrsT9+#]o2:,mG=_!do"><next><block type="height_block" id="oyDvTFy1EZ61uE4y#/1z"><next><block type="wait_block" id="D^K?_HRtvC^gzNv09!4k"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="6M48gk4axEu,AqL4_Zv("><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="^VEZ}8_3O%xDj4}~Vq?h"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="%v;dUJ{wk;6+a?(n.O:/"></block></value><next><block type="controls_if" id="AcLt)9ST$=jlZren[}+*"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="|?3(:NB`:EXvvZ)ljz3-"><field name="OP">GTE</field><value name="A"><block type="variables" id="KD%_rcy24_$p|g2jKlIm"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="(:}Z7uB+XnaA_P#yQIXM"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id="K713(Spo_~bN3K3C9F9v"><field name="NAME">op1</field></block></statement><statement name="ELSE"><block type="multiaction_block" id="Z0sYs~TG!t+9gN7o_iIj"><field name="NAME">op2</field></block></statement><next><block type="wait_block" id="?u,JX-u[9jsQ$ilF1Ncu"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="XT4y+[%HFdt@3VN%`c_-"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';
//     // var xml = Blockly.Xml.textToDom(xml_wkspace);
//     // demoWorkspace.clear();
//     // Blockly.Xml.domToWorkspace(xml, demoWorkspace);
//     if (!tour.isActive()) tour.show(tour_step);
// }

const helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="S2SiBE2S5D~ums=-ruN7" x="39" y="2"><next><block type="controls_repeat_ext" id="OTfC{i0x1a[HN4gOy4e3"><value name="TIMES"><block type="math_number" id="=p#4dBXhYNM([TiWsMr5"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="FTrsT9+#]o2:,mG=_!do"><next><block type="height_block" id="oyDvTFy1EZ61uE4y#/1z"><next><block type="wait_block" id="D^K?_HRtvC^gzNv09!4k"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="6M48gk4axEu,AqL4_Zv("><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="^VEZ}8_3O%xDj4}~Vq?h"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="%v;dUJ{wk;6+a?(n.O:/"></block></value><next><block type="controls_if" id="AcLt)9ST$=jlZren[}+*"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="|?3(:NB`:EXvvZ)ljz3-"><field name="OP">GTE</field><value name="A"><block type="variables" id="KD%_rcy24_$p|g2jKlIm"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="(:}Z7uB+XnaA_P#yQIXM"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id="K713(Spo_~bN3K3C9F9v"><field name="NAME">op1</field></block></statement><statement name="ELSE"><block type="multiaction_block" id="Z0sYs~TG!t+9gN7o_iIj"><field name="NAME">op2</field></block></statement><next><block type="wait_block" id="?u,JX-u[9jsQ$ilF1Ncu"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="XT4y+[%HFdt@3VN%`c_-"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from roller_coaster import *\n";
    document.getElementById("pycode").innerHTML = import_statement + code;
    document.getElementById("modal1").innerHTML = import_statement + code;
}
// demoWorkspace.addChangeListener(myUpdateFunction);

function completedFlag() {
    return GameIsOver;
}

function validation() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

    let code = Blockly.Python.workspaceToCode(demoWorkspace);

    //   Open ride block
    if (!code.includes("await open_ride()\n")) {
        M.toast({ html: "Please use the open the ride block to start the game" });
        return true;
    }

    //   Height checking
    if (!code.includes("await measure_height_animation()\n")) {
        M.toast({ html: "Get the height as input using the input block" });
        return true;
    }

    //   Allow/Block check
    if (!code.includes("await allow()\n") ||
        !code.includes("await dont_allow()\n")
    ) {
        M.toast({
            html: "You have missed to Allow/Block the person above/below 3ft",
        });
        return true;
    }

    //   next person checking
    if (!code.includes("await next_person()\n")) {
        M.toast({ html: "You have missed to call the Next person" });
        return true;
    }
}

function getNoOfBlocks() {
    demoWorkspace = Blockly.getMainWorkspace();
    noOfBlocks = demoWorkspace.getAllBlocks();
    return noOfBlocks.length
}

const updateImports = ["from roller_coaster import *"]

export {
    completedFlag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    sleep,
    height,
    dummy,
    open_ride,
    measure_height_animation,
    next_person,
    // sleep,
    get_float_input_from_user,
    allow,
    dont_allow,
    getNoOfBlocks,
    updateImports
}