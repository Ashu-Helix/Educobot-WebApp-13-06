import "blockly/python";
import "blockly/javascript";
import Blockly from "blockly";

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

// Forever repeat block
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
    var code = `update = async () => {\n` + branch + `}`;

    if (repeat_forever_flag) {
        eval(code);
        game.destroy();
        document.getElementById("sprite-container").innerHTML = "";
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
    }
    return code;
};
Blockly.Python["forever_repeat_block"] = function (block) {
    var branch = Blockly.Python.statementToCode(block, "NAME");
    var code = "while True:\n" + branch;
    return code;
};

// Variable holder
Blockly.Blocks["variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set ")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["total", "option1"],
                    ["count", "option2"],
                    ["score", "option3"],
                    ["number", "option4"],
                    ["win_score", "option5"],
                    ["val", "option6"],
                ]),
                "Variable name"
            )
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("%{BKY_VARIABLES_HUE}");
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variable_holder"] = function (block) {
    var dropdown_options = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_NONE
    );
    var dropdown_options_value = "";
    if (dropdown_options == "option1")
        dropdown_options_value = "set_total(" + value_name + ")";
    else if (dropdown_options == "option2")
        dropdown_options_value = "set_count(" + value_name + ")";
    else if (dropdown_options == "option3")
        dropdown_options_value = "set_score(" + value_name + ")";
    else if (dropdown_options == "option4")
        dropdown_options_value = "set_number(" + value_name + ")";
    else if (dropdown_options == "option5")
        dropdown_options_value = "set_win_score(" + value_name + ")";
    else if (dropdown_options == "option6")
        dropdown_options_value =
            "i_touch_pearl = false;\nlet totalValue = " + value_name + ";";
    var code = `${dropdown_options_value};\n`;
    return code;
};
Blockly.Python["variable_holder"] = function (block) {
    var dropdown_options = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var dropdown_options_value = "";
    if (dropdown_options == "option1")
        dropdown_options_value = "set_total(" + value_name + ")";
    else if (dropdown_options == "option2")
        dropdown_options_value = "set_count(" + value_name + ")";
    else if (dropdown_options == "option3")
        dropdown_options_value = "set_score(" + value_name + ")";
    else if (dropdown_options == "option4")
        dropdown_options_value = "set_number(" + value_name + ")";
    else if (dropdown_options == "option5")
        dropdown_options_value = "set_win_score(" + value_name + ")";
    else if (dropdown_options == "option6")
        dropdown_options_value = "let totalValue = " + value_name;
    var code = `${dropdown_options_value}\n`;
    return code;
};

// change Variable holder
Blockly.Blocks["change_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change ")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["total", "option1"],
                    ["count", "option2"],
                    ["score", "option3"],
                    ["number", "option4"],
                    ["win_score", "option5"],
                ]),
                "Variable name"
            )
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("%{BKY_VARIABLES_HUE}");
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["change_variable_holder"] = function (block) {
    var dropdown_options = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_NONE
    );
    var dropdown_options_value = "";
    if (dropdown_options == "option1")
        dropdown_options_value = "set_total(" + total + value_name + ")";
    else if (dropdown_options == "option2")
        dropdown_options_value = "set_count(" + count + value_name + ")";
    else if (dropdown_options == "option3")
        dropdown_options_value = "set_score(" + score + value_name + ")";
    else if (dropdown_options == "option4")
        dropdown_options_value = "set_number(" + number + value_name + ")";
    else if (dropdown_options == "option5")
        dropdown_options_value = "set_win_score(" + win_score + value_name + ")";
    else if (dropdown_options == "option6")
        dropdown_options_value =
            "i_touch_pearl = false;\nlet totalValue = " + value_name + ";";
    var code = `${dropdown_options_value};\n`;
    return code;
};
Blockly.Python["change_variable_holder"] = function (block) {
    var dropdown_options = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var dropdown_options_value = "";
    if (dropdown_options == "option1")
        dropdown_options_value = "set_total(" + value_name + ")";
    else if (dropdown_options == "option2")
        dropdown_options_value = "set_count(" + value_name + ")";
    else if (dropdown_options == "option3")
        dropdown_options_value = "set_score(" + value_name + ")";
    else if (dropdown_options == "option4")
        dropdown_options_value = "set_number(" + value_name + ")";
    else if (dropdown_options == "option5")
        dropdown_options_value = "set_win_score(" + value_name + ")";
    else if (dropdown_options == "option6")
        dropdown_options_value = "let totalValue = " + value_name;
    var code = `${dropdown_options_value}\n`;
    return code;
};

// Variable block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default"],
                ["total", "option1"],
                ["count", "option2"],
                ["score", "option3"],
                ["number", "option4"],
                ["win_score", "option5"],
                ["totalValue", "option6"],
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
    if (dropdown_options == "option1")
        dropdown_options_value = "parseFloat(total)";
    else if (dropdown_options == "option2") dropdown_options_value = "count";
    else if (dropdown_options == "option3") dropdown_options_value = "score";
    else if (dropdown_options == "option4") dropdown_options_value = "number";
    else if (dropdown_options == "option5") dropdown_options_value = "win_score";
    else if (dropdown_options == "option6") dropdown_options_value = "totalValue";
    var code = `${dropdown_options_value}`;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var dropdown_options_value = "";
    if (dropdown_options == "option1") dropdown_options_value = "total";
    else if (dropdown_options == "option2") dropdown_options_value = "count";
    else if (dropdown_options == "option3") dropdown_options_value = "score";
    else if (dropdown_options == "option4") dropdown_options_value = "number";
    else if (dropdown_options == "option5") dropdown_options_value = "win_score";
    else if (dropdown_options == "option6") dropdown_options_value = "totalValue";
    var code = `${dropdown_options_value}`;
    return [code, Blockly.Python.ORDER_ATOMIC];
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
        Blockly.Python.ORDER_ATOMIC
    );
    let code = "sleep(" + value_name + ")\n";
    return code;
};

// Start game
Blockly.Blocks["start_game"] = {
    init: function () {
        this.appendDummyInput().appendField("Start_game");
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["start_game"] = function (block) {
    var code = "start_game();\n";
    return code;
};

Blockly.Python["start_game"] = function (block) {
    var code = "start_game()\n";
    return code;
};

// i_touch_pearl
Blockly.Blocks["i_touch_pearl"] = {
    init: function () {
        this.appendDummyInput().appendField("i_touch_pearl");
        this.setOutput(true, null);
        this.setColour(920);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["i_touch_pearl"] = function (block) {
    var code = "i_touch_pearl";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["i_touch_pearl"] = function (block) {
    var code = "i_touch_pearl";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// shoot_pearl

Blockly.Blocks["shoot_pearl"] = {
    init: function () {
        this.appendDummyInput().appendField("shoot_pearl");
        this.setOutput(true, null);
        this.setColour(400);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["shoot_pearl"] = function (block) {
    var code = "await shoot_pearl();\n";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["shoot_pearl"] = function (block) {
    var code = "shoot_pearl()\n";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// reset_pearl
Blockly.Blocks["reset_pearl"] = {
    init: function () {
        this.appendDummyInput().appendField("reset_pearl");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["reset_pearl"] = function (block) {
    var code = "reset_pearl();\n";
    return code;
};

Blockly.Python["reset_pearl"] = function (block) {
    var code = "reset_pearl()\n";
    return code;
};

// generate_number

Blockly.Blocks["generate_number"] = {
    init: function () {
        this.appendDummyInput().appendField("generate_random_number");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["generate_number"] = function (block) {
    var code = "generate_number()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["generate_number"] = function (block) {
    var code = "generate_number()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// end_game

Blockly.Blocks["end_game"] = {
    init: function () {
        this.appendDummyInput().appendField("end_game");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["end_game"] = function (block) {
    var code = "game_over();\n";
    return code;
};

Blockly.Python["end_game"] = function (block) {
    var code = "game_over()\n";
    return code;
};

// Say Block

Blockly.Blocks["say_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("say")
            .appendField(new Blockly.FieldTextInput("Hi"), "string");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["say_block"] = function (block) {
    var text_string = block.getFieldValue("string");
    var code = 'say ("' + text_string + '");\n';
    return code;
};

Blockly.Python["say_block"] = function (block) {
    var text_string = block.getFieldValue("string");
    var code = 'say ("' + text_string + '")\n';
    return code;
};

// Game Started

Blockly.Blocks["game_started"] = {
    init: function () {
        this.appendDummyInput().appendField("is_game_running");
        this.setOutput(true, null);
        this.setColour(50);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["game_started"] = function (block) {
    var code = "game_started";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["game_started"] = function (block) {
    var code = "game_started";
    return [code, Blockly.Python.ORDER_ATOMIC];
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
            contents: [
                { kind: "BLOCK", blockxml: "", type: "i_touch_pearl" },
                { kind: "BLOCK", blockxml: "", type: "game_started" },
            ],
            name: "Events",
            colour: "#FFFF00",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "start_game" },
                { kind: "BLOCK", blockxml: "", type: "shoot_pearl" },
                { kind: "BLOCK", blockxml: "", type: "reset_pearl" },
                { kind: "BLOCK", blockxml: "", type: "generate_number" },
                { kind: "BLOCK", blockxml: "", type: "end_game" },
                { kind: "BLOCK", blockxml: "", type: "say_block" },
                { kind: "BLOCK", blockxml: "", type: "wait_block" },
            ],
            name: "Actions",
            colour: "%{BKY_PROCEDURES_HUE}",
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