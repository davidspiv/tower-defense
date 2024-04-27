import { Cord } from "./cord.ts";
import { ctx, enemyWaypoints, enemyPath } from "../index.ts";
import { canvas } from "../index.ts";

export class Enemy {
  radius: number;
  position: Cord;
  waypointIndex: number;
  center: Cord;
  speed: number;
  health: number;
  frame: number;

  constructor() {
    this.radius = canvas.width / 50;
    this.position = { x: 0, y: enemyWaypoints[0].y - this.radius / 2 };
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.radius / 2,
      y: this.position.y + this.radius / 2,
    };
    this.speed = 2;
    this.health = 100;
    this.frame = 0;
  }

  draw() {
    //body
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    //health bar
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.center.x - this.radius,
      this.center.y - this.radius - 15,
      this.radius * 2,
      10
    );

    ctx.fillStyle = "green";
    ctx.fillRect(
      this.center.x - this.radius,
      this.center.y - this.radius - 15,
      this.radius * 2 * (this.health / 100),
      10
    );
  }

  update() {
    this.radius = canvas.width / 50;
    if (this.frame * this.speed <= enemyPath.length - 1) {
      this.position = enemyPath[this.frame * this.speed];
    } else {
      this.position = enemyPath[enemyPath.length - 1];
    }

    this.center = {
      x: this.position.x + this.radius / 2,
      y: this.position.y + this.radius / 2,
    };

    this.draw();
    this.frame += 1;
  }

  reachedBase() {
    return (
      Math.round(this.position.x) ===
        Math.round(enemyPath[enemyPath.length - 1].x) &&
      Math.round(this.position.y) ===
        Math.round(enemyPath[enemyPath.length - 1].y)
    );
  }
}
