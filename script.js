import { byWord } from "./splitting.js";

const textContainer = document.querySelector(".game-start p");

const nodes = byWord(textContainer.textContent);
textContainer.firstChild.replaceWith(...nodes);
