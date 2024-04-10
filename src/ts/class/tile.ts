import { Cord, Mouse } from "./util.js";
import { c } from "../init.js";

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

  isSelected(mouse: Mouse) {
    return (
      mouse.x > this.position.x - this.size / 2 &&
      mouse.x < this.position.x + this.size / 2 &&
      mouse.y > this.position.y - this.size / 2 &&
      mouse.y < this.position.y + this.size / 2
    );
  }

  update(mouse: Mouse) {
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
