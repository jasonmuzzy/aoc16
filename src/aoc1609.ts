import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    const decompressedLength = (str: string): number => {
        const match = str.match(/(?<prefix>\w+)?\((?<lenStr>\d+)x(?<times>\d+)\)(?<rest>.+)/);
        if (match?.groups) {
            const { prefix = '', lenStr, times, rest } = match.groups;
            const len = parseInt(lenStr);
            return prefix.length
                + parseInt(times) * (part === 1 ? len : decompressedLength(rest.substring(0, len)))
                + decompressedLength(rest.substring(len));
        } else {
            return str.length;
        }
    }
    return decompressedLength(inputs[0]);
}

run(__filename, solve);