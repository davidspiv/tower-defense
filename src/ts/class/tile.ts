import { Cord } from "./cord";
import { Mouse } from "./mouse";

export class Tile {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  position: Cord;
  center: Cord;
  type: String = "";

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    position: Cord
  ) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.position = position;
    this.center = new Cord(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );
  }

  isSelected(mouse: Mouse) {
    return (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.width &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.height
    );
  }

  update(mouse: Mouse) {
    if (this.type !== "path" && this.type !== "tower") {
      if (this.isSelected(mouse)) {
        this.type = "selected";
      } else {
        this.type = "";
      }
    }

    if (this.isSelected(mouse) && mouse.select) {
      if (this.type === "tower") {
        this.type = "selected";
      } else if (this.type === "selected") {
        this.type = "tower";
      }
    }
    this.draw();
  }

  draw() {
    if (this.type === "selected") this.ctx.fillStyle = "rgba(255,255,255,.5)";
    if (this.type === "tower") this.ctx.fillStyle = "brown";
    if (this.type === "path") this.ctx.fillStyle = "white";
    if (this.type === "") this.ctx.fillStyle = "rgba(255,255,255,0)";

    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
