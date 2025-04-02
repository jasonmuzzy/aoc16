import { run } from 'aoc-copilot';
import { DefaultMap } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    const instructions = inputs.map(input => input.split(' '));
    const registers: DefaultMap<string, number> = new DefaultMap([], 0);
    let int = 0, signal = '';

    const wanted = '01010101';
    for (; signal !== wanted; int++) {

        signal = '';
        registers.clear();
        registers.set('a', int);

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
                } else if (inst === 'jnz') {
                    const b = /\d+/.test(rhs) ? parseInt(rhs) : registers.get(rhs);
                    if (a !== 0) pointer += b - 1;
                } else if (inst === 'out') {
                    signal += registers.get(lhs);
                    if (signal === wanted) return int;
                    else if (signal.length > 0 && signal.length % 2 === 0 && !/^(01)+$/.test(signal)) {
                        break;
                    }
                }
            }
            pointer++;
        }
    }
    throw new Error('No solution found');
}

run(__filename, solve);