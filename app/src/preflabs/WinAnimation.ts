
import gsap from "gsap";
import { Sprite } from "pixi.js";
import { animationConfig } from "../config/animationConfig";

export default class WinAnimation {
  private tiger: Sprite;
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
    this.winText.scale.set(
      this.originalTextScale *
        animationConfig.winTextInitialScaleMultiplier
    );

    gsap.to(this.winText, {
      alpha: 1,
      duration: animationConfig.winTextFadeDuration,
    });

    gsap.to(this.winText.scale, {
      x: this.originalTextScale,
      y: this.originalTextScale,
      duration: animationConfig.winTextScaleDuration,
      ease: animationConfig.winTextEase,
    });

    return new Promise((resolve) => {
      gsap.to(this.tiger, {
        x: this.originalX - animationConfig.tigerMovementX,
        y: this.originalY - animationConfig.tigerMovementY,
        duration: animationConfig.tigerDuration,
        ease: animationConfig.tigerEase,
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
        x: this.originalScaleX * animationConfig.tigerScaleMultiplier,
        y: this.originalScaleY * animationConfig.tigerScaleMultiplier,
        duration: animationConfig.tigerDuration,
        ease: animationConfig.tigerEase,
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
          this.tiger.parent?.setChildIndex(
            this.tiger,
            this.originalChildIndex
          );

          this.winText.visible = false;
          resolve();
        },
      });

      timeline.to(this.tiger, {
        x: this.originalX,
        y: this.originalY,
        duration: animationConfig.resetDuration,
        ease: animationConfig.resetEase,
      });

      timeline.to(
        this.tiger.scale,
        {
          x: this.originalScaleX,
          y: this.originalScaleY,
          duration: animationConfig.resetDuration,
          ease: animationConfig.resetEase,
        },
        0
      );
    });
  }
}
