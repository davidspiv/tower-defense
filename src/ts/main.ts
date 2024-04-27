import { debounceLeading } from "./utils";
import { Cord } from "./class/cord";
import { Mouse } from "./class/mouse";
import { Tower } from "./class/tower.js";
import { waveState, enemies } from "./waveState.js";
// import { Tile } from "./class/tile";
import {
  tileWidth,
  tileHeight,
  reset,
  initGrid,
  updateGrid,
  reformatWaypoints,
  embedPath,
  calculateEnemySteps,
} from "./helper.js";

//INPUT
let mouse = new Mouse();

//OUTPUT
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

//GRID
let gridArr: any[][];
let gridTopLeft = new Cord();
let offsetDifference = new Cord();
let enemyWaypoints: Cord[];
let enemyPath: Cord[];

//ANIMATION
const interval: number = 1000 / 60;
let animationFrame: number;
let startTime: number = 0;
let timer: number = 0;

window.onload = function () {
  canvas = document.querySelector("#canvas1")!;
  ctx = canvas.getContext("2d")!;

  let isAlive: boolean = true;

  const animate = (timeStamp: any) => {
    let deltaTime: number = timeStamp - startTime;
    startTime = timeStamp;

    if (timer > interval) {
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const image = new Image();
      image.src = "img/map.png";
      ctx.drawImage(
        image,
        gridTopLeft.x,
        gridTopLeft.y,
        canvas.width,
        canvas.height
      );

      for (let i = 0; i < gridArr.length; i++) {
        for (let j = 0; j < gridArr[i].length; j++) {
          const tile = gridArr[i][j];
          tile.update(mouse);

          if (tile.type === "tower") {
            if (!tile.hasOwnProperty("projVelocity")) {
              const lastPos = tile.position;
              gridArr[i][j] = new Tower(ctx, tileWidth, tileHeight, lastPos);
            } else {
              tile.projectileState(enemies);
            }
          }
        }
      }

      mouse.select = false;
      // mouse.click = false;
    } else if (!isNaN(deltaTime)) {
      timer += deltaTime;
    }

    isAlive = waveState();
    if (isAlive) animationFrame = requestAnimationFrame(animate);
  };

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

  reset();
  gridArr = initGrid();
  updateGrid();
  enemyWaypoints = reformatWaypoints(gridArr, inputEnemyWaypoints);
  embedPath(gridArr, enemyWaypoints);
  enemyPath = calculateEnemySteps(enemyWaypoints);
  animate(animate);

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    reset();
    updateGrid();
    gridTopLeft = new Cord(gridArr[0][0].x, gridArr[0][0].y);
    enemyWaypoints = reformatWaypoints(gridArr, inputEnemyWaypoints);
    embedPath(gridArr, enemyWaypoints);
    enemyPath = calculateEnemySteps(enemyWaypoints);
    animate(animate);
  });

  window.addEventListener(
    "mousedown",
    debounceLeading(() => {
      mouse.click = true;
    }, 10)
  );

  window.addEventListener(
    "mouseup",
    debounceLeading(() => {
      mouse.mouseUp();
    }, 10)
  );

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (mouse.click === true) {
      mouse.drag = true;
      if (mouse.lastPos.x === 0 && mouse.lastPos.y === 0) {
        mouse.lastPos.x = mouse.x;
        mouse.lastPos.y = mouse.y;
      } else {
        offsetDifference = new Cord(
          mouse.x - mouse.lastPos.x,
          mouse.y - mouse.lastPos.y
        );

        gridTopLeft.x += offsetDifference.x;
        gridTopLeft.y += offsetDifference.y;
        updateGrid();
        enemyPath = calculateEnemySteps(enemyWaypoints);
        mouse.lastPos = new Cord();
      }
    }
  });
};

export {
  canvas,
  ctx,
  mouse,
  gridArr,
  gridTopLeft,
  offsetDifference,
  enemyWaypoints,
  enemyPath,
};
