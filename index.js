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

      for (let i = tile.projectiles.length - 1; i >= 0; i--) {
        tile.projectiles[i].update(enemies);
        if (tile.projectiles[i].collision === true) {
          tile.projectiles.splice(i, 1);
          console.log("enemy health - 1");
        }
      }
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    enemy.update();
    if (enemy.reachedTower()) {
      enemies.splice(i, 1);
      console.log("tower health - 1");
    }
  }

  mouse.click = "false";
}
