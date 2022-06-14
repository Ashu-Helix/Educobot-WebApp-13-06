import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;


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
    let code = 'game_over();';
    return code;
};
Blockly.Python['end_block'] = function (block) {
    let code = 'game_over()\n';
    return code;
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
    let code = 'game_win();';
    return code;
};
Blockly.Python['win_block'] = function (block) {
    let code = 'win_game()\n';
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
    var code = `update = ()=>{ if (WorldIsMoving) {
        KMText.setText(TotalKm.toString());
        TimerText.setText(FormatTime(timer * 1000));
        ScoreTX.setText(score);
        MoveWorld();
        
        ` + branch + `
    }}`
    if (repeat_forever_flag) {
        eval(code);
        window['game'].destroy();
        document.getElementById('sprite-container').innerHTML = "";
        setTimeout(() => {
            var config = {
                type: Phaser.AUTO,
                width: gameWidth,
                height: gameHeight,
                backgroundColor: "#eeeeee",
                parent: "sprite-container",
                //canvas: canvas1,
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
            window['game'] = new Phaser.Game(config);
        }, 100);

    }
    return code;
};
Blockly.Python['forever_repeat_block'] = function (block) {
    var branch = Blockly.Python.statementToCode(block, 'NAME');
    var code = "while True:\n" + branch;
    return code;
};


// Say block
Blockly.Blocks['say_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput("\" \""), "dialogue");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['say_block'] = function (block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'await createDialogue("' + dialogue + '");';
    return code;
};
Blockly.Python['say_block'] = function (block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'say("' + dialogue + '")\n';
    return code;
};


//Fly Block
Blockly.Blocks['fly'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Fly");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['fly'] = function (block) {
    return 'flap_wing();';
};
Blockly.Python['fly'] = function (block) {
    return 'flap_wing()\n';
};

//Gravity block
Blockly.Blocks['gravity'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Gravity");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['gravity'] = function (block) {
    return 'gravity_effect();';
};
Blockly.Python['gravity'] = function (block) {
    return 'gravity_effect()\n';
};


// Spacebar sensing block
Blockly.Blocks['key_sensing'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Key Pressed is")
            .appendField(new Blockly.FieldDropdown([
                ["Space/touch/click", "option5"],
            ]), "NAME");
        this.setOutput(true, null);
        this.setColour(90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    // TODO: Assemble JavaScript into code variable.
    var code = 'is_space_pressed()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['key_sensing'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    // TODO: Assemble JavaScript into code variable.
    var code = 'is_space_pressed()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

//start the game
Blockly.Blocks['single_action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Start the game");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['single_action_block'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    return 'Start_Game();';
};

Blockly.Python['single_action_block'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    return 'Start_Game()\n';
}

// Sprite touches sprite block
Blockly.Blocks['spritetouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Sprite 1", "dummy1"],
                ["Bird", "Bird"]
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["Sprite 2", "dummy2"],
                ["Obstacle", "Obstacle"],
                ["Ground", "Ground"],
                ["Coin", "Coin"]
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
    var code = "";
    if ((dropdown_options1 == "Bird" && dropdown_options2 == "Ground"))
        code = "is_bird_touching_ground()";
    if ((dropdown_options1 == "Bird" && dropdown_options2 == "Obstacle"))
        code = "is_bird_touching_obstacle()";
    if ((dropdown_options1 == "Bird" && dropdown_options2 == "Coin"))
        code = "is_bird_touching_coin()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['spritetouch__block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');
    var code = "";
    if ((dropdown_options1 == "Bird" && dropdown_options2 == "Ground"))
        code = "is_bird_touching_ground()";
    if ((dropdown_options1 == "Bird" && dropdown_options2 == "Obstacle"))
        code = "is_bird_touching_obstacle()";
    if ((dropdown_options1 == "Bird" && dropdown_options2 == "Coin"))
        code = "is_bird_touching_coin()";
    return [code, Blockly.Python.ORDER_NONE];
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
                ["lives", "lives"],
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
    var code = dropdown_variable_name + '=' + value_name + ';';
    return code;
};
Blockly.Python['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = dropdown_variable_name + '=' + value_name + '\n';
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
    var code = dropdown_variable_name + '+=' + value_name + ';LivesTXT.setText(lives); KMText.setText(TotalKm.toString()); ScoreTX.setText(score);';
    return code;
};

Blockly.Python['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = dropdown_variable_name + '+=' + value_name + '\n';
    return code;
};

// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default"],
                ["score", "score"],
                ["lives", "lives"],
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
    var code = '';
    if (dropdown_options == "score")
        code = 'score';
    else if (dropdown_options == "lives")
        code = 'lives';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = '';
    if (dropdown_options == "score")
        code = 'score';
    else if (dropdown_options == "lives")
        code = 'lives';
    return [code, Blockly.Python.ORDER_NONE];
};


export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "set_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "change_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "variables" }, { "kind": "BLOCK", "blockxml": "", "type": "math_number" }], "name": "Game Variables", "categorystyle": "variable_category" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "key_sensing" }, { "kind": "BLOCK", "blockxml": "", "type": "spritetouch__block" }], "name": "Events", "colour": "#FFFF00" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "single_action_block" }, { "kind": "BLOCK", "blockxml": "", "type": "fly" }, { "kind": "BLOCK", "blockxml": "", "type": "gravity" }, { "kind": "BLOCK", "blockxml": "", "type": "win_block" }, { "kind": "BLOCK", "blockxml": "", "type": "end_block" }], "name": "Actions", "colour": "#B430FF" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" }], "name": "Conditions", "colour": "%{BKY_LOGIC_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" }], "name": "Loops", "colour": "%{BKY_LOOPS_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }