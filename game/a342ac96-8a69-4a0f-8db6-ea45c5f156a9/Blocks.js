import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

// Say block
Blockly.Blocks["say_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Say")
      .appendField(new Blockly.FieldTextInput("Hi"), "dialogue");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["say_block"] = function (block) {
  let dialogue = block.getFieldValue("dialogue");
  let code = `say("${dialogue}");\n`;
  return code;
};
Blockly.Python["say_block"] = function (block) {
  let dialogue = block.getFieldValue("dialogue");
  let code = `say("${dialogue}")\n`;
  return code;
};

//start the game
Blockly.Blocks["single_action_block"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Start Checking");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["single_action_block"] = function (block) {
  return "await start_checking();\n";
};

Blockly.Python["single_action_block"] = function (block) {
  return "await start_checking()\n";
};

// Custom Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
  init: function () {
    this.appendValueInput("NAME")
      .setCheck(null)
      .appendField("set")
      .appendField(
        new Blockly.FieldDropdown([
          ["Nails", "nails"],
          ["Teeth", "teeth"],
          ["Clothes", "clothes"],
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
  var code = dropdown_variable_name + " = " + value_name + "\n";
  return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Check Nails", "check_nails()"],
        ["Check Teeth", "check_teeth()"],
        ["Check Clothes", "check_clothes()"],
      ]),
      "Options"
    );
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(700);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["variables"] = function (block) {
  var dropdown_options = block.getFieldValue("Options");
  var code = dropdown_options;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["variables"] = function (block) {
  var dropdown_options = block.getFieldValue("Options");
  var code = dropdown_options;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Wait Block
Blockly.Blocks["wait"] = {
  init: function () {
    this.appendValueInput("WAIT")
      .setCheck("Number")
      .appendField(new Blockly.FieldLabelSerializable("Wait for"), "WAIT");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("Sec(s)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(259, 97, 90);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.JavaScript["wait"] = function (block) {
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    "WAIT",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `await sleep(${value_name});\n`;
  return code;
};
Blockly.Python["wait"] = function (block) {
  var value_name = Blockly.Python.valueToCode(
    block,
    "WAIT",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `await sleep(${value_name})\n`;
  return code;
};

// Value Block
Blockly.Blocks["value_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(" ")
      .appendField(
        new Blockly.FieldDropdown([
          ["nails", "nails"],
          ["teeth", "teeth"],
          ["clothes", "clothes"],
        ]),
        "Options"
      );
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["value_block"] = function (block) {
  var dropdown_options = block.getFieldValue("Options");
  var code = `${dropdown_options}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["value_block"] = function (block) {
  var dropdown_options = block.getFieldValue("Options");
  var code = `${dropdown_options}`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Custom new_block_good_bad Block
Blockly.Blocks["new_block_good_bad"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(" ")
      //   .appendField("are")
      .appendField(
        new Blockly.FieldDropdown([
          ["Good", "good"],
          ["Bad", "bad"],
        ]),
        "Variable name"
      );
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["new_block_good_bad"] = function (block) {
  var choice = block.getFieldValue("Variable name");
  var code = `'${choice}'`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.Python["new_block_good_bad"] = function (block) {
  var choice = block.getFieldValue("Variable name");
  var code = `'${choice}'`;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// custom_text  Block
Blockly.Blocks["custom_text"] = {
  init: function () {
    this.appendDummyInput().appendField("Next Student", "Options");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(40);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["custom_text"] = function (block) {
  let code = "await next_student()\n";
  return code;
};

Blockly.Python["custom_text"] = function (block) {
  let code = "await next_student()\n";
  return code;
};

// Custom next_student_is_available Block
Blockly.Blocks["next_student_is_available"] = {
  init: function () {
    this.appendDummyInput().appendField("next student is available", "Options");
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(210);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["next_student_is_available"] = function (block) {
  let code = "next_student_is_available()";
  return [code, ""];
};

Blockly.Python["next_student_is_available"] = function (block) {
  let code = "next_student_is_available()";
  return [code, ""];
};

// // our_if_else block
// Blockly.Blocks["our_if_else"] = {
//   init: function () {
//     this.appendValueInput("if")
//       .setCheck(null)
//       .setAlign(Blockly.ALIGN_CENTRE)
//       .appendField("if");
//     this.appendStatementInput("if_statement").setCheck(null);
//     this.appendStatementInput("else_statement")
//       .setCheck(null)
//       .appendField("else");
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(210);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   },
// };

// Blockly.JavaScript["our_if_else"] = function (block) {
//   var if_condition = Blockly.JavaScript.valueToCode(
//     block,
//     "if",
//     Blockly.JavaScript.ORDER_ATOMIC
//   );
//   if_condition = if_condition.replace("((", "(").replace("')", "'");
//   if_condition = if_condition.split("||");
//   if_condition = "(" + if_condition.join(") || (") + ")";

//   var if_statement = Blockly.JavaScript.statementToCode(block, "if_statement");
//   var else_statement = Blockly.JavaScript.statementToCode(
//     block,
//     "else_statement"
//   );
//   var code = `if(${if_condition})`;
//   if (if_statement != "") {
//     code += ` {\n${if_statement}}`;
//   }
//   if (else_statement != "") {
//     code += ` else {\n${else_statement}}`;
//   }
//   return code;
// };

// Blockly.Python["our_if_else"] = function (block) {
//   var if_condition = Blockly.Python.valueToCode(
//     block,
//     "if",
//     Blockly.JavaScript.ORDER_ATOMIC
//   );
//   if_condition = if_condition.replace("((", "(").replace("')", "'");
//   if_condition = if_condition.split("||");
//   if_condition = "(" + if_condition.join(") || (") + ")";

//   var if_statement = Blockly.JavaScript.statementToCode(block, "if_statement");
//   var else_statement = Blockly.JavaScript.statementToCode(
//     block,
//     "else_statement"
//   );
//   var code = `if(${if_condition})`;
//   if (if_statement != "") {
//     code += ` {\n${if_statement}}`;
//   }
//   if (else_statement != "") {
//     code += ` else {\n${else_statement}}`;
//   }
//   return code;
// };

// //Our If Condition Block
// Blockly.Blocks["our_if_condition_block"] = {
//   init: function () {
//     this.appendValueInput("Condition").appendField("if");
//     this.appendStatementInput("statements").setCheck(null);
//     this.setInputsInline(false);
//     this.setPreviousStatement(true, null);
//     this.setNextStatement(true, null);
//     this.setColour(285);
//     this.setTooltip("");
//     this.setHelpUrl("");
//   },
// };

// Blockly.JavaScript["our_if_condition_block"] = function (block) {
//   var value_condition = Blockly.JavaScript.valueToCode(
//     block,
//     "Condition",
//     Blockly.JavaScript.ORDER_ATOMIC
//   );
//   var statements_statements = Blockly.JavaScript.statementToCode(
//     block,
//     "statements"
//   );
//   var code = value_condition + ";";
//   var code = `if(${value_condition})`;
//   code += `{\n${statements_statements}}`;
//   return code;
// };

// Blockly.Python["our_if_condition_block"] = function (block) {
//   var value_condition = Blockly.JavaScript.valueToCode(
//     block,
//     "Condition",
//     Blockly.JavaScript.ORDER_ATOMIC
//   );
//   var statements_statements = Blockly.JavaScript.statementToCode(
//     block,
//     "statements"
//   );
//   var code = value_condition + ";";
//   var code = `if(${value_condition})`;
//   code += `{\n${statements_statements}}`;
//   return code;
// };

export const blocks = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
        { kind: "BLOCK", blockxml: "", type: "value_block" },
        { kind: "BLOCK", blockxml: "", type: "math_number" },
        { kind: "BLOCK", blockxml: "", type: "new_block_good_bad" },
      ],
      name: "Variables",
      colour: "%{BKY_VARIABLES_HUE}",
    },
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "next_student_is_available" },
      ],
      name: "Events",
      colour: "#FFFF00",
    },
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "single_action_block" },
        { kind: "BLOCK", blockxml: "", type: "variables" },
        { kind: "BLOCK", blockxml: "", type: "say_block" },
        { kind: "BLOCK", blockxml: "", type: "wait" },
        { kind: "BLOCK", blockxml: "", type: "custom_text" },
      ],
      name: "Actions",
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
      contents: [{ kind: "BLOCK", blockxml: "", type: "controls_whileUntil" }],
      name: "Loops",
      colour: "%{BKY_LOOPS_HUE}",
    },
  ],
  xmlns: "https://developers.google.com/blockly/xml",
  id: "toolbox",
  style: "display: none",
};
