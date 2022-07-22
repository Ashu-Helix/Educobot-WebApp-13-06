import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

////////////////////////////////////////////////////////////////////////////////////////

import {
    update,
    preload,
    create,
    gameHeight,
    gameWidth,
    repeat_forever_flag
} from "./main";

// Start game
Blockly.Blocks["action1"] = {
    init: function () {
        this.appendDummyInput().appendField("Start game");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action1"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "start_Game();\n";
    return code;
};
Blockly.Python["action1"] = function (block) {
    // TODO: Assemble Python into code variable.
    var code = "start_Game()\n";
    return code;
};

// Variable holder
Blockly.Blocks["variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["Timer", "op1"],
                    ["Score", "op2"],
                    ["spelling", "op3"],
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
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var dropdown_variable_name_value = "";
    if (dropdown_variable_name == "op1") dropdown_variable_name_value = "Timer =";
    else if (dropdown_variable_name == "op2")
        dropdown_variable_name_value = "Score=";
    else if (dropdown_variable_name == "op3")
        dropdown_variable_name_value = "spelling=";
    // TODO: Assemble JavaScript into code variable.
    var code = `${dropdown_variable_name_value} ${value_name};\n`;
    if (dropdown_variable_name == "op1") {
        code = `Timer = ${value_name};\n`;
    }
    return code;
};
Blockly.Python["variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var dropdown_variable_name_value = "";
    if (dropdown_variable_name == "op1") dropdown_variable_name_value = "Timer=";
    else if (dropdown_variable_name == "op2")
        dropdown_variable_name_value = "Score =";
    else if (dropdown_variable_name == "op3")
        dropdown_variable_name_value = "spelling =";
    // TODO: Assemble Python into code variable.
    var code = `${dropdown_variable_name_value} ${value_name}\n`;
    if (dropdown_variable_name == "op1") {
        code = `Timer = ${value_name}\n`;
    }
    return code;
};
// Variable block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default"],
                ["spelling", "op1"],
                ["correct_spelling", "op2"],
                ["Timer", "op3"],
                ["Score", "op4"],
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
    if (dropdown_options == "op1") dropdown_options_value = "spelling";
    else if (dropdown_options == "op2")
        dropdown_options_value = "correct_spelling";
    else if (dropdown_options == "op3") dropdown_options_value = "Timer";
    else if (dropdown_options == "op4") dropdown_options_value = "Score";
    // TODO: Assemble JavaScript into code variable.
    var code = `${dropdown_options_value}`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var dropdown_options_value = "";
    if (dropdown_options == "op1") dropdown_options_value = "spelling";
    else if (dropdown_options == "op2")
        dropdown_options_value = "correct_spelling";
    else if (dropdown_options == "op3") dropdown_options_value = "Timer";
    else if (dropdown_options == "op4") dropdown_options_value = "Score";
    // TODO: Assemble Python into code variable.
    var code = `${dropdown_options_value}`;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_ATOMIC];
};
// Timer on
Blockly.Blocks["action2"] = {
    init: function () {
        this.appendDummyInput().appendField("Timer on");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(150);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action2"] = function (block) {
    // TODO: Assemble JavaScript into code variable.

    var code = "start_timer(Timer);\n";
    return code;
};
Blockly.Python["action2"] = function (block) {
    // TODO: Assemble Python into code variable.
    var code = "Start_timer()\n";
    return code;
};

// Display picture
Blockly.Blocks["action3"] = {
    init: function () {
        this.appendDummyInput().appendField("Display picture");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action3"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "await display_picture();\n";
    return code;
};

Blockly.Python["action3"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "display_picture()\n";
    return code;
};

// Input box
Blockly.Blocks["input_bock"] = {
    init: function () {
        this.appendDummyInput().appendField("Display input box");
        this.setOutput(true, null);
        this.setColour(760);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["input_bock"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "get_string_input_from_user()";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["input_bock"] = function (block) {
    // TODO: Assemble Python into code variable.
    var code = "get_input_from_user()";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Next question block
Blockly.Blocks["action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Next question");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code =
        " ShowLetters(true);\nNewTry = false;\nawait sleep(2);\nnext_question();\n";
    return code;
};

Blockly.Python["action_block"] = function (block) {
    // TODO: Assemble Python into code variable.
    var code = "next_question()\n";
    return code;
};

// Try again block
Blockly.Blocks["actrion_try_again"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Try again");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["actrion_try_again"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code =
        " ShowLetters(false);\nNewTry = true;\nawait sleep(2);\nawait try_again();\n";
    return code;
};

Blockly.Python["actrion_try_again"] = function (block) {
    // TODO: Assemble Python into code variable.
    var code = "await try_again()\n";
    return code;
};

// wait block
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
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let code = "await sleep(" + value_name + ")\n";
    return code;
};

// Say Block
Blockly.Blocks["say_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput(""), "say");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["say_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var say = block.getFieldValue("say");
    let code = `say("${say}");\n`;
    return code;
};

Blockly.Python["say_block"] = function (block) {
    // TODO: Assemble Python into code variable.
    var say = block.getFieldValue("say");
    let code = `say("${say}")\n`;
    return code;
};

// Game Over block
Blockly.Blocks["end_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("End all");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};
Blockly.JavaScript["end_block"] = function (block) {
    let code = "game_over();\n";
    return code;
};
Blockly.Python["end_block"] = function (block) {
    let code = "game_over()\n";
    return code;
};
// forever repeat block

Blockly.Blocks["forever_repeat_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Repeat forever");
        this.appendStatementInput("NAME")
            .setCheck(null)
            .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(135);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["forever_repeat_block"] = function (block) {
    var branch = Blockly.JavaScript.statementToCode(block, "NAME");
    // console.log(branch);
    var code =
        "update = async () => {\n  if (!QuestionExist || GameIsOver) { return; }\nQuestionExist = false;\nconsole.log('working');\n" +
        branch +
        "}";
    if (repeat_forever_flag) {
        eval(code);
        game.destroy();
        document.getElementById("sprite-container").innerHTML = "";
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
                        debug: false,
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
Blockly.Python["forever_repeat_block"] = function (block) {
    var branch = Blockly.Python.statementToCode(block, "NAME");
    var code = "while True:\n" + branch;
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Variables",
            colour: "%{BKY_VARIABLES_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "input_bock" }],
            name: "Input",
            colour: "yellow",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "action1" },
                { kind: "BLOCK", blockxml: "", type: "action_block" },
                { kind: "BLOCK", blockxml: "", type: "action2" },
                { kind: "BLOCK", blockxml: "", type: "action3" },
                { kind: "BLOCK", blockxml: "", type: "wait_block" },
                { kind: "BLOCK", blockxml: "", type: "say_block" },
                { kind: "BLOCK", blockxml: "", type: "actrion_try_again" },
                { kind: "BLOCK", blockxml: "", type: "end_block" },
            ],
            name: "Action",
            colour: "#E90F0F",
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
            name: "Math",
            colour: "%{BKY_MATH_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};
