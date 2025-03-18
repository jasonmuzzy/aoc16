import { run } from 'aoc-copilot';
import * as heap from 'aoc-copilot/dist/heap';
import { DefaultMap } from 'aoc-copilot/dist/utils';

// A-star FTW!!!

// At first I tried DFS which worked for the example, but exceeded the max call depth for the actual
// input.  Plain BFS took 8 minutes for part 2. The heuristic() is the key to maximizing performance.

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    interface Item { variety: string, type: 'generator' | 'microchip', floor: number };

    function heuristic(items: Item[], floor: number, target: number, count: number) {
        
        const f3 = items.filter(i => i.floor === 3).length;
        const f2 = items.filter(i => i.floor === 2).length;
        const f1 = items.filter(i => i.floor === 1).length;

        // Weight item on higher floors more than lower floors
        let score = Math.max(0, f3 - 2) * 6 + (f1 > 0 ? 3 : 0)
            + Math.max(0, f2 - 2) * 4 + (f2 > 0 ? 2 : 0)
            + Math.max(0, f1 - 2) * 2 + (f1 > 0 ? 1 : 0)
            + floor;

        // Prioritize moving 2 items up/1 item down rather than 1 item up/2 items down
        if ((target - floor > 0 && count === 2) ||
            (target - floor < 0 && count === 1)) {
            score *= 2;
        }

        return score;

    }

    function getState(items: Item[], floor: number) {
        return `elevator:${floor}\n`
            + items
                .toSorted((a, b) => a.floor !== b.floor ? a.floor - b.floor : a.type < b.type ? -1 : a.type > b.type ? 1 : a.variety < b.variety ? -1 : 1)
                .map(item => `${item.floor},${item.type},${item.variety}`)
                .join('\n');
    }

    function getCombos(items: Item[], floor: number) {
        const floorItems = items.filter(item => item.floor === floor);
        const combos: Item[][] = [];
        for (let [i, item] of floorItems.entries()) {
            for (let j = i; j < floorItems.length; j++) {
                combos.push([item].concat(j === i ? [] : [floorItems[j]]));
            }
        }
        return combos;
    }

    function isValid(items: Item[], floor: number) {
        const floorItems = items.filter(item => item.floor === floor);
        return !floorItems.some(item => item.type === 'generator') || // There are no generators, or
            floorItems.filter(item => item.type === 'microchip').every(microchip => floorItems.some(item => item.type === 'generator' && item.variety === microchip.variety)); // every microchip is paired with its generator
    }

    const items: Item[] = [];
    inputs.forEach((input, i) => {
        const words = input.replaceAll(/(,|\.)/g, '').split(' ');
        for (let [j, word] of words.entries()) {
            if (word === 'generator') items.push({ variety: words[j - 1], type: word, floor: i });
            else if (word === 'microchip') items.push({ variety: words[j - 1].split('-')[0], type: word, floor: i });
        }
    });

    if (part === 2) {
        items.push(
            { floor: 0, variety: 'elerium', type: 'generator' },
            { floor: 0, variety: 'elerium', type: 'microchip' },
            { floor: 0, variety: 'dilithium', type: 'generator' },
            { floor: 0, variety: 'dilithium', type: 'microchip' },
        )
    }

    const states: DefaultMap<string, number> = new DefaultMap([], Infinity);
    const queue = [[0, 0, 0, items] as [number, number, number, Item[]]];
    while (queue.length > 0) {
        let [, moves, floor, items] = heap.pop(queue)!;
        const state = getState(items, floor);
        if (states.get(state) <= moves) continue;
        states.set(state, moves);

        if (items.every(item => item.floor === 3)) {
            return moves;
        }

        const combos = getCombos(items, floor);
        for (let combo of combos) {
            for (let target of (floor === 0 ? [1] : floor === 3 ? [2] : [floor + 1, floor - 1])) {
                const trialItems = items.map(item => combo.includes(item) ? { ...item, floor: target } : { ...item });
                if (isValid(trialItems, floor) && isValid(trialItems, target)) {
                    heap.push(queue, [moves - heuristic(trialItems, floor, target, combo.length), moves + 1, target, trialItems]);
                }
            }
        }

    }

    throw new Error('No solution found');

}

run(__filename, solve);