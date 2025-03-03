import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    const positions: Map<number, Map<string, number>> = new Map();
    inputs.forEach(input => {
        input.split('').forEach((char, i) => {
            const position = positions.get(i) ?? new Map();
            position.set(char, (position.get(char) ?? 0) + 1);
            positions.set(i, position);
        });
    });
    return [...positions.entries()].sort((a, b) => a[0] - b[0]).reduce((pv, [i, chars]) => {
        return pv + [...chars.entries()].sort((a, b) => part === 1 ? b[1] - a[1] : a[1] - b[1])[0][0];
    }, '');
}

run(__filename, solve);