import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Find the time at which to drop a ball through layers of spinning discs that have openings at different positions
    const discs = inputs.map(input => (input.match(/\d+/g) ?? []).map(Number));

    if (part === 2) {
        discs.push([discs.length + 1, 11, 0, 0]);
    }

    for (let t = 0; true; t++) {
        if (discs.every(([id, positions, , position]) => (position + id + t) % positions === 0)) {
            return t;
        }
    }
    
    throw new Error('No solution found');
}

run(__filename, solve);