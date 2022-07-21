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
const tut1 = {
    "english": {
        0: `<h5>In this lesson, we are going to help the thirsty crow to drink the water.</h5>`,
        1: `There are pebbles in the ground. Make the crow collect them and drop pebbles into the pot, until the water reaches its lid`,
        2: `Select the Loops section`,
        3: `Pick the forever block and place it in the workspace`,
        4: `Select the Actions section`,
        5: `Choose the Drop Pebbles block and place it the Repeat forever block statements`,
        6: `Now press the run button and observe`,
        7: `Great, the water has reached the lid`,
        8: `The crow has to drink water next`,
        9: `To execute this condition, we will use "if" block`,
        10: `If blocks are conditional blocks where we will be able to specify conditions. <br> Eg. If the water touches the lid, then drink water`,
        11: `Click on the Conditions section`,
        12: `This condition should be checked throughout the game so we are placing it inside the forever loop`,
        13: `Select the If block and place it below the drop pebbles block`,
        14: `Now let's  check if water touches the pot's lid`,
        15: `Click on the Events section`,
        16: `Pick the "Water" touches "Pot's Lid" block and place it inside the "if" block condition`,
        19: `Now, lets specify that crow can drink water`,
        20: `Click on Actions section`,
        21: `Select the Drink the water block and place it inside "if" block statements`,
        25: `Good job! we have successfully helped our crow.`,
        26: `Now press the run button and quench the thirst of the crow`,
    }
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
    btns[0].click();
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
    handPointAt($("#hand"), $($("#blockly-0")), "hidden");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($("#blockly-0")), "hidden");
    }, 1500);
}

function handOnRun() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".runbtn")[2]), "visible");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".runbtn")[2]), "visible");
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

function loadAgain() {
    console.log("In LoadAgain");
    let nextStep = 0;
    if (tour.isActive()) {
        nextStep = Shepherd?.activeTour?.steps?.indexOf(Shepherd?.activeTour?.currentStep);
    }

    lang = window["language"]
    let tut = tut1[lang];

    if (tour)
        tour.complete();

    tour = new Shepherd.Tour({
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

    tour.addStep({
        eval() {
            return false;
        },
        title: "Information",
        text: tut[1] + add_back_button() + add_next_button(),
        arrow: false,
        // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    i0();
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    i2();
                    clearInterval(myInterval);
                    // handPointAt($("#hand"), $("#blockly-3"), "visible");
                    let id = (demoWorkspace.getToolbox().contents_[3].id_)
                    handPointAt($("#hand"), $("#" + id), "visible");
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[3].id_)
            return check_toolbox_selection(id);
        },
        title: "Step 1",
        text: tut[2],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    let id = (demoWorkspace.getToolbox().contents_[3].id_)
                    if (check_toolbox_selection(id)) {
                        t1();
                        return this.next();
                    }
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return val1();
        },
        title: "Step 2",
        text: tut[3] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    if (val1()) {
                        i3();
                        clearInterval(myInterval);
                        let id = (demoWorkspace.getToolbox().contents_[1].id_)
                        handPointAt($("#hand"), $("#" + id), "visible");
                        return this.next();
                    } else M.toast({ html: "Wrong block or values selected!" });
                },
                text: "Next",
            },
        ],
        id: "creating",
        workspace:
            '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="T9O^in[4{Y)?d]T8F(nY" x="82" y="152"></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[1].id_)
            return check_toolbox_selection(id);
        },
        title: "Step 3",
        text: tut[4],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    t1();
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    let id = (demoWorkspace.getToolbox().contents_[1].id_)
                    if (check_toolbox_selection(id)) {
                        t2();
                        return this.next();
                    }
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return val2();
        },
        title: "Step 4",
        text: tut[5] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    if (val2()) {
                        play_audio_tutorial("tut[6].mp3", lang);
                        clearInterval(myInterval);
                        // handPointAt($("#hand"), $($(".neumorphic_button")[2]), "visible");
                        handPointAt($("#hand"), $("#runbtn"), 'visible');
                        isRunBtnClicked = false;
                        return this.next();
                    } else M.toast({ html: "Wrong block or values selected!" });
                },
                text: "Next",
            },
        ],
        id: "creating",
        workspace:
            '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="=V3Qq5,5!WIC]oK(`sA{" x="37" y="110"><statement name="NAME"><block type="action_block" id="B]GPvL[8VjJDsu7#Ox)!"></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            return isRunBtnClicked;
        },
        title: "Step 5 . Run",
        text: tut[6],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    console.log("In Next 5")
                    play_audio_tutorial("tut[7].mp3", lang);
                    clearInterval(myInterval);
                    // handPointAt($("#hand"), $($(".neumorphic_button")[2]), "hidden");
                    handPointAt($("#hand"), $("#runbtn"), 'hidden');
                    isRunBtnClicked = false;
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Information ",
        text: tut[7] + add_next_button(),
        arrow: false,
        //   attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    clearInterval(myInterval);
                    play_audio_tutorial("tut[8].mp3", lang);
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Information",
        text: tut[8] + add_back_button() + add_next_button(),
        arrow: false,
        // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    play_audio_tutorial("tut[7].mp3", lang);
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    play_audio_tutorial("tut[9].mp3", lang);
                    clearInterval(myInterval);
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Information",
        text: tut[9] + add_back_button() + add_next_button(),
        arrow: false,
        //   attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    play_audio_tutorial("tut[8].mp3", lang);
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    play_audio_tutorial("tut[10].mp3", lang);
                    clearInterval(myInterval);
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Information",
        text: tut[10] + add_back_button() + add_next_button(),
        arrow: false,
        //   attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    play_audio_tutorial("tut[9].mp3", lang);
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    play_audio_tutorial("tut[12].mp3", lang);
                    clearInterval(myInterval);
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Step 6",
        text: tut[12] + add_back_button() + add_next_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    play_audio_tutorial("tut[10].mp3", lang);
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    clearInterval(myInterval);
                    play_audio_tutorial("tut[11].mp3", lang);
                    let id = (demoWorkspace.getToolbox().contents_[2].id_)
                    handPointAt($("#hand"), $("#" + id), "visible");
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[2].id_)
            return check_toolbox_selection(id);
        },
        title: "Step 7",
        text: tut[11],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    let id = (demoWorkspace.getToolbox().contents_[2].id_)
                    if (check_toolbox_selection(id)) {
                        clearInterval(myInterval);
                        play_audio_tutorial("tut[13].mp3", lang);
                        t3();
                        return this.next();
                    }
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return val3();
        },
        title: "Step 8",
        text: tut[13] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    if (val3()) {
                        clearInterval(myInterval);
                        play_audio_tutorial("tut[14].mp3", lang);
                        handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "hidden");
                        return this.next();
                    } else M.toast({ html: "Wrong block or values selected!" });
                },
                text: "Next",
            },
        ],
        id: "creating",
        workspace:
            '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="=V3Qq5,5!WIC]oK(`sA{" x="70" y="287"><statement name="NAME"><block type="action_block" id="B]GPvL[8VjJDsu7#Ox)!"><next><block type="controls_if" id="+n$V(,{h^SD/}S;FUo}5"></block></next></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Information",
        text: tut[14] + add_next_button(),
        arrow: false,
        // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    play_audio_tutorial("tut[15].mp3", lang);
                    clearInterval(myInterval);
                    let id = (demoWorkspace.getToolbox().contents_[0].id_)
                    handPointAt($("#hand"), $("#" + id), "visible");
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id);
        },
        title: "Step 9",
        text: tut[15],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    let id = (demoWorkspace.getToolbox().contents_[0].id_)
                    if (check_toolbox_selection(id)) {
                        return this.back();
                    }
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    let id = (demoWorkspace.getToolbox().contents_[0].id_)
                    if (check_toolbox_selection(id)) {
                        t4();
                        return this.next();
                    }
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return val4();
        },
        title: "Step 10",
        text: tut[16] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    if (val4()) {
                        clearInterval(myInterval);
                        handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "hidden");
                        play_audio_tutorial("tut[19].mp3", lang);
                        return this.next();
                    } else M.toast({ html: "Wrong block or values selected!" });
                },
                text: "Next",
            },
        ],
        id: "creating",
        workspace:
            '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="=V3Qq5,5!WIC]oK(`sA{" x="70" y="287"><statement name="NAME"><block type="action_block" id="B]GPvL[8VjJDsu7#Ox)!"><next><block type="controls_if" id="+n$V(,{h^SD/}S;FUo}5"><value name="IF0"><block type="spritetouch__block" id="w6$%TrxJ^DL0jM}+%*HO"><field name="options1">water</field><field name="options2">potLid</field></block></value></block></next></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Step 11",
        text: tut[19] + add_next_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    clearInterval(myInterval);
                    play_audio_tutorial("tut[20].mp3", lang);
                    let id = (demoWorkspace.getToolbox().contents_[1].id_)
                    handPointAt($("#hand"), $("#" + id), "visible");
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[1].id_)
            return check_toolbox_selection(id);
        },
        title: "Step 12",
        text: tut[20],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    let id = (demoWorkspace.getToolbox().contents_[1].id_)
                    if (check_toolbox_selection(id)) {
                        t5();
                        return this.next();
                    }
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return val5();
        },
        title: "Step 13",
        text: tut[21] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    if (val5()) {
                        clearInterval(myInterval);
                        play_audio_tutorial("tut[25].mp3", lang);
                        let id = (demoWorkspace.getToolbox().contents_[1].id_)
                        handPointAt($("#hand"), $("#" + id), "hidden");
                        return this.next();
                    } else M.toast({ html: "Wrong block or values selected!" });
                },
                text: "Next",
            },
        ],
        id: "creating",
        workspace:
            '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="=V3Qq5,5!WIC]oK(`sA{" x="64" y="287"><statement name="NAME"><block type="action_block" id="B]GPvL[8VjJDsu7#Ox)!"><next><block type="controls_if" id="+n$V(,{h^SD/}S;FUo}5"><value name="IF0"><block type="spritetouch__block" id="w6$%TrxJ^DL0jM}+%*HO"><field name="options1">water</field><field name="options2">potLid</field></block></value><statement name="DO0"><block type="drink_block" id="#@w/@XTmW20u2`[8h2X2"></block></statement></block></next></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Step 14",
        text: tut[25] + add_next_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    return this.back();
                },
                classes: "shepherd-button-secondary",
                text: "Back",
            },
            {
                action() {
                    clearInterval(myInterval);
                    play_audio_tutorial("tut[26].mp3", lang);
                    handPointAt($("#hand"), $("#runbtn"), 'visible');
                    isRunBtnClicked = false;
                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return isRunBtnClicked;
        },
        title: "Step 15 . Run",
        text: tut[26],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [
            {
                action() {
                    clearInterval(myInterval);
                    handPointAt($("#hand"), $("#runbtn"), 'hidden');

                    return this.next();
                },
                text: "Next",
            },
        ],
        id: "creating",
    });

    tour.start();
    tour.show(nextStep);

    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
    console.log("End LoadAgain");
}

function i0() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[0].mp3", lang);
}
function i1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[1].mp3", lang);
}

function i2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[2].mp3", lang);
}


function t1() {
    play_audio_tutorial("tut[3].mp3", lang);
    clearInterval(myInterval);
    // play_audio_tutorial("line4.mp3");
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

function i3() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[4].mp3", lang);
}


function t2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[5].mp3", lang);
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


function t3() {
    clearInterval(myInterval);
    // play_audio_tutorial("line4.mp3");
    handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
            krr = !krr;
        }
    }, 1500);
}


function t4() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[16].mp3", lang);
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


function t5() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[21].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[5]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
            krr = !krr;
        }
    }, 1500);
}


// =====================================================================
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

// // tour.start();
loadAgain()
window['loadAgain'] = loadAgain

// NGS Sound Enhancement
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

// ========================================================================
// Validation
// ========================================================================

function val1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "while True:\n") {
        return true;
    } else return false;
}
function val2() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "while True:\n  drop_Pebble()\n") {
        return true;
    } else return false;
}
function val3() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "while True:\n  drop_Pebble()\n  if False:\n    pass\n") {
        return true;
    } else return false;
}
function val4() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "while True:\n  drop_Pebble()\n  if is_water_touching_pot_lid():\n    pass\n"
    ) {
        return true;
    } else return false;
}
function val5() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (
        codep ==
        "while True:\n  drop_Pebble()\n  if is_water_touching_pot_lid():\n    drink_Water()\n"
    ) {
        return true;
    } else return false;
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
