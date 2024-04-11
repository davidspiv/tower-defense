import {
  initGrid,
  reformatWaypoints,
  initEnemyPath,
  calculateEnemySteps,
} from "./initHelpers.js";
import { Cord } from "./class/cord.js";
import { Mouse } from "./class/mouse.js";

const c = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = c.getContext("2d") as CanvasRenderingContext2D;
const cSize: Cord = { x: 1280, y: 768 };
const cRatio: number = 0.55;

let gridArr: any[][];
const gridSize = new Cord(20, 12);

const mouse: Mouse = new Mouse(0, 0);

const inputEnemyWaypoints: Cord[] = [
  { x: 0, y: 6 },
  { x: 3, y: 6 },
  { x: 3, y: 2 },
  { x: 7, y: 2 },
  { x: 7, y: 9 },
  { x: 11, y: 9 },
  { x: 11, y: 2 },
  { x: 15, y: 2 },
  { x: 15, y: 7 },
  { x: 19, y: 7 },
];

gridArr = initGrid(gridSize.y, gridSize.x);
const enemyWaypoints = reformatWaypoints(gridArr, inputEnemyWaypoints);

//create paths from waypoints and update gridArr
initEnemyPath(gridArr, gridArr[6][0].position, enemyWaypoints);

//using the gridArr path, create array of positions to pass to each new enemy
const enemyPath = calculateEnemySteps(enemyWaypoints);

export {
  c,
  ctx,
  cSize,
  cRatio,
  mouse,
  inputEnemyWaypoints,
  gridArr,
  enemyWaypoints,
  enemyPath,
};
