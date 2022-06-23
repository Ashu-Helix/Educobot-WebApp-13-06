import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

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
function image_scaler(file) { let path = `../assets/` + language.guide_folder + `/` + language.language_packs_folder + `/` + language.language + `/` + language.image_folder + `/`; return `<img src="` + path + file + `"class="tutorial_image">` }

// const tut = {
//     0: "",
//     1: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Select Bunny from the Tool &nbsp;Menu</span></p>`,
//     2: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">from the Tool Menu drag Move Block to workspace</span></p>`,
//     3: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Change direction to the Right</span></p>`,
//     4: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Change Steps to 40</span></p>`,
//     5: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Now select Bunny again from Tool Menu</span></p>`,
//     6: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Select Eat CARROT Block and place under Move Block in the WORKSPACE, till you hear a click sound</span></p>`,
//     7: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Select another Move Block from the Tool Menu under Bunny</span></p>`,
//     8: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Place Move Block under Eat CARROT Block</span></p>`,
//     9: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">and change steps to 40</span></p>`,
//     10: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Press green flag to run code</span></p>`
// }



// var tut = window['tutorials'].map(
//     (data) => `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">
//         ${data}
//         </span></p>`
// );

function handPointAt(hand, element, visibility) {
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

    try { hand.css("visibility", visibility); } catch { }
    try { hand.css("top", pos.top); } catch { }
    try { hand.css("left", pos.left); } catch { }
    element.on("dragstop", function (event, ui) {
        hand.css("top", (pos.top));
        hand.css("left", pos.left);
    });

}
// $("#hand").css("visibility", 'hidden');

function play_audio_tutorial(file, lang) {
    let path = `../assets/` + language.guide_folder + `/` + language.language_packs_folder + `/` + lang + `/` + language.audio_folder + `/`;
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
    }
}

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
    // $("#hand").css("visibility", 'hidden');
    clearInterval(myInterval);
    document.getElementById('hand').style.visibility = "hidden";

    lang = window["language"]

    const tut = window['tutorials'].map(
        (data) => `<p><span style="sans-serif;">
            ${data}
        </span></p>`
    );
    if (tour)
        tour.complete();
    // console.log(tour)
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
        attachTo: { element: '#game_page', on: adapt_orientation('left', 'top') },
        text: image_scaler("Task.png"),
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
        id: 'creating'
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
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        text: tut[2],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        id: 'creating'
    });

    tour.addStep({
        eval() { return step2_dirn_val() },
        title: 'Step 2.1 _ Set Direction',
        text: tut[3],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        id: 'creating'
    });

    tour.addStep({
        eval() { return step2_steps_val() },
        title: 'Step 2.2 - Set Number of Steps',
        text: tut[4],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        id: 'creating'
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
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        text: tut[6],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        id: 'creating'
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
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        text: tut[8],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        id: 'creating'
    });
    tour.addStep({
        eval() { return step4_2_val() },
        title: 'Step 4.2',
        text: tut[9],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite', on: adapt_orientation('top', 'bottom') },
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
        id: 'creating'
    });
    tour.addStep({
        eval() { return false },
        title: 'Nicee, Run it now!',
        text: tut[10], arrow: true,
        attachTo: { element: '#sprite', on: adapt_orientation('top-start', 'left-start') },
        buttons: [{
            action() { t7(); return this.back(); },
            classes: 'shepherd-button-secondary', text: 'Back'
        }, { action() { return this.next(); }, text: 'Close' }],
        id: 'run'
    });
    tour.start();

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
    if (codep == "bunny.left(10)\n") { return true; } else return false;
}

function step2_dirn_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(10)\n") { return true; } else return false; }

function step2_steps_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(40)\n") { return true; } else return false; }

function step3_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(40)\nbunny.eat_carrot()\n") { return true; } else return false; }

function step4_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(40)\nbunny.eat_carrot()\nbunny.left(10)\n") { tour_over = true; return true; } else return false; }

function step4_2_val() { Blockly.JavaScript.INFINITE_LOOP_TRAP = null; var code = Blockly.Python.workspaceToCode(demoWorkspace); if (code == "bunny.right(40)\nbunny.eat_carrot()\nbunny.left(40)\n") { tour_over = true; return true; } else return false; }

function say_congrats() {
    const tour1 = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: true }, classes: 'class-1 class-2', scrollTo: { behavior: 'smooth', block: 'center' } } });
    tour1.addStep({ title: 'Congratulations!', text: `<img src="../assets/guide/well_done.png"width="300"height="300">`, arrow: false, attachTo: { element: '#sprite', on: 'left' }, buttons: [{ action() { return this.next(); }, text: 'Finish' }], id: 'creating' });
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
