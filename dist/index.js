import { c, gridArr, mouse } from "./init.js";
import { enemies, waveArr } from "./waves.js";
import { debounceLeading } from "./utils.js";
const image = new Image();
image.src = "img/map.png";
image.onload = () => {
    step();
};
function step() {
    const timeStamp = parseFloat(document.timeline.currentTime.toString());
    let start = null;
    let previousTimeStamp = null;
    let done = false;
    if (start === null) {
        start = timeStamp;
    }
    let elapsed = timeStamp - start;
    if (previousTimeStamp !== timeStamp) {
        const count = Math.min(0.1 * elapsed, 200);
        c.drawImage(image, 0, 0);
        for (let row of gridArr) {
            for (let tile of row) {
                tile.update(mouse);
                if (tile.type === "tower") {
                    tile.projectileState(enemies, timeStamp);
                }
            }
        }
        waveState();
        if (count === 200)
            done = true;
    }
    if (elapsed < 2000) {
        previousTimeStamp = timeStamp;
        if (!done) {
            window.requestAnimationFrame(step);
        }
    }
}
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
        }
    }
    if (enemies.length === 0) {
        newWave();
    }
};
const newWave = debounceLeading(() => {
    waveArr[0]();
});
