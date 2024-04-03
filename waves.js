import { Enemy } from "./classes.js";

let enemies = [];
let waves = [];

const addEnemy = () => {
  const enemy = new Enemy();
  enemies.unshift(enemy);
};

const wave = () => {
  if (enemies.length >= 10) return;
  setTimeout(() => {
    addEnemy();
    wave();
  }, 1000);
};

waves.push(wave);

export { enemies, waves };
