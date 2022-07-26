import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

const slug = window["slug"];
let lang = window["language"]
window['rescue_btn_click_count'] = 0
window['total_rescue_btns'] = 0
const demoWorkspace = Blockly.getMainWorkspace();
let isRunBtnClicked = false;

let id0 = (demoWorkspace.getToolbox().contents_[0].id_)
let id1 = (demoWorkspace.getToolbox().contents_[1].id_)
let id2 = (demoWorkspace.getToolbox().contents_[2].id_)
let id3 = (demoWorkspace.getToolbox().contents_[3].id_)

var tour_over = false;
var playAudio = true;
let myInterval;
var audio = { paused: true };
let tour_step = 0;

let kill_audio = () => {
    if (!audio.paused) audio.pause();
};
let isPortrait = () => (screen.width <= 600 ? true : false);
var adapt_orientation_array = [];
let language = {
    guide_folder: "guide",
    language_packs_folder: "languages",
    language: "english",
    audio_folder: "audio",
    image_folder: "images",
};
let adapt_orientation = (portait, landscape) => {
    adapt_orientation_array.push([portait, landscape]);
    return isPortrait() ? portait : landscape;
};
window.addEventListener("resize", () => {
    for (let i = 0; i < tour.steps.length; i++) {
        try {
            tour.steps[i].options.attachTo.on = isPortrait() ?
                adapt_orientation_array[i][0] :
                adapt_orientation_array[i][1];
        } catch (error) {
            true;
        }
    }
});

function play_audio_tutorial(file, lang) {
    let path = `../assets/` + language.guide_folder + `/` + slug + '/' + language.language_packs_folder + `/` + lang + `/` + language.audio_folder + `/`;
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
    }
}

function image_scaler(file) {
    let path =
        `assets/` +
        language.guide_folder +
        `/` +
        language.language_packs_folder +
        `/` +
        language.language +
        `/` +
        language.image_folder +
        `/`;
    return `<img src="` + path + file + `"class="tutorial_image">`;
}

const tut = {
    //   obj: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Scroll Image here</span></p>`,
    0: `<p style="text-align: center;"><strong><span style="font-family: Helvetica; font-size: 20px;">Measure the heights of people wanting to ride on the roller coaster and allow them only if they are over 3 feet tall..</span></strong></p>`,
    1: `From the tool menu select Events`,
    101: `Choose "Open the ride" block  and drag it to the workspace<br>to open the counter`,
    2: `From the tool menu select loops`,
    201: `We will process 4 persons. Lets Select "Repeat" block and place it after Open the ride block. `,
    3: `From the tool menu select Events`,
    301: `To call the next person, select "Next person" block and place it inside the Repeat block.`,
    4: `From the tool menu select Events`,
    401: `Select the "Measure height" block and place it after the next person block,<br> to measure the height of the person on the scale.`,
    5: `From the tool menu select Events`,
    501: `Select the "Wait" block and place it after Measure height block`,
    502: `Change the value to "3" sec in the numerical block.`,
    6: `From the tool menu select Game variables`,
    601: `Choose "Set variable name" block and place it after wait block`,
    602: `From the dropdown select "height" to store the height`,
    7: `From the tool menu select Events`,
    701: `To collect the user input, select "Display Input Box" block and place it inside the Set variable name block.`,
    8: `If else, blocks is used to create condition to check if a person is allowed to ride on a roller coaster..`,
    9: `If the height of the person is greater than or equal to 3 feet, then they are allowed to ride`,
    10: `From the tool menu select Conditions`,
    1001: `Select "if else" block and place it after Set variable name block`,
    11: `From the tool menu select Conditions`,
    111: `Choose "Comparison operator" and place it inside if condition.`,
    12: `Select greater than or equal to sign (>=)`,
    13: `From the tool menu select Game variables.`,
    131: `Choose "Variable" block and place it on left side of Comparison Operator`,
    132: `From dropdown select height`,
    14: `From the tool menu select Game variables`,
    141: `Select "Numerical" block and place it on right side of Comparison operator`,
    142: `In the numerical block, change the value to "3" for 3 seconds`,
    // 14: `On the right side of the operator, insert value 3. `,
    15: `From the tool menu select Events`,
    151: `Select "Action" block and place it inside the if block`,
    152: `From the dropdown select "Allow" option,to allow the person who is 3 ft or more`,
    16: ` If the height of the person is less than 3 feet, then they are not allowed`,
    161: `In else part repeat the same steps as you did for Allow and select Block from dropdown `,
    17: `From the tool menu select Events.`,
    171: `Select "Wait" block and place it after if else block`,
    172: `In the numerical block change the value to "2" for 2 seconds`,
    18: `We only allow people with a height greater than or equal to 3 feet to enter the rollercoaster`,
    19: `Well done, you coded all the instructions, Now click on Green flag and run the code`,
};

function handPointAt(hand, element, visibility) {
    if (
        tour.steps.indexOf(tour.currentStep) - rescue_button_clicked_at_step >
        1
    ) {
        let pos = element.offset(),
            ele_oh = element.outerHeight(true),
            ele_ow = element.outerWidth(true),
            h_oh = hand.outerHeight(true),
            h_ow = hand.outerWidth(true);

        if (ele_oh > h_oh) {
            pos.top += (ele_oh - h_oh) / 2;
        } else {
            true;
        }
        if (ele_ow > h_ow) {
            pos.left += (ele_ow - h_ow) / 2;
        }
        try {
            hand.css("visibility", visibility);
        } catch { }
        try {
            hand.css("top", pos.top);
        } catch { }

        try {
            hand.css("left", pos.left);
        } catch { }
        try {
            element.on("dragstop", function (event, ui) {
                hand.css("top", pos.top);
                hand.css("left", pos.left);
            });
        } catch { }
    } else {
        $("#hand").css("visibility", "hidden");
    }
}

let rescue_colour_is_yellow = false;
let rescue_button_clicked_at_step = -2;

window['next_button_click'] = () => {
    let btns = document.querySelectorAll('.shepherd-button');
    btns[btns.length - 1].click();
}

window['back_button_click'] = () => {
    let btns = document.querySelectorAll('.shepherd-button');
    btns[btns.length - 2].click();
}

function add_next_button() {
    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' class='shepherd-custom-rescue-button-white' onclick='next_button_click();'>Next</button></div>"
}

function add_back_button() {
    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' style='right:85px;' class='shepherd-custom-rescue-button-white' onclick='back_button_click();'>Back</button></div>"
}

function add_rescue_button() {
    window['total_rescue_btns'] += 1;

    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' class='shepherd-custom-rescue-button-white' onclick='rescue_button_click();'>Rescue</button></div>"
}

window['rescue_button_click'] = () => {
    try {
        if (typeof tour.getCurrentStep().tour.currentStep.options.workspace !== "undefined") {
            window['rescue_btn_click_count'] += 1

            var xml_wkspace = tour.getCurrentStep().tour.currentStep.options.workspace;
            var xml = Blockly.Xml.textToDom(xml_wkspace);
            demoWorkspace.clear();
            Blockly.Xml.domToWorkspace(xml, demoWorkspace);

            rescue_button_clicked_at_step = tour.steps.indexOf(tour.currentStep);
        }
    } catch { }

    try {
        demoWorkspace.getAllBlocks().forEach((i) => {
            i.select();
        })
    } catch { }

}

function rescue_button_set_colour() {
    if (rescue_colour_is_yellow) {
        document.querySelectorAll("#rescue_button_id").forEach((i) => {
            i.className = "shepherd-custom-rescue-button-yellow";
        });
    } else {
        document.querySelectorAll("#rescue_button_id").forEach((i) => {
            i.className = "shepherd-custom-rescue-button-white";
        });
    }
}

function set_mute_icon() {
    if (playAudio) {
        document.querySelectorAll("#s_mute").forEach((i) => {
            i.src = i.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGlSURBVHgBnVSxUsJAEN1LgMYmhc442hxUKBSZUdAS/kC/QPgC+APwC9QviPwBfyB2THTGFKDpOAss1CKVDRPWvYs3MpiA4TV3e7v37t3u7ZmQEvzg6Mza3t8NPt/Eso9BSuRLVYxm6GE4Oxe+J7TPWLe5UK60+GGloW1EbNIgSIfNzNwT+ex/kRXK1Q4iu2aMOXpNPD/cYmjUSV6PTIt8d7xo85VkERF043zCHwoxdhsIGBGaWSeRbBVRoXTicNu2lJGdteniAV25xovHtYxco6ROaOB6AyIkgtQ02CwrY+vC8wJert4whI5hmBdaGYdUiJSo6Rz76hCGtbXVTOYzVRWpIJ4WtDlZDDYnw1Ap+n1n6GkyASlABeoL/3GgDMqVGsDwVDUnYze/GEwV6soKxRIBDuBrq6niuG0RSUvO52HYS+zNZUI68E9soVS5QmBteTMpKDFnYuR2kcFl7EGkiIgcRcQwkO0l101YgeB9OrB29l6BGffBx3So1FDjQ86kt8VOFdGcHu+L60vfxl+Qyl1oNmWfal8GUkJ9QQYKMfqp5gK+ASrop99e7Z/mAAAAAElFTkSuQmCC";
        });
    } else {
        document.querySelectorAll("#s_mute").forEach((i) => {
            i.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADfSURBVHgBpZNdEcMgEIR3qiASkIAE6qAScNBKwEHrIHFSCa2D1AES6KU5JoS5AGl2Zh8Cm2+WP2CWJt/JCnVdyKYUGMiBPDYAQy2reFIKXck2+bZJ1mNeVTPQ8liqDstqPHY2tJA1cPa5Mf8DeGzvS8/NYsOYNTEQ20jOgXkTx2N9GgiNQJs10UmmCSYBb1nbsAeWA7sjsBHyHsZlvk488EFdZ84pzAegsobvrR+d0Awo30ODgpwAKwGrcgJskkbDg5dksb4G08P3KF/sZkXQdAgGy5J7/CGD9WYr8oOsv0tEhgjHBhLnAAAAAElFTkSuQmCC";
        });
    }
}

function shepherd_mute_unmute() {
    if (playAudio) {
        kill_audio();
    }
    if (!playAudio) {
        playAudio = true;
        document.querySelectorAll("#s_mute").forEach((i) => {
            i.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGlSURBVHgBnVSxUsJAEN1LgMYmhc442hxUKBSZUdAS/kC/QPgC+APwC9QviPwBfyB2THTGFKDpOAss1CKVDRPWvYs3MpiA4TV3e7v37t3u7ZmQEvzg6Mza3t8NPt/Eso9BSuRLVYxm6GE4Oxe+J7TPWLe5UK60+GGloW1EbNIgSIfNzNwT+ex/kRXK1Q4iu2aMOXpNPD/cYmjUSV6PTIt8d7xo85VkERF043zCHwoxdhsIGBGaWSeRbBVRoXTicNu2lJGdteniAV25xovHtYxco6ROaOB6AyIkgtQ02CwrY+vC8wJert4whI5hmBdaGYdUiJSo6Rz76hCGtbXVTOYzVRWpIJ4WtDlZDDYnw1Ap+n1n6GkyASlABeoL/3GgDMqVGsDwVDUnYze/GEwV6soKxRIBDuBrq6niuG0RSUvO52HYS+zNZUI68E9soVS5QmBteTMpKDFnYuR2kcFl7EGkiIgcRcQwkO0l101YgeB9OrB29l6BGffBx3So1FDjQ86kt8VOFdGcHu+L60vfxl+Qyl1oNmWfal8GUkJ9QQYKMfqp5gK+ASrop99e7Z/mAAAAAElFTkSuQmCC";
        });
    } else {
        playAudio = false;
        document.querySelectorAll("#s_mute").forEach((i) => {
            i.src = i.src =
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADfSURBVHgBpZNdEcMgEIR3qiASkIAE6qAScNBKwEHrIHFSCa2D1AES6KU5JoS5AGl2Zh8Cm2+WP2CWJt/JCnVdyKYUGMiBPDYAQy2reFIKXck2+bZJ1mNeVTPQ8liqDstqPHY2tJA1cPa5Mf8DeGzvS8/NYsOYNTEQ20jOgXkTx2N9GgiNQJs10UmmCSYBb1nbsAeWA7sjsBHyHsZlvk488EFdZ84pzAegsobvrR+d0Awo30ODgpwAKwGrcgJskkbDg5dksb4G08P3KF/sZkXQdAgGy5J7/CGD9WYr8oOsv0tEhgjHBhLnAAAAAElFTkSuQmCC";
        });
    }
}

function change_rescue_button_colour(event) {
    if (
        event.type == Blockly.Events.BLOCK_CHANGE ||
        event.type == Blockly.Events.BLOCK_CREATE ||
        event.type == Blockly.Events.BLOCK_DELETE ||
        event.type == Blockly.Events.BLOCK_MOVE
    ) {
        rescue_colour_is_yellow = true;
        rescue_button_set_colour();
    }
}
demoWorkspace.addChangeListener(change_rescue_button_colour);

function hideHand() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $($("#" + id0)), "hidden");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($("#" + id0)), "hidden");
    }, 1500);
}

function handOnRun() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#runbtn"), "visible");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#runbtn"), "visible");
    }, 1500);
}

$(".speaker").click(function (e) {
    e.preventDefault();
    $(this).toggleClass("mute");
});

// const tour = new Shepherd.Tour({
//     keyboardNavigation: false,
//     defaultStepOptions: {
//         cancelIcon: { enabled: true },
//         classes: "class-1 class-2",
//         scrollTo: { behavior: "smooth", block: "center" },
//         when: {
//             show() {
//                 const currentStepElement = tour.getCurrentStep().el;
//                 const header = currentStepElement.querySelector(".shepherd-header");
//                 const progress = document.createElement("div");
//                 progress.innerHTML = `<img id="s_mute" onclick="shepherd_mute_unmute();" src="assets/unmute_icon.png" width="17" height="17">`;
//                 header.insertBefore(
//                     progress,
//                     currentStepElement.querySelector(".shepherd-cancel-icon")
//                 );
//                 rescue_colour_is_yellow = false;
//                 set_mute_icon();
//                 rescue_button_set_colour();
//             },
//         },
//     },
// });
// =================================================

let tour = new Shepherd.Tour({
    defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'educobot-shepherd',
        scrollTo: { behavior: 'smooth', block: 'center' }
    }
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[0] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            x1();
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 1",
    text: tut[1],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                x2();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val1();
    },
    title: "Step 2",
    text: tut[101] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val1()) {
                x3();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id2);
    },
    title: "Step 3",
    text: tut[2],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id2)) {
                t2();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val2();
    },
    title: "Step 3.1",
    text: tut[201] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val2()) {
                x4();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 4",
    text: tut[3],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                t3();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val3();
    },
    title: "Step 4.1",
    text: tut[301] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val3()) {
                x5();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 5",
    text: tut[4],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                t4();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val4();
    },
    title: "Step 5.1",
    text: tut[401] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val4()) {
                x6();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 6",
    text: tut[5],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                t5();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val5();
    },
    title: "Step 6.1",
    text: tut[501] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val5()) {
                x7();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">1</field></block></value></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return val6();
    },
    title: "Step 6.2",
    text: tut[502] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val6()) {
                x8();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id0);
    },
    title: "Step 7",
    text: tut[6],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id0)) {
                t6();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val7();
    },
    title: "Step 7.1",
    text: tut[601] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val7()) {
                x9();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="Q{P|4WXNd@Mz+c$d8^dP"><field name="Variable name">dummy</field></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return val8();
    },
    title: "Step 7.2",
    text: tut[602] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val8()) {
                x10();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="Q{P|4WXNd@Mz+c$d8^dP"><field name="Variable name">height</field></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 8",
    text: tut[7],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                t7();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val9();
    },
    title: "Step 8.1",
    text: tut[701] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val9()) {
                x11();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="Q{P|4WXNd@Mz+c$d8^dP"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="hT]Ft7Q*JWs;]?-0uKCX"></block></value></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[8] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            x12();
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[9] + add_back_button() + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            x13_1();
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            x13_2();
            return this.next();
        },
        text: "Next",
    },
    ],
    id: "creating",
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id3);
    },
    title: "Step 9",
    text: tut[10],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id3)) {
                t8();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val10();
    },
    title: "Step 9.1",
    text: tut[1001] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val10()) {
                x14();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="Q{P|4WXNd@Mz+c$d8^dP"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="hT]Ft7Q*JWs;]?-0uKCX"></block></value><next><block type="controls_if" id="yKb2m+*l.(Gzv{!#M0mr"><mutation else="1"></mutation></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id3);
    },
    title: "Step 10",
    text: tut[11],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id3)) {
                t9();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val11();
    },
    title: "Step 10.1",
    text: tut[111] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val11()) {
                x15();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="Q{P|4WXNd@Mz+c$d8^dP"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="hT]Ft7Q*JWs;]?-0uKCX"></block></value><next><block type="controls_if" id="yKb2m+*l.(Gzv{!#M0mr"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="KKaVcK(J]Y9,vaYzM(2+"><field name="OP">EQ</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return val12();
    },
    title: "Step 11",
    text: tut[12] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val12()) {
                x16();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="kN2O|[Y+i-t]=NgkY,]P" x="135" y="153"><next><block type="controls_repeat_ext" id="Mb*:^B(,[SMuY~+K]fPD"><value name="TIMES"><block type="math_number" id="nq:miq|Pptp_#kW}LusF"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="Zgt[8VG^n4ib@{xkEuHE"><next><block type="height_block" id="NT|-6OTbm?Prj_;#z?=K"><next><block type="wait_block" id="y]cFsj[VT%c8OT:m+uBX"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="!`N;^dWM!1ZM`O8o$zC{"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="Q{P|4WXNd@Mz+c$d8^dP"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="hT]Ft7Q*JWs;]?-0uKCX"></block></value><next><block type="controls_if" id="yKb2m+*l.(Gzv{!#M0mr"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="KKaVcK(J]Y9,vaYzM(2+"><field name="OP">GTE</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id0);
    },
    title: "Step 12",
    text: tut[13],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id0)) {
                t10();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val13();
    },
    title: "Step 12.1",
    text: tut[131] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val13()) {
                x17();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="q%2MeNrN5W$UFmY1s.uA" x="107" y="87"><next><block type="controls_repeat_ext" id="uK%JrI=%uoijLYzxcZNc"><value name="TIMES"><block type="math_number" id=".bz**c`*@imGdD2H=Sbz"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="D3?I||%qV@go2X:0t8d}"><next><block type="height_block" id="|JiKx_}BU`o?6FjW@3LH"><next><block type="wait_block" id="dL#zB|I!VLc2kjnr@u-_"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="akCA31X@wbV1?xSoA#OX"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="C45QAdveeZ,6tLQtY{i8"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="~`$R_]56I7)9%WF#TaF7"></block></value><next><block type="controls_if" id="uq2uHG%[UQqoWKM@]FRK"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id=";PH{{*PiJPd/0Md8}6(a"><field name="OP">GTE</field><value name="A"><block type="variables" id=",L4Ou,cqBAbeb[|Y9U9M"><field name="Options">dummy</field></block></value></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return val13_1();
    },
    title: "Step 12.2",
    text: tut[132] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val13_1()) {
                x18();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="q%2MeNrN5W$UFmY1s.uA" x="107" y="87"><next><block type="controls_repeat_ext" id="uK%JrI=%uoijLYzxcZNc"><value name="TIMES"><block type="math_number" id=".bz**c`*@imGdD2H=Sbz"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="D3?I||%qV@go2X:0t8d}"><next><block type="height_block" id="|JiKx_}BU`o?6FjW@3LH"><next><block type="wait_block" id="dL#zB|I!VLc2kjnr@u-_"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="akCA31X@wbV1?xSoA#OX"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="C45QAdveeZ,6tLQtY{i8"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="~`$R_]56I7)9%WF#TaF7"></block></value><next><block type="controls_if" id="uq2uHG%[UQqoWKM@]FRK"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id=";PH{{*PiJPd/0Md8}6(a"><field name="OP">GTE</field><value name="A"><block type="variables" id=",L4Ou,cqBAbeb[|Y9U9M"><field name="Options">height</field></block></value></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id0);
    },
    title: "Step 13",
    text: tut[14],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id0)) {
                t13();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return step_13_1_val();
    },
    title: "Step 13.1",
    text: tut[141] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (step_13_1_val()) {
                x19();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="MgRk:b4K:LF9:{g_0gqS" x="58" y="13"><next><block type="controls_repeat_ext" id="zOF_YO^|_f7~7Wm2dN:a"><value name="TIMES"><block type="math_number" id="_TeP6?it4}A2G(N{1IM("><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="A9NVl-Wa{BBiAlGRo-{^"><next><block type="height_block" id="HrJenN2ei_x4HSN%.~ZK"><next><block type="wait_block" id="cf.gkI2awA%/_!}ZtEOE"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="wFW}Sg|TK9t/^qu.$u2J"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="JFv60$~!xVv~}92.91wB"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="tI$c(Dq4,%rW.73mPh)i"></block></value><next><block type="controls_if" id="~b1z(LnV;A5rMzY^OB[F"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="K;EsT_InIKKi5A9h@-/Q"><field name="OP">GTE</field><value name="A"><block type="variables" id="p2U,j#1B9kgq5u[7x%!T"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="LLY7|HHbUAu#+M*rDGBv"><field name="NUM">1</field></block></value></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return step_13_2_val();
    },
    title: "Step 13.2",
    text: tut[142] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (step_13_2_val()) {
                x20();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="MgRk:b4K:LF9:{g_0gqS" x="58" y="13"><next><block type="controls_repeat_ext" id="zOF_YO^|_f7~7Wm2dN:a"><value name="TIMES"><block type="math_number" id="_TeP6?it4}A2G(N{1IM("><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="A9NVl-Wa{BBiAlGRo-{^"><next><block type="height_block" id="HrJenN2ei_x4HSN%.~ZK"><next><block type="wait_block" id="cf.gkI2awA%/_!}ZtEOE"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="wFW}Sg|TK9t/^qu.$u2J"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="JFv60$~!xVv~}92.91wB"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="tI$c(Dq4,%rW.73mPh)i"></block></value><next><block type="controls_if" id="~b1z(LnV;A5rMzY^OB[F"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="K;EsT_InIKKi5A9h@-/Q"><field name="OP">GTE</field><value name="A"><block type="variables" id="p2U,j#1B9kgq5u[7x%!T"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="LLY7|HHbUAu#+M*rDGBv"><field name="NUM">3</field></block></value></block></value></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 14",
    text: tut[15],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                t11();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val15();
    },
    title: "Step 14.1",
    text: tut[151] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val15()) {
                x21();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="MgRk:b4K:LF9:{g_0gqS" x="58" y="13"><next><block type="controls_repeat_ext" id="zOF_YO^|_f7~7Wm2dN:a"><value name="TIMES"><block type="math_number" id="_TeP6?it4}A2G(N{1IM("><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="A9NVl-Wa{BBiAlGRo-{^"><next><block type="height_block" id="HrJenN2ei_x4HSN%.~ZK"><next><block type="wait_block" id="cf.gkI2awA%/_!}ZtEOE"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="wFW}Sg|TK9t/^qu.$u2J"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="JFv60$~!xVv~}92.91wB"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="tI$c(Dq4,%rW.73mPh)i"></block></value><next><block type="controls_if" id="~b1z(LnV;A5rMzY^OB[F"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="K;EsT_InIKKi5A9h@-/Q"><field name="OP">GTE</field><value name="A"><block type="variables" id="p2U,j#1B9kgq5u[7x%!T"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="LLY7|HHbUAu#+M*rDGBv"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id="4rzk|s|rq{A3oq%wN$s#"><field name="NAME">default</field></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return val16();
    },
    title: "Step 14.2",
    text: tut[152] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val16()) {
                x22();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="/,yKEXBPL?eYqS/JlvH5" x="57" y="87"><next><block type="controls_repeat_ext" id="~teGK1)oQE4Rf]6^qI/u"><value name="TIMES"><block type="math_number" id="#aN,?^IfjgU[5#XZ*-B5"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="0Z=V0Zl:]^:K5{@$PA%_"><next><block type="height_block" id="bbjIX=m,|bBwYyEfSr2D"><next><block type="wait_block" id="Z3*y}Uk-g;-=)3H1Pg?W"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="0_ck}pjl4,Hc]^~.vmjD"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="c!oGxP@B=_S{LXr-6:HD"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="d~a\`.ikaTF.N@DtaFD^^"></block></value><next><block type="controls_if" id="gy6\`.,2{8M*t++YQFI[Q"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Td,^z7:[ujAxY0Amnouu"><field name="OP">GTE</field><value name="A"><block type="variables" id="j#Sn62$ftL#_eW.z-;jY"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="7EHAgx|o%fNb+3jy9@*a"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id=":UJlFQUYJ5Z;;P{M6f]N"><field name="NAME">op1</field></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>`,
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[16] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            x23();
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val17();
    },
    title: "Step 15",
    text: tut[161] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val17()) {
                x24();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="/,yKEXBPL?eYqS/JlvH5" x="57" y="87"><next><block type="controls_repeat_ext" id="~teGK1)oQE4Rf]6^qI/u"><value name="TIMES"><block type="math_number" id="#aN,?^IfjgU[5#XZ*-B5"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="0Z=V0Zl:]^:K5{@$PA%_"><next><block type="height_block" id="bbjIX=m,|bBwYyEfSr2D"><next><block type="wait_block" id="Z3*y}Uk-g;-=)3H1Pg?W"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="0_ck}pjl4,Hc]^~.vmjD"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="c!oGxP@B=_S{LXr-6:HD"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="d~a\`.ikaTF.N@DtaFD^^"></block></value><next><block type="controls_if" id="gy6\`.,2{8M*t++YQFI[Q"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Td,^z7:[ujAxY0Amnouu"><field name="OP">GTE</field><value name="A"><block type="variables" id="j#Sn62$ftL#_eW.z-;jY"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="7EHAgx|o%fNb+3jy9@*a"><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id=":UJlFQUYJ5Z;;P{M6f]N"><field name="NAME">op1</field></block></statement><statement name="ELSE"><block type="multiaction_block" id="fV)-j~xp^Y}V~;jRa/XV"><field name="NAME">op2</field></block></statement></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>`,
});

tour.addStep({
    eval() {
        return check_toolbox_selection(id1);
    },
    title: "Step 16",
    text: tut[17],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (check_toolbox_selection(id1)) {
                t12();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return val18();
    },
    title: "Step 16.1",
    text: tut[171] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val18()) {
                x25();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="*Z|lx(6DJN~(m8zirO-u" x="58" y="60"><next><block type="controls_repeat_ext" id="g#uAf-a7IwwSEjbUiHjs"><value name="TIMES"><block type="math_number" id="[+}s#ajz+K590J/LHQ~r"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="_Iml9%${/;.szLHo/MIt"><next><block type="height_block" id="DwlSSu(|(=B*AA[)g[h|"><next><block type="wait_block" id="!l:NQ/@:EL^.L}$TH;iT"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="%qMxNBhKguV]#suKHwLB"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="TC.r[bFai`@jcd;hwruV"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="gOoL|G(ab!wjI^e=|26="></block></value><next><block type="controls_if" id="@SJ7hCSp@zxTv/62IhU3"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="R[W2J8^I2UoRb/O}MtOY"><field name="OP">GTE</field><value name="A"><block type="variables" id="Ap=V4hnjMb?C@7Nduva*"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="nV(iRAQfBrr.hZlxH?V("><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id="`86*5[FvkU%ii%/y=.+B"><field name="NAME">op1</field></block></statement><statement name="ELSE"><block type="multiaction_block" id="(.uoB.wT8rq:(tEq.yz6"><field name="NAME">op2</field></block></statement><next><block type="wait_block" id="6X%cM~U%3^saRexLc9tm"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="3CA_rM*3CblQ2`iMjYe%"><field name="NUM">1</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return val18_1();
    },
    title: "Step 16.2",
    text: tut[172] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val18_1()) {
                x26();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="open_ride_block" id="*Z|lx(6DJN~(m8zirO-u" x="58" y="60"><next><block type="controls_repeat_ext" id="g#uAf-a7IwwSEjbUiHjs"><value name="TIMES"><block type="math_number" id="[+}s#ajz+K590J/LHQ~r"><field name="NUM">4</field></block></value><statement name="DO"><block type="next_person_block" id="_Iml9%${/;.szLHo/MIt"><next><block type="height_block" id="DwlSSu(|(=B*AA[)g[h|"><next><block type="wait_block" id="!l:NQ/@:EL^.L}$TH;iT"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="%qMxNBhKguV]#suKHwLB"><field name="NUM">3</field></block></value><next><block type="set_variable_holder" id="TC.r[bFai`@jcd;hwruV"><field name="Variable name">height</field><value name="NAME"><block type="display_input_block" id="gOoL|G(ab!wjI^e=|26="></block></value><next><block type="controls_if" id="@SJ7hCSp@zxTv/62IhU3"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="R[W2J8^I2UoRb/O}MtOY"><field name="OP">GTE</field><value name="A"><block type="variables" id="Ap=V4hnjMb?C@7Nduva*"><field name="Options">height</field></block></value><value name="B"><block type="math_number" id="nV(iRAQfBrr.hZlxH?V("><field name="NUM">3</field></block></value></block></value><statement name="DO0"><block type="multiaction_block" id="`86*5[FvkU%ii%/y=.+B"><field name="NAME">op1</field></block></statement><statement name="ELSE"><block type="multiaction_block" id="(.uoB.wT8rq:(tEq.yz6"><field name="NAME">op2</field></block></statement><next><block type="wait_block" id="6X%cM~U%3^saRexLc9tm"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="3CA_rM*3CblQ2`iMjYe%"><field name="NUM">2</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[18] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            x27();
            isRunBtnClicked = false;
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

tour.addStep({
    eval() {
        return isRunBtnClicked;
    },
    title: "Run and see what happens",
    text: tut[19],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

function x1() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id1), "visible");
    play_audio_tutorial("tut[1].mp3", lang);
}


function x2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[101].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $("#blocklyDiv"), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x3() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id2), "visible");
    play_audio_tutorial("tut[2].mp3", lang);
}

function t2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[201].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}

function x4() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id1), "visible");
    play_audio_tutorial("tut[3].mp3", lang);
}

function t3() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[301].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[6]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[6]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
            krr = !krr;
        }
    }, 1500);
}

function x5() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id1), "visible");
    play_audio_tutorial("tut[4].mp3", lang);
}

function t4() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[401].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[8]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[8]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[3]), "visible");
            krr = !krr;
        }
    }, 1500);
}


function x6() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id1), "visible");
    play_audio_tutorial("tut[5].mp3", lang);
}


function t5() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[501].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[4]), "visible");
            krr = !krr;
        }
    }, 1500);
}


function x7() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyPath")[6]), "visible");
    }, 100);
    play_audio_tutorial("tut[502].mp3", lang);
}



function x8() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $("#" + id0), "visible");
    }, 100);
    play_audio_tutorial("tut[6].mp3", lang);
}


function t6() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[601].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[7]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[7]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x9() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyFieldRect")[0]), "visible");
    }, 100);
    play_audio_tutorial("tut[602].mp3", lang);
}


function x10() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $("#" + id1), "visible");
    }, 100);
    play_audio_tutorial("tut[7].mp3", lang);
}

function t7() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[701].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[10]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[10]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}




function x11() {
    clearInterval(myInterval);
    hideHand();
    play_audio_tutorial("tut[8].mp3", lang);
}


function x12() {
    play_audio_tutorial("tut[9].mp3", lang);
}



function x13_1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[8].mp3", lang);
}

function x13_2() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id3), "visible");
    play_audio_tutorial("tut[10].mp3", lang);
}



function t8() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[1001].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[9]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[9]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[7]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x14() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id3), "visible");
    play_audio_tutorial("tut[11].mp3", lang);
}



function t9() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[111].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[11]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[11]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x15() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDropdownRect")[1]), "visible");
    }, 100);
    play_audio_tutorial("tut[12].mp3", lang);
}


function x16() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id0), "visible");
    play_audio_tutorial("tut[13].mp3", lang);
}



function t10() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[131].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[12]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[12]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x17() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDropdownRect")[2]), "visible");
    }, 100);
    play_audio_tutorial("tut[132].mp3", lang);
}


function x18() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id0), "visible");
    play_audio_tutorial("tut[14].mp3", lang);
}



function t13() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[141].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[14]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[14]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x19() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyPath")[12]), "visible");
    }, 100);
    play_audio_tutorial("tut[142].mp3", lang);
}

function x20() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id1), "visible");
    play_audio_tutorial("tut[15].mp3", lang);
}


function t11() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[151].mp3", lang);

    handPointAt($("#hand"), $($(".blocklyDraggable")[19]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[19]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[9]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x21() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyFieldRect")[3]), "visible");
    }, 100);
    play_audio_tutorial("tut[152].mp3", lang);
}


function x22() {
    clearInterval(myInterval);
    hideHand();
    play_audio_tutorial("tut[16].mp3", lang);
}

function x23() {
    play_audio_tutorial("tut[161].mp3", lang);
}



function x24() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#" + id1), "visible");
    play_audio_tutorial("tut[17].mp3", lang);
}


function t12() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[171].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[15]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[15]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[9]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function x25() {
    clearInterval(myInterval);
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyPath")[16]), "visible");
    }, 100);
    play_audio_tutorial("tut[172].mp3", lang);
}


function x26() {
    clearInterval(myInterval);
    hideHand();
    play_audio_tutorial("tut[18].mp3", lang);
}


function x27() {
    handOnRun();
    play_audio_tutorial("tut[19].mp3", lang);
}



// ===================================================================
// Validation
// ===================================================================

function val1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "open_ride()\n") {
        return true;
    } else return false;
}

function val2() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "open_ride()\nfor count in range(4):\n  pass\n") {
        return true;
    } else return false;
}

function val3() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "open_ride()\nfor count in range(4):\n  next_person()\n") {
        return true;
    } else return false;
}

function val4() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n"
    ) {
        return true;
    } else return false;
}

function val5() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(1)\n"
    ) {
        return true;
    } else return false;
}

function val6() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n"
    ) {
        return true;
    } else return false;
}

function val7() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  dummy=\n"
    ) {
        return true;
    } else return false;
}

function val8() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=\n"
    ) {
        return true;
    } else return false;
}

function val9() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        `open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n`
    ) {
        return true;
    } else return false;
}

function val10() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        `open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if False:\n    pass\n  else:\n    pass\n`
    ) {
        return true;
    } else return false;
}

function val11() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        `open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if 0 == 0:\n    pass\n  else:\n    pass\n`
    ) {
        return true;
    } else return false;
}

function val12() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        `open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if 0 >= 0:\n    pass\n  else:\n    pass\n`
    ) {
        return true;
    } else return false;
}

function val13() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if Variables >= 0:\n    pass\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}

function val13_1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 0:\n    pass\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}

function step_13_1_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 1:\n    pass\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}

function step_13_2_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 3:\n    pass\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}

function val15() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 3:\n    Action\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}

function val16() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        `open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 3:\n    allow()\n  else:\n    pass\n`
    ) {
        return true;
    } else return false;
}

function val17() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        `open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 3:\n    allow()\n  else:\n    dont_allow()\n`
    ) {
        return true;
    } else return false;
}

function val18() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 3:\n    allow()\n  else:\n    dont_allow()\n  time.sleep(1)\n'
    ) {
        return true;
    } else return false;
}

function val18_1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        'open_ride()\nfor count in range(4):\n  next_person()\n  measure_height_animation()\n  time.sleep(3)\n  height=get_float_input_from_user("Enter Height in ft: ")\n  if height >= 3:\n    allow()\n  else:\n    dont_allow()\n  time.sleep(2)\n'
    ) {
        return true;
    } else return false;
}

// ========================================================
function check_toolbox_selection(id) {
    try {
        if (demoWorkspace.getToolbox().selectedItem_.id_ === id) return true;
        else return false;
    } catch {
        return false;
    }
}

["close", "cancel", "complete", "start", "show"].forEach((event) =>
    tour.on(event, () => {
        tour_step = tour.steps.indexOf(tour.currentStep);
    })
);

["complete"].forEach((event) =>
    tour.on(event, () => {
        tour_step = 0;
    })
);

["close", "cancel", "complete"].forEach((event) =>
    tour.on(event, () => {
        clearInterval(myInterval);
        $("#hand").css("visibility", "hidden");
    })
);

tour.start();
//NGS Sound Enhancement
document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
function setAudioPreference() {
    if (playAudio) {
        kill_audio();
    }
    if (!(playAudio)) {
        playAudio = true;
        document.getElementById('soundImg').src = "../assets/sound_icon.png";
    } else {
        playAudio = false;
        document.getElementById('soundImg').src = "../assets/sound_unmute.png";
    }
}

function say_congrats() {
    var a = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: !0 },
            classes: "class-1 class-2",
            scrollTo: { behavior: "smooth", block: "center" },
        },
    });
    a.addStep({
        title: "Congratulations!",
        text: "Well Done!",
        arrow: false,
        attachTo: { element: "#body", on: "auto" },
        buttons: [{
            action: function () {
                return this.next();
            },
            text: "Finish",
        },],
        id: "creating",
    });
    a.start();
}

setInterval(function () {

    try {
        $(".shepherd-content").draggable({
            containment: "body"
        })
        $(".shepherd-text").resizable();
        if (tour.getCurrentStep().options.eval()) {
            let btns = document.querySelectorAll('.shepherd-button');
            btns[btns.length - 1].click();
        }
    } catch { }
}, 100);

document.getElementById('runbtn').addEventListener("click", function () { isRunBtnClicked = true; });