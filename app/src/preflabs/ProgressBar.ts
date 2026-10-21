import { Container, Graphics, Sprite } from "pixi.js";

export default class ProgressMeter extends Container {
  private readonly bars: Sprite[] = [];

  constructor() {
    super();

    const barWidth = 160;
    const barHeight = 50;
    const gap = 10;

    for (let i = 0; i < 6; i++) {
      const bar = Sprite.from("bar");

      bar.width = barWidth;
      bar.height = barHeight;
      bar.position.set(0, i * (barHeight + gap));

      this.bars.push(bar);
      this.addChild(bar);
    }
  }

  setProgress(openedBars: number){
    console.log(openedBars);
    
    this.bars.forEach((bar,index) => {
        bar.visible = index >= openedBars;
    });
  }
}
