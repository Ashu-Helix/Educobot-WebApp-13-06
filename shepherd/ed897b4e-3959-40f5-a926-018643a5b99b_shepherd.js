import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

const slug = window["slug"];
let lang = window["language"]
window['rescue_btn_click_count'] = 0
window['total_rescue_btns'] = 0
const demoWorkspace = Blockly.getMainWorkspace();
let isRunBtnClicked = false;


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
            tour.steps[i].options.attachTo.on = isPortrait()
                ? adapt_orientation_array[i][0]
                : adapt_orientation_array[i][1];
        } catch (error) {
            true;
        }
    }
});

function play_audio_tutorial(file) {
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
    100: "<h5>Doctor should check the temperature of the patients and prescribe medicine if needed</h5>",
    1: "From the tool menu select Loops",
    2: 'Now select the "Repeat" block and drag it to the workspace. Note that the repeat value is 3 times',
    101: "Create a variable to store the body temperature of the patient.",
    3: "From the tool menu select Game Variables ",
    4: 'Select "set variable" block and place it inside the repeat block statements',
    5: 'From the dropdown, select "patient_temperature" to store the temperature of the patient',
    6: "From the tool menu Select Doctor actions",
    7: 'Select the "Get next patient\'s temperature" block and place it inside the "patient_temperature" block',
    102: "Now let's check if the patient has a fever",
    8: "From the tool menu select Conditions",
    9: 'Select the "If" block and place it under the variable to check if the patient has a fever or not',
    10: "From the tool menu select Conditions",
    11: 'Select "Operator" block and place it inside the If block condition',
    103: "If the body temperature is greater than or equal to 39, the patient needs medicine",
    12: "Change the operator to Greater than equal to",
    13: "From the tool menu select Game variables",
    14: 'Select the "Variables" block and place it inside the operator block, on the left side',
    15: 'From the dropdown menu, select "patient_temperature" ',
    16: 'Get a value block from variables section and set its value to "39" ',
    17: "From the tool menu select Doctor actions",
    18: 'Scroll to the right in the opened tool menu until say block is visible. Select "Say" block and Place it inside the If block',
    104: "If a patient has a fever, a doctor will prescribe medication.",
    19: 'Write message in say block "Please take these medicines" ',
    20: "From the tool menu select Doctor actions",
    21: 'Select the "Treat patient - Give medicine" block and place it after say block',
    105: "If the body temperature is less than 39, which means no fever, no medicine is required. ",
    22: "From the tool menu select Doctor actions",
    23: 'Select "Say" block and place it inside the Else part',
    24: 'Write message in say block "You don\'t have fever" ',
    25: "From the tool menu select Doctor actions",
    26: 'Select "Patients needs no treatment" block and place it below say block',
    106: "there needs to be a wait period of 3 seconds for next patient",
    27: "From the tool menu select Doctor actions",
    28: 'Select "Wait" block and place it after If Else block',
    29: "From the tool menu select Doctor actions",
    30: 'Select "Say" block and place it after Wait block',
    31: 'Write message in say block "Next patient please" ',
    107: 'When no patient is left, say "All patients have been consulted today"',
    32: "From the tool menu select Doctor actions",
    33: 'Select "Say" block and place it after repeat block',
    34: 'Write message in say block "All patients have been consulted today" ',
    35: "Great you have created all the block <br> Now click on Green Falg to run the code !",
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

let flasher = true;
// let rescue_button_html = "<button type='button' id='rescue_button_id' class='shepherd-custom-rescue-sutton-white' onclick='rescue_button_click();' disabled>Rescue</button>"
let inter_rescue = setInterval(() => {
    try {
        if (flasher) {
            document.querySelectorAll("#rescue_div")[0].style.color = "white";
        } else {
            document.querySelectorAll("#rescue_div")[0].style.color = "black";
        }
        flasher = !flasher;
    } catch { }

}, 750)
function add_rescue_button() {
    window['total_rescue_btns'] += 1;

    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' class='shepherd-custom-rescue-button-white' onclick='confirm_rescue();'>Rescue</button></div>"
}
function add_rescue_confirm_button() {
    return "<div class='row'><button class='shepherd-custom-next-sutton' onclick='rescue_button_click();'>Rescue</button></div>"
}

function add_rescue_close_button() {
    return "<div class='row'><button class='shepherd-custom-back-sutton' onclick='tour1.complete();'>close</button></div>"
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
function play_audio_rescue_warning() {
    let file = "";
    let path = `/assets/sounds/rescue_warning.mp3`;
    kill_audio();
    // if (playAudio) {
    audio = new Audio(path + file);
    audio.play();
    // }
}
const tour1 = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: true }, classes: 'educobot-shepherd', scrollTo: { behavior: 'smooth', block: 'center' } } });
window['confirm_rescue'] = () => {
    play_audio_rescue_warning();

    window['tour1'] = tour1;
    window['tour1'].addStep({
        title: 'Alert!',
        text: `<div id="rescue_div">Using the rescue feature costs you points</div>` + add_rescue_close_button() + add_rescue_confirm_button(),
        arrow: false,
        attachTo: { element: '#sprite-container', on: 'left' },
        buttons: [{
            action() { return this.next(); },
            text: 'Close'
        }, {
            action() {
                rescue_button_click();
                return this.next();
            },
            text: 'Rescue'
        }],
        id: 'creating'
    });
    tour1.start();
}
window['shepherd_mute_unmute'] = () => {
    if (playAudio) {
        kill_audio();
    }
    if (!(playAudio)) {
        playAudio = true;
        document.querySelectorAll("#s_mute").forEach((i) => { i.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGlSURBVHgBnVSxUsJAEN1LgMYmhc442hxUKBSZUdAS/kC/QPgC+APwC9QviPwBfyB2THTGFKDpOAss1CKVDRPWvYs3MpiA4TV3e7v37t3u7ZmQEvzg6Mza3t8NPt/Eso9BSuRLVYxm6GE4Oxe+J7TPWLe5UK60+GGloW1EbNIgSIfNzNwT+ex/kRXK1Q4iu2aMOXpNPD/cYmjUSV6PTIt8d7xo85VkERF043zCHwoxdhsIGBGaWSeRbBVRoXTicNu2lJGdteniAV25xovHtYxco6ROaOB6AyIkgtQ02CwrY+vC8wJert4whI5hmBdaGYdUiJSo6Rz76hCGtbXVTOYzVRWpIJ4WtDlZDDYnw1Ap+n1n6GkyASlABeoL/3GgDMqVGsDwVDUnYze/GEwV6soKxRIBDuBrq6niuG0RSUvO52HYS+zNZUI68E9soVS5QmBteTMpKDFnYuR2kcFl7EGkiIgcRcQwkO0l101YgeB9OrB29l6BGffBx3So1FDjQ86kt8VOFdGcHu+L60vfxl+Qyl1oNmWfal8GUkJ9QQYKMfqp5gK+ASrop99e7Z/mAAAAAElFTkSuQmCC"; })
    } else {
        playAudio = false;
        document.querySelectorAll("#s_mute").forEach((i) => { i.src = i.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADfSURBVHgBpZNdEcMgEIR3qiASkIAE6qAScNBKwEHrIHFSCa2D1AES6KU5JoS5AGl2Zh8Cm2+WP2CWJt/JCnVdyKYUGMiBPDYAQy2reFIKXck2+bZJ1mNeVTPQ8liqDstqPHY2tJA1cPa5Mf8DeGzvS8/NYsOYNTEQ20jOgXkTx2N9GgiNQJs10UmmCSYBb1nbsAeWA7sjsBHyHsZlvk488EFdZ84pzAegsobvrR+d0Awo30ODgpwAKwGrcgJskkbDg5dksb4G08P3KF/sZkXQdAgGy5J7/CGD9WYr8oOsv0tEhgjHBhLnAAAAAElFTkSuQmCC"; })
    }
}

// function rescue_button_set_colour() {
//     if (rescue_colour_is_yellow) {
//         document.querySelectorAll("#rescue_button_id").forEach((i) => {
//             i.className = "shepherd-custom-rescue-sutton-yellow";
//         });
//     } else {
//         document.querySelectorAll("#rescue_button_id").forEach((i) => {
//             i.className = "shepherd-custom-rescue-sutton-white";
//         });
//     }
// }

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

// function change_rescue_button_colour(event) {
//     if (
//         event.type == Blockly.Events.BLOCK_CHANGE ||
//         event.type == Blockly.Events.BLOCK_CREATE ||
//         event.type == Blockly.Events.BLOCK_DELETE ||
//         event.type == Blockly.Events.BLOCK_MOVE
//     ) {
//         rescue_colour_is_yellow = true;
//         rescue_button_set_colour();
//     }
// }
// demoWorkspace.addChangeListener(change_rescue_button_colour);

function hideHand() {
    clearInterval(myInterval);
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), "hidden");
    // handPointAt($("#hand"), $($("#blockly-0")), "hidden");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#" + id), "hidden");
        // handPointAt($("#hand"), $($("#blockly-0")), "hidden");
    }, 1500);
}

function handOnRun() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $($("runbtn")), "visible");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($("runbtn")), "visible");
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

let tour = new Shepherd.Tour({
    defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'educobot-shepherd',
        scrollTo: { behavior: 'smooth', block: 'center' }
    }
});

// ===================================================================
// Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Title",
    text: tut[100] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                i1();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function i0() {
    clearInterval(myInterval);
    // play_audio_tutorial("tut[0].mp3");
}
function i1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[1].mp3");
    let id = (demoWorkspace.getToolbox().contents_[3].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-3"), "visible");
}
// step 1
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[3].id_)
        return check_toolbox_selection(id)
    },
    title: "Step 1",
    text: tut[1],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[3].id_)
                if (check_toolbox_selection(id)) {
                    t1();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[2].mp3");
    handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $("#blocklyDiv"), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 2
tour.addStep({
    eval() {
        return step2_val();
    },
    title: "Step 2",
    text: tut[2] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step2_val()) {
                    t2();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="QN~L*rbQW?9|=nS~Xlj6" x="19" y="111"><value name="TIMES"><block type="math_number" id=";F?AqA~r9x{5FO0~hHyZ"><field name="NUM">3</field></block></value></block></xml>',
});
function t2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[101].mp3");
    hideHand();
}
// Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[101] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                t3();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t3() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[3].mp3");
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-0"), "visible");
}
// step 3
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        return check_toolbox_selection(id)
    },
    title: "Step 3",
    text: tut[3],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    t4();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t4() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[4].mp3");
    handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 4
tour.addStep({
    eval() {
        return step4_val();
    },
    title: "Step 4",
    text: tut[4] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step4_val) {
                    t5();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">default_</field></block></statement></block></xml>',
});
function t5() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[5].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDropdownRect")[0]), "visible");
    }, 100);
}
// step 5
tour.addStep({
    eval() {
        return step5_val();
    },
    title: "Step 5",
    text: tut[5] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step5_val()) {
                    t6();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field></block></statement></block></xml>',
});
function t6() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[6].mp3");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
}
// step 6
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 6",
    text: tut[6],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t7();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t7() {
    play_audio_tutorial("tut[7].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[3]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[3]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 7
tour.addStep({
    eval() {
        return step7_val();
    },
    title: "Step 7",
    text: tut[7] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step7_val()) {
                    t8();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value></block></statement></block></xml>',
});
function t8() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[102].mp3");
    hideHand();
}
// information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[102] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                t9();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t9() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[8].mp3");
    let id = (demoWorkspace.getToolbox().contents_[2].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-2"), "visible");
}
// step 8
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[2].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 8",
    text: tut[8],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[2].id_)
                if (check_toolbox_selection(id)) {
                    t10();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t10() {
    play_audio_tutorial("tut[9].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[4]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[4]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 9
tour.addStep({
    eval() {
        return step9_val();
    },
    title: "Step 9",
    text: tut[9] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step9_val()) {
                    t11();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation></block></next></block></statement></block></xml>',
});
function t11() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[10].mp3");
    let id = (demoWorkspace.getToolbox().contents_[2].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-2"), "visible");
}
// step 10
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[2].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 10",
    text: tut[10],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[2].id_)
                if (check_toolbox_selection(id)) {
                    t12();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t12() {
    play_audio_tutorial("tut[11].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[6]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[6]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 11
tour.addStep({
    eval() {
        return step11_val();
    },
    title: "Step 11",
    text: tut[11] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step11_val()) {
                    t13();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">EQ</field></block></value></block></next></block></statement></block></xml>',
});
function t13() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[103].mp3");
    hideHand();
}
// Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[103] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                t14();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t14() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[12].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDropdownRect")[1]), "visible");
    }, 100);
}
// step 12
tour.addStep({
    eval() {
        return step12_val();
    },
    title: "Step 12",
    text: tut[12] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step12_val()) {
                    t15();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field></block></value></block></next></block></statement></block></xml>',
});
function t15() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[13].mp3");
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-0"), "visible");
}
// step 13
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 13",
    text: tut[13],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    t16();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t16() {
    play_audio_tutorial("tut[14].mp3");
    clearInterval(myInterval);
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
// step 14
tour.addStep({
    eval() {
        return step14_val();
    },
    title: "Step 14",
    text: tut[14] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step14_val()) {
                    t17();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field><value name="A"><block type="variables" id="zLi`JnxaMMp1qZVC6mZg"><field name="Options">default_</field></block></value></block></value></block></next></block></statement></block></xml>',
});
function t17() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[15].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDraggable")[6]), "visible");
    }, 100);
}
// step 15
tour.addStep({
    eval() {
        return step15_val();
    },
    title: "Step 15",
    text: tut[15] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step15_val()) {
                    t18();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field><value name="A"><block type="variables" id="zLi`JnxaMMp1qZVC6mZg"><field name="Options">patient_temperature</field></block></value></block></value></block></next></block></statement></block></xml>',
});
function t18() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[16].mp3");
    // myInterval = setInterval(() => {
    //   handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
    // }, 100);
    hideHand();
}
// step 16
tour.addStep({
    eval() {
        return step16_val();
    },
    title: "Step 16",
    text: tut[16] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step16_val()) {
                    t19();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="-17" y="143"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field><value name="A"><block type="variables" id="zLi`JnxaMMp1qZVC6mZg"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="WY*%!/A?q*w~`WimVq^."><field name="NUM">39</field></block></value></block></value></block></next></block></statement></block></xml>',
});
function t19() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[17].mp3");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
}
// step 17
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 17",
    text: tut[17],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t20();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t20() {
    play_audio_tutorial("tut[18].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[11]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[11]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[4]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 18
tour.addStep({
    eval() {
        return step18_val();
    },
    title: "Step 18",
    text: tut[18] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step18_val()) {
                    t21();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="13" y="165"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field><value name="A"><block type="variables" id="zLi`JnxaMMp1qZVC6mZg"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="UaXP7SB[].b{-ilmxj+$"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id="V+W^mD~2`$}59YeRqoG["><field name="NAME">Hi</field></block></statement></block></next></block></statement></block></xml>',
});
function t21() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[104].mp3");
    hideHand();
}
//   Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[104] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                t22();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t22() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[19].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDraggable")[8]), "visible");
    }, 100);
}
// step 19
tour.addStep({
    eval() {
        return step19_val();
    },
    title: "Step 19",
    text: tut[19] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step19_val()) {
                    t23();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="0" y="135"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field></block></statement></block></next></block></statement></block></xml>',
});
function t23() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[20].mp3");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
}
// step 20
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 20",
    text: tut[20],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t24();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t24() {
    play_audio_tutorial("tut[21].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[10]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[10]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[8]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 21
tour.addStep({
    eval() {
        return step21val();
    },
    title: "Step 21",
    text: tut[21] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step21val()) {
                    t25();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="0" y="135"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement></block></next></block></statement></block></xml>',
});
function t25() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[105].mp3");
    hideHand();
}
//   Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[105] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                t26();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t26() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[22].mp3");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
}
// step 22
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 22",
    text: tut[22],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t27();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t27() {
    play_audio_tutorial("tut[23].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[13]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[13]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyText")[10]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 23
tour.addStep({
    eval() {
        return step23_val();
    },
    title: "Step 23",
    text: tut[23] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step23_val()) {
                    t28();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="0" y="135"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="O`:xop;@Gu3u4zJuWW73"><field name="NAME">Hi</field></block></statement></block></next></block></statement></block></xml>',
});
function t28() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[24].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDraggable")[10]), "visible");
    }, 100);
}
// step 24
tour.addStep({
    eval() {
        return step24_val();
    },
    title: "Step 24",
    text: tut[24] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step24_val()) {
                    t29();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="-17" y="143"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field><value name="A"><block type="variables" id="zLi`JnxaMMp1qZVC6mZg"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="WY*%!/A?q*w~`WimVq^."><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id="5`}vKJ)qV7;T[s{^c?e+"><field name="NAME">please take these medicines</field><next><block type="action_block" id="O^C*g!B)#c:J8Nu{!w8K"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="6%-P:f09|$R3[vSv)cY+"><field name="NAME">you don\'t have fever</field></block></statement></block></next></block></statement></block></xml>',
});
function t29() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[25].mp3");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
}
// step 25
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 25",
    text: tut[25],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t30();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t30() {
    play_audio_tutorial("tut[26].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[13]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[13]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[10]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 26
tour.addStep({
    eval() {
        return step26_val();
    },
    title: "Step 26",
    text: tut[26] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step26_val()) {
                    t31();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="0" y="135"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="O`:xop;@Gu3u4zJuWW73"><field name="NAME">You don’t have fever</field><next><block type="normal_temperature" id="s_gGxhaGtded07%4fmXC"></block></next></block></statement></block></next></block></statement></block></xml>',
});
function t31() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[106].mp3");
    hideHand();
}

//   Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[106] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                t32();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t32() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[27].mp3");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
}
// step 27
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 27",
    text: tut[27],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t33();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t33() {
    play_audio_tutorial("tut[28].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[16]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[16]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[4]), "visible");
            krr = !krr;
        }
    }, 1500);
}

// step 28
tour.addStep({
    eval() {
        return step28_val();
    },
    title: "Step 28",
    text: tut[28] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step28_val()) {
                    t32();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="0" y="135"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="O`:xop;@Gu3u4zJuWW73"><field name="NAME">You don’t have fever</field><next><block type="normal_temperature" id="s_gGxhaGtded07%4fmXC"></block></next></block></statement><next><block type="wait_block" id=";!Pi*Q[2%,RxVs3#)_d@"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Cd~L(Nn~3U3]xOOo@wEh"><field name="NUM">3</field></block></value></block></next></block></next></block></statement></block></xml>',
});
function t34() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[29].mp3");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
}

// step 29
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 29",
    text: tut[29],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t35();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t35() {
    play_audio_tutorial("tut[30].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[17]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[17]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[12]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 30
tour.addStep({
    eval() {
        return step30_val();
    },
    title: "Step 30",
    text: tut[30] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step30_val()) {
                    t36();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="-12" y="51"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="O`:xop;@Gu3u4zJuWW73"><field name="NAME">You don’t have fever</field><next><block type="normal_temperature" id="s_gGxhaGtded07%4fmXC"></block></next></block></statement><next><block type="wait_block" id=";!Pi*Q[2%,RxVs3#)_d@"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Cd~L(Nn~3U3]xOOo@wEh"><field name="NUM">3</field></block></value><next><block type="say_block" id="1Al:~)/iyI{}30Ig/Q6S"><field name="NAME">Hi</field></block></next></block></next></block></next></block></statement></block></xml>',
});
function t36() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[31].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDraggable")[14]), "visible");
    }, 100);
}
// step31
tour.addStep({
    eval() {
        return step31_val();
    },
    title: "Step 31",
    text: tut[31] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step31_val()) {
                    t37();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="-12" y="51"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="O`:xop;@Gu3u4zJuWW73"><field name="NAME">You don’t have fever</field><next><block type="normal_temperature" id="s_gGxhaGtded07%4fmXC"></block></next></block></statement><next><block type="wait_block" id=";!Pi*Q[2%,RxVs3#)_d@"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Cd~L(Nn~3U3]xOOo@wEh"><field name="NUM">3</field></block></value><next><block type="say_block" id="1Al:~)/iyI{}30Ig/Q6S"><field name="NAME">Next patient please</field></block></next></block></next></block></next></block></statement></block></xml>',
});
function t37() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[107].mp3");
    hideHand();
}
//   Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[107] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                t38();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t38() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[32].mp3");
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
    // handPointAt($("#hand"), $("#blockly-1"), "visible");
}
// step 32
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 32",
    text: tut[32],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t39();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next",
        },
    ],
    id: "creating",
});
function t39() {
    play_audio_tutorial("tut[33].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[18]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[18]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}
// step 33
tour.addStep({
    eval() {
        return step33_val();
    },
    title: "Step 33",
    text: tut[33] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step33_val()) {
                    t40();
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="f?|2ROeL|,8WI9Qc13hc" x="58" y="143"><value name="TIMES"><block type="math_number" id="2XM{;C]ydher0V6z3Cb("><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id="w!*^lM}:|ctZC,l~dJ2R"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="]60Qr}Fz:lVpwh)OCqX8"></block></value><next><block type="controls_if" id="U(O;f`W#I|a`LWqlholy"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="Pi[[jFeT.@#S]0/r7|qb"><field name="OP">GTE</field><value name="A"><block type="variables" id="zLi`JnxaMMp1qZVC6mZg"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="WY*%!/A?q*w~`WimVq^."><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id="N?qLHD|uW1BR8p$PAbTu"><field name="NAME">please take these medicines</field><next><block type="action_block" id=":E:^uS))ocyQi*EnzY*F"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="=R(1~rzmF~Oa^`/Rj_(~"><field name="NAME">you don\'t have fever</field><next><block type="normal_temperature" id="6`=KBgI(I_[7`+a.ubqb"></block></next></block></statement><next><block type="wait_block" id="lP00dJ/6F/zGnrCe9;CJ"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="31A35t#YP4Sc/_V64|J2"><field name="NUM">3</field></block></value><next><block type="say_block" id="6tg9Q(,nArwi:y[OOpc0"><field name="NAME">next patient please</field></block></next></block></next></block></next></block></statement><next><block type="say_block" id="]~D8T;:yV54pkdE88yO$"><field name="NAME">Hi</field></block></next></block></xml>',
});
function t40() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[34].mp3");
    myInterval = setInterval(() => {
        handPointAt($("#hand"), $($(".blocklyDraggable")[15]), "visible");
    }, 100);
}
// step 34
tour.addStep({
    eval() {
        return step34_val();
    },
    title: "Step 34",
    text: tut[34] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                if (step34_val()) {
                    t41();
                    isRunBtnClicked = false;
                    return this.next();
                }
            },
            text: "Next",
        },
    ],
    id: "creating",
    workspace:
        '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="8:Mv^?DCQ$LIk2T8D=7j" x="-12" y="51"><value name="TIMES"><block type="math_number" id="NRIRPo-WR5Bd!eo3)sDA"><field name="NUM">3</field></block></value><statement name="DO"><block type="set_variable_holder" id=":A0QJM!;bkY46]%ZHCOk"><field name="Variable name">patient_temperature</field><value name="NAME"><block type="get_block_type" id="E%Fz#kVA/mW9ghvF71;9"></block></value><next><block type="controls_if" id="VkqylV$2IzL-}1Pv]Yz6"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="),y|v;ZOcXltwhxhfaec"><field name="OP">GTE</field><value name="A"><block type="variables" id="g$LI%#u4x?4^J+TNlf`r"><field name="Options">patient_temperature</field></block></value><value name="B"><block type="math_number" id="Z.{M9Oy8O0RNowYuj#Tk"><field name="NUM">39</field></block></value></block></value><statement name="DO0"><block type="say_block" id=",3*9I_{G6$fuW!n;@Qm#"><field name="NAME">please take these medicines</field><next><block type="action_block" id="P(bbJ0!E]gHOS,U0kCvu"></block></next></block></statement><statement name="ELSE"><block type="say_block" id="O`:xop;@Gu3u4zJuWW73"><field name="NAME">You don’t have fever</field><next><block type="normal_temperature" id="s_gGxhaGtded07%4fmXC"></block></next></block></statement><next><block type="wait_block" id=";!Pi*Q[2%,RxVs3#)_d@"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="Cd~L(Nn~3U3]xOOo@wEh"><field name="NUM">3</field></block></value><next><block type="say_block" id="1Al:~)/iyI{}30Ig/Q6S"><field name="NAME">Next patient please</field></block></next></block></next></block></next></block></statement><next><block type="say_block" id="^?cWuB)MCT6[Y[V%Cx^q"><field name="NAME">All patients have been consulted today</field></block></next></block></xml>',
});
function t41() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[35].mp3");
    handPointAt($("#hand"), $($(".neumorphic_button")[2]), "visible");
}
// step 35
tour.addStep({
    eval() {
        return isRunBtnClicked;
    },
    title: "Step 35 . Run",
    text: tut[35],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [
        {
            action() {
                hideHand();
                return this.next();
            },
            text: "Next",
        },
    ],
    id: "creating",
});
// =====================================================================
// Validation
// =====================================================================
function step2_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (codep == "for count in range(3):\n  pass\n") {
        return true;
    } else return false;
}
function step4_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (codep == "for count in range(3):\n  default_ =\n") {
        return true;
    } else return false;
}
function step5_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (codep == "for count in range(3):\n  patient_temperature =\n") {
        return true;
    } else return false;
}
function step7_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n"
    ) {
        return true;
    } else return false;
}
function step9_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if false:\n    pass\n  else:\n    pass\n"
    ) {
        return true;
    } else return false;
}
function step11_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if 0 == 0:\n    pass\n  else:\n    pass\n"
    ) {
        return true;
    } else return false;
}
function step12_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if 0 >= 0:\n    pass\n  else:\n    pass\n"
    ) {
        return true;
    } else return false;
}
function step14_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if default_ >= 0:\n    pass\n  else:\n    pass\n"
    ) {
        return true;
    } else return false;
}
function step15_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 0:\n    pass\n  else:\n    pass\n"
    ) {
        return true;
    } else return false;
}
function step16_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        "for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    pass\n  else:\n    pass\n"
    ) {
        return true;
    } else return false;
}
function step18_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("hi")\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}
function step19_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}
function step21val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    pass\n'
    ) {
        return true;
    } else return false;
}
function step23_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("hi")\n'
    ) {
        return true;
    } else return false;
}
function step24_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n`
    ) {
        return true;
    } else return false;
}
function step26_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don’t have fever")\n    doctor.no_treatment_thumbs_up()\n' ||
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n    doctor.no_treatment_thumbs_up()\n`
    ) {
        return true;
    } else return false;
}
function step28_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n` ||
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don’t have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n'
    ) {
        return true;
    } else return false;
}
function step30_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("hi")\n` ||
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don’t have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("hi")\n'
    ) {
        return true;
    } else return false;
}
function step31_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("next patient please")\n` ||
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don’t have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("next patient please")\n'
    ) {
        return true;
    } else return false;
}
function step33_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("next patient please")\ndoctor.say("hi")\n` ||
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don’t have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("next patient please")\ndoctor.say("hi")\n'
    ) {
        return true;
    } else return false;
}
function step34_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase();
    if (
        codep ==
        `for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don't have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("next patient please")\ndoctor.say("all patients have been consulted today")\n` ||
        codep ==
        'for count in range(3):\n  patient_temperature = doctor.get_next_patient_temperature()\n  if patient_temperature >= 39:\n    doctor.say("please take these medicines")\n    doctor.give_medicine()\n  else:\n    doctor.say("you don’t have fever")\n    doctor.no_treatment_thumbs_up()\n  time.sleep(3)\n  doctor.say("next patient please")\ndoctor.say("all patients have been consulted today")\n'
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
        document.getElementById('soundImg').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGlSURBVHgBnVSxUsJAEN1LgMYmhc442hxUKBSZUdAS/kC/QPgC+APwC9QviPwBfyB2THTGFKDpOAss1CKVDRPWvYs3MpiA4TV3e7v37t3u7ZmQEvzg6Mza3t8NPt/Eso9BSuRLVYxm6GE4Oxe+J7TPWLe5UK60+GGloW1EbNIgSIfNzNwT+ex/kRXK1Q4iu2aMOXpNPD/cYmjUSV6PTIt8d7xo85VkERF043zCHwoxdhsIGBGaWSeRbBVRoXTicNu2lJGdteniAV25xovHtYxco6ROaOB6AyIkgtQ02CwrY+vC8wJert4whI5hmBdaGYdUiJSo6Rz76hCGtbXVTOYzVRWpIJ4WtDlZDDYnw1Ap+n1n6GkyASlABeoL/3GgDMqVGsDwVDUnYze/GEwV6soKxRIBDuBrq6niuG0RSUvO52HYS+zNZUI68E9soVS5QmBteTMpKDFnYuR2kcFl7EGkiIgcRcQwkO0l101YgeB9OrB29l6BGffBx3So1FDjQ86kt8VOFdGcHu+L60vfxl+Qyl1oNmWfal8GUkJ9QQYKMfqp5gK+ASrop99e7Z/mAAAAAElFTkSuQmCC";
    } else {
        playAudio = false;
        document.getElementById('soundImg').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADfSURBVHgBpZNdEcMgEIR3qiASkIAE6qAScNBKwEHrIHFSCa2D1AES6KU5JoS5AGl2Zh8Cm2+WP2CWJt/JCnVdyKYUGMiBPDYAQy2reFIKXck2+bZJ1mNeVTPQ8liqDstqPHY2tJA1cPa5Mf8DeGzvS8/NYsOYNTEQ20jOgXkTx2N9GgiNQJs10UmmCSYBb1nbsAeWA7sjsBHyHsZlvk488EFdZ84pzAegsobvrR+d0Awo30ODgpwAKwGrcgJskkbDg5dksb4G08P3KF/sZkXQdAgGy5J7/CGD9WYr8oOsv0tEhgjHBhLnAAAAAElFTkSuQmCC";
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
        buttons: [
            {
                action: function () {
                    return this.next();
                },
                text: "Finish",
            },
        ],
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