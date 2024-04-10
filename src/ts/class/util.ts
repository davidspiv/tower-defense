export class Cord {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    (this.x = x), (this.y = y);
  }
}

export class Mouse extends Cord {
  click: boolean;

  constructor(x: number, y: number) {
    super(x, y);
    this.click = false;
  }
}
