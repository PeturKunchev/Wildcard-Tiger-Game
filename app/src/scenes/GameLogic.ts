export default class GameLogic {
    
  private sequence: number[] = [];
  private currentIndex: number = 0;

  generateSequence(): number[] {
    const numbers = [1, 2, 3, 4, 5, 6];
    this.currentIndex = 0;
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

  checkSelection(number: number): boolean {
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
    }

    return true;
  }
}
