import { Enemy } from "./classes.js";

let enemies = [];
let waves = [];

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

waves.push(wave);

export { enemies, waves };
