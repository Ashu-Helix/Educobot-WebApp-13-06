import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['position'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Choose")
            .appendField(new Blockly.FieldDropdown([
                ["Coordinates", "Coordinates"],
                ["Random position", "Random position"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['variable_holder'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy"],
                ["set tree", "tree"],
                ["set shrub", "shrub"],
                ["set grass", "grass"],
            ]), "plantType")
            .appendField("coordinates =");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(285);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['xy'] = {
    init: function() {
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

Blockly.Blocks['water_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Water the")
            .appendField(new Blockly.FieldDropdown([
                ["type of plant", "dummy"],
                ["tree", "tree"],
                ["shrub", "shrub"],
                ["grass", "grass"]
            ]), "options1");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['empty_string_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput(""), "inputstring");
        this.setOutput(true, null);
        this.setColour(75);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['wait_block'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("second(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['position'] = function(block) {
    return '';
};
Blockly.Python['position'] = function(block) {
    return '';
};

Blockly.JavaScript['variable_holder'] = function(block) {
    let plantType = block.getFieldValue('plantType');
    let code = '';

    if (block.childBlocks_ && block.childBlocks_[0] && block.childBlocks_[0].type == 'xy') {
        let x_coordinate = block.childBlocks_[0].getFieldValue('x_coordinate');
        let y_coordinate = block.childBlocks_[0].getFieldValue('y_coordinate');
        code = 'await showActionByCordXY("' + plantType + '", "' + x_coordinate + '", "' + y_coordinate + '");';
    }

    return code;
};
Blockly.Python['variable_holder'] = function(block) {
    let plantType = block.getFieldValue('plantType');
    let code = 'waterer.set_coordinates("' + plantType + '", None)';

    if (block.childBlocks_ && block.childBlocks_[0] && block.childBlocks_[0].type == 'xy') {
        let x_coordinate = block.childBlocks_[0].getFieldValue('x_coordinate');
        let y_coordinate = block.childBlocks_[0].getFieldValue('y_coordinate');
        code = 'waterer.set_coordinates("' + plantType + '", (' + x_coordinate + ', ' + y_coordinate + '))\n';
    }

    return code;
};

Blockly.JavaScript['xy'] = function(block) {
    return '';
};
Blockly.Python['xy'] = function(block) {
    return '';
};

Blockly.JavaScript['water_block'] = function(block) {
    let plantType = block.getFieldValue('options1');
    let code = 'await waterSelectedPlant("' + plantType + '");';
    return code;
};
Blockly.Python['water_block'] = function(block) {
    let plantType = block.getFieldValue('options1');
    let code = 'waterer.water("' + plantType + '")\n';
    return code;
};

Blockly.JavaScript['empty_string_block'] = function(block) {
    return '';
};
Blockly.Python['empty_string_block'] = function(block) {
    return '';
};

Blockly.JavaScript['wait_block'] = function(block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'await sleep(' + (value_name * 1000) + ');';
    return code;
};
Blockly.Python['wait_block'] = function(block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'time.sleep(' + value_name + ')\n';
    return code;
};

export const blocks = {
    kind: "category",
    name: "Wonder",
    colour: "#5000ff",
    contents: [{
            kind: "block",
            type: "position",
        },
        {
            kind: "block",
            type: "variable_holder",
        },
        {
            kind: "block",
            type: "xy",
        },
        {
            kind: "block",
            type: "water_block",
        },
        {
            kind: "block",
            type: "empty_string_block",
        },
        {
            kind: "block",
            type: "wait_block",
        },
    ],
};