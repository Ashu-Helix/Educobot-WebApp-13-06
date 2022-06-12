Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;
import Blockly from 'blockly';
import 'blockly/python';
import 'blockly/javascript';
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
        this.setColour(259, 97, 90);
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
            var code = "await trafficSignal.red(true);";
        else if (switch_ == "off")
            var code = "await trafficSignal.red(false);";
    } else if (light == "amber") {
        if (switch_ == "on")
            var code = "await trafficSignal.amber(true);";
        else if (switch_ == "off")
            var code = "await trafficSignal.amber(false);";
    } else if (light == "green") {
        if (switch_ == "on")
            var code = "await trafficSignal.green(true);";
        else if (switch_ == "off")
            var code = "await trafficSignal.green(false);";
    }
    return code;
};

Blockly.Python['traffic_signal'] = function (block) {
    var light = block.getFieldValue('light');
    var switch_ = block.getFieldValue('switch');
    // TODO: Assemble JavaScript into code variable.
    if (light == "red") {
        if (switch_ == "on")
            var code = "trafficSignal.red(true)\n";
        else if (switch_ == "off")
            var code = "trafficSignal.red(false)\n";
    } else if (light == "amber") {
        if (switch_ == "on")
            var code = "trafficSignal.amber(true)\n";
        else if (switch_ == "off")
            var code = "trafficSignal.amber(false)\n";
    } else if (light == "green") {
        if (switch_ == "on")
            var code = "trafficSignal.green(true)\n";
        else if (switch_ == "off")
            var code = "trafficSignal.green(false)\n";
    }

    return code;
};


Blockly.Blocks['wait'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait 1000 ms");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("Wait time in milliseconds");
        this.setHelpUrl("");
        this.set
    }
};

Blockly.JavaScript['wait'] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "await sleep(1000);";
    return code;
};

Blockly.Python['wait'] = function (block) {
    var code = "trafficSignal.wait(1000)\n";
    return code;
};
/*
Blockly.Blocks['wait_block'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField("ms");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
*/
Blockly.Blocks['wait_block'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Wait for")
            .appendField(new Blockly.FieldNumber(0), "milli")
            .appendField("ms");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.JavaScript['wait_block'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var number_milli = block.getFieldValue('milli');
    var code = 'await trafficSignal.wait(' + number_milli + ');';
    return code;
};

Blockly.Python['wait_block'] = function (block) {
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    var number_milli = block.getFieldValue('milli');
    var code = 'trafficSignal.wait(' + number_milli + ')\n';
    return code;
};

export const blocks = {
    kind: "category",
    name: "Traffic",
    colour: "#5000ff",
    contents: [
        {
            kind: "block",
            type: "wait_block",
        },
        {
            kind: "block",
            type: "traffic_signal",
        }]
};