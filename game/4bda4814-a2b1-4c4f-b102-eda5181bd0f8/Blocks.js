import Blockly from 'blockly';
import 'blockly/python';
import 'blockly/javascript';

Blockly.Blocks['new_boundary_function'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("Boundary Function Name"), "Name");
        this.appendStatementInput("Content")
            .setCheck(null);
        this.setInputsInline(true);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python['new_boundary_function'] = function (block) {
    var text_name = block.getFieldValue('Name');
    var statements_content = Blockly.Python.statementToCode(block, 'Content');
    // TODO: Assemble Python into code variable.
    var code = 'def ' + text_name + '(_object,**kwargs):\n' + statements_content + '\n';
    return code;
};

Blockly.Blocks['return'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("return");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Python['return'] = function (block) {
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code = 'return ' + value_name + '\n';
    return code;
};

Blockly.Blocks['move'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("move")
            .appendField(new Blockly.FieldDropdown([["LEFT", "left"], ["RIGHT", "right"]]), "direction")
            .appendField("steps")
            .appendField(new Blockly.FieldDropdown([["10", "10"], ["20", "20"], ["30", "30"], ["40", "40"]]), "STEPS");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330, 100, 100);
        this.setTooltip("Move the Bunny");
        this.setHelpUrl("");
    }
};
Blockly.Python['move'] = function (block) {
    var dropdown_move = block.getFieldValue('direction');
    var dropdown_steps = block.getFieldValue('STEPS');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = `bunny.${dropdown_move}(${dropdown_steps})\n`;
    return code;
};
Blockly.JavaScript['move'] = function (block) {
    var dropdown_move = block.getFieldValue('direction');
    var dropdown_steps = block.getFieldValue('STEPS');
    //var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = `${dropdown_move}(${dropdown_steps})\n`;
    return code;
};
Blockly.Blocks['eatcarrot'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Eat carrot");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330, 100, 100);
        this.setTooltip("Let the bunny eat the carrot");
        this.setHelpUrl("");
    }
};

Blockly.Python['eatcarrot'] = function (block) {
    var code = 'bunny.eat_carrot()\n';
    return code;
};
Blockly.JavaScript['eatcarrot'] = function (block) {
    var code = 'eatCarrot()\n';
    return code;
};


// export const blocks = {
//     kind: "category",
//     name: "Bunny",
//     colour: "#e0006f",
//     contents: [
//         {
//             kind: "block",
//             type: "move",
//         },
//         {
//             kind: "block",
//             type: "eatcarrot",
//         }]
// };

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "move" }, { "kind": "BLOCK", "blockxml": "", "type": "eatcarrot" }], "name": "Bunny", "colour": "#FF007F", "cssConfig": { "container": "cat1" } }], "id": "toolbox", "style": "display: none", "colour": "#FF007F" }