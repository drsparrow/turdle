export type Color = 'green'|'yellow'|'gray';

const COLOR_MAP: {[number: number]: Color} = {
    [1]: 'gray',
    [2]: 'yellow',
    [3]: 'green',
}
export class ColorHelper {
    constructor(private word: string) {}

    color(letter: string, letterIdx: number): Color {
       return COLOR_MAP[this.colorValue(letter, letterIdx)];
    }

    masterColors(guesses: string[]): { [letter: string]: Color } {
        const nums: {[letter: string]: number} = {};
        const res: { [letter: string]: Color } = {};
        guesses.forEach(guess => {
            guess.split('').forEach((letter, letterIndex) => {
                const curColor = nums[letter] || 0;
                const color = this.colorValue(letter, letterIndex);
                nums[letter] = Math.max(color, curColor);
                res[letter] = COLOR_MAP[nums[letter]];
            });
        });

        return res;
    }

    private colorValue(letter: string, letterIdx: number): number {
        if (this.word.charAt(letterIdx) == letter) {
            return 3;
        } else if (this.word.includes(letter)) {
            return 2;
        } else {
            return 1;
        }
    }
}