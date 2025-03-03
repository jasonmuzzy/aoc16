import { createHash } from 'node:crypto';

import { run } from 'aoc-copilot';
import { sleep } from 'aoc-copilot/dist/site';

import { Rain } from './matrix';

let first = true;

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    if (first) first = false;
    else await sleep(2000); // Show the previous resuls briefly

    const code = '        '.split('');
    const rain = new Rain(code.join(''));
    rain.render();
    for (let i = 0; code.indexOf(' ') > -1; i++) {
        const hash = createHash('md5').update(inputs[0] + i.toString()).digest('hex');
        if (hash.substring(0, 5) === '00000' && (part === 1 || ('01234567'.includes(hash[5]) && code[parseInt(hash[5])] === ' '))) {
            code[part === 1 ? code.indexOf(' ') : parseInt(hash[5])] = hash[part + 4];
            rain.setMessage(code.join(''));
        }
        rain.render();
    }
    rain.stop();
    return code.join('');
}

run(__filename, solve);