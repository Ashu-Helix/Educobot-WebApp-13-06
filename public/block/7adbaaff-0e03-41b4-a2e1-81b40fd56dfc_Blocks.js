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
        this.setColour(315);
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
            .appendField("Second(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
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

export const blocks = {
    kind: "category",
    name: "Health Is Wealth",
    colour: "#5000ff",
    contents: [{
            kind: "block",
            type: "action_block",
        },
        {
            kind: "block",
            type: "wait_block",
        },
    ],
};