import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks["action_block"] = {
    init: function() {
        this.appendDummyInput().setAlign(Blockly.ALIGN_CENTRE).appendField("Jump");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(350);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action_block"] = function(block) {
    return "await jump();";
};
Blockly.Python["action_block"] = function(block) {
    return "girl.jump()\n";
};

Blockly.Blocks["say_block"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput("Hello!"), "dialogue");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["say_block"] = function(block) {
    let dialogue = block.getFieldValue("dialogue");
    let code = 'await createDialogue("' + dialogue + '");';
    return code;
};
Blockly.Python["say_block"] = function(block) {
    let dialogue = block.getFieldValue("dialogue");
    let code = 'say("' + dialogue + '")\n';
    return code;
};

Blockly.Blocks["wait_block"] = {
    init: function() {
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

Blockly.JavaScript["wait_block"] = function(block) {
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let code = "await sleep(" + value_name * 1000 + ");";
    return code;
};
Blockly.Python["wait_block"] = function(block) {
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let code = "time.sleep(" + value_name + ")\n";
    return code;
};

// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variables", "default_"],
                    ["jump_count", "jump_count"],
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

Blockly.JavaScript["set_variable_holder"] = function(block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "=" + value_name + ";";
    return code;
};
Blockly.Python["set_variable_holder"] = function(block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// Change Variable Block
Blockly.Blocks["change_variable_holder"] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variables", "default_"],
                    ["jump_count", "jump_count"],
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

Blockly.JavaScript["change_variable_holder"] = function(block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "+=" + value_name + ";";
    return code;
};

Blockly.Python["change_variable_holder"] = function(block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " += " + value_name + "\n";
    return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
    init: function() {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["jump_count", "jump_count"],
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

Blockly.JavaScript["variables"] = function(block) {
    var dropdown_options = block.getFieldValue("Options");
    var code = "";
    if (dropdown_options == "jump_count") code = "jump_count";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function(block) {
    var dropdown_options = block.getFieldValue("Options");
    var code = "";
    if (dropdown_options == "jump_count") code = "jump_count";
    return [code, Blockly.Python.ORDER_NONE];
};

export const blocks = {
    kind: "category",
    name: "Health Notifier",
    colour: "#5000ff",
    contents: [{
            kind: "block",
            type: "action_block",
        },
        {
            kind: "block",
            type: "wait_block",
        },
        {
            kind: "block",
            type: "say_block",
        },
        {
            kind: "block",
            type: "set_variable_holder",
        },
        {
            kind: "block",
            type: "change_variable_holder",
        },
        {
            kind: "block",
            type: "variables",
        },
    ],
};