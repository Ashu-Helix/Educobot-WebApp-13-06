const Blockly = require("blockly");
import "blockly/python";
import "blockly/javascript";
let demoWorkspace = Blockly.getMainWorkspace();
let instructions_html = [];
let workspaces = [];
var count_instructions = 0;
let playAudio = false;
let tour_over = false;
let rescued = false;
let helpCode = () => { $('#help_practice').modal('open'); };

function update_rescue_workspace(i) {
    var xml = Blockly.Xml.textToDom(workspaces[i]);
    demoWorkspace.clear();
    Blockly.Xml.domToWorkspace(xml, demoWorkspace);
    $('#undo_btn').css('display', 'inline-block');
    rescued = true;
}
function lesson_title(txt) {
    return `<hr><h5>${txt}</h5><hr><br>`
}
if (demoWorkspace) {
    demoWorkspace.addChangeListener((event) => {
        if (event.type == Blockly.Events.BLOCK_CREATE ||
            event.type == Blockly.Events.BLOCK_DELETE ||
            event.type == Blockly.Events.BLOCK_CHANGE || event.type == Blockly.Events.BLOCK_MOVE) {
            if (!rescued) $('#undo_btn').css('display', 'none');
            else setTimeout(() => { rescued = false; }, 500);
        }
    });
}

function add_instruction(j) {

    let col1 = j.col1;
    let col2 = j.col2;
    let rescue = j.rescue;
    let checkbox = j.checkbox;
    let workspace = '<xml xmlns="https://developers.google.com/blockly/xml"></xml>';
    try {
        if (typeof (j.workspace) != "undefined")
            if (j.workspace != "") workspace = j.workspace;
    } catch { }

    let rescue_btn = `
    <div class="col s2 m2 l2 xl2">
        <button class="waves-effect waves-dark btn-small black-text white" style="height: 24px;line-height: 24px;padding: 0 0.5rem;" 
onclick="update_rescue_workspace(${count_instructions});">Rescue</button>
    </div>
        `;
    let rescue_btn_empty = `<div class="col s2 m2 l2 xl2"></div>`;
    let checkbox_btn = `<div class="col s1 m1 l1 xl1">
                <label class="container"><input type="checkbox"><span class="checkmark"></span></label>
            </div>`;
    let checkbox_btn_empty = `<div class="col s1 m1 l1 xl1"></div>`;

    let component = `<div class="row valign-wrapper">`;
    if ((col1 != "" && col2 != "") || (col1 == "" && col2 != "")) {
        component += `
            <div class="col s4 m4 l4 xl4 left-align">
                ${col1}
            </div>
            <div class="col s5 m5 l5 xl5 left-align">
               ${col2}
            </div>
            `;
        if (rescue) component += rescue_btn;
        else component += rescue_btn_empty;

        if (checkbox) component += checkbox_btn;
        else component += checkbox_btn_empty;
    } else if (col1 != "" && col2 == "") {
        component += `
            <div class="col s9 m9 l9 xl9 left-align">
                ${col1}
            </div>
            `;
        if (rescue) component += rescue_btn;
        else component += rescue_btn_empty;

        if (checkbox) component += checkbox_btn;
        else component += checkbox_btn_empty;
    }
    component += `</div>`;

    count_instructions++;
    workspaces.push(workspace);
    instructions_html.push(component);
}

function undo_button_function() {
    demoWorkspace.undo(false);
    demoWorkspace.undo(false);
    $('#undo_btn').css('display', 'none');
}

function instruction_activate() {
    let instructions = instructions_html.join("");
    let wrapper_pre = `<div id="help_practice" class="modal modal-fixed-footer" style="border-radius: 18px;">
    <div class="modal-content center-align" style="padding-top: 35px;">`;
    let wrapper_post = ` </div>
    <div class="modal-footer">
        <div style="float: left;margin-left: 15px;"><button id="undo_btn" style="display:none;" class="waves-effect waves-gray btn-flat white-text black" onclick="undo_button_function();">UNDO</button>
            </div><a href="#!" class="modal-close waves-effect waves-gray btn-flat white-text black" style="margin-right:15px;margin-bottom:20px">Close</a>
    </div>
    </div>`;
    instructions = wrapper_pre + instructions + wrapper_post;

    $('body').append(instructions);
    $('#help_practice').modal();
}

function setAudioPreference() {
    var elementId;
    if (playAudio) {
        kill_audio();
    }
    if (!(playAudio)) {
        playAudio = true;
        elementId = document.getElementById('soundButton');
        elementId = document.getElementById('soundButton2');
        document.getElementById('soundButton').src = "assets/unmute.png";
        document.getElementById('soundButton2').src = "assets/unmute.png";
    } else {
        playAudio = false;
        elementId = document.getElementById('soundButton');
        document.getElementById('soundButton').src = "assets/mute.png";
        document.getElementById('soundButton2').src = "assets/mute.png";
    }
}
$('document').ready(function () {
    //  instruction_activate();
    $('#help_practice').modal();
    //$('#help_practice').modal('open');
    //  window['helpCodefun'] = helpCode()
});



//CODE BELOW FROM HERE.......................................................
add_instruction({
    col1: lesson_title(`The task is to place the monument at the appropriate country through blocks`),
    col2: ``,
    rescue: false,
    checkbox: false,
    workspace: '',
})
add_instruction({
    col1: `Touch the country and obtain the x,y coordinate for placing the monument at thier respective country`,
    col2: ``,
    rescue: false,
    checkbox: false,
    workspace: '',
})
add_instruction({
    col1: `Send Monument to respective Country`,
    col2: `Set Country's x & y coordinates`,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value></block></xml>',
})
add_instruction({
    col1: ``,
    col2: `place monument in Country`,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field></block></next></block></xml>',
})
add_instruction({
    col1: `USA`,
    col2: ``,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field></block></next></block></next></block></next></block></xml>',
})
add_instruction({
    col1: `Australia`,
    col2: ``,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field></block></next></block></next></block></next></block></next></block></next></block></xml>',
})
add_instruction({
    col1: `UK`,
    col2: ``,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
})
add_instruction({
    col1: `Egypt`,
    col2: ``,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
})
add_instruction({
    col1: `Brazil`,
    col2: ``,
    rescue: true,
    checkbox: true,
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variable_holder" id="g)`%]AL[j7-a)qH!yFyd" x="52" y="-113"><field name="countryName">India</field><value name="NAME"><block type="xy" id="YbCA1lsnfRlHrY@!Y~HX"><field name="x_coordinate">1265</field><field name="y_coordinate">649</field></block></value><next><block type="place_block" id="0R{]X0`E`:jFi$F=Oudf"><field name="options1">tajMahal</field><field name="options2">India</field><next><block type="variable_holder" id="Aq+QaW%]IAS%ogM;e~${"><field name="countryName">UnitedStates</field><value name="NAME"><block type="xy" id="]qw~qxHc#1Ha1ABENRpm"><field name="x_coordinate">500</field><field name="y_coordinate">500</field></block></value><next><block type="place_block" id="c+i]m@ZxUSr#YLHxiQ,n"><field name="options1">statueOfLib</field><field name="options2">UnitedStates</field><next><block type="variable_holder" id="bm(rB`Dt39-ttN+YpXB/"><field name="countryName">Australia</field><value name="NAME"><block type="xy" id="U|h?hwQY9HOOI=8?r_6$"><field name="x_coordinate">1500</field><field name="y_coordinate">900</field></block></value><next><block type="place_block" id="#ZXlhG!0b%[_=b4o0~HT"><field name="options1">lotus</field><field name="options2">Australia</field><next><block type="variable_holder" id="am/zqu%njldM94K??20/"><field name="countryName">London</field><value name="NAME"><block type="xy" id="/+bNm3?wV!MN^xTNdyv["><field name="x_coordinate">900</field><field name="y_coordinate">450</field></block></value><next><block type="place_block" id="9vIJT*/`=$EnWxG}h9p]"><field name="options1">london</field><field name="options2">London</field><next><block type="variable_holder" id="*zu}*gySEp+Hw0B6T#Y="><field name="countryName">Egypt</field><value name="NAME"><block type="xy" id="aA!q):%d[#YQ)SYi?RiV"><field name="x_coordinate">1050</field><field name="y_coordinate">620</field></block></value><next><block type="place_block" id=".P=W`.:,(+!vjcCfro(V"><field name="options1">egypt</field><field name="options2">Egypt</field><next><block type="variable_holder" id="j@G6vf(#2Jzp;p1_$*Jd"><field name="countryName">Brazil</field><value name="NAME"><block type="xy" id="6IHd)bAdr(_w/8cQol5R"><field name="x_coordinate">600</field><field name="y_coordinate">800</field></block></value><next><block type="place_block" id="qN2+:UF[er)z[^zdr!Zm"><field name="options1">brazil</field><field name="options2">Brazil</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
})

export { helpCode }