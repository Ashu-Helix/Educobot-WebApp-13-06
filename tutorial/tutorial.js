
var tour_over = false;

// var audio = new Audio();
var audio = { paused: true };
let kill_audio = () => { if (!audio.paused) audio.pause(); }

let language = {
    language_packs_folder: 'languages',
    language: 'english',
    audio_folder: 'audio',
    image_folder: 'images',
    guide_folder: 'guide',
}
//const code = `print("Hello World")`.split("");
//const user_code = "".split("")
let pred_guide = [];

function image_scaler(lesson_id, file) {
    // let path = `../` + language.image_folder + `/`;
    let path = `https://app.educobot.com/liveLessons/python/${lesson_id}/images/`;
    // let path = `http://localhost:7001/scripts/${lesson_id}/images/`;
    return `<img src = "` + path + file + `" class="responsive-img">`
}

function image_scaler_our_version(lesson_id, file, id, type) {
    // let path = `../` + language.image_folder + `/`;
    // `<img src = "` + "http://localhost:7001/scripts/images/Python Tool Tip square.png" + `" class="responsive-img">`
    // return `<img src = "` + 'http://localhost:7001/scripts/images/Python Tool Tip.png' + `" class="responsive-img">`
    if (id === "tut1" && type === 1) {
        return `<div class=""><img src = "` + process.env.InternalServer + "/img/Python_Tool_Tip_square.png" + `" class="responsive-img" alt = "hint here"><div style="width: 100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -60%);"><p style="font-size:1.5rem;color:#fff;font-weight:700;line-height: 0.7cm;">${file}</p></div></div>`;
    } else if (type === 1) {
        return `<div class=""><img src = "` + process.env.InternalServer + "/img/Python_Tool_Tip.png" + `" class="responsive-img" alt = "hint here"><div style="width: 100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -60%);"><p style="font-size:1.5rem;color:#fff;line-height: 0.7cm;">${file}</p></div></div>`
    } else if (type === 4) {
        return `<div class=""><img src = "` + process.env.InternalServer + "/img/Python_Turtle_Tool_Tip.png" + `" class="responsive-img" alt = "hint here"><div style="width: 100%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -60%);"><p style="font-size:1.5rem;color:#000;line-height: 0.7cm;padding:0.5rem;">${file}</p></div></div>`
    }
}

var playAudio = true;

function getPlayAudio() {

    if (playAudio) {
        kill_audio();
    }

    if (playAudio) {
        playAudio = false;
    } else {
        playAudio = true;
    }
    return playAudio
}

function play_audio_tutorial(lesson_id, file, language) {
    let path = `https://app.educobot.com/liveLessons/python/${lesson_id}/audios/${language}/`;
    // let path = `http://localhost:7001/scripts/${lesson_id}/audios/${language}/`;
    // let path = `../` + language.audio_folder + `/`;
    // console.log(language);
    // if (!audio.paused) audio.pause();
    // audio = new Audio(path + file);
    // audio.play();
    kill_audio();
    if (playAudio) {
        audio = new Audio(path + file);
        audio.play();
    }
}

// function chk() {
//     if (user_code.join("") === `name`)
//         return "step 1 tutorial";
//     else return false;
// }

function demo() {
    console.log("it works");
}

// document.getElementById('modal').children[0].addEventListener("click", demo);

function make_pred_guide(id, file, code, audio, lesson_id, type) {
    // if (type === 1) {
    //     var file2 = `<p style='margin-right:0cm;margin-left:0cm;font-size:16px;font-family:"Calibri",sans-serif;margin:0cm;margin-top:12.0pt;margin-bottom:12.0pt;padding:2rem;'><span style="font-size: 24px; font-family: Calibri, sans-serif; color: rgb(239, 239, 239);">` + file + `</span></p>`;
    //     pred_guide.push({
    //         html: `<div id="` + id + `" class="modal-fixed-footer transparent">
    //         <div id="` + id + `_content" class="modal-content center-align">` + image_scaler_our_version(lesson_id, file, id, type) + `</div>
    //         <div class="modal-footer transparent"><a class="modal-close waves-effect waves-gray btn-flat white-text understood-btn" onclick=" document.getElementById('modal').close();">Understood</a></div></div>`,
    //         shown: false,
    //         id: id,
    //         file: file,
    //         code: code,
    //         audio: audio
    //     });
    // } else 
    // if (type === 2) {
    //     pred_guide.push({
    //         html: `<div id="` + id + `" class="modal-fixed-footer transparent">
    //         <div id="` + id + `_content" class="modal-content center-align">` + image_scaler(lesson_id, file) + `</div>
    //         <div class="modal-footer transparent"><a class="modal-close waves-effect waves-gray btn-flat black-text understood-btn" onclick=" document.getElementById('modal').close();">Understood</a></div></div>`,
    //         shown: false,
    //         id: id,
    //         file: file,
    //         code: code,
    //         audio: audio
    //     });
    // } else 
    if (type === 3 || type === 1 || type === 2) {
        var file2 = `<p style='margin-right:0cm;margin-left:0cm;font-size:16px;font-family:"Calibri",sans-serif;margin:0cm;margin-top:12.0pt;margin-bottom:12.0pt;'><span style="font-size: 24px; font-family: Calibri, sans-serif; color: rgb(0, 0, 0) !important; background-color: #fff !important;">` + file + `</span></p>`;
        pred_guide.push({
            html: `<div id="` + id + `" class="modal-fixed-footer transparent">
            <div id="` + id + `_content" class="modal-content center-align" style="padding:1rem;">` + file2 + `</div>
            <div class="modal-footer transparent"><a class="modal-close waves-effect waves-gray btn-flat black-text understood-btn" onclick=" document.getElementById('modal').close();">Understood</a></div></div > `,
            shown: false,
            id: id,
            file: file,
            code: code,
            audio: audio
        });
    } else if (type === 4) {
        var file2 = `<p style='margin-right:0cm;margin-left:0cm;font-size:16px;font-family:"Calibri",sans-serif;margin:0cm;margin-top:12.0pt;margin-bottom:12.0pt;padding:2rem;'><span style="font-size: 24px; font-family: Calibri, sans-serif; color: rgb(239, 239, 239);">` + file + `</span></p>`;
        pred_guide.push({
            html: `<div id="` + id + `" class="modal-fixed-footer transparent">
            <div id="` + id + `_content" class="modal-content center-align">` + image_scaler_our_version(lesson_id, file, id, type) + `</div>
            <div class="modal-footer transparent"><a class="modal-close waves-effect waves-gray btn-flat black-text understood-btn" onclick=" document.getElementById('modal').close();">Understood</a></div></div>`,
            shown: false,
            id: id,
            file: file,
            code: code,
            audio: audio
        });
    }
}
// make_pred_guide('tip0', 'tip0.png', ``, ``);
// make_pred_guide('tip1', 'tip1.png', `print`, `line52.mp3`);
// make_pred_guide('tip2', 'tip2_HelloWorld.png', `print("Hello World")`, `line0.mp3`);

pred_guide.forEach((i) => {
    //document.querySelector('body').append(i.html);
    //document.getElementById('modal').close();
    document.querySelector('dialog')
});

function helpCode(lesson_id, user_code) {

    pred_guide.forEach((i) => {
        i.shown = false;
    });
    tutorial_guide_updater(lesson_id, user_code);
};

function tutorial_guide_updater(lesson_id, user_code, selectedLanguage) {
    pred_guide.forEach((i) => {
        if (i.shown == false && i.code === user_code.join("")) {
            // document.getElementById('modal').innerHTML = i.html;
            // document.getElementById('modal').show();
            const elem = document.getElementById('modal') //.innerHTML = i.html;
            elem.children[1].innerHTML = i.html;
            document.getElementById('modal').show();

            i.shown = true;
            if (!(i.audio === undefined || i.audio == "")) {
                play_audio_tutorial(lesson_id, i.audio, selectedLanguage);
            }
        }
    });
}


export { tutorial_guide_updater, make_pred_guide, helpCode, getPlayAudio }