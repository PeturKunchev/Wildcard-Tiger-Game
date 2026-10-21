import { Container, Sprite } from "pixi.js";
import Scene from "../core/Scene";
import Bar from "../preflabs/Bars";
import GameLogic from "./GameLogic";
import WinAnimation from "../preflabs/WinAnimation";
import ProgressMeter from "../preflabs/ProgressBar";
import { layout } from "../config/layoutConfig";
export default class Game extends Scene {
  name = "Game";
  private background?: Sprite;
  private cage?: Sprite;
  private tiger?: Sprite;
  private winText?: Sprite;
  private isAnimating: boolean = false;
  private bars: Bar[] = [];
  private openedBars: Bar[] = [];
  private plate?: Sprite;
  private winAnimation?: WinAnimation;
  private progressMeter?: ProgressMeter;
  private gameContainer = new Container();
  private gameLogic = new GameLogic();


  private async resetBars() {
    this.progressMeter?.setProgress(0);
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
        bar.open(direction * bar.width * layout.wrongBarPercentageOpen),
        this.resetBars(),
      ]);

      await bar.close();

      this.isAnimating = false;
      return;
    }
    this.isAnimating = true;
    await bar.open(direction * bar.width);
    this.openedBars.push(bar);
    this.progressMeter?.setProgress(this.openedBars.length);
    this.isAnimating = false;
  }
  async load() {
    await this.utils.assetLoader.loadAssetsGroup("Game");

    this.background = Sprite.from("background");
    this.cage = Sprite.from("cage");
    this.tiger = Sprite.from("tiger");
    this.plate = Sprite.from("plate");
    this.winText = Sprite.from("txt");
    this.addChild(this.background);
    this.addChild(this.gameContainer);

    this.gameContainer.addChild(this.cage);
    this.gameContainer.addChild(this.tiger);
    this.gameContainer.addChild(this.plate);
    this.gameContainer.addChild(this.winText);
    this.progressMeter = new ProgressMeter();
    this.gameContainer.addChild(this.progressMeter);
    const cageWidth = layout.cageWidth;
    const cageScale = cageWidth / this.cage.texture.width;

    this.cage.scale.set(cageScale);

    this.cage.position.set(
      (layout.designWidth - this.cage.width) / 2,
      (layout.designHeight - this.cage.height) / 2
    );

    const tigerWidth = layout.tigerWidth;
    const tigerScale = tigerWidth / this.tiger.texture.width;

    this.tiger.scale.set(tigerScale);

    this.tiger.position.set(
      (layout.designWidth - this.tiger.width) / 2,
      (layout.designHeight - this.tiger.height) / 2 +
        layout.tigerHeightOffset
    );

    const winTextWidth = layout.winTextWidth;
    const winTextScale = winTextWidth / this.winText.texture.width;

    this.winText.scale.set(winTextScale);

    this.winText.position.set(
      (layout.designWidth - this.winText.width) / 2,
      (layout.designHeight - this.winText.height) / 2 +
        layout.winTextHeightOffset
    );

    this.winAnimation = new WinAnimation(this.tiger, this.winText);

    const plateScale = layout.plateHeight / this.plate.texture.height;
    this.plate.scale.set(plateScale);

    this.plate.position.set(
      layout.plateLeftOffset,
      (layout.designHeight - this.plate.height) / 2
    );

    this.progressMeter.position.set(
      this.plate.x + this.plate.width * layout.progressMeterHorizontal,
      this.plate.y + this.plate.height * layout.progressMeterVertical
    );

    const cageLeft = this.cage.x;
    const cageTop = this.cage.y;
    const cageHeight = this.cage.height;

    const barWidth = cageWidth * layout.barWidthRatio;

    const leftX = cageLeft + cageWidth * layout.leftBarXRatio;
    const rightX = cageLeft + cageWidth * layout.rightBarXRatio;

    const rowYPositions = [
      cageTop + cageHeight * layout.barRowYRatios[0],
      cageTop + cageHeight * layout.barRowYRatios[1],
      cageTop + cageHeight * layout.barRowYRatios[2],
    ];

    for (let i = 0; i < layout.barCount; i++) {
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

    for (let i = 0; i < layout.barCount; i++) {
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
      void Promise.all([this.resetBars(), this.winAnimation?.reset()]);
    });
    this.gameLogic.setOnWin(() => {
      void this.winAnimation?.play();
    });
    this.gameLogic.generateSequence();
    this.onResize(window.innerWidth, window.innerHeight);
  }

  onResize(width: number, height: number) {
    if (!this.background) return;

    const backgroundScale = Math.max(
      width / layout.designWidth,
      height / layout.designHeight
    );

    this.background.scale.set(backgroundScale);

    this.background.position.set(
      (width - this.background.width) / 2,
      (height - this.background.height) / 2
    );

    const containerWidth = width * layout.gameAreaWidthRatio;
    const containerScale = containerWidth / layout.designWidth;

    this.gameContainer.scale.set(containerScale);

    this.gameContainer.position.set(
      (width - layout.designWidth * containerScale) / 2,
      (height - layout.designHeight * containerScale) / 2
    );
  }
}
