
import { Container, Sprite } from "pixi.js";

export default class Bar extends Container {
  private shadow: Sprite;
  private bar: Sprite;
  private readonly shadowOffset = 12;
  constructor() {
    super();

    this.shadow = Sprite.from("barShadow");
    this.bar = Sprite.from("bar");

    this.addChild(this.shadow, this.bar);
  }

  setSize(width: number) {
    const scale = width / this.bar.texture.width;

    this.bar.scale.set(scale);
    this.shadow.scale.set(scale);

    this.shadow.position.set(0, this.shadowOffset);
    this.bar.position.set(0, 0);
  }

   setFlipped(flipped: boolean) {
    const direction = flipped ? -1 : 1;

    this.bar.scale.x = Math.abs(this.bar.scale.x) * direction;
    this.shadow.scale.x = Math.abs(this.shadow.scale.x) * direction;

    const width = this.bar.texture.width * Math.abs(this.bar.scale.x);

    this.bar.x = flipped ? width : 0;
    this.shadow.x = flipped ? width : 0;
  }
}
