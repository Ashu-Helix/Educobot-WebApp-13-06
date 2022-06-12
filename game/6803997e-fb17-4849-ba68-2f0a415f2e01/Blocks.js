import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['get_block_type'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Get next patient's temperature");
        this.setOutput(true, null);
        this.setColour(15);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript["get_block_type"] = function (block) {
    var code = "await getPatientTemperature()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["get_block_type"] = function (block) {
    var code = "doctor.get_next_Patient_Temperature()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Blocks['action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Treat patient - Give medicine");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(50);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['normal_temperature'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Patient needs no treatment");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(250);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['wait_block'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("seconds");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['wait_block'] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'await sleep(' + (value_name * 1000) + ');';
    return code;
};
Blockly.Python['wait_block'] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'time.sleep(' + value_name + ')\n';
    return code;
};

Blockly.Blocks['say_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput("Hi"), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['say_block'] = function (block) {
    let code = 'await createDialogue("' + block.getFieldValue('NAME') + '");';
    return code;
};
Blockly.Python['say_block'] = function (block) {
    let code = 'doctor.say("' + block.getFieldValue('NAME') + '")\n';
    return code;
};


Blockly.JavaScript['action_block'] = function (block) {
    let code = "await giveMedicine();";
    return code;
};
Blockly.Python['action_block'] = function (block) {
    let code = "doctor.give_Medicine()\n";
    return code;
};

Blockly.JavaScript['normal_temperature'] = function (block) {
    let code = "await normalTemperature();";
    return code;
};
Blockly.Python['normal_temperature'] = function (block) {
    let code = "doctor.no_treatment_thumbs_up()\n";
    return code;
};


// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable", "default_"],
                    ["patient_temperature", "patient_temperature"],
                ]), "Variable name")
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["set_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(block, "NAME", Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + "=" + value_name + ";\n";
    return code;
};
Blockly.Python["set_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(block, "NAME", Blockly.Python.ORDER_ATOMIC);
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["patient_temperature", "patient_temperature"],
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variables"] = function (block) {
    var code = block.getFieldValue("Options");
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function (block) {
    var code = block.getFieldValue("Options");
    return [code, Blockly.Python.ORDER_ATOMIC];
};


// export const blocks = {
//     kind: "category",
//     name: "Medicine Master",
//     colour: "#FF1493",
//     contents: [{
//             kind: "block",
//             type: "get_block_type",
//         },
//         {
//             kind: "block",
//             type: "action_block",
//         },

//         {
//             kind: "block",
//             type: "normal_temperature",
//         },
//         {
//             kind: "block",
//             type: "wait_block",
//         },
//         {
//             kind: "block",
//             type: "say_block",
//         }, ,
//         {
//             kind: "block",
//             type: "set_variable_holder",
//         }, ,
//         {
//             kind: "block",
//             type: "variables",
//         },
//     ],
// };

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "set_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "variables" }, { "kind": "BLOCK", "blockxml": "", "type": "math_number" }], "name": "Game Variables", "categorystyle": "variable_category" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "get_block_type" }, { "kind": "BLOCK", "blockxml": "", "type": "action_block" }, { "kind": "BLOCK", "blockxml": "", "type": "normal_temperature" }, { "kind": "BLOCK", "blockxml": "", "type": "say_block" }, { "kind": "BLOCK", "blockxml": "", "type": "wait_block" }], "name": "Doctor actions", "colour": "#B430FF", "cssConfig": { "container": "cat1" } }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }], "name": "Conditions", "colour": "%{BKY_LOGIC_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_repeat_ext" }], "name": "Loops", "colour": "%{BKY_LOOPS_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }