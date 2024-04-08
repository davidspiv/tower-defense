import { c, gridArr, mouse } from "./init.js";
import { enemies, waves } from "./waves.js";
import { debounceLeading } from "./utils.js";

const image = new Image();
image.src = "img/map.png";
image.onload = () => {
  step();
};

function step() {
  const timeStamp = document.timeline.currentTime;
  let start, previousTimeStamp;
  let done = false;

  if (start === undefined) {
    start = timeStamp;
  }

  const elapsed = timeStamp - start;

  if (previousTimeStamp !== timeStamp) {
    const count = Math.min(0.1 * elapsed, 200);
    c.drawImage(image, 0, 0);
    for (let row of gridArr) {
      for (let tile of row) {
        tile.update(mouse);
        if (tile.type === "tower") tile.state(enemies, timeStamp);
      }
    }

    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (enemy.health <= 0) {
        enemies.splice(i, 1);
        continue;
      }
      enemy.update();
      if (enemy.reachedTower()) {
        enemies.splice(i, 1);
      }
    }

    if (enemies.length === 0) {
      spawnEnemies();
    }

    if (count === 200) done = true;
  }

  if (elapsed < 2000) {
    previousTimeStamp = timeStamp;
    if (!done) {
      window.requestAnimationFrame(step);
    }
  }
}

const spawnEnemies = debounceLeading(() => {
  waves[0]();
});
