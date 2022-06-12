import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;
import {
    update,
    preload,
    create,
    gameHeight,
    gameWidth,
    repeat_forever_flag
} from "./main"
Blockly.Blocks['pointertouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I")
            .appendField("touch")
            .appendField(new Blockly.FieldDropdown([
                ["meteorite", "meteorite"],
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(265);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Rocket blast");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['hide_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Hide")
            .appendField(new Blockly.FieldDropdown([
                ["Sprite", "dummy"],
                ["Rocket", "rocket"],
                ["Meteorite", "meteorite"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['spritetouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Sprite 1", "dummy1"],
                ["Rocket", "rocket"],
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["Sprite 2", "dummy2"],
                ["Meteorite", "meteorite"],
                ["Planet", "planet"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(260);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['end_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("win Game");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['forever_repeat_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Repeat forever");
        this.appendStatementInput("NAME")
            .setCheck(null)
            .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(135);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['forever_repeat_block'] = function (block) {
    var branch = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = `update = async ()=>{
        if(!isGameOver) {
        ` + branch + `
        reset_looper();
   }}`
    if (repeat_forever_flag) {
        eval(code);
        window['game'].destroy();
        document.getElementById('sprite-container').innerHTML = "";
        setTimeout(() => {
            let config = {
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
                        gravity: { y: 0 },
                        debug: false
                    },
                },
                scene: {
                    preload: preload,
                    create: create,
                    update: update,
                },
            };
            window['game'] = new Phaser.Game(config);
        }, 100);

    }
    return code;
};
Blockly.Python['forever_repeat_block'] = function (block) {
    var branch = Blockly.Python.statementToCode(block, 'NAME');
    var code = "while True:\n" + branch;
    return code;
};

Blockly.JavaScript['pointertouch__block'] = function (block) {
    const options2 = block.getFieldValue('options2');
    let code = ('meteorite' == options2) + ' && touchedComet != null';
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['pointertouch__block'] = function (block) {
    const options2 = block.getFieldValue('options2');
    let code = 'i_touch_meteorite()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.JavaScript['action_block'] = function (block) {
    // let code = 'addEventToBlastRocket();';
    let code = 'blastRocket();\n';
    return code;
};
Blockly.Python['action_block'] = function (block) {
    // let code = 'addEventToBlastRocket();';
    let code = 'blastRocket()\n';
    return code;
};

Blockly.JavaScript['hide_block'] = function (block) {
    const value = block.getFieldValue('NAME');
    let code = '';
    if (value == 'meteorite')
        code += 'hideComet();';
    else if (value == 'rocket')
        code += 'hideRocket();';
    return code;
};

Blockly.Python['hide_block'] = function (block) {
    const value = block.getFieldValue('NAME');
    let code = '';
    if (value == 'meteorite')
        code += 'hideComet()\n';
    else if (value == 'rocket')
        code += 'hideRocket()\n';
    return code;
};

Blockly.JavaScript['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');
    let code = '(' + ((options1 == 'rocket' && options2 == 'meteorite') + ' && isRocketHitComet') + ') || (' + ((options1 == 'meteorite' && options2 == 'rocket') + ' && isRocketHitComet') + ') || (' + ((options1 == 'rocket' && options2 == 'planet') + ' && rocket_touches_planet()') + ') || (' + ((options1 == 'planet' && options2 == 'rocket') + ' && rocket_touches_planet()') + ')';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');
    let code = '';
    if (options1 == 'rocket' && options2 == 'meteorite') {
        code = 'is_rocket_touching_meteorite';
    }
    if (options1 == 'rocket' && options2 == 'planet') {
        code = 'is_rocket_touching_planet';
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.JavaScript['end_block'] = function (block) {
    let code = 'win_game();';
    return code;
};
Blockly.Python['end_block'] = function (block) {
    let code = 'win_game()\n';
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [],
            name: "Spaceship story",
            colour: "#B430FF",
            cssConfig: { container: "cat1" },
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "pointertouch__block" },
                { kind: "BLOCK", blockxml: "", type: "spritetouch__block" },
            ],
            name: "Events",
            colour: "#FFFF00",
            cssConfig: { container: "cat1" },
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "action_block" },
                { kind: "BLOCK", blockxml: "", type: "hide_block" },
                { kind: "BLOCK", blockxml: "", type: "end_block" },
            ],
            name: "Actions",
            colour: "#B430FF",
            cssConfig: { container: "cat1" },
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_if" }],
            name: "Conditions",
            colour: "%{BKY_LOGIC_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "forever_repeat_block" }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};