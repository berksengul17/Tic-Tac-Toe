const GameBoard = (() => {
  const _WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let _board = Array(9).fill(null);

  // If the marks in one of the combitions in the "_WINNING_PATTERNS" array
  // are the same return true otherwise return false
  const _checkForWin = (mark) =>
    _WINNING_PATTERNS.some((pattern) =>
      pattern.every((index) => _board[index] === mark)
    );

  // If none of the values are null then it is a draw
  const _checkForDraw = () => !_board.some((mark) => mark === null);

  const getBoard = () => _board;
  const getMarkAt = (index) => _board[index];
  const setBoard = (index, mark) => (_board[index] = mark);
  const resetBoard = () => (_board = Array(9).fill(null));
  const checkForGameOver = (mark) => {
    if (_checkForDraw()) return "It's a draw";
    else if (_checkForWin(mark)) return `${mark} wins`;
  };

  return {
    getBoard,
    getMarkAt,
    setBoard,
    checkForGameOver,
  };
})();

const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;

  return { getName, getMark };
};

const DisplayController = (() => {
  const drawMark = (index) => {
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = GameBoard.getMarkAt(index);
  };

  return { drawMark };
})();

const GameController = (() => {
  const player_1 = Player("Player 1", "X");
  const player_2 = Player("Player 2", "O");
  const cells = document.querySelectorAll(".cell");
  let currentTurn = player_1.getMark();

  const changeTurn = () => {
    if (currentTurn === player_1.getMark()) currentTurn = player_2.getMark();
    else currentTurn = player_1.getMark();
  };

  cells.forEach((cell) => {
    cell.addEventListener(
      "click",
      (e) => {
        const clickedIndex = e.target.dataset.index;
        GameBoard.setBoard(clickedIndex, currentTurn);
        DisplayController.drawMark(clickedIndex);
        GameBoard.checkForGameOver(currentTurn);
        changeTurn();
      },
      { once: true }
    );
  });
})();
