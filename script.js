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

  const getBoard = () => _board;
  const getMarkAt = (index) => _board[index];
  const setBoard = (index, mark) => (_board[index] = mark);
  const resetBoard = () => (_board = Array(9).fill(null));

  // If the marks in one of the combitions in the "_WINNING_PATTERNS" array
  // are the same return true otherwise return false
  const checkForWin = (mark) =>
    _WINNING_PATTERNS.some((pattern) =>
      pattern.every((index) => _board[index] === mark)
    );

  // If none of the values are null then it is a draw
  const checkForDraw = () => !_board.some((mark) => mark === null);

  return {
    getBoard,
    getMarkAt,
    setBoard,
    resetBoard,
    checkForWin,
    checkForDraw,
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

  const drawBoard = () => {
    for (let i = 0; i < 9; i++) drawMark(i);
  };

  return { drawMark, drawBoard };
})();

const GameController = (() => {
  const gameStart = document.querySelector(".game-start");
  const game = document.querySelector(".game-container");
  const gameOver = document.querySelector(".game-over-container");
  const message = document.querySelector(".message");
  const startBtn = document.querySelector(".start-button");
  const restartBtns = document.querySelectorAll(".restart-button");
  const changeBtn = document.querySelector(".change-players-button");
  const cells = document.querySelectorAll(".cell");

  let player_1 = Player("Player 1", "X");
  let player_2;
  let currentTurn;

  // Hide game start and show game and create
  // player objects based on the selected opponent
  const startGame = () => {
    gameStart.style.display = "none";
    game.style.display = "flex";
    const opponent = document.querySelector(
      'input[name="opponent"]:checked'
    ).id;
    if (opponent === "ai") {
      player_2 = Player("AI", "O");
    } else if (opponent === "human") {
      player_2 = Player("Player 2", "O");
    }
    currentTurn = player_1.getMark();
  };

  // Reset board array, draw new board,
  // override old listeners, reset display styles,
  // and change "currentTurn" to "player_1"
  const resetGame = () => {
    GameBoard.resetBoard();
    DisplayController.drawBoard();
    addListenerToCells();
    resetStyles();
    currentTurn = player_1.getMark();
  };

  // Show winning message and options
  const endGame = (winnerMsg) => {
    message.textContent = winnerMsg.toUpperCase();
    gameOver.style.display = "grid";
    game.style.pointerEvents = "none";
    game.style.filter = "opacity(.5)";
    game.style.filter = "blur(1rem)";
  };

  // Hide game, show start menu
  // and reset game
  const backToMainMenu = () => {
    game.style.display = "none";
    gameStart.style.display = "grid";
    resetGame();
  };

  // Draw the mark to the clicked space
  // check for game over if game over display
  // the game ove menu with the winner's name
  // otherwise change turn
  const makeMove = (e) => {
    const clickedIndex = e.target.dataset.index;
    GameBoard.setBoard(clickedIndex, currentTurn);
    DisplayController.drawMark(clickedIndex);

    if (GameBoard.checkForWin(currentTurn)) {
      const winner =
        currentTurn === player_1.getMark()
          ? player_1.getName()
          : player_2.getName();

      endGame(`${winner} wins!`);
    } else if (GameBoard.checkForDraw()) {
      endGame("It's a draw!");
    } else {
      changeTurn();
    }
  };

  const resetStyles = () => {
    gameOver.style.display = "none";
    game.style.pointerEvents = "all";
    game.style.filter = "none";
  };

  const addListenerToCells = () => {
    cells.forEach((cell) => {
      cell.addEventListener("click", makeMove, { once: true });
    });
  };

  const changeTurn = () => {
    if (currentTurn === player_1.getMark()) currentTurn = player_2.getMark();
    else currentTurn = player_1.getMark();
  };

  startBtn.addEventListener("click", startGame);
  restartBtns.forEach((restartBtn) =>
    restartBtn.addEventListener("click", resetGame)
  );
  changeBtn.addEventListener("click", backToMainMenu);
  addListenerToCells();
})();
