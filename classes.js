import { c, enemyWaypoints } from "./init.js";

export class Enemy {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.position = { x: 0, y: enemyWaypoints[0].y - this.width / 2 };
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.speedScalar = 1;
  }

  draw() {
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    const waypoint = enemyWaypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.position = {
      x: this.position.x + Math.cos(angle) * this.speedScalar,
      y: this.position.y + Math.sin(angle) * this.speedScalar,
    };

    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.width / 2,
    };

    this.draw();

    if (
      Math.round(this.center.x) === waypoint.x &&
      Math.round(this.center.y) === waypoint.y &&
      this.waypointIndex < enemyWaypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }

  reachedTower() {
    return (
      Math.round(this.position.x) ===
        Math.round(
          enemyWaypoints[enemyWaypoints.length - 1].x - this.width / 2
        ) &&
      Math.round(this.position.y) ===
        Math.round(
          enemyWaypoints[enemyWaypoints.length - 1].y - this.height / 2
        )
    );
  }
}

export class Tile {
  constructor(position, color = "rgba(0,0,0,0)", type = "empty") {
    this.size = 64;
    this.position = position;
    this.color = color;
    this.type = type;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }

  update(mouse) {
    if (
      this.type === "empty" &&
      mouse.x > this.position.x - this.size / 2 &&
      mouse.x < this.position.x + this.size / 2 &&
      mouse.y > this.position.y - this.size / 2 &&
      mouse.y < this.position.y + this.size / 2
    ) {
      this.color = "rgba(255,255,255,.2)";
    } else {
      this.color = "rgba(0,0,0,.2)";
    }
    this.draw();
  }
}
