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
  const getEmptySpaces = (board = _board) => {
    let emptySpaces = [];
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) emptySpaces.push(i);
    }
    return emptySpaces;
  };

  // If the marks in one of the combitions in the "_WINNING_PATTERNS" array
  // are the same return true otherwise return false
  const checkForWin = (mark, board = _board) =>
    _WINNING_PATTERNS.some((pattern) =>
      pattern.every((index) => board[index] === mark)
    );

  // If none of the values are null then it is a draw
  const checkForDraw = (board = _board) => !board.some((mark) => mark === null);

  return {
    getBoard,
    getMarkAt,
    setBoard,
    resetBoard,
    getEmptySpaces,
    checkForWin,
    checkForDraw,
  };
})();

const Player = (name, mark, isAi) => {
  const getName = () => name;
  const getMark = () => mark;
  const getIsAi = () => isAi;

  return { getName, getMark, getIsAi };
};

const Minimax = (() => {
  const _MAXIMIZER = "X";
  const _MINIMIZER = "O";

  // Return a score of 1 if x won -1 if o won
  // 0 if none of them won
  const _evaluate = (board) => {
    if (GameBoard.checkForWin("X", board)) return 1;
    else if (GameBoard.checkForWin("O", board)) return -1;
    return 0;
  };

  // Evaluate all possible moves and return the value of the board
  const _minimax = (board, depth, maximizingPlayer) => {
    const score = _evaluate(board);

    // If a player won return score
    if (score == 1 || score == -1) return score;
    // If draw return 0
    if (GameBoard.checkForDraw(board)) return 0;

    // Maximizing player's turn
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        // If empty try it
        if (board[i] === null) {
          board[i] = _MAXIMIZER;
          // Call the function recursively to find the maximum value
          let eval = _minimax(board, depth + 1, false);
          maxEval = Math.max(maxEval, eval);
          // Undo the move
          board[i] = null;
        }
      }
      return maxEval;
    }

    // Minimizing player's turn
    else {
      let minEval = +Infinity;
      // Traverse all cells
      for (let i = 0; i < 9; i++) {
        // If empty try it
        if (board[i] === null) {
          board[i] = _MINIMIZER;
          // Call the function recursively to find the minimum value
          let eval = _minimax(board, depth + 1, true);
          minEval = Math.min(minEval, eval);
          // Undo the move
          board[i] = null;
        }
      }
      return minEval;
    }
  };

  // Return best possible move for the player
  const findBestMove = (board) => {
    let bestMove = null;
    let bestEval = +Infinity;

    // Traverse all cells, evaluate
    // minimax function for all empty
    // cells. And return the cell
    // with optimal value.
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = _MINIMIZER;
        let eval = _minimax(board, 0, true);
        board[i] = null;

        if (eval < bestEval) {
          bestEval = eval;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  return { findBestMove };
})();

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
      player_2 = Player("AI", "O", true);
    } else if (opponent === "human") {
      player_2 = Player("Player 2", "O", false);
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

  // Get the best index and the html element with that index
  // then draw the mark on that index and remove the event listener from that element
  // to prevent the player from making any changes
  const makeAiMove = () => {
    let index = Minimax.findBestMove(GameBoard.getBoard());
    const element = document.querySelector(`[data-index="${index}"]`);
    GameBoard.setBoard(index, currentTurn);
    DisplayController.drawMark(index);
    element.removeEventListener("click", makeMove);

    // If win or draw end game otherwise change turn
    if (GameBoard.checkForWin(currentTurn))
      endGame(`${player_2.getName()} wins!`);
    else if (GameBoard.checkForDraw()) endGame("It's a draw!");
    else changeTurn();
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
      if (player_2.getIsAi()) makeAiMove();
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

  // Add event listeners
  startBtn.addEventListener("click", startGame);
  restartBtns.forEach((restartBtn) =>
    restartBtn.addEventListener("click", resetGame)
  );
  changeBtn.addEventListener("click", backToMainMenu);
  addListenerToCells();
})();
