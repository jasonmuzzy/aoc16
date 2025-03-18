import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    interface Bot {
        id: string,
        lowTarg: string,
        lowId: string,
        highTarg: string,
        highId: string,
        chips: number[]
    }

    // Parse bot handoff rules
    const bots = new Map(inputs.filter(input => input.startsWith('bot')).map(input => {
        const match = input.match(/(?=bot (?<id>\d+) gives low to (?<lowTarg>bot|output) (?<lowId>\d+) and high to (?<highTarg>bot|output) (?<highId>\d+))/);
        if (match?.groups) {
            const { id, lowTarg, lowId, highTarg, highId } = match.groups;
            return [id, { id, lowTarg, lowId, highTarg, highId, chips: [] }] as [string, Bot];
        } else {
            throw new Error('Error parsing input');
        }
    }));

    // Parse starting values
    inputs.filter(input => input.startsWith('value')).forEach(input => {
        const numbers = input.match(/\d+/g);
        if (numbers) {
            const [chip, id] = numbers;
            const bot = bots.get(id);
            if (bot) {
                bot.chips.push(parseInt(chip));
            }
        }
    });

    const outputs: Map<string, number> = new Map();
    let answer: string | number = '';
    while (answer === '') {
        for (let bot of bots.values()) {
            if (bot.chips.length === 2) {

                const [lowChip, highChip] = bot.chips.toSorted((a, b) => a - b);

                if (part === 1 && (
                    (test && lowChip === 2 && highChip === 5) ||
                    (!test && lowChip === 17 && highChip === 61)
                )) {
                    answer = bot.id;
                    break;
                }

                if (bot.lowTarg === 'bot') {
                    bots.get(bot.lowId)?.chips.push(lowChip);
                } else {
                    outputs.set(bot.lowId, lowChip);
                }

                if (bot.highTarg === 'bot') {
                    bots.get(bot.highId)?.chips.push(highChip);
                } else {
                    outputs.set(bot.highId, highChip);
                }

                if (part === 2 && (bot.lowTarg === 'output' || bot.highTarg === 'output') && outputs.has('0') && outputs.has('1') && outputs.has('2')) {
                    answer = outputs.get('0')! * outputs.get('1')! * outputs.get('2')!;
                    break;
                }

                bot.chips = [];
            }
        }
    }

    return answer;
}

run(__filename, solve);