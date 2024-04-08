import { initGrid, createEnemyPath, calculatePath } from "./initHelpers.js";
import { debounceLeading } from "./utils.js";
import { Tile, Tower } from "./classes.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const canvasSize = { x: 1280, y: 768 };
const gridSize = { x: 20, y: 12 };

const mouse = {
  x: undefined,
  y: undefined,
};

const gridArr = initGrid(gridSize.y, gridSize.x);

// RULES FOR CREATING WAYPOINTS
// gridArr[min: 0; max: gridSize.x - 1][min: 0; max: gridSize.y - 1];
// must create 90 deg intersections
// final waypoint = gridArr[max][Math.floor(max/2)]
const enemyWaypoints = [
  gridArr[6][3].position,
  gridArr[2][3].position,
  gridArr[2][7].position,
  gridArr[9][7].position,
  gridArr[9][11].position,
  gridArr[2][11].position,
  gridArr[2][15].position,
  gridArr[7][15].position,
  gridArr[7][19].position,
];

//update gridArr to include paths
createEnemyPath(gridArr, gridArr[6][0].position, enemyWaypoints);

//Create array of positions to pass to each new enemy
const enemyPath = calculatePath(enemyWaypoints);

canvas.addEventListener("mousemove", (e) => {
  const scalar = canvasSize.x / canvas.getBoundingClientRect().width;
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
  mouse.click = "false";
});

export { c, canvas, canvasSize, mouse, enemyWaypoints, gridArr, enemyPath };
