// References:
// https://notes.burke.libbey.me/ansi-escape-codes/ escape sequences are like methods m(1, 32)
// https://gist.github.com/ConnerWill/d4b6c776b509add763e17f9f113fd25b
// https://github.com/nojvek/matrix-rain
// http://xahlee.info/comp/unicode_full-width_chars.html
// https://github.com/sonatard/terminal-color-theme 256-color code formula:
// 16 + (red * 36) + (green * 6) + blue

const CSI = '\x1b['; // Control Sequence Initiator aka "ESC"

function fullWidth(str: string) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        return code <= 0x007f // 0x0000 to 0x007F is ASCII range
            ? String.fromCharCode(code === 32
                ? 0x3000 // Full width equivalent of space is 0x3000
                : code + 0xfee0) // Add 0xFEE0 to get full-width equivalent of ASCII
            : char; // No full-width equivalents or already full-width
    }).join('');
}

function rand(from: number, to: number) {
    return from + Math.floor(Math.random() * (to - from));
}

class Terminal {

    cols: number;
    rows: number;

    constructor() {
        ([this.cols, this.rows] = process.stdout.getWindowSize());
    }

}

class Message {

    private __text = '';
    col = 0;
    len = 0;
    row = 0;
    terminal: Terminal;

    constructor(terminal: Terminal, text = '        ') {
        this.terminal = terminal;
        this.text = text;
    }

    get text() {
        return this.__text;
    }

    set text(text: string) {
        this.__text = fullWidth(text);
        this.row = Math.floor(this.terminal.rows / 2);
        this.col = Math.floor((this.terminal.cols - text.length) / 2)
            + ((this.terminal.cols - text.length) % 2 === 0 ? 0 : 1);
        this.len = text.length * 2;
    }

}

// Use a buffer to manage the terminal output, updating only the areas of the screen that have changed
// to give the smoothest possible animation.
class Buffer {

    buffer: string;
    message: Message;
    framerate: number;

    constructor(message: Message, framerate: number) {
        this.buffer = '';
        this.message = message;
        this.framerate = framerate;
    }

    writeAt(row: number, col: number, text: string) {
        // Protect the message and border around it from being overwritten by rain
        if (this.message.text.length > 0 &&
            row >= this.message.row - 1 &&
            row <= this.message.row + 1 &&
            col >= this.message.col - 2 && // 2 because full-width
            col <= this.message.col + this.message.len) {
            return;
        } else {
            this.buffer += `${CSI}${row};${col}H${text}`;
        }
    }

    writeMsg() {
        const horizontalBorder = `${CSI}0;30m${fullWidth(' ').repeat(this.message.text.length + 2)}`;
        const message = `${CSI}0m${fullWidth(' ')}${CSI}1;30m${CSI}48;2;55;216;148m${this.message.text}${CSI}0m${fullWidth(' ')}`;
        this.buffer += `${CSI}${this.message.row - 1};${this.message.col - 2}H${horizontalBorder}`;
        this.buffer += `${CSI}${this.message.row};${this.message.col - 2}H${message}`;
        this.buffer += `${CSI}${this.message.row + 1};${this.message.col - 2}H${horizontalBorder}`;
    }

    flush() {
        process.stdout.write(this.buffer);
        this.buffer = '';
    }

}

class Drop {

    // Characters included in rain: Katakana + full-width Latin numbers
    static charSet =
        [...Array(0x30ff - 0x30a0 + 1).keys()].map(code => String.fromCharCode(0x30a0 + code)).join('') // Katakana
        + fullWidth('0123456789'); // Full-width ASCII 0-9 equivalents

    // RGB colors
    static greens = [
        `${CSI}38;2;19;74;55m`, // vdim
        `${CSI}38;2;34;86;80m`, // wash
        `${CSI}38;2;25;113;98m`, // dim
        `${CSI}38;2;55;216;148m`, // normal
        `${CSI}38;2;43;249;148m`, // bright
    ];
    static flash = `${CSI}1;38;2;19;255;175m`; // flash
    static head = `${CSI}38;2;120;255;229m`; // head

    buffer: Buffer;
    chars: string[] = [];
    col = 0;
    colors: number[] = [];
    delay = 0;
    flash = {
        can: false,
        on: false,
        count: 0
    };
    height = 0;
    row = 0;
    speed = 0;
    start = 0;
    terminal: Terminal;

    constructor(col: number, buffer: Buffer, terminal: Terminal) {
        this.buffer = buffer;
        this.col = col;
        this.terminal = terminal;
        this.reset();
    }

    static genChars(len: number) {
        return [...Array(len)].map(() => Drop.charSet[rand(0, Drop.charSet.length - 1)]);
    }

    reset() {
        // Each drop has a random height, speed, starting row, set of characters and character colors,
        // and a chance of being able to flash or not.
        this.chars = Drop.genChars(this.terminal.rows);
        this.colors = [...Array(this.terminal.rows)].map(() => rand(0, Drop.greens.length - 1));
        this.delay = rand(0, this.terminal.rows / 4);
        this.height = rand(5, this.terminal.rows);
        this.speed = rand(1, Math.floor(this.buffer.framerate / 3));
        this.start = Math.min(1, rand(1, Math.floor(2 * this.terminal.rows)) - this.terminal.rows);
        this.flash = {
            can: Math.random() >= 0.5,
            on: false,
            count: 0
        };
        this.row = this.start; // rows and columns are 1-based
    }

    render(frame: number, flashOn: boolean) {
        if (frame % this.speed === 0) {
            // Delayed start
            if (this.delay > 0) {
                this.delay--;
                return;
            }
            // Blank the tail
            if (this.row - this.height > 0 && this.row - this.height < this.terminal.rows) {
                this.buffer.writeAt(this.row - this.height, this.col, `${CSI}0m `);
            }
            // Flash
            if (this.row > 0 && this.flash.can && this.flash.on !== flashOn) {
                this.flash.on = flashOn;
                for (let row = Math.max(1, this.row - this.height + 1); row < Math.min(this.start + this.height, this.row, this.terminal.rows); row++) {
                    this.buffer.writeAt(row, this.col, (this.flash.on ? Drop.flash : Drop.greens[this.colors[row - this.start]]) + this.chars[row - this.start]);
                }
            }
            // Rewrite the previous head in its color
            if (this.row > 1 && this.row <= this.terminal.rows) {
                this.buffer.writeAt(this.row - 1, this.col, (this.flash.on ? Drop.flash : Drop.greens[this.colors[this.row - 2]]) + this.chars[this.row - 2]);
            }
            // Write the new head in the brightest color
            if (this.row > 0 && this.row < this.terminal.rows) {
                this.buffer.writeAt(this.row, this.col, Drop.head + this.chars[this.row - 1]);
            }
            // Reset the drop after it falls off the screen
            if (this.row - this.height >= this.terminal.rows) {
                this.reset();
            } else {
                this.row++;
            }
        }
    }

}

export class Rain {

    buffer: Buffer;
    created: number;
    drops: Drop[];
    frame: number;
    framerate: number;
    message: Message;
    terminal: Terminal;

    constructor(message = '        ', framerate = 24) {
        this.created = Date.now();
        this.frame = 0;
        this.framerate = framerate;
        this.terminal = new Terminal();
        this.message = new Message(this.terminal, message);
        this.buffer = new Buffer(this.message, framerate);
        this.drops = [...Array(Math.floor(this.terminal.cols / 2))].map((_, col) => new Drop((col + 1) * 2, this.buffer, this.terminal));

        // process.stdin.setRawMode(true); // Pass inputs to program instead of terminal
        process.stdout.write(`${CSI}?25l`); // Cursor invisible
        console.log(`${'\n'.repeat(this.terminal.rows)}`); // Bunch of newlines to make empty space
        this.buffer.writeMsg();
    }

    render() {
        while (this.frame < this.targetFrame) {
            let flashCount = 0;
            for (let drop of this.drops) {
                drop.render(this.frame % this.framerate, flashCount > 0);
                if (flashCount > 0) {
                    flashCount--;
                } else if (Math.random() > 0.7) {
                    flashCount = Math.floor(rand(this.framerate / 10, this.framerate / 2));
                }
            }
            this.frame++;
            this.buffer.flush();
        }
    }

    setMessage(text: string) {
        this.message.text = text;
        this.buffer.writeMsg();
        this.buffer.flush();
    }

    stop() {
        process.stdout.write(`${CSI}?25h` // Cursor visible
            + `${CSI}0m` // Reset font
            + `${CSI}${this.terminal.rows + 1};1H`); // Move to end
        console.log();
    }

    get targetFrame() {
        return this.framerate * (Date.now() - this.created) / 1000;
    }

}

if (require.main === module) {
    const framerate = 24;
    const targetMessage = `RED OR BLUE?`;
    let message = '';
    
    // Create a new Rain instance, passing it the initial message and target framerate.
    const rain = new Rain(message, framerate);

    // Call render() in the main program loop.  Here we only call it based on the framerate, but it
    // can be called more frequently and it will only update at the specified framerate.
    const renderer = setInterval(() => rain.render(), 1000 / framerate);

    // If you want to display a message in the middle of the rain, call setMessage() whenever you
    // update it.  If no message is supplied or updated then no message will be shown.
    const revealer = setInterval(() => {
        if (message.length < targetMessage.length) {
            message += targetMessage[message.length];
            rain.setMessage(message);
        }
    }, 1000);

    // When your program is done call stop() so that the cursor format gets reset.
    // NOTE: If you interrupt the execution (with ctrl+c or VSCode debugger disconnect) then the
    // cursor will not be reset.  You can try executing the following from the command line to make
    // the cursor visible and default color:
    // echo -e "\033[?25h\033[0m"
    setTimeout(() => {
        clearInterval(renderer);
        clearInterval(revealer);
        rain.stop();
    }, 1000 * (targetMessage.length + 1));
}