import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";

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
    return '<button id="' + id + '_btn" class="hoverable waves-effect waves-light btn-small grey darken-4" onclick="' + id + '();">' + txt + '</button><img id = "' + id + '" src = "../assets/' + (language.guide_folder + "/" + language.language_packs_folder + "/" + language.language + "/" + language.image_folder + "/") + a + '" class="responsive-img tutorial_image" style="display:none">'
}

function amber_ref() {
    $("#amber_ref").toggle("slow");
    $("#amber_ref" + "_btn").toggle();
}


function image_scaler(file) { let path = `assets/` + language.guide_folder + `/` + language.language_packs_folder + `/` + language.language + `/` + language.image_folder + `/`; return `<img src="` + path + file + `"class="tutorial_image">` }

// const tut = {

//     "obj": `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Scroll Image here</span></p>`,
//     0: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Help the lost farm animals reach their homes</span></p>`,
//     1: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Click on the Animal Farm Section</span></p>`,
//     2: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Drag the Send block to the workspace</span></p>`,
//     3: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">The first Animal is Horse and Horses stay in the stable. Choose it.</span></p>`,
//     4: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Now click on the run button and start counting how many seconds the horse needs to come to stable</span></p>`,
//     5: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Now, Click on the Animal Farm Section</span></p>`,
//     6: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Drag the wait block to workspace</span></p>`,
//     7: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Change wait time to 6 secs since horse took 6 secs to come to stable</span></p>`,
//     9: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Similarly, Finish up the lesson by sending the pig and cow home with needed wait time</span></p>`,
//     10: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Congratulations on finishing it correctly. Press green flag to run code</span></p>`
// }

function handPointAt(hand, element, visibility) {

    // let pos = {
    //     top: element.getBoundingClientRect().top,
    //     left: element.getBoundingClientRect().left,
    // }
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
        hand.css("top", pos.top);
        hand.css("left", pos.left);
    });

}

$("#hand").css("visibility", 'hidden');
function play_audio_tutorial(file) {
    let path = `assets/` + language.guide_folder + `/` + language.language_packs_folder + `/` + language.language + `/` + language.audio_folder + `/`;
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
    }
}
let tour = new Shepherd.Tour({
    defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'educobot-shepherd',
        scrollTo: { behavior: 'smooth', block: 'center' }
    }
});
function loadAgain() {

    const tut = window['tutorials'].map(
        (data) => `<p><span style="">
            ${data}
            </span></p>`
    );
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
        title: 'Task',
        arrow: true,
        // text: image_scaler("Task.png"),
        text: tut[10],
        buttons: [{
            action() { return this.back(); },
            classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });
    tour.addStep({
        eval() { return false },
        title: 'Task',
        arrow: true,
        // text: image_scaler("Task.png"),
        text: tut[0],
        buttons: [{ action() { return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                // play_audio_tutorial("line2.mp3");
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                handPointAt($("#hand"), $("#" + id), 'visible');
                return this.next();
            },
            text: 'Next'
        }],
        id: 'creating'
    });
    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)

            return check_toolbox_selection(id)
        },
        title: 'Step 1',
        text: tut[1],
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        // attachTo: { element: '.blocklyToolboxContents', on: adapt_orientation('bottom', 'right') },
        buttons: [{
            action() {
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                handPointAt($("#hand"), $("#" + id), 'hidden');
                return this.back();
            },
            classes: 'shepherd-button-secondary',
            text: 'Back'
        }, {
            action() {
                t1();
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                if (check_toolbox_selection(id))
                    return this.next();
                else
                    M.toast({ html: "Choose the Animal Farm in the toolbox" });
            },
            text: 'Next'
        }],
        id: 'creating'
    });


    tour.addStep({
        eval() { return step2_val() },
        title: 'Step 2',
        text: tut[2],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() {
                // play_audio_tutorial("line2.mp3");
                clearInterval(myInterval);
                let id = (demoWorkspace.getToolbox().contents_[0].id_)
                handPointAt($("#hand"), $("#" + id), 'visible');
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
        title: 'Step 3',
        text: tut[3],
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
        id: 'creating'
    });

    tour.addStep({
        eval() { return false; },
        title: 'Step 4 - Run',
        text: tut[4],
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{
            action() { t2(); return this.back(); }
            , classes: 'shepherd-button-secondary', text: 'Back'
        }, {
            action() {
                clearInterval(myInterval);
                if (v()) {
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
            return check_toolbox_selection(id)
        },
        title: 'Step 5',
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
        title: 'Step 6',
        text: tut[6],
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
        id: 'creating'
    });
    tour.addStep({
        eval() {
            // return check_toolbox_selection('blockly-0');
            return step4_val();
        },
        title: 'Step 7',
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
        text: tut[8],
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
        id: 'creating'
    });
    tour.addStep({
        eval() { return step4_2_val() },
        title: 'Step 9',
        text: tut[8] + hint_maker("animal_farm.png", "amber_ref", "Show Ready Reference"),
        arrow: true,
        // attachTo: { element: '.injectionDiv', on: adapt_orientation('bottom', 'right') },
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{ action() { t7(); return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, {
            action() {
                if (step4_2_val()) {
                    clearInterval(myInterval);
                    // handPointAt($("#hand"), $("#runbtn"), 'visible');
                    // play_audio_tutorial("line18.mp3");
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
        text: tut[9],
        arrow: true,
        attachTo: { element: '#sprite-container', on: adapt_orientation('top', 'bottom') },
        buttons: [{ action() { t8(); return this.back(); }, classes: 'shepherd-button-secondary', text: 'Back' }, { action() { return this.next(); }, text: 'Close' }],
        id: 'creating'
    });

    tour.start();

    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
}
function t1() {
    clearInterval(myInterval);
    // play_audio_tutorial("line4.mp3");
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
    // play_audio_tutorial("line6.mp3");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyFieldRect.blocklyDropdownRect")[1]), 'visible');
    }, 100);
}

function t3() {
    clearInterval(myInterval);
    // play_audio_tutorial("line8.mp3");
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#runbtn"), 'visible');
    }, 100);
}
function t4() {
    clearInterval(myInterval);
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
}

function t5() {
    clearInterval(myInterval);
    // play_audio_tutorial("line12.mp3");
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
    // play_audio_tutorial("line14.mp3");
    myInterval = setInterval(function () {
        // handPointAt($("#hand"), $("#blockly-0"), 'visible');
        handPointAt($("#hand"), $($(".blocklyEditableText")[0]), 'visible');
    }, 100);
}
function t7() {
    clearInterval(myInterval);
    play_audio_tutorial("line16.mp3");
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
    tour1.addStep({ title: 'Congratulations!', text: `<img src="assets/guide/well_done.png"width="300"height="300">`, arrow: false, attachTo: { element: '#sprite-container', on: 'left' }, buttons: [{ action() { return this.next(); }, text: 'Finish' }], id: 'creating' });
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
window.addEventListener('resize', () => { for (let i = 0; i < tour.steps.length; i++) { try { tour.steps[i].options.attachTo.on = isPortrait() ? adapt_orientation_array[i][0] : adapt_orientation_array[i][1]; } catch (error) { true; } } });

$("#runbtn").on('click', function () {
    try {
        if (tour.getCurrentStep().options.title.includes("Run")) {
            let btns = document.querySelectorAll('.shepherd-button');
            btns[btns.length - 1].click();
        }
    } catch { }
});

