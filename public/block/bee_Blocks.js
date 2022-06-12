import Blockly from 'blockly';
import 'blockly/python';
import 'blockly/javascript';

Blockly.Blocks['Goto'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("goto")
            .appendField(new Blockly.FieldDropdown([["FLOWER", "flower"], ["HIVE", "hive"]]), "direction")
        //.appendField("steps")
        //.appendField(new Blockly.FieldDropdown([["10", "10"], ["20", "20"], ["30", "30"], ["40", "40"]]), "STEPS");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(50, 100, 100);
        this.setTooltip("Move the Bunny");
        this.setHelpUrl("");
    }
};
Blockly.Python['Goto'] = function (block) {
    var dropdown_move = block.getFieldValue('direction');
    //var dropdown_steps = block.getFieldValue('STEPS');
    var code = `bee.goto_${dropdown_move}()\n`;
    return code;
};
Blockly.JavaScript['Goto'] = function (block) {
    var dropdown_move = block.getFieldValue('direction');
    var dropdown_steps = block.getFieldValue('STEPS');
    //var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = `bee.goto_${dropdown_move}()\n`;
    return code;
};
Blockly.Blocks['nectar'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("collect_nectar");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(50, 100, 100);
        this.setTooltip("Let the bunny eat the carrot");
        this.setHelpUrl("");
    }
};

Blockly.Python['nectar'] = function (block) {
    var code = 'bee.collect_nectar()\n';
    return code;
};
Blockly.JavaScript['nectar'] = function (block) {
    var code = 'bee.collect_nectar()\n';
    return code;
};


export const blocks = {
    kind: "category",
    name: "Bee",
    colour: "#febe30",
    contents: [
        {
            kind: "block",
            type: "Goto",
        },
        {
            kind: "block",
            type: "nectar",
        }]
};