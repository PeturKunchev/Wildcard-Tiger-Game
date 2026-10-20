import gsap from "gsap";
import { Container, Sprite, Text } from "pixi.js";

export default class Bar extends Container {
  private shadow: Sprite;
  private bar: Sprite;
  private label: Text;
  private originalX = 0;
  private readonly shadowOffset = 12;
  constructor() {
    super();

    this.shadow = Sprite.from("barShadow");
    this.bar = Sprite.from("bar");
    this.label = new Text("", {
      fontFamily: "Arial",
      fontSize: 35,
      fill: "red",
      fontWeight: "bold",
    });

    this.label.anchor.set(0.5);
    this.addChild(this.shadow, this.bar);
    this.addChild(this.label);
  }
  setOriginalPosition() {
    this.originalX = this.x;
  }

  setClickable(clickable: boolean) {
    this.eventMode = clickable ? "static" : "none";
    this.cursor = clickable ? "pointer" : "default";
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

  setNumber(number: number, flipped = false) {
    this.label.text = String(number);

    const endPadding = this.bar.width * 0.07;

    this.label.position.set(
      flipped ? this.bar.width - endPadding : endPadding,
      this.bar.height / 2
    );
  }

  setOnClick(callback: () => void) {
    this.setClickable(true)
    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointertap", callback);
  }
  open(distance: number): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this, {
        x: this.x + distance,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }
  close(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this, {
        x: this.originalX,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: resolve,
      });
    });
  }
}
