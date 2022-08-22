const span = (letter, index) => {
  const node = document.createElement("span");
  node.classList.add("word");

  node.textContent = letter;
  node.style.setProperty("--index", index);

  return node;
};

export const byWord = (text) => text.split(" ").map(span);
