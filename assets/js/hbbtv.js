'use strict';

// Polyfill HbbTV KeyboardEvents

var KeyboardEvent = window.KeyEvent && window.KeyEvent.VK_RED ? window.KeyEvent : window.KeyboardEvent;

window.KeyboardEvent.VK_RED = KeyboardEvent.VK_RED || 82; // R
window.KeyboardEvent.VK_GREEN = KeyboardEvent.VK_GREEN || 71; // G
window.KeyboardEvent.VK_YELLOW = KeyboardEvent.VK_YELLOW || 89; // Y
window.KeyboardEvent.VK_BLUE = KeyboardEvent.VK_BLUE || 66; // B

window.KeyboardEvent.VK_LEFT = KeyboardEvent.VK_LEFT || 37;
window.KeyboardEvent.VK_UP = KeyboardEvent.VK_UP || 38;
window.KeyboardEvent.VK_RIGHT = KeyboardEvent.VK_RIGHT || 39;
window.KeyboardEvent.VK_DOWN = KeyboardEvent.VK_DOWN || 40;
window.KeyboardEvent.VK_ENTER = KeyboardEvent.VK_ENTER || 13;

window.KeyboardEvent.VK_0 = KeyboardEvent.VK_0 || 48;
window.KeyboardEvent.VK_1 = KeyboardEvent.VK_1 || 49;
window.KeyboardEvent.VK_2 = KeyboardEvent.VK_2 || 50;
window.KeyboardEvent.VK_3 = KeyboardEvent.VK_3 || 51;
window.KeyboardEvent.VK_4 = KeyboardEvent.VK_4 || 52;
window.KeyboardEvent.VK_5 = KeyboardEvent.VK_5 || 53;
window.KeyboardEvent.VK_6 = KeyboardEvent.VK_6 || 54;
window.KeyboardEvent.VK_7 = KeyboardEvent.VK_7 || 55;
window.KeyboardEvent.VK_8 = KeyboardEvent.VK_8 || 56;
window.KeyboardEvent.VK_9 = KeyboardEvent.VK_9 || 57;