import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
import { Game, AUTO } from "phaser";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

import {
    completedFlag,
    helpCode,
    runCode,
    reset_output,
    reInitValues,
    sleep,
    fnChooseStartPoint,
    fnReachAtDestination,
    left_key_is_pressed,
    right_key_is_pressed,
    up_key_is_pressed,
    down_key_is_pressed,
    shift_left_key_is_pressed,
    shift_right_key_is_pressed,
    shift_up_key_is_pressed,
    shift_down_key_is_pressed,
    is_car_touching_fuel_station,
    is_car_touching_house,
    set_fuel_pump_visible,
    set_car_visible,
    set_fuel_percentage,
    change_fuel_percentage,
    get_fuel_percentage,
    game_over,
    fnToCheckMoveDirection,
    repeat_forever_flag,
    preload,
    create,
    isLeftActive,
    isRightActive,
    isDownActive,
    isUpActive,
    gameWidth,
    gameHeight
} from "./main"

Blockly.Blocks['choose__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Choose")
            .appendField(new Blockly.FieldDropdown([
                ["Path", "dummy"],
                ["Start1", "1"],
                ["Start2", "2"],
                ["Start3", "3"]
            ]), "Options");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(26);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['choose__block'] = function (block) {
    let code = 'fnChooseStartPoint(' + block.getFieldValue('Options') + ');';
    return code;
};
Blockly.Python['choose__block'] = function (block) {
    let code = 'fnChooseStartPoint(' + block.getFieldValue('Options') + ');';
    return code;
};


Blockly.Blocks['forever_repeat_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Repeat forever");
        this.appendStatementInput("NAME")
            .setCheck(null)
            .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(135);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



Blockly.Blocks['spritetouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Car", "car"],
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["Fuelstation", "fuelstation"],
                ["House", "destination"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['spritetouch__block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');
    var code = "";
    if ((dropdown_options1 == "car" && dropdown_options2 == "fuelstation"))
        code = "is_car_touching_fuel_station()";
    if ((dropdown_options1 == "car" && dropdown_options2 == "destination"))
        code = "is_car_touching_house()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['spritetouch__block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');
    var code = "";
    if ((dropdown_options1 == "car" && dropdown_options2 == "fuelstation"))
        code = "is_car_touching_fuel_station()";
    if ((dropdown_options1 == "car" && dropdown_options2 == "destination"))
        code = "is_car_touching_house()";


    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['won_game'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Won game");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(10);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['won_game'] = function (block) { return "fnReachAtDestination();"; };
Blockly.Python['won_game'] = function (block) { return "won_game()\n"; };

Blockly.Blocks['game_over'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Game over");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['game_over'] = function (block) { return "game_over();"; };
Blockly.Python['game_over'] = function (block) { return "game_over()\n"; };

Blockly.Blocks['hide_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Hide")
            .appendField(new Blockly.FieldDropdown([
                ["Car", "car"],
                ["Fuel station", "fs"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.JavaScript['hide_block'] = function (block) {
    var op = block.getFieldValue('NAME');
    let code = "";
    if (op === "car") { code = "set_car_visible(false);"; }
    if (op === "fs") { code = "set_fuel_pump_visible(false);"; }
    return code;
};
Blockly.Python['hide_block'] = function (block) {
    var op = block.getFieldValue('NAME');
    let code = "";
    if (op === "car") { code = "set_car_visible(false)\n"; }
    if (op === "fs") { code = "set_fuel_pump_visible(false)\n"; }
    return code;
};

Blockly.Blocks['show_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Show")
            .appendField(new Blockly.FieldDropdown([
                ["Car", "car"],
                ["Fuel station", "fs"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(150);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['show_block'] = function (block) {
    var op = block.getFieldValue('NAME');
    let code = "";
    if (op === "car") { code = "set_car_visible(true);"; }
    if (op === "fs") { code = "set_fuel_pump_visible(true);"; }
    return code;
};
Blockly.Python['show_block'] = function (block) {
    var op = block.getFieldValue('NAME');
    let code = "";
    if (op === "car") { code = "set_car_visible(true)\n"; }
    if (op === "fs") { code = "set_fuel_pump_visible(true)\n"; }
    return code;
};


Blockly.Blocks['key_sensing'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Key Pressed is")
            .appendField(new Blockly.FieldDropdown([
                ["Left_arrow", "left"],
                ["Right_arrow", "right"],
                ["Up_arrow", "up"],
                ["Down_arrow", "down"],
                ["Shift + Left_arrow", "shift_left"],
                ["Shift + Right_arrow", "shift_right"],
                ["Shift + Up_arrow", "shift_up"],
                ["Shift + Down_arrow", "shift_down"]
            ]), "NAME");
        this.setOutput(true, null);
        this.setColour(252);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var code = dropdown_name + '_key_is_pressed()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var dropdown_name = block.getFieldValue('NAME');
    var code = dropdown_name + '_key_is_pressed()';
    return [code, Blockly.Python.ORDER_NONE];
};
Blockly.Blocks['move_cab'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move")
            .appendField(new Blockly.FieldDropdown([
                ["Left", "left"],
                ["Right", "right"],
                ["Up", "up"],
                ["Down", "down"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['move_cab'] = function (block) {
    let code = 'fnToCheckMoveDirection("' + block.getFieldValue('NAME') + '",false);';
    return code;
};
Blockly.Python['move_cab'] = function (block) {
    let code = 'fnToCheckMoveDirection("' + block.getFieldValue('NAME') + '",false)\n';
    return code;
};

Blockly.Blocks['slide_cab'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Slide")
            .appendField(new Blockly.FieldDropdown([
                ["Left", "left"],
                ["Right", "right"],
                ["Up", "up"],
                ["Down", "down"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['slide_cab'] = function (block) {
    let code = 'fnToCheckMoveDirection("' + block.getFieldValue('NAME') + '",true);';
    return code;
};
Blockly.Python['slide_cab'] = function (block) {
    let code = 'fnToCheckMoveDirection("' + block.getFieldValue('NAME') + '",true)\n';
    return code;
};

Blockly.Blocks['forever_repeat_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Repeat forever");
        this.appendStatementInput("NAME")
            .setCheck(null)
            .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(135);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['forever_repeat_block'] = function (block) {
    var branch = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = `update = ()=>{
        if (!completedFlag()) {
            fnStopCab();
        
        ` + branch + `
      
   }}`

    if (repeat_forever_flag) {
        eval(code);
        window['game'].destroy();
        document.getElementById('sprite-container').innerHTML = "";
        setTimeout(() => {
            let config = {
                type: AUTO,
                width: gameWidth,
                height: gameHeight,
                backgroundColor: "#eeeeee",
                parent: "sprite-container",
                canvasStyle: `width: 100%;
                object-fit: revert;
                aspect-ratio: 738 / 436;`,
                physics: {
                    default: "arcade",
                    arcade: {
                        gravity: { y: 0 },
                        debug: false
                    },
                },
                scene: {
                    preload: preload,
                    create: create,
                    update: update,
                },
            };
            window['game'] = new Game(config);
        }, 100);

    }
    return code;
};
Blockly.Python['forever_repeat_block'] = function (block) {
    var branch = Blockly.Python.statementToCode(block, 'NAME');
    var code = "while True:\n" + branch;
    return code;
};

Blockly.Blocks['fuel_perchange_set'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Component name", "dummy"],
                ["Fuel meter", "op1"]
            ]), "Variable name")
            .appendField("=")
            .appendField(new Blockly.FieldNumber(0, 0, 100), "NAME")
            .appendField("%");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.JavaScript['fuel_perchange_set'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var number_name = block.getFieldValue('NAME');
    var code = '';
    if (dropdown_variable_name == "op1") {
        code = "set_fuel_percentage(" + number_name + ");"
    }
    return code;
};

Blockly.Python['fuel_perchange_set'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var number_name = block.getFieldValue('NAME');
    var code = '';
    if (dropdown_variable_name == "op1") {
        code = "set_fuel_percentage(" + number_name + ")\n"
    }
    return code;
};


Blockly.Blocks['fuel_perchange_change'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Component", "dummy"],
                ["Fuel meter", "op1"]
            ]), "NAME")
            .appendField(new Blockly.FieldDropdown([
                ["+", "+"],
                ["-", "-"]
            ]), "options")
            .appendField(new Blockly.FieldNumber(0, 0, 100), "NAME2")
            .appendField("%");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.JavaScript['fuel_perchange_change'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var dropdown_options = block.getFieldValue('options');
    var number_name2 = block.getFieldValue('NAME2');
    var code = '';
    if (dropdown_name == "op1") {
        code = "change_fuel_percentage(" + dropdown_options + number_name2 + ");\n"
    }
    return code;
};

Blockly.Python['fuel_perchange_change'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var dropdown_options = block.getFieldValue('options');
    var number_name2 = block.getFieldValue('NAME2');
    var code = '';
    if (dropdown_name == "op1") {
        code = "change_fuel_percentage(" + dropdown_options + number_name2 + ")\n"
    }
    return code;
};


// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Fuel level percentage", "fp"],
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = 'get_fuel_percentage()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = 'get_fuel_percentage()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};


export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "key_sensing"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "spritetouch__block"
                }
            ],
            name: "Events",
            colour: "#FFFF00",
            cssConfig: {
                "container": "cat1"
            }
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "choose__block"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "move_cab"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "slide_cab"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "show_block"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "hide_block"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "game_over"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "won_game"
                }
            ],
            "name": "Actions",
            "colour": "#B430FF",
            "cssConfig": {
                "container": "cat1"
            }
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "fuel_perchange_set"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "fuel_perchange_change"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "variables"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "math_number"
                }
            ],
            "name": "Fuel",
            "colour": "#964B00",
            "cssConfig": {
                "container": "cat1"
            }
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "controls_if"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "logic_compare"
                },
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "logic_operation"
                }
            ],
            "name": "Conditions",
            "colour": "%{BKY_LOGIC_HUE}"
        },
        {
            "kind": "CATEGORY",
            "contents": [
                {
                    "kind": "BLOCK",
                    "blockxml": "",
                    "type": "forever_repeat_block"
                }
            ],
            "name": "Loops",
            "colour": "%{BKY_LOOPS_HUE}"
        }
    ],
    "id": "toolbox",
    "style": "display: none",
    "colour": "#D4AF37"
};