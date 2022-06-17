import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";


Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

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
    var code = `
    update = ()=>{ if (startChase) {
        updateWorld()
        ` + branch + `
    }}`
    if (repeat_forever_flag) {
        eval(code);
        game.destroy();
        document.getElementById('sprite-container').innerHTML = "";
        setTimeout(() => {
            let config = {
                type: Phaser.AUTO,
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
            let game = new Phaser.Game(config);
        }, 100);

    }
    return code;
};

Blockly.Python['forever_repeat_block'] = function (block) {
    var branch = Blockly.Python.statementToCode(block, 'NAME');
    var code = "while True:\n" + branch;
    return code;
};

Blockly.Blocks['single_action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Start the chase");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['single_action_block'] = function (block) {
    var code = 'startTheChase();';
    return code;
};

Blockly.Python['single_action_block'] = function (block) {
    var code = 'startTheChase()\n';
    return code;
};

Blockly.Blocks['action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Jump");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(195);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['action_block'] = function (block) {
    var code = 'jump();';
    return code;
};

Blockly.Python['action_block'] = function (block) {
    var code = 'jump()\n';
    return code;
};

Blockly.Blocks['spritetouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Sprite 1", "dummy1"],
                ["Cheese", "cheese"],
                ["Mouse", "mouse"],
                ["Cat", "cat"]
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["Sprite 1", "dummy1"],
                ["Cheese", "cheese"],
                ["Mouse", "mouse"],
                ["Cat", "cat"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['spritetouch__block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');
    var code = `sprite_touched('${dropdown_options1}', '${dropdown_options2}')`
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['spritetouch__block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');
    var code = `is_sprite_touching('${dropdown_options1}', '${dropdown_options2}')`
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['secondary_action_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Eat the cheese");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(105);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['secondary_action_block'] = function (block) {
    var code = 'eat_the_cheese();\n';
    return code;
};

Blockly.Python['secondary_action_block'] = function (block) {
    var code = 'eat_the_cheese()\n';
    return code;
};

Blockly.Blocks['pointertouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I touch hole");
        this.setOutput(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['pointertouch__block'] = function (block) {
    var code = 'hole_touched()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['pointertouch__block'] = function (block) {
    var code = 'is_hole_touched()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks['options_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Holes", "default"],
                ["Hole1", "1"],
                ["Hole2", "2"],
                ["Hole3", "3"],
                ["Hole4", "4"]
            ]), "NAME");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['options_block'] = function (block) {
    var dropdown_options = block.getFieldValue('NAME');
    var code = `select_hole(${dropdown_options})\n`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['options_block'] = function (block) {
    var dropdown_options = block.getFieldValue('NAME');
    var code = `is_hole(${dropdown_options})`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

//Spacebar sensing block
Blockly.Blocks['key_sensing'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Key Pressed is")
            .appendField(new Blockly.FieldDropdown([
                ["Up_Arrow", "1"],
                ["Down_Arrow", "2"],
                ["Left_Arrow", "3"],
                ["Right_Arrow", "4"],
                ["Space_Bar", "5"]
            ]), "option1")
        this.setOutput(true, null);
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('option1');
    var code = `key_pressed(${dropdown_name})`;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('option1');
    var code = `is_key_pressed(${dropdown_name})`;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Win Game block
Blockly.Blocks['win_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Won Game!");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['win_block'] = function (block) {
    let code = 'game_win();\n';
    return code;
};

Blockly.Python['win_block'] = function (block) {
    let code = 'game_win()\n';
    return code;
};

// Game Over block
Blockly.Blocks['end_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Game Over");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['end_block'] = function (block) {
    let code = 'game_over();\n';
    return code;
};

Blockly.Python['end_block'] = function (block) {
    let code = 'game_over()\n';
    return code;
};

Blockly.Blocks['move_up'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Move Up");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['move_up'] = function (block) {
    let code = 'move_up();\n';
    return code;
};

Blockly.Python['move_up'] = function (block) {
    let code = 'move_up()\n';
    return code;
};

Blockly.Blocks['move_down'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Move Down");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(360);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['move_down'] = function (block) {
    let code = 'move_down();\n';
    return code;
};

Blockly.Python['move_down'] = function (block) {
    let code = 'move_down()\n';
    return code;
};

//Fly Block
Blockly.Blocks['run'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Run");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['run'] = function (block) {
    return 'runMouse();\n';
};

Blockly.Python['run'] = function (block) {
    return 'runMouse()\n';
};

// Custom Set Variable Block
Blockly.Blocks['set_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy"],
                ["score", "score"],
                ["cheeseCount", "cheeseCount"],
            ]), "Variable name")
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `setVariable('${dropdown_variable_name}','${value_name}');\n`
    return code;
};

Blockly.Python['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = `${dropdown_variable_name} = ${value_name}\n`
    return code;
};

// Change Variable Block
Blockly.Blocks['change_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy_increment"],
                ["score", "score"],
                ["lives", "lives"],
            ]), "Variable name")
            .appendField("by");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = `changeVariable('${dropdown_variable_name}','${value_name}');`
    return code;
};

Blockly.Python['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = `${dropdown_variable_name} += ${value_name}\n`;
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "change_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Game Variables",
            categorystyle: "variable_category",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "key_sensing" },
                { kind: "BLOCK", blockxml: "", type: "spritetouch__block" },
                { kind: "BLOCK", blockxml: "", type: "pointertouch__block" },
            ],
            name: "Events",
            colour: "#FFFF00",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "single_action_block" },
                { kind: "BLOCK", blockxml: "", type: "action_block" },
                { kind: "BLOCK", blockxml: "", type: "secondary_action_block" },
                { kind: "BLOCK", blockxml: "", type: "run" },
                { kind: "BLOCK", blockxml: "", type: "options_block" },
                { kind: "BLOCK", blockxml: "", type: "win_block" },
                { kind: "BLOCK", blockxml: "", type: "end_block" },
                { kind: "BLOCK", blockxml: "", type: "move_up" },
                { kind: "BLOCK", blockxml: "", type: "move_down" },
            ],
            name: "Actions",
            colour: "#B430FF",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_if" }],
            name: "Conditions",
            colour: "%{BKY_LOGIC_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "forever_repeat_block" }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};