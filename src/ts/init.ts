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
  cRatio,
  mouse,
  inputEnemyWaypoints,
  gridArr,
  enemyWaypoints,
  enemyPath,
};

c.addEventListener("mousemove", (e) => {
  const scalar: number = cSize.x / c.getBoundingClientRect().width;
  mouse.x = e.clientX * scalar;
  mouse.y = e.clientY * scalar;

  if (mouse.click === true) {
    if (mouse.lastPos.x !== 0 && mouse.lastPos.y !== 0) {
      currentOffset.x = mouse.x - mouse.lastPos.x;
      currentOffset.y = mouse.y - mouse.lastPos.y;
      mouse.lastPos = new Cord();
    } else {
      mouse.lastPos.x = mouse.x;
      mouse.lastPos.y = mouse.y;
    }
  }
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
