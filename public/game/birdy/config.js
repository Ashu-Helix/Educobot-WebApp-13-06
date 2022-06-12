/* Developed by Marvsoft LLP */

// let _gameThis = null;
const baseURL = "../img";
const gameWidth = 1920;
const gameHeight = 1080;
const gameScale = 1;
const noOfStaticBirds = 8;
const correctBirdCount = 2;

const signInitialPosition = {
    plusSign: {
        position: { x: 570, y: 790 },
    },
    equalSign: {
        position: { x: 1300, y: 790 },
    },
};

const staticBirdInitialPosition = {
    staticBird0: {
        position: { x: 140, y: 764 },
    },
    staticBird1: {
        position: { x: 290, y: 730 },
    },
    staticBird2: {
        position: { x: 320, y: 780 },
    },
    staticBird3: {
        position: { x: 1556, y: 776 },
    },
    staticBird4: {
        position: { x: 1670, y: 740 },
    },
    staticBird5: {
        position: { x: 1710, y: 790 },
    },
    staticBird6: {
        position: { x: 1820, y: 730 },
    },
    staticBird7: {
        position: { x: 1820, y: 790 },
    },
};

const flyingBirdInitPos = [{
        name: "bird",
        stayAt: 1,
        x: 290,
        y: 290,
        frameWidth: 275,
        frameHeight: 215,
    },
    {
        name: "bird",
        stayAt: 1,
        x: 180,
        y: 290,
        frameWidth: 275,
        frameHeight: 215,
    },
    {
        name: "bird",
        stayAt: 1,
        x: 70,
        y: 285,
        frameWidth: 275,
        frameHeight: 215,
    },
];

const path = {
    bird0_nest1: [{
            x: 253,
            y: 787,
            frameFrom: 0,
            frameTo: 7,
            time: 1500,
            frameRate: 6,
            angle: 0.01,
        },
        { stayAt: 1 },
    ],
    bird1_nest1: [{
            x: 155,
            y: 805,
            frameFrom: 0,
            frameTo: 7,
            time: 1500,
            frameRate: 6,
            angle: 0.01,
        },
        { stayAt: 1 },
    ],
    bird2_nest1: [{
            x: 191,
            y: 690,
            frameFrom: 0,
            frameTo: 7,
            time: 1500,
            frameRate: 6,
            angle: 0.01,
        },
        { stayAt: 1 },
    ],

    bird0_nest2: [
        { x: 565, y: 300, frameFrom: 0, frameTo: 7, time: 1000, frameRate: 6 },
        {
            x: 930,
            y: 710,
            frameFrom: 0,
            frameTo: 7,
            time: 2000,
            frameRate: 6,
            angle: 0.1,
        },
        {
            x: 1010,
            y: 750,
            frameFrom: 0,
            frameTo: 7,
            time: 500,
            frameRate: 6,
            angle: 0.01,
        },
        { stayAt: 1 },
    ],
    bird1_nest2: [
        { x: 565, y: 300, frameFrom: 0, frameTo: 7, time: 1000, frameRate: 6 },
        {
            x: 830,
            y: 710,
            frameFrom: 0,
            frameTo: 7,
            time: 2000,
            frameRate: 6,
            angle: 0.1,
        },
        {
            x: 910,
            y: 750,
            frameFrom: 0,
            frameTo: 7,
            time: 500,
            frameRate: 6,
            angle: 0.01,
        },
        { stayAt: 1 },
    ],
    bird2_nest2: [
        { x: 565, y: 300, frameFrom: 0, frameTo: 7, time: 1000, frameRate: 6 },
        {
            x: 730,
            y: 710,
            frameFrom: 0,
            frameTo: 7,
            time: 2000,
            frameRate: 6,
            angle: 0.1,
        },
        {
            x: 810,
            y: 750,
            frameFrom: 0,
            frameTo: 7,
            time: 500,
            frameRate: 6,
            angle: 0.01,
        },
        { stayAt: 1 },
    ],
};

export {
    // _gameThis,
    baseURL,
    correctBirdCount,
    flyingBirdInitPos,
    gameHeight,
    gameScale,
    gameWidth,
    noOfStaticBirds,
    path,
    signInitialPosition,
    staticBirdInitialPosition,
};