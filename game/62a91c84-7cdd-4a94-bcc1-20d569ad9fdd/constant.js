const GAME_CONSTANT = {
    bg: { name: "bg", type: "img", src: "Waste Management BG.png" },
    dry: { name: "dry", type: "img", src: "Dry Waste.png" },
    wet: { name: "wet", type: "img", src: "Wet Waste.png" },

    leaf: { name: "leaf", type: "img", src: "Leaf.png" },
    cup: { name: "cup", type: "img", src: "Plastic Cup.png" },
    screw: { name: "screw", type: "img", src: "Screw.png" },
    spects: { name: "spects", type: "img", src: "Spects.png" },
    candy: { name: "candy", type: "img", src: "Candy.png" },
    watermelon: { name: "watermelon", type: "img", src: "Water Melon.png" },

    robot: {
        name: "robot", type: "spritesheet", src: "Cleaning Robot.png", frameWidth: 123, frameHeight: 136,
        frameRate: 8,
        anims: {
            "idle": { start: 0, end: 0, frames: [12], repeat: -1 },
            "left": { start: 0, end: 0, frames: [0, 1, 2, 3], repeat: -1 },
            "right": { start: 0, end: 0, frames: [6, 7, 8, 9], repeat: -1 },
            "down": { start: 0, end: 0, frames: [12, 13, 14, 15], repeat: -1 },
            "up": { start: 0, end: 0, frames: [18, 19, 20, 21], repeat: -1 },
            "itemLeft": { start: 0, end: 0, frames: [4, 5, 4], repeat: 0 },
            "itemRight": { start: 0, end: 0, frames: [10, 11, 10], repeat: 0 },
            "itemDown": { start: 0, end: 0, frames: [16, 17, 16], repeat: 0 },
            "itemUp": { start: 0, end: 0, frames: [22, 23, 22], repeat: 0 },
            "celebrate": { start: 0, end: 0, frames: [16, 17, 16], repeat: -1 }
        }
    }
};

const SOUND_CONSTANT = {
    walk: { name: "walk", urls: ["sounds/walk.mp3", "sounds/walk.ogg"] },
    win: { name: "win", urls: ["sounds/win.mp3", "sounds/win.ogg"] },
    lose: { name: "lose", urls: ["sounds/lose.mp3", "sounds/lose.ogg"] },
    correct: { name: "correct", urls: ["sounds/correct.mp3", "sounds/correct.ogg"] },
    wrong: { name: "wrong", urls: ["sounds/wrong.mp3", "sounds/wrong.ogg"] },
    pickup: { name: "pickup", urls: ["sounds/pickup.mp3", "sounds/pickup.ogg"] }
}

const ERROR_MESSAGE = 'You have selected wrong shelter for ';
const CORRECT_MESSAGE = 'You have selected right shelter for ';

export {
    GAME_CONSTANT,
    ERROR_MESSAGE,
    CORRECT_MESSAGE,
    SOUND_CONSTANT,
};