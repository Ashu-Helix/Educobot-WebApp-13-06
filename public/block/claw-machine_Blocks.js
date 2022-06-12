import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks["xy"] = {
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
    },
};

Blockly.Blocks["catch_block"] = {
    init: function() {
        this.appendValueInput("NAME").setCheck("String").appendField("Catch >");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(105);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["wait_block"] = {
    init: function() {
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

Blockly.JavaScript["xy"] = function(block) {
    return "";
};
Blockly.Python["xy"] = function(block) {
    return "";
};

Blockly.JavaScript["catch_block"] = function(block) {
    let code = "";

    if (
        block.childBlocks_ &&
        block.childBlocks_[0] &&
        block.childBlocks_[0].type == "xy"
    ) {
        let x_coordinate = block.childBlocks_[0].getFieldValue("x_coordinate");
        let y_coordinate = block.childBlocks_[0].getFieldValue("y_coordinate");
        code =
            'await getToyByCoordinates("' +
            x_coordinate +
            '", "' +
            y_coordinate +
            '");';
    }

    return code;
};
Blockly.Python["catch_block"] = function(block) {
    let code = "";

    if (
        block.childBlocks_ &&
        block.childBlocks_[0] &&
        block.childBlocks_[0].type == "xy"
    ) {
        let x_coordinate = block.childBlocks_[0].getFieldValue("x_coordinate");
        let y_coordinate = block.childBlocks_[0].getFieldValue("y_coordinate");
        code =
            'await getToyByCoordinates("' +
            x_coordinate +
            '", "' +
            y_coordinate +
            '");\n';
    }

    return code;
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
    let code = "await sleep(" + value_name * 1000 + ");\n";
    return code;
};

export const blocks = {
    kind: "category",
    name: "Wonder",
    colour: "#5000ff",
    contents: [{
            kind: "block",
            type: "xy",
        },
        {
            kind: "block",
            type: "catch_block",
        },
        {
            kind: "block",
            type: "wait_block",
        },
    ],
};