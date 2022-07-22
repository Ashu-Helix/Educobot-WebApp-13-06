import "blockly/python";
import "blockly/javascript";
import Blockly from "blockly";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks["trash"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("Move")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Trash", "defaultt"],
                    ["Leaf", "leaf"],
                    ["Plastic cup", "cup"],
                    ["Screw", "screw"],
                    ["Spectacles", "spects"],
                    ["Toffee", "candy"],
                    ["Watermelon", "watermelon"],
                ]),
                "trash"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(204);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["trash"] = function (block) {
    var trash = block.getFieldValue("trash");
    var type = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    if (trash == "defaultt" || type == "none") return "";
    var code = `await move_robot('${trash}','${type}');\n`;
    return code;
};

Blockly.Python["trash"] = function (block) {
    var trash = block.getFieldValue("trash");
    var type = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    if (trash == "defaultt") return `move_robot('none','${type}')\n`;
    var code = `move_trash('${trash}','${type}')\n`;
    return code;
};

Blockly.Blocks["move_trash"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(" to the ")
            .appendField(
                new Blockly.FieldDropdown([
                    // ["Trash_can", "none"], 
                    ["Wet trash can", "wet"],
                    ["Dry trash can", "dry"],
                ]),
                "trash_can"
            );
        this.setOutput(true, null);
        this.setColour(54);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["move_trash"] = function (block) {
    var dropdown_trash_can = block.getFieldValue("trash_can");
    var code = dropdown_trash_can;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.Python["move_trash"] = function (block) {
    var dropdown_trash_can = block.getFieldValue("trash_can");
    var code = dropdown_trash_can;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "trash" },
                { kind: "BLOCK", blockxml: "", type: "move_trash" },
            ],
            name: "Trash",
            colour: "#c46404",
            cssConfig: { container: "cat1" },
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};

