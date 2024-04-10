import {
  reformatWaypoints,
  initGrid,
  initEnemyPath,
  calculateEnemySteps,
} from "./initHelpers.js";
import { debounceLeading } from "./utils.js";
import { Cord, Mouse } from "./class/util.js";
import { Tile } from "./class/tile.js";
import { Tower } from "./class/tower.js";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const c = canvas.getContext("2d") as CanvasRenderingContext2D;
const canvasSize: Cord = { x: 1280, y: 768 };
const mouse: Mouse = new Mouse(0, 0);

const gridSize: Cord = { x: 20, y: 12 };
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

const gridArr: any[][] = initGrid(gridSize.y, gridSize.x);
const enemyWaypoints = reformatWaypoints(gridArr, inputEnemyWaypoints);

//create paths from waypoints and update gridArr
initEnemyPath(gridArr, gridArr[6][0].position, enemyWaypoints);

//using the gridArr path, create array of positions to pass to each new enemy
const enemyPath = calculateEnemySteps(enemyWaypoints);

canvas.addEventListener("mousemove", (e) => {
  const scalar: number = canvasSize.x / canvas.getBoundingClientRect().width;
  mouse.x = e.clientX * scalar;
  mouse.y = e.clientY * scalar;
});

canvas.addEventListener(
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
  })
);

canvas.addEventListener("mouseup", () => {
  mouse.click = false;
});

export { c, canvas, canvasSize, mouse, enemyWaypoints, gridArr, enemyPath };
