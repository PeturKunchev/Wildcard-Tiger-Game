import { Container, Sprite } from "pixi.js";
import { barConfig } from "../config/barConfig";

export default class ProgressMeter extends Container {
  private readonly bars: Sprite[] = [];

  constructor() {
    super();

    for (let i = 0; i < barConfig.progressBarCount; i++) {
      const bar = Sprite.from("bar");

      bar.width = barConfig.progressBarWidth;
      bar.height = barConfig.progressBarHeight;
      bar.position.set(
        0,
        i * (barConfig.progressBarHeight + barConfig.progressBarGap)
      );

      this.bars.push(bar);
      this.addChild(bar);
    }
  }

  setProgress(openedBars: number): void {
    this.bars.forEach((bar, index) => {
      bar.visible = index >= openedBars;
    });
  }
}
