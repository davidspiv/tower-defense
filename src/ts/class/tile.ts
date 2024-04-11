import { Cord } from "./cord.js";
import { ctx } from "../init.js";
import { mouse } from "../init.js";

export class Tile {
  size: number;
  position: Cord;
  color: string;
  type: string;

  constructor(
    position: Cord,
    color: string = "rgba(0,0,0,0)",
    type: string = "empty"
  ) {
    this.size = 64;
    this.position = position;
    this.color = color;
    this.type = type;
  }

  draw() {
    if (this.type === "empty") this.color = "rgba(0,0,0,0)";
    if (this.type === "path") this.color = "rgba(0,0,0,0)";
    if (this.type === "selected") this.color = "rgba(255,255,255,.2)";
    if (this.type === "tower") this.color = "brown";

    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );

    // ctx.beginPath();
    // ctx.arc(this.position.x, this.position.y, this.range, 0, Math.PI * 2);
    // ctx.fillStyle = "rgba(0, 0, 255, .1)";
    // ctx.fill();
  }

  isSelected() {
    return (
      mouse.x > this.position.x - this.size / 2 &&
      mouse.x < this.position.x + this.size / 2 &&
      mouse.y > this.position.y - this.size / 2 &&
      mouse.y < this.position.y + this.size / 2
    );
  }

  update() {
    const updateType = () => {
      if (this.isSelected()) {
        this.type = "selected";
      } else {
        this.type = "empty";
      }
    };

    this.position.x += mouse.centerOffset.x * mouse.dragSpeed;
    this.position.y += mouse.centerOffset.y * mouse.dragSpeed;
    if (this.type !== "path" && this.type !== "tower") {
      updateType();
    }
    this.draw();
  }
}
