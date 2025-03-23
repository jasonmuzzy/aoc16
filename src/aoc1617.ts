import { createHash } from 'node:crypto';

import { run } from 'aoc-copilot';
import * as heap from 'aoc-copilot/dist/heap';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Navigate a 4x4 grid of rooms, where the doors between rooms are unlocked based on the hash of a salt plus the history of moves taken to get there.
    const salt = inputs[0];
    const queue: [number, number, number, string][] = [[0, 0, 0, '']];
    const visiteds: Set<string> = new Set();
    let max = 0;
    while (queue.length > 0) {

        const [d, x, y, steps] = heap.pop(queue)!;

        if (x === 3 && y === 3) {
            if (part === 1) {
                return steps;
            } else {
                max = Math.max(max, steps.length);
                continue;
            }
        }

        const xy = `${x},${y},${steps}`;
        if (visiteds.has(xy)) {
            continue;
        } else {
            visiteds.add(xy);
        }

        const hash = createHash('md5').update(salt + steps).digest('hex');

        for (let [dir, x1, y1] of [
            ['U', x, y > 0 && 'bcdef'.includes(hash[0]) ? y - 1 : y],
            ['D', x, y < 3 && 'bcdef'.includes(hash[1]) ? y + 1 : y],
            ['L', x > 0 && 'bcdef'.includes(hash[2]) ? x - 1 : x, y],
            ['R', x < 3 && 'bcdef'.includes(hash[3]) ? x + 1 : x, y]
        ] as [string, number, number][]) {
            if (x1 !== x || y1 !== y) {
                heap.push(queue, [d + 1, x1, y1, steps + dir]);
            }
        }
    }

    return max;
}

run(__filename, solve);