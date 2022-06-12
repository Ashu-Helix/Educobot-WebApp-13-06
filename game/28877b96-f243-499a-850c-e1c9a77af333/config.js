/* Developed by Marvsoft LLP */

// let baseURL = "assets";
// let gameWidth = 960;
// let gameHeight = 540;
// let gameScale = 0.5;
// let road = [
//   { x: gameWidth * 0.3, y: 0 },
//   { x: gameWidth * 0.706, y: 0 },
//   { x: 0, y: gameHeight * 0.8 },
// ];
// let directionAngle = { right: 0, bottom: 1, left: 2, top: 3 };
// let rotateDirAngle = Math.PI / 2;
// let roadWidth = gameWidth * 0.1;
// let vehicleInitialPosition = {
//   ambulance: {
//     direction: "bottom",
//     road: 1,
//     position: { x: 677, y: 305 },
//     source: null,
//     target: null,
//   },
//   bus: {
//     direction: "right",
//     road: 1,
//     position: { x: 85, y: 445 },
//     source: null,
//     target: null,
//   },
//   fireBrigade: {
//     direction: "bottom",
//     road: 1,
//     position: { x: 323, y: 60 },
//     source: null,
//     target: null,
//   },
//   policeCar: {
//     direction: "left",
//     road: 1,
//     position: { x: 900, y: 500 },
//     source: null,
//     target: null,
//   },
// };
// let buildingPosition = [
//   { x1: 100, y1: 250, x2: 140, y2: 280, name: 'hospital' },
//   { x1: 450, y1: 230, x2: 490, y2: 260, name: 'busStand' },
//   { x1: 810, y1: 210, x2: 850, y2: 240, name: 'fireStation' },
//   { x1: 450, y1: 160, x2: 490, y2: 190, name: 'policeStation' }
// ];
// let paths = {
//   ambulance_hospital: [
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 505, duration: 1500, direction: "bottom" },
//     { x: 266, y: 505, duration: 2000, direction: "left" },
//     { x: 266, y: 267, duration: 2000, direction: "top" },
//     { x: 100, y: 267, duration: 2000, direction: "left" },
//   ],
//   ambulance_busStand: [
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 242, duration: 1500, direction: "bottom" },
//     { x: 477, y: 242, duration: 1500, direction: "left" },
//   ],
//   ambulance_fireStation: [
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 228, duration: 1500, direction: "bottom" },
//     { x: 797, y: 228, duration: 1500, direction: "right" },
//   ],
//   ambulance_policeStation: [
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 305, duration: 1, direction: "bottom" },
//     { x: 677, y: 170, duration: 1500, direction: "bottom" },
//     { x: 450, y: 170, duration: 2000, direction: "left" },

//   ],

//   bus_hospital: [
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 266, y: 445, duration: 1500, direction: "right" },
//     { x: 266, y: 267, duration: 2000, direction: "top" },
//     { x: 100, y: 267, duration: 2000, direction: "left" },
//   ],
//   bus_busStand: [
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 266, y: 445, duration: 1500, direction: "right" },
//     { x: 266, y: 244, duration: 1500, direction: "top" },
//     { x: 460, y: 244, duration: 1500, direction: "right" },
//   ],
//   bus_fireStation: [
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 620, y: 448, duration: 2000, direction: "right" },
//     { x: 620, y: 225, duration: 1000, direction: "top" },
//     { x: 840, y: 225, duration: 1000, direction: "right" },
//   ],
//   bus_policeStation: [
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 85, y: 445, duration: 1, direction: "right" },
//     { x: 266, y: 445, duration: 1500, direction: "right" },
//     { x: 266, y: 175, duration: 1500, direction: "top" },
//     { x: 460, y: 175, duration: 1500, direction: "right" },
//   ],

//   fireBrigade_hospital: [
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 325, y: 260, duration: 2000, direction: "bottom" },
//     { x: 70, y: 260, duration: 2000, direction: "left" },
//   ],
//   fireBrigade_busStand: [
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 325, y: 245, duration: 2000, direction: "bottom" },
//     { x: 480, y: 245, duration: 2000, direction: "right" },
//   ],
//   fireBrigade_fireStation: [
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 323, y: 448, duration: 1500, direction: "bottom" },
//     { x: 620, y: 448, duration: 2000, direction: "right" },
//     { x: 620, y: 228, duration: 1000, direction: "top" },
//     { x: 815, y: 228, duration: 1000, direction: "right" },
//   ],
//   fireBrigade_policeStation: [
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 323, y: 60, duration: 1, direction: "bottom" },
//     { x: 325, y: 175, duration: 2000, direction: "bottom" },
//     { x: 480, y: 175, duration: 2000, direction: "right" },
//   ],

//   policeCar_hospital: [
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 266, y: 505, duration: 2000, direction: "left" },
//     { x: 266, y: 267, duration: 2000, direction: "top" },
//     { x: 50, y: 267, duration: 2000, direction: "left" },
//   ],
//   policeCar_busStand: [
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 620, y: 500, duration: 2000, direction: "left" },
//     { x: 620, y: 250, duration: 2000, direction: "top" },
//     { x: 465, y: 250, duration: 2000, direction: "left" },
//   ],
//   policeCar_fireStation: [
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 620, y: 500, duration: 2000, direction: "left" },
//     { x: 620, y: 220, duration: 2000, direction: "top" },
//     { x: 815, y: 220, duration: 2000, direction: "right" },
//   ],
//   policeCar_policeStation: [
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 900, y: 500, duration: 1, direction: "left" },
//     { x: 620, y: 500, duration: 2000, direction: "left" },
//     { x: 620, y: 175, duration: 2000, direction: "top" },
//     { x: 465, y: 175, duration: 2000, direction: "left" },
//   ],
// };