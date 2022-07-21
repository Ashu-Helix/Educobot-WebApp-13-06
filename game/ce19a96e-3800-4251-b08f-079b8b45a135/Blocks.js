import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("set")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", "dummy"],
                    ["weight", "weight"],
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
    //console.log('dropdown_variable_name',dropdown_variable_name)
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + "=" + value_name + ";\n";
    return code;
};
Blockly.Python["set_variable_holder"] = function (block) {
    var dropdown_variable_name = block.getFieldValue("Variable name");
    var value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    var code = dropdown_variable_name + " = " + value_name + "\n";
    return code;
};

// // Change Variable Block
// Blockly.Blocks["change_variable_holder"] = {
//     init: function() {
//         this.appendValueInput("NAME")
//             .setCheck(null)
//             .appendField("change")
//             .appendField(
//                 new Blockly.FieldDropdown([
//                     ["Variable name", "dummy_increment"],
//                     ["weight", "weight_increment"],
//                 ]),
//                 "Variable name"
//             )
//             .appendField("by");
//         this.setInputsInline(false);
//         this.setPreviousStatement(true, null);
//         this.setNextStatement(true, null);
//         this.setColour(330);
//         this.setTooltip("");
//         this.setHelpUrl("");
//     },
// };

// Blockly.JavaScript["change_variable_holder"] = function(block) {
//     var dropdown_variable_name = block.getFieldValue("Variable name");
//     var value_name = Blockly.JavaScript.valueToCode(
//         block,
//         "NAME",
//         Blockly.JavaScript.ORDER_ATOMIC
//     );
//     var code = dropdown_variable_name + "=" + value_name + ";";
//     return code;
// };

// Blockly.Python["change_variable_holder"] = function(block) {
//     var dropdown_variable_name = block.getFieldValue("Variable name");
//     var value_name = Blockly.JavaScript.valueToCode(
//         block,
//         "NAME",
//         Blockly.JavaScript.ORDER_ATOMIC
//     );
//     var code = "...;\n";
//     return code;
// };

// Custom Variables Block
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "dummy"],
                ["weight", "weight"],
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
    var dropdown_options = block.getFieldValue("Options");
    var code = "";
    if (dropdown_options == "weight") code = "weight";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var code = "";
    if (dropdown_options == "weight") code = "weight";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Start checking luggage
Blockly.Blocks["single_action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Start checking");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(165);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["single_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "await start_checking();\n";
    return code;
};

Blockly.Python["single_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "start_checking()\n";
    return code;
};

// pass the luggage
Blockly.Blocks["action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Pass the luggage");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "await pass_luggage();\n";
    return code;
};

Blockly.Python["action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "pass_luggage()\n";
    return code;
};

// Reject luggage
Blockly.Blocks["secondary_action_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Reject the luggage");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(345);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["secondary_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "await reject_luggage();\n";
    return code;
};

Blockly.Python["secondary_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "reject_luggage()\n";
    return code;
};

// next luggage
Blockly.Blocks["repeated_action_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Next luggage");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(300);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["repeated_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "await next_luggage();\n";
    // var code = "test();\n";
    return code;
};

Blockly.Python["repeated_action_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "next_luggage()\n";
    // var code = " test();\n";
    return code;
};

// Wait block
Blockly.Blocks["wait_block"] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("Wait for"), "NAME");
        this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("sec");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(259, 97, 90);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};
Blockly.JavaScript["wait_block"] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let code = "await sleep(" + value_name * 1000 + ");";
    return code;
};
Blockly.Python["wait_block"] = function (block) {
    let value_name = Blockly.JavaScript.valueToCode(
        block,
        "NAME",
        Blockly.JavaScript.ORDER_ATOMIC
    );
    let code = "time.sleep(" + value_name + ")\n";
    return code;
};

// Display Input Box
Blockly.Blocks["display_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Measured weight of bag");
        this.setOutput(true, null);
        this.setColour(45);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["display_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "get_weight_of_luggage_from_weighing_scale_display()";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["display_block"] = function (block) {
    // TODO: Assemble JavaScript into code variable.
    var code = "get_weight_of_luggage_from_weighing_scale_display()\n";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// export const blocks = [{
//     "kind": "CATEGORY",
//     "contents": [
//         {
//             "kind": "BLOCK",

//             "type": "set_variable_holder"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "variables"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "math_number"
//         }
//     ],
//     "name": "Game Variables",
//     "categorystyle": "variable_category"
// },
// {
//     "kind": "CATEGORY",
//     "contents": [
//         {
//             "kind": "BLOCK",

//             "type": "single_action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "repeated_action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "secondary_action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "display_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "wait_block"
//         }
//     ],
//     "name": "Luggage Checker",
//     "colour": "#B430FF"
// },
// {
//     "kind": "CATEGORY",
//     "contents": [
//         {
//             "kind": "BLOCK",

//             "type": "controls_if"
//         }
//     ],
//     "name": "If",
//     "colour": "%{BKY_LOGIC_HUE}"
// },
// {
//     "kind": "CATEGORY",
//     "contents": [
//         {
//             "kind": "BLOCK",

//             "type": "logic_compare"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_operation"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_negate"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_boolean"
//         }
//     ],
//     "name": "Boolean",
//     "colour": "%{BKY_LOGIC_HUE}"
// },
// {
//     "kind": "CATEGORY",
//     "contents": [
//         {
//             "kind": "BLOCK",

//             "type": "controls_repeat_ext"
//         }
//     ],
//     "name": "Loops",
//     "colour": "%{BKY_LOOPS_HUE}"
// }];

// CODE FOR TOOLBOX & EXPORT BELOW

// {
//     "contents": [
//         {
//             "kind": "CATEGORY",
//             "contents": [
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "set_variable_holder"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "variables"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "math_number"
//                 }
//             ],
//             "name": "Game Variables",
//             "categorystyle": "variable_category"
//         },
//         {
//             "kind": "CATEGORY",
//             "contents": [
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "single_action_block"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "action_block"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "repeated_action_block"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "secondary_action_block"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "display_block"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "wait_block"
//                 }
//             ],
//             "name": "Luggage Checker",
//             "colour": "#B430FF"
//         },
//         {
//             "kind": "CATEGORY",
//             "contents": [
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "controls_if"
//                 }
//             ],
//             "name": "If",
//             "colour": "%{BKY_LOGIC_HUE}"
//         },
//         {
//             "kind": "CATEGORY",
//             "contents": [
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "logic_compare"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "logic_operation"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "logic_negate"
//                 },
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "logic_boolean"
//                 }
//             ],
//             "name": "Boolean",
//             "colour": "%{BKY_LOGIC_HUE}"
//         },
//         {
//             "kind": "CATEGORY",
//             "contents": [
//                 {
//                     "kind": "BLOCK",
//                     "blockxml": {},
//                     "type": "controls_repeat_ext"
//                 }
//             ],
//             "name": "Loops",
//             "colour": "%{BKY_LOOPS_HUE}"
//         }
//     ],
//     "id": "toolbox",
//     "style": "display: none",
//     "colour": "#D4AF37"
// }

// export const blocks = {
//     "kind": "CATEGORY",
//     "contents": [
//         {
//             "kind": "BLOCK",

//             "type": "set_variable_holder"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "variables"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "math_number"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "single_action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "repeated_action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "secondary_action_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "display_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "wait_block"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "controls_if"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_compare"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_operation"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_negate"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "logic_boolean"
//         },
//         {
//             "kind": "BLOCK",

//             "type": "controls_repeat_ext"
//         }
//     ],
//     "name": "Loops",
//     "colour": "%{BKY_LOOPS_HUE}"
// };

export const blocks = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
                { kind: "BLOCK", blockxml: "", type: "variables" },
                { kind: "BLOCK", blockxml: "", type: "math_number" },
            ],
            name: "Game Variables",
            categorystyle: "variable_category",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "single_action_block" },
                { kind: "BLOCK", blockxml: "", type: "action_block" },
                { kind: "BLOCK", blockxml: "", type: "repeated_action_block" },
                { kind: "BLOCK", blockxml: "", type: "secondary_action_block" },
                { kind: "BLOCK", blockxml: "", type: "display_block" },
                { kind: "BLOCK", blockxml: "", type: "wait_block" },
            ],
            name: "Luggage Checker",
            colour: "#B430FF",
        },
        {
            kind: "CATEGORY",
            contents: [
                { kind: "BLOCK", blockxml: "", type: "controls_if" },
                { kind: "BLOCK", blockxml: "", type: "logic_compare" },
                { kind: "BLOCK", blockxml: "", type: "logic_operation" },
            ],
            name: "Conditions",
            colour: "%{BKY_LOGIC_HUE}",
        },
        {
            kind: "CATEGORY",
            contents: [{ kind: "BLOCK", blockxml: "", type: "controls_repeat_ext" }],
            name: "Loops",
            colour: "%{BKY_LOOPS_HUE}",
        },
    ],
    id: "toolbox",
    style: "display: none",
    colour: "#D4AF37",
};
