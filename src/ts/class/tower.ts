import { absDiff } from "../utils.js";
import { Cord } from "./cord.js";
import { Projectile } from "./projectile.js";
import { Enemy } from "./enemy.js";
import { Tile } from "./tile.js";
import { enemyPath } from "../index.js";

export class Tower extends Tile {
  type: String = "tower";
  projectiles: Projectile[];
  range: number;
  rpm: number;
  projVelocity: number;
  projDamage: number;
  tracking: boolean;
  lastProjTimestamp: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    position: Cord
  ) {
    super(ctx, width, height, position);
    this.projectiles = [];
    this.range = 250;
    this.rpm = 50;
    this.projVelocity = 2;
    this.projDamage = 10;
    this.tracking = false;
    this.lastProjTimestamp = 0;
  }

  projectileState(enemies: Enemy[]) {
    const targets = this.buildTargetArr(enemies);

    if (targets.length > 0) {
      const target = targets[targets.length - 1];
      if (this.lastProjTimestamp > this.rpm) {
        let intersectAngle: number | null;
        if (this.tracking === false) {
          intersectAngle = this.calcIntersect(target)!;
        } else {
          intersectAngle = null;
        }

        this.fire(target, intersectAngle);
        this.lastProjTimestamp = 0;
      } else {
        this.lastProjTimestamp += 1;
      }
    }

    for (let i = 0; i < this.projectiles.length; i++) {
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
      const xabsDiff = enemy.position.x - this.position.x;
      const yabsDiff = enemy.position.y - this.position.y;
      const distance = Math.hypot(xabsDiff, yabsDiff);

      return distance < enemy.radius + this.range;
    });

    return validEnemies;
  }

  calcIntersect(target: Enemy) {
    const startFrame = target.frame;

    for (let i = startFrame; i < enemyPath.length; i++) {
      let index: number;
      if (i * target.speed <= enemyPath.length - 1) {
        index = i * target.speed;
      } else {
        index = enemyPath.length - 1;
      }
      const xabsDiff = absDiff(enemyPath[index].x, this.position.x);
      const yabsDiff = absDiff(enemyPath[index].y, this.position.y);
      const distance = Math.hypot(xabsDiff, yabsDiff);

      if (
        Math.round(distance / 10) ===
        Math.round(((i - startFrame) * this.projVelocity) / 10)
      ) {
        return Math.atan2(
          enemyPath[index].y - this.position.y,
          enemyPath[index].x - this.position.x
        );
      }
    }
    console.log("calcIntersect didn't work");
  }

  fire(target: Enemy, intersectAngle: number | null) {
    this.projectiles.push(
      new Projectile(
        {
          x: this.center.x,
          y: this.center.y,
        },
        target,
        this.projVelocity,
        this.projDamage,
        intersectAngle
      )
    );
  }
}
