import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['traffic_signal'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("LIGHT")
            .appendField(new Blockly.FieldDropdown([
                ["RED", "red"],
                ["AMBER", "amber"],
                ["GREEN", "green"]
            ]), "light")
            .appendField("SWITCH")
            .appendField(new Blockly.FieldDropdown([
                ["ON", "on"],
                ["OFF", "off"],
            ]), "switch");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(40);
        this.setTooltip("Control the Traffic signal");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['traffic_signal'] = function (block) {
    var light = block.getFieldValue('light');
    var switch_ = block.getFieldValue('switch');
    // TODO: Assemble JavaScript into code variable.
    if (light == "red") {
        if (switch_ == "on")
            var code = "await red_light_control(true);";
        else if (switch_ == "off")
            var code = "await red_light_control(false);";
    } else if (light == "amber") {
        if (switch_ == "on")
            var code = "await amber_light_control(true);";
        else if (switch_ == "off")
            var code = "await amber_light_control(false);";
    } else if (light == "green") {
        if (switch_ == "on")
            var code = "await green_light_control(true);";
        else if (switch_ == "off")
            var code = "await green_light_control(false);";
    }

    return code;
};

Blockly.Python['traffic_signal'] = function (block) {
    var light = block.getFieldValue('light');
    var switch_ = block.getFieldValue('switch');
    // TODO: Assemble JavaScript into code variable.
    if (light == "red") {
        if (switch_ == "on")
            var code = "traffic_signal.red(true)\n";
        else if (switch_ == "off")
            var code = "traffic_signal.red(false)\n";
    } else if (light == "amber") {
        if (switch_ == "on")
            var code = "traffic_signal.amber(true)\n";
        else if (switch_ == "off")
            var code = "traffic_signal.amber(false)\n";
    } else if (light == "green") {
        if (switch_ == "on")
            var code = "traffic_signal.green(true)\n";
        else if (switch_ == "off")
            var code = "traffic_signal.green(false)\n";
    }

    return code;
};



Blockly.Blocks['wait_block'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("sec(s)");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['wait_block'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var code = 'await sleep(' + value_name * 1000 + ');';
    return code;
};

Blockly.Python['wait_block'] = function (block) {
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var code = 'traffic_signal.wait(' + value_name + ')\n';
    return code;
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "traffic_signal" },
                {
                    kind: "BLOCK",
                    blockxml: '<block type="wait_block"><value name = "NAME"><block type = "math_number"><field name="NUM">1</field></block></value></block>',
                    type: "wait_block"
                },
            ],
            name: "Traffic Signal",
            colour: "#4D07E6",
            cssConfig: { container: "cat1" },
        },
        {
            kind: "CATEGORY",
            contents: [{
                kind: "BLOCK",
                blockxml: '<block type="controls_repeat_ext"><value name = "TIMES"><block type = "math_number"><field name="NUM">10</field></block></value></block>',
                type: "controls_repeat_ext"
            }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};