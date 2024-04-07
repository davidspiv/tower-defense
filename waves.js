import { Enemy } from "./classes.js";

let enemies = [];
let waves = [];

const addEnemy = () => {
  const enemy = new Enemy();
  enemies.unshift(enemy);
};

const wave = (count = 0) => {
  if (count > 10) return;
  console.log(count);
  setTimeout(() => {
    addEnemy();
    wave(count);
  }, 1000);
  count += 1;
};

waves.push(wave);

export { enemies, waves };
