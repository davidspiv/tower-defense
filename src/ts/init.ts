import {
  reformatWaypoints,
  initGrid,
  initEnemyPath,
  calculateEnemySteps,
} from "./initHelpers.js";
import { debounceLeading } from "./utils.js";
import { Cord } from "./class/cord.js";
import { Mouse } from "./class/mouse.js";
import { Tile } from "./class/tile.js";
import { Tower } from "./class/tower.js";

const c = document.querySelector("canvas") as HTMLCanvasElement;
const ctx = c.getContext("2d") as CanvasRenderingContext2D;
const cSize: Cord = { x: 1280, y: 768 };
const cRatio: number = 0.55;

let gridArr: any[][];
const gridSize = new Cord(20, 12);
// let gridScale: number = 0.01;
// let colSpace: number = (c.width * (1 + gridScale / 100)) / gridSize.x;
// let rowSpace: number = (c.height * (1 + gridScale / 100)) / gridSize.y;

const mouse: Mouse = new Mouse(0, 0);
let currentOffset = new Cord();
let flag: boolean = true;

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
  mouse,
  inputEnemyWaypoints,
  gridArr,
  enemyWaypoints,
  enemyPath,
};

window.addEventListener("mousemove", (e) => {
  // if (e.target !== c) mouse.click = false;
  const scalar: number = c.height / c.width;
  mouse.x = e.clientX * scalar;
  mouse.y = e.clientY * scalar;

  // if (mouse.click === true) {
  //   if (mouse.lastPos.x !== 0 && mouse.lastPos.y !== 0) {
  //     if (mouse.x === mouse.lastPos.x) currentOffset.x = 0;
  //     if (mouse.y === mouse.lastPos.y) currentOffset.y = 0;
  //     currentOffset.x = mouse.x - mouse.lastPos.x;
  //     currentOffset.y = mouse.y - mouse.lastPos.y;
  //     mouse.lastPos = new Cord();
  //   } else {
  //     mouse.lastPos.x = mouse.x;
  //     mouse.lastPos.y = mouse.y;
  //   }
  // }
});

c.addEventListener(
  "mousedown",
  debounceLeading(() => {
    const row = Math.floor(mouse.y / 64);
    const col = Math.floor(mouse.x / 64);
    const position = gridArr[row][col].position;
    const type = gridArr[row][col].type;
    if (type !== "path") {
      if (type != "tower") {
        gridArr[row][col] = new Tower(position, "tower");
      } else {
        gridArr[row][col] = new Tile(position, "selected");
      }
    }
    mouse.click = true;
    mouse.lastPos = { x: mouse.x, y: mouse.y };
  })
);

c.addEventListener("mouseup", () => {
  mouse.click = false;
});

// window.addEventListener(
//   "wheel",
//   debounceLeading((e: WheelEvent) => {
//     const scale = () => {
//       gridScale -= 0.01 * e.deltaY * 0.1;
//     };
//     if (gridScale < -0.5 && e.deltaY > 0) {
//       gridScale = -0.5;
//     } else if (gridScale > 0.2 && e.deltaY < 0) {
//       gridScale = 0.2;
//     }
//     scale();
//     initGrid(gridSize.x, gridSize.y, gridScale);
//   }, 10)
// );
