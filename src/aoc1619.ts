import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {
    // Determine which elf will wind up with all the gifts in the misunderstood white elephant gift exchange
    const n = parseInt(inputs[0]);
    const elves = Array(n).fill(1);
    if (part === 1) {
        // Original part 1 solution which ran in 0.5s:
        // while (true) {
        //     for (let [i, gifts] of elves.entries()) {
        //         if (gifts > 0) {
        //             let left = (i + 1) % elves.length;
        //             while (elves[left] === 0) {
        //                 left = (left + 1) % elves.length;
        //             }
        //             elves[i] += elves[left];
        //             elves[left] = 0;
        //             if (elves[i] === elves.length) {
        //                 return i + 1;
        //             }
        //         }
        //     }
        // }

        // Optimized solution found after solving both parts and discovering that part 1 is just the well-known
        // Josephus problem (https://www.youtube.com/watch?v=uCsD3ZGzMgE) which states:
        // If n = 2**a + L (where "n" is the number of elves in the circle, "a" is greatest power such that 2**a <= n, and L is the rest after n - 2**a)
        // Then W(n) = 2L + 1 (where "W" is the winner)
        // And, there's a nice bit shifting shortcut: take the most significant bit (equivalent to 2**a) and move it to the end (+ 1)
        const bits = n.toString(2);
        return parseInt(bits.substring(1) + bits[0], 2)

    } else {
        // Original part 2 solution that ran for about 1.5 hours
        // const ll = Array.from({ length: n }, (_, k) => (k + 1) % n);
        // let elf = 0;
        // for (let remaining = n, timer = Date.now(); remaining > 1; --remaining) {
        //     if (part === 1) {
        //         elves[elf] += elves[ll[elf]];
        //         elves[ll[elf]] = 0;
        //         ll[elf] = ll[ll[elf]];
        //         elf = ll[elf];
        //     } else {
        //         let before = elf, target = elf;
        //         for (let i = 0; i < Math.floor(remaining / 2); i++) {
        //             before = target;
        //             target = ll[target];
        //         }
        //         elves[elf] += elves[target];
        //         elves[target] = 0;
        //         ll[before] = ll[target];
        //         ll[target] = -1;
        //         elf = ll[elf];
        //         const now = Date.now();
        //         if (now - timer >= 1000) {
        //             timer = now;
        //             process.stdout.write(`\r${remaining} `);
        //         }
        //     }
        // }
        // if (part === 2 && !test) process.stdout.write('\r\n');
        // return elf + 1;

        // Optimized part 2 solution discovered after solving both parts
        // Amazing!! https://www.reddit.com/r/adventofcode/comments/1i7mzqo/2016_day_19_part_1_and_part_2_analytical_solutions/
        const a = Math.floor(Math.log(n) / Math.log(3)); // Change of base formula, gets max "a" such that 3**a <= n
        const elvesScale = 3 ** a;
        const rest = n - elvesScale;
        const relu = (x: number) => Math.max(0, x); // Rectified Linear Unit function
        return n === elvesScale
            ? n
            : rest + relu(n - 2 * elvesScale);

    }
}

run(__filename, solve);