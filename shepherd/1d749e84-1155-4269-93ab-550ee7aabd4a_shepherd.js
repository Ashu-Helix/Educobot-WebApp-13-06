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
let tour_step = 0;
window.addEventListener('resize', () => { for (let i = 0; i < tour.steps.length; i++) { try { tour.steps[i].options.attachTo.on = isPortrait() ? adapt_orientation_array[i][0] : adapt_orientation_array[i][1]; } catch (error) { true; } } });

function image_scaler(file, lang) {
    let path = `../assets/` + language.guide_folder + `/` + slug + `/` + language.language_packs_folder + `/` + lang + `/` + language.image_folder + `/`;
    return `<img src="` + path + file + `"class="tutorial_image">`
}

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
$("#hand").css("visibility", 'hidden');

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
        document.querySelectorAll("#rescue_button_id").forEach((i) => { i.className = "shepherd-custom-rescue-button-yellow"; })
    } else {
        document.querySelectorAll("#rescue_button_id").forEach((i) => { i.className = "shepherd-custom-rescue-button-white"; })
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

// let tut = {
//     0: `<h5>Let's learn to program a traffic signal</h5>`,
//     // 99: `The traffic signal has 3 lights - red, amber and green. <br>Red is for stop. <br>Amber is to get ready. <br>Green is to go`,
//     99: image_scaler("Task.png"),
//     1: `Select traffic signal from toolbox`,
//     2: `Drag the “Light” block from the menu and drop it in the workspace`,
//     3: `Select Traffic Signal again from the toolbox`,
//     4: `Drag the “Wait” block from the menu and drop it in the workspace just below the light block, until you hear a click`,
//     5: `Select Traffic Signal once again from the toolbox`,
//     6: `Drag the “Light” block from the menu and drop it in the workspace just below the wait block, until you hear a click `,
//     7: `Now switch it OFF`,
//     8: `So, we've programmed red light to turn on for 1 second and Switch off.  Let's now hit the green Flag and observe the Traffic Signal.`,
//     9: `Did you see the red light being on for 1 second? If not run it again and see. Now lets continue to code amber to turn on for one second after red light.<br>Select Traffic Signal from the toolbox`,
//     10: `Drag the “Light” block from the menu and drop it just below the previous block`,
//     11: `change the RED light to AMBER`,
//     12: `Now follow the same steps, as red light, to complete code for amber light`,
//     13: `So, we've programmed red and amber light to turn on for 1 second and Switch off.  Let's now hit the green Flag and observe the Traffic Signal`,
//     14: `Repeat the same steps to program green light to turn on for one second after RED and AMBER`,
//     15: `Now, we've programmed RED, AMBER and GREEN lights to turn on and off for 1 second. Press the green flag to run it and observe the output`,
//     16: `Great, now let's try making the signal repeat the same 5 times. <br>Select Loops from the toolbox`,
//     17: `Drag the repeat block from the menu to the workspace and attach all the existing code blocks into the loop block`,
//     18: `In the repeat block, change the number of times to 5`,
//     19: `That's it! Now run the code and enjoy!`,
// }


const tut1 = {
    "english": {
        0: `<h5>Let's learn to program a traffic signal</h5>`,
        // 99: `The traffic signal has 3 lights - red, amber and green. <br>Red is for stop. <br>Amber is to get ready. <br>Green is to go`,
        99: image_scaler("Task.png", "english"),
        1: `Select traffic signal from toolbox`,
        2: `Drag the “Light” block from the menu and drop it in the workspace`,
        3: `Select Traffic Signal again from the toolbox`,
        4: `Drag the “Wait” block from the menu and drop it in the workspace just below the light block, until you hear a click`,
        5: `Select Traffic Signal once again from the toolbox`,
        6: `Drag the “Light” block from the menu and drop it in the workspace just below the wait block, until you hear a click `,
        7: `Now switch it OFF`,
        8: `So, we've programmed red light to turn on for 1 second and Switch off.  Let's now hit the green Flag and observe the Traffic Signal.`,
        9: `Did you see the red light being on for 1 second? If not run it again and see. Now lets continue to code amber to turn on for one second after red light.<br>Select Traffic Signal from the toolbox`,
        10: `Drag the “Light” block from the menu and drop it just below the previous block`,
        11: `change the RED light to AMBER`,
        12: `Now follow the same steps, as red light, to complete code for amber light`,
        13: `So, we've programmed red and amber light to turn on for 1 second and Switch off.  Let's now hit the green Flag and observe the Traffic Signal`,
        14: `Repeat the same steps to program green light to turn on for one second after RED and AMBER`,
        15: `Now, we've programmed RED, AMBER and GREEN lights to turn on and off for 1 second. Press the green flag to run it and observe the output`,
        16: `Great, now let's try making the signal repeat the same 5 times. <br>Select Loops from the toolbox`,
        17: `Drag the repeat block from the menu to the workspace and attach all the existing code blocks into the loop block`,
        18: `In the repeat block, change the number of times to 5`,
        19: `That's it! Now run the code and enjoy!`,
    },
    "hindi": {
        0: `<h5>आइए ट्रैफिक सिग्नल प्रोग्राम करना सीखें</h5>`,
        99: image_scaler("Task.png", "hindi"),
        1: `टूलबॉक्स से ट्रैफिक सिग्नल चुनें`,
        2: `मेनू से "लाइट" ब्लॉक खींचें और इसे वर्कस्पेस में छोड़ दें`,
        3: `टूलबॉक्स से फिर से ट्रैफिक सिग्नल का चयन करें`,
        4: `मेनू से "वेट" ब्लॉक को खींचें और इसे लाइट ब्लॉक के ठीक नीचे वर्कस्पेस में छोड़ दें, जब तक कि आपको एक क्लिक सुनाई न दे`,
        5: `टूलबॉक्स से एक बार फिर ट्रैफिक सिग्नल का चयन करें`,
        6: `मेनू से "लाइट" ब्लॉक खींचें और इसे वेट के ठीक नीचे वर्कस्पेस में छोड़ दें, जब तक कि आप एक क्लिक नहीं सुनते`,
        7: `अब लाइट बंद करें`,
        8: `हमने लाल बत्ती को 1 सेकंड के लिए चालू करने और स्विच ऑफ करने के लिए प्रोग्राम किया है। आइए अब हरे झंडे को दबाएं और ट्रैफिक सिग्नल का निरीक्षण करें।`,
        9: `क्या आपने लाल बत्ती को 1 सेकंड के लिए चालू देखा? इसे फिर से चलाएँ यदि नहीं। अब लाल बत्ती के बाद एक सेकंड के लिए चालू करने के लिए एम्बर को कोड करना जारी रखें। टूलबॉक्स से ट्रैफ़िक सिग्नल का चयन करें`,
        10: `मेनू से "लाइट" ब्लॉक खींचें और इसे पिछले ब्लॉक के ठीक नीचे छोड़ दें`,
        11: `लाल बत्ती को एम्बर में बदलें`,
        12: `एम्बर लाइट के लिए कोड को पूरा करने के लिए अब लाल बत्ती के समान स्तेप्स का पालन करें`,
        13: `हमने 1 सेकंड के लिए चालू करने और बंद करने के लिए लाल और एम्बर लाइट को प्रोग्राम किया है। आइए अब हरी झंडी दबाएं और ट्रैफिक सिग्नल का पालन करें`,
        14: `लाल और एम्बर के बाद एक सेकंड के लिए हरी बत्ती को चालू करने के लिए प्रोग्राम करने के लिए समान स्तेप्स को दोहराएं`,
        15: `अब, हमने 1 सेकंड के लिए चालू और बंद करने के लिए रेड, ऐम्बर और ग्रीन लाइट्स को प्रोग्राम किया है। इसे चलाने के लिए हरी झंडी दबाएं और आउटपुट देखें`,
        16: `बहुत अच्छा, अब सिग्नल को 5 बार दोहराते हैं, टूलबॉक्स से लूप्स चुनें`,
        17: `रिपीट ब्लॉक को मेनू से वर्कस्पेस पर खींचें और लूप ब्लॉक के अंदर सभी मौजूदा कोड ब्लॉक संलग्न करें`,
        18: `रिपीट ब्लॉक में, संख्या को 5 में बदलें`,
        19: `इतना ही! अब कोड चलाएँ और आनंद लें!`,
    },
    "marathi": {
        0: `<h5>ट्रॅफिक सिग्नल प्रोग्राम करायला शिकूया</h5>`,
        99: image_scaler("Task.png", "marathi"),
        1: `टूलबॉक्समधून ट्रैफिक सिग्नल निवडा`,
        2: `मेनूमधून "लाइट" ब्लॉक ड्रॅग करा आणि कार्यक्षेत्रात ठेवा`,
        3: `टूलबॉक्समधून पुन्हा ट्रैफिक सिग्नल निवडा`,
        4: `मेनूमधून "वेट" ब्लॉक ड्रॅग करा आणि तुम्हाला क्लिक ऐकू येईपर्यंत तो लाईट ब्लॉकच्या खाली असलेल्या वर्कस्पेसमध्ये ठेवा`,
        5: `टूलबॉक्समधून पुन्हा एकदा ट्रैफिक सिग्नल निवडा`,
        6: `मेनूमधून "लाइट" ब्लॉक ड्रॅग करा आणि तुम्हाला क्लिक ऐकू येईपर्यंत तो वेट ब्लॉकच्या खाली वर्कस्पेसमध्ये ठेवा`,
        7: `आता बत्ती बंद करा`,
        8: `आम्ही लाल बत्तीला 1 सेकंदासाठी चालू आणि बंद करण्यासाठी प्रोग्राम केले आहे. आता हिरवा झेंडा दाबून ट्रैफिक सिग्नल पाळूया`,
        9: `तुम्ही लाल बत्ती 1 सेकंदासाठी चालू पाहिली का? नसल्यास ती पुन्हा वाजवा. आता लाल बत्तीनंतर एक सेकंद चालू करण्यासाठी एम्बर कोड करणे सुरू ठेवा. टूलबॉक्समधून ट्रैफिक सिग्नल निवडा`,
        10: `मेनूमधून "लाइट" ब्लॉक ड्रॅग करा आणि मागील ब्लॉकच्या अगदी खाली ठेवा`,
        11: `लाल बत्तीचे अंबरमध्ये रूपांतर करा`,
        12: `आता एम्बर लाईटसाठी कोड पूर्ण करण्यासाठी लाल बत्ती प्रमाणेच स्तेप्सचे अनुसरण करा`,
        13: `आम्ही लाल आणि अंबर बत्ती 1 सेकंदासाठी चालू आणि बंद करण्यासाठी प्रोग्राम केले आहे. चला आता हिरवा झेंडा दाबून ट्रैफिक सिग्नलचे पालन करूया`,
        14: `लाल आणि एम्बर नंतर एका सेकंदासाठी हिरवी बत्ती चालू करण्यासाठी प्रोग्राम करण्यासाठी समान स्तेप्सची पुनरावृत्ती करा`,
        15: `आता, आम्ही लाल, अंबर आणि हिरवे बत्ती 1 सेकंदासाठी चालू आणि बंद करण्यासाठी प्रोग्राम केले आहेत. ते चालवण्यासाठी ध्वज दाबा आणि आउटपुट पहा`,
        16: `ठीक आहे, आता सिग्नल 5 वेळा रिपीट करू, टूलबॉक्समधून लूप्स निवडा`,
        17: `मेनूमधून रिपीट ब्लॉक वर्कस्पेसवर ड्रॅग करा आणि लूप ब्लॉकमध्ये सर्व विद्यमान कोड ब्लॉक्स बंद करा`,
        18: `पुनरावृत्ती ब्लॉकमध्ये, संख्या 5 मध्ये बदला`,
        19: `आणि ते सर्व आहे! आता कोड चालवा आणि आनंद घ्या!`,
    }
}


function loadAgain() {


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
        eval() { return false },
        title: "Introduction",
        text: tut[0] + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () { return this.back() },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                play_audio_tutorial("line0.mp3", lang);
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return false },
        title: "Task",
        text: tut[99] + add_back_button() + add_next_button(),
        arrow: false,
        buttons: [{
            action: function () { return this.back() },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                t0();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            // return check_toolbox_selection('blockly-0')
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
        },
        title: "Step 1",
        text: tut[1],
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                t1();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            return step2_val();
        },
        title: "Step 2",
        text: tut[2] + add_rescue_button(),
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t0();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step2_val()) return t2(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
                return this.next()
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-0')
        },
        title: "Step 3",
        text: tut[3],
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t1();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (v()) {
                    t3();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });


    tour.addStep({
        eval() { return step4_val(); },
        title: "Step 4",
        text: tut[4] + add_rescue_button(),
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        arrow: false,
        buttons: [{
            action: function () {
                t2();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step4_val()) return t4(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value></block></next></block></xml>',
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-0');
        },
        title: "Step 5",
        text: tut[5],
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t3();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (v()) {
                    t5();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return step6_val(); },
        title: "Step 6",
        text: tut[6] + add_rescue_button(),
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t4();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step6_val()) return t6(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">on</field></block></next></block></next></block></xml>',
    });

    tour.addStep({
        eval() { return step7_val(); },
        title: "Step 7",
        text: tut[7] + add_rescue_button(),
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t5();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step7_val()) return t7(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field></block></next></block></next></block></xml>',
    });

    tour.addStep({
        eval() { return false; },
        title: "Step 8 - Run and see what happens",
        text: tut[8],
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t6();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (v()) {
                    t8();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[0].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-0');
        },
        title: "Step 9 - Program Amber",
        text: tut[9],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t7();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                t9();
                return this.next()
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return step10_val(); },
        title: "Step 10",
        text: tut[10] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t8();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step10_val()) return t10(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field><next><block type="traffic_signal" id="z!t*=kL*-q*g%Jk)ZM`L"><field name="light">red</field><field name="switch">on</field></block></next></block></next></block></next></block></xml>',
    });

    tour.addStep({
        eval() { return step11_val(); },
        title: "Step 11",
        text: tut[11] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t9();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step11_val()) return t11(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field><next><block type="traffic_signal" id="z!t*=kL*-q*g%Jk)ZM`L"><field name="light">amber</field><field name="switch">on</field></block></next></block></next></block></next></block></xml>',
    });

    tour.addStep({
        eval() { return step12_val() },
        title: "Step 12 - Amber - Do it yourself",
        text: tut[12] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t10();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step12_val()) return t12(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field><next><block type="traffic_signal" id="z!t*=kL*-q*g%Jk)ZM`L"><field name="light">amber</field><field name="switch">on</field><next><block type="wait_block" id="rSlBt-1QZ7Yx~f`;$KLs"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="AP3[.|{#/~1qM-$p7QGF"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="TNXyAO,_oaLSUzbedB5_"><field name="light">amber</field><field name="switch">off</field></block></next></block></next></block></next></block></next></block></next></block></xml>',
    });

    tour.addStep({
        eval() { return false; },
        title: "Step 13 - Run and see what happens",
        text: tut[13],
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t11();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (v()) {
                    t13();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return step14_val() },
        title: "Step 14 - Green - Do it yourself",
        text: tut[14] + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t12();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step14_val()) return t14(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen" x="87" y="133"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field><next><block type="traffic_signal" id="z!t*=kL*-q*g%Jk)ZM`L"><field name="light">amber</field><field name="switch">on</field><next><block type="wait_block" id="rSlBt-1QZ7Yx~f`;$KLs"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="AP3[.|{#/~1qM-$p7QGF"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="TNXyAO,_oaLSUzbedB5_"><field name="light">amber</field><field name="switch">off</field><next><block type="traffic_signal" id="M~yXz5s@|^SVPG+TCP)T"><field name="light">green</field><field name="switch">on</field><next><block type="wait_block" id="eNcKY3Q`SWhMq0AwA0}M"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="@MHarH,ZFa!f?[T0:M`]"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="}|[h_o|cED^tAEJ5AU@-"><field name="light">green</field><field name="switch">off</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></xml>',
    });


    tour.addStep({
        eval() { return false; },
        title: "Step 15 - Run and see what happens",
        text: tut[15],
        arrow: false,
        attachTo: { element: '#sprite-container', on: adapt_orientation("bottom", "bottom") },
        buttons: [{
            action: function () {
                t13();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (v()) {
                    t15();
                    return this.next();
                } else
                    M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() {
            let id = (demoWorkspace.getToolbox().contents_[1].id_)
            return check_toolbox_selection(id)
            // return check_toolbox_selection('blockly-1');
        },
        title: "Step 16",
        text: tut[16],
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t14();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (v()) return t16(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating"
    });

    tour.addStep({
        eval() { return step17_val(); },
        title: "Step 17",
        text: tut[17] + image_scaler("TS Drag Code to Repeat.png") + add_rescue_button(),
        arrow: false,
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        buttons: [{
            action: function () {
                t15();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step17_val()) return t17(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="^;{r6$d/K4%bdknYs2S)" x="44" y="75"><value name="TIMES"><block type="math_number" id="B.H|@/nz%wSF2QH=L2~E"><field name="NUM">10</field></block></value><statement name="DO"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field><next><block type="traffic_signal" id="z!t*=kL*-q*g%Jk)ZM`L"><field name="light">amber</field><field name="switch">on</field><next><block type="wait_block" id="rSlBt-1QZ7Yx~f`;$KLs"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="AP3[.|{#/~1qM-$p7QGF"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="TNXyAO,_oaLSUzbedB5_"><field name="light">amber</field><field name="switch">off</field><next><block type="traffic_signal" id="M~yXz5s@|^SVPG+TCP)T"><field name="light">green</field><field name="switch">on</field><next><block type="wait_block" id="eNcKY3Q`SWhMq0AwA0}M"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="@MHarH,ZFa!f?[T0:M`]"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="}|[h_o|cED^tAEJ5AU@-"><field name="light">green</field><field name="switch">off</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
    });

    tour.addStep({
        eval() { return step18_val(); },
        title: "Step 18",
        text: tut[18] + add_rescue_button(),
        attachTo: { element: "#sprite-container", on: adapt_orientation('bottom', 'bottom') },
        arrow: false,
        buttons: [{
            action: function () {
                t16();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                if (step18_val()) return t18(), this.next();
                M.toast({ html: "Wrong block or values selected!" })
            },
            text: "Next"
        }],
        id: "creating",
        workspace: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="controls_repeat_ext" id="^;{r6$d/K4%bdknYs2S)" x="44" y="75"><value name="TIMES"><block type="math_number" id="B.H|@/nz%wSF2QH=L2~E"><field name="NUM">5</field></block></value><statement name="DO"><block type="traffic_signal" id="*jphP0FVH?O]S_v+NFen"><field name="light">red</field><field name="switch">on</field><next><block type="wait_block" id="8gFsPur36l:_zhWr8%{j"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="N}{liuK.caf,URN`z@{+"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="Wd)|/Lu!Lb)JsA,|c:~)"><field name="light">red</field><field name="switch">off</field><next><block type="traffic_signal" id="z!t*=kL*-q*g%Jk)ZM`L"><field name="light">amber</field><field name="switch">on</field><next><block type="wait_block" id="rSlBt-1QZ7Yx~f`;$KLs"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="AP3[.|{#/~1qM-$p7QGF"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="TNXyAO,_oaLSUzbedB5_"><field name="light">amber</field><field name="switch">off</field><next><block type="traffic_signal" id="M~yXz5s@|^SVPG+TCP)T"><field name="light">green</field><field name="switch">on</field><next><block type="wait_block" id="eNcKY3Q`SWhMq0AwA0}M"><field name="NAME">Wait for</field><value name="NAME"><block type="math_number" id="@MHarH,ZFa!f?[T0:M`]"><field name="NUM">1</field></block></value><next><block type="traffic_signal" id="}|[h_o|cED^tAEJ5AU@-"><field name="light">green</field><field name="switch">off</field></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
    });

    tour.addStep({
        eval() { return false; },
        title: "Run and see what happens",
        text: tut[19],
        attachTo: { element: '#sprite-container', on: adapt_orientation("bottom", "bottom") },
        arrow: false,
        buttons: [{
            action: function () {
                t17();
                return this.back()
            },
            classes: "shepherd-button-secondary",
            text: "Back"
        }, {
            action: function () {
                return this.next();
            },
            text: "Next"
        }],
        id: "creating"
    });


    tour.start();
    tour.show(nextStep);

    document.getElementById('soundBtn').addEventListener('click', setAudioPreference)
}





function t0() {
    clearInterval(myInterval);
    play_audio_tutorial("line1.mp3", lang);
    // handPointAt($("#hand"), $("#blockly-0"), 'visible');
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
}



function t1() {
    clearInterval(myInterval);
    play_audio_tutorial("line2.mp3", lang);
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
    play_audio_tutorial("line3.mp3", lang);
    // handPointAt($("#hand"), $("#blockly-0"), 'visible');
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
}



function t3() {
    clearInterval(myInterval);
    play_audio_tutorial("line4.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[2]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[2]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), "visible")
            krr = !krr;
        }
    }, 1500);
}


function t4() {
    clearInterval(myInterval);
    play_audio_tutorial("line5.mp3", lang);
    // handPointAt($("#hand"), $("#blockly-0"), 'visible');
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
}


function t5() {
    clearInterval(myInterval);
    play_audio_tutorial("line6.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[3]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[3]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible")
            krr = !krr;
        }
    }, 1500);
}



function t6() {
    clearInterval(myInterval);
    play_audio_tutorial("line7.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[3]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyEditableText")[4]), 'visible');
    }, 1500);
}


function t7() {
    clearInterval(myInterval);
    play_audio_tutorial("line8.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#runbtn"), 'visible');
    }, 1500);
}



function t8() {
    clearInterval(myInterval);
    play_audio_tutorial("line9.mp3", lang);
    // handPointAt($("#hand"), $("#blockly-0"), 'visible');
    let id = (demoWorkspace.getToolbox().contents_[0].id_)
    handPointAt($("#hand"), $("#" + id), 'visible');
}




function t9() {
    clearInterval(myInterval);
    play_audio_tutorial("line10.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[4]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[4]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[3]), "visible")
            krr = !krr;
        }
    }, 1500);
}



function t10() {
    clearInterval(myInterval);
    play_audio_tutorial("line11.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyEditableText")[5]), 'visible');
    }, 1500);
}


function t11() {
    clearInterval(myInterval);
    play_audio_tutorial("line12.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyEditableText")[5]), 'hidden');
    }, 1500);
}




function t12() {
    clearInterval(myInterval);
    play_audio_tutorial("line13.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#runbtn"), 'visible');
    }, 1500);
}



function t13() {
    clearInterval(myInterval);
    play_audio_tutorial("line14.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#blocklyDiv"), 'hidden');

    }, 1500);
}




function t14() {
    clearInterval(myInterval);
    play_audio_tutorial("line15.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#runbtn"), 'visible');

    }, 1500);
}


function t15() {
    clearInterval(myInterval);
    play_audio_tutorial("line16.mp3", lang);
    myInterval = setInterval(function () {
        // handPointAt($("#hand"), $("#blockly-1"), 'visible');
        let id = (demoWorkspace.getToolbox().contents_[1].id_)
        handPointAt($("#hand"), $("#" + id), 'visible');
    }, 1500);
}



function t16() {
    clearInterval(myInterval);
    play_audio_tutorial("line17.mp3", lang);
    handPointAt($("#hand"), $($(".blocklyDraggable")[12]), 'visible');
    let krr = false;
    myInterval = setInterval(function () {
        if (krr) {
            handPointAt($("#hand"), $($(".blocklyDraggable")[0]), 'visible');
            krr = !krr;
        } else {
            handPointAt($("#hand"), $($(".blocklyDraggable")[1]), "visible")
            krr = !krr;
        }
    }, 1500);
}



function t17() {
    clearInterval(myInterval);
    play_audio_tutorial("line18.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $($(".blocklyDraggable")[1]), 'visible');
    }, 1500);
}



function t18() {
    clearInterval(myInterval);
    play_audio_tutorial("line19.mp3", lang);
    myInterval = setInterval(function () {
        handPointAt($("#hand"), $("#runbtn"), 'visible');
    }, 1500);
}



// tour.start();


function say_congrats() {
    var a = new Shepherd.Tour({ defaultStepOptions: { cancelIcon: { enabled: !0 }, classes: "class-1 class-2", scrollTo: { behavior: "smooth", block: "center" } } });
    a.addStep({ title: "Congratulations!", text: image_scaler("well_done.png"), attachTo: { element: "#body", on: "auto" }, buttons: [{ action: function () { return this.next() }, text: "Finish" }], id: "creating" });
    a.start()
}

function v() {
    return true;
}
loadAgain()
window['loadAgain'] = loadAgain

function step2_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return "traffic_signal.red(true)\n" == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step4_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return `traffic_signal.red(true)
traffic_signal.wait(1)
` == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step6_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return "traffic_signal.red(true)\ntraffic_signal.wait(1)\ntraffic_signal.red(true)\n" == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step7_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'traffic_signal.red(true)\ntraffic_signal.wait(1)\ntraffic_signal.red(false)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step10_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'traffic_signal.red(true)\ntraffic_signal.wait(1)\ntraffic_signal.red(false)\ntraffic_signal.red(true)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step11_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'traffic_signal.red(true)\ntraffic_signal.wait(1)\ntraffic_signal.red(false)\ntraffic_signal.amber(true)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step12_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'traffic_signal.red(true)\ntraffic_signal.wait(1)\ntraffic_signal.red(false)\ntraffic_signal.amber(true)\ntraffic_signal.wait(1)\ntraffic_signal.amber(false)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
}

function step14_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'traffic_signal.red(true)\ntraffic_signal.wait(1)\ntraffic_signal.red(false)\ntraffic_signal.amber(true)\ntraffic_signal.wait(1)\ntraffic_signal.amber(false)\ntraffic_signal.green(true)\ntraffic_signal.wait(1)\ntraffic_signal.green(false)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
};


function step17_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'for count in range(10):\n  traffic_signal.red(true)\n  traffic_signal.wait(1)\n  traffic_signal.red(false)\n  traffic_signal.amber(true)\n  traffic_signal.wait(1)\n  traffic_signal.amber(false)\n  traffic_signal.green(true)\n  traffic_signal.wait(1)\n  traffic_signal.green(false)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
};

function step18_val() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    return 'for count in range(5):\n  traffic_signal.red(true)\n  traffic_signal.wait(1)\n  traffic_signal.red(false)\n  traffic_signal.amber(true)\n  traffic_signal.wait(1)\n  traffic_signal.amber(false)\n  traffic_signal.green(true)\n  traffic_signal.wait(1)\n  traffic_signal.green(false)\n' == Blockly.Python.workspaceToCode(demoWorkspace) ? !0 : !1
};

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
        document.getElementById('soundButton').src = "assets/unmute.png";
        document.getElementById('soundButton2').src = "assets/unmute.png";
    } else {
        playAudio = false;
        elementId = document.getElementById('soundButton');
        document.getElementById('soundButton').src = "assets/mute.png";
        document.getElementById('soundButton2').src = "assets/mute.png";
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

document.getElementsByClassName("shepherd-footer")[0].style.display = "none";
document.getElementsByClassName("shepherd-text")[0].style.marginBottom = "15px";