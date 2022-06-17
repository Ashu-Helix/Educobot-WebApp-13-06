import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Drop pebble");
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
                ["Water", "water"],
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["Pot's lid", "potLid"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(260);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drink_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Drink the water");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(555);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['wait_block'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("second(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Makes the code wait until the specified time");
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
    var branch = Blockly.JavaScript.statementToCode(block, 'NAME');
    var code = `update = async ()=>{
        if (!isDropping) {
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
    let code = 'await dropPabel();';
    return code;
};
Blockly.Python['action_block'] = function (block) {
    let code = 'drop_Pebble()\n';
    return code;
};

Blockly.JavaScript['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');
    let code = (((options1 == 'water' && options2 == 'potLid') || (options1 == 'potLid' && options2 == 'water'))) + ' && hasDroppedpabel';

    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');
    // let code = (((options1 == 'water' && options2 == 'potLid') || (options1 == 'potLid' && options2 == 'water'))) + ' && hasDroppedpabel';
    let code = 'is_water_touching_pot_lid()'
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['drink_block'] = function (block) {
    let code = 'drinkWater();';
    return code;
};
Blockly.Python['drink_block'] = function (block) {
    let code = 'drink_Water()\n';
    return code;
};

Blockly.JavaScript['wait_block'] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'await waitDuration(' + (value_name * 1000) + ');';
    return code;
};
Blockly.Python['wait_block'] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'sleep(' + value_name + ')\n';
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
            "type": "drink_block"
        },
        {
            "kind": "BLOCK",
            "blockxml": {},
            "type": "wait_block"
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
}

export const blocks = { kind: "categoryToolbox", "contents": [{ "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "spritetouch__block" }], "name": "Events", "colour": "#FFFF00" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "action_block" }, { "kind": "BLOCK", "blockxml": "", "type": "drink_block" }, { "kind": "BLOCK", "blockxml": "", "type": "wait_block" }], "name": "Actions", "colour": " #FFA500" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "controls_if" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_negate" }, { "kind": "BLOCK", "blockxml": "", "type": "logic_boolean" }], "name": "Conditons", "colour": "%{BKY_LOGIC_HUE}" }, { "kind": "CATEGORY", "contents": [{ "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" }], "name": "Loops", "colour": "%{BKY_LOOPS_HUE}" }], "id": "toolbox", "style": "display: none", "colour": "#D4AF37" }