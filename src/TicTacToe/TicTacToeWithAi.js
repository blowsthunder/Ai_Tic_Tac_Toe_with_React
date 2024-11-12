import { useCallback, useEffect, useRef, useState } from "react";
import p5 from "p5";

function TicTacToeWithAi() {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const sketchRef = useRef();
  const [currentPlayer, setCurrentPlayer] = useState("O"); // 'O' for player, 'X' for AI
  const [winnerAnnouncer, setWinnerAnnouncer] = useState("Still Playing");
  const [stopPlaying, setStopPlaying] = useState(false);

  const checkWinner = useCallback(() => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return board[i][0];
      }
    }

    // Check columns
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j] &&
        board[0][j] === board[1][j] &&
        board[1][j] === board[2][j]
      ) {
        return board[0][j];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }
    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }

    // Check for tie
    if (board.every((row) => row.every((cell) => cell !== ""))) {
      return "tie";
    }

    // No winner yet
    return null;
  }, [board]);

  // Minimax algorithm implementation wrapped in useCallback
  const minmax = useCallback(
    (newBoard, isMaximizing) => {
      const result = checkWinner();
      if (result === "X") return 10; // AI wins
      if (result === "O") return -10; // Player wins
      if (result === "tie") return 0; // Tie

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (newBoard[i][j] === "") {
              newBoard[i][j] = "X"; // AI move
              let score = minmax(newBoard, false);
              newBoard[i][j] = ""; // Undo move
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (newBoard[i][j] === "") {
              newBoard[i][j] = "O"; // Player move
              let score = minmax(newBoard, true);
              newBoard[i][j] = ""; // Undo move
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    },
    [checkWinner] // Add any dependencies needed here
  );

  // Function to pick the best move for AI
  const NextMove = useCallback(() => {
    if (currentPlayer === "X" && !stopPlaying) {
      let bestScore = -Infinity;
      let move;

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i][j] === "") {
            board[i][j] = "X"; // AI move
            let score = minmax(board, false);
            board[i][j] = ""; // Undo move

            if (score > bestScore) {
              bestScore = score;
              move = { i, j };
            }
          }
        }
      }

      if (move) {
        const newBoard = board.map((r, x) =>
          r.map((c, y) => (x === move.i && y === move.j ? "X" : c))
        );
        setBoard(newBoard);
        setCurrentPlayer("O");
      }
    }
  }, [board, currentPlayer, stopPlaying, minmax]);

  useEffect(() => {
    const cellSize = 100;
    const canvasSize = cellSize * 3;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(canvasSize, canvasSize);
        p.strokeWeight(4);
        p.background(144);

        let result = checkWinner();
        if (result != null) {
          setWinnerAnnouncer(
            result === "tie" ? "It's a tie!" : `${result} is the winner`
          );
          setStopPlaying(true);
        } else {
          setWinnerAnnouncer("Still Playing");
        }
      };

      p.draw = () => {
        for (let i = 1; i < 3; i++) {
          p.line(i * cellSize, 0, i * cellSize, canvasSize);
          p.line(0, cellSize * i, canvasSize, cellSize * i);
        }

        board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const x = colIndex * cellSize + cellSize / 2;
            const y = rowIndex * cellSize + cellSize / 2;
            p.textSize(32);
            p.textAlign(p.CENTER, p.CENTER);

            if (cell === "O") {
              p.ellipse(x, y, cellSize / 2);
            } else if (cell === "X") {
              p.line(x - 25, y - 25, x + 25, y + 25);
              p.line(x + 25, y - 25, x - 25, y + 25);
            }
          });
        });

        p.mousePressed = () => {
          const col = Math.floor(p.mouseX / cellSize);
          const row = Math.floor(p.mouseY / cellSize);
          if (
            col >= 0 &&
            col < 3 &&
            row >= 0 &&
            row < 3 &&
            board[row][col] === "" &&
            !stopPlaying
          ) {
            const newBoard = board.map((r, i) =>
              r.map((c, j) => (i === row && j === col ? currentPlayer : c))
            );
            setBoard(newBoard);
            setCurrentPlayer(currentPlayer === "O" ? "X" : "O");
          }
        };
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    if (currentPlayer === "X" && !stopPlaying) {
      NextMove();
    }

    return () => {
      p5Instance.remove();
    };
  }, [board, checkWinner, currentPlayer, stopPlaying, NextMove]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Tic Tac Toe With Ai</h1>
      <div>
        <button
          onClick={() => {
            setBoard([
              ["", "", ""],
              ["", "", ""],
              ["", "", ""],
            ]);
            setCurrentPlayer("O");
            setStopPlaying(false);
            setWinnerAnnouncer("Still Playing");
          }}
        >
          Play again
        </button>
        <p>{winnerAnnouncer}</p>
      </div>
      <div ref={sketchRef}></div>
    </div>
  );
}

export default TicTacToeWithAi;
