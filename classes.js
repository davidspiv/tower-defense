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
    this.projectiles = [];
  }

  draw() {
    if (this.type === "empty") this.color = "rgba(0,0,0,0)";
    if (this.type === "path") this.color = "rgba(0,0,0,0)";
    if (this.type === "selected") this.color = "rgba(255,255,255,.2)";
    if (this.type === "building") this.color = "brown";

    c.fillStyle = this.color;
    c.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }

  isSelected(mouse) {
    return (
      mouse.x > this.position.x - this.size / 2 &&
      mouse.x < this.position.x + this.size / 2 &&
      mouse.y > this.position.y - this.size / 2 &&
      mouse.y < this.position.y + this.size / 2
    );
  }

  update(mouse) {
    const updateType = () => {
      if (this.isSelected(mouse)) {
        if (mouse.click === "true") {
          if (this.type === "building") {
            this.type = "selected";
          } else {
            this.type = "building";
            this.projectiles = [
              new Projectile({
                x: this.position.x,
                y: this.position.y,
              }),
            ];
          }
        } else if (this.type !== "building") {
          this.type = "selected";
        }
      } else if (this.type !== "building") {
        this.type = "empty";
      }
    };

    if (this.type !== "path") {
      updateType();
    }

    this.draw();
  }
}

export class Projectile {
  constructor(position = { x: 0, y: 0 }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "black";
    c.fill();
  }

  update(enemies) {
    if (enemies[0]?.center) {
      const angle = Math.atan2(
        enemies[0].center.y - this.position.y,
        enemies[0].center.x - this.position.x
      );

      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }

    this.draw();
  }
}
