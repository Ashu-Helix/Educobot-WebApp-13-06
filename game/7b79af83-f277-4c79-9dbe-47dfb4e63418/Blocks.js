import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;


Blockly.Blocks["forever_repeat_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Repeat forever");
        this.appendStatementInput("NAME")
            .setCheck(null)
            .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(135);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["forever_repeat_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Repeat forever");
        this.appendStatementInput("NAME")
            .setCheck(null)
            .setAlign(Blockly.ALIGN_CENTRE);
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(135);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["forever_repeat_block"] = function (block) {
    var branch = Blockly.JavaScript.statementToCode(block, "NAME");
    var code =
        "var i=0;\nupdate = ()=>{ " +
        branch +
        "if (i_touch_chocolate()) {\nif (tray2Empty == false && tray3Empty == false) {\n if(i<2){M.toast({ html: 'The Trays are full' }); i++;}\n}\n}}";
    if (repeat_forever_flag) {
        eval(code);
        game.destroy();
        document.getElementById("sprite-container").innerHTML = "";
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
                    debug: false,
                },
            },
            scene: {
                preload: preload,
                create: create,
                update: update,
            },
        };
        let game1 = new Phaser.Game(config);
    }
    return code;
};
Blockly.Python["forever_repeat_block"] = function (block) {
    var branch = Blockly.Python.statementToCode(block, "NAME");
    var code = "while True:\n" + branch;
    return code;
};
// Serve chocolate
Blockly.Blocks["secondary_action_block"] = {
    init: function () {
        this.appendDummyInput().appendField("Serve the chocolate");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(276);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["secondary_action_block"] = function (block) {
    var code = "serve_chocolate_to_customer();\n";
    return code;
};

Blockly.Python["secondary_action_block"] = function (block) {
    var code = "serve_chocolate_to_customer()\n";
    return code;
};

// Wrap the chocolate block
Blockly.Blocks["action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Wrap the chocolate");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(35);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["action_block"] = function (block) {
    var code = "wrap_chocolate_in_selected_wrapper();\n";
    return code;
};

Blockly.Python["action_block"] = function (block) {
    var code = "wrap_chocolate_in_selected_wrapper()\n";
    return code;
};

// Sprite touch block
Blockly.Blocks["spritetouch__block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([
                    // ["Sprite 1", "dummy1"],
                    // ["Chocolate", "option1"],
                    // ["Wrapper", "option2"],
                    ["Wrapped chocolate", "option3"],
                    // ["Customer", "option4"],
                ]),
                "options1"
            )
            .appendField("touches")
            .appendField(
                new Blockly.FieldDropdown([
                    // ["Sprite 2", "dummy1"],
                    // ["Chocolate", "option1"],
                    // ["Wrapper", "option2"],
                    // ["Wrapped chocolate", "option3"],
                    ["Customer", "option4"],
                ]),
                "options2"
            );
        this.setOutput(true, null);
        this.setColour(330);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["spritetouch__block"] = function (block) {
    var dropdown_options1 = block.getFieldValue("options1");
    var dropdown_options2 = block.getFieldValue("options2");
    var code = "";
    var o1 = "";
    var o2 = "";
    if (dropdown_options1 == "dummy1") {
        o1 = "Sprite 1";
    } else if (dropdown_options1 == "option1") {
        o1 = "Chocolate";
    } else if (dropdown_options1 == "option2") {
        o1 = "Wrapper";
    } else if (dropdown_options1 == "option3") {
        o1 = "Wrapped chocolate";
    } else if (dropdown_options1 == "option4") {
        o1 = "Customer";
    }

    if (dropdown_options2 == "dummy1") {
        o2 = "dummy";
    } else if (dropdown_options2 == "option1") {
        o2 = "Chocolate";
    } else if (dropdown_options2 == "option2") {
        o2 = "Wrapper";
    } else if (dropdown_options2 == "option3") {
        o2 = "Wrapped chocolate";
    } else if (dropdown_options2 == "option4") {
        o2 = "Customer";
    }
    if (o1 == "Wrapped chocolate" && o2 == "Customer") {
        code = "wrapped_chocolate_touches_customer()";
    } else {
        code = "false";
    }
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["spritetouch__block"] = function (block) {
    var dropdown_options1 = block.getFieldValue("options1");
    var dropdown_options2 = block.getFieldValue("options2");
    var code = "";
    var o1 = "";
    var o2 = "";
    if (dropdown_options1 == "dummy1") {
        o1 = "Sprite 1";
    } else if (dropdown_options1 == "option1") {
        o1 = "Chocolate";
    } else if (dropdown_options1 == "option2") {
        o1 = "Wrapper";
    } else if (dropdown_options1 == "option3") {
        o1 = "Wrapped chocolate";
    } else if (dropdown_options1 == "option4") {
        o1 = "Customer";
    }

    if (dropdown_options2 == "dummy1") {
        o2 = "Sprite 2";
    } else if (dropdown_options2 == "option1") {
        o2 = "Chocolate";
    } else if (dropdown_options2 == "option2") {
        o2 = "Wrapper";
    } else if (dropdown_options2 == "option3") {
        o2 = "Wrapped chocolate";
    } else if (dropdown_options2 == "option4") {
        o2 = "Customer";
    }
    if (o1 == "Wrapped chocolate" && o2 == "Customer") {
        code = "wrapped_chocolate_touches_customer()";
    } else {
        code = "False";
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// I touch block
Blockly.Blocks["pointertouch__block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("I")
            .appendField("touch")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Sprite ", "dummy"],
                    ["Chocolate", "option1"],
                    ["Wrapper", "option2"],
                ]),
                "options2"
            );
        this.setOutput(true, null);
        this.setColour(298);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["pointertouch__block"] = function (block) {
    var dropdown_options2 = block.getFieldValue("options2");
    var code = "";
    if (dropdown_options2 == "option1") {
        code = "i_touch_chocolate()";
    } else if (dropdown_options2 == "option2") {
        code = "(chocolate_is_picked() && i_touch_a_wrapper())";
    }
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["pointertouch__block"] = function (block) {
    var dropdown_options2 = block.getFieldValue("options2");
    var code = "";
    if (dropdown_options2 == "option1") {
        code = "i_touch_chocolate()";
    } else if (dropdown_options2 == "option2") {
        code = "chocolate_is_picked() and i_touch_a_wrapper()";
    }
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Display variable on the screen block
Blockly.Blocks["show_variable_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Display")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Customers to be served", "option1"],
                ]),
                "NAME"
            )
            .appendField(" on screen");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(236);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["show_variable_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var code = "customers_to_be_served();\n";
    return code;
};

Blockly.Python["show_variable_block"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var code = "customers_to_be_served()\n";
    return code;
};

// Variables
Blockly.Blocks["variables"] = {
    init: function () {
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["Variables", "default"],
                ["if any customer Patience bar becomes 0", "option1"],
                ["Customers to be served", "OPTIONNAME"],
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
    if (dropdown_options == "option1")
        code = "minimum_of_any_customer_patience_bar()";
    else if (dropdown_options == "OPTIONNAME") code = "customers_to_be_served()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python["variables"] = function (block) {
    var dropdown_options = block.getFieldValue("Options");
    var code = "";
    if (dropdown_options == "option1")
        code = "minimum_of_any_customer_patience_bar()";
    else if (dropdown_options == "OPTIONNAME") code = "customers_to_be_served()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

// Pick the chocolate block
Blockly.Blocks["single_action_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Pick the chocolate");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(48);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["single_action_block"] = function (block) {
    var code = "pick_up_chocolate();\n";
    return code;
};

Blockly.Python["single_action_block"] = function (block) {
    var code = "pick_up_chocolate()\n";
    return code;
};

// Say Block
Blockly.Blocks["say_block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Say")
            .appendField(new Blockly.FieldTextInput(""), "say");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(155);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["say_block"] = function (block) {
    var say = block.getFieldValue("say");
    var code = `say("${say}");\n`;
    return code;
};

Blockly.Python["say_block"] = function (block) {
    var say = block.getFieldValue("say");
    var code = `say("${say}")\n`;
    return code;
};

// End Block
Blockly.Blocks["end_block"] = {
    init: function () {
        this.appendDummyInput().appendField("End all");
        this.setPreviousStatement(true, null);
        this.setColour(0);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["end_block"] = function (block) {
    var code = "game_over();\n";
    return code;
};

Blockly.Python["end_block"] = function (block) {
    var code = "game_over()\n";
    return code;
};

// customer block
Blockly.Blocks["customer_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Show the customer");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["customer_block"] = function (block) {
    var code = "start_customer_arrival();\n";
    return code;
};

Blockly.Python["customer_block"] = function (block) {
    var code = "start_customer_arrival()\n";
    return code;
};


// export{
//     i
// }

export const blocks = {
    kind: "categoryToolbox",
    "id": "toolbox", "style": "display: none", "colour": "#D4AF37",
    "contents": [
        {
            "kind": "CATEGORY",
            "name": "Game Variables",
            "categorystyle": "variable_category",
            "contents": [
                { "kind": "BLOCK", "blockxml": "", "type": "variables" },
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Events",
            "colour": "#FFFF00",
            "contents": [
                { "kind": "BLOCK", "blockxml": "", "type": "forever_repeat_block" },
            ],

        },
        {
            "kind": "CATEGORY",
            "name": "Actions",
            "colour": "#B430FF",
            "contents": [
                { "kind": "BLOCK", "blockxml": "", "type": "secondary_action_block" },
                { "kind": "BLOCK", "blockxml": "", "type": "variables" },
                { "kind": "BLOCK", "blockxml": "", "type": "show_variable_block" },
                { "kind": "BLOCK", "blockxml": "", "type": "single_action_block" },
                { "kind": "BLOCK", "blockxml": "", "type": "action_block" },
                { "kind": "BLOCK", "blockxml": "", "type": "say_block" },
                { "kind": "BLOCK", "blockxml": "", "type": "end_block" },
                { "kind": "BLOCK", "blockxml": "", "type": "customer_block" }
            ],

        },
        {
            "kind": "CATEGORY",
            "name": "If",
            "contents": [
                { "kind": "BLOCK", "blockxml": "", "type": "controls_if" },
                { "kind": "BLOCK", "blockxml": "", "type": "controls_if" },
                { "kind": "BLOCK", "blockxml": "", "type": "controls_if" },
                { "kind": "BLOCK", "blockxml": "", "type": "controls_repeat_ext" }
            ]
        },
        {
            "kind": "CATEGORY",
            "name": "Boolean", "colour": "%{BKY_LOGIC_HUE}",
            "contents": [
                { "kind": "BLOCK", "blockxml": "", "type": "logic_compare" },
                { "kind": "BLOCK", "blockxml": "", "type": "logic_operation" },
                { "kind": "BLOCK", "blockxml": "", "type": "logic_negate" },
                { "kind": "BLOCK", "blockxml": "", "type": "logic_boolean" },
                { "kind": "BLOCK", "blockxml": "", "type": "logic_null" },
                { "kind": "BLOCK", "blockxml": "", "type": "logic_ternary" }
            ]
        }
    ],
}