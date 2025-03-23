import { createHash } from 'node:crypto';

import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Find the 64th number that has a triplet followed by the same characters repeated 5x in a row within the next 1000 hashes
    const salt = inputs[0];
    const keys: number[] = [];
    const hashes: string[] = [];
    let i = 0;
    while (keys.length < 64) {
        while (hashes.length < i + 1000) {
            let hash = createHash('md5').update(salt + hashes.length.toString()).digest('hex');
            if (part === 2) {
                for (let n = 0; n < 2016; n++) {
                    hash = createHash('md5').update(hash).digest('hex');
                }
            }
            hashes.push(hash);
        }
        const triplet = hashes[i].match(/(.)\1\1/);
        if (triplet) {
            for (let j = i + 1; j < i + 1000; j++) {
                const offset = hashes[j].indexOf(triplet[1].repeat(5));
                if (offset > -1) {
                    keys.push(i);
                    break;
                }
            }
        }
        i++;
    }
    return keys[63] ?? Infinity;
}

run(__filename, solve);