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

// Start game block
Blockly.Blocks["single_action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Start game");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["single_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "start_game();\n";
    return code;
};
Blockly.Python["single_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "start_game()\n";
    return code;
};

// Key pressed block

Blockly.Blocks["key_sensing"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Key Pressed is")
            .appendField(
                new Blockly.FieldDropdown([
                    //   ["Left_arrow", "option1"],
                    //   ["Right_arrow", "option2"],
                    //   ["Up_arrow", "option3"],
                    //   ["Down_arrow", "option4"],
                    ["F", "option5"],
                    ["E", "option6"],
                    //   ["Pointer", "option7"],
                    //   ["Shift", "option8"],
                    //   ["Shift + Left arrow", "option9"],
                    //   ["Shift + Right arrow", "option10"],
                ]),
                "NAME"
            );
        this.setOutput(true, null);
        this.setColour(40);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["key_sensing"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (dropdown_name == "option5") {
        code = `Key == "f"`;
    } else if (dropdown_name == "option6") {
        code = `Key == "e"`;
    }
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["key_sensing"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (dropdown_name == "option5") {
        code = `Key_pressed() == "f"`;
    } else if (dropdown_name == "option6") {
        code = `Key_pressed() == "e"`;
    }
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Move to block

Blockly.Blocks["move_to_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move to")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Place", "dummy"],
                    ["Fuel bunk", "option1"],
                    ["Electricity bunk", "OPTIONNAME"],
                ]),
                "options1"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["move_to_block"] = function (block) {
    var dropdown_options1 = block.getFieldValue("options1");
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (dropdown_options1 == "option1") {
        code = "move_to_fuel_bunk();\n";
    } else if (dropdown_options1 == "OPTIONNAME") {
        code = "move_to_electricity_bunk();\n";
    }
    return code;
};

Blockly.Python["move_to_block"] = function (block) {
    var dropdown_options1 = block.getFieldValue("options1");
    // TODO: Assemble JavaScript into code variable.
    var code = "";
    if (dropdown_options1 == "option1") {
        code = "move_to_fuel_bunk()\n";
    } else if (dropdown_options1 == "OPTIONNAME") {
        code = "move_to_electricity_bunk()\n";
    }
    return code;
};

// End all block

Blockly.Blocks["next_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Next Car");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(880);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["next_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "next_car();\n";
    return code;
};

Blockly.Python["next_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "next_car()\n";
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
    let code = "time.sleep(" + value_name + ")\n";
    return code;
};

// Input Key Block
Blockly.Blocks["key_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Wait for key press");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["key_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "Key = await wait_for_key_press();\n";
    return code;
};

Blockly.Python["key_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "Key = wait_for_key_press()\n";
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "key_block" },
                { kind: "BLOCK", blockxml: "", type: "key_sensing" },
            ],
            name: "Events",
            colour: "#FFFF00",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "single_action_block" },
                { kind: "BLOCK", blockxml: "", type: "move_to_block" },
                { kind: "BLOCK", blockxml: "", type: "next_block" },
                { kind: "BLOCK", blockxml: "", type: "wait_block" },
            ],
            name: "Actions",
            colour: "#B430FF",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_if" }],
            name: "Conditions",
            colour: "%{BKY_LOGIC_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_repeat_ext" }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};

// Functions
// start_game();
// next_car();
// wait_for_key_press();
// move_to_fuel_bunk();
// move_to_electricity_bunk();
// sleep(5);