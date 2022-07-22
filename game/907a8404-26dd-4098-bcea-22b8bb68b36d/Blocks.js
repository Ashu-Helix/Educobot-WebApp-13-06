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
    reInitValues()
    update = ()=>{ 
        initTrolley()
        if(hasInitialized){
            ` + branch + `
        }
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

//Do action block
Blockly.Blocks['drop_in_cart'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Drop Product in Cart");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(80);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['drop_in_cart'] = function (block) {
    var code = 'drop_in_cart();';
    return code;
};
Blockly.Python['drop_in_cart'] = function (block) {
    var code = 'drop_in_cart()\n';
    return code;
};
//Do action block
Blockly.Blocks['move_forward'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Move cart forward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['move_forward'] = function (block) {
    var code = 'move_forward();';
    return code;
};
Blockly.Python['move_forward'] = function (block) {
    var code = 'move_forward()\n';
    return code;
};
//Do action block
Blockly.Blocks['move_backward'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Move cart backward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['move_backward'] = function (block) {
    var code = 'move_backward();';
    return code;
};
Blockly.Python['move_backward'] = function (block) {
    var code = 'move_backward()\n';
    return code;
};

//Do action block
Blockly.Blocks['show_total'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Show Total");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['show_total'] = function (block) {
    var code = 'show_total();';
    return code;
};
Blockly.Python['show_total'] = function (block) {
    var code = 'show_total()\n';
    return code;
};

//Touch Sprite sense block
Blockly.Blocks['sprite_touch'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I touch ")
            .appendField(new Blockly.FieldDropdown([
                ["options", "default"],
                ["product", "product"],
                ["pay button", "pay_button"]
            ]), "NAME");
        this.setOutput(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['sprite_touch'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = `sprite_touch('${dropdown_name}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['sprite_touch'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = `is_touched('${dropdown_name}')`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

//Curor Keys sensing block
Blockly.Blocks['key_sensing'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Key Pressed is")
            .appendField(new Blockly.FieldDropdown([
                ["Up_Arrow", "1"],
                ["Down_Arrow", "2"]
            ]), "NAME")
        this.setOutput(true, null);
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = `key_pressed(${dropdown_name})`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = '';
    if (dropdown_name == '1')
        code = `is_key_pressed('Up_Arrow')`;
    else
        code = `is_key_pressed('Down_Arrow')`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Game Over block
Blockly.Blocks['game_over'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Game Over");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['game_over'] = function (block) {
    let code = 'game_over();';
    return code;
};
Blockly.Python['game_over'] = function (block) {
    let code = 'game_over()\n';
    return code;
};

// Set Variable Block
Blockly.Blocks['set_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy"],
                ["Cost", "cost"],
                ["Total", "total"],
            ]), "Variable name")
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
    var code = `${dropdown_variable_name} = ${value_name};`
    return code;
};
Blockly.Python['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = `${dropdown_variable_name} = ${value_name}\n`
    return code;
};
//Comparison Blockly
Blockly.Blocks['comparison_block'] = {
    init: function () {
        this.appendValueInput("value1")
            .setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["=", "="],
                [">", ">"],
                ["<", "<"]
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
Blockly.Python['comparison_block'] = function (block) {
    var value_value1 = Blockly.Python.valueToCode(block, 'value1', Blockly.Python.ORDER_ATOMIC);
    var dropdown_operators = block.getFieldValue('operators');
    var value_value2 = Blockly.Python.valueToCode(block, 'value2', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `${value_value1} ${dropdown_operators} ${value_value2}`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};


// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["Cost", "cost"],
                ["Total", "total"],
                ["product discount", "product_discount"],
                ["product cost", "product_cost"],
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = `getValue('${dropdown_options}')`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = `${dropdown_options}`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Game Variables",
            categorystyle: "variable_category",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "key_sensing" },
                { kind: "BLOCK", blockxml: "", type: "sprite_touch" },
            ],
            name: "Input",
            colour: "#00AAAA",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "drop_in_cart" },
                { kind: "BLOCK", blockxml: "", type: "move_forward" },
                { kind: "BLOCK", blockxml: "", type: "move_backward" },
                { kind: "BLOCK", blockxml: "", type: "show_total" },
                { kind: "BLOCK", blockxml: "", type: "game_over" },
            ],
            name: "Actions",
            colour: "#B430FF",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "controls_if" },
                { kind: "BLOCK", blockxml: "", type: "logic_compare" },
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