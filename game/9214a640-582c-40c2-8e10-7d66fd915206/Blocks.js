import "blockly/python";
import "blockly/javascript";

import Blockly from "blockly";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks["fruits"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Fruit")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Banana", "banana"],
                    ["Black Berry", "blackBerry"],
                    ["Blue Berry", "blueBerry"],
                    ["grape", "grape"],
                    ["Strawberry", "strawberry"],
                ]),
                "fruit"
            )
            .appendField("counts")
            .appendField(
                new Blockly.FieldDropdown([
                    ["1", "1"],
                    ["2", "2"],
                    ["3", "3"],
                    ["4", "4"],
                    ["5", "5"],
                    ["6", "6"],
                    ["7", "7"],
                ]),
                "counts"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(28, 81, 100);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["mix_salad"] = {
    init: function () {
        this.appendDummyInput().appendField("Mix Salad");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(228, 81, 100);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["fruits"] = function (block) {
    let fruit = block.getFieldValue("fruit");
    let counts = block.getFieldValue("counts");
    console.log(fruit, counts);
    let code = "await moveFruitSliceToPot('" + fruit + "', '" + counts + "');";
    return code;
};
Blockly.Python["fruits"] = function (block) {
    let fruit = block.getFieldValue("fruit");
    let counts = block.getFieldValue("counts");
    let code = "salad.add_to_Bowl(fruit='" + fruit + "', count=" + counts + ")\n";
    return code;
};

Blockly.JavaScript["mix_salad"] = function (block) {
    let code = "await mixSalad();";
    return code;
};
Blockly.Python["mix_salad"] = function (block) {
    let code = "salad.mix()\n";
    return code;
};

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "fruits" }, { "kind": "BLOCK", "blockxml": "", "type": "mix_salad" }], "name": "Perfect Salad", "colour": "#B430FF", "cssConfig": { "container": "cat1" } }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }