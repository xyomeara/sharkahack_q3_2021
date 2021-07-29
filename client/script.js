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

//Get virtualKeyboardHeight
let focused = false;

const virtualKeyboardHeight = () => {
    const sx = document.body.scrollLeft;
    const sy = document.body.scrollTop;
    const naturalHeight = window.visualViewport.height;
    window.scrollTo(sx, document.body.scrollHeight);
    const keyboardHeight = naturalHeight - window.visualViewport.height;
    window.scrollTo(sx, sy);
    return keyboardHeight;
};

elem.addEventListener('focusin', () => {
    showMessage(
        `Virtual keyboard detected!!! focusin!!! window.visualViewport.width: ${window.visualViewport.width} x window.visualViewport.height: ${window.visualViewport.height}`,
        5000
    );
});

elem.addEventListener('focusout', () => {
    showMessage(
        `Virtual keyboard detected!!! focusout!!! window.visualViewport.width: ${window.visualViewport.width} x window.visualViewport.height: ${window.visualViewport.height}`,
        5000
    );
});

// function resizeListener
const resizeListener = () => {
    termFit.fit();
    term.scrollToBottom();
    showMessage(`${term.cols}x${term.rows}`, 2000);
};

// attach resize event listener to window
window.addEventListener('resize', () => {
    resizeListener();

    setTimeout(() => {
        showMessage(
            `window.visualViewport.width: ${window.visualViewport.width} x window.visualViewport.height: ${window.visualViewport.height}`,
            2000
        );
    }, 2000);
});

// Fake terminal interface
function runFakeTerminal() {
    if (term._initialized) {
        return;
    }

    term._initialized = true;

    term.prompt = () => {
        term.write('\r\n$ ');
    };

    term.writeln('Welcome to xterm.js');
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
                if (term._core.buffer.x > 2) {
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
    term.write('\r\n$ ');
}

runFakeTerminal();
