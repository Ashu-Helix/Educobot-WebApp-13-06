import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

import {
  update,
  preload,
  create,
  gameHeight,
  gameWidth,
  repeat_forever_flag
} from "./main"

//Repeat Forever block
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
  var code = `
    reInitValues();
    update = (time, delta)=>{ 
    
        counter += delta;
        if(counter > 1000 && !gameOver){
          timer-=1;
            ${branch}
            counter = 0;
        }
        
        updateWorld();
    }`;
  if (repeat_forever_flag) {
    eval(code);
    game.destroy();
    document.getElementById("sprite-container").innerHTML = "";
    setTimeout(() => {
      let config = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        backgroundColor: "#eeeeee",
        parent: "sprite-container",
        //canvas: canvas1,
        canvasStyle: `width: 100%;
        object-fit: revert;
        aspect-ratio: 738 / 436;`,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: true,
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
Blockly.Python["forever_repeat_block"] = function (block) {
  var branch = Blockly.Python.statementToCode(block, "NAME");
  var code = "while True:\n" + branch;
  return code;
};

// Game Over block
Blockly.Blocks["game_over"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Game Over");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(30);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.JavaScript["game_over"] = function (block) {
  let code = "game_over();";
  return code;
};
Blockly.Python["game_over"] = function (block) {
  let code = "game_over()";
  return code;
};

// Set Variable Block
Blockly.Blocks["set_variable_holder"] = {
  init: function () {
    this.appendValueInput("NAME")
      .setCheck(null)
      .appendField("set")
      .appendField(
        new Blockly.FieldDropdown([
          ["Variable name", "dummy"],
          ["Dice", "dice"],
          ["timer", "timer"],
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
    Blockly.JavaScript.ORDER_NONE
  );
  var code = `${dropdown_variable_name} = ${value_name};`;
  return code;
};
Blockly.Python["set_variable_holder"] = function (block) {
  var dropdown_variable_name = block.getFieldValue("Variable name");
  var value_name = Blockly.Python.valueToCode(
    block,
    "NAME",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `${dropdown_variable_name} = ${value_name}\n`;
  return code;
};

// Set Variable Block
Blockly.Blocks["change_variable_holder"] = {
  init: function () {
    this.appendValueInput("NAME")
      .setCheck(null)
      .appendField("change")
      .appendField(
        new Blockly.FieldDropdown([
          ["Variable name", "dummy"],
          ["Dice", "dice"],
          ["timer", "timer"],
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
Blockly.JavaScript["change_variable_holder"] = function (block) {
  var dropdown_variable_name = block.getFieldValue("Variable name");
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `${dropdown_variable_name} = ${dropdown_variable_name} + ${value_name};`;
  return code;
};
Blockly.Python["change_variable_holder"] = function (block) {
  var dropdown_variable_name = block.getFieldValue("Variable name");
  var value_name = Blockly.Python.valueToCode(
    block,
    "NAME",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `${dropdown_variable_name} = ${dropdown_variable_name} + ${value_name};`;
  return code;
};

// Custom Variables Block
Blockly.Blocks["variables"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown([
        ["Variables", "dummy"],
        ["timer", "timer"],
        ["dice", "dice"],
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
  var code = `${dropdown_options}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python["variables"] = function (block) {
  var dropdown_options = block.getFieldValue("Options");
  var code = `${dropdown_options}`;
  return [code, Blockly.Python.ORDER_NONE];
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
  let code = "sleep(" + value_name * 1000 + ");";
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

Blockly.Blocks["diceaction_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Roll Dice !");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(330);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["diceaction_block"] = function (block) {
  var code = "roll_dice();\n";
  return code;
};

Blockly.Python["diceaction_block"] = function (block) {
  var code = "roll_dice()\n";
  return code;
};

Blockly.Blocks["secondary_action_block"] = {
  init: function () {
    this.appendDummyInput().appendField("Enter game");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(50);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["secondary_action_block"] = function (block) {
  var code = "enter_game()";
  return code;
};
Blockly.Python["secondary_action_block"] = function (block) {
  var code = "enter_game()\n";
  return code;
};

Blockly.Blocks["move_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Move")
      .appendField(
        new Blockly.FieldDropdown([
          ["Variable", "dummy"],
          ["Dice", "dice"],
          ["timer", "timer"],
        ]),
        "options1"
      )
      .appendField("Steps");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(645);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.JavaScript["move_block"] = function (block) {
  var dropdown_options1 = block.getFieldValue("options1");
  var code = `move_car_steps('${dropdown_options1}');\n`;
  return code;
};
Blockly.Python["move_block"] = function (block) {
  var dropdown_options1 = block.getFieldValue("options1");
  var code = `move_car_steps(${dropdown_options1})\n`;
  return code;
};

Blockly.Blocks["action_block"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Move to nearest checkpoint");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.JavaScript["action_block"] = function (block) {
  var code = "move_to_checkpoint();\n";
  return code;
};
Blockly.Python["action_block"] = function (block) {
  var code = "move_to_checkpoint()\n";
  return code;
};

Blockly.Blocks["end_block"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("End all");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
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

Blockly.Blocks["say_block"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("Say")
      .appendField(new Blockly.FieldTextInput("enter dialogue here"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["say_block"] = function (block) {
  var text_name = block.getFieldValue("NAME");
  // TODO: Assemble JavaScript into code variable.
  var code = `show_message('${text_name}');\n`;
  return code;
};
Blockly.Python["say_block"] = function (block) {
  var text_name = block.getFieldValue("NAME");
  // TODO: Assemble JavaScript into code variable.
  var code = `say('${text_name}')\n`;
  return code;
};

Blockly.Blocks["sprite_locationblock"] = {
  init: function () {
    this.appendDummyInput()
      .appendField(
        new Blockly.FieldDropdown([
          ["Object", "dummy"],
          ["Car", "car"],
        ]),
        "options1"
      )
      .appendField("in")
      .appendField(
        new Blockly.FieldDropdown([
          ["Location", "dummy"],
          ["Board", "board"],
          ["Start", "start"],
          ["Finish", "finish"],
          ["Checkpoint", "checkpoint"],
          ["Reverse", "reverse"],
        ]),
        "options2"
      );
    this.setOutput(true, null);
    this.setColour(195);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.JavaScript["sprite_locationblock"] = function (block) {
  var dropdown_options1 = block.getFieldValue("options1");
  var dropdown_options2 = block.getFieldValue("options2");
  var code = `check_location('${dropdown_options1}', '${dropdown_options2}')`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python["sprite_locationblock"] = function (block) {
  var dropdown_options1 = block.getFieldValue("options1");
  var dropdown_options2 = block.getFieldValue("options2");
  var code = `check_location('${dropdown_options1}', '${dropdown_options2}')`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["empty_string_block"] = {
  init: function () {
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput(""),
      "inputstring"
    );
    this.setOutput(true, null);
    this.setColour(75);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
Blockly.JavaScript["empty_string_block"] = function () {
  return "";
};
Blockly.Python["empty_string_block"] = function () {
  return "";
};

Blockly.Blocks["compare_variables_block"] = {
  init: function () {
    this.appendValueInput("NAME")
      .setCheck("Number")
      .appendField(
        new Blockly.FieldDropdown([
          ["Variable name", "dummy"],
          ["Dice", "dice"],
          ["timer", "timer"],
        ]),
        "Variable name"
      )
      .appendField("=");
    this.setInputsInline(false);
    this.setOutput(true, null);
    this.setColour(150);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["compare_variables_block"] = function (block) {
  var dropdown_variable_name = block.getFieldValue("Variable name");
  var value_name = Blockly.JavaScript.valueToCode(
    block,
    "NAME",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `${dropdown_variable_name} == ${value_name}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
Blockly.Python["compare_variables_block"] = function (block) {
  var dropdown_variable_name = block.getFieldValue("Variable name");
  var value_name = Blockly.Python.valueToCode(
    block,
    "NAME",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `${dropdown_variable_name} == ${value_name}`;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["pointertouch__block"] = {
  init: function () {
    this.appendDummyInput().appendField("I touch dice");
    this.setOutput(true, null);
    this.setColour(165);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["pointertouch__block"] = function (block) {
  var code = "touch_dice()";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["pointertouch__block"] = function (block) {
  var code = "touch_dice()";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["touch_car"] = {
  init: function () {
    this.appendDummyInput().appendField("I touch car");
    this.setOutput(true, null);
    this.setColour(980);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["touch_car"] = function (block) {
  var code = "touch_car()";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["touch_car"] = function (block) {
  var code = "touch_car()";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["change_car"] = {
  init: function () {
    this.appendDummyInput()
      .setAlign(Blockly.ALIGN_CENTRE)
      .appendField("Change Car");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};

Blockly.JavaScript["change_car"] = function (block) {
  var code = "change_car();\n";
  return code;
};
Blockly.Python["change_car"] = function (block) {
  var code = "change_car()\n";
  return code;
};

Blockly.JavaScript["math_random_int"] = function (block) {
  let min = Blockly.JavaScript.valueToCode(
    block,
    "FROM",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  let max = Blockly.JavaScript.valueToCode(
    block,
    "TO",
    Blockly.JavaScript.ORDER_ATOMIC
  );

  var code = `mathRandomInt(${min},${max});`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};


export const blocks = {
  kind: "categoryToolbox",
  contents: [
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "set_variable_holder" },
        { kind: "BLOCK", blockxml: "", type: "change_variable_holder" },
        { kind: "BLOCK", blockxml: "", type: "variables" },
        { kind: "BLOCK", blockxml: "", type: "math_number" },
      ],
      name: "Game Variables",
      categorystyle: "variable_category",
    },
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "diceaction_block" },
        { kind: "BLOCK", blockxml: "", type: "move_block" },
        { kind: "BLOCK", blockxml: "", type: "say_block" },
        { kind: "BLOCK", blockxml: "", type: "end_block" },
        { kind: "BLOCK", blockxml: "", type: "action_block" },
        { kind: "BLOCK", blockxml: "", type: "secondary_action_block" },
        { kind: "BLOCK", blockxml: "", type: "change_car" },
      ],
      name: "Actions",
      colour: "#B430FF",
    },
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "controls_if" },
        { kind: "BLOCK", blockxml: "", type: "logic_compare" },
        { kind: "BLOCK", blockxml: "", type: "compare_variables_block" },
        { kind: "BLOCK", blockxml: "", type: "sprite_locationblock" },
        { kind: "BLOCK", blockxml: "", type: "pointertouch__block" },
        { kind: "BLOCK", blockxml: "", type: "touch_car" },
      ],
      name: "Conditions",
      colour: "%{BKY_LOGIC_HUE}",
    },
    {
      kind: "CATEGORY",
      contents: [{ kind: "BLOCK", blockxml: "", type: "forever_repeat_block" }],
      name: "Loops",
      colour: "%{BKY_LOOPS_HUE}",
    },
    {
      kind: "CATEGORY",
      contents: [
        { kind: "BLOCK", blockxml: "", type: "math_random_int" },
        { kind: "BLOCK", blockxml: "", type: "math_number" },
      ],
      name: "Math Blocks",
      colour: "%{BKY_MATH_HUE}",
    },
  ],
  id: "toolbox",
  style: "display: none",
  colour: "#D4AF37",
};