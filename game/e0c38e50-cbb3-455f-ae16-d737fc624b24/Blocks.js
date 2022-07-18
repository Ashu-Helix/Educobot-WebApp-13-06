Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

const ANIMAL_NAME = { horse: "horse", cow: "cow", pig: "pig" };
const SHELTER_NAME = { stable: "stable", shed: "shed", sty: "sty" };
const CORRECT_COMBINATION = { horse: "stable", cow: "shed", pig: "sty" };
Blockly.Blocks["send__block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Send")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Horses", ANIMAL_NAME.horse],
                    ["Pigs", ANIMAL_NAME.pig],
                    ["Cows", ANIMAL_NAME.cow],
                ]),
                "options1"
            )
            .appendField("to")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Sty", SHELTER_NAME.sty],
                    ["Stable", SHELTER_NAME.stable],
                    ["Barn", SHELTER_NAME.shed],
                ]),
                "options2"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(105);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

// Blockly.Blocks["wait_block"] = {
//     init: function() {
//         this.appendValueInput("NAME")
//             .setCheck("Number")
//             .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
//         this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("sec");
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(259, 97, 90);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     },
// };

Blockly.JavaScript["send__block"] = function (block) {
    let animal = block.getFieldValue("options1");
    let shelter = block.getFieldValue("options2");
    let code = "moveAnimalToShelter('" + animal + "', '" + shelter + "');";
    return code;
};
Blockly.Python["send__block"] = function (block) {
    let animal = block.getFieldValue("options1");
    let shelter = block.getFieldValue("options2");
    let code = "farm.moveAnimalToShelter('" + animal + "', '" + shelter + "')\n";
    return code;
};

// Blockly.JavaScript["wait_block"] = function(block) {
//     let value_name = Blockly.JavaScript.valueToCode(
//         block,
//         "NAME",
//         Blockly.JavaScript.ORDER_ATOMIC
//     );
//     let code = "await sleep(" + value_name * 1000 + ");";
//     return code;
// };
// Blockly.Python["wait_block"] = function(block) {
//     let value_name = Blockly.JavaScript.valueToCode(
//         block,
//         "NAME",
//         Blockly.JavaScript.ORDER_ATOMIC
//     );
//     let code = "time.sleep(" + value_name + ")\n";
//     return code;
// };

Blockly.Blocks['wait_block'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("sec");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.JavaScript['wait_block'] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'await sleep(' + (value_name * 1000) + ');';
    return code;
};
Blockly.Python['wait_block'] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'time.sleep(' + value_name + ')\n';
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    "contents": [{
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": "",
            "type": "send__block"
        },
        {
            "kind": "BLOCK",
            "blockxml": '<block type="wait_block"><value name = "NAME"><block type = "math_number"><field name="NUM">1</field></block></value></block>',
            "type": "wait_block"
        }
        ],
        "name": "Animal Farm",
        "colour": "#B430FF",
        "cssConfig": {
            "container": "cat1"
        }
    }],
    "id": "toolbox",
    "style": "display: none",
    "colour": "#D4AF37"
}