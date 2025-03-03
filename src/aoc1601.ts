import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let x = 0, y = 0, dx = 0, dy = -1;
    const locations = new Set(['0,0']);
    for (let [i, dir] of inputs[0].split(/,\s/g).entries()) {
        let found = false;
        if (dx === 0) { // Facing N/S
            dx = dir[0] === 'L' ? dy : -dy;
            dy = 0;
        } else { // Facing E/W
            dy = dir[0] === 'R' ? dx : -dx;
            dx = 0;
        }
        for (let j = 0; j < parseInt(dir.substring(1)); j++) {
            x += dx;
            y += dy;
            if (part === 2) {
                const loc = `${x},${y}`;
                if (locations.has(loc)) {
                    found = true;
                    break;
                }
                locations.add(loc);
            }
        }
        if (found) break;
    }
    return Math.abs(x) + Math.abs(y);
}

run(__filename, solve);