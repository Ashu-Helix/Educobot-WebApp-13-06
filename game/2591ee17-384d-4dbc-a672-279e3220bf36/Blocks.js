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


//Repeat Forever block
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
    var code = `
    update = ()=>{ 
        ${branch}
    }`
    if (repeat_forever_flag) {
        eval(code);
        game.destroy();
        document.getElementById('sprite-container').innerHTML = "";
        setTimeout(() => {
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
                    },
                },
                scene: {
                    preload: preload,
                    create: create,
                    update: update,
                },
            };
            let game1 = new Phaser.Game(config);
        }, 100);

    }
    return code;
};
Blockly.Python['forever_repeat_block'] = function (block) {
    var branch = Blockly.Python.statementToCode(block, 'NAME');
    var code = "while True:\n" + branch;
    return code;
};

Blockly.Blocks['pointertouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I touch ")
            .appendField(new Blockly.FieldDropdown([
                ["options", "default"],
                ["Any", "any"],
                ["any number", "any_number"],
                ["ac", "ac"],
                ["+", "+"],
                ["-", "-"],
                ["x", "*"],
                ["/", "/"],
                ["=", "="]
            ]), "options")
            .appendField("button");
        this.setOutput(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['pointertouch__block'] = function (block) {
    var dropdown_options = block.getFieldValue('options');
    var code = `touch('${dropdown_options}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['pointertouch__block'] = function (block) {
    var dropdown_options = block.getFieldValue('options');
    var code = `touch('${dropdown_options}')`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['action2'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display on screen");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(150);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['action2'] = function (block) {
    var code = `displayOnScreen();\n`;
    return code;
};
Blockly.Python['action2'] = function (block) {
    var code = `displayOnScreen()\n`;
    return code;
};

Blockly.Blocks['action3'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Clear Display");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(80);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['action3'] = function (block) {
    var code = `clear_display();\n`;
    return code;
};
Blockly.Python['action3'] = function (block) {
    var code = `clear_display()\n`;
    return code;
};

Blockly.Blocks['comparison_block'] = {
    init: function () {
        this.appendValueInput("value1")
            .setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["=", "op1"],
                [">", "op2"],
                ["<", "op3"]
            ]), "operators");
        this.appendValueInput("value2")
            .setCheck(null);
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['comparison_block'] = function (block) {
    var value_value1 = Blockly.JavaScript.valueToCode(block, 'value1', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_operators = block.getFieldValue('operators');
    var value_value2 = Blockly.JavaScript.valueToCode(block, 'value2', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `${value_value1} ${dropdown_operators} ${value_value2}`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['action4'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Compute");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['action4'] = function (block) {
    var code = `compute();\n`;
    return code;
};
Blockly.Python['action4'] = function (block) {
    var code = `compute()\n`;
    return code;
};

Blockly.Blocks['xy'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("x :")
            .appendField(new Blockly.FieldTextInput("50"), "x_coordinate")
            .appendField(" y :")
            .appendField(new Blockly.FieldTextInput("50"), "y_coordinate");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['xy'] = function (block) {
    return '';
};
Blockly.Python['xy'] = function (block) {
    return '';
};

Blockly.Blocks['move'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("MOVE BUTTON: ")
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
                ["4", "4"],
                ["5", "5"],
                ["6", "6"],
                ["7", "7"],
                ["8", "8"],
                ["9", "9"],
                ["0", "0"],
                ["+", "+"],
                ["-", "-"],
                ["x", "*"],
                ["/", "/"],
                ["=", "="],
                ["ac", "ac"],
                [".", "."]
            ]), "button")
            .appendField("TO: ");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(285);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['move'] = function (block) {
    let button = block.getFieldValue('button');
    let code = '';
    if (block.childBlocks_ && block.childBlocks_[0] && block.childBlocks_[0].type == 'xy') {
        let xAxis = block.childBlocks_[0].getFieldValue('x_coordinate');
        let yAxis = block.childBlocks_[0].getFieldValue('y_coordinate');
        code = `moveButton('${button}', '${xAxis}', '${yAxis}');`
    }

    return code;
};

Blockly.Python['move'] = function (block) {
    let button = block.getFieldValue('button');
    let code = '';
    if (block.childBlocks_ && block.childBlocks_[0] && block.childBlocks_[0].type == 'xy') {
        let xAxis = block.childBlocks_[0].getFieldValue('x_coordinate');
        let yAxis = block.childBlocks_[0].getFieldValue('y_coordinate');
        code = `moveButton('${button}', '${xAxis}', '${yAxis}')\n`
    }

    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "pointertouch__block" },
                { kind: "BLOCK", blockxml: "", type: "xy" },
            ],
            name: "Input",
            colour: "#00AAAA",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "move" },
                { kind: "BLOCK", blockxml: "", type: "action2" },
                { kind: "BLOCK", blockxml: "", type: "action3" },
                { kind: "BLOCK", blockxml: "", type: "action4" },
            ],
            name: "Actions",
            colour: "#B430FF",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "controls_if" },
                { kind: "BLOCK", blockxml: "", type: "comparison_block" },
            ],
            name: "Conditions",
            colour: "%{BKY_LOGIC_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "forever_repeat_block" }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "math_arithmetic" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Math Blocks",
            colour: "#5b67a5",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};