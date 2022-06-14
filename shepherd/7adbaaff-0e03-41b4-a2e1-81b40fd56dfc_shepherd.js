//import $ from 'jquery';
import Blockly from "blockly";
import "blockly/python";
import "blockly/javascript";
const demoWorkspace = Blockly.getMainWorkspace();
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function (a) { return a.raw = a };
$jscomp.createTemplateTagFirstArgWithRaw = function (a, b) { a.raw = b; return a };
var playAudio = true;
let myInterval;
const tut = {
    1: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">Let's use the looping concept and make Shivani jump for 50 times with 0.1 secs wait time inbetween each jump. Try on your own.</span></p>`,
    2: `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">That's it! Now Run the code and make her fit!</span></p>`,
}

function tutm(i) {
    return `<p><span style="background-color: rgba(0, 0, 0,0.8);font-family: Tahoma, Geneva, sans-serif; color: rgb(239, 239, 239); font-size: 18px; text-shadow: rgba(179, 179, 179, 0.45) 3px 3px 2px;">` + tut[i] + `</span></p>`
}

function handPointAt(hand, element, visibility) {
    let pos = element.position(),
        ele_oh = element.outerHeight(true),
        ele_ow = element.outerWidth(true),
        h_oh = hand.outerHeight(true),
        h_ow = hand.outerWidth(true);

    if (ele_oh > h_oh) {
        pos.top += (ele_oh - h_oh) / 2;
    }
    if (ele_ow > h_ow) {
        pos.left += (ele_ow - h_ow) / 2;
    }
    hand.css("visibility", visibility);
    try { hand.css("top", pos.top); } catch { true; }
    try { hand.css("left", pos.left); } catch { true; }
}
$("#hand").css("visibility", 'hidden');
let isPortrait = () => (screen.width <= 600 ? true : false);
var tour_over = !1,
    audio = { paused: !0 },
    kill_audio = function () { audio.paused || audio.pause() },
    adapt_orientation_array = [],
    language = { language_packs_folder: "languages", language: "english", audio_folder: "audio", image_folder: "images", guide_folder: "guide" },
    adapt_orientation = function (a, b) { adapt_orientation_array.push([a, b]); return isPortrait() ? a : b };

function image_scaler(a) { return '<img src = "../assets/' + (language.guide_folder + "/" + language.language_packs_folder + "/" + language.language + "/" + language.image_folder + "/") + a + '" class="responsive-img tutorial_image">' }

// const amber_ref = () => {
//     $("#amber_ref").toggle("slow");
//     $("#amber_ref" + "_btn").toggle();
// }
window["amber_ref"] = () => {
    $("#amber_ref").toggle("slow");
    $("#amber_ref" + "_btn").toggle();
}
function hint_maker(a, id, txt) {
    return '<button id="' + id + '_btn" class="hoverable waves-effect waves-light btn-small grey darken-4" onclick="' + id + '();">' + txt + '</button><img id = "' + id + '" src = "../assets/' + (language.guide_folder + "/" + language.language_packs_folder + "/" + language.language + "/" + language.image_folder + "/") + a + '" class="responsive-img tutorial_image" style="display:none">'
}

function play_audio_tutorial(a) {
    var b = "../assets/" + language.guide_folder + "/" + language.language_packs_folder + "/" + language.language + "/" + language.audio_folder + "/";
    kill_audio();
    if (playAudio) {
        audio = new Audio(b + a);
        audio.play();
    }
}

var tour = new Shepherd.Tour(
    {
        defaultStepOptions: {
            cancelIcon: { enabled: !0 },
            classes: "educobot-shepherd",
            scrollTo: { behavior: "smooth", block: "center" }
        }
    });

function loadAgain() {
    // const tut = window['tutorials'].map(
    //     (data) => `<p><span style="color: rgb(239, 239, 239); font-family: Verdana, Geneva, sans-serif; font-size: 20px;">
    //             ${data}
    //             </span></p>`
    // );
    if (tour)
        tour.complete();
    console.log(tour)
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
        attachTo: { element: '#game_page', on: adapt_orientation('left', 'bottom') },
        text: image_scaler("Introduction.png"),
        buttons: [{
            action: function () {
                //play_audio_tutorial("line0.mp3");
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return step1_validation() },
        title: "Task",
        text: tut[1] + hint_maker("health_is_wealth_code.png", "amber_ref", "Show Ready Reference"),
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },

        buttons: [{
            action: function () { return this.back() },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                // t0();
                if (step1_validation())
                    return this.next();
                else
                    M.toast({ html: "Wrong block or values selected!" });
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return false
        },
        title: "Great, Run it now!",
        text: tut[2],
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                // t1();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });
}
function step1_validation() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'for count in range(50):\n  girl.jump()\n  time.sleep(0.1)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}
loadAgain();
window['loadAgain'] = loadAgain

tour.start();

function check_toolbox_selection(id) {
    try {
        if (demoWorkspace.getToolbox().selectedItem_.id_ === id)
            return true;
        else return false;
    } catch {
        return false;
    }
}

function setAudioPreference() {
    var elementId;
    if (playAudio) {
        kill_audio();
    }
    if (!(playAudio)) {
        playAudio = true;
        elementId = document.getElementById('soundButton');
        elementId = document.getElementById('soundButton2');
        document.getElementById('soundButton').src = "../assets/unmute.png";
        document.getElementById('soundButton2').src = "../assets/unmute.png";
    } else {
        playAudio = false;
        elementId = document.getElementById('soundButton');
        document.getElementById('soundButton').src = "../assets/mute.png";
        document.getElementById('soundButton2').src = "../assets/mute.png";
    }
}

window.addEventListener("resize", function () {
    for (var a = 0; a < tour.steps.length; a++)
        tour.steps[a].options.attachTo.on =
            isPortrait() ? adapt_orientation_array[a][0] : adapt_orientation_array[a][1]
});

setInterval(function () {
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