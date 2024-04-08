import { Tile } from "./classes.js";
import { c, canvas, canvasSize } from "./init.js";

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

const createEnemyPath = (gridArr, startingPoint, enemyVerts) => {
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

const calculatePath = (enemyWaypoints) => {
  const path = [];
  for (let i = 0; i < enemyWaypoints.length; i++) {
    const currentPosition = {
      //import this.radius?
      x: enemyWaypoints[i].x - 30 / 2,
      y: enemyWaypoints[i].y - 30 / 2,
    };
    const nextWaypoint = {
      x: enemyWaypoints[i + 1]?.x - 30 / 2,
      y: enemyWaypoints[i + 1]?.y - 30 / 2,
    };
    if (isNaN(nextWaypoint.x)) {
      nextWaypoint.x = currentPosition.x;
      nextWaypoint.y = currentPosition.y;
    }
    const distance = {
      x: nextWaypoint.x - currentPosition.x,
      y: nextWaypoint.y - currentPosition.y,
    };

    const diff = { x: 0, y: 0 };
    if (Math.abs(distance.x) > 0) {
      for (let i = 1; i <= Math.abs(distance.x); i++) {
        if (distance.x > 0) {
          //right
          diff.x = 1 * i;
        } else {
          //left
          diff.x = -1 * i;
        }
        path.push({
          x: currentPosition.x + diff.x,
          y: currentPosition.y,
        });
      }
    } else {
      for (let i = 0; i <= Math.abs(distance.y); i++) {
        if (distance.y > 0) {
          //up
          diff.y = 1 * i;
        } else {
          //down
          diff.y = -1 * i;
        }
        path.push({
          x: currentPosition.x,
          y: currentPosition.y + diff.y,
        });
      }
    }
  }
  return path;
};

export { initGrid, createEnemyPath, calculatePath };
