import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

Blockly.HSV_SATURATION = 1;
Blockly.HSV_VALUE = 1;

Blockly.Blocks['move'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("SEND: ")
            .appendField(new Blockly.FieldDropdown([
                ["Ambulance", GAME_CONSTANT.ambulance],
                ["Bus", GAME_CONSTANT.bus],
                ["Fire Brigade", GAME_CONSTANT.fireBrigade],
                ["Police Car", GAME_CONSTANT.policeCar],
            ]), "vehicle")
            .appendField("TO: ");
        this.setInputsInline(false);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(285);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['xy'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("x :")
            .appendField(new Blockly.FieldTextInput("50"), "x_coordinate")
            .appendField(" y :")
            .appendField(new Blockly.FieldTextInput("50"), "y_coordinate");
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

let nTotalAction = 0;
Blockly.JavaScript['move'] = function (block) {
    let vehicle = block.getFieldValue('vehicle');
    let code = '';
    if (block.childBlocks_ && block.childBlocks_[0] && block.childBlocks_[0].type == 'xy') {
        let xAxis = block.childBlocks_[0].getFieldValue('x_coordinate');
        let yAxis = block.childBlocks_[0].getFieldValue('y_coordinate');
        code = "addToMoveVehicle('" + vehicle + "', '" + xAxis + "', '" + yAxis + "');"
        ++nTotalAction;
    }

    return code;
};

let arrAction = [];

function addToMoveVehicle(vehicle, x, y) {
    arrAction.push({ 'vehicle': vehicle, 'destination': { 'x': x.trim(), 'y': y.trim() } })
    if (arrAction.length == nTotalAction) {
        nTotalAction = 0;
        moveNextVehicle();
    }
}

function moveNextVehicle() {
    if (arrAction.length > 0) {
        let action = arrAction.shift();
        moveVehicleTo(action.vehicle, action.destination, moveNextVehicle);
    }
}
Blockly.Python['move'] = function (block) {
    let vehicle = block.getFieldValue('vehicle');
    let code = "addToMoveVehicle('" + vehicle + ", None)\n";
    if (block.childBlocks_ && block.childBlocks_[0] && block.childBlocks_[0].type == 'xy') {
        let xAxis = block.childBlocks_[0].getFieldValue('x_coordinate');
        let yAxis = block.childBlocks_[0].getFieldValue('y_coordinate');
        code = "city.send(vehicle='" + vehicle + "', coordinates=(" + xAxis + ", " + yAxis + "))\n";
    }
    return code;
};

Blockly.JavaScript['xy'] = function (block) {
    return '';
};
Blockly.Python['xy'] = function (block) {
    return '';
};


export const blocks = {
    kind: "category",
    name: "Wonder",
    colour: "#5000ff",
    contents: [{
        kind: "block",
        type: "move",
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

// export { addToMoveVehicle, moveNextVehicle }
window['addToMoveVehicle'] = addToMoveVehicle;
window['moveNextVehicle'] = moveNextVehicle;
