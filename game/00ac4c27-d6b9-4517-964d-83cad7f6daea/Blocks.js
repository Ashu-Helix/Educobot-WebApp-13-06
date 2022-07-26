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
          ["height", "height"],
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
  var value_name = Blockly.Python.valueToCode(
    block,
    "NAME",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = dropdown_variable_name + "=" + value_name + "\n";
  return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Variables", "dummy"],
        ["height", "height"],
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
  if (dropdown_options == "height") code = "height";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function (block) {
  var dropdown_options = block.getFieldValue("Options");
  // TODO: Assemble JavaScript into code variable.
  var code = "";
  if (dropdown_options == "height") code = "height";
  else if (dropdown_options == "dummy") code = "Variables";
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Open ride block
Blockly.Blocks["open_ride_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Open the ride");
    this.setNextStatement(true, null);
    this.setColour(345);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["open_ride_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "await open_ride();\n";
  return code;
};

Blockly.Python["open_ride_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "open_ride()\n";
  return code;
};

// Measure height block
Blockly.Blocks["height_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Measure height");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(860);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["height_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "await measure_height_animation();\n";
  return code;
};

Blockly.Python["height_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "measure_height_animation()\n";
  return code;
};

// next person block
Blockly.Blocks["next_person_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Next person");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(255);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["next_person_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "await next_person();\n";
  return code;
};

Blockly.Python["next_person_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = "next_person()\n";
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
  let code = "await sleep(" + value_name + ");\n";
  return code;
};
Blockly.Python["wait_block"] = function (block) {
  let value_name = Blockly.Python.valueToCode(
    block,
    "NAME",
    Blockly.Python.ORDER_NONE
  );
  let code = "time.sleep(" + value_name + ")\n";
  return code;
};

//   Display input box block
Blockly.Blocks["display_input_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Display Input Box");
    this.setOutput(true, null);
    this.setColour(40);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["display_input_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = `get_float_input_from_user("Enter Height in ft: ")`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["display_input_block"] = function (block) {
  // TODO: Assemble JavaScript into code variable.
  var code = `get_float_input_from_user("Enter Height in ft: ")`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// allow block block

Blockly.Blocks["multiaction_block"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Action", "default"],
        ["Allow", "op1"],
        ["Block", "op2"],
      ]),
      "NAME"
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["multiaction_block"] = function (block) {
  var dropdown_name = block.getFieldValue("NAME");
  // TODO: Assemble JavaScript into code variable.
  var code = "";
  if (dropdown_name == "op1") code = "await allow();\n";
  else if (dropdown_name == "op2") code = "await dont_allow();\n";
  return code;
};

Blockly.Python["multiaction_block"] = function (block) {
  var dropdown_name = block.getFieldValue("NAME");
  // TODO: Assemble JavaScript into code variable.
  var code = "";
  if (dropdown_name == "op1") code = "allow()\n";
  else if (dropdown_name == "op2") code = "dont_allow()\n";
  else if (dropdown_name == "default") code = "Action\n";
  return code;
};

export const blocks = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
        { kind: "BLOCK", blockxml: "", type: "variables" },
        {
          kind: "BLOCK",
          blockxml: '<block type="math_number"><field name = "NUM">1</field></block>',
          type: "math_number"
        },
      ],
      name: "Game Variables",
      categorystyle: "variable_category",
    },
    {
      kind: "CATEGORY",
      contents: [
        {
          kind: "BLOCK",
          blockxml: '<block type="wait_block"><value name = "NAME"><block type = "math_number"><field name="NUM">1</field></block></value></block>',
          type: "wait_block"
        },
        { kind: "BLOCK", blockxml: "", type: "display_input_block" },
        { kind: "BLOCK", blockxml: "", type: "next_person_block" },
        { kind: "BLOCK", blockxml: "", type: "height_block" },
        { kind: "BLOCK", blockxml: "", type: "open_ride_block" },
        { kind: "BLOCK", blockxml: "", type: "multiaction_block" },
      ],
      name: "Events",
      colour: "#FFFF00",
    },
    {
      kind: "CATEGORY",
      contents: [{
        kind: "BLOCK",
        blockxml: '<block type="controls_repeat_ext"><value name="TIMES"><block type="math_number"><field name="NUM">4</field></block></value></block>',
        type: "controls_repeat_ext"
      }],
      name: "Loops",
      colour: "%{BKY_LOOPS_HUE}",
    },
    {
      kind: "CATEGORY",
      contents: [
        {
          kind: "BLOCK",
          blockxml: '<block type="controls_if"><mutation else="1"></mutation></block>',
          type: "controls_if"
        },
        { kind: "BLOCK", blockxml: "", type: "logic_compare" },
      ],
      name: "Conditions",
      colour: "%{BKY_LOGIC_HUE}",
    },
  ],
  id: "toolbox",
  style: "display: none",
  colour: "#D4AF37",
};