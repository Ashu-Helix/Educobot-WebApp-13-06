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
            tour.steps[i].options.attachTo.on = isPortrait() ?
                adapt_orientation_array[i][0] :
                adapt_orientation_array[i][1];
        } catch (error) {
            true;
        }
    }
});

function hideHand() {
    clearInterval(myInterval);
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $($("#" + id)), "hidden");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($("#" + id)), "hidden");
    }, 1000);
}

function handOnRun() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".runbtn")[2]), "visible");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".runbtn")[2]), "visible");
    }, 1000);
}

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
    0: `<h5>Let's review the concept of coordinates on the X and Y axis.</h5>`,
    1: `X and Y coordinates are a location, which helps to locate a point in two-dimensional space`,
    2: `Let's pick the toys with the help of this concept`,
    3: `Select "Claw Machine" from the tool box`,
    31: `Select catch block and drag it to the workspace`,
    4: `Touch a toy on the screen and observe its coordinates shown in the top right corner of the game`,
    5: `The claw will move to the toy's coordinates and pick up the selected toy`,
    6: `Select the "Claw Machine" from the tool box`,
    61: `Place the "x y" block inside the "catch" block`,
    7: `To pick up the Teddy Bear, enter its coordinates (hint: x:440 and y:550). "Run and Observe"`,
    8: `Next, repeat the procedure to pick up the joker`,
    9: `Next, pick up the "dog with a hat"`,
    10: `Next, let's catch the lion`,
    11: `Finally, let's get the monkey`,
    12: `Great, Run the programme and take home the selected toys!`,
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

// // ==================================================================
// // information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[0] + add_next_button(),
    arrow: true,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            i1();
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

// information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[1] + add_back_button() + add_next_button(),
    arrow: true,
    buttons: [{
        action() {
            i0();
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            i2();
            return this.next();
        },
        text: "Next",
    },
    ],
    id: "creating",
});

// // Information
tour.addStep({
    eval() {
        return false;
    },
    title: "Information",
    text: tut[2] + add_back_button() + add_next_button(),
    arrow: true,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            play_audio_tutorial("tut[1].mp3", lang);
            clearInterval(myInterval);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            i3();
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

// step 1
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        return check_toolbox_selection(id)
    },
    title: "Step 1",
    text: tut[3],
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    buttons: [{
        action() {
            // clearInterval(myInterval);
            t1();
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
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

// step 1.1
tour.addStep({
    eval() {
        return val1();
    },
    title: "Step 1.1",
    text: tut[31] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    buttons: [{
        action() {
            // clearInterval(myInterval);
            clearInterval(myInterval);
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            handPointAt($("#hand"), $("#" + id), "visible");
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            if (val1()) {
                play_audio_tutorial("tut[4].mp3", lang);
                clearInterval(myInterval);
                handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "hidden");
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },
    ],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="%(@bKAY`^0eH{LoH]!PG" x="199" y="132"></block></xml>',
});

// step 2
tour.addStep({
    eval() {
        return false;
    },
    title: "Step 2",
    text: tut[4] + add_next_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            i4();
            return this.next();
        },
        text: "Next",
    },],
    id: "creating",
});

// step 3
tour.addStep({
    eval() {
        return false;
    },
    title: "Step 3",
    text: tut[5] + add_back_button() + add_next_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            i5();
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            play_audio_tutorial("tut[6].mp3", lang);
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

// step 4
tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 4",
    text: tut[6],
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
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

// step 4.1
tour.addStep({
    eval() {
        return val2();
    },
    title: "Step 4.1",
    text: tut[61] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val2()) {
                t3();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="RE_W2CeJJH$.Pt(kBJ$#" x="81" y="178"><value name="NAME"><block type="xy" id=")+D~I8hRbv7N4f(IoYL|"><field name="x_coordinate">50</field><field name="y_coordinate">50</field></block></value></block></xml>',
});

// step 5
tour.addStep({
    eval() {
        return val3();
    },
    title: "Step 5",
    text: tut[7] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
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
                play_audio_tutorial("tut[8].mp3", lang);
                hideHand();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },
    ],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="*cg^:hA)H%-=oQ:*3^A`" x="108" y="99"><value name="NAME"><block type="xy" id="oowY4d,^Q|11N6|Yu9?d"><field name="x_coordinate">440</field><field name="y_coordinate">550</field></block></value></block></xml>',
});

// step 6
tour.addStep({
    eval() {
        return val4();
    },
    title: "Step 6",
    text: tut[8] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            t3();
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            if (val4()) {
                i6();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },
    ],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="*cg^:hA)H%-=oQ:*3^A`" x="108" y="99"><value name="NAME"><block type="xy" id="oowY4d,^Q|11N6|Yu9?d"><field name="x_coordinate">440</field><field name="y_coordinate">550</field></block></value><next><block type="catch_block" id="al54ZHJ~Re5x)?okbW[U"><value name="NAME"><block type="xy" id=".yX,tEsQf40(I0JguWI6"><field name="x_coordinate">530</field><field name="y_coordinate">620</field></block></value></block></next></block></xml>',
});

// step 7
tour.addStep({
    eval() {
        return val5();
    },
    title: "Step 7",
    text: tut[9] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val5()) {
                i7();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="*cg^:hA)H%-=oQ:*3^A`" x="108" y="99"><value name="NAME"><block type="xy" id="oowY4d,^Q|11N6|Yu9?d"><field name="x_coordinate">440</field><field name="y_coordinate">550</field></block></value><next><block type="catch_block" id="al54ZHJ~Re5x)?okbW[U"><value name="NAME"><block type="xy" id=".yX,tEsQf40(I0JguWI6"><field name="x_coordinate">530</field><field name="y_coordinate">620</field></block></value><next><block type="catch_block" id="867J.p(lGonlQZl~wI)+"><value name="NAME"><block type="xy" id="VQElnlxZuttv]F:l[sc}"><field name="x_coordinate">620</field><field name="y_coordinate">610</field></block></value></block></next></block></next></block></xml>',
});

// step 8
tour.addStep({
    eval() {
        return val6();
    },
    title: "Step 8",
    text: tut[10] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            if (val6()) {
                i8();
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },
    ],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="*cg^:hA)H%-=oQ:*3^A`" x="108" y="99"><value name="NAME"><block type="xy" id="oowY4d,^Q|11N6|Yu9?d"><field name="x_coordinate">440</field><field name="y_coordinate">550</field></block></value><next><block type="catch_block" id="al54ZHJ~Re5x)?okbW[U"><value name="NAME"><block type="xy" id=".yX,tEsQf40(I0JguWI6"><field name="x_coordinate">530</field><field name="y_coordinate">620</field></block></value><next><block type="catch_block" id="867J.p(lGonlQZl~wI)+"><value name="NAME"><block type="xy" id="VQElnlxZuttv]F:l[sc}"><field name="x_coordinate">620</field><field name="y_coordinate">610</field></block></value><next><block type="catch_block" id=")+Bl$vQw=(92-.A5i8Y~"><value name="NAME"><block type="xy" id="NpdXtuJ+qCWD1nUCirk-"><field name="x_coordinate">720</field><field name="y_coordinate">610</field></block></value></block></next></block></next></block></next></block></xml>',
});

// step 9
tour.addStep({
    eval() {
        return val7();
    },
    title: "Step 9",
    text: tut[11] + add_rescue_button(),
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            if (val7()) {
                i9();
                isRunBtnClicked = false;
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },
    ],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="*cg^:hA)H%-=oQ:*3^A`" x="108" y="99"><value name="NAME"><block type="xy" id="oowY4d,^Q|11N6|Yu9?d"><field name="x_coordinate">440</field><field name="y_coordinate">550</field></block></value><next><block type="catch_block" id="al54ZHJ~Re5x)?okbW[U"><value name="NAME"><block type="xy" id=".yX,tEsQf40(I0JguWI6"><field name="x_coordinate">530</field><field name="y_coordinate">620</field></block></value><next><block type="catch_block" id="867J.p(lGonlQZl~wI)+"><value name="NAME"><block type="xy" id="VQElnlxZuttv]F:l[sc}"><field name="x_coordinate">620</field><field name="y_coordinate">610</field></block></value><next><block type="catch_block" id=")+Bl$vQw=(92-.A5i8Y~"><value name="NAME"><block type="xy" id="NpdXtuJ+qCWD1nUCirk-"><field name="x_coordinate">720</field><field name="y_coordinate">610</field></block></value><next><block type="catch_block" id="rBNV=ebutY]zR`QBWDal"><value name="NAME"><block type="xy" id="eh}GF3UW8.!]*pGRJJs~"><field name="x_coordinate">830</field><field name="y_coordinate">630</field></block></value></block></next></block></next></block></next></block></next></block></xml>',
});

// step 10 .run
tour.addStep({
    eval() {
        return isRunBtnClicked;
    },
    title: "Step 10. Run and see what happens",
    text: tut[12],
    arrow: true,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            return this.next();
        },
        text: "Next",
    },
    ],
    id: "creating",
});

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


function i3() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[3].mp3", lang);
}


function t1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[31].mp3", lang);
    // handPointAt($("#hand"), $("#blockly-0"), "visible");
    handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $("#blocklyDiv"), "visible");
            krr = !krr;
        }
    }, 1500);
}


function i4() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[5].mp3", lang);
}


function i5() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[4].mp3", lang);
}


function t2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[61].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "visible");
            krr = !krr;
        }
    }, 1500);
}


function t3() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[7].mp3", lang), hideHand();
    // handPointAt($("#hand"), $($(".blocklyFieldRect")[1]), "visible");
    // krr = false;
    // myInterval = setInterval(function () {
    //   if (krr) {
    //     handPointAt($("#hand"), $($(".blocklyFieldRect")[1]), "visible");
    //     krr = !krr;
    //   } else {
    //     handPointAt($("#hand"), $($(".blocklyFieldRect")[0]), "visible");
    //     krr = !krr;
    //   }
    // }, 1500);
}

function i6() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[9].mp3", lang);
}


function i7() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[10].mp3", lang);
}


function i8() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[11].mp3", lang);
}


function i9() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[12].mp3", lang);
    handOnRun();
}


// // =================================================================
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

// // ========================================================================
// // Validation
// // ========================================================================

function val1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == `await getToyByCoordinates("")`) {
        return true;
    } else return false;
}

function val2() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == `getToyByCoordinates("50", "50")\n`) {
        return true;
    } else return false;
}

function val3() {

    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(/getToyByCoordinates\("(...)", "(...)"\)\n/);
    // console.log(codep, matches, "197")
    // console.log(matches + " " + matches[1] + " " + matches[2])
    let x1 = matches[1];
    let y1 = matches[2];
    // console.log(matches[1] + " " + matches[2])
    // console.log("From val3 " + x1 + " " + y1 + " " + matches)
    if (x1 > 430 && x1 < 470 && y1 > 540 && y1 < 720) {
        if (codep == `getToyByCoordinates("` + x1 + `", "` + y1 + `")\n`) {
            return true;
        } else return false;
    } else return false;

}

function val4() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(
        /getToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\n/
    );
    let x1 = matches[1];
    let y1 = matches[2];
    let x2 = matches[3];
    let y2 = matches[4];
    if (
        x1 > 430 &&
        x1 < 470 &&
        y1 > 520 &&
        y1 < 720 &&
        x2 > 485 &&
        x2 < 555 &&
        y2 > 520 &&
        y2 < 720
    ) {
        if (
            codep ==
            `getToyByCoordinates("` +
            x1 +
            `", "` +
            y1 +
            `")\ngetToyByCoordinates("` +
            x2 +
            `", "` +
            y2 +
            `")\n`
        ) {
            return true;
        } else return false;
    } else return false;
}

function val5() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(
        /getToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\n/
    );
    let x1 = matches[1];
    let y1 = matches[2];
    let x2 = matches[3];
    let y2 = matches[4];
    let x3 = matches[5];
    let y3 = matches[6];
    if (
        x1 > 430 &&
        x1 < 470 &&
        y1 > 520 &&
        y1 < 720 &&
        x2 > 485 &&
        x2 < 555 &&
        y2 > 520 &&
        y2 < 720 &&
        x3 > 560 &&
        x3 < 645 &&
        y3 > 520 &&
        y3 < 720
    ) {
        if (
            codep ==
            `getToyByCoordinates("` +
            x1 +
            `", "` +
            y1 +
            `")\ngetToyByCoordinates("` +
            x2 +
            `", "` +
            y2 +
            `")\ngetToyByCoordinates("` +
            x3 +
            `", "` +
            y3 +
            `")\n`
        ) {
            return true;
        } else return false;
    } else return false;
}

function val6() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(
        /getToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\n/
    );
    let x1 = matches[1];
    let y1 = matches[2];
    let x2 = matches[3];
    let y2 = matches[4];
    let x3 = matches[5];
    let y3 = matches[6];
    let x4 = matches[7];
    let y4 = matches[8];
    if (
        x1 > 430 &&
        x1 < 470 &&
        y1 > 520 &&
        y1 < 720 &&
        x2 > 485 &&
        x2 < 555 &&
        y2 > 520 &&
        y2 < 720 &&
        x3 > 560 &&
        x3 < 645 &&
        y3 > 520 &&
        y3 < 720 &&
        x4 > 665 &&
        x4 < 770 &&
        y4 > 520 &&
        y4 < 720
    ) {
        if (
            codep ==
            `getToyByCoordinates("` +
            x1 +
            `", "` +
            y1 +
            `")\ngetToyByCoordinates("` +
            x2 +
            `", "` +
            y2 +
            `")\ngetToyByCoordinates("` +
            x3 +
            `", "` +
            y3 +
            `")\ngetToyByCoordinates("` +
            x4 +
            `", "` +
            y4 +
            `")\n`
        ) {
            return true;
        } else return false;
    } else return false;
}

function val7() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(
        /getToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\ngetToyByCoordinates\("(...)", "(...)"\)\n/
    );
    let x1 = matches[1];
    let y1 = matches[2];
    let x2 = matches[3];
    let y2 = matches[4];
    let x3 = matches[5];
    let y3 = matches[6];
    let x4 = matches[7];
    let y4 = matches[8];
    let x5 = matches[9];
    let y5 = matches[10];
    if (
        x1 > 430 &&
        x1 < 470 &&
        y1 > 520 &&
        y1 < 720 &&
        x2 > 485 &&
        x2 < 555 &&
        y2 > 520 &&
        y2 < 720 &&
        x3 > 560 &&
        x3 < 645 &&
        y3 > 520 &&
        y3 < 720 &&
        x4 > 665 &&
        x4 < 770 &&
        y4 > 520 &&
        y4 < 720 &&
        x5 > 775 &&
        x5 < 850 &&
        y5 > 520 &&
        y5 < 720
    ) {
        if (
            codep ==
            `getToyByCoordinates("` +
            x1 +
            `", "` +
            y1 +
            `")\ngetToyByCoordinates("` +
            x2 +
            `", "` +
            y2 +
            `")\ngetToyByCoordinates("` +
            x3 +
            `", "` +
            y3 +
            `")\ngetToyByCoordinates("` +
            x4 +
            `", "` +
            y4 +
            `")\ngetToyByCoordinates("` +
            x5 +
            `", "` +
            y5 +
            `")\n`
        ) {
            return true;
        } else return false;
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

document.getElementById('runbtn').addEventListener("click", function () { isRunBtnClicked = true; });