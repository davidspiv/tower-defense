import { c, ctx, cSize, gridArr, mouse } from "./init.js";
import { Cord } from "./class/cord.js";
import { Tile } from "./class/tile.js";
import { Tower } from "./class/tower.js";
import { enemies, waveArr } from "./waves.js";
import { debounceLeading } from "./utils.js";

const pos: Cord = mouse.centerOffset;
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
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(
    image,
    (pos.x += mouse.centerOffset.x * mouse.dragSpeed),
    (pos.y += mouse.centerOffset.y * mouse.dragSpeed)
  );
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
    mouse.centerOffset = new Cord();
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

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (mouse.click === true) {
    if (mouse.lastPos.x !== 0 && mouse.lastPos.y !== 0) {
      mouse.centerOffset.x = mouse.x - mouse.lastPos.x;
      mouse.centerOffset.y = mouse.y - mouse.lastPos.y;
      mouse.lastPos = new Cord();
    } else {
      mouse.lastPos.x = mouse.x;
      mouse.lastPos.y = mouse.y;
    }
  }
});

window.addEventListener(
  "mousedown",
  debounceLeading(() => {
    const row = Math.floor(mouse.y / 64);
    const col = Math.floor(mouse.x / 64);
    const position = gridArr[row][col].position;
    const type = gridArr[row][col].type;

    // for (let rowNumber = 0; rowNumber < gridArr.length; rowNumber++) {
    //   const row = gridArr[rowNumber];
    //   for (let colNumber = 0; colNumber < row.length; colNumber++) {
    //     let tile = gridArr[rowNumber][colNumber];
    //     if (tile.type === "selected") {
    //       const pos: Cord = tile.position;

    //       tile = new Tower(pos, "tower");
    //       return;
    //     }
    //   }
    // }

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

window.addEventListener("mouseup", () => {
  mouse.click = false;
});
