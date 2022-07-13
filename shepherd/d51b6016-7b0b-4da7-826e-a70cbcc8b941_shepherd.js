import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

const slug = window["slug"];
let lang = window["language"]
window['rescue_btn_click_count'] = 0
window['total_rescue_btns'] = 0

const demoWorkspace = Blockly.getMainWorkspace();

var tour_over = false;
var playAudio = true;
let myInterval;
var audio = { paused: true };
let kill_audio = () => { if (!audio.paused) audio.pause(); }
let isPortrait = () => (screen.width <= 600 ? true : false);
var adapt_orientation_array = [];
let language = { guide_folder: 'guide', language_packs_folder: 'languages', language: 'english', audio_folder: 'audio', image_folder: 'images', }
let adapt_orientation = (portait, landscape) => {
    adapt_orientation_array.push([portait, landscape])
    return isPortrait() ? portait : landscape;
}

function hint_maker(a, id, txt) {
    return '<button id="' + id + '_btn" class="hoverable waves-effect waves-light btn-small grey darken-4" onclick="' + id + '();">' + txt + '</button><img id = "' + id + '" src = "../assets/' + (language.guide_folder + "/" + slug + "/" + language.language_packs_folder + "/" + language.language + "/" + language.image_folder + "/") + a + '" class="responsive-img tutorial_image" style="display:none">'
}

function amber_ref() {
    $("#amber_ref").toggle("slow");
    $("#amber_ref" + "_btn").toggle();
}


function image_scaler(file) {
    let path = `assets/` + language.guide_folder + `/` + language.language_packs_folder + `/` + language.language + `/` + language.image_folder + `/`; return `<img src="` + path + file + `"class="tutorial_image">`
}

const tut = {
    0: `<p style="text-align: center;"><strong><span style="font-family: Helvetica; font-size: 20px;">There are 3 Nests in this lesson, The first nest has 3 birds, the second nest has no birds, and the third nest has 5 birds.</span></strong></p>`,
    1: `The objective of this lesson is to pass the right number of birds to nest 2 so that when we add nest 1 and nest 2 we get the total number of birds in nest 3`,
    2: `Nest1 + Nest2 = Nest3. We need something to store the number of birds for each nest before passing them to the nest.`,
    3: `Variables are memory holders. You can use variables to store numbers, words and many more.`,
    4: `Let's use Variables to make our task easier.`,
    51: `From the tool menu select Game Variables`,
    5: `Choose the set variables block and drag it to the workspace`,
    6: `Select Nest 1 from the drop-down menu, Nest 1 already has 3 birds so let's leave it equal to 0`,
    71: `From the tool menu select Game Variables again`,
    7: `Now select the set variables block and place it under the earlier set variables block.`,
    72: `Choose nest 2 from the drop-down menu`,
    8: `Nest 1 has 3 birds, now enter the number of birds we need to sit in nest 2 to get a total of 5 birds in nest 3.`,
    91: `After you have set the number of birds for nest 2. It's time to send the birds to the nest.`,
    9: `From tool menu select Send Bird to the Nest block and place under the last block in work space`,
    10: `Now hit the green flag to run the code.`,
    11: `Congratulations.`,
};

// function handPointAt(hand, element, visibility) {

//     // let pos = {
//     //     top: element.getBoundingClientRect().top,
//     //     left: element.getBoundingClientRect().left,
//     // }
//     let pos = element.offset(),
//         ele_oh = element.outerHeight(true),
//         ele_ow = element.outerWidth(true),
//         h_oh = hand.outerHeight(true),
//         h_ow = hand.outerWidth(true);

//     if (ele_oh > h_oh) {
//         pos.top += (ele_oh - h_oh) / 2;
//     } else {
//         true;
//     }
//     if (ele_ow > h_ow) {
//         pos.left += (ele_ow - h_ow) / 2;
//     }
//     try { hand.css("visibility", visibility); } catch { }
//     try { hand.css("top", pos.top); } catch { }
//     try { hand.css("left", pos.left); } catch { }
//     element.on("dragstop", function (event, ui) {
//         hand.css("top", pos.top);
//         hand.css("left", pos.left);
//     });

// }

function handPointAt(hand, element, visibility) {
    if (
        tour.steps.indexOf(tour.currentStep) - rescue_button_clicked_at_step > 1
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

$("#hand").css("visibility", 'hidden');
function play_audio_tutorial(file) {
    let path = `../assets/` + language.guide_folder + `/` + slug + '/' + language.language_packs_folder + `/` + lang + `/` + language.audio_folder + `/`;
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
    }
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

let rescue_colour_is_yellow = false;
let rescue_button_clicked_at_step = -2;

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

    // const tut = window['tutorials'].map(
    //     (data) => `<p> <span style="">
    //         ${data}
    //     </span></p> `
    // );
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
        title: 'Info 1',
        arrow: true,
        // text: image_scaler("Task.png"),
        text: tut[0] + add_next_button(),
        buttons: [{
            action() {
                clearInterval(myInterval);
                return this.back();
            },
            classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                i1();
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    function i1() {
        clearInterval(myInterval);
        play_audio_tutorial("tut[1].mp3")
    }

    tour.addStep({
        eval() { return false },
        title: 'Info 2',
        arrow: true,
        // text: image_scaler("Task.png"),
        text: tut[1] + add_back_button() + add_next_button(),
        buttons: [{
            action() {
                clearInterval(myInterval);
                play_audio_tutorial("tut[0].mp3")
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                play_audio_tutorial("tut[2].mp3")
                // let id = (demoWorkspace.getToolbox().contents_[0].id_)
                // handPointAt($("#hand"), $("#" + id), 'visible');
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    function i2() {
        clearInterval(myInterval);
        play_audio_tutorial("tut[2].mp3")
    }

    tour.addStep({
        eval() {
            return false;
        },
        title: 'Info 3',
        text: tut[2] + add_back_button() + add_next_button(),
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [{
            action() {
                i1()
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                i3();
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    function i3() {
        clearInterval(myInterval);
        play_audio_tutorial("tut[3].mp3")
    }


    tour.addStep({
        eval() { return step2_val() },
        title: 'Info 4',
        text: tut[3] + add_back_button() + add_next_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                i2();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                i4();
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    function i4() {
        clearInterval(myInterval);
        play_audio_tutorial("tut[4].mp3")
    }

    tour.addStep({
        eval() { return step2_dirn_val() },
        title: 'Info 5',
        text: tut[4] + add_back_button() + add_next_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                i3();
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                i5()
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    function i5() {
        play_audio_tutorial("tut[51].mp3")
        clearInterval(myInterval);
        handPointAt($("#hand"), $("#blockly-0"), "visible");
    }

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
        },
        title: 'Step 1',
        text: tut[51],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                i4();
                return this.back();
            }
            , classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    t1();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() {
            return val1();
        },
        title: 'Step 2',
        text: tut[5] + add_back_button() + add_next_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                i5();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (val1()) {
                    t2();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return val2() },
        title: 'Step 3',
        text: tut[6] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t1();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (val2()) {
                    i9();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5{vt8V0(p9`K^)+vk$uv" x="33" y="172"><field name="Variable name">nest1</field><value name="NAME"><block type="math_number" id="r49uefQM;{[21Q-vn4{s"><field name="NUM">0</field></block></value></block></xml>',
    });

    function i9() {
        play_audio_tutorial("tut[71].mp3");
        clearInterval(myInterval);
        // handPointAt($("#hand"), $("#blockly-0"), "visible");
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        handPointAt($("#hand"), $("#" + id), 'visible');
    }

    tour.addStep({
        eval() {
            // return check_toolbox_selection('blockly-0');
            // return step4_val();
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
        },
        title: 'Step 4',
        text: tut[71] + add_back_button() + add_next_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t2();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id)) {
                    t3();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return vall3() },
        title: 'Step 5',
        text: tut[7] + add_back_button() + add_next_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [
            {
                action() {
                    i9();
                    return this.back();
                }, classes: 'shepherd-button-secondary', text: 'Back'
            }, {
                action() {
                    clearInterval(myInterval);
                    if (vall3()) {
                        i7();
                        return this.next();
                    } else M.toast({ html: "Wrong block or values selected!" });
                },
                text: 'Next'
            }],
        id: 'creating'
    });

    function i7() {
        play_audio_tutorial("tut[72].mp3");
        clearInterval(myInterval);
        handPointAt($("#hand"), $($(".blocklyFieldRect")[1]), "visible");
    }

    tour.addStep({
        eval() { return val3() },
        title: 'Step 6',
        text: tut[72] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t3();
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (val3()) {
                    t4();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="5{vt8V0(p9`K^)+vk$uv" x="33" y="172"><field name="Variable name">nest1</field><value name="NAME"><block type="math_number" id="r49uefQM;{[21Q-vn4{s"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id=".UUO-)Zfs[w6%?)mWXM-"><field name="Variable name">nest2</field><value name="NAME"><block type="math_number" id="0Sh`ik!zq*S^CWL3w2%N"><field name="NUM">0</field></block></value></block></next></block></xml>',
    });

    tour.addStep({
        eval() { return val4() },
        title: 'Step 7',
        text: tut[8] + add_rescue_button(),
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t4();
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (val4()) {
                    i8();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            }, text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="set_variable_holder" id="e.JBv=!-{Zqf~:rq%sb7" x="47" y="112"><field name="Variable name">nest1</field><value name="NAME"><block type="math_number" id="^uYdtP7X@MXMAisiQH$B"><field name="NUM">0</field></block></value><next><block type="set_variable_holder" id="haA1h}mi#M}(^|x)r#.t"><field name="Variable name">nest2</field><value name="NAME"><block type="math_number" id="AN^65gZ9zzAj?I$IopOm"><field name="NUM">2</field></block></value></block></next></block></xml>',
    });

    function i8() {
        play_audio_tutorial("tut[91].mp3")
        clearInterval(myInterval);
        // handPointAt($("#hand"), $("#blockly-1"), "visible");
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        handPointAt($("#hand"), $("#" + id), 'visible');
    }

    tour.addStep({
        eval() {
            // return check_toolbox_selection('blockly-0');
            // return step4_val();
            let id = (demoWorkspace.getToolbox().contents_[1].id_)
            return check_toolbox_selection(id)
        },
        title: 'Step 8',
        text: tut[91],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t4();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[1].id_)

                handPointAt($("#hand"), $(id), "visible");
                if (check_toolbox_selection(id)) {
                    t5();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return val5(); },
        title: 'Step 9',
        text: tut[9] + add_back_button() + add_next_button(),
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                i8();
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (val5()) {
                    t6();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            }, text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return false; },
        title: 'Run Code',
        text: tut[10],
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t5();
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                if (v()) {
                    te();
                    return this.next();
                } else M.toast({ html: "Wrong block or values selected!" });
            }, text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return false; },
        title: 'End',
        text: tut[11],
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t6();
                return this.back();
            }, classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                return this.next();
            }, text: 'Next'
        }],
        id: 'creating'
    });

    tour.start();
    tour.show(nextStep);

    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
}

function te() {
    play_audio_tutorial("tut[11].mp3")
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".neumorphic_button")[2]), "hidden");
}

function val1() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "default_ = 0\n") {
        return true;
    } else return false;
}

function val2() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "nest1 = 0\n") {
        return true;
    } else return false;
}

function vall3() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "nest1 = 0\ndefault_ = 0\n") {
        return true;
    } else return false;
}

function val3() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "nest1 = 0\nnest2 = 0\n") {
        return true;
    } else return false;
}

function val4() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "nest1 = 0\nnest2 = 2\n") {
        return true;
    } else return false;
}

function val5() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "nest1 = 0\nnest2 = 2\nbirds.send_to_nest()\n") {
        return true;
    } else return false;
}

function t1() {
    play_audio_tutorial("tut[5].mp3")
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

function t2() {
    play_audio_tutorial("tut[6].mp3")
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyFieldRect")[0]), "visible");
    let krr = false;
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyFieldRect")[0]), "visible");
    }, 100);
}

function t3() {
    play_audio_tutorial("tut[7].mp3")
    clearInterval(myInterval);
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

function t4() {
    play_audio_tutorial("tut[8].mp3")
    clearInterval(myInterval);
    handPointAt($("#hand"), $($(".blocklyDraggable")[3]), "visible");
}

function t5() {
    play_audio_tutorial("tut[9].mp3")
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

function t6() {
    play_audio_tutorial("tut[10].mp3")
    clearInterval(myInterval);
    myInterval = setInterval(function () {
        // handPointAt($("#hand"), $($(".neumorphic_button")[2]), "visible");
        handPointAt($("#hand"), $("#runbtn"), 'visible');
    }, 100);
}

function t7() {
    clearInterval(myInterval);
    // play_audio_tutorial("line16.mp3");
    let krr = false;
    handPointAt($("#hand"), $($(".blocklyDraggable")[2]), 'visible');
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), 'visible');
            krr = !krr;
        }
    }, 1500);
}

function t8() {
    clearInterval(myInterval);
    // play_audio_tutorial("line16B.mp3");
    // myInterval = setInterval(function() {
    //     handPointAt($("#hand"), $($(".blocklyFieldRect.blocklyDropdownRect")[3]), 'visible');
    // }, 100);
    handPointAt($("#hand"), $($(".blocklyDraggable")[1]), 'hidden');
}
function step2_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "farm.moveAnimalToShelter('horse', 'sty')\n") { return true; } else return false;
}

function step2_dirn_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "farm.moveAnimalToShelter('horse', 'stable')\n") { return true; } else return false; }

function step2_steps_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(40)\n") { return true; } else return false; }

function step3_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(0)\n") { return true; } else return false; }

function step4_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\n") { return true; } else return false; }

function step4_2_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.Python.workspaceToCode(demoWorkspace);
    if (code == "bunny.right(40)\nbunny.eat_carrot()\nbunny.left(40)\n" ||
        code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\nfarm.moveAnimalToShelter('pig', 'sty')\ntime.sleep(11)\nfarm.moveAnimalToShelter('cow', 'shed')\n" ||
        code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\nfarm.moveAnimalToShelter('pig', 'sty')\ntime.sleep(10)\nfarm.moveAnimalToShelter('cow', 'shed')\n" ||
        code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\nfarm.moveAnimalToShelter('pig', 'sty')\ntime.sleep(12)\nfarm.moveAnimalToShelter('cow', 'shed')\n" ||
        code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\nfarm.moveAnimalToShelter('cow', 'shed')\ntime.sleep(13)\nfarm.moveAnimalToShelter('pig', 'sty')\n" ||
        code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\nfarm.moveAnimalToShelter('cow', 'shed')\ntime.sleep(12)\nfarm.moveAnimalToShelter('pig', 'sty')\n" ||
        code == "farm.moveAnimalToShelter('horse', 'stable')\ntime.sleep(6)\nfarm.moveAnimalToShelter('cow', 'shed')\ntime.sleep(14)\nfarm.moveAnimalToShelter('pig', 'sty')\n"
    ) { tour_over = true; return true; } else return false;
}

function say_congrats() {
    const tour1 = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: true }, classes: 'class-1 class-2', scrollTo: { behavior: 'smooth', block: 'center' } } });
    tour1.addStep({ title: 'Congratulations!', text: `< img src = "assets/guide/well_done.png"width = "300"height = "300" > `, arrow: false, attachTo: { element: '#sprite-container', on: 'left' }, buttons: [{ action() { return this.next(); }, text: 'Finish' }], id: 'creating' });
    tour1.start();
}

function v() { return true; }
loadAgain()
window['loadAgain'] = loadAgain



function check_toolbox_selection(id) {
    try {
        if (demoWorkspace.getToolbox().selectedItem_.id_ === id)
            return true;
        else return false;
    } catch {
        return false;
    }
}

document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
//NGS Sound Enhancement
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


let footerstyle = `
    .shepherd-footer{ display:none; }
    .shepherd-text{ margin-bottom: 15px; }`;

window.addEventListener('load', (event) => {
    var styleSheet = document.createElement("style")
    styleSheet.innerText = footerstyle;
    document.head.appendChild(styleSheet);
});


document.getElementsByClassName("shepherd-footer")[0].style.display = "none";
document.getElementsByClassName("shepherd-text")[0].style.marginBottom = "15px";