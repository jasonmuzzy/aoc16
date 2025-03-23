import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    let pw = (part === 1 ? test ? 'abcde' : 'abcdefgh' : test ? 'decab' : 'fbgdceah').split('');
    const rotateRight = (pw: string[], n: number) => [...pw.slice(pw.length - n), ...pw.slice(0, pw.length - n)];
    const rotateLeft = (pw: string[], n: number) => [...pw.slice(n), ...pw.slice(0, n)];
    const rotateBased = (pw: string[], a: string) => {
        let index = pw.indexOf(a);
        index += (index >= 4 ? 2 : 1);
        return rotateRight(pw, index);
    }
    for (let input of part === 1 ? inputs : inputs.toReversed()) {
        const numbers = (input.match(/\d+/g) ?? []).map(Number);
        const letters = [...(input.match(/(?<=letter )[a-z]/g) ?? [])];
        if (input.startsWith('swap position')) {
            const temp = pw[numbers[0]];
            pw[numbers[0]] = pw[numbers[1]];
            pw[numbers[1]] = temp;
        } else if (input.startsWith('swap letter')) {
            pw = pw.map(letter => letter === letters[0] ? letters[1] : letter === letters[1] ? letters[0] : letter);
        } else if (input.startsWith('rotate')) {
            const [how] = input.match(/(?<=rotate )\w+/g) ?? ['right'];
            if (part === 1) {
                pw = how === 'right' ? rotateRight(pw, numbers[0]) : how === 'left' ? rotateLeft(pw, numbers[0]) : rotateBased(pw, letters[0]);
            } else {
                // Try various rotations until we find the one that would produce the current state with the given rotation command
                let before = rotateLeft([...pw], 1);
                let after = how === 'right' ? rotateRight(before, numbers[0]) : how === 'left' ? rotateLeft(before, numbers[0]) : rotateBased(before, letters[0]);
                while (after.join('') !== pw.join('')) {
                    before = rotateLeft(before, 1);
                    after = how === 'right' ? rotateRight(before, numbers[0]) : how === 'left' ? rotateLeft(before, numbers[0]) : rotateBased(before, letters[0]);
                }
                pw = before;
            }
        } else if (input.startsWith('reverse')) {
            pw.splice(numbers[0], numbers[1] - numbers[0] + 1, ...pw.slice(numbers[0], numbers[1] + 1).toReversed());
        } else if (input.startsWith('move')) {
            const temp = pw.splice(numbers[part === 1 ? 0 : 1], 1);
            pw.splice(numbers[part === 1 ? 1 : 0], 0, ...temp);
        }
    }
    return pw.join('');
}

run(__filename, solve);