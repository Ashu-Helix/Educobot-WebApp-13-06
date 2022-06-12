Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.Blocks["speak_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput("Hello"), "dialogue");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["effect_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Apply Magic effect");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["show_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Show")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Rabbit", "bunnySprite"],
                    ["Apple", "appleSprite"],
                    ["Last Magic", "confettiDownward"],
                ]),
                "magicItems"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["wait_block"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("second(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Makes the code wait until the specified time");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["hide_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Hide")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Rabbit", "bunnySprite"],
                    ["Apple", "appleSprite"],
                    ["Last Magic", "confettiDownward"],
                ]),
                "magicItems"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(180);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["speak_block"] = function (block) {
    let dialogue = block.getFieldValue("dialogue");
    let code = 'await createDialogue("' + dialogue + '");';
    return code;
};
Blockly.Python["speak_block"] = function (block) {
    let dialogue = block.getFieldValue("dialogue");
    let code = 'ms.say("' + dialogue + '")\n';
    return code;
};

Blockly.JavaScript["effect_block"] = function (block) {
    let code = 'await showMagicEffect("magicWandUpward");';
    return code;
};
Blockly.Python["effect_block"] = function (block) {
    let code = 'ms.show_Magic_Effect("magicWandUpward")\n';
    return code;
};

Blockly.JavaScript["show_block"] = function (block) {
    let magicItems = block.getFieldValue("magicItems");
    let code = 'await showMagicEffect("' + magicItems + '");';
    return code;
};
Blockly.Python["show_block"] = function (block) {
    let magicItems = block.getFieldValue("magicItems");
    let code = 'ms.show_Magic_Effect("' + magicItems + '")\n';
    return code;
};

Blockly.JavaScript["wait_block"] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = "await sleep(" + value_name * 1000 + ");";
    return code;
};
Blockly.Python["wait_block"] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = "time.sleep(" + value_name + ")\n";
    return code;
};

Blockly.JavaScript["hide_block"] = function (block) {
    let magicItems = block.getFieldValue("magicItems");
    let code = 'await hideElement("' + magicItems + '");';
    return code;
};
Blockly.Python["hide_block"] = function (block) {
    let magicItems = block.getFieldValue("magicItems");
    let code = 'ms.hide_Element("' + magicItems + '")\n';
    return code;
};

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "speak_block" }, { "kind": "BLOCK", "blockxml": "", "type": "effect_block" }, { "kind": "BLOCK", "blockxml": "", "type": "show_block" }, { "kind": "BLOCK", "blockxml": "", "type": "wait_block" }, { "kind": "BLOCK", "blockxml": "", "type": "hide_block" }], "name": "Magic Show", "colour": "#B430FF", "cssConfig": { "container": "cat1" } }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }