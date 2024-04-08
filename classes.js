import { c, enemyWaypoints } from "./init.js";

export class Enemy {
  constructor() {
    this.radius = 30;
    this.position = { x: 0, y: enemyWaypoints[0].y - this.radius / 2 };
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.radius / 2,
      y: this.position.y + this.radius / 2,
    };
    this.speed = 1;
    this.health = 100;
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
    const waypoint = enemyWaypoints[this.waypointIndex];
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;
    const angle = Math.atan2(yDistance, xDistance);

    this.position = {
      x: this.position.x + Math.cos(angle) * this.speed,
      y: this.position.y + Math.sin(angle) * this.speed,
    };

    this.center = {
      x: this.position.x + this.radius / 2,
      y: this.position.y + this.radius / 2,
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
          enemyWaypoints[enemyWaypoints.length - 1].x - this.radius / 2
        ) &&
      Math.round(this.position.y) ===
        Math.round(
          enemyWaypoints[enemyWaypoints.length - 1].y - this.radius / 2
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
    this.range = 0;
  }

  draw() {
    if (this.type === "empty") this.color = "rgba(0,0,0,0)";
    if (this.type === "path") this.color = "rgba(0,0,0,0)";
    if (this.type === "selected") this.color = "rgba(255,255,255,.2)";
    if (this.type === "tower") this.color = "brown";

    c.fillStyle = this.color;
    c.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );

    // c.beginPath();
    // c.arc(this.position.x, this.position.y, this.range, 0, Math.PI * 2);
    // c.fillStyle = "rgba(0, 0, 255, .1)";
    // c.fill();
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
        this.type = "selected";
      } else {
        this.type = "empty";
      }
    };

    if (this.type !== "path" && this.type !== "tower") {
      updateType();
    }

    this.draw();
  }
}

export class Tower extends Tile {
  constructor(position, type, color = "brown") {
    super(position, color, type);
    this.projectiles = [];
    this.range = 250;
    this.rpm = 200;
    this.roundVel = 2.2;
  }

  buildTargetArr(enemies) {
    const validEnemies = enemies.filter((enemy) => {
      const xDiff = enemy.position.x - this.position.x;
      const yDiff = enemy.position.y - this.position.y;
      const distance = Math.hypot(xDiff, yDiff);
      return distance < enemy.radius + this.range;
    });

    return validEnemies;
  }

  fire(enemies) {
    const targets = this.buildTargetArr(enemies);
    if (targets.length > 0) {
      this.projectiles.push(
        new Projectile(
          {
            x: this.position.x,
            y: this.position.y,
          },
          targets[targets.length - 1],
          this.roundVel
        )
      );
    }
  }

  state(enemies, timeStamp) {
    const projectiles = this.projectiles;
    const lastProjectile = projectiles[projectiles.length - 1];
    let dist;
    if (projectiles.length > 0) {
      const a = lastProjectile.position.x - this.position.x;
      const b = lastProjectile.position.y - this.position.y;
      dist = Math.hypot(a, b);
    }

    if (timeStamp % 10 > this.rpm || dist === undefined) {
      this.fire(enemies);
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].update(enemies, this);
      if (this.projectiles[i].collision === true) {
        this.projectiles[i].target.health -= 20;
        this.projectiles.splice(i, 1);
      }
    }
  }
}

export class Projectile {
  constructor(position = { x: 0, y: 0 }, target, velocity) {
    this.position = position;
    this.target = target;
    this.velocity = velocity;
    this.radius = 5;
    this.nextPosition = {
      x: 0,
      y: 0,
    };
    this.collision = false;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "black";
    c.fill();
  }

  update() {
    const center = this.target?.center;

    if (center) {
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

      this.nextPosition.x = Math.cos(angle) * this.velocity;
      this.nextPosition.y = Math.sin(angle) * this.velocity;

      this.position.x += this.nextPosition.x;
      this.position.y += this.nextPosition.y;
    }

    this.draw();
  }
}
