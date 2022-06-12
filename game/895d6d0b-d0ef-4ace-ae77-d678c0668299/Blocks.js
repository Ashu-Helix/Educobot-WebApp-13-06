import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Catch the fish");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(315);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['spritetouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["fish", "fish"]
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["hook", "hook"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(260);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['show_variable_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy"],
                ["Fish_count", "fishCount"]
            ]), "NAME")
            .appendField(" on screen");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(280);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['addition_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Add")
            .appendField(new Blockly.FieldDropdown([
                ["Variable_name", "dummy"],
                ["Fish_count", "fishCount"]
            ]), "NAME")
            .appendField(" + ")
            .appendField(new Blockly.FieldNumber(0, 0), "NAME2");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(265);
        this.setTooltip("");
        this.setHelpUrl("");
    }
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
    let branch = Blockly.JavaScript.statementToCode(block, 'NAME');
    let code = `update = ()=>{
        update_top();
        ` + branch + `
        update_bottom();
   }`
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

Blockly.JavaScript['action_block'] = function (block) {
    let code = 'activeFishing();';
    return code;
};
Blockly.Python['action_block'] = function (block) {
    let code = 'catch_fish()\n';
    return code;
};

Blockly.JavaScript['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');

    let code = ((options1 == 'hook' && options2 == 'fish') || (options1 == 'fish' && options2 == 'hook'));
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');

    let code = ((options1 == 'hook' && options2 == 'fish') || (options1 == 'fish' && options2 == 'hook'));
    code = 'fish_touches_hook()';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['show_variable_block'] = function (block) {
    let code = 'showFishCount("' + block.getFieldValue('NAME') + '");';
    return code;
};
Blockly.Python['show_variable_block'] = function (block) {
    let code = 'showFishCount()\n';
    return code;
};

Blockly.JavaScript['addition_block'] = function (block) {
    const variableName = block.getFieldValue('NAME');
    let code = '';

    if (variableName == 'fishCount') {
        const variablevalue = block.getFieldValue('NAME2');
        code += 'increaseFishCountBy(' + variablevalue + ');';
    }

    return code;
};


Blockly.Python['addition_block'] = function (block) {
    const variableName = block.getFieldValue('NAME');
    let code = '';

    if (variableName == 'fishCount') {
        const variablevalue = block.getFieldValue('NAME2');
        code += 'increaseFishCountBy(' + variablevalue + ')\n';
    }

    return code;
};

var a = {
    "contents": [{
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "spritetouch__block"
        }],
        "name": "Events",
        "colour": "#FFFF00"
    },
    {
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "action_block"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "addition_block"
        }
        ],
        "name": "Actions",
        "colour": " #FFA500"
    },
    {
        "kind": "CATEGORY",
        "contents": [{
            "kind": "BLOCK",
            "blockxml": {},
            "type": "show_variable_block"
        }],
        "name": "Display",
        "colour": "#A020F0"
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
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "logic_negate"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "logic_boolean"
        }
        ],
        "name": "Conditons",
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
};

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "spritetouch__block" }], "name": "Events", "colour": "#FFFF00" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "action_block" }, { "kind": "BLOCK", "blockxml": "", "type": "addition_block" }], "name": "Actions", "colour": " #FFA500" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "show_variable_block" }], "name": "Display", "colour": "#A020F0" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_negate" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_boolean" }], "name": "Conditons", "colour": "%{BKY_LOGIC_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" }], "name": "Loops", "colour": "%{BKY_LOOPS_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }