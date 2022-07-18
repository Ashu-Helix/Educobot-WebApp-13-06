import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

const slug = window["slug"];
let lang = window["language"]
window['rescue_btn_click_count'] = 0
window['total_rescue_btns'] = 0

const demoWorkspace = Blockly.getMainWorkspace();
let isPortrait = () => (screen.width <= 600 ? true : false);
var tour_over = false;
var playAudio = true;
let myInterval;
var audio = { paused: true };
let kill_audio = () => {
    if (!audio.paused) audio.pause();
};
var adapt_orientation_array = [];
let language = {
    guide_folder: "guide",
    language_packs_folder: "languages",
    language: "english",
    audio_folder: "audio",
    image_folder: "images",
};
let adapt_orientation = (portait, landscape) => {
    adapt_orientation_array.push([portait, landscape])
    return isPortrait() ? portait : landscape;
}
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

function hint_maker(a, id, txt) {
    return (
        '<button id="' +
        id +
        '_btn" class="hoverable waves-effect waves-light btn-small grey darken-4" onclick="' +
        id +
        '();">' +
        txt +
        '</button><img id = "' +
        id +
        '" src = "assets/' +
        (language.guide_folder +
            "/" +
            language.language_packs_folder +
            "/" +
            language.language +
            "/" +
            language.image_folder +
            "/") +
        a +
        '" class="responsive-img tutorial_image" style="display:none">'
    );
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
$("#hand").css("visibility", "hidden");

function play_audio_tutorial(file) {
    let path = `../assets/` + language.guide_folder + `/` + slug + '/' + language.language_packs_folder + `/` + lang + `/` + language.audio_folder + `/`;
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
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
    if ((playAudio)) {
        document.querySelectorAll("#s_mute").forEach((i) => { i.src = i.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGlSURBVHgBnVSxUsJAEN1LgMYmhc442hxUKBSZUdAS/kC/QPgC+APwC9QviPwBfyB2THTGFKDpOAss1CKVDRPWvYs3MpiA4TV3e7v37t3u7ZmQEvzg6Mza3t8NPt/Eso9BSuRLVYxm6GE4Oxe+J7TPWLe5UK60+GGloW1EbNIgSIfNzNwT+ex/kRXK1Q4iu2aMOXpNPD/cYmjUSV6PTIt8d7xo85VkERF043zCHwoxdhsIGBGaWSeRbBVRoXTicNu2lJGdteniAV25xovHtYxco6ROaOB6AyIkgtQ02CwrY+vC8wJert4whI5hmBdaGYdUiJSo6Rz76hCGtbXVTOYzVRWpIJ4WtDlZDDYnw1Ap+n1n6GkyASlABeoL/3GgDMqVGsDwVDUnYze/GEwV6soKxRIBDuBrq6niuG0RSUvO52HYS+zNZUI68E9soVS5QmBteTMpKDFnYuR2kcFl7EGkiIgcRcQwkO0l101YgeB9OrB29l6BGffBx3So1FDjQ86kt8VOFdGcHu+L60vfxl+Qyl1oNmWfal8GUkJ9QQYKMfqp5gK+ASrop99e7Z/mAAAAAElFTkSuQmCC"; })
    } else {
        document.querySelectorAll("#s_mute").forEach((i) => { i.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAASCAYAAAC5DOVpAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADfSURBVHgBpZNdEcMgEIR3qiASkIAE6qAScNBKwEHrIHFSCa2D1AES6KU5JoS5AGl2Zh8Cm2+WP2CWJt/JCnVdyKYUGMiBPDYAQy2reFIKXck2+bZJ1mNeVTPQ8liqDstqPHY2tJA1cPa5Mf8DeGzvS8/NYsOYNTEQ20jOgXkTx2N9GgiNQJs10UmmCSYBb1nbsAeWA7sjsBHyHsZlvk488EFdZ84pzAegsobvrR+d0Awo30ODgpwAKwGrcgJskkbDg5dksb4G08P3KF/sZkXQdAgGy5J7/CGD9WYr8oOsv0tEhgjHBhLnAAAAAElFTkSuQmCC"; })
    }
}

function shepherd_mute_unmute() {
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


function change_rescue_button_colour(event) {
    if (event.type == Blockly.Events.BLOCK_CHANGE || event.type == Blockly.Events.BLOCK_CREATE || event.type == Blockly.Events.BLOCK_DELETE || event.type == Blockly.Events.BLOCK_MOVE) {
        rescue_colour_is_yellow = true;
        rescue_button_set_colour();
    }
}
demoWorkspace.addChangeListener(change_rescue_button_colour);


$('.speaker').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('mute');
});

let tour = new Shepherd.Tour({
    defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'educobot-shepherd',
        scrollTo: { behavior: 'smooth', block: 'center' }
    }
});


const tut = {
    0: `<p style="text-align: center;"><strong><span style="font-family: Helvetica; font-size: 20px;">Let us learn the concept of fractions. Out of 7 slices of Pizza, 2 slices that are 2/7 part of the Pizza you will serve on plate 1, and 4 slices, that are 4/7 part of the Pizza you will serve on plate 2,  the balance 1 slice will be left on the serving plate.</span></strong></p>`,
    1: `You will see 3 plates of which the Serving plate has full Pizza cut into 7 slices, you need to serve on Plate 1 and Plate 2.`,
    2: `From the serving plate serve 2 slices on plate 1 and 4 slices on plate 2.`,
    3: `plate1_slices + plate2_slices = 6 slices from the total 7 slices.`,
    4: `Variables as you know are memory holders used to store numbers, words and much more.`,
    5: `Let's use Variables to make our task easier.`,
    6: `Select the Game Variables from the toolbox`,
    7: `Now select the set variables name block and drag it to the workspace.`,
    8: `The serving plate already has 7 slices, so we won't create variables for the serving plate. From the Variable name drop-down menu select Plate 1.`,
    9: `Choose the Game Variables again.`,
    91: `Drag the set variables name block and place it under the 1st variable block, and select plate 2 from the drop-down menu.`,
    10: `You will serve 2 slices of pizza on plate 1 and 4 slices on plate 2. To do this set the value of plate1_slice variable value to 2 and set the value of plate2_slice to 4.`,
    11: `To Serve the pizza slices you need to use a serve block. Select serve from the tool menu.`,
    12: `Now drag the serve block and place it under the second set variable name block.`,
    13: `Good job, now hit the green flag to serve the pizza on the plates.`,
};

function loadAgain() {
    console.log("tour started");
    let nextStep = 0;
    if (tour.isActive()) {
        nextStep = Shepherd?.activeTour?.steps?.indexOf(Shepherd?.activeTour?.currentStep);
    }

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
        title: "Concept",
        arrow: true,
        text: tut[0] + add_next_button(),
        buttons: [{
            action() {
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
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
        title: "Info 1",
        text: tut[1] + add_back_button() + add_next_button(),
        arrow: true,
        buttons: [{
            action() {
                clearInterval(myInterval);
                play_audio_tutorial("tut[0].mp3")
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

    tour.addStep({
        eval() {
            return false;
        },
        title: "Info 2",
        text: tut[2] + add_back_button() + add_next_button(),
        arrow: true,
        buttons: [{
            action() {
                i1();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                i3();
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
        title: "Info 3",
        text: tut[3] + add_back_button() + add_next_button(),
        arrow: true,
        buttons: [{
            action() {
                i2();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                i4();
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
        title: "Info 4",
        text: tut[4] + add_back_button() + add_next_button(),
        arrow: true,
        buttons: [{
            action() {
                i3()
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                i5();
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
        title: "Info 5",
        text: tut[5] + add_back_button() + add_next_button(),
        arrow: true,
        buttons: [{
            action() {
                i4();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                i6();
                return this.next();
            },
            text: "Next",
        },
        ],
        id: "creating",
    });

    // console.log(demoWorkspace.getToolbox().contents_);

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
        },
        title: "Step 1",
        text: tut[6],
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
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
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    t1();
                    return this.next();
                } else M.toast({ html: "Choose the Game Variables in the toolbox" });
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
        text: tut[7] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                i6();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                clearInterval(myInterval);
                if (val1()) {
                    tt1();
                    return this.next();
                } else M.toast({ html: "Choose the Set variable in the toolbox" });
            },
            text: "Next",
        },
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5?6uR0c78Jtk_Ki~{=6^" x="70" y="206"><field name="Variable name">dummy_increment</field><value name="NAME"><block type="math_number" id="C6A=pkbD{%nVU?@m6_:4"><field name="NUM">0</field></block></value></block></xml>',
    });

    tour.addStep({
        eval() {
            return val2();
        },
        title: "Step 3",
        text: tut[8] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                t1();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                if (val2()) {
                    i7();
                    return this.next();
                } else
                    M.toast({
                        html: "Choose the pizza slice 1 in dropdown",
                    });
            },
            text: "Next",
        },
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5?6uR0c78Jtk_Ki~{=6^" x="70" y="206"><field name="Variable name">plate1</field><value name="NAME"><block type="math_number" id="C6A=pkbD{%nVU?@m6_:4"><field name="NUM">0</field></block></value></block></xml>',
    });


    tour.addStep({
        eval() {
            // return check_toolbox_selection("blockly-0");
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
        },
        title: "Step 4.1",
        text: tut[9],
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                i6();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    ttt1();
                    return this.next();
                } else
                    M.toast({
                        html: "Choose the select variable put under select variable",
                    });
            },
            text: "Next",
        },
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5?6uR0c78Jtk_Ki~{=6^" x="70" y="206"><field name="Variable name">plate1</field><value name="NAME"><block type="math_number" id="C6A=pkbD{%nVU?@m6_:4"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="}}6%La5;rnfVs9V3:|Zd"><field name="Variable name">plate2</field><value name="NAME"><block type="math_number" id="tt(]jc}N2zL*quM((B(u"><field name="NUM">0</field></block></value></block></next></block></xml>',
    });

    tour.addStep({
        eval() {
            return val3();
        },
        title: "Step 4.2",
        text: tut[91] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                i7()
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                if (val3()) {
                    i8();
                    return this.next();
                } else
                    M.toast({
                        html: "Choose the select variable put under select variable",
                    });
            },
            text: "Next",
        },
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5?6uR0c78Jtk_Ki~{=6^" x="70" y="206"><field name="Variable name">plate1</field><value name="NAME"><block type="math_number" id="C6A=pkbD{%nVU?@m6_:4"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="}}6%La5;rnfVs9V3:|Zd"><field name="Variable name">plate2</field><value name="NAME"><block type="math_number" id="tt(]jc}N2zL*quM((B(u"><field name="NUM">0</field></block></value></block></next></block></xml>',
    });

    tour.addStep({
        eval() {
            return val4();
        },
        title: "Step 5",
        text: tut[10] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                ttt1();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                if (val4()) {
                    i9();
                    return this.next();
                } else M.toast({ html: "Choose the correct values" });
            },
            text: "Next",
        },
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5?6uR0c78Jtk_Ki~{=6^" x="70" y="206"><field name="Variable name">plate1</field><value name="NAME"><block type="math_number" id="C6A=pkbD{%nVU?@m6_:4"><field name="NUM">2</field></block></value><next><block type="set_variable_holder" id="}}6%La5;rnfVs9V3:|Zd"><field name="Variable name">plate2</field><value name="NAME"><block type="math_number" id="tt(]jc}N2zL*quM((B(u"><field name="NUM">4</field></block></value></block></next></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[1].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection("blockly-1");
        },
        title: "Step 6",
        text: tut[11],
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                clearInterval(myInterval);
                handPointAt($("#hand"), $($(".blocklyEditableText")[1]), "hidden");
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t3();
                    return this.next();
                } else M.toast({ html: "Choose the Serve in the toolbox" });
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
        title: "Step 7",
        text: tut[12] + add_back_button() + add_next_button(),
        arrow: true,
        // attachTo: { element: "#circle", on: adapt_orientation("bottom", "bottom") },
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action() {
                clearInterval(myInterval);
                handPointAt($("#hand"), $("#blockly-1"), "visible");
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                if (val5()) {
                    i10();
                    return this.next();
                } else
                    M.toast({ html: "Choose the serve block drag under variable block" });
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
        title: "Run Code",
        text: tut[13],
        arrow: true,
        buttons: [{
            action() {
                t3();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action() {
                // handPointAt($("#hand"), $($(".runbtn")[2]), "hidden");
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

    //event for audioBtn
    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
    console.log(tour);
}



function i1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[1].mp3")
}



function i2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[2].mp3")
}



function i3() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[3].mp3")
}



function i4() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[4].mp3")
}



function i5() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[5].mp3")
}



function i6() {
    play_audio_tutorial("tut[6].mp3")
    clearInterval(myInterval);
    // handPointAt($("#hand"), $("#blockly-0"), "visible");
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
}



function t1() {
    play_audio_tutorial("tut[7].mp3")
    clearInterval(myInterval);
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



function tt1() {
    play_audio_tutorial("tut[8].mp3")
    clearInterval(myInterval);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyEditableText")[1]), "visible");
    }, 100);
}



function i7() {
    play_audio_tutorial("tut[9].mp3")
    clearInterval(myInterval);
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), "visible");
}


function ttt1() {
    play_audio_tutorial("tut[91].mp3")
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
    let krr = false;
    myInterval = setInterval(function () {

        if (Blockly.Python.workspaceToCode(demoWorkspace) == 'plate1 = 0\ndummy_increment = 0\n') {
            handPointAt($("#hand"), $($(".blocklyEditableText")[3]), "visible");
        } else {
            if (krr) {
                handPointAt($("#hand"), $($(".blocklyDraggable")[2]), "visible");
                krr = !krr;
            } else {
                handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible");
                krr = !krr;
            }
        }
    }, 1500);

    // tour.start();
    // tour.show(nextStep);

    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
}



function i8() {
    play_audio_tutorial("tut[10].mp3");
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "hidden");
}




function i9() {
    play_audio_tutorial("tut[11].mp3")
    clearInterval(myInterval);
    handPointAt($("#hand"), $("#blockly-1"), "visible");
}



function t3() {
    play_audio_tutorial("tut[12].mp3")
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



function i10() {
    play_audio_tutorial("tut[13].mp3");
    clearInterval(myInterval);
    // handPointAt($("#hand"), $($(".runbtn")[2]), "visible");
    handPointAt($("#hand"), $("#runbtn"), 'visible');
}



function val1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    if (code == "dummy_increment = 0\n") {
        return true;
    } else return false;
}

function val2() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    if (code == "plate1 = 0\n") {
        return true;
    } else return false;
}

function val3() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    if (code == "plate1 = 0\nplate2 = 0\n") {
        return true;
    } else return false;
}

function val4() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    if (code == "plate1 = 2\nplate2 = 4\n") {
        return true;
    } else return false;
}

function val5() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    if (code == "plate1 = 2\nplate2 = 4\nchef.serve()\n") {
        return true;
    } else return false;
}


function v() {
    return true;
}

loadAgain()
window['loadAgain'] = loadAgain

// tour.start();

function check_toolbox_selection(id) {
    console.log(demoWorkspace.getToolbox().selectedItem_.id_ + " " + id)
    try {
        if (demoWorkspace.getToolbox().selectedItem_.id_ === id)
            return true;
        else return false;
    } catch {
        return false;
    }
}

//NGS Sound Enhancement
function setAudioPreference() {
    var elementId;
    if (playAudio) {
        kill_audio();
    }
    if (!playAudio) {
        playAudio = true;
        elementId = document.getElementById("soundButton");
        elementId = document.getElementById("soundButton2");
        document.getElementById("soundButton").src = "assets/unmute.png";
        document.getElementById("soundButton2").src = "assets/unmute.png";
    } else {
        playAudio = false;
        elementId = document.getElementById("soundButton");
        document.getElementById("soundButton").src = "assets/mute.png";
        document.getElementById("soundButton2").src = "assets/mute.png";
    }
}



// ['close', 'cancel', 'complete', 'start', 'show'].forEach(event => tour.on(event, () => {
//     tour_step = tour.steps.indexOf(tour.currentStep);
// }));

// ['complete'].forEach(event => tour.on(event, () => {
//     tour_step = 0;
// }));


// ['close', 'cancel', 'complete'].forEach(event => tour.on(event, () => {
//     clearInterval(myInterval);
//     $("#hand").css("visibility", 'hidden');
// }));

// tour.start()


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

$("#runbtn").on('click', function () {
    try {
        if (tour.getCurrentStep().options.title.includes("Run")) {
            let btns = document.querySelectorAll('.shepherd-button');
            btns[btns.length - 1].click();
        }
    } catch { }
});


document.getElementsByClassName("shepherd-footer")[0].style.display = "none";
document.getElementsByClassName("shepherd-text")[0].style.marginBottom = "15px";