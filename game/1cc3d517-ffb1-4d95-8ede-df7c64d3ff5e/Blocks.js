import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

// Say block
Blockly.Blocks['say_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput(""), "dialogue");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['say_block'] = function (block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'await say("' + dialogue + '"); \n';
    return code;
};
Blockly.Python['say_block'] = function (block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'say("' + dialogue + '")\n';
    return code;
};

// Display input block
Blockly.Blocks['input_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display input box");
        this.setOutput(true, null);
        this.setColour(720);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['input_block'] = function (block) {
    var code = 'get_input_from_user()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['input_block'] = function (block) {
    var code = 'get_input_from_user()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

//Display Details block
Blockly.Blocks['display_details'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display details\n")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['display_details'] = function (block) {
    let val_name = block.getFieldValue('val_name');
    let code = `await display_details();\n`;
    return code;
};
Blockly.Python['display_details'] = function (block) {
    let val_name = block.getFieldValue('val_name');
    let code = `display_details()\n`;
    return code;
};


// Wait Block
Blockly.Blocks['wait'] = {
    init: function () {
        this.appendValueInput("WAIT")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), 'WAIT');
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("secs");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['wait'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "WAIT",
        0
    );
    var code = 'await sleep(' + value_name * 1000 + ');\n';
    return code;
};

Blockly.Python['wait'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "WAIT",
        0
    );
    var code = 'sleep(' + value_name + ')\n';
    return code;
};

// Custom Set Variable Block
Blockly.Blocks['set_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setAlign(Blockly.ALIGN_RIGHT)
            .setCheck(null)
            .appendField(new Blockly.FieldDropdown([
                ["name", "name_"],
                ["age", "age"],
                ["grade", "grade"],
                ["favourite thing", "favourite"]
            ]), "Variable")
            .appendField("=");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', '');
    var code = dropdown_variable_name + '=' + value_name + ';\n';
    return code;
};
Blockly.Python['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', '');
    var code = dropdown_variable_name + ' = ' + value_name + '\n';
    return code;
};

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "set_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "math_number" }], "name": "Game Variables", "colour": "%{BKY_VARIABLES_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "say_block" }, { "kind": "BLOCK", "blockxml": "", "type": "wait" }, { "kind": "BLOCK", "blockxml": "", "type": "display_details" }], "name": "Actions", "colour": "#B430FF" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "input_block" }], "name": "Inputs", "colour": "#D4AF37" }], "xmlns": "https://developers.google.com/blockly/xml", "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }