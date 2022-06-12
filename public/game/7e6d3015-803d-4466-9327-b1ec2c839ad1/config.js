/* Developed by Marvsoft LLP */

let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const mouseSpeed = 250;

const magicElement = {
    mouseUpDown: {
        x: 100,
        y: 100,
        stay: 0,
        frameWidth: 24,
        frameHeight: 38,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
    },
    mouseLeftRight: {
        x: 100,
        y: 100,
        stay: 0,
        frameWidth: 38,
        frameHeight: 24,
        frameFrom: 0,
        frameTo: 5,
        frameRate: 10,
    },

    leftArrowSprite: {
        x: 1690,
        y: 975,
        stay: 3,
        frameWidth: 206,
        frameHeight: 217,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
    rightArrowSprite: {
        x: 1865,
        y: 975,
        stay: 3,
        frameWidth: 212,
        frameHeight: 217,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
    upArrowSprite: {
        x: 1780,
        y: 885,
        stay: 3,
        frameWidth: 210,
        frameHeight: 213,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
    downArrowSprite: {
        x: 1780,
        y: 975,
        stay: 3,
        frameWidth: 203,
        frameHeight: 225,
        frameFrom: 0,
        frameTo: 3,
        frameRate: 30,
    },
};

const mouseMovement = {
    left: { frameStart: 0, frameEnd: 2, state: 0 },
    right: { frameStart: 3, frameEnd: 5, state: 3 },
    up: { frameStart: 3, frameEnd: 5, state: 3 },
    down: { frameStart: 0, frameEnd: 2, state: 0 },
};

const mazeLines = [
    { x: 315, y: 40, scaleX: 128, scaleY: 2 },
    { x: 439, y: 132, scaleX: 103.5, scaleY: 2 },
    { x: 573, y: 235, scaleX: 76.5, scaleY: 2 },
    { x: 706, y: 335, scaleX: 49.9, scaleY: 2 },
    { x: 815, y: 437, scaleX: 27, scaleY: 2 },
    { x: 572, y: 565, scaleX: 25, scaleY: 2 },
    { x: 314, y: 655, scaleX: 14.5, scaleY: 2 },
    { x: 707, y: 700, scaleX: 13, scaleY: 2 },
    { x: 959, y: 698, scaleX: 24.2, scaleY: 2 },
    { x: 318, y: 765, scaleX: 26, scaleY: 2 },
    { x: 718, y: 800, scaleX: 33, scaleY: 2 },
    { x: 1188, y: 800, scaleX: 15, scaleY: 2 },
    { x: 439, y: 902, scaleX: 42, scaleY: 2 },
    { x: 976, y: 904, scaleX: 49.8, scaleY: 2 },
    { x: 318, y: 995, scaleX: 127.8, scaleY: 2 },

    { x: 315, y: 51, scaleX: 2, scaleY: 61 },
    { x: 1575, y: 48, scaleX: 2, scaleY: 14 },
    { x: 439, y: 140, scaleX: 2, scaleY: 52 },
    { x: 1455, y: 148, scaleX: 2, scaleY: 76 },
    { x: 572, y: 244, scaleX: 2, scaleY: 57 },
    { x: 1321, y: 238, scaleX: 2, scaleY: 58 },
    { x: 705, y: 348, scaleX: 2, scaleY: 12 },
    { x: 1185, y: 344, scaleX: 2, scaleY: 37 },
    { x: 812, y: 438, scaleX: 2, scaleY: 20 },
    { x: 1080, y: 438, scaleX: 2, scaleY: 20 },
    { x: 705, y: 579, scaleX: 2, scaleY: 13 },
    { x: 957, y: 624, scaleX: 2, scaleY: 9 },
    { x: 1040, y: 702, scaleX: 2, scaleY: 22 },
    { x: 318, y: 771, scaleX: 2, scaleY: 24 },
    { x: 438, y: 771, scaleX: 2, scaleY: 13 },
    { x: 1575, y: 282, scaleX: 2, scaleY: 72 },
];

const arrowKeysConst = {
    left: { x: 1650, y: 930, w: 80, h: 80, c: 0xff0000, a: 0 },
    right: { x: 1825, y: 930, w: 80, h: 80, c: 0xff0000, a: 0 },
    up: { x: 1740, y: 840, w: 80, h: 80, c: 0xff0000, a: 0 },
    down: { x: 1740, y: 930, w: 80, h: 80, c: 0xff0000, a: 0 },
};

export {
    baseURL,
    gameHeight,
    gameWidth,
    gameScale,
    arrowKeysConst,
    mazeLines,
    mouseMovement,
    magicElement,
    mouseSpeed,
};