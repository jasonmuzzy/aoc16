import { run } from 'aoc-copilot';
import { DefaultMap } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    
    const instructions = inputs.map(input => input.split(' '));
    const registers: DefaultMap<string, number> = new DefaultMap([], 0);

    if (part === 2) {
        registers.set('c', 1);
    }

    let pointer = 0;
    while (pointer < instructions.length) {
        const [inst, lhs, rhs] = instructions[pointer];
        if (inst === 'inc') {
            registers.set(lhs, registers.get(lhs) + 1);
        } else if (inst === 'dec') {
            registers.set(lhs, registers.get(lhs) - 1);
        } else {
            const a = /\d+/.test(lhs) ? parseInt(lhs) : registers.get(lhs);
            if (inst === 'cpy') {
                registers.set(rhs, a);
            } else {
                const b = /\d+/.test(rhs) ? parseInt(rhs) : registers.get(rhs);
                if (a !== 0) pointer += b - 1;
            }
        }
        pointer++;
    }

    return registers.get('a');
}

run(__filename, solve);