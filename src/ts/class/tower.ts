import { Cord } from "./cord.js";
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { Tile } from "./tile.js";
import { diff } from "../utils.js";

export class Tower extends Tile {
  projectiles: Projectile[];
  range: number;
  rpm: number;
  projVelocity: number;
  projDamage: number;
  tracking: boolean;
  lastProjTimestamp: null | number;

  constructor(position: Cord, type: string, color: string = "brown") {
    super(position, color, type);
    this.projectiles = [];
    this.range = 250;
    this.rpm = 500;
    this.projVelocity = 3;
    this.projDamage = 10;
    this.tracking = false;
    this.lastProjTimestamp = null;
  }

  projectileState(enemies: Enemy[], timeStamp: null | number) {
    const targets = this.buildTargetArr(enemies);
    let timeSinceLastShot: null | number = this.lastProjTimestamp;

    if (targets.length > 0) {
      const target = targets[targets.length - 1];
      if (timeStamp === null) timeStamp = 0;
      if (timeSinceLastShot === null) timeSinceLastShot = 0;
      if (timeStamp - timeSinceLastShot > this.rpm) {
        let intersectAngle: number | null;
        if (this.tracking === false) {
          intersectAngle = this.calcIntersect(target)!;
        } else {
          intersectAngle = null;
        }

        this.fire(target, intersectAngle);
        this.lastProjTimestamp = timeStamp;
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();
      if (projectile.collision === true) {
        projectile.target.health -= projectile.projDamage;
        this.projectiles.splice(i, 1);
      }
    }
  }

  buildTargetArr(enemies: Enemy[]) {
    const validEnemies = enemies.filter((enemy) => {
      const xDiff = enemy.position.x - this.position.x;
      const yDiff = enemy.position.y - this.position.y;
      const distance = Math.hypot(xDiff, yDiff);

      return distance < enemy.radius + this.range;
    });

    return validEnemies;
  }

  calcIntersect(target: Enemy) {
    const startFrame = target.frame;

    for (let i = startFrame; i < target.path.length; i++) {
      let index: number;
      if (i * target.speed <= target.path.length - 1) {
        index = i * target.speed;
      } else {
        index = target.path.length - 1;
      }
      const xDiff = diff(target.path[index].x, this.position.x);
      const yDiff = diff(target.path[index].y, this.position.y);
      const distance = Math.hypot(xDiff, yDiff);

      if (
        Math.round(distance / 10) ===
        Math.round(((i - startFrame) * this.projVelocity) / 10)
      ) {
        return Math.atan2(
          target.path[index].y - this.position.y,
          target.path[index].x - this.position.x
        );
      }
    }
    console.log("calcIntersect didn't work");
  }

  fire(target: Enemy, intersectAngle: number | null) {
    this.projectiles.push(
      new Projectile(
        {
          x: this.position.x,
          y: this.position.y,
        },
        target,
        this.projVelocity,
        this.projDamage,
        intersectAngle
      )
    );
  }
}
