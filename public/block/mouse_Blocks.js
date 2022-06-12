import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;
import { Game, AUTO } from "phaser";
const gameWidth = 1920;
const gameHeight = 1080;
import {
    reset_output,
    completedFlag,
    isRightActive,
    repeat_forever_flag,
    is_mouse_touching_cheese,
    moveDirOnLeftArrow,
    moveDirOnRightArrow,
    moveDirOnUpArrow,
    moveDirOnDownArrow,
    fnMoveLeftOrRight,
    fnStopMouseMovement,
    game,
    preload,
    create,
    lastKeyDown,
    isGameCompleted,
    isLeftActive,
    isDownActive,
    isUpActive,
    cursorss,
} from "../game/mouse/main";


Blockly.Blocks["key_sensing"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Key Pressed is")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Left_arrow", "left"],
                    ["Right_arrow", "right"],
                    ["Up_arrow", "up"],
                    ["Down_arrow", "down"],
                ]),
                "NAME"
            );
        this.setOutput(true, null);
        this.setColour(30);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["key_sensing"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var code = "";
    if (dropdown_name == "left")
        code =
            "isLeftActive && moveDirOnLeftArrow != '' && (cursors.left.isDown || (isClicking && ('left' == lastKeyDown)))";
    if (dropdown_name == "right")
        code =
            "isRightActive && moveDirOnRightArrow != '' && (cursors.right.isDown || (isClicking && ('right' == lastKeyDown)))";
    if (dropdown_name == "up")
        code =
            "isUpActive && moveDirOnUpArrow != '' && (cursors.up.isDown || (isClicking && ('up' == lastKeyDown)))";
    if (dropdown_name == "down")
        code =
            "isDownActive && moveDirOnDownArrow != '' && (cursors.down.isDown || (isClicking && ('down' == lastKeyDown)))";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["key_sensing"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var code = "";
    if (dropdown_name == "left") code = "is_left_arrow_pressed()";
    if (dropdown_name == "right") code = "is_right_arrow_pressed()";
    if (dropdown_name == "up") code = "is_up_arrow_pressed()";
    if (dropdown_name == "down") code = "is_down_arrow_pressed()";
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["move_mouse"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Move")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Left", "left"],
                    ["Right", "right"],
                    ["Up", "up"],
                    ["Down", "down"],
                ]),
                "NAME"
            );
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(50);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["move_mouse"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var code = "";
    if (dropdown_name == "left")
        code = `if (moveDirOnLeftArrow == 'left' || moveDirOnLeftArrow == 'right')
        fnMoveLeftOrRight(moveDirOnLeftArrow);
    else if (moveDirOnLeftArrow == 'up' || moveDirOnLeftArrow == 'down')
        fnMoveUpOrDown(moveDirOnLeftArrow);`;
    if (dropdown_name == "right")
        code = `if (moveDirOnRightArrow == 'left' || moveDirOnRightArrow == 'right')
        fnMoveLeftOrRight(moveDirOnRightArrow);
    else if (moveDirOnRightArrow == 'up' || moveDirOnRightArrow == 'down')
        fnMoveUpOrDown(moveDirOnRightArrow);`;
    if (dropdown_name == "up")
        code = `if (moveDirOnUpArrow == 'left' || moveDirOnUpArrow == 'right')
        fnMoveLeftOrRight(moveDirOnUpArrow);
    else if (moveDirOnUpArrow == 'up' || moveDirOnUpArrow == 'down')
        fnMoveUpOrDown(moveDirOnUpArrow);`;
    if (dropdown_name == "down")
        code = `if (moveDirOnDownArrow == 'left' || moveDirOnDownArrow == 'right')
        fnMoveLeftOrRight(moveDirOnDownArrow);
    else if (moveDirOnDownArrow == 'up' || moveDirOnDownArrow == 'down')
        fnMoveUpOrDown(moveDirOnDownArrow);`;
    return code;
};
Blockly.Python["move_mouse"] = function (block) {
    var dropdown_name = block.getFieldValue("NAME");
    var code = "";
    if (dropdown_name == "left") code = `mouse.move_left()\n`;
    if (dropdown_name == "right") code = "mouse.move_right()\n";
    if (dropdown_name == "up") code = "mouse.move_up()\n";
    if (dropdown_name == "down") code = "mouse.move_down()\n";
    return code;
};

Blockly.Blocks["spritetouch__block"] = {
    init: function () {
        this.appendDummyInput()
            .appendField(
                new Blockly.FieldDropdown([
                    ["Sprite 1", "false"],
                    ["Mouse", "mouse"],
                ]),
                "options1"
            )
            .appendField("touches")
            .appendField(
                new Blockly.FieldDropdown([
                    ["Sprite 2", "false"],
                    ["Cheese", "cheese"],
                ]),
                "options2"
            );
        this.setOutput(true, null);
        this.setColour(276);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["spritetouch__block"] = function (block) {
    var dropdown_options1 = block.getFieldValue("options1");
    var dropdown_options2 = block.getFieldValue("options2");
    var code = "";
    if (dropdown_options1 == "mouse" && dropdown_options2 == "cheese")
        code = "is_mouse_touching_cheese()";
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Python["spritetouch__block"] = function (block) {
    var dropdown_options1 = block.getFieldValue("options1");
    var dropdown_options2 = block.getFieldValue("options2");
    var code = "";
    if (dropdown_options1 == "mouse" && dropdown_options2 == "cheese")
        code = "is_mouse_touching_cheese()";
    return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["eat_block"] = {
    init: function () {
        this.appendDummyInput()
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField("Eat the cheese when found");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(334);
        this.setTooltip("");
        this.setHelpUrl("");
    },
};

Blockly.JavaScript["eat_block"] = function (block) {
    let code = "fnCanEatCheese();";
    return code;
};
Blockly.Python["eat_block"] = function (block) {
    let code = "mouse.eat_cheese_when_found()\n";
    return code;
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
        `update = ()=>{ if (!isGameCompleted) {
        ` +
        branch +
        `
        if (isLeftActive && moveDirOnLeftArrow != '' && 
        (cursors?.left?.isDown || (isClicking && ('left' == lastKeyDown)))) {} 
        
        else if (isRightActive && moveDirOnRightArrow != '' && 
        (cursors?.right?.isDown || (isClicking && ('right' == lastKeyDown)))) {}
        else if (isUpActive && moveDirOnUpArrow != '' && (cursors.up.isDown || 
        (isClicking && ('up' == lastKeyDown)))) {} 
        else if (isDownActive && moveDirOnDownArrow != '' && 
        (cursors.down.isDown || (isClicking && ('down' == lastKeyDown)))) {} 
        else { fnStopMouseMovement(); }
    }}`;

    if (repeat_forever_flag) {

        eval(code)
        game.destroy();
        document.getElementById("sprite-container").innerHTML = "";
        setTimeout(() => {
            var config = {
                type: AUTO,
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
            let game1 = new Game(config);
        }, 100);
        //  }
    }
    setInterval
    return code;
};
Blockly.Python["forever_repeat_block"] = function (block) {
    var branch = Blockly.Python.statementToCode(block, "NAME");
    var code = "while True:\n" + branch;
    return code;
};


export const blocks = {
    kind: "category",
    name: "mouse",
    colour: "#5000ff",
    contents: [{
        kind: "block",
        type: "key_sensing",
    },
    {
        kind: "block",
        type: "move_mouse",
    },

    {
        kind: "block",
        type: "spritetouch__block",
    },
    {
        kind: "block",
        type: "eat_block",
    },
    {
        kind: "block",
        type: "forever_repeat_block",
    },
    ],
};