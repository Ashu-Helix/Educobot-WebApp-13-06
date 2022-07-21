import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
// import { right } from "../game/4bda4814-a2b1-4c4f-b102-eda5181bd0f8/main";

const slug = window["slug"];
window['total_rescue_btns'] = 0;
window['rescue_btn_click_count'] = 0;

var demoWorkspace = Blockly.getMainWorkspace()
var tour_over = false;
var playAudio = true;
let myInterval;
var audio = { paused: true };
let kill_audio = () => { if (!audio.paused) audio.pause(); }
var adapt_orientation_array = [];
let language = { guide_folder: 'guide', language_packs_folder: 'languages', language: 'english', audio_folder: 'audio', image_folder: 'images', }
let isPortrait = () => (screen.width <= 600 ? true : false);
let lang = window["language"]
let adapt_orientation = (portait, landscape) => {
    adapt_orientation_array.push([portait, landscape])
    return isPortrait() ? portait : landscape;
}
const tour1 = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: true }, classes: 'class-1 class-2', scrollTo: { behavior: 'smooth', block: 'center' } } });

function image_scaler(file) { let path = `../assets/` + language.guide_folder + `/` + language.language_packs_folder + `/` + language.language + `/` + language.image_folder + `/`; return `<img src="` + path + file + `"class="tutorial_image">` }

let rescue_button_clicked_at_step = -2;

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

function play_audio_tutorial(file, lang) {
    let path = `../assets/` + language.guide_folder + `/` + slug + '/' + language.language_packs_folder + `/` + lang + `/` + language.audio_folder + `/`;
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
    }
}
function play_audio_rescue_warning() {
    let file = "";
    let path = `assets/sounds/rescue_warning.mp3`;
    kill_audio();
    // if (playAudio) {
    audio = new Audio(path + file);
    audio.play();
    // }
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
    btns[0].click();
}

function add_next_button() {
    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' class='shepherd-custom-rescue-button-white' onclick='next_button_click();'>Next</button></div>"
}

function add_back_button() {
    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' class='shepherd-custom-rescue-button-white' onclick='back_button_click();'>Back</button></div>"
}

function add_rescue_button() {
    window['total_rescue_btns'] += 1;

    return "<div class='row' style='text-align:right;margin-top:10px' ><button id='rescue_button_id' class='shepherd-custom-rescue-button-white' onclick='rescue_button_click();'>Rescue</button></div>"
}

function add_rescue_confirm_button() {
    return "<div class='row'><button class='shepherd-custom-next-sutton' onclick='rescue_button_click();'>Rescue</button></div>"
}

function add_rescue_close_button() {
    return "<div class='row'><button class='shepherd-custom-back-sutton' onclick='tour1.complete();'>close</button></div>"
}
function confirm_rescue() {
    play_audio_rescue_warning();
    tour1.addStep({
        title: 'Alert!',
        text: `<div id="rescue_div">Using the rescue feature costs you points</div>` + add_rescue_close_button() + add_rescue_confirm_button(),
        arrow: false,
        attachTo: { element: '#circle', on: 'left' },
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
let rescue_colour_is_yellow = false;

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

// var tut = window['tutorials'].map(
//     (data) => `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">
//         ${data}
//         </span></p>`
// );

let tour = new Shepherd.Tour({
    defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'educobot-shepherd',
        scrollTo: { behavior: 'smooth', block: 'center' }
    }
});
function loadAgain() {
    // console.log("First", Shepherd?.activeTour?.steps?.indexOf(Shepherd?.activeTour?.currentStep))
    let nextStep = 0;
    if (tour.isActive()) {
        nextStep = Shepherd?.activeTour?.steps?.indexOf(Shepherd?.activeTour?.currentStep);
    }
    // $("#hand").css("visibility", 'hidden');
    clearInterval(myInterval);
    // document.getElementById('hand').style.visibility = "hidden";

    lang = window["language"]
    clearInterval(myInterval)
    $("#hand").css("visibility", 'hidden');

    // const tut = window['tutorials'].map(
    //     (data) => `<p><span style="sans-serif;">
    //         ${data}
    //     </span></p>`
    // );

    const tut = {
        0: `<p style="text-align: center;"><strong><span style="font-family: Helvetica; font-size: 30px;">Help Bunny<br><br> eat carrot and<br><br> return home</span></strong></p>`,
        1: `Select Bunny from the tool menu`,
        2: `from the Tool Menu drag hop Block to the workspace`,
        3: `Change direction to the Right, this will code bunny to go to the right`,
        4: `Change count to 6, this will code bunny to hop 6 times in the selected direction`,
        5: `Now select Bunny again from Tool Menu`,
        6: `Select Eat Carrot Block and place it under hop Block, till you hear a click sound`,
        7: `Select another hop Block from the Tool Menu under Bunny`,
        8: `Place hop Block under Eat Carrot Block`,
        9: `and change the count to 6, note the direction will now be left`,
        10: `Press green flag to run code`
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
            return false
        },
        title: 'Task',
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('middle', 'bottom') },
        // text: image_scaler("Task.png"),
        text: tut[0] + add_next_button(),
        buttons: [{ action() { return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                play_audio_tutorial("line2.mp3", lang);
                demoWorkspace = Blockly.getMainWorkspace()
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                handPointAt($("#hand"), $(`#${id}`), 'visible');
                //handPointAt($("#hand"), $("#blockly-5"), 'visible');
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating',
    });

    tour.addStep({
        eval() {
            // console.log(tut[1])
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
            //return check_toolbox_selection('blockly-5')
        },
        title: 'Step 1',
        text: tut[1],
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                clearInterval(myInterval);
                handPointAt($("#hand"), $("#blockly-5"), 'hidden');
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                if (!check_toolbox_selection(demoWorkspace.getToolbox().contents_[0].id_)) return;
                t1();
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return step2_val() },
        title: 'Step 2.0',
        text: tut[2] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                play_audio_tutorial("line2.mp3", lang);
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                console.log(id)
                handPointAt($("#hand"), $(`#${id}`), 'visible');
                //handPointAt($("#hand"), $("#blockly-5"), 'visible');
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (step2_val()) {
                    t2();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="bunny_moveblock" id="8V{$C6uvFBmY4A|.LGg~" x="101" y="214"><field name="direction">left</field><field name="distance">1</field></block></xml>',
    });

    tour.addStep({
        eval() { return step2_dirn_val() },
        title: 'Step 2.1 _ Set Direction',
        text: tut[3] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{ action() { t1(); return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                clearInterval(myInterval);
                if (step2_dirn_val()) {
                    t3();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="bunny_moveblock" id="8V{$C6uvFBmY4A|.LGg~" x="101" y="214"><field name="direction">right</field><field name="distance">1</field></block></xml>',
    });

    tour.addStep({
        eval() { return step2_steps_val() },
        title: 'Step 2.2 - Set Number of Steps',
        text: tut[4] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{ action() { t2(); return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                clearInterval(myInterval);
                if (step2_steps_val()) {
                    t4();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="bunny_moveblock" id="8V{$C6uvFBmY4A|.LGg~" x="101" y="214"><field name="direction">right</field><field name="distance">6</field></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            //console.log(id)
            return check_toolbox_selection(id)
            //return check_toolbox_selection('blockly-q')
        },
        title: 'Step 3',
        text: tut[5],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t3();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                t5();
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });

    tour.addStep({
        eval() { return step3_val() },
        title: 'Step 3.1',
        text: tut[6] + add_rescue_button(),
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
                if (step3_val()) {
                    t6();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="bunny_moveblock" id="8V{$C6uvFBmY4A|.LGg~" x="101" y="214"><field name="direction">right</field><field name="distance">6</field><next><block type="bunny_eat_carrot" id="SBu,82B6-o}CLOtm{[P-"></block></next></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            console.log(id)
            return check_toolbox_selection(id);
            //return check_toolbox_selection('blockly-10');
        },
        title: 'Step 4',
        text: tut[7],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                t5();
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                t7();
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });
    tour.addStep({
        eval() { return step4_val() },
        title: 'Step 4.1',
        text: tut[8] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{ action() { t6(); return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                clearInterval(myInterval);
                if (step4_val()) {
                    t8();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="bunny_moveblock" id="8V{$C6uvFBmY4A|.LGg~" x="101" y="214"><field name="direction">right</field><field name="distance">6</field><next><block type="bunny_eat_carrot" id="SBu,82B6-o}CLOtm{[P-"><next><block type="bunny_moveblock" id="?=T!zW)HK@xy%Upm0Dlr"><field name="direction">left</field><field name="distance">1</field></block></next></block></next></block></xml>',
    });
    tour.addStep({
        eval() { return step4_2_val() },
        title: 'Step 4.2',
        text: tut[9] + add_rescue_button(),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{ action() { t7(); return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                if (step4_2_val()) {
                    clearInterval(myInterval);
                    handPointAt($("#hand"), $("#runbtn"), 'visible');
                    play_audio_tutorial("line18.mp3", lang);
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: 'Next'
        }],
        id: 'creating',
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="bunny_moveblock" id="8V{$C6uvFBmY4A|.LGg~" x="101" y="214"><field name="direction">right</field><field name="distance">6</field><next><block type="bunny_eat_carrot" id="SBu,82B6-o}CLOtm{[P-"><next><block type="bunny_moveblock" id="?=T!zW)HK@xy%Upm0Dlr"><field name="direction">left</field><field name="distance">6</field></block></next></block></next></block></xml>',
    });
    tour.addStep({
        eval() { return false },
        title: 'Nicee, Run it now!',
        text: tut[10], arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top-start', 'left-start') },
        buttons: [{
            action() { t7(); return this.back(); },
            classes: 'shepherd-button-secondary', text: 'Back'
        }, { action() { return this.next(); }, text: 'Close' }],
        id: 'run'
    });
    // if (!tour.isActive()) //tour.show(tour_step);
    // console.log("Last Step", nextStep);
    // console.log("Shepherd Step", Shepherd?.activeTour?.steps?.indexOf(Shepherd?.activeTour?.currentStep))
    tour.start();
    tour.show(nextStep)
    // console.log("After Tour Start Last Step", nextStep);
    // console.log("After Tour Start Shepherd Step", Shepherd?.activeTour?.steps?.indexOf(Shepherd?.activeTour?.currentStep))
    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
}

function t1() {

    clearInterval(myInterval);
    play_audio_tutorial("line4.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[0]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $("#blocklyDiv"), "visible")
            krr = !krr;
        }
    }, 1500);
}
function t2() {
    clearInterval(myInterval);
    play_audio_tutorial("line6.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyFieldRect.blocklyDropdownRect")[0]), 'visible');
    }, 100);
}

function t3() {
    clearInterval(myInterval);
    play_audio_tutorial("line8.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyFieldRect.blocklyDropdownRect")[1]), 'visible');
    }, 100);
}
function t4() {
    clearInterval(myInterval);
    play_audio_tutorial("line10.mp3", lang);
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $(`#${id}`), 'visible');
    // handPointAt($("#hand"), $("#blockly-q"), 'visible');
}


function t5() {
    clearInterval(myInterval);
    play_audio_tutorial("line12.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[2]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), 'visible');
            krr = !krr;
        }
    }, 1500);
}
function t6() {
    clearInterval(myInterval);
    play_audio_tutorial("line14.mp3", lang);
    myInterval = setInterval(function () {
        let id = (demoWorkspace.getToolbox().contents_[0].id_)
        handPointAt($("#hand"), $(`#${id}`), 'visible');
    }, 100);
}

function t7() {
    clearInterval(myInterval);
    play_audio_tutorial("line16.mp3", lang);
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
    play_audio_tutorial("line16B.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyFieldRect.blocklyDropdownRect")[3]), 'visible');
    }, 100);
}


function step2_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codep = Blockly.Python.workspaceToCode(demoWorkspace);
    if (codep == "bunny.left(1)\n") { return true; } else return false;
}

function step2_dirn_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(1)\n") { return true; } else return false; }

function step2_steps_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(6)\n") { return true; } else return false; }

function step3_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(6)\nbunny.eat_carrot()\n") { return true; } else return false; }

function step4_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(6)\nbunny.eat_carrot()\nbunny.left(1)\n") { tour_over = true; return true; } else return false; }

function step4_2_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(6)\nbunny.eat_carrot()\nbunny.left(6)\n") { tour_over = true; return true; } else return false; }

function say_congrats() {
    const tour1 = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: true }, classes: 'class-1 class-2', scrollTo: { behavior: 'smooth', block: 'center' } } });
    tour1.addStep({ title: 'Congratulations!', text: `<img src="../assets/guide/well_done.png"width="300"height="300">`, arrow: false, attachTo: { element: '#sprite-container', on: 'left' }, buttons: [{ action() { return this.next(); }, text: 'Finish' }], id: 'creating' });
    tour1.start();
}

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
    console.log(playAudio);
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
console.log(tour)
console.log()

const tt = setInterval(function () {
    //clearInterval(tt)
    // document.getElementById('soundBtn').addEventListener('click', () => setAudioPreference())
    $(".shepherd-content").draggable({
        containment: "body"
    })
    $(".shepherd-text").resizable();
    try {
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
            tour.complete();
            handPointAt($("#hand"), $("#runbtn"), 'hidden');
            let btns = document.querySelectorAll('.shepherd-button');
            btns[btns.length - 1].click();
        }
    } catch { }
});


document.getElementsByClassName("shepherd-footer")[0].style.display = "none";
document.getElementsByClassName("shepherd-text")[0].style.marginBottom = "15px";