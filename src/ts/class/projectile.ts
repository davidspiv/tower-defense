import { Cord } from "./cord.ts";
import { Enemy } from "./enemy.ts";
import { ctx } from "../index.ts";

export class Projectile {
  position: Cord;
  target: any;
  projVelocity: number;
  projDamage: number;
  radius: number;
  framePosDiff: Cord;
  collision: boolean;
  intersectAngle: number | null;

  constructor(
    position: Cord = { x: 0, y: 0 },
    target: Enemy,
    projVelocity: number,
    projDamage: number,
    intersectAngle: number | null
  ) {
    this.position = position;
    this.target = target;
    this.projVelocity = projVelocity;
    this.projDamage = projDamage;
    this.intersectAngle = intersectAngle;
    this.radius = 5;
    this.framePosDiff = {
      x: 0,
      y: 0,
    };
    this.collision = false;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  update() {
    const center = this.target?.center;
    const angle = Math.atan2(
      center.y - this.position.y,
      center.x - this.position.x
    );

    const xDiff = center.x - this.position.x;
    const yDiff = center.y - this.position.y;
    const distance = Math.hypot(xDiff, yDiff);

    if (distance < this.target.radius + this.radius) {
      this.collision = true;
    }

    if (this.intersectAngle === null) {
      this.framePosDiff.x = Math.cos(angle) * this.projVelocity;
      this.framePosDiff.y = Math.sin(angle) * this.projVelocity;
    } else {
      this.framePosDiff.x = Math.cos(this.intersectAngle) * this.projVelocity;
      this.framePosDiff.y = Math.sin(this.intersectAngle) * this.projVelocity;
    }
    this.position.x += this.framePosDiff.x;
    this.position.y += this.framePosDiff.y;

    this.draw();
  }
}
