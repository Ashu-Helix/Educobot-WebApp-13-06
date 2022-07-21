const GAME_CONSTANT = {
    bg: { name: "bg", type: "img", src: "forest_2_for_bunny.png" },
    item: { name: "item", type: "img", src: "carrot.png" },
    bunny: {
        name: "bunny", type: "spritesheet", src: "Bunny_2_lowres.png", frameWidth: 100, frameHeight: 119,
        frameRate: 8,
        anims: {
            "idle": { start: 1, end: 1, repeat: -1 },
            "moveLeft": { start: 8, end: 15, repeat: 0 },
            "moveRight": { start: 1, end: 7, repeat: 0 }
        }
    }
};

const SOUND_CONSTANT = {
    jump: { name: "jump", urls: ["sounds/jump.mp3", "sounds/jump.ogg"] },
    collect: { name: "collect", urls: ["sounds/collect.mp3", "sounds/collect.ogg"] },
    win: { name: "win", urls: ["sounds/win.mp3", "sounds/win.ogg"] },
    lose: { name: "lose", urls: ["sounds/lose.mp3", "sounds/lose.ogg"] },
    wrong: { name: "wrong", urls: ["sounds/wrong.mp3", "sounds/wrong.ogg"] }
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