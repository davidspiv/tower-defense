import { Cord } from "./class/cord";
import { Tile } from "./class/tile";
import { canvas, ctx, gridArr, gridTopLeft } from ".";

export let tileWidth: number;
export let tileHeight: number;

export const resetCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = canvas.width * 0.55;
};

export const initGrid = () => {
  const rows = 12;
  const cols = 20;
  const arr: Tile[][] = [];

  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    arr.push([]);
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      tileWidth = canvas.width / cols;
      tileHeight = canvas.height / rows;
      arr[rowIndex].push(new Tile(ctx, tileWidth, tileHeight, new Cord()));
    }
  }
  return arr;
};

export const updateGrid = () => {
  for (let rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    const cols = gridArr[rowIndex].length;
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const tile = gridArr[rowIndex][colIndex];
      const oldPos = tile.position;
      tileWidth = canvas.width / cols;
      tileHeight = canvas.height / gridArr.length;
      const cord = {
        x: tileWidth * colIndex + gridTopLeft.x,
        y: tileHeight * rowIndex + gridTopLeft.y,
      };
      const diff = new Cord(oldPos.x - cord.x, oldPos.y - cord.y);
      tile.position = cord;
      tile.width = canvas.width / cols;
      tile.height = canvas.height / gridArr.length;
      tile.center = new Cord(
        tile.position.x + tile.width / 2,
        tile.position.y + tile.height / 2
      );
      if (tile.hasOwnProperty("projVelocity")) {
        for (let projectile of tile.projectiles) {
          projectile.position.x -= diff.x;
          projectile.position.y -= diff.y;
        }
        gridArr[rowIndex][colIndex] = tile;
      }
    }
  }
};

export const reformatWaypoints = (gridArr: Tile[][], input: Cord[]) => {
  const reformattedWaypoints = [];
  for (let i = 0; i < input.length; i++) {
    reformattedWaypoints.push(gridArr[input[i].y][input[i].x].position);
  }
  return reformattedWaypoints;
};

export const embedPath = (gridArr: Tile[][], enemyVerts: Cord[]) => {
  for (let rowIndex = 0; rowIndex < gridArr.length; rowIndex++) {
    const cols = gridArr[rowIndex].length;
    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const tile = gridArr[rowIndex][colIndex];

      for (let i = 0; i < enemyVerts.length; i++) {
        if (
          enemyVerts[i].x === tile.position.x &&
          enemyVerts[i].y === tile.position.y
        ) {
          tile.type = "path";
          break;
        }
      }
    }
  }
};

export const calculateEnemySteps = (enemyWaypoints: Cord[]) => {
  const path = [];
  for (let i = 0; i < enemyWaypoints.length; i++) {
    const currentPosition = {
      //import this.radius?
      x: enemyWaypoints[i].x - canvas.width / 50 / 2,
      y: enemyWaypoints[i].y - canvas.width / 50 / 2,
    };
    const nextWaypoint = {
      x: enemyWaypoints[i + 1]?.x - canvas.width / 50 / 2,
      y: enemyWaypoints[i + 1]?.y - canvas.width / 50 / 2,
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
          x: currentPosition.x + diff.x + gridTopLeft.x,
          y: currentPosition.y + gridTopLeft.y,
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
          x: currentPosition.x + gridTopLeft.x,
          y: currentPosition.y + diff.y + gridTopLeft.y,
        });
      }
    }
  }
  return path;
};
