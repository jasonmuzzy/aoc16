import { run } from 'aoc-copilot';
import { adjacents, DefaultMap } from 'aoc-copilot/dist/utils';
import * as heap from 'aoc-copilot/dist/heap';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    interface Node { id: string, x: number, y: number, used: number, avail: number };
    const nodes = inputs.slice(2)
        .map(input => (input.match(/\d+/g) ?? []).map(Number))
        .map(([x, y, size, used, avail, pct]) => ({ id: `${x},${y}`, x, y, used, avail }))
        .sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y)
        .reduce((pv, cv) => {
            if (pv.length - 1 < cv.y) pv.push([]);
            pv[cv.y].push(cv);
            return pv;
        }, [] as Node[][]);

    let answer = 0;
    if (part === 1) {
        for (let node of nodes.flat()) {
            for (let other of nodes.flat()) {
                if (other !== node && node.used > 0 && other.avail >= node.used) {
                    answer++;
                }
            }
        }
    } else {
        const heuristic = (goal: Node, empty: Node) => {
            if (Math.abs(goal.x - empty.x) > 1 || Math.abs(goal.y - empty.y) > 1) {
                return (goal.x - empty.x) ** 2 + (goal.y - empty.y) ** 2 + 1000;
            } else {
                return goal.x + goal.y;
            }

            // return 2 * goal.x + 2 * goal.y + Math.abs(empty.x - goal.x + 1) + Math.abs(empty.y - goal.y);

            // return goal.x === 0 && goal.y === 0
            //     ? 0
            //     : empty.y + Math.abs(empty.x - goal.x + 1) + goal.x * 5 + 1;
        }
        const goal = nodes[0][nodes[0].length - 1];
        const goalId = goal.id;
        const empty = nodes.flat().find(node => node.used === 0)!;
        const emptyAvail = empty.avail;
        const print = (nodes: Node[][], h: number) => {
            console.log(`Heuristic: ${h}\n`
                + nodes.map((row, y) => row.map((cell, x) => (x === 0 && y === 0 ? '(' : ' ')
                    + (cell.used === 0 ? '_' : cell.id === goalId ? 'G' : cell.used > emptyAvail ? '#' : '.')
                    + (x === 0 && y === 0 ? ')' : ' ')).join(' ')).join('\n')
                + '\n');
        }
        const q = [[heuristic(goal, empty), 0, empty.x, empty.y, goal.x, goal.y, JSON.stringify(nodes)]] as [number, number, number, number, number, number, string][];
        const distances: DefaultMap<string, number> = new DefaultMap([], Infinity);
        while (q.length > 0 && answer === 0) {
            const [h, steps, ex, ey, gx, gy, state] = heap.pop(q)!;
            if (steps >= distances.get(`${ex},${ey},${gx},${gy}`)) continue;
            distances.set(`${ex},${ey},${gx},${gy}`, steps);
            const nodes: Node[][] = JSON.parse(state);
            // print(nodes, h);
            const goalTemp = nodes.flat().find(node => node.id === goalId)!;
            for (let [x1, y1] of adjacents(ex, ey, nodes[0].length, nodes.length)) {
                const adj = nodes[y1][x1];
                if (ex === 0 && ey === 0 && adj === goalTemp) {
                    answer = steps + 1;
                    break;
                }
                if (adj.used <= empty.avail) { // Movable
                    // Swap
                    let emptyTemp = nodes[ey][ex];
                    nodes[ey][ex] = Object.assign(adj, { x: ex, y: ey });
                    nodes[y1][x1] = Object.assign(emptyTemp, { x: x1, y: y1 });
                    heap.push(q, [heuristic(goalTemp, nodes[y1][x1]), steps + 1, x1, y1, goalTemp.x, goalTemp.y, JSON.stringify(nodes)]);
                    // Swap back
                    nodes[ey][ex] = Object.assign(emptyTemp, { x: ex, y: ey });
                    nodes[y1][x1] = Object.assign(adj, { x: x1, y: y1 });
                }
            }
        }
    }
    return answer;
}

run(__filename, solve, false);