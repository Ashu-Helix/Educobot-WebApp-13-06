import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;


// Wait Block
Blockly.Blocks["wait"] = {
    init: function () {
        this.appendValueInput("WAIT")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "WAIT");
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Sec(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["wait"] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(block, "WAIT", 0);
    var code = `await sleep(${value_name});\n`;
    return code;
};

Blockly.Python["wait"] = function (block) {
    var value_name = Blockly.Python.valueToCode(block, "WAIT", 0);
    var code = `sleep(${value_name})\n`;
    return code;
};


// Variable holder block
Blockly.Blocks["variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField('Set')
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable", "default_"],
                    ["day", "day"],
                ]),
                "Variable name"
            )
            .appendField('=')
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = `${dropdown_variable_name} = ${value_name};\n`;
    return code;
};

Blockly.Python["variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = `${dropdown_variable_name} = ${value_name}\n`;
    return code;
};

// Change Variable Block
Blockly.Blocks['change_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(new Blockly.FieldDropdown([
                ["Variable", "default_"],
                ["day", "day"],
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
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = dropdown_variable_name + ' += ' + value_name + '\n';
    return code;
};


// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["day", "day"],
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
    var code = dropdown_options;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = dropdown_options;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

//Hide block
Blockly.Blocks["hide_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Hide")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Moon", "hide_moon()"],
                ]),
                "NAME"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(730);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["hide_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    return `await ${dropdown_name};\n`;
};

Blockly.Python["hide_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    return `${dropdown_name}\n`;
};


//moon block
Blockly.Blocks["moon_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Show")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Crescent moon", "show_crescent_moon"],
                    ["First quarter moon", "show_first_quarter_moon"],
                    ["Gibbous moon", "show_gibbous_moon"],
                    ["Full moon", "show_full_moon"],
                ]),
                "options"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(40);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["moon_block"] = function (block) {
    var dropdown_options = block.getFieldValue("options");
    let code = ""
    if (day < 20)
        code = `await ${dropdown_options}();\n`
    return code;
};

Blockly.Python["moon_block"] = function (block) {
    var dropdown_options = block.getFieldValue("options");
    let code = `${dropdown_options}()\n`
    return code;
};


//Show Day text block
Blockly.Blocks['show_day'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Show Day Text", "Options");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['show_day'] = function (block) {
    var code = `Day.setText("Day: " + day + " -" + " 8:00pm");\n`;
    return code
};
Blockly.Python['show_day'] = function (block) {
    var code = `Day.setText("Day: " + day + " -" + " 8:00pm")\n`;
    return code
};


//repeat_no block
Blockly.Blocks['repeat_no'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("repeat_no", 'option');
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['repeat_no'] = function (block) {
    let code = repeat_no;
    return [code, Blockly.JavaScript.ORDER_NONE]
};
Blockly.Python['repeat_no'] = function (block) {
    let code = repeat_no;
    return [code, Blockly.Python.ORDER_ATOMIC]
};


//day block
Blockly.Blocks['day_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("day", 'option');
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['day_block'] = function (block) {
    let code = block.getFieldValue("option");
    return [code, Blockly.JavaScript.ORDER_NONE]
};
Blockly.Python['day_block'] = function (block) {
    let code = block.getFieldValue("option");
    return [code, Blockly.Python.ORDER_ATOMIC]
};


export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "change_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Variables",
            colour: "%{BKY_VARIABLES_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "hide_block" },
                { kind: "BLOCK", blockxml: "", type: "wait" },
                { kind: "BLOCK", blockxml: "", type: "moon_block" },
            ],
            name: "Actions",
            colour: "#B430FF",
            cssConfig: { container: "cat1" },
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_repeat_ext" }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
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
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};