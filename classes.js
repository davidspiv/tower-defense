import { c, enemyWaypoints } from "./init.js";

export class Enemy {
  constructor(path) {
    this.radius = 30;
    this.position = { x: 0, y: enemyWaypoints[0].y - this.radius / 2 };
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.radius / 2,
      y: this.position.y + this.radius / 2,
    };
    this.speed = 1;
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
    this.position = this.path[this.frame];

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
    this.rpm = 500;
    this.projVelocity = 5;
    this.projDamage = 10;
    this.tracking = false;
    this.lastProjTimestamp;
  }

  projectileState(enemies, timeStamp) {
    let timeSinceLastShot = this.lastProjTimestamp;
    if (timeSinceLastShot === undefined) timeSinceLastShot = 0;
    const targets = this.buildTargetArr(enemies);
    if (targets.length > 0) {
      const target = targets[targets.length - 1];
      if (timeStamp - timeSinceLastShot > this.rpm) {
        let intersectAngle;
        if (this.tracking === false) {
          intersectAngle = this.calcIntersect(target);
          console.log(intersectAngle);
        }
        this.fire(target, intersectAngle);
        this.lastProjTimestamp = timeStamp;
      }
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(enemies, this);
      if (projectile.collision === true) {
        projectile.target.health -= projectile.projDamage;
        this.projectiles.splice(i, 1);
      }
    }
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

  calcIntersect(target) {
    for (let i = target.frame; i < target.path.length; i++) {
      const xDiff = Math.abs(target.path[i].x) - Math.abs(this.position.x);
      const yDiff = Math.abs(target.path[i].y) - Math.abs(this.position.y);
      const distance = Math.hypot(xDiff, yDiff);
      if (distance > this.range) break;
      if (Math.round(distance) === i) {
        return Math.atan2(
          target.path[i].y - this.position.y,
          target.path[i].x - this.position.x
        );
      }
    }
  }

  fire(target, intersectAngle) {
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

export class Projectile {
  constructor(
    position = { x: 0, y: 0 },
    target,
    projVelocity,
    projDamage,
    intersectAngle
  ) {
    this.position = position;
    this.target = target;
    this.projVelocity = projVelocity;
    this.projDamage = projDamage;
    this.radius = 5;
    this.nextWaypoint = {
      x: 0,
      y: 0,
    };
    this.collision = false;
    this.intersectAngle = intersectAngle;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = "black";
    c.fill();
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

    if (this.intersectAngle === undefined) {
      this.nextWaypoint.x = Math.cos(angle) * this.projVelocity;
      this.nextWaypoint.y = Math.sin(angle) * this.projVelocity;
    } else {
      this.nextWaypoint.x = Math.cos(this.intersectAngle) * this.projVelocity;
      this.nextWaypoint.y = Math.sin(this.intersectAngle) * this.projVelocity;
    }

    this.position.x += this.nextWaypoint.x;
    this.position.y += this.nextWaypoint.y;

    this.draw();
  }
}
