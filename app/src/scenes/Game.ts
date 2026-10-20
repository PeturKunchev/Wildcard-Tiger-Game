import { Container, Graphics, Sprite } from "pixi.js";
import Scene from "../core/Scene";
import Bar from "../preflabs/Bars";
import GameLogic from "./GameLogic";

export default class Game extends Scene {
  name = "Game";

  private background?: Sprite;
  private cage?: Sprite;
  private tiger?: Sprite;
  private isAnimating: boolean = false;
  private bars: Bar[] = [];
  private openedBars: Bar[] = [];
  private plate?: Sprite;
  private gameContainer = new Container();
  private containerOutline = new Graphics();
  private gameLogic = new GameLogic();
  private readonly layout = {
    designWidth: 1280,
    designHeight: 720,
    gameAreaWidthRatio: 0.55,
    cageWidth: 1200,
    outlineColor: 0xff0000,
    outlineThickness: 4,
    tigerHeightOffset: 80,
    tigerWidth: 800,
    plateHeight: 750,
    plateLeftOffset: -450,
    barCount: 3,
    barWidthRatio: 0.34,
    leftBarXRatio: 0.13,
    rightBarXRatio: 0.53,
    barRowYRatios: [0.35, 0.55, 0.75],
  };
  private async resetBars() {
    await Promise.all(this.openedBars.map((bar) => bar.close()));

    this.openedBars = [];

    this.bars.forEach((bar) => {
      bar.setClickable(true);
    });
  }
  private async handleBarClick(bar: Bar, number: number, direction: number) {
    if (this.isAnimating) {
      return;
    }
    bar.setClickable(false);
    const isCorrect = this.gameLogic.checkSelection(number);
    if (!isCorrect) {
      this.isAnimating = true;

      await Promise.all([
        bar.open(direction * bar.width * 0.25),
        this.resetBars(),
      ]);

      await bar.close();

      this.isAnimating = false;
      return;
    }
    this.isAnimating = true;
    await bar.open(direction * bar.width);
    this.openedBars.push(bar);
    this.isAnimating = false;
  }
  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Game");

    this.background = Sprite.from("background");
    this.cage = Sprite.from("cage");
    this.tiger = Sprite.from("tiger");
    this.plate = Sprite.from("plate");
    this.addChild(this.background);
    this.addChild(this.gameContainer);
    // Temporary outline to visualize the game container.
    this.containerOutline.lineStyle(
      this.layout.outlineThickness,
      this.layout.outlineColor
    );
    this.containerOutline.drawRect(
      0,
      0,
      this.layout.designWidth,
      this.layout.designHeight
    );
    this.gameContainer.addChild(this.containerOutline);
    this.gameContainer.addChild(this.cage);
    this.gameContainer.addChild(this.tiger);
    this.gameContainer.addChild(this.plate);

    const cageWidth = this.layout.cageWidth;
    const cageScale = cageWidth / this.cage.texture.width;

    this.cage.scale.set(cageScale);

    this.cage.position.set(
      (this.layout.designWidth - this.cage.width) / 2,
      (this.layout.designHeight - this.cage.height) / 2
    );

    const tigerWidth = this.layout.tigerWidth;
    const tigerScale = tigerWidth / this.tiger.texture.width;

    this.tiger.scale.set(tigerScale);

    this.tiger.position.set(
      (this.layout.designWidth - this.tiger.width) / 2,
      (this.layout.designHeight - this.tiger.height) / 2 +
        this.layout.tigerHeightOffset
    );

    const plateScale = this.layout.plateHeight / this.plate.texture.height;
    this.plate.scale.set(plateScale);

    this.plate.position.set(
      this.layout.plateLeftOffset,
      (this.layout.designHeight - this.plate.height) / 2
    );

    const cageLeft = this.cage.x;
    const cageTop = this.cage.y;
    const cageHeight = this.cage.height;

    const barWidth = cageWidth * this.layout.barWidthRatio;

    const leftX = cageLeft + cageWidth * this.layout.leftBarXRatio;
    const rightX = cageLeft + cageWidth * this.layout.rightBarXRatio;

    const rowYPositions = [
      cageTop + cageHeight * this.layout.barRowYRatios[0],
      cageTop + cageHeight * this.layout.barRowYRatios[1],
      cageTop + cageHeight * this.layout.barRowYRatios[2],
    ];

    for (let i = 0; i < this.layout.barCount; i++) {
      const leftBar = new Bar();
      leftBar.setSize(barWidth);
      leftBar.setNumber(i + 1);
      leftBar.position.set(leftX, rowYPositions[i]);
      leftBar.setOnClick(() => {
        void this.handleBarClick(leftBar, i + 1, -1);
      });
      leftBar.setOriginalPosition();
      this.bars.push(leftBar);
      this.gameContainer.addChild(leftBar);
    }

    for (let i = 0; i < this.layout.barCount; i++) {
      const rightBar = new Bar();
      rightBar.setSize(barWidth);
      rightBar.setNumber(i + 4, true);
      rightBar.setFlipped(true);
      rightBar.position.set(rightX, rowYPositions[i]);
      rightBar.setOnClick(() => {
        void this.handleBarClick(rightBar, i + 4, 1);
      });
      rightBar.setOriginalPosition();
      this.bars.push(rightBar);
      this.gameContainer.addChild(rightBar);
    }
  }

  start() {
    this.gameLogic.setOnReset(() => {
      void this.resetBars();
    });
    this.gameLogic.generateSequence();
    this.onResize(window.innerWidth, window.innerHeight);
  }

  onResize(width: number, height: number) {
    if (!this.background) return;

    // Background covers the viewport.
    const backgroundScale = Math.max(
      width / this.layout.designWidth,
      height / this.layout.designHeight
    );

    this.background.scale.set(backgroundScale);

    this.background.position.set(
      (width - this.background.width) / 2,
      (height - this.background.height) / 2
    );

    // Game container occupies 58% of the viewport width.
    const containerWidth = width * this.layout.gameAreaWidthRatio;
    const containerScale = containerWidth / this.layout.designWidth;

    this.gameContainer.scale.set(containerScale);

    this.gameContainer.position.set(
      (width - this.layout.designWidth * containerScale) / 2,
      (height - this.layout.designHeight * containerScale) / 2
    );
  }
}
