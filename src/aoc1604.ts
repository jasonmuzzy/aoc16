import { run } from 'aoc-copilot';

async function solve(inputs: string[], part: number, test: boolean, additionalInfo?: { [key: string]: string }): Promise<number | string> {

    // Get valid rooms where the checksum matches the 5 most common letters in the name
    const rooms = inputs.reduce((rooms, input) => {

        // Parse the room name, ID and checksum
        const [{ groups: room }] = [...input.matchAll(/(?<name>.*)-(?<id>\d+)\[(?<checksum>.{5})/g)];

        if (room) {

            // Count the occurrences of each character in the room name
            const top5 = [...room.name.replaceAll('-', '').split('').reduce((pv, c) => {
                pv.set(c, (pv.get(c) ?? 0) + 1);
                return pv;
            }, new Map() as Map<string, number>)]
                // Sort them by count desc, alpha asc
                .sort((a, b) => a[1] !== b[1] ? b[1] - a[1] : a[0] < b[0] ? -1 : 1)
                // Keep the top 5
                .slice(0, 5)
                // Keep just the letter
                .map(v => v[0])
                // Sort the top 5 letters alphabetically
                .sort((a, b) => a < b ? -1 : 1)
                // Join them back into a string
                .join('');
            
            // Sort the checksum alphabetically for easy comparison to the top 5
            const checksum = room.checksum.split('').sort((a, b) => a < b ? -1 : 1).join('');

            // Keep valid rooms
            if (checksum === top5) {
                const id = parseInt(room.id);
                const name = part === 1
                    ? room.name
                    : room.name // Part 2
                        .split('')
                        // "Decrypt" the room name by shifting each letter by the room ID
                        .map(c => c === '-' ? ' ' : String.fromCharCode('a'.charCodeAt(0) + (c.charCodeAt(0) - 'a'.charCodeAt(0) + id) % 26))
                        .join('');
                rooms.push({ name, id, checksum });
            }
        }

        return rooms;
        
    }, [] as { name: string, id: number, checksum: string }[]);

    return part === 1
        // Sum of valid room IDs
        ? rooms.map(room => room.id).reduce((pv, cv) => pv + cv)
        // ID of room where "North Pole objects are stored" (decrypted name = "northpole object storage")
        : rooms.find(room => /North ?Pole ?object/i.test(room.name))?.id ?? 0;

}

run(__filename, solve);