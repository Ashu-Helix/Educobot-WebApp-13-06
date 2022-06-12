import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['say_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput("enter dialogue here"), "dialogue");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['wait_block'] = {
    init: function() {
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

Blockly.Blocks['calls_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Animal", "default_"],
                ["Pigs", "pig"],
                ["Hens", "hen"],
                ["Chicks", "chicken"],
                ["Sheep", "sheep"],
                ["Cow", "cow"],
            ]), "farmGirl")
            .appendField(" make")
            .appendField("sound");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(268);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};


Blockly.JavaScript['calls_block'] = function(block) {
    let opt = block.getFieldValue('farmGirl');
    let code = '';
    if (opt != 'default_') {
        code = 'await animationAndSoundOfAnimal("' + opt + '");\n';
    }
    return code;
};
Blockly.Python['calls_block'] = function(block) {
    let opt = block.getFieldValue('farmGirl');
    let code = '';
    if (opt != 'default_') {
        code = 'farm.animal_make_sound("' + opt + '")\n';
    }
    return code;
};

Blockly.Blocks['options_block'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["Animal list", "default_"],
                ["Pigs", "pig"],
                ["Hens", "hen"],
                ["Chicks", "chicken"],
                ["Sheep", "sheep"],
                ["Cow", "cow"],
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['options_block'] = function(block) {
    let code = "'" + block.getFieldValue('Options') + "'";
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python['options_block'] = function(block) {
    let code = "'" + block.getFieldValue('Options') + "'";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.JavaScript['say_block'] = function(block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'await createDialogue("' + dialogue + '");';
    return code;
};
Blockly.Python['say_block'] = function(block) {
    let dialogue = block.getFieldValue('dialogue');
    let code = 'say("' + dialogue + '")\n';
    return code;
};

Blockly.JavaScript['wait_block'] = function(block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'await waitDuration(' + (value_name * 1000) + ');';
    return code;
};
Blockly.Python['wait_block'] = function(block) {
    let value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    let code = 'time.sleep(' + value_name + ')\n';
    return code;
};


// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable", "default_"],
                    ["called_animal", "called_animal"],
                ]), "Variable name")
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["set_variable_holder"] = function(block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    //console.log('dropdown_variable_name',dropdown_variable_name)
    var value_name = Blockly.JavaScript.valueToCode(block, "NAME", Blockly.JavaScript.ORDER_ATOMIC);
    var code = dropdown_variable_name + "=" + value_name + ";\n";
    return code;
};
Blockly.Python["set_variable_holder"] = function(block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(block, "NAME", Blockly.Python.ORDER_ATOMIC);
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
    init: function() {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default_"],
                ["called_animal", "called_animal"],
            ]), "Options");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variables"] = function(block) {
    var code = block.getFieldValue("Options");
    console.log(code);
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function(block) {
    var code = block.getFieldValue("Options");
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Blocks["farm_girl_calls"] = {
    init: function() {
        this.appendDummyInput().appendField("Farm girl calls an animal randomly");
        this.setOutput(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["farm_girl_calls"] = function(block) {
    var code = "await farmGirlCallsRandomAnimal()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["farm_girl_calls"] = function(block) {
    var code = "farm.girl_call_animal_randomly()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

export const blocks = {
    kind: "category",
    name: "Farm Attendance",
    colour: "#FF1493",
    contents: [{
            kind: "block",
            type: "say_block",
        },
        {
            kind: "block",
            type: "wait_block",
        },
        {
            kind: "block",
            type: "calls_block",
        },
        {
            kind: "block",
            type: "options_block",
        },
        {
            kind: "block",
            type: "set_variable_holder",
        },
        {
            kind: "block",
            type: "variables",
        },
        {
            kind: "block",
            type: "farm_girl_calls",
        },
    ],
};