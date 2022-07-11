import "blockly/python";
import "blockly/javascript";

import Blockly from "blockly";
Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks["serve_block"] = {
    init: function () {
        this.appendDummyInput().setAlign(Blockly.ALIGN_CENTRE).appendField("Serve");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(15);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["serve_block"] = function (block) {
    let code =
        "await movePizzaSliceToPlate(plate1,1); await movePizzaSliceToPlate(plate2, 2);";
    return code;
};
Blockly.Python["serve_block"] = function (block) {
    let code = "chef.serve()\n";
    return code;
};

// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy_increment"],
                    ["plate1_slices", "plate1"],
                    ["plate2_slices", "plate2"],
                ]),
                "Variable name"
            )
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["set_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "=" + value_name + ";";
    return code;
};
Blockly.Python["set_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// Change Variable Block
Blockly.Blocks["change_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("change")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy_increment"],
                    ["plate1_slices", "plate1"],
                    ["plate2_slices", "plate2"],
                ]),
                "Variable name"
            )
            .appendField("by");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["change_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code =
        dropdown_variable_name +
        " += " +
        value_name +
        ";LivesTXT.setText(lives); KMText.setText(TotalKm.toString()); ScoreTX.setText(score);";
    return code;
};

Blockly.Python["change_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.Python.valueToCode(
        block,
        "NAME",
        Blockly.Python.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " += " + value_name + "\n";
    return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variable name", "dummy_increment"],
                ["plate1_slices", "plate1"],
                ["plate2_slices", "plate2"],
            ]),
            "Options"
        );
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variables"] = function (block) {
    // var dropdown_options = block.getFieldValue('Options');
    var code = block.getFieldValue("Options");
    // if (dropdown_options == "score")
    //     code = 'score';
    // else if (dropdown_options == "lives")
    //     code = 'lives';
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var code = block.getFieldValue("Options");
    // if (dropdown_options == "score")
    //     code = 'score';
    // else if (dropdown_options == "lives")
    //     code = 'lives';
    return [code, Blockly.Python.ORDER_NONE];
};

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                {
                    kind: "BLOCK",
                    blockxml: '<block type="set_variable_holder"><value name = "NAME"><block type = "math_number"><field name="NUM">0</field></block></value></block>',
                    type: "set_variable_holder"
                },
                {
                    kind: "BLOCK",
                    blockxml: '<block type="change_variable_holder"><value name = "NAME"><block type = "math_number"><field name="NUM">-1</field></block></value></block>',
                    type: "change_variable_holder"
                },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Game Variables",
            categorystyle: "variable_category",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "serve_block" }],
            name: "Serve",
            colour: "#B430FF",
            cssConfig: { container: "cat1" },
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};