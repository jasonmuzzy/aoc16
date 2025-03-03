import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    const isABBA = (str: string) => {
        let result = false;
        for (let [offset, char] of str.split('').entries()) {
            if (str.length - offset < 4) {
                break; // Less than 4 characters left: impossible to find more ABBA patterns
            } else if (char === str[offset + 3] && char !== str[offset + 1] && str[offset + 1] === str[offset + 2]) {
                result = true; // Found ABBA pattern
                break;
            }
        }
        return result;
    }

    const getBABs = (supernets: string[]) => {
        return supernets.reduce((babs, supernet) => {
            for (let [offset, char] of supernet.split('').entries()) {
                if (supernet.length - offset < 3) {
                    break; // Less than 3 characters left: impossible to find more ABA patterns
                } else if (char === supernet[offset + 2] && char !== supernet[offset + 1]) {
                    babs.push(supernet[offset + 1] + char + supernet[offset + 1]); // Return corresponding BAB pattern of found ABA pattern
                }
            }
            return babs;
        }, [] as string[]);
    }

    const supporters = inputs.filter(input => {
        const sections = input.split(/\[|\]/g);
        const supernets = [...sections.entries()].filter(([i]) => i % 2 === 0).map(([_, supernet]) => supernet);
        const hypernets = sections.entries().filter(([i]) => i % 2 === 1).map(([_, hypernet]) => hypernet);
        if (part === 1) {
            return supernets.some(supernet => isABBA(supernet)) &&
                !hypernets.some(hypernet => isABBA(hypernet));
        } else {
            const babs = getBABs(supernets);
            return hypernets.some(hypernet => babs.some(bab => hypernet.indexOf(bab) > -1));
        }
    });
    return supporters.length;
}

run(__filename, solve);