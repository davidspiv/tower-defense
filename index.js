import grid from "./grid.js";
import { enemies, waves } from "./waves.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 768;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const waypoints = grid(12, 20);
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

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    enemy.update();
    if (enemy.reachedTower()) {
      enemies.splice(i, 1);
      console.log("tower health - 1 point");
    }
  }
}

export { c, canvas, waypoints };
