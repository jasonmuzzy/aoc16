import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Fill a disk with psueodo-random bits generated using a dragon curve algorithm, and then calculate the checksum
    let state = inputs[0];
    const disk = test ? 20 : part === 1 ? 272 : 35651584;

    // Generate dragon curve data
    while (state.length < disk) {
        state += '0' + state.split('').toReversed().map(bit => bit === '0' ? '1' : '0').join('');
    }

    // Truncate to the disk length
    state = state.substring(0, disk);

    // Calculate the checksum
    while (state.length % 2 === 0) {
        state = Array(state.length / 2).keys().reduce((newState, _, i) => newState + (state[i * 2] === state[i * 2 + 1] ? '1' : '0'), '');
    };

    return state;
}

run(__filename, solve);