import { run } from 'aoc-copilot';
import * as heap from 'aoc-copilot/dist/heap';
import { adjacents, DefaultMap } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    const designer = parseInt(inputs[0]);
    let answer = 0;
    const queue: [number, number, number][] = [[0, 1, 1]];
    const distances: DefaultMap<string, number> = new DefaultMap([], Infinity);
    while (queue.length > 0) {
        const [d, x, y] = heap.pop(queue)!;
        const xy = `${x},${y}`;
        if (distances.get(xy) <= d) continue;
        if (part === 1 && x === (test ? 7 : 31) && y === (test ? 4 : 39)) {
            answer = d;
            break;
        } else if (part === 2 && d > 50) {
            answer = distances.size;
            break;
        }
        distances.set(xy, d);
        for (let [x1, y1] of adjacents(x, y)) {
            const tile = (x1 * x1 + 3 * x1 + 2 * x1 * y1 + y1 + y1 * y1 + designer).toString(2).split('').filter(bit => bit === '1').length % 2 === 0 ? ' ' : '#';
            if (tile === '#') continue;
            else heap.push(queue, [d + 1, x1, y1]);
        }
    }
    return answer;
}

run(__filename, solve);