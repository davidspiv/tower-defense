import { c, gridArr, mouse } from "./init.js";
import { enemies, waveArr } from "./waves.js";
import { debounceLeading } from "./utils.js";

let playerHealth: number = 2;
const gameOverlay = document.querySelector(
  "#game-overlay-message"
) as HTMLDivElement;

const image = new Image();
image.src = "img/map.png";
image.onload = () => {
  step();
};

function step() {
  type Numberish = number | null;

  const timeStamp: number = parseFloat(
    document.timeline.currentTime!.toString()
  );

  let start: Numberish = null;
  let previousTimeStamp: Numberish = null;
  let done: boolean = false;
  let isAlive: boolean = true;

  if (start === null) {
    start = timeStamp;
  }

  let elapsed: number = timeStamp - start;

  if (previousTimeStamp !== timeStamp) {
    const count = Math.min(0.1 * elapsed, 200);
    c.drawImage(image, 0, 0);
    for (let row of gridArr) {
      for (let tile of row) {
        tile.update(mouse);
        if (tile.type === "tower") {
          tile.projectileState(enemies, timeStamp);
        }
      }
    }

    isAlive = waveState();

    if (count === 200) done = true;
  }

  if (elapsed < 2000) {
    previousTimeStamp = timeStamp;
    if (!isAlive) {
      console.log("dead");
      gameOverlay.classList.remove("not-visible");
      gameOverlay.classList.add("visible");
    } else {
      gameOverlay.classList.add("not-visible");
    }
    if (!done && isAlive) {
      window.requestAnimationFrame(step);
    }
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
