const GAME_CONSTANT = {
    bg: { name: "bg", type: "img", src: "Background.png" },
    trafficSignal: { name: "traffic_signal", type: "img", src: "traffic_signal.png" },
    green: { name: "green", type: "img", src: "Green_Light.png" },
    red: { name: "red", type: "img", src: "Red_Light.png" },
    amber: { name: "amber", type: "img", src: "Amber_Light.png" }
};

const SOUND_CONSTANT = {
    bgm: { name: "bgm", urls: ["sounds/bgm.mp3", "sounds/bgm.ogg"] }
}

const ERROR_MESSAGE = 'You have selected wrong shelter for ';
const CORRECT_MESSAGE = 'You have selected right shelter for ';
const ANIMAL_NAME = { horse: "horse", cow: "cow", pig: "pig" };
const SHELTER_NAME = { stable: "stable", shed: "shed", sty: "sty" };
const CORRECT_COMBINATION = { horse: "stable", cow: "shed", pig: "sty" };

export {
    GAME_CONSTANT,
    ERROR_MESSAGE,
    CORRECT_MESSAGE,
    ANIMAL_NAME,
    SHELTER_NAME,
    CORRECT_COMBINATION,
    SOUND_CONSTANT
};