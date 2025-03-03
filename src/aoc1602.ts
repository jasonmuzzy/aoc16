import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let answer = '';
    const keypad = part === 1 
        ? ['123', '456', '789']
        : ['  1  ', ' 234 ', '56789', ' ABC ', '  D  '];
    let y = keypad.findIndex(e => e.includes('5')), x = keypad[y].indexOf('5');
    inputs.forEach(input => {
        for (let c of input) {
            if (c === 'L' && x > 0 && keypad[y][x - 1] !== ' ') x--;
            if (c === 'R' && x < keypad[y].length - 1 && keypad[y][x + 1] !== ' ') x++;
            if (c === 'U' && y > 0 && keypad[y - 1][x] !== ' ') y--;
            if (c === 'D' && y < keypad.length - 1 && keypad[y + 1][x] !== ' ') y++;
        }
        answer += keypad[y][x];
    });
    return answer;
}

run(__filename, solve);