import { Cord } from "./cord";

export class Mouse extends Cord {
    click: boolean = false;
    select: boolean = false;
    drag: boolean = false;
    lastPos: Cord = new Cord();

    constructor(x: number = 0, y: number = 0) {
      super(x, y);
    }

    mouseUp() {
      if (!this.drag) {
        this.select = true;
      }
      this.click = false;
      this.drag = false;
      this.lastPos = new Cord();
    }
  }
