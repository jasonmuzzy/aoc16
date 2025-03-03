import * as readline from "node:readline/promises";

import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    const screen = Array.from({ length: test ? 3 : 6 }, () => '.'.repeat(test ? 7 : 50).split(''));
    inputs.forEach(input => {
        const [a, b] = (input.match(/\d+/g) ?? ['0', '0']).map(Number);
        if (input.startsWith('rect')) {
            for (let y = 0; y < b; y++) {
                for (let x = 0; x < a; x++) {
                    screen[y][x] = '#';
                }
            }
        } else if (input.startsWith('rotate column')) {
            for (let i = 0; i < b; i++) {
                const temp = screen[screen.length - 1][a];
                for (let y = screen.length - 1; y >= 0; y--) {
                    screen[y][a] = y === 0 ? temp : screen[y - 1][a];
                }

            }
        } else {
            const len = screen[a].length - b;
            screen[a] = screen[a].slice(len).concat(screen[a].slice(0, len));
        }
    });
    if (part === 1) {
        return screen.flat().join('').replaceAll('.', '').length;
    } else {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        const code = screen.map(row => row.join('').replaceAll('.', ' ')).join('\n');
        const answer = await rl.question(`${code}\nType the letters displayed above: `);
        rl.close();
        return answer;
    }
}

run(__filename, solve);