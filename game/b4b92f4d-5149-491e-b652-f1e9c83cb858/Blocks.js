import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['pointertouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I")
            .appendField("touch")
            .appendField(new Blockly.FieldDropdown([
                ["Sprite ", "dummy2"],
                ["mosquito", "mosquito"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(265);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['empty_string_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(""), "inputstring");
        this.setOutput(true, null);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.Blocks['arithmetic_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(new Blockly.FieldDropdown([
                ["Variable_name", "dummy"],
                ["Health", "healthValue"],
                ["Timer", "timerValue"]
            ]), "NAME")
            .appendField(new Blockly.FieldDropdown([
                ["+", "+"],
                ["-", "-"]
            ]), "options")
            .appendField(new Blockly.FieldNumber(0, 0), "NAME2");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['show_variable_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy"],
                ["Health", "health"],
                ["Timer", "timer"]
            ]), "NAME")
            .appendField(" on screen");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(265);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['game_over_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Game over");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
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
                ["Mosquito", "option1"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
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
        ` + branch + `
        isMosquitoHitByBat = false;
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
                        debug: false
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

Blockly.JavaScript['pointertouch__block'] = function (block) {
    const options2 = block.getFieldValue('options2');
    let code = (options2 == 'mosquito') + ' && isMosquitoHitByBat';

    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['pointertouch__block'] = function (block) {
    const options2 = block.getFieldValue('options2');
    let code = (options2 == 'mosquito') + ' && isMosquitoHitByBat';

    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['arithmetic_block'] = function (block) {
    const sign = block.getFieldValue('options');
    const value = block.getFieldValue('NAME2');
    let code = 'increaseHealthBy("' + sign + '", "' + value + '");';

    return code;
};
Blockly.Python['arithmetic_block'] = function (block) {
    const sign = block.getFieldValue('options');
    const value = block.getFieldValue('NAME2');
    let code = 'increaseHealthBy("' + sign + '", "' + value + '");';

    return code;
};

Blockly.JavaScript['show_variable_block'] = function (block) {
    let element = block.getFieldValue('NAME');
    let code = 'displayElementByName("' + element + '", health, timer);';
    return code;
};
Blockly.Python['show_variable_block'] = function (block) {
    let element = block.getFieldValue('NAME');
    let code = 'displayElementByName("' + element + '", health, timer);';
    return code;
};

Blockly.JavaScript['game_over_block'] = function (block) {
    let code = 'showGameOverMsg();';
    return code;
};
Blockly.Python['game_over_block'] = function (block) {
    let code = 'showGameOverMsg();';
    return code;
};

Blockly.JavaScript['hide_block'] = function (block) {
    let code = 'hideMosquitoOnTouch();';
    return code;
};
Blockly.Python['hide_block'] = function (block) {
    let code = 'hideMosquitoOnTouch();';
    return code;
};


// Custom Set Variable Block
Blockly.Blocks['set_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["timer", "timerValue"],
                ["health", "healthValue"]
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
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + '=' + value_name + ';';
    return code;
};
Blockly.Python['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + ' = ' + value_name + '\n';
    return code;
};

// Change Variable Block
Blockly.Blocks['change_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["timer", "timerValue"],
                ["health", "healthValue"]
            ]), "Variable name")
            .appendField("by");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + '+=' + value_name + ';';
    return code;
};

Blockly.Python['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + ' += ' + value_name + '\n';
    return code;
};

// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["timer", "timerValue"],
                ["health", "healthValue"]
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['variables'] = function (block) {
    var code = block.getFieldValue('Options');;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['variables'] = function (block) {
    var code = block.getFieldValue('Options');;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "change_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Game Variables",
            categorystyle: "variable_category",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "pointertouch__block" }],
            name: "Events",
            colour: "#FFFF00",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "hide_block" },
                { kind: "BLOCK", blockxml: "", type: "game_over_block" },
            ],
            name: "Actions",
            colour: "#B430FF",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "controls_if" },
                { kind: "BLOCK", blockxml: "", type: "logic_compare" },
                { kind: "BLOCK", blockxml: "", type: "logic_operation" },
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
            contents: [{ kind: "BLOCK", blockxml: "", type: "show_variable_block" }],
            name: "Display",
            colour: "#FFC0CB",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};