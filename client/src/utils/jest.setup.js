import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add #root to the DOM globally for all tests
const root = document.createElement('div');
root.setAttribute('id', 'root');
document.body.appendChild(root);