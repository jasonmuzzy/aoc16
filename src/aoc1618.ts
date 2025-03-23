import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Count how many "safe" tiles there are on a floor with pressure-sensitive trap plates
    const rows = parseInt(additionalInfo?.rows ?? (part === 1 ? '40' : '400000'));
    let prevRow = inputs[0];
    let answer = prevRow.replaceAll('^', '').length;
    for (let y = 1; y < rows; y++) {
        let newRow = '';
        for (let offset = 0; offset < prevRow.length; offset++) {
            const tiles = (offset === 0 ? '.' : prevRow[offset - 1])
            + prevRow[offset]
            + (offset === prevRow.length - 1 ? '.' : prevRow[offset + 1]);
            newRow += ['^^.', '.^^', '^..', '..^'].includes(tiles) ? '^' : '.';
        }
        prevRow = newRow;
        answer += prevRow.replaceAll('^', '').length;
    }
    return answer;
}

run(__filename, solve);