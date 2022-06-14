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
    let code = 'game_over();\n';
    return code;
};

Blockly.Python['end_block'] = function (block) {
    let code = 'game_over()\n';
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
    var code = `update = ()=>{ if (!GameIsOver) {
        ` + branch + `
        LivesTXT.setText( "Lives : "+lives);
        ScoreText.setText( "Score : "+Score);
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
            let game1 = new Phaser.Game(config);
        }, 100);

    }
    return code;
};
Blockly.Python['forever_repeat_block'] = function (block) {
    var branch = Blockly.Python.statementToCode(block, 'NAME');
    var code = "while True:\n" + branch;
    return code;
};

// Custom_text  Block
Blockly.Blocks['Custom_text'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I Touch Crab", "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['Custom_text'] = function (block) {
    var code = "i_touch_crab()";
    return [code, Blockly.JavaScript.ORDER_NONE]
};
Blockly.Python['Custom_text'] = function (block) {
    var code = "i_touch_crab()";
    return [code, Blockly.Python.ORDER_ATOMIC]
};


//start the game
Blockly.Blocks['start_game_block'] = {
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
Blockly.JavaScript['start_game_block'] = function (block) {
    return 'await start_game();\n';
};
Blockly.Python['start_game_block'] = function (block) {
    return 'start_game();\n';
}


// Sprite touches sprite block
Blockly.Blocks['spritetouch_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Crab", "Crab"],
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["Sea", "Sea"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(255);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['spritetouch_block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');

    if (dropdown_options1 == 'Crab' && dropdown_options2 == 'Sea') {
        return ['crab_touches_sea()', ''];
    }

};

Blockly.Python['spritetouch_block'] = function (block) {
    var dropdown_options1 = block.getFieldValue('options1');
    var dropdown_options2 = block.getFieldValue('options2');
    var code = 'crab_touches_sea()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};



// Custom Hide Block

Blockly.Blocks['hide_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Hide")
            .appendField(new Blockly.FieldDropdown([
                ["crab", " crab"],
            ]), "Variable_name")
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['hide_block'] = function (block) {
    return 'hide_crab();\n';
};

Blockly.Python['hide_block'] = function (block) {
    return 'hide_crab()\n';
};



// Custom Set Variable Block
Blockly.Blocks['set_variable_holder'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy_increment"],
                ["score", "Score"],
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
                ["Variable name", "dummy_increment"],
                ["score", "Score"],
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
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_NONE);
    var code = dropdown_variable_name + ' += ' + value_name + ';\n';
    return code;
};

Blockly.Python['change_variable_holder'] = function (block) {
    var dropdown_variable_name = block.getFieldValue('Variable name');
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = dropdown_variable_name + ' += ' + value_name + '\n';
    return code;
};

// Custom Variables Block
Blockly.Blocks['variables'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Variables", "dummy_increment"],
                ["score", "Score"],
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
    var code = dropdown_options;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['variables'] = function (block) {
    var dropdown_options = block.getFieldValue('Options');
    var code = dropdown_options;
    return [code, Blockly.Python.ORDER_NONE];
};


let a = {
    "contents": [{
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "set_variable_holder"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "change_variable_holder"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "variables"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "math_number"
        }
        ],
        "name": "Game Variables",
        "categorystyle": "variable_category"
    },
    {
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "spritetouch_block"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "Custom_text"
        }
        ],
        "name": "Events",
        "colour": "#FFFF00"
    },
    {
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "start_game_block"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "end_block"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "hide_block"
        }
        ],
        "name": "Actions",
        "colour": "#B430FF"
    },
    {
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "controls_if"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "logic_compare"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "logic_operation"
        }
        ],
        "name": "Conditions",
        "colour": "%{BKY_LOGIC_HUE}"
    },
    {
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "forever_repeat_block"
        }],
        "name": "Loops",
        "colour": "%{BKY_LOOPS_HUE}"
    }
    ],
    "id": "toolbox",
    "style": "display: none",
    "colour": "#D4AF37"
}

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "set_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "change_variable_holder" }, { "kind": "BLOCK", "blockxml": "", "type": "variables" }, { "kind": "BLOCK", "blockxml": "", "type": "math_number" }], "name": "Game Variables", "categorystyle": "variable_category" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "spritetouch_block" }, { "kind": "BLOCK", "blockxml": "", "type": "Custom_text" }], "name": "Events", "colour": "#FFFF00" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "start_game_block" }, { "kind": "BLOCK", "blockxml": "", "type": "end_block" }, { "kind": "BLOCK", "blockxml": "", "type": "hide_block" }], "name": "Actions", "colour": "#B430FF" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" }], "name": "Conditions", "colour": "%{BKY_LOGIC_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" }], "name": "Loops", "colour": "%{BKY_LOOPS_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }