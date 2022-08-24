const span = (letter, index) => {
  const node = document.createElement("span");
  node.classList.add("word");

  node.textContent = letter;
  node.style.setProperty("--index", index);

  return node;
};

const byWord = (text) => text.split(" ").map(span);

const textContainer = document.querySelector(".game-start p");

const nodes = byWord(textContainer.textContent);
textContainer.firstChild.replaceWith(...nodes);
