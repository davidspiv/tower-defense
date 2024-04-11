import { ctx, gridArr, mouse } from "./init.js";
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
