import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;
Blockly.Blocks.bunny_moveblock = {
    init: function () {
        this.appendDummyInput().appendField("hop").appendField(new Blockly.FieldDropdown([
            ["LEFT", "left"],
            ["RIGHT", "right"]
        ]), "direction").appendField("count").appendField(new Blockly.FieldDropdown([
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
        ]), "distance");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330, 100, 100);
        this.setTooltip("Move the Bunny");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript.bunny_moveblock = function (block) {
    var move_direction = block.getFieldValue('direction');
    var move_distance = block.getFieldValue('distance');
    if (move_direction == "up") var code = "up(" + move_distance + ");";
    if (move_direction == "down") var code = "down(" + move_distance + ");";
    if (move_direction == "left") var code = "await left(" + move_distance + ");";
    if (move_direction == "right") var code = "await right(" + move_distance + ");";
    return code;
};
Blockly.Python.bunny_moveblock = function (block) {
    var move_direction = block.getFieldValue('direction');
    var move_distance = block.getFieldValue('distance');
    if (move_direction == "left") var code = "bunny.left(" + move_distance + ")\n";
    if (move_direction == "right") var code = "bunny.right(" + move_distance + ")\n";
    return code;
};
Blockly.Blocks.bunny_eat_carrot = {
    init: function () {
        this.appendDummyInput().appendField("Eat carrot");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330, 100, 100);
        this.setTooltip("Let the bunny eat the carrot");
        this.setHelpUrl("");
        this.set;
    }
};
Blockly.JavaScript.bunny_eat_carrot = function (block) { var code = "await eat_carrot();"; return code; };
Blockly.Python.bunny_eat_carrot = function (block) { var code = "bunny.eat_carrot()\n"; return code; };

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "bunny_moveblock" },
                { kind: "BLOCK", blockxml: "", type: "bunny_eat_carrot" },
            ],
            name: "Bunny",
            colour: "#FF007F",
            cssConfig: { container: "cat1" },
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#FF007F",
};