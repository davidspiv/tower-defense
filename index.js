import { c, gridArr, mouse } from "./init.js";
import { enemies, waves } from "./waves.js";

const image = new Image();
image.src = "img/map.png";
image.onload = () => {
  animate();
  for (let wave of waves) {
    wave();
  }
};

function animate() {
  requestAnimationFrame(animate);
  c.drawImage(image, 0, 0);
  for (let row of gridArr) {
    for (let tile of row) {
      tile.update(mouse);
      if (tile.type === "tower") towerState(tile);
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
}

const towerState = (tower) => {
  //State should be based on external interval; currently based on how far away last "round" is from tower
  const projectiles = tower.projectiles;
  const lastProjectile = projectiles[projectiles.length - 1];
  let dist;
  if (projectiles.length > 0) {
    const a = lastProjectile.position.x - tower.position.x;
    const b = lastProjectile.position.y - tower.position.y;
    dist = Math.hypot(a, b);
  }

  if (dist > tower.rpm || dist === undefined) {
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
