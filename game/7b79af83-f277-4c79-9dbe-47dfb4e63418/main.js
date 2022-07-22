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
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;

const GAME_CONSTANT = {
    images: {
        BG: "images/BG.png",
        BGF: "images/BGF.png",
        EmptyT: "images/EmptyT.png",
        trays1: "images/trays1.png",
        blueC: "images/blueC.png",
        greenC: "images/greenC.png",
        orangeC: "images/orangeC.png",
        redC: "images/redC.png",
        blueW: "images/blueW.png",
        greenW: "images/greenW.png",
        orangeW: "images/orangeW.png",
        redW: "images/redW.png",
        chocolate: "images/chocolate.png",



    },
    spritesImages: {
        CB: "images/CB.png",
        CO: "images/CO.png",
        CG: "images/CG.png",
        CR: "images/CR.png",
    }
};

class ACustomer extends Phaser.GameObjects.Container {
    Char;
    CustomerHealthbar;
    Tint;
    PossibleTextures = ["CR", "CB", "CG", "CO"];
    healthBarValue = 100;
    ReduceSpeed = Phaser.Math.Between(3, 9); // 7 is about 12 seconds
    timedEvent;
    XPositions = [
        gameWidth * 0.4,
        gameWidth * 0.5,
        gameWidth * 0.75,
        gameWidth * 0.275,
        gameWidth * 0.625,
    ];
    Active = true;
    Died = false;
    constructor(scene, CustomerCounter) {
        super(scene);
        this.scene = scene;

        const random = Math.floor(Math.random() * this.PossibleTextures.length);
        if (this.PossibleTextures[random] == "CR") {
            this.Tint = 0xfd0000;
        }
        if (this.PossibleTextures[random] == "CB") {
            this.Tint = 0x0000ed;
        }
        if (this.PossibleTextures[random] == "CG") {
            this.Tint = 0x0fc000;
        }
        if (this.PossibleTextures[random] == "CO") {
            this.Tint = 0xe88100;
        }

        console.log(
            "hello customer",
            this.PossibleTextures[random],
            "ReduceSpeed",
            this.ReduceSpeed
        );

        this.Char = this.scene.add
            .image(
                this.XPositions[CustomerCounter],
                gameHeight * 0.56 + Math.random() * 64,
                this.PossibleTextures[random],
                0
            )
            .setScale(0.5);
        this.Char.setName(this.PossibleTextures[random]);
        this.CustomerHealthbar = this.scene.add.graphics();
        this.CustomerHealthbar.fillStyle(this.Tint);
        this.CustomerHealthbar.beginPath();

        this.CustomerHealthbar.fillRect(
            this.Char.x - this.Char.displayWidth * 0.5,
            this.Char.y - this.Char.displayHeight * 0.5,
            this.Char.displayWidth,
            24
        );

        this.add(this.Char);
        this.add(this.CustomerHealthbar);

        this.scene.add.existing(this);
    }
    Init() {
        this.timedEvent = this.scene.time.addEvent({
            delay: 100,
            callback: this.reduceHealth,
            callbackScope: this,
            loop: true,
        });
    }
    GetHealth() {
        return this.healthBarValue;
    }
    SetHealth(n) {
        // n from 0 to 100
        this.healthBarValue = n;
        this.CustomerHealthbar.clear();
        this.CustomerHealthbar.fillStyle(this.Tint);
        this.CustomerHealthbar.beginPath();
        this.CustomerHealthbar.fillRect(
            this.Char.x - this.Char.displayWidth * 0.5,
            this.Char.y - this.Char.displayHeight * 0.5,
            (n / 100) * this.Char.displayWidth,
            24
        );
        if (GameIsOver) {
            this.timedEvent.remove();
        }
    }
    reduceHealth() {
        let newhealth = this.healthBarValue - this.ReduceSpeed / 10;
        if (newhealth < 0) {
            newhealth = 0;
            this.timedEvent.remove();
            this.Died = true;
            this.Active = false;
            ActiveCustomers--;
            this.HideMe();
            this.Char.setTexture(this.Char.texture.key, "2");
            //don't add anew cusomer , the gameis over
        }
        this.SetHealth(newhealth);
    }
    SetHappy() {
        this.Active = false;
        ActiveCustomers--;
        this.Char.setTexture(this.Char.texture.key, "1");
        this.timedEvent.remove();
        setTimeout(() => {
            this.HideMe();
            this.CustomerHealthbar.clear();
        }, 500);
    }
    SetSad() {
        this.Char.setTexture(this.Char.texture.key, "2");
        this.SetIdle();
    }
    SetIdle() {
        setTimeout(() => {
            if (this.GetHealth() > 0) {
                this.Char.setTexture(this.Char.texture.key, "0");
            }
        }, 2000);
    }
    HideMe() {
        this.scene.tweens.add({
            targets: this.Char,
            alpha: 0,
            ease: "Linear",
            delay: 200,
            duration: 200,
            //onComplete:()=>{this.setY(-2000)}
        });
    }
}

const ERROR_MESSAGE = '';
const CORRECT_MESSAGE = '';

let ShowCustomerEvery = 4000;
let ActiveCustomers = 0;
let Ctimer;
let TotalCustomers = 12;
let CustomerCounter = 0;
let ErrorText;
let ErrorInnerText = "";
let GameIsOver = false;
let Middletext;
let customernumberText;

let tray2Empty = true;
let tray3Empty = true;
let C1 = null;
let C2 = null;
let ForceC = 0; //chocolate no wrapper selected by user
let CustomerContainer;
let AllCustomers = [];
let CurrentCustomer;

let pickachocolate = false;
let selectWrapper = false;
let selectedColor = null;

let touches_customer = false;
let CurrectDragged;
let correctColor = false;
let CurrentColor = 0xffffff;
let dummy = 0;

let tray1;
let tray2;
let tray3;

let blueW;
let greenW;
let orangeW;
let redW;

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
            if (key == "BG") {
                _gameThis[key] = _gameThis.add.image(
                    gameWidth / 2,
                    gameHeight / 2,
                    key
                );
                _gameThis[key].setName(key);
            }
        }
    }

    CustomerContainer = this.add.container();
    //add the store
    var BGF = this.add.image(gameWidth * 0.5, gameHeight * 0.5, "BGF", 0);

    //add 3trays
    tray1 = this.add
        .image(gameWidth * 0.23, gameHeight * 0.63, "trays1")
        .setScale(1.5);
    tray2 = this.add
        .image(gameWidth * 0.39, gameHeight * 0.67, "EmptyT")
        .setScale(1.2);
    tray3 = this.add
        .image(gameWidth * 0.53, gameHeight * 0.67, "EmptyT")
        .setScale(1.2);
    //add wrappers
    blueW = this.add
        .image(gameWidth * 0.64, gameHeight * 0.66, "blueW")
        .setScale(1.5);
    greenW = this.add
        .image(gameWidth * 0.7, gameHeight * 0.66, "greenW")
        .setScale(1.5);
    redW = this.add
        .image(gameWidth * 0.76, gameHeight * 0.66, "redW")
        .setScale(1.5);
    orangeW = this.add
        .image(gameWidth * 0.82, gameHeight * 0.66, "orangeW")
        .setScale(1.5);

    //click to add a  chocolate
    tray1.setInteractive();
    tray1.on("pointerdown", () => {
        if (GameIsOver) {
            return;
        } //game is over : stop here
        pickachocolate = true;
    });
    //click and select a colored wrapper
    blueW.setInteractive();
    blueW.on("pointerdown", () => {
        selectWrapper = true;
        selectedColor = "blueC";
    });
    greenW.setInteractive();
    greenW.on("pointerdown", () => {
        selectWrapper = true;
        selectedColor = "greenC";
    });
    redW.setInteractive();
    redW.on("pointerdown", () => {
        selectWrapper = true;
        selectedColor = "redC";
    });
    orangeW.setInteractive();
    orangeW.on("pointerdown", () => {
        selectWrapper = true;
        selectedColor = "orangeC";
    });

    //dragdrop functionalities
    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
        if (GameIsOver) {
            return;
        } //game is over : stop here
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.input.on(
        "dragend",
        function (pointer, gameObject, dragX, dragY) {
            CurrectDragged = gameObject;

            let D;
            CurrentCustomer = null;
            for (let c = 0; c < AllCustomers.length; c++) {
                if (AllCustomers[c].Active) {
                    D = Phaser.Math.Distance.Between(
                        AllCustomers[c].Char.x,
                        AllCustomers[c].Char.y,
                        gameObject.x,
                        gameObject.y
                    );
                    console.log("c", c);
                    console.log("D", D);
                    console.log("XD", Math.abs(AllCustomers[c].Char.x - gameObject.x));
                    if (D < 160 && AllCustomers[c].Char.x - gameObject.x < 80) {
                        console.log("------------>good");
                        touches_customer = true;
                        CurrentCustomer = AllCustomers[c];
                        console.log(CurrentCustomer.Char.name);
                        break;
                    }
                }
            }
            if (CurrentCustomer == null) {
                console.log("------------>wrong");
                CurrectDragged.setPosition(
                    CurrectDragged.getData("X"),
                    CurrectDragged.getData("Y")
                );
                touches_customer = false;
            }
        },
        this
    );

    ErrorText = _gameThis.add.text(0, 0, "Error...", {
        font: "bold 36px Arial",
        fill: "#ff0000",
    });
    ErrorText.setPosition(10, ErrorText.displayHeight * 0.75);
    ErrorText.setOrigin(0, 0.5);
    ErrorText.setAlpha(0);

    Middletext = _gameThis.add.text(
        this.cameras.main.width * 0.5,
        this.cameras.main.height * 0.8,
        "", {
        font: "bold 68px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 12,
    }
    );
    Middletext.setOrigin(0.5, 0.5);

    customernumberText = _gameThis.add.text(
        this.cameras.main.width * 0.73,
        this.cameras.main.height * 0.25,
        "Total : " + TotalCustomers, {
        font: "bold 48px Arial",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
    }
    );
    customernumberText.setOrigin(0.5, 0.5);
}

function start_customer_arrival() {
    if (Ctimer) {
        return;
    }
    showAcustomer();
    Ctimer = _gameThis.time.addEvent({
        delay: ShowCustomerEvery,
        callback: showAcustomer,
        callbackScope: _gameThis,
        loop: true,
    });
}

function i_touch_chocolate() {
    return pickachocolate;
}

function pick_up_chocolate() {
    if (tray2Empty && pickachocolate) {
        pickachocolate = false;
        C1 = _gameThis.add.image(
            tray2.x,
            tray2.y - tray2.displayHeight * 0.2,
            "chocolate"
        );
        C1.setData({ Wrapped: false });
        tray2Empty = false;
        C1.setInteractive();
        C1.on("pointerdown", () => {
            console.log("ok1");
            if (!C1.getData("Wrapped")) {
                console.log("ok11");
                ForceC = C1;
            }
        });
        ForceC = C1;
    } else if (tray3Empty && pickachocolate) {
        pickachocolate = false;
        C2 = _gameThis.add.image(
            tray3.x,
            tray3.y - tray3.displayHeight * 0.2,
            "chocolate"
        );
        tray3Empty = false;
        C2.setData({ Wrapped: false });
        C2.setInteractive();
        C2.on("pointerdown", () => {
            console.log("ok2");
            if (!C2.getData("Wrapped")) {
                console.log("ok22");
                ForceC = C2;
            }
        });
        ForceC = C2;
    }
}

function chocolate_is_picked() {
    let picked = false;
    if (!tray2Empty && C1 != null) {
        if (!C1.getData("Wrapped")) {
            picked = true;
        }
    }
    if (!tray3Empty && C2 != null) {
        if (!C2.getData("Wrapped")) {
            picked = true;
        }
    }
    return picked;
}

function i_touch_a_wrapper() {
    return selectWrapper;
}

function wrap_chocolate_in_selected_wrapper() {
    if (selectedColor) {
        try {
            if (!tray2Empty && ForceC == C1) {
                if (!C1.getData("Wrapped")) {
                    C1.setTexture(selectedColor);
                    C1.setName(selectedColor);
                    C1.setInteractive();
                    C1.setData({ X: C1.x, Y: C1.y, Wrapped: true });
                    if (ForceC == C1) {
                        ForceC = C2;
                    }
                    //console.log('just wrap c1 Wrapped' , C1.getData('Wrapped'))
                    _gameThis.input.setDraggable(C1);
                    selectWrapper = false;
                }
            } else if (!tray3Empty && ForceC == C2) {
                if (!C2.getData("Wrapped")) {
                    C2.setTexture(selectedColor);
                    C2.setName(selectedColor);
                    C2.setInteractive();
                    C2.setData({ X: C2.x, Y: C2.y, Wrapped: true });
                    _gameThis.input.setDraggable(C2);
                    if (ForceC == C2) {
                        ForceC = C1;
                    }
                    selectWrapper = false;
                }
            }
            // >null 0
            selectedColor = null;
        } catch { }
    }
}

function wrapped_chocolate_touches_customer() {
    return touches_customer;
}

function serve_chocolate_to_customer() {
    console.log(CurrentCustomer.Char.name, CurrectDragged.name);

    correctColor = false;
    if (CurrentCustomer.Char.name == "CO" && CurrectDragged.name == "orangeC") {
        correctColor = true;
    }
    if (CurrentCustomer.Char.name == "CB" && CurrectDragged.name == "blueC") {
        correctColor = true;
    }
    if (CurrentCustomer.Char.name == "CG" && CurrectDragged.name == "greenC") {
        correctColor = true;
    }
    if (CurrentCustomer.Char.name == "CR" && CurrectDragged.name == "redC") {
        correctColor = true;
    }

    if (!correctColor) {
        console.log("wrong customer/chocolate colors");
        CurrectDragged.setPosition(
            CurrectDragged.getData("X"),
            CurrectDragged.getData("Y")
        );

        say("You served the wrong chocolate");

        setTimeout(() => {
            if (Middletext.text == "Wrong Chocolate Color") { }
            Middletext.setText("");
        }, 2000);
        CurrentCustomer.SetSad();
    } else if (CurrentCustomer.Died) {
        CurrectDragged.setPosition(
            CurrectDragged.getData("X"),
            CurrectDragged.getData("Y")
        );
    } else {
        if (CurrectDragged == C1) {
            tray2Empty = true;
            C1.destroy();
            C1 = null;
            console.log("removing c1");
        } else if (CurrectDragged == C2) {
            tray3Empty = true;
            C2.destroy();
            C2 = null;
            console.log("removing c2");
        }

        CurrentCustomer.SetHappy();
        _gameThis.tweens.add({
            targets: CurrectDragged,
            alpha: 0,
            scale: 0.5,
            ease: "Linear",
            duration: 1000,
            delay: 200,
            onComplete: function () {
                TotalCustomers--;
                customernumberText.setText("Total : " + TotalCustomers);
            },
        });
    }

    touches_customer = false;
}

function minimum_of_any_customer_patience_bar() {
    let value = false;
    for (let c = 0; c < AllCustomers.length; c++) {
        if (AllCustomers[c].Died) {
            Ctimer.remove();
            value = true;
        }
    }
    return value;
}

function customers_to_be_served() {
    return TotalCustomers;
}

function showAcustomer() {
    if (ActiveCustomers > 3) {
        return;
    } //max customer = 4;
    ActiveCustomers++;

    CustomerCounter++;
    if (CustomerCounter > 4) {
        CustomerCounter = 0;
    }
    let Customer = new ACustomer(_gameThis, CustomerCounter);
    CustomerContainer.add(Customer);
    AllCustomers.push(Customer);
    //show the customer
    Customer.Char.setScale(0.25);
    Customer.Char.setAlpha(0.25);
    _gameThis.tweens.add({
        targets: Customer.Char,
        alpha: 1,
        scale: 0.5,
        ease: "Linear",
        duration: 200,
        onComplete: function () {
            Customer.Init();
        },
    });
}

function game_over() {
    // console.log("game Is Over");
    GameIsOver = true;
    Ctimer.remove();
}

function say(str) {
    Middletext.setText(str);
}

function update() {
    if (i_touch_chocolate()) {
        if (tray2Empty == false && tray3Empty == false) {
            M.toast({ html: "Pick up a chocolate to wrap it" });
        }
    }
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
            _gameThis.load.spritesheet(key, element, {
                frameWidth: 1838 / 3,
                frameHeight: 1408,
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
    TotalCustomers = 12;
    CustomerCounter = 0;
    GameIsOver = false;
    if (Ctimer) {
        Ctimer.remove();
    }
    Ctimer = null;
    tray2Empty = true;
    tray3Empty = true;

    ShowCustomerEvery = 4000;
    ActiveCustomers = 0;
    TotalCustomers = 12;
    CustomerCounter = 0;
    ErrorInnerText = "";
    GameIsOver = false;

    tray2Empty = true;
    tray3Empty = true;
    C1 = null;
    C2 = null;
    ForceC = 0; //chocolate no wrapper selected by user
    AllCustomers = [];

    pickachocolate = false;
    selectWrapper = false;
    selectedColor = null;

    touches_customer = false;
    correctColor = false;
    CurrentColor = 0xffffff;
}
// Reset the game
function reset_output() {
    console.log("reset_output");
    reInitValues();
    _gameThis.scene.restart();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}


var repeat_forever_flag = true;

function runCode() {
    // tour_over && tour.complete();
    reInitValues();
    window.LoopTrap = 1e3;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var a =
        "async function c(){" +
        Blockly.JavaScript.workspaceToCode(demoWorkspace) +
        "} c();";
    try {
        eval(a);
        repeat_forever_flag = false;
        setTimeout(() => {
            eval(a);
        }, 1500);
        setTimeout(() => {
            repeat_forever_flag = true;
        }, 3000);
    } catch (b) {
        alert(b);
    }
    // try {
    //     if (tour.getCurrentStep().options.title.includes("Run")) {
    //         let btns = document.querySelectorAll(".shepherd-button");
    //         btns[btns.length - 1].click();
    //     }
    // } catch { }
}

// function helpCode() {
//     var xml_wkspace =
//         '<xml xmlns="https://developers.google.com/blockly/xml"><block type="show_variable_block" id="i[`eB$?Qrijjw`l^MzV." x="-11" y="-187"><field name="NAME">option1</field><next><block type="forever_repeat_block" id="^w(gCwSoS-0#?a`C=f72"><statement name="NAME"><block type="customer_block" id="n_2o2A6h}@RYS1Viy@b_"><next><block type="controls_if" id="NXM?~ZS~ztPOz-aE%hNF"><value name="IF0"><block type="pointertouch__block" id="S@MUR2d}UUJ36[o7B:N1"><field name="options2">option1</field></block></value><statement name="DO0"><block type="single_action_block" id="Af~O(O)-2$|};Q/(14_I"></block></statement><next><block type="controls_if" id="W{*yz%!}(|Iln.GpT?#W"><value name="IF0"><block type="pointertouch__block" id="`RDp4H*Do9UoK.`q0r-k"><field name="options2">option2</field></block></value><statement name="DO0"><block type="action_block" id="qwoH$/S]F6Ip+D8(;K,U"></block></statement><next><block type="controls_if" id="@HMqlHR9uiq9WB@XY4d2"><value name="IF0"><block type="spritetouch__block" id="K|X2]Al/rqq^s(Yo?trg"><field name="options1">option3</field><field name="options2">option4</field></block></value><statement name="DO0"><block type="secondary_action_block" id="mH-Nemj1uB.owTv/nUd*"></block></statement><next><block type="controls_if" id="Qm7ddcz?(Yyy.uN]gp/T"><value name="IF0"><block type="variables" id="(QHd!s?n+=Z^WqiNUfB6"><field name="Options">option1</field></block></value><statement name="DO0"><block type="say_block" id="!ps{1kBX]+.OkMM08KR:"><field name="say">You have failed to serve all customers</field><next><block type="end_block" id="#b9=qi4cdCdo|x]e@(^`"></block></next></block></statement><next><block type="controls_if" id="qOrz5}PZ,:p[i.si5Z@("><value name="IF0"><block type="logic_compare" id=".c9QZnp5~!..}f=FZqsr"><field name="OP">EQ</field><value name="A"><block type="variables" id="C}2;^4Q%EVJNG!_LV{i;"><field name="Options">OPTIONNAME</field></block></value><value name="B"><block type="math_number" id="LZV}wH%:+dXOOMOSVOKD"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="say_block" id="#uRlRBfg_ySNHfn22I?P"><field name="say">You have served all you customers!</field><next><block type="end_block" id="Tr{/hDhB2DLz@ZmawrE:"></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>'
//     var xml = Blockly.Xml.textToDom(xml_wkspace);
//     demoWorkspace.clear();
//     Blockly.Xml.domToWorkspace(xml, demoWorkspace);
// }

var helpCode = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="show_variable_block" id="i[`eB$?Qrijjw`l^MzV." x="-11" y="-187"><field name="NAME">option1</field><next><block type="forever_repeat_block" id="^w(gCwSoS-0#?a`C=f72"><statement name="NAME"><block type="customer_block" id="n_2o2A6h}@RYS1Viy@b_"><next><block type="controls_if" id="NXM?~ZS~ztPOz-aE%hNF"><value name="IF0"><block type="pointertouch__block" id="S@MUR2d}UUJ36[o7B:N1"><field name="options2">option1</field></block></value><statement name="DO0"><block type="single_action_block" id="Af~O(O)-2$|};Q/(14_I"></block></statement><next><block type="controls_if" id="W{*yz%!}(|Iln.GpT?#W"><value name="IF0"><block type="pointertouch__block" id="`RDp4H*Do9UoK.`q0r-k"><field name="options2">option2</field></block></value><statement name="DO0"><block type="action_block" id="qwoH$/S]F6Ip+D8(;K,U"></block></statement><next><block type="controls_if" id="@HMqlHR9uiq9WB@XY4d2"><value name="IF0"><block type="spritetouch__block" id="K|X2]Al/rqq^s(Yo?trg"><field name="options1">option3</field><field name="options2">option4</field></block></value><statement name="DO0"><block type="secondary_action_block" id="mH-Nemj1uB.owTv/nUd*"></block></statement><next><block type="controls_if" id="Qm7ddcz?(Yyy.uN]gp/T"><value name="IF0"><block type="variables" id="(QHd!s?n+=Z^WqiNUfB6"><field name="Options">option1</field></block></value><statement name="DO0"><block type="say_block" id="!ps{1kBX]+.OkMM08KR:"><field name="say">You have failed to serve all customers</field><next><block type="end_block" id="#b9=qi4cdCdo|x]e@(^`"></block></next></block></statement><next><block type="controls_if" id="qOrz5}PZ,:p[i.si5Z@("><value name="IF0"><block type="logic_compare" id=".c9QZnp5~!..}f=FZqsr"><field name="OP">EQ</field><value name="A"><block type="variables" id="C}2;^4Q%EVJNG!_LV{i;"><field name="Options">OPTIONNAME</field></block></value><value name="B"><block type="math_number" id="LZV}wH%:+dXOOMOSVOKD"><field name="NUM">0</field></block></value></block></value><statement name="DO0"><block type="say_block" id="#uRlRBfg_ySNHfn22I?P"><field name="say">You have served all you customers!</field><next><block type="end_block" id="Tr{/hDhB2DLz@ZmawrE:"></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>';

function myUpdateFunction(a) {
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    var import_statement = "from chocolate_shop import *\n";
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

const updateImports = ["from chocolate_shop import *"]


export {
    completedFlag,
    repeat_forever_flag,
    myUpdateFunction,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    start_customer_arrival,
    game_over,
    say,
    pick_up_chocolate,
    minimum_of_any_customer_patience_bar,
    customers_to_be_served,
    chocolate_is_picked,
    i_touch_a_wrapper,
    i_touch_chocolate,
    wrapped_chocolate_touches_customer,
    wrap_chocolate_in_selected_wrapper,
    serve_chocolate_to_customer,
    tray2Empty,
    tray3Empty,
    getNoOfBlocks,
    update,
    game,
    preload,
    create,
    gameHeight,
    gameWidth,
    updateImports
}