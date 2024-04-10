import { Cord } from "./util.ts";
import { c, enemyWaypoints } from "../init.js";

export class Enemy {
  radius: number;
  position: Cord;
  waypointIndex: number;
  center: Cord;
  speed: number;
  health: number;
  frame: number;
  path: Cord[];

  constructor(path: Cord[]) {
    this.radius = 30;
    this.position = { x: 0, y: enemyWaypoints[0].y - this.radius / 2 };
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.radius / 2,
      y: this.position.y + this.radius / 2,
    };
    this.speed = 2;
    this.health = 100;
    this.frame = 0;
    this.path = path;
  }

  draw() {
    //body
    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "white";
    c.fill();

    //health bar
    c.fillStyle = "red";
    c.fillRect(
      this.center.x - this.radius,
      this.center.y - this.radius - 15,
      this.radius * 2,
      10
    );

    c.fillStyle = "green";
    c.fillRect(
      this.center.x - this.radius,
      this.center.y - this.radius - 15,
      this.radius * 2 * (this.health / 100),
      10
    );
  }

  update() {
    if (this.frame * this.speed <= this.path.length - 1) {
      this.position = this.path[this.frame * this.speed];
    } else {
      this.position = this.path[this.path.length - 1];
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
        Math.round(
          enemyWaypoints[enemyWaypoints.length - 1].x - this.radius / 2
        ) &&
      Math.round(this.position.y) ===
        Math.round(
          enemyWaypoints[enemyWaypoints.length - 1].y - this.radius / 2
        )
    );
  }
}
