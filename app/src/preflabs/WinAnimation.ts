import gsap from "gsap";
import { Sprite } from "pixi.js";

export default class WinAnimation {
  private tiger: Sprite;
  private readonly scaleMultiplier = 2;
  private readonly movementY = 500;
  private readonly duration = 0.7;
  private readonly movementX = 300;
  private winText: Sprite;
  private originalTextScale: number;
  private originalChildIndex: number;
  private originalX: number;
  private originalY: number;
  private originalScaleX: number;
  private originalScaleY: number;

  constructor(tiger: Sprite, winText: Sprite) {
    this.tiger = tiger;
    this.winText = winText;
    this.originalX = tiger.x;
    this.originalY = tiger.y;
    this.originalScaleX = tiger.scale.x;
    this.originalScaleY = tiger.scale.y;

    this.originalChildIndex = tiger.parent
      ? tiger.parent.getChildIndex(tiger)
      : 0;
    this.originalTextScale = winText.scale.x;
    this.winText.visible = false;
  }

  play(): Promise<void> {
    this.winText.visible = true;
    this.winText.alpha = 0;
    this.winText.scale.set(this.originalTextScale * 0.7);
    gsap.to(this.winText, {
      alpha: 1,
      duration: 0.3,
    });

    gsap.to(this.winText.scale, {
      x: this.originalTextScale,
      y: this.originalTextScale,
      duration: 0.5,
      ease: "back.out(1.7)",
    });

    return new Promise((resolve) => {
      gsap.to(this.tiger, {
        x: this.originalX - this.movementX,
        y: this.originalY - this.movementY,
        duration: this.duration,
        ease: "power2.out",
      });
      this.tiger.parent?.setChildIndex(
        this.tiger,
        this.tiger.parent.children.length - 1
      );
      this.winText.parent?.setChildIndex(
      this.winText,
      this.winText.parent.children.length - 1
    );
      gsap.to(this.tiger.scale, {
        x: this.originalScaleX * this.scaleMultiplier,
        y: this.originalScaleY * this.scaleMultiplier,
        duration: this.duration,
        ease: "power2.out",
        onComplete: resolve,
      });
    });
  }

  reset(): Promise<void> {
    gsap.killTweensOf(this.tiger);
    gsap.killTweensOf(this.tiger.scale);

    return new Promise((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.tiger.parent?.setChildIndex(this.tiger, this.originalChildIndex);
          this.winText.visible = false;
          resolve();
        },
      });

      timeline.to(this.tiger, {
        x: this.originalX,
        y: this.originalY,
        duration: this.duration,
        ease: "power2.inOut",
      });
      timeline.to(
        this.tiger.scale,
        {
          x: this.originalScaleX,
          y: this.originalScaleY,
          duration: this.duration,
          ease: "power2.inOut",
        },
        0
      );
    });
  }
}
