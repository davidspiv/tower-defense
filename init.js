import { Tile, Tower } from "./classes.js";
import { debounceLeading } from "./utils.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const canvasSize = { x: 1280, y: 768 };
const gridSize = { x: 20, y: 12 };

const mouse = {
  x: undefined,
  y: undefined,
};

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
    if (type != "tower") {
      gridArr[row][col] = new Tower(position, "tower");
    } else {
      gridArr[row][col] = new Tile(position, "selected");
    }
  })
);

canvas.addEventListener("mouseup", () => {
  mouse.click = "false";
});

const initGrid = (rows, cols) => {
  const arr = [];

  canvas.width = canvasSize.x;
  canvas.height = canvasSize.y;
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (let rowNum = 0; rowNum < rows; rowNum++) {
    arr.push([]);
    for (let colNum = 0; colNum < cols; colNum++) {
      const cords = {
        x: (canvasSize.x / cols) * colNum + canvasSize.x / (cols * 2),
        y: (canvasSize.y / rows) * rowNum + canvasSize.y / (rows * 2),
      };
      arr[rowNum].push(new Tile(cords, "empty"));
    }
  }
  return arr;
};

const createEnemyPath = (startingPoint, enemyVerts) => {
  enemyVerts.unshift(startingPoint);

  const updateGrid = (cords) => {
    for (let row of gridArr) {
      for (let el of row) {
        if (el.position.x === cords.x && el.position.y === cords.y) {
          el.type = "path";
        }
      }
    }
  };

  for (let i = 1; i < Math.round(enemyVerts.length); i++) {
    const cordX = enemyVerts[i - 1].x;
    const cordY = enemyVerts[i - 1].y;

    const bridgeX = () => {
      const nextCord = enemyVerts[i].x;
      const mult = (nextCord - cordX) / 64;
      const scalar = nextCord > cordX ? 1 : -1;

      for (let i = 0; i <= mult; i++) {
        updateGrid({ x: cordX + 64 * i * scalar, y: cordY });
      }
    };

    const bridgeY = () => {
      const nextCord = enemyVerts[i].y;
      const mult = (nextCord - cordY) / 64;
      const scalar = nextCord > cordY ? 1 : -1;

      for (let i = 1; i < Math.abs(mult); i++) {
        updateGrid({ x: cordX, y: cordY + 64 * i * scalar });
      }
    };

    if (i % 2 === 1) {
      bridgeX();
    } else {
      bridgeY();
    }
  }
};

const gridArr = initGrid(gridSize.y, gridSize.x);

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

createEnemyPath(gridArr[6][0].position, enemyWaypoints);

export { c, canvasSize, mouse, enemyWaypoints, gridArr };
