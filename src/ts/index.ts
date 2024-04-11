import { c, ctx, cSize, gridArr, mouse } from "./init.js";
import { Cord } from "./class/cord.js";
import { Tile } from "./class/tile.js";
import { Tower } from "./class/tower.js";
import { enemies, waveArr } from "./waves.js";
import { debounceLeading } from "./utils.js";

let playerHealth: number = 200;
const gameOverlay = document.querySelector(
  "#game-overlay-message"
) as HTMLDivElement;

const image = new Image();
image.src = "img/map.png";
image.onload = () => {
  step();
};

function step() {
  const timeStamp: number = parseFloat(
    document.timeline.currentTime!.toString()
  );

  let isAlive: boolean = true;

  ctx.drawImage(image, 0, 0);
  for (let row of gridArr) {
    for (let tile of row) {
      tile.update(mouse);
      if (tile.type === "tower") {
        tile.projectileState(enemies, timeStamp);
      }
    }
  }

  isAlive = waveState();

  if (!isAlive) {
    console.log("dead");
    gameOverlay.classList.remove("not-visible");
    gameOverlay.classList.add("visible");
  }
  if (isAlive) {
    window.requestAnimationFrame(step);
  }
}

const waveState = () => {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    if (enemy.health <= 0) {
      enemies.splice(i, 1);
      continue;
    }
    enemy.update();
    if (enemy.reachedBase()) {
      enemies.splice(i, 1);
      playerHealth -= 1;
    }
  }

  if (playerHealth < 0) {
    return false;
  }
  if (enemies.length === 0) {
    newWave();
  }
  return true;
};

const newWave = debounceLeading(() => {
  waveArr[0]();
});

c.addEventListener("mousemove", (e) => {
  const scalar: number = cSize.x / c.getBoundingClientRect().width;
  mouse.x = e.clientX * scalar;
  mouse.y = e.clientY * scalar;

  if (mouse.click === true) {
    if (mouse.lastPos.x !== 0 && mouse.lastPos.y !== 0) {
      mouse.centerOffset.x = mouse.x - mouse.lastPos.x;
      mouse.centerOffset.y = mouse.y - mouse.lastPos.y;
      mouse.lastPos = new Cord();
      console.log(mouse.centerOffset);
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
  mouse.centerOffset.x = 0;
  mouse.centerOffset.y = 0;
});
