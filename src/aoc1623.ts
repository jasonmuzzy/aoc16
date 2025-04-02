import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    let a = part === 1 ? 7 : 12;

    // a * (a - 1) * (a - 2) * (a - 3) ...
    for (let b = a - 1; b > 0; b--) {
        a *= b;
    }

    const c = parseInt(inputs[19].split(' ')[1]); // 19 cpy 73 c
    const d = parseInt(inputs[20].split(' ')[1]); // 20 jnz 79 d gets toggled to cpy 79 d

    return a + c * d;

}

run(__filename, solve);