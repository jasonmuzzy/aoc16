import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Identify IP addresses not blocked by the ranges
    let prevHigh = -1, count = 0;
    for (let [low, high] of inputs.map(input => input.split('-').map(Number)).toSorted((a, b) => a[0] - b[0])) {
        if (low - prevHigh > 1) {
            if (part === 1) return prevHigh + 1; // Part 1: get the fist (lowest) allowed IP
            else count += low - prevHigh - 1; // Part 2: count the total number allowed
        }
        prevHigh = Math.max(prevHigh, high);
    }
    count += (test ? 9 : 4294967295) - prevHigh; // Add any allowed to the end of the IP range
    return count;
}

run(__filename, solve);