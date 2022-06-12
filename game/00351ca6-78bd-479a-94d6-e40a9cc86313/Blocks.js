import "blockly/python";
import "blockly/javascript";
import Blockly from "blockly";


Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['turn'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("TURN")
            .appendField(new Blockly.FieldDropdown([
                ["RIGHT", "right"],
                ["LEFT", "left"],
                ["AROUND", "around"],
            ]), "turn")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(90);
        this.setTooltip("Instruct dog to turn in a new direction");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['turn'] = function (block) {
    var turn = block.getFieldValue('turn');
    var code = 'await dog_turn("' + turn + '");'
    return code;
};

Blockly.Python['turn'] = function (block) {
    var turn = block.getFieldValue('turn');
    var code = 'dog.turn("' + turn + '")\n';
    return code;
};


Blockly.Blocks['move'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Move Forward"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("steps");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(278, 81, 100);
        this.setTooltip("Instruct dog to move forward with number of steps");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['move'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'await dog_move_forward(' + value_name + ');';
    return code;
};

Blockly.Python['move'] = function (block) {
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = 'dog.move_forward(' + value_name + ')\n';
    return code;
};



Blockly.Blocks['eat'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("EAT BONE")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(350);
        this.setTooltip("Instruct dog to eat the bone in reach");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['eat'] = function (block) {
    var turn = block.getFieldValue('turn');
    var code = 'await dog_eat_bone_if_available();'
    return code;
};

Blockly.Python['eat'] = function (block) {
    var turn = block.getFieldValue('turn');
    var code = 'dog.eat_bone()\n';
    return code;
};

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "move" }, { "kind": "BLOCK", "blockxml": "", "type": "turn" }, { "kind": "BLOCK", "blockxml": "", "type": "eat" }], "name": "Dog", "colour": "#B430FF", "cssConfig": { "container": "cat1" } }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }