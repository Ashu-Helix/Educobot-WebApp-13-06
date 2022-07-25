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

function amber_ref() {
    $("#amber_ref").toggle("slow");
    $("#amber_ref" + "_btn").toggle();
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
    0: '<p style="text-align: center;"><strong><span style="font-family: Helvetica; font-size: 20px;">Help the officer catch the thieves hiding behind the bushes by identifying their location.</span></strong></p>',
    1: "Touch anywhere on the output screen",
    10: "Now let's enter the coordinates of first thief Hint:(x = 130 and y = 780) in the x and y block",
    11: "Run the program to check if the first thief is caught",
    12: "The police need some time in between before catching the next thief. So let's use a wait block after this action",
    13: "Good job. Now help the officer by catching the other 3 thieves",
    14: "Now let's run the code to check if all the thieves are caught",
    15: "You can become a good detective",
    2: "You can see a white bubble in the top right corner. This shows you the location where you touched, Now try touching anywhere else on the display area.",
    3: "Great!! Now this is how we find the exact location of the thieves ",
    4: "Select Where am I from the tool box",
    5: "Select the Catch block and place it in the workspace",
    6: "Now, Select Where am I again from the tool box",
    61: "Select the x y block and place it inside the catch block",
    8: "Now touch the first thief and note down his x and y position'",
    9: "The numbers of x and y used to indicate the position of any particular object are called coordinates",
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
$("#hand").css("visibility", "hidden");

function play_audio_tutorial(file, lang) {
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
//     defaultStepOptions: {
//         cancelIcon: { enabled: true },
//         classes: "class-1 class-2",
//         scrollTo: { behavior: "smooth", block: "center" },
//     },
// });

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
    title: "Title",
    text: tut[0] + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            // clearInterval(myInterval);
            play_audio_tutorial("tut[1].mp3", lang);

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
    title: "Info",
    text: tut[1] + add_back_button() + add_next_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            play_audio_tutorial("tut[0].mp3", lang);

            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            // if (check_toolbox_selection("sprite-container")) {
            // clearInterval(myInterval);
            // handPointAt($("#hand"), $("#sprite-container"), "hidden");
            play_audio_tutorial("tut[2].mp3", lang);

            return this.next();
            // } else M.toast({ html: "Wrong block or values selected!" });
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
    title: "Info",
    text: tut[2] + add_back_button() + add_next_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            handPointAt($("#hand"), $("#sprite-container"), "visible");
            play_audio_tutorial("tut[1].mp3", lang);

            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            play_audio_tutorial("tut[3].mp3", lang);
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
    title: "Info",
    text: tut[3] + add_back_button() + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            handPointAt($("#hand"), $("#sprite-container"), "hidden");
            play_audio_tutorial("tut[2].mp3", lang);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
    {
        action() {
            clearInterval(myInterval);
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            handPointAt($("#hand"), $("#" + id), "visible");
            play_audio_tutorial("tut[4].mp3", lang);
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
    title: "Step 1",
    text: tut[4],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            if (check_toolbox_selection(id)) {
                t1();
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
    text: tut[5] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val1()) {
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                handPointAt($("#hand"), $(id), "visible");
                play_audio_tutorial("tut[6].mp3", lang);
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="]gM,jQm8%P%|?7[rrk8*" x="199" y="186"></block></xml>`,
});

tour.addStep({
    eval() {
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        return check_toolbox_selection(id);
    },
    title: "Step 3",
    text: tut[6],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            if (check_toolbox_selection(id)) {
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
    text: tut[61] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val2()) {
                clearInterval(myInterval);
                handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "hidden");
                play_audio_tutorial("tut[8].mp3", lang);
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="]gM,jQm8%P%|?7[rrk8*" x="60" y="185"><value name="NAME"><block type="xy" id="bxdqwvnbTl:8tH(L{fAE"><field name="x_coordinate">50</field><field name="y_coordinate">50</field></block></value></block></xml>`,
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Step 4",
    text: tut[8] + add_next_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            play_audio_tutorial("tut[9].mp3", lang);
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
    title: "Info",
    text: tut[9] + add_back_button() + add_next_button(),
    arrow: false,
    // attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            handPointAt($("#hand"), $($(".blocklyOutlinePath")[0]), "hidden");
            play_audio_tutorial("tut[8].mp3", lang);
            return this.back();
        },
        classes: "shepherd-button-secondary",
        text: "Back",
    },
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

tour.addStep({
    eval() {
        return val3();
    },
    title: "Step 5",
    text: tut[10] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val3()) {
                clearInterval(myInterval);
                handPointAt($("#hand"), $($(".neumorphic_button")[2]), "visible");
                play_audio_tutorial("tut[11].mp3", lang);
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="0~RXOQ{cPbe%$%_T!UeU" x="55" y="106"><value name="NAME"><block type="xy" id="T766}Dl/xB+BZCU02Kpp"><field name="x_coordinate">100</field><field name="y_coordinate">750</field></block></value></block></xml>`,
});

tour.addStep({
    eval() {
        return false;
    },
    title: "Run",
    text: tut[11] + add_next_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
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
            clearInterval(myInterval);
            handPointAt($("#hand"), $($(".neumorphic_button")[2]), "hidden");
            play_audio_tutorial("tut[13].mp3", lang);
            return this.next();
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
    title: "Last Step",
    text: tut[13] + add_rescue_button(),
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            if (val4()) {
                clearInterval(myInterval);
                handPointAt($("#hand"), $($(".neumorphic_button")[2]), "visible");
                play_audio_tutorial("tut[14].mp3", lang);
                isRunBtnClicked = false;
                return this.next();
            } else M.toast({ html: "Wrong block or values selected!" });
        },
        text: "Next",
    },],
    id: "creating",
    workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="catch_block" id="-q]J{P*_$p3e6l6-8rNx" x="46" y="174"><value name="NAME"><block type="xy" id="UtU]Mw|qb(0PFrRQ3WTY"><field name="x_coordinate">130</field><field name="y_coordinate">780</field></block></value><next><block type="catch_block" id="K1/AYK}Q4x|rFBQd^n.]"><value name="NAME"><block type="xy" id="BRiYK09SLV0^sUY.nNq["><field name="x_coordinate">660</field><field name="y_coordinate">810</field></block></value><next><block type="catch_block" id="tgyMGZN(pts9!mq;{an?"><value name="NAME"><block type="xy" id="%1Pad4p)!)2^%+jR_z2?"><field name="x_coordinate">1220</field><field name="y_coordinate">722</field></block></value><next><block type="catch_block" id="U0wFOk~g}9?)_)[qPC=!"><value name="NAME"><block type="xy" id="X6x3cya9R+O[wpGdLJ{="><field name="x_coordinate">1720</field><field name="y_coordinate">750</field></block></value></block></next></block></next></block></next></block></xml>',
});

tour.addStep({
    eval() {
        return isRunBtnClicked;
    },
    title: "Run and see what happens",
    text: tut[14],
    arrow: false,
    attachTo: { element: "#sprite-container", on: adapt_orientation("bottom", "bottom") },
    // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
    buttons: [{
        action() {
            clearInterval(myInterval);
            handPointAt($("#hand"), $($(".neumorphic_button")[2]), "hidden");
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

function t1() {
    clearInterval(myInterval);
    play_audio_tutorial("tut[5].mp3", lang);
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
    play_audio_tutorial("tut[10].mp3", lang);
    handPointAt($("#hand"), $($(".blocklyFieldRect")[0]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyFieldRect")[0]), "visible");
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyFieldRect")[1]), "visible");
            krr = !krr;
        }
    }, 1500);
}



function val1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "police.catch_Robber()\n") {
        return true;
    } else return false;
}

function val2() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "police.catch_Robber(50, 50)\n") {
        return true;
    } else return false;
}

function val3() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(/police\.catch_Robber\((...), (...)\)/);
    let x = matches[1];
    let y = matches[2];
    console.log("Before If ", matches);
    if (x > 20 && x < 354 && y > 722 && y < 1071) {
        console.log("In Outerb If ", matches);
        if (codep == "police.catch_Robber(" + x + ", " + y + ")\n") {
            console.log(codep);
            return true;
        } else return false;
    } else return false;
}

function val4() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());
    var matches = codep.match(
        /police\.catch_Robber\((...), (...)\)\npolice\.catch_Robber\((...), (...)\)\npolice\.catch_Robber\((....), (...)\)\npolice\.catch_Robber\((....), (...)\)\n/
    );
    let x = matches[1];
    let y = matches[2];
    let x1 = matches[3];
    let y1 = matches[4];
    let x2 = matches[5];
    let y2 = matches[6];
    let x3 = matches[7];
    let y3 = matches[8];
    [{ x1: 1, y1: 630, x2: 354, y2: 1071, name: 'robSpritesheet_1' },
    { x1: 434, y1: 630, x2: 800, y2: 1071, name: 'robSpritesheet_2' },
    { x1: 1071, y1: 630, x2: 1460, y2: 1071, name: 'robSpritesheet_3' },
    { x1: 1574, y1: 630, x2: 1902, y2: 1071, name: 'robSpritesheet_4' }
    ]
    if (
        x > 1 &&
        x < 354 &&
        y > 630 &&
        y < 1071 &&
        x1 > 434 &&
        x1 < 800 &&
        y1 > 630 &&
        y1 < 1071 &&
        x2 > 1071 &&
        x2 < 1460 &&
        y2 > 630 &&
        y2 < 1071 &&
        x3 > 1574 &&
        x3 < 1902 &&
        y3 > 630 &&
        y3 < 1071
    ) {
        if (
            codep ==
            "police.catch_Robber(" +
            x +
            ", " +
            y +
            ")\npolice.catch_Robber(" +
            x1 +
            ", " +
            y1 +
            ")\npolice.catch_Robber(" +
            x2 +
            ", " +
            y2 +
            ")\npolice.catch_Robber(" +
            x3 +
            ", " +
            y3 +
            ")\n"
        ) {
            return true;
        } else return false;
    } else return false;
}

function say_congrats() {
    const tour1 = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: { enabled: true },
            classes: "class-1 class-2",
            scrollTo: { behavior: "smooth", block: "center" },
        },
    });
    tour1.addStep({
        title: "Congratulations!",
        text: `<img src="assets/guide/well_done.png"width="300"height="300">`,
        arrow: false,
        attachTo: { element: "#sprite-container", on: "left" },
        buttons: [{
            action() {
                return this.next();
            },
            text: "Finish",
        },],
        id: "creating",
    });
    tour1.start();
}

function v() {
    return true;
}
tour.start();

function check_toolbox_selection(id) {
    try {
        if (demoWorkspace.getToolbox().selectedItem_.id_ === id) return true;
        else return false;
    } catch {
        return false;
    }
}

// function v() {
//     return true;
// }
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

// ["close", "cancel", "complete", "start", "show"].forEach((event) =>
//     tour.on(event, () => {
//         tour_step = tour.steps.indexOf(tour.currentStep);
//     })
// );

// ["complete"].forEach((event) =>
//     tour.on(event, () => {
//         tour_step = 0;
//     })
// );

// ["close", "cancel", "complete"].forEach((event) =>
//     tour.on(event, () => {
//         clearInterval(myInterval);
//         $("#hand").css("visibility", "hidden");
//     })
// );

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