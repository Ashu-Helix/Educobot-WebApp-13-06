import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['end_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("End All");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(15);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['end_block'] = function (block) {
    let code = 'fnGameOverText();';
    return code;
};
Blockly.Python['end_block'] = function (block) {
    let code = 'end_game()\n';
    return code;
};



Blockly.Blocks['show_variable_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display")
            .appendField(new Blockly.FieldDropdown([
                ["Variable name", "dummy"],
                ["Score", "score"]
            ]), "NAME")
            .appendField(" on screen");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(200);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['show_variable_block'] = function (block) {
    let code = 'fnShowPoints("' + block.getFieldValue('NAME') + '");';
    return code;
};
Blockly.Python['show_variable_block'] = function (block) {
    let code = 'display_score()\n';
    return code;
};

Blockly.Blocks['action_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Let Mole appear");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(350);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['action_block'] = function (block) {
    let code = 'fnShowRandomMole();';
    return code;
};
Blockly.Python['action_block'] = function (block) {
    let code = 'mole_pops_up_from_random_hole()\n';
    return code;
};

Blockly.Blocks['spritetouch__block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["hammer", "hammer"],
            ]), "options1")
            .appendField("touches")
            .appendField(new Blockly.FieldDropdown([
                ["animal", "animal"]
            ]), "options2");
        this.setOutput(true, null);
        this.setColour(250);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['spritetouch__block'] = function (block) {
    const options1 = block.getFieldValue('options1');
    const options2 = block.getFieldValue('options2');
    let code = ((options1 == 'hammer' && options2 == 'animal') || (options2 == 'hammer' && options1 == 'animal')) + ' && isBeaverHitHammer';
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['spritetouch__block'] = function (block) {
    let code = "is_hammer_touching_mole()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks['addition_block'] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("Add")
            .appendField(new Blockly.FieldDropdown([
                ["Score", "score"]
            ]), "NAME")
            .appendField(" + ")
            .appendField(new Blockly.FieldNumber(1, 0), "addscorevalue");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(270);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['addition_block'] = function (block) {
    let name = block.getFieldValue('NAME');
    let code = name == 'score' ? 'fnAddScoreValue("' + block.getFieldValue('addscorevalue') + '");' : '';
    return code;
};
Blockly.Python['addition_block'] = function (block) {
    let name = block.getFieldValue('NAME');
    let code = "score += " + block.getFieldValue('addscorevalue') + "\n";
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
        ` + branch + `
        reset_for_update();
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

Blockly.Blocks['compare_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Score ")
            .appendField(new Blockly.FieldDropdown([
                ["=", "="],
            ]), "NAME")
            .appendField(new Blockly.FieldNumber(0), "number");
        this.setOutput(true, null);
        this.setColour(195);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};



Blockly.JavaScript['compare_block'] = function (block) {
    const _name = block.getFieldValue('NAME');
    const _number = block.getFieldValue('number');
    let code = _name == "=" ? 'scorePoints >= ' + _number : false;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python['compare_block'] = function (block) {
    const _name = block.getFieldValue('NAME');
    const _number = block.getFieldValue('number');
    // let code = _name == "=" ? 'scorePoints >= ' + _number : false;
    let code = "score == " + _number;
    return [code, Blockly.JavaScript.ORDER_NONE];
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "forever_repeat_block" },
                { kind: "BLOCK", blockxml: "", type: "compare_block" },
                { kind: "BLOCK", blockxml: "", type: "spritetouch__block" },
                { kind: "BLOCK", blockxml: "", type: "show_variable_block" },
                { kind: "BLOCK", blockxml: "", type: "addition_block" },
                { kind: "BLOCK", blockxml: "", type: "action_block" },
                { kind: "BLOCK", blockxml: "", type: "end_block" },
            ],
            name: "Whack-a-Mole",
            colour: "#B430FF",
            cssConfig: { container: "cat1" },
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_if" }],
            name: "If",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};