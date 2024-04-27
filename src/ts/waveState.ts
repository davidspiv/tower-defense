import { debounceLeading } from "./utils.js";
import { Enemy } from "./class/enemy.js";

let playerHealth = 10;
let enemies: Enemy[] = [];

const addEnemy = () => {
  const enemy = new Enemy();
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

export { enemies, waveState };
