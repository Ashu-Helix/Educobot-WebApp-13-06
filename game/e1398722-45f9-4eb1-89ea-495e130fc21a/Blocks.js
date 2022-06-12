import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

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
    console.log("okoknow", branch);
    var code = "update = ()=>{ " + branch + "\nreset_inside_update_tasks();}";
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
        game = new Phaser.Game(config);
    }
    return code;
};
Blockly.Python["forever_repeat_block"] = function (block) {
    var branch = Blockly.Python.statementToCode(block, "NAME");
    var code = "while True:\n" + branch;
    return code;
};
// I touch block
Blockly.Blocks["i_touch_block"] = {
    init: function () {
        this.appendDummyInput().appendField("I touch any comb cell");
        this.setOutput(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["i_touch_block"] = function (block) {
    var code = "is_honey_comb_touched()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["i_touch_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "is_honey_comb_touched()";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["score", "score"],
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
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// Change Variable Block
Blockly.Blocks["change_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy_increment"],
                    ["score", "score_increment"],
                ]),
                "Variable name"
            )
            .appendField("by");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["change_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "=" + value_name + ";";
    return code;
};

Blockly.Python["change_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default"],
                ["Small jar", "small_jar"],
                ["Big jar", "big_jar"],
                ["Bees", "bees"],
                ["Score", "score"],
                ["Comb cell", "comb_cell"],
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
    var code = "";
    if (dropdown_options == "small_jar") code = "is_small_jar()";
    else if (dropdown_options == "big_jar") code = "is_big_jar()";
    else if (dropdown_options == "bees") code = "is_bee()";
    else if (dropdown_options == "score") code = "score";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (dropdown_options == "small_jar") code = "is_small_jar()";
    else if (dropdown_options == "big_jar") code = "is_big_jar()";
    else if (dropdown_options == "bees") code = "is_bee()";
    else if (dropdown_options == "score") code = "score";

    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Hide block
Blockly.Blocks["hide_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Hide")
            .appendField(new Blockly.FieldTextInput("Comb cell"), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["hide_block"] = function (block) {
    var text_name = block.getFieldValue("NAME");
    var code = "hide_touched_honey_comb();\n";
    return code;
};

Blockly.Python["hide_block"] = function (block) {
    var text_name = block.getFieldValue("NAME");
    var code = "hide_touched_honey_comb()\n";
    return code;
};

// End Block
Blockly.Blocks["end_block"] = {
    init: function () {
        this.appendDummyInput().appendField("End all");
        this.setPreviousStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["end_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "game_over();\n";
    return code;
};

Blockly.Python["end_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "game_over()\n";
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
    //   console.log(say);
    var code = `say("${say}");\n`;
    return code;
};

Blockly.Python["say_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var say = block.getFieldValue("say");
    //   console.log(say);
    var code = `say("${say}")\n`;
    return code;
};

// Arithmetic
Blockly.Blocks["arithmetic_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable_name", "dummy"],
                    ["Score", "OPTIONNAME"],
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
            .appendField(new Blockly.FieldNumber(0, 0), "NAME2");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["arithmetic_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var dropdown_options = block.getFieldValue("options");
    var number_name2 = block.getFieldValue("NAME2");
    var dropdown_name_value = "";
    var dropdown_options_value = "";
    if (dropdown_name == "OPTIONNAME") dropdown_name_value = "score";
    if (dropdown_options == "option1") dropdown_options_value = "+";
    else if (dropdown_options == "option2") dropdown_options_value = "-";
    var code = `${dropdown_name_value} ${dropdown_options_value}= ${number_name2};\n`;
    return code;
};

Blockly.Python["arithmetic_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var dropdown_options = block.getFieldValue("options");
    var number_name2 = block.getFieldValue("NAME2");
    var dropdown_name_value = "";
    var dropdown_options_value = "";
    if (dropdown_name == "OPTIONNAME") dropdown_name_value = "score";
    if (dropdown_options == "option1") dropdown_options_value = "+";
    else if (dropdown_options == "option2") dropdown_options_value = "-";
    var code = `${dropdown_name_value} ${dropdown_options_value}= ${number_name2}\n`;
    return code;
};

export const blocks = {
    kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "set_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "change_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "variables" }, { "kind": "BLOCK", "blockxml": "", "type": "math_number" }], "name": "Game Variables", "categorystyle": "variable_category" }, {
        "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" },
            // { "kind": "BLOCK", "blockxml": "", "type": "key_sensing" },
            // { "kind": "BLOCK", "blockxml": "", "type": "spritetouch__block" }
        ], "name": "Events", "colour": "#FFFF00"
    }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "hide_block" }, { "kind": "BLOCK", "blockxml": "", "type": "i_touch_block" }, { "kind": "BLOCK", "blockxml": "", "type": "end_block" }, { "kind": "BLOCK", "blockxml": "", "type": "say_block" }, { "kind": "BLOCK", "blockxml": "", "type": "arithmetic_block" }], "name": "Actions", "colour": "#B430FF" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }], "name": "Conditions" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_negate" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_boolean" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_null" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_ternary" }], "name": "Boolean", "colour": "%{BKY_LOGIC_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37"
}