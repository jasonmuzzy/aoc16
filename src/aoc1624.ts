import { run } from 'aoc-copilot';
import * as heap from 'aoc-copilot/dist/heap';
import { adjacents, DefaultMap } from 'aoc-copilot/dist/utils';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let y = inputs.findIndex(row => row.includes('0'));
    let x = inputs[y].split('').indexOf('0');
    const maze = inputs.map(row => row.split(''));
    const distances = new DefaultMap([], Infinity);
    const q: [number, number, number, string][] = [[0, x, y, part === 1 ? '0' : '']];
    const addPoi = (pois: string, x: number, y: number) => {
        if (maze[y][x] === '.') return pois;
        else if (part === 2 && maze[y][x] === '0') {
            if (pois === '1234567') return '01234567';
            else return pois;
        } else return (pois + maze[y][x]).split('').sort((a, b) => a < b ? -1 : 1).filter((v, i, a) => a.indexOf(v) === i).join('');
    }
    while (q.length > 0) {
        const [d, x, y, pois] = heap.pop(q)!;

        if (pois === (test ? '01234' : '01234567')) {
            return d;
        }

        if (distances.get(`${x},${y},${pois}`) <= d) {
            continue;
        }
        distances.set(`${x},${y},${pois}`, d);

        for (let [x1, y1] of adjacents(x, y, maze[0].length, maze.length)) {
            if (maze[y1][x1] === '#') { // Wall
                continue;
            }
            heap.push(q, [d + 1, x1, y1, addPoi(pois, x1, y1)]);
        }
    }
    
    throw new Error('No solution found');
}

run(__filename, solve);