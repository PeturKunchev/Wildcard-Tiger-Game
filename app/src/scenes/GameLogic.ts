import gsap from "gsap";

export default class GameLogic {
  private readonly winResetDelay = 5;
  private sequence: number[] = [];
  private currentIndex: number = 0;
  private onWin?: () => void;
  private isWon = false;
  private onReset?: () => void;

  setOnReset(callback: () => void): void {
    this.onReset = callback;
  }
  generateSequence(): number[] {
    const numbers = [1, 2, 3, 4, 5, 6];
    this.currentIndex = 0;
    this.isWon = false;
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    this.sequence = numbers;

    console.log("Unlock sequence:", this.sequence);

    return this.sequence;
  }

  resetGame(): void {
    this.currentIndex = 0;
    this.generateSequence();
    console.log("Game reset. Start again!");
  }
  setOnWin(callback: () => void): void {
    this.onWin = callback;
  }
  checkSelection(number: number): boolean {
    if (this.isWon) {
      return false;
    }
    const expectedNumber = this.sequence[this.currentIndex];

    if (number !== expectedNumber) {
      console.log("Incorrect!");
      this.resetGame();
      return false;
    }

    console.log("Correct!");
    this.currentIndex++;
    if (this.currentIndex === this.sequence.length) {
      console.log("All bars opened!");
      this.isWon = true;
      this.onWin?.();
      gsap.delayedCall(this.winResetDelay, () => {
        this.resetGame();
        this.onReset?.();
      });
    }

    return true;
  }
}
