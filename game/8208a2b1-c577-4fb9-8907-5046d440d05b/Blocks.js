import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["number", "number"],
                    ["guess", "guess"],
                ]),
                "Variable name"
            )
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
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "=" + value_name + ";\n";
    return code;
};
Blockly.Python["set_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "=" + value_name + "\n";
    return code;
};

// Varialble holder used
Blockly.Blocks["variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["Guess", "op1"],
                    ["Number", "op2"],
                ]),
                "Variable name"
            )
            .appendField("=");
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
    var dropdown_variable_name_value = "";
    if (dropdown_variable_name == "op1") dropdown_variable_name_value = "Guess";
    else if (dropdown_variable_name == "op2")
        dropdown_variable_name_value = "Number";
    var code = `${dropdown_variable_name_value}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.Python["variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var dropdown_variable_name_value = "";
    if (dropdown_variable_name == "op1") dropdown_variable_name_value = "Guess";
    else if (dropdown_variable_name == "op2")
        dropdown_variable_name_value = "Number";
    var code = `${dropdown_variable_name_value}`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Variable block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default"],
                ["Number", "op1"],
                ["Guess", "op2"],
            ]),
            "Options"
        );
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var dropdown_options_value = "";
    if (dropdown_options == "op1") dropdown_options_value = "number";
    else if (dropdown_options == "op2") dropdown_options_value = "guess";
    var code = `${dropdown_options_value}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var dropdown_options_value = "";
    if (dropdown_options == "op1") dropdown_options_value = "Number";
    else if (dropdown_options == "op2") dropdown_options_value = "Guess";
    var code = `${dropdown_options_value}`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Arithmetic block
Blockly.Blocks["arithmetic_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable_name", "dummy"],
                    ["Number", "op1"],
                    ["Guess", "op2"],
                ]),
                "NAME"
            )
            .appendField(
                new Blockly.FieldDropdown([
                    ["+", "option1"],
                    ["-", "option2"],
                ]),
                "options"
            )
            .appendField(new Blockly.FieldNumber(0, 0, 10), "num");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(50);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["arithmetic_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var dropdown_options = block.getFieldValue("options");
    var number_num = block.getFieldValue("num");
    var dropdown_name_value = "";
    var dropdown_options_value = "";
    if (dropdown_name == "op1") dropdown_name_value = "number";
    else if (dropdown_name == "op2") dropdown_name_value = "guess";

    if (dropdown_options == "option1") dropdown_options_value = "+";
    else if (dropdown_options == "option2") dropdown_options_value = "-";
    var code = `${dropdown_name_value} ${dropdown_options_value} ${number_num}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["arithmetic_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var dropdown_options = block.getFieldValue("options");
    var number_num = block.getFieldValue("num");
    var dropdown_name_value = "";
    var dropdown_options_value = "";
    if (dropdown_name == "op1") dropdown_name_value = "Number";
    else if (dropdown_name == "op2") dropdown_name_value = "Guess";

    if (dropdown_options == "option1") dropdown_options_value = "+";
    else if (dropdown_options == "option2") dropdown_options_value = "-";
    var code = `${dropdown_name_value} ${dropdown_options_value} ${number_num}`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// End forever loop
Blockly.Blocks["single_action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("End All");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["single_action_block"] = function (block) {
    var code = "end_game();\nbreak;\n";
    return code;
};

Blockly.Python["single_action_block"] = function (block) {
    var code = "end_game()\n";
    return code;
};

// Input block
Blockly.Blocks["input_bock"] = {
    init: function () {
        this.appendDummyInput().appendField("Display input box");
        this.setOutput(true, null);
        this.setColour(700);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["input_bock"] = function (block) {
    var code = 'get_int_input_from_user("Enter your guess: ")';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["input_bock"] = function (block) {
    var code = 'get_int_input_from_user("Enter your guess: ")';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Say Block
Blockly.Blocks["say_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput(""), "say");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["say_block"] = function (block) {
    var say = block.getFieldValue("say");
    var code = `say("${say}");\n`;
    return code;
};

Blockly.Python["say_block"] = function (block) {
    var say = block.getFieldValue("say");
    var code = `say("${say}")\n`;
    return code;
};

// Wait block
Blockly.Blocks["wait_block"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("sec");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};
Blockly.JavaScript["wait_block"] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let code = "await sleep(" + value_name + ");\n";
    return code;
};
Blockly.Python["wait_block"] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_NONE
    );
    let code = "sleep(" + value_name + ")\n";
    return code;
};

// display input box
Blockly.Blocks["display_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Display input box");
        this.setOutput(true, null);
        this.setColour(65);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["display_block"] = function (block) {
    var code = "get_int_input_from_user('Enter your guess: ');\n";
    console.log(code);
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["display_block"] = function (block) {
    var code = "get_int_input_from_user('Enter your guess: ');";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks["magician_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Magician shows Guessed Number");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(660);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["magician_block"] = function (block) {
    var code = "await PlayMagicien();\n";
    return code;
};

Blockly.Python["magician_block"] = function (block) {
    var code = "await PlayMagicien()\n";
    return code;
};

Blockly.Blocks["boy_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Reveal Answer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(810);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["boy_block"] = function (block) {
    var code = "await PlayanimBoy();\n";
    return code;
};

Blockly.Python["boy_block"] = function (block) {
    var code = "await PlayanimBoy()\n";
    return code;
};

Blockly.Blocks["intro_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Boy says \"Guess a Number\"");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["intro_block"] = function (block) {
    var code = "StartIntro();\n";
    return code;
};

Blockly.Python["intro_block"] = function (block) {
    var code = "StartIntro()\n";
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
            ],
            name: "Variable",
            colour: "%{BKY_VARIABLES_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "input_bock" },
                { kind: "BLOCK", blockxml: "", type: "say_block" },
                { kind: "BLOCK", blockxml: "", type: "single_action_block" },
                { kind: "BLOCK", blockxml: "", type: "wait_block" },
                { kind: "BLOCK", blockxml: "", type: "intro_block" },
                { kind: "BLOCK", blockxml: "", type: "boy_block" },
                { kind: "BLOCK", blockxml: "", type: "magician_block" },
            ],
            name: "Actions",
            colour: "#B430FF",
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
                { kind: "BLOCK", blockxml: "", type: "logic_operation" },
            ],
            name: "Conditional",
            colour: "%{BKY_LOGIC_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "math_random_int" },
                { kind: "BLOCK", blockxml: "", type: "arithmetic_block" },
            ],
            name: "Math",
            colour: "%{BKY_MATH_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};