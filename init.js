import { deepEqual } from "./utils.js";
import { Path } from "./classes.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const canvasSize = { x: 1280, y: 768 };
const rows = 12;
const cols = 20;
let grid = [];

canvas.width = canvasSize.x;
canvas.height = canvasSize.y;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

for (let rowNum = 0; rowNum < rows; rowNum++) {
  grid.push([]);
  for (let colNum = 0; colNum < cols; colNum++) {
    grid[rowNum].push({
      x: (canvasSize.x / cols) * colNum + canvasSize.x / (cols * 2),
      y: (canvasSize.y / rows) * rowNum + canvasSize.y / (rows * 2),
    });
  }
}

const enemyPath = [
  grid[6][3],
  grid[2][3],
  grid[2][7],
  grid[9][7],
  grid[9][11],
  grid[2][11],
  grid[2][15],
  grid[7][15],
  grid[7][19],
];

const createPathArr = (startingPoint, enemyVerts) => {
  const pathArr = [];
  enemyVerts.unshift(startingPoint);

  for (let i = 1; i < Math.round(enemyVerts.length); i++) {
    const cordX = enemyVerts[i - 1].x;
    const cordY = enemyVerts[i - 1].y;

    const bridgeX = () => {
      const nextCord = enemyVerts[i].x;
      const mult = (nextCord - cordX) / 64;
      const scalar = nextCord > cordX ? 1 : -1;

      for (let i = 0; i <= mult; i++) {
        const path = { x: cordX + 64 * i * scalar, y: cordY };
        pathArr.push(path);
        paths.push(new Path(path));
      }
    };

    const bridgeY = () => {
      const nextCord = enemyVerts[i].y;
      const mult = (nextCord - cordY) / 64;
      const scalar = nextCord > cordY ? 1 : -1;

      for (let i = 1; i < Math.abs(mult); i++) {
        const path = { x: cordX, y: cordY + 64 * i * scalar };
        pathArr.push(path);
        paths.push(new Path(path));
      }
    };

    if (i % 2 === 1) {
      bridgeX();
    } else {
      bridgeY();
    }
  }
  return pathArr;
};

const createBuildArr = () => {
  const buildArr = [];

  return buildArr;
};

const paths = [];

createPathArr(grid[6][0], enemyPath);
const builds = [];
createBuildArr();
console.log(builds.length);

export { c, canvasSize, enemyPath, paths };
//197
