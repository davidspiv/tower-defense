import { c, gridArr, mouse } from "./init.js";
import { enemies, waves } from "./waves.js";

const image = new Image();
image.src = "img/map.png";
image.onload = () => {
  step();
  waves[0]();
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
        if (tile.type === "tower") towerState(tile, timeStamp);
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
    if (count === 200) done = true;
  }

  if (elapsed < 2000) {
    // Stop the animation after 2 seconds
    previousTimeStamp = timeStamp;
    if (!done) {
      window.requestAnimationFrame(step);
    }
  }
}

const towerState = (tower, timeStamp) => {
  const projectiles = tower.projectiles;
  const lastProjectile = projectiles[projectiles.length - 1];
  let dist;
  if (projectiles.length > 0) {
    const a = lastProjectile.position.x - tower.position.x;
    const b = lastProjectile.position.y - tower.position.y;
    dist = Math.hypot(a, b);
  }

  if (timeStamp % 10 > tower.rpm || dist === undefined) {
    tower.fire(enemies);
  }

  for (let i = tower.projectiles.length - 1; i >= 0; i--) {
    tower.projectiles[i].update(enemies, tower);
    if (tower.projectiles[i].collision === true) {
      tower.projectiles[i].target.health -= 20;
      tower.projectiles.splice(i, 1);
    }
  }
};
