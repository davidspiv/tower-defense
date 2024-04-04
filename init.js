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

const sectionMap = (startingPoint, enemyVerts) => {
  const pathArr = [];
  enemyVerts.unshift(startingPoint);

  for (let i = 1; i < Math.round(enemyVerts.length); i++) {
    const cordX = enemyVerts[i - 1].x;
    const nextCordX = enemyVerts[i].x;
    const cordY = enemyVerts[i - 1].y;
    const nextCordY = enemyVerts[i].y;

    pathArr.push(enemyVerts[i - 1]);

    if (i % 2 === 1) {
      const mult = (nextCordX - cordX) / 64;
      for (let i = 2; i < mult; i++) {
        pathArr.push({ x: cordX + 64 * i, y: cordY });
      }
    } else {
      const mult = (nextCordY - cordY) / 64;
      const scalar = nextCordY > cordY ? 1 : -1;

      for (let i = 2; i < Math.abs(mult); i++) {
        pathArr.push({ x: cordX, y: cordY + 64 * i * scalar });
      }
    }
  }
  return pathArr;
};

const pathArr = sectionMap(grid[6][0], enemyPath);

console.log(pathArr);

function deepEqual(x, y) {
  return x && y && typeof x === "object" && typeof y === "object"
    ? Object.keys(x).length === Object.keys(y).length &&
        Object.keys(x).reduce(function (isEqual, key) {
          return isEqual && deepEqual(x[key], y[key]);
        }, true)
    : x === y;
}

export { c, canvasSize, enemyPath };
