// /* Developed by Marvsoft LLP */

// let _gameThis = null;
// const baseURL = "assets";
// const gameWidth = 1920;
// const gameHeight = 1080;
// const gameScale = 0.5;
// const developerModeOn = false;
// const cabSpeed = 250;
// const fuelDecreaseConter = 60;

// const magicElement = {
//     fuelSprite: { x: 1720, y: 50, stay: 21, frameWidth: 96.68, frameHeight: 27, frameFrom: 0, frameTo: 21, frameRate: 10, repeat: 0 },

//     leftArrowSprite: { x: 1650, y: 1015, stay: 3, frameWidth: 206, frameHeight: 217, frameFrom: 0, frameTo: 3, frameRate: 30 },
//     rightArrowSprite: { x: 1825, y: 1015, stay: 3, frameWidth: 212, frameHeight: 217, frameFrom: 0, frameTo: 3, frameRate: 30 },
//     upArrowSprite: { x: 1740, y: 925, stay: 3, frameWidth: 210, frameHeight: 213, frameFrom: 0, frameTo: 3, frameRate: 30 },
//     downArrowSprite: { x: 1740, y: 1015, stay: 3, frameWidth: 203, frameHeight: 225, frameFrom: 0, frameTo: 3, frameRate: 30 },
//     shiftKey: { x: 150, y: 990, stay: 1, frameWidth: 484, frameHeight: 308, frameFrom: 0, frameTo: 1, frameRate: 30 }
// }

// /* x - x postion, y - y postion, w - width, h - height, c - color, a - alpha */
// const arrowKeysConst = {
//     left: { x: 1610, y: 975, w: 80, h: 80, c: 0xff0000, a: 0 },
//     right: { x: 1785, y: 975, w: 80, h: 80, c: 0xff0000, a: 0 },
//     up: { x: 1700, y: 890, w: 80, h: 80, c: 0xff0000, a: 0 },
//     down: { x: 1700, y: 975, w: 80, h: 80, c: 0xff0000, a: 0 },
//     shift: { x: 55, y: 930, w: 190, h: 120, c: 0xff0000, a: 0 }
// }

// /* x - x postion, y - y postion, w - width, h - height, c - color, a - alpha */
// const startTrack = [
//     { x: 1650, y: 250, w: 140, h: 120, c: 0xff0000, a: 0 },
//     { x: 1650, y: 420, w: 140, h: 100, c: 0xff0000, a: 0 },
//     { x: 1650, y: 570, w: 140, h: 100, c: 0xff0000, a: 0 }
// ]

// const mazeLines = [
//     // for horizantal lines
//     { x: 480, y: 51, scaleX: 103, scaleY: 2.5 },
//     { x: 483, y: 155, scaleX: 31, scaleY: 2.5 },
//     { x: 889, y: 160, scaleX: 12, scaleY: 2.5 },
//     { x: 1191, y: 175, scaleX: 11, scaleY: 2.5 },
//     { x: 556, y: 258, scaleX: 5, scaleY: 2.5 },
//     { x: 661, y: 258, scaleX: 78.5, scaleY: 2.5 },
//     { x: 576, y: 360, scaleX: 74, scaleY: 2.5 },
//     { x: 551, y: 462, scaleX: 6.5, scaleY: 2.5 },
//     { x: 675, y: 460, scaleX: 74, scaleY: 2.5 },
//     { x: 780, y: 563, scaleX: 54, scaleY: 2.5 },
//     { x: 1372, y: 562, scaleX: 3, scaleY: 2.5 },
//     { x: 760, y: 665, scaleX: 6.7, scaleY: 2.5 },
//     { x: 1295, y: 665, scaleX: 16.1, scaleY: 2.5 },
//     { x: 675, y: 768, scaleX: 12.4, scaleY: 2.5 },
//     { x: 861, y: 768, scaleX: 25, scaleY: 2.5 },
//     { x: 1394, y: 752, scaleX: 5.2, scaleY: 2.5 },
//     { x: 472, y: 852, scaleX: 42.4, scaleY: 2.5 },
//     { x: 983, y: 852, scaleX: 22.1, scaleY: 2.5 },
//     { x: 1263, y: 852, scaleX: 5, scaleY: 2.5 },
//     { x: 475, y: 972, scaleX: 7.4, scaleY: 2.5 },
//     { x: 653, y: 972, scaleX: 45.4, scaleY: 2.5 },
//     { x: 1186, y: 972, scaleX: 33.5, scaleY: 2.5 },

//     // for vertical lines
//     { x: 574, y: 55, scaleX: 2.5, scaleY: 5.8 },
//     { x: 882, y: 63, scaleX: 2.5, scaleY: 11.1 },
//     { x: 1190, y: 63, scaleX: 2.5, scaleY: 12.3 },
//     { x: 1495, y: 66, scaleX: 2.5, scaleY: 90.9 },
//     { x: 698, y: 122, scaleX: 2.5, scaleY: 5.3 },
//     { x: 1085, y: 140, scaleX: 2.5, scaleY: 17 },
//     { x: 1395, y: 170, scaleX: 2.5, scaleY: 49.7 },
//     { x: 474, y: 163, scaleX: 2.5, scaleY: 54.5 },
//     { x: 780, y: 159, scaleX: 2.5, scaleY: 9.6 },
//     { x: 575, y: 263, scaleX: 2.5, scaleY: 65.8 },
//     { x: 660, y: 259, scaleX: 2.5, scaleY: 5 },
//     { x: 880, y: 240, scaleX: 2.5, scaleY: 6.5 },
//     { x: 1295, y: 367, scaleX: 2.5, scaleY: 4.6 },
//     { x: 675, y: 471, scaleX: 2.5, scaleY: 22 },
//     { x: 780, y: 536, scaleX: 2.5, scaleY: 24.3 },
//     { x: 882, y: 540, scaleX: 2.5, scaleY: 7 },
//     { x: 1190, y: 544, scaleX: 2.5, scaleY: 37 },
//     { x: 985, y: 578, scaleX: 2.5, scaleY: 9 },
//     { x: 882, y: 665, scaleX: 2.5, scaleY: 21 },
//     { x: 984, y: 729, scaleX: 2.5, scaleY: 4.6 },
//     { x: 1088, y: 648, scaleX: 2.5, scaleY: 12.3 },
//     { x: 1290, y: 671, scaleX: 2.5, scaleY: 18.8 },
//     { x: 675, y: 744, scaleX: 2.5, scaleY: 6 },
//     { x: 1390, y: 759, scaleX: 2.5, scaleY: 21.5 },
//     { x: 472, y: 817, scaleX: 2.5, scaleY: 15.8 },
//     { x: 985, y: 859, scaleX: 2.5, scaleY: 11.6 },

//     // for small block lines
//     { x: 470, y: 359, scaleX: 5, scaleY: 2.5 },
//     { x: 1465, y: 465, scaleX: 3.8, scaleY: 2.5 },
//     { x: 475, y: 615, scaleX: 5, scaleY: 2.5 },
//     { x: 652, y: 615, scaleX: 3.5, scaleY: 2.5 },
//     { x: 1188, y: 748, scaleX: 5.5, scaleY: 2.5 },
//     { x: 1465, y: 850, scaleX: 4.6, scaleY: 2.5 },

//     { x: 465, y: 51, scaleX: 2.5, scaleY: 4.2 },
//     { x: 1395, y: 55, scaleX: 2.5, scaleY: 4.5 },
//     { x: 575, y: 159, scaleX: 2.5, scaleY: 3.5 },
//     { x: 780, y: 336, scaleX: 2.5, scaleY: 3.8 },
//     { x: 882, y: 363, scaleX: 2.5, scaleY: 4.5 },
//     { x: 1190, y: 324, scaleX: 2.5, scaleY: 5.4 },
//     { x: 780, y: 436, scaleX: 2.5, scaleY: 4.2 },
//     { x: 1085, y: 432, scaleX: 2.5, scaleY: 5 },
//     { x: 985, y: 465, scaleX: 2.5, scaleY: 4 },
//     { x: 1085, y: 565, scaleX: 2.5, scaleY: 4 },
//     { x: 780, y: 933, scaleX: 2.5, scaleY: 6.2 },
//     { x: 1088, y: 948, scaleX: 2.5, scaleY: 4.4 },
//     { x: 1288, y: 945, scaleX: 2.5, scaleY: 5.2 }
// ]