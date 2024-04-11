import { Cord } from "./cord";

export class Mouse extends Cord {
  click: boolean;
  lastPos = new Cord();
  dragSpeed: number;
  centerOffset = new Cord();

  constructor(x: number = 0, y: number = 0) {
    super(x, y);
    this.click = false;
    this.dragSpeed = 2.6;
  }
}
