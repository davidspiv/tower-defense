import { c, paths } from "./init.js";
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
  for (let path of paths) {
    path.draw();
  }

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    enemy.update();
    if (enemy.reachedTower()) {
      enemies.splice(i, 1);
      console.log("tower health - 1 point");
    }
  }
}
