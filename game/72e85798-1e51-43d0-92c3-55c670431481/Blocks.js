import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

import {
    repeat_forever_flag,
    update,
    preload,
    create,
    gameHeight,
    gameWidth,
} from "./main"

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
    let code = 'game_over();return;';
    return code;
};
Blockly.Python['end_block'] = function (block) {
    let code = 'game_over()\n';
    return code;
};


// Win Game block
// Blockly.Blocks['win_block'] = {
//     init: function() {
//         this.appendDummyInput()
//             .setAlign(Blockly.ALIGN_CENTRE)
//             .appendField("Won Game!");
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(200);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     }
// };
// Blockly.JavaScript['win_block'] = function(block) {
//     let code = 'CheckForWin =  true;';
//     return code;
// };
// Blockly.Python['win_block'] = function(block) {
//     let code = '';
//     return code;
// };


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
        ` + branch + `
        if (stone_button_is_pressed() || paper_button_is_pressed() || scissor_button_is_pressed()) {
            PlayerStone = false;
             PlayerPaper = false;
             PlayerScissor = false;}
    }`
    if (repeat_forever_flag) {
        eval(code);
        window['game'].destroy();
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
            .appendField(new Blockly.FieldTextInput("Hi!"), "dialogue");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['say_block'] = function (block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'say("' + dialogue + '");';
    return code;
};
Blockly.Python['say_block'] = function (block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'say("' + dialogue + '")\n';
    return code;
};



Blockly.Blocks['player_hand_signs_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Player shows")
            .appendField(new Blockly.FieldDropdown([
                ["Hand sign", ""],
                ["Stone", "show_player_stone();"],
                ["Paper", "show_player_paper();"],
                ["Scissor", "show_player_scissor();"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(190);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['player_hand_signs_block'] = function (block) {
    var code = block.getFieldValue('NAME'); // + ";";
    return code;
};

Blockly.Python['player_hand_signs_block'] = function (block) {
    var code = block.getFieldValue('NAME') + "\n";
    return code;
};

Blockly.Blocks['bot_hand_signs_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Bot shows")
            .appendField(new Blockly.FieldDropdown([
                ["Hand sign", ""],
                ["Stone", "show_bot_stone();"],
                ["Paper", "show_bot_paper();"],
                ["Scissor", "show_bot_scissor();"]
            ]), "NAME");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(260);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['bot_hand_signs_block'] = function (block) {
    var code = block.getFieldValue('NAME');
    return code;
};

Blockly.Python['bot_hand_signs_block'] = function (block) {
    var code = block.getFieldValue('NAME') + "\n";
    return code;
};


Blockly.Blocks['button_options'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Button", ""],
                ["Stone Button", "stone_button_is_pressed()"],
                ["Paper Button", "paper_button_is_pressed()"],
                ["Scissor Button", "scissor_button_is_pressed()"]
            ]), "buttons")
            .appendField("is pressed");
        this.setOutput(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['button_options'] = function (block) {
    var code = block.getFieldValue('buttons');
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['button_options'] = function (block) {
    var code = block.getFieldValue('buttons');
    return [code, Blockly.Python.ORDER_ATOMIC];
};


// Custom Set Variable Block
Blockly.Blocks['set_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["bot_score", "bot_score"],
                ["player_score", "player_score"],
                ["game_count", "game_count"],
                ["bot", "bot"],
                ["player", "player"]
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
    //console.log(code, dropdown_variable_name, value_name)
    return code;
};
Blockly.Python['set_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + ' = ' + value_name + '\n';
    return code;
};

// Change Variable Block
Blockly.Blocks['change_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["bot_score", "bot_score"],
                ["player_score", "player_score"],
                ["game_count", "game_count"],
                ["bot", "bot"],
                ["player", "player"],
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
    var code = dropdown_variable_name + '+=' + value_name + ';';
    return code;
};

Blockly.Python['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + ' += ' + value_name + '\n';
    return code;
};

// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["game_count", "game_count"],
                ["bot_score", "bot_score"],
                ["player_score", "player_score"],
                ["bot", "bot"],
                ["player", "player"]
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['variables'] = function (block) {
    var code = block.getFieldValue('Options');;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['variables'] = function (block) {
    var code = block.getFieldValue('Options');;
    return [code, Blockly.Python.ORDER_ATOMIC];
};

//Custom Values Block
Blockly.Blocks['values'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["'values'", "'values'"],
                ["'stone'", "'stone'"],
                ["'paper'", "'paper'"],
                ["'scissors'", "'scissors'"],
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(50);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['values'] = function (block) {
    var code = block.getFieldValue('Options');
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['values'] = function (block) {
    var code = block.getFieldValue('Options');
    return [code, Blockly.Python.ORDER_ATOMIC];
};


export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "set_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "change_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "variables" }, { "kind": "BLOCK", "blockxml": "", "type": "values" }, { "kind": "BLOCK", "blockxml": "", "type": "math_number" }], "name": "Game Variables", "categorystyle": "variable_category" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "button_options" }], "name": "Events", "colour": "#FFFF00" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "player_hand_signs_block" }, { "kind": "BLOCK", "blockxml": "", "type": "bot_hand_signs_block" }, { "kind": "BLOCK", "blockxml": "", "type": "say_block" }, { "kind": "BLOCK", "blockxml": "", "type": "end_block" }], "name": "Actions", "colour": "#B430FF" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_negate" }], "name": "Conditions", "colour": "%{BKY_LOGIC_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" }], "name": "Loops" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "math_random_int" }], "name": "Math", "colour": "%{BKY_MATH_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }

// update = ()=>{
//     if ((game_count) >= 10) {
// if ((player_score) > (bot_score)) {
// say("Player is the Grand winner");}
// if ((player_score) < (bot_score)) {
// say("Bot is the Grand winner");}
// game_over();return;
// }
// if (stone_button_is_pressed()) {
// player=('stone');show_player_stone();}
// if (paper_button_is_pressed()) {
// player=('paper');show_player_paper();}
// if (scissor_button_is_pressed()) {
// player=('scissors');show_player_scissor();}
// if ((stone_button_is_pressed()) || (paper_button_is_pressed()) || (scissor_button_is_pressed())) {
// bot=(mathRandomInt(1, 3));if ((bot) == 1) {
// bot=('stone');show_bot_stone();} else if ((bot) == 2) {
// bot=('paper');show_bot_paper();} else if ((bot) == 3) {
// bot=('scissors');show_bot_scissor();}
// game_count+=1;}
// if ((player) == ('stone') && (bot) == ('stone')) {
// say("Its a tie");}
// if ((player) == ('stone') && (bot) == ('paper')) {
// say("Bot wins");bot_score+=1;}
// if ((player) == ('stone') && (bot) == ('scissors')) {
// say("Player wins");player_score+=1;}
// if ((player) == ('paper') && (bot) == ('paper')) {
// say("Its a tie");}
// if ((player) == ('paper') && (bot) == ('stone')) {
// say("Player wins");player_score+=1;}
// if ((player) == ('paper') && (bot) == ('scissors')) {
// say("Bot wins");bot_score+=1;}
// if ((player) == ('scissors') && (bot) == ('scissors')) {
// say("Its a tie");}
// if ((player) == ('scissors') && (bot) == ('paper')) {
// say("Player wins");player_score+=1;}
// if ((player) == ('scissors') && (bot) == ('stone')) {
// say("Bot wins");bot_score+=1;}

//   if (stone_button_is_pressed() || paper_button_is_pressed() || scissor_button_is_pressed()) {
//       PlayerStone = false;
//        PlayerPaper = false;
//        PlayerScissor = false;}
// }