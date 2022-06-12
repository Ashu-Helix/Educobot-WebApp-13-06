import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks["variable_holder"] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Variable name", ""],
                    ["India", "India"],
                    ["Australia", "Australia"],
                    ["Egypt", "Egypt"],
                    ["United States", "UnitedStates"],
                    ["UK", "London"],
                    ["Brazil", "Brazil"],
                ]),
                "countryName"
            )
            .appendField("=");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(285);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["xy"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("x :")
            .appendField(new Blockly.FieldTextInput("50"), "x_coordinate")
            .appendField(" y :")
            .appendField(new Blockly.FieldTextInput("50"), "y_coordinate");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.Blocks["place_block"] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Place")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Monuments", ""],
                    ["Christ the Redeemer", "brazil"],
                    ["Opera House", "lotus"],
                    ["Statue of Giza", "egypt"],
                    ["London bridge", "london"],
                    ["St Basil’s Cathedral", "monument5"],
                    ["Taj Mahal", "tajMahal"],
                    ["Statue of liberty", "statueOfLib"],
                ]),
                "options1"
            )
            .appendField("in")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Destinations", ""],
                    ["India", "India"],
                    ["Brazil", "Brazil"],
                    ["Russia", "place3"],
                    ["Australia", "Australia"],
                    ["Egypt", "Egypt"],
                    ["USA", "UnitedStates"],
                    ["UK", "London"],
                ]),
                "options2"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["variable_holder"] = function(block) {
    let countryName = block.getFieldValue("countryName");
    let code = "";

    if (
        block.childBlocks_ &&
        block.childBlocks_[0] &&
        block.childBlocks_[0].type == "xy"
    ) {
        let x_coordinate = block.childBlocks_[0].getFieldValue("x_coordinate");
        let y_coordinate = block.childBlocks_[0].getFieldValue("y_coordinate");
        code =
            'await storeCountryCords("' +
            countryName +
            '", "' +
            x_coordinate +
            '", "' +
            y_coordinate +
            '");';
    }

    return code;
};
Blockly.Python["variable_holder"] = function(block) {
    let countryName = block.getFieldValue("countryName");
    let code = "";

    if (
        block.childBlocks_ &&
        block.childBlocks_[0] &&
        block.childBlocks_[0].type == "xy"
    ) {
        let x_coordinate = block.childBlocks_[0].getFieldValue("x_coordinate");
        let y_coordinate = block.childBlocks_[0].getFieldValue("y_coordinate");
        code =
            'wonders.Update_coordinates("' +
            countryName +
            '", ' +
            x_coordinate +
            ", " +
            y_coordinate +
            ")\n";
    }

    return code;
};

Blockly.JavaScript["xy"] = function(block) {
    return "";
};
Blockly.Python["xy"] = function(block) {
    return "";
};

Blockly.JavaScript["place_block"] = function(block) {
    let monument = block.getFieldValue("options1");
    let location = block.getFieldValue("options2");
    let code = 'await moveWondersTo("' + monument + '", "' + location + '");';
    return code;
};
Blockly.Python["place_block"] = function(block) {
    let monument = block.getFieldValue("options1");
    let location = block.getFieldValue("options2");
    let code = 'wonders.place("' + monument + '", "' + location + '")\n';
    return code;
};

export const blocks = {
    kind: "category",
    name: "Wonder",
    colour: "#5000ff",
    contents: [{
            kind: "block",
            type: "variable_holder",
        },
        {
            kind: "block",
            type: "xy",
        },
        {
            kind: "block",
            type: "place_block",
        },
    ],
};