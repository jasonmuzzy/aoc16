import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    return inputs
        .map(input => input
            .trim()
            .split(/\s+/)
            .map(Number))
        .map((v, i, a) => part === 1
            ? v
            : [
                a[Math.floor(i / 3) * 3 + 0][i % 3], // Rotate:
                a[Math.floor(i / 3) * 3 + 1][i % 3], // Take 3 from column 1, 3 from column 2, 3 from
                a[Math.floor(i / 3) * 3 + 2][i % 3]  // column 3, then skip 3 rows and repeat
            ]
        )
        .reduce((count, triangle) => {
            triangle.sort((a, b) => a - b);
            return count + (triangle[0] + triangle[1] > triangle[2] ? 1 : 0);
        }, 0);
}

run(__filename, solve);