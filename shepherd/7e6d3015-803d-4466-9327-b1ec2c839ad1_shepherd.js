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
let tour_step = 0;

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
            tour.steps[i].options.attachTo.on = isPortrait() ?
                adapt_orientation_array[i][0] :
                adapt_orientation_array[i][1];
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
    0: '<h5>In this lesson we will guide the mouse through the maze to reach the cheese and eat it</h5>',
    1: "There are 2 stages to achieve this: <br>(1) To code the arrow keys to move the mouse in various direction <br>(2) To set the final aim of the game",
    2: "Validate the outcome of the code at regular interval",
    3: "From the tool menu select Loops",
    4: "Now select the Repeat forever block from Loops and drag it to the workspace",
    5: "If left arrow key is pressed the mouse must move left",
    45: "let's code the left arrow key now",
    6: "From the tool menu Select Conditions",
    7: "Select if condition block and place it inside repeat forever block in the workspace",
    8: "Now select Events from the tool menu",
    9: "Select the key pressed block and place it inside if block, then select left arrow from the drop down",
    10: "From the tool menu select Actions, So we can move the mouse in desired direction",
    11: "Drag the move block inside the if condition block",
    12: "Hit the Run code, press left arrow and see the mouse move",
    13: "Great! Now use else if conditions and code the movements for right, up and down similarly",
    14: "Good job! You have successfully coded all direction keys. Now we code the final stage to finish the game",
    15: "If the mouse touches cheese then mouse should eat the cheese",
    16: "Try coding yourself using the if condition block and the touch block from Events under the tool menu",
    17: "That's great now hit the green flag and enjoy hunting cheese",
};

function handPointAt(hand, element, visibility) {
    if (tour.steps.indexOf(tour.currentStep) - rescue_button_clicked_at_step > 1) {
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
        $("#hand").css("visibility", 'hidden');

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

function rescue_button_set_colour() {
    if (rescue_colour_is_yellow) {
        document.querySelectorAll("#rescue_button_id").forEach((i) => { i.className = "shepherd-custom-rescue-button-yellow"; })
    } else {
        document.querySelectorAll("#rescue_button_id").forEach((i) => { i.className = "shepherd-custom-rescue-button-white"; })
    }
}


function change_rescue_button_colour(event) {
    if (event.type == Blockly.Events.BLOCK_CHANGE || event.type == Blockly.Events.BLOCK_CREATE || event.type == Blockly.Events.BLOCK_DELETE || event.type == Blockly.Events.BLOCK_MOVE) {
        rescue_colour_is_yellow = true;
        rescue_button_set_colour();
    }
}
demoWorkspace.addChangeListener(change_rescue_button_colour);

function hideHand() {
    clearInterval(myInterval);
    handPointAt($("#hand"), $($("#blockly-0")), 'hidden');
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($("#blockly-0")), 'hidden');
    }, 1500);
}

function handOnRun() {
    clearInterval(myInterval);
    // handPointAt($("#hand"), $($(".runbtn")[2]), 'visible');
    handPointAt($("#hand"), $("#runbtn"), 'visible');
    myInterval = setInterval(function () {
        // handPointAt($("#hand"), $($(".runbtn")[2]), 'visible');
        handPointAt($("#hand"), $("#runbtn"), 'visible');
    }, 1500);
}

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

function loadAgain() {
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
        eval() { return false },
        title: "Introduction",
        arrow: false,
        text: tut[0] + add_next_button(),
        buttons: [{
            action: function () {
                i1();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return false },
        title: "Step 1",
        text: tut[1] + add_back_button() + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () {
                play_audio_tutorial("tut[0].mp3");
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                i2();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return false },
        title: "Step 2",
        text: tut[2] + add_back_button() + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () {
                i1()
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                t2();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[3].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-3')
        },
        title: "Step 3.1",
        text: tut[3],
        arrow: false,
        attachTo: { element: ".blocklyToolboxContents", on: adapt_orientation("right", "left") },
        buttons: [{
            action: function () {
                i2();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        },
        {
            action: function () {
                let id = (demoWorkspace.getToolbox().contents_[3].id_)
                if (check_toolbox_selection(id)) {
                    t3();
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }
        ],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return step3_val()
        },
        title: "Step 3.2",
        text: tut[4] + add_rescue_button(),
        arrow: false,
        attachTo: { element: ".injectionDiv", on: adapt_orientation("right", "left") },
        buttons: [{
            action: function () {
                t2();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        },
        {
            action: function () {
                if (step3_val()) {
                    i3();
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="yY7^}y6=ZXNZlDjm_h%v" x="134" y="135"></block></xml>',
    });

    tour.addStep({
        eval() { return false },
        title: "Step 4",
        text: tut[5] + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () {
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                i4()
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return false },
        title: "Step 5",
        text: tut[45] + add_back_button() + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () {
                i3();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                return t5(), this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[2].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-2')
        },
        title: "Step 5.1",
        text: tut[6],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t5();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        },
        {
            action: function () {
                let id = (demoWorkspace.getToolbox().contents_[2].id_)
                if (check_toolbox_selection(id)) {
                    t5_1()
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }
        ],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return step5_val()
        },
        title: "Step 5.2",
        text: tut[7] + add_rescue_button(),
        arrow: false,
        attachTo: { element: ".injectionDiv", on: adapt_orientation("top", "left") },
        buttons: [{
            action: function () {
                t5();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step5_val()) {
                    t5_2();
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml><block type="forever_repeat_block" id="iv4E3Hf$c[zYz!_o+hS$" x="96" y="129"><statement name="NAME"><block type="controls_if" id="Z{,G{q3/w2i8P!7JqK(."></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-0')
        },
        title: "Step 6.1",
        text: tut[8],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t5_1();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        },
        {
            action: function () {
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    t6_1();
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }
        ],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return step6_val();
        },
        title: "Step 6.2",
        text: tut[9] + add_rescue_button(),
        arrow: false,
        attachTo: { element: ".injectionDiv", on: adapt_orientation("right", "left") },
        buttons: [{
            action: function () {
                t5_2()
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        },
        {
            action: function () {
                if (step6_val()) {
                    t6_2()
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="iv4E3Hf$c[zYz!_o+hS$" x="97" y="143"><statement name="NAME"><block type="controls_if" id="6zxsU]!w#3|/=J{;t)Qs"><value name="IF0"><block type="key_sensing" id="Xm/DsoR/gGC}bQare8e?"><field name="NAME">left</field></block></value></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[1].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-1')
        },
        title: "Step 7.1",
        text: tut[10],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t6_1();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                let id = (demoWorkspace.getToolbox().contents_[1].id_)
                if (check_toolbox_selection(id)) {
                    t7()
                    return this.next()
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return step7_val()
        },
        title: "Step 7.2",
        text: tut[11] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t6_2()
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step7_val()) {
                    i5()
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="iv4E3Hf$c[zYz!_o+hS$" x="97" y="143"><statement name="NAME"><block type="controls_if" id="6zxsU]!w#3|/=J{;t)Qs"><value name="IF0"><block type="key_sensing" id="Xm/DsoR/gGC}bQare8e?"><field name="NAME">left</field></block></value><statement name="DO0"><block type="move_mouse" id="{h.COP]9+_SD8F3J9R+|"><field name="NAME">left</field></block></statement></block></statement></block></xml>',
    });

    tour.addStep({
        eval() {
            return false;
        },
        title: "Run code",
        text: tut[12] + add_next_button(),
        arrow: false,
        attachTo: {
            element: "#sprite-container",
            on: adapt_orientation("bottom", "bottom"),
        },
        buttons: [{
            action: function () {
                t7();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action: function () {
                i6();
                return this.next();
            },
            text: "Next",
        },
        ],
        id: "creating",
    });

    tour.addStep({
        eval() {
            return step8_val();
        },
        title: "Step 8",
        text: tut[13] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                i5();
                return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back",
        },
        {
            action: function () {
                if (step8_val()) {
                    i9();
                    return this.next();
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next",
        },
        ],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="iv4E3Hf$c[zYz!_o+hS$" x="93" y="43"><statement name="NAME"><block type="controls_if" id="6zxsU]!w#3|/=J{;t)Qs"><mutation elseif="3"></mutation><value name="IF0"><block type="key_sensing" id="Xm/DsoR/gGC}bQare8e?"><field name="NAME">left</field></block></value><statement name="DO0"><block type="move_mouse" id="{h.COP]9+_SD8F3J9R+|"><field name="NAME">left</field></block></statement><value name="IF1"><block type="key_sensing" id="gq.;x6cfs*mi{X1vV1]t"><field name="NAME">right</field></block></value><statement name="DO1"><block type="move_mouse" id="D$a9ltH.i7$Xn/aj.~yZ"><field name="NAME">right</field></block></statement><value name="IF2"><block type="key_sensing" id="-khSXX,O@wha(2aW6fM9"><field name="NAME">up</field></block></value><statement name="DO2"><block type="move_mouse" id="MoM6.pHzMxkUw+nRvvKD"><field name="NAME">up</field></block></statement><value name="IF3"><block type="key_sensing" id="*B.GdL3#nDnqCsKGG(^M"><field name="NAME">down</field></block></value><statement name="DO3"><block type="move_mouse" id="Tx2SjLwPGXN%,^:;H{rj"><field name="NAME">down</field></block></statement></block></statement></block></xml>',
    });

    tour.addStep({
        eval() { return false },
        title: "Step 9",
        text: tut[14] + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () {
                i6();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                i10();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return false },
        title: "step 10",
        text: tut[15] + add_back_button() + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () {
                i9();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                i11();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return step10_val()
        },
        title: "step 11",
        text: tut[16] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                i10();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step10_val()) {
                    return (
                        i12(),
                        this.next()
                    )
                }
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="forever_repeat_block" id="iv4E3Hf$c[zYz!_o+hS$" x="93" y="43"><statement name="NAME"><block type="controls_if" id="6zxsU]!w#3|/=J{;t)Qs"><mutation elseif="3"></mutation><value name="IF0"><block type="key_sensing" id="Xm/DsoR/gGC}bQare8e?"><field name="NAME">left</field></block></value><statement name="DO0"><block type="move_mouse" id="{h.COP]9+_SD8F3J9R+|"><field name="NAME">left</field></block></statement><value name="IF1"><block type="key_sensing" id="gq.;x6cfs*mi{X1vV1]t"><field name="NAME">right</field></block></value><statement name="DO1"><block type="move_mouse" id="D$a9ltH.i7$Xn/aj.~yZ"><field name="NAME">right</field></block></statement><value name="IF2"><block type="key_sensing" id="-khSXX,O@wha(2aW6fM9"><field name="NAME">up</field></block></value><statement name="DO2"><block type="move_mouse" id="MoM6.pHzMxkUw+nRvvKD"><field name="NAME">up</field></block></statement><value name="IF3"><block type="key_sensing" id="*B.GdL3#nDnqCsKGG(^M"><field name="NAME">down</field></block></value><statement name="DO3"><block type="move_mouse" id="Tx2SjLwPGXN%,^:;H{rj"><field name="NAME">down</field></block></statement><next><block type="controls_if" id="DQ4U-?|Ej4Q?3HfqC6OL"><value name="IF0"><block type="spritetouch__block" id="Fd/,*cT~@*cgW~DfmMc%"><field name="options1">mouse</field><field name="options2">cheese</field></block></value><statement name="DO0"><block type="eat_block" id="Y.o0i)~zY~_I0{MzTTnA"></block></statement></block></next></block></statement></block></xml>',
    });

    tour.addStep({
        eval() { return false },
        title: "Run and play the game",
        text: tut[17],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                i11();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                hideHand()
                return this.next()
            },
            text: "Finish"
        }],
        id: "creating"
    });

    tour.start();
    tour.show(nextStep);

    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
}



function i1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[1].mp3")
}


function i2() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[2].mp3")
}

function t2() {
    play_audio_tutorial("tut[3].mp3")
    // handPointAt($("#hand"), $($("#blockly-3")), 'visible');
    let id = (demoWorkspace.getToolbox().contents_[3].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
    clearInterval(myInterval);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#" + id), 'visible');
    }, 1500);
}

function t3() {
    play_audio_tutorial("tut[4].mp3")
    handPointAt($("#hand"), $(($(".blocklyDraggable")[0])), "visible")
    clearInterval(myInterval);
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $("#blocklyDiv"), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $(($(".blocklyDraggable")[0])), 'visible');
            krr = !krr;
        }
    }, 1500);
}



function i3() {
    play_audio_tutorial("tut[5].mp3")
    hideHand();
}



function i4() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[45].mp3");
}


function t5() {
    play_audio_tutorial("tut[6].mp3")
    let id = (demoWorkspace.getToolbox().contents_[2].id_)
    handPointAt($("#hand"), $(("#" + id)), 'visible');
    clearInterval(myInterval);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $(("#" + id)), 'visible');
    }, 1500);
}


function t5_1() {
    play_audio_tutorial("tut[7].mp3")
    handPointAt($("#hand"), $(($(".blocklyDraggable")[1])), 'visible');
    clearInterval(myInterval);
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $(($(".blocklyDraggable")[0])), "visible")
            krr = !krr;
        } else {
            handPointAt($("#hand"), $(($(".blocklyDraggable")[1])), 'visible');
            krr = !krr;
        }
    }, 1500);
}

function t5_2() {
    play_audio_tutorial("tut[8].mp3")
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $(("#" + id)), 'visible');
    // handPointAt($("#hand"), $($("#blockly-0")), 'visible');
    clearInterval(myInterval);
    myInterval = setInterval(function () {
        // handPointAt($("#hand"), $($("#blockly-0")), 'visible');
        handPointAt($("#hand"), $(("#" + id)), 'visible');
    }, 1500);
}


function t6_1() {
    play_audio_tutorial("tut[9].mp3")
    handPointAt($("#hand"), $(($(".blocklyDraggable")[2])), "visible")
    clearInterval(myInterval);
    let krr = false;
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    myInterval = setInterval(function () {
        if (check_toolbox_selection(id)) {
            if (krr) {
                handPointAt($("#hand"), $(($(".blocklyDraggable")[2])), "visible")
                krr = !krr;
            } else {
                handPointAt($("#hand"), $($('.blocklyOutlinePath')[0]), 'visible');
                krr = !krr;
            }

        } else {
            handPointAt($("#hand"), $("#" + id), 'visible');
        }
    }, 1500);
}


function t6_2() {
    play_audio_tutorial("tut[10].mp3")
    let id = (demoWorkspace.getToolbox().contents_[1].id_)
    // handPointAt($("#hand"), $(("#blockly-1")), 'visible')
    handPointAt($("#hand"), $("#" + id), 'visible');
    clearInterval(myInterval);
    myInterval = setInterval(function () {
        // handPointAt($("#hand"), $(("#blockly-1")), 'visible')
        handPointAt($("#hand"), $("#" + id), 'visible');
    }, 1500);
}


function t7() {
    play_audio_tutorial("tut[11].mp3")
    handPointAt($("#hand"), $(($(".blocklyDraggable")[3])), "visible");
    clearInterval(myInterval);
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $(($(".blocklyDraggable")[3])), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $(($(".blocklyDraggable")[1])), 'visible');
            krr = !krr;
        }
    }, 1500);
}

function i5() {
    play_audio_tutorial("tut[12].mp3")
    handOnRun();
    clearInterval(myInterval);
}

function i6() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[13].mp3")
    hideHand();
}



function i9() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[14].mp3");
}


function i10() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[15].mp3");
}



function i11() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[16].mp3");
}



function i12() {
    play_audio_tutorial("tut[17].mp3");
    handOnRun();
}



function say_congrats() {
    var a = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: !0 }, classes: "class-1 class-2", scrollTo: { behavior: "smooth", block: "center" } } });
    a.addStep({ title: "Congratulations!", text: "Well Done!", arrow: false, attachTo: { element: "#body", on: "auto" }, buttons: [{ action: function () { return this.next() }, text: "Finish" }], id: "creating" });
    a.start()
}


function step3_val() { Blockly.Python.INFINITE_LOOP_TRAP = null; return "while true:\n" == Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase() ? !0 : !1 }

function step5_val() { Blockly.Python.INFINITE_LOOP_TRAP = null; return "while true:\n  if false:\n    pass\n" == Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase() ? !0 : !1 }

function step6_val() { Blockly.Python.INFINITE_LOOP_TRAP = null; return "while true:\n  if is_left_arrow_pressed():\n    pass\n" == Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase() ? !0 : !1 }

function step7_val() { Blockly.Python.INFINITE_LOOP_TRAP = null; return "while true:\n  if is_left_arrow_pressed():\n    mouse.move_left()\n" == Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase() ? !0 : !1 }

function step8_val() { Blockly.Python.INFINITE_LOOP_TRAP = null; return 'while true:\n  if is_left_arrow_pressed():\n    mouse.move_left()\n  elif is_right_arrow_pressed():\n    mouse.move_right()\n  elif is_up_arrow_pressed():\n    mouse.move_up()\n  elif is_down_arrow_pressed():\n    mouse.move_down()\n' == Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase() ? !0 : !1; }

function step10_val() { Blockly.Python.INFINITE_LOOP_TRAP = null; return "while true:\n  if is_left_arrow_pressed():\n    mouse.move_left()\n  elif is_right_arrow_pressed():\n    mouse.move_right()\n  elif is_up_arrow_pressed():\n    mouse.move_up()\n  elif is_down_arrow_pressed():\n    mouse.move_down()\n  if is_mouse_touching_cheese():\n    mouse.eat_cheese_when_found()\n" == Blockly.Python.workspaceToCode(demoWorkspace).toLowerCase() ? !0 : !1 }


function check_toolbox_selection(id) {
    try {
        if (demoWorkspace.getToolbox().selectedItem_.id_ === id)
            return true;
        else return false;
    } catch {
        return false;
    }
}

// document.getElementById('soundBtn').addEventListener('click', shepherd_mute_unmute)
let interval = setInterval(() => {
    if (document.getElementById('soundBtn') !== null) {
        document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
        clearInterval(interval);
    }
}, 1000);

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
window.addEventListener('resize', () => { for (let i = 0; i < tour.steps.length; i++) { try { tour.steps[i].options.attachTo.on = isPortrait() ? adapt_orientation_array[i][0] : adapt_orientation_array[i][1]; } catch (error) { true; } } });

$("#runbtn").on('click', function () {
    try {
        if (tour.getCurrentStep().options.title.includes("Run")) {
            let btns = document.querySelectorAll('.shepherd-button');
            btns[btns.length - 1].click();
        }
    } catch { }
});

['close', 'cancel', 'complete', 'start', 'show'].forEach(event => tour.on(event, () => {
    tour_step = tour.steps.indexOf(tour.currentStep);
}));

['complete'].forEach(event => tour.on(event, () => {
    tour_step = 0;
}));


['close', 'cancel', 'complete'].forEach(event => tour.on(event, () => {
    clearInterval(myInterval);
    $("#hand").css("visibility", 'hidden');
}));

// tour.start()
loadAgain()
window['loadAgain'] = loadAgain
