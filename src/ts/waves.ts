import { Enemy } from "./class/enemy.js";
import { enemyPath } from "./init.js";

let enemies: Enemy[] = [];

const addEnemy = () => {
  const enemy = new Enemy(enemyPath);
  enemies.unshift(enemy);
};

const wave = (count = 0) => {
  if (count > 2) return;
  setTimeout(() => {
    addEnemy();
    wave(count);
  }, 1000);
  count += 1;
};

const waveArr = [wave];

export { waveArr, enemies };
