import './style.css';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

// Initialize term and termfit
const term = new Terminal();
const termFit = new FitAddon();
term.loadAddon(termFit);
const elem = document.getElementById('terminal');
term.open(elem);
termFit.fit();

// Initialize message
const message = elem.ownerDocument.createElement('div');
message.className = 'xterm-overlay';

// Initialize global variable timeoutID
let timeoutID = null;

// function removeMessage
const removeMessage = () => {
    if (message.parentNode === elem) {
        elem.removeChild(message);
    }
    if (timeoutID !== null) {
        clearTimeout(timeoutID);
        timeoutID = null;
    }
};

// function showMessage
const showMessage = (textContent, timeout) => {
    console.log('xterm.showMessage:', message);
    removeMessage(); // remove any existing message first
    message.textContent = textContent;
    elem.appendChild(message);

    if (timeout > 0) {
        timeoutID = setTimeout(() => {
            removeMessage();
        }, timeout);
    }
};

// function resizeListener
const resizeListener = () => {
    termFit.fit();
    term.scrollToBottom();
    showMessage(`${term.cols}x${term.rows}`, 2000);
};

window.visualViewport.addEventListener('resize', () => {
    elem.style.height = `${visualViewport.height}px`;
    resizeListener();
});

// Fake terminal interface
function runFakeTerminal() {
    if (term._initialized) {
        return;
    }

    term._initialized = true;

    term.prompt = () => {
        term.write('\r\ndigitaloceaen ~ % ');
    };

    term.writeln('Welcome to the DigitalOcean fake terminal');
    term.writeln(
        'This is a local terminal emulation, without a real terminal in the back-end.'
    );
    term.writeln('Type some keys and commands to play around.');
    term.writeln('');
    prompt(term);

    term.onData((e) => {
        switch (e) {
            case '\r': // Enter
            case '\u0003': // Ctrl+C
                prompt(term);
                break;
            case '\u007F': // Backspace (DEL)
                // Do not delete the prompt
                if (term._core.buffer.x > 18) {
                    term.write('\b \b');
                }
                break;
            default:
                // Print all other characters for demo
                term.write(e);
        }
    });
}

function prompt(term) {
    term.write('\r\ndigitaloceaen ~ % ');
}

runFakeTerminal();
