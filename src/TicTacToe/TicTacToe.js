import { useCallback, useEffect, useRef, useState } from "react";
import p5 from "p5";

function TicTacToe() {
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

  useEffect(() => {
    const cellSize = 100; // Each cell will be 100x100 pixels
    const canvasSize = cellSize * 3;

    // Define the p5 sketch
    const sketch = (p) => {
      p.setup = () => {
        // Setup canvas size
        p.createCanvas(canvasSize, canvasSize);
        p.strokeWeight(4); // Set line thickness for the grid
        p.background(144); // Set an initial background color

        // Check for a winner right after setting the board
        let result = checkWinner();

        if (result != null) {
          setWinnerAnnouncer(`${result} is winner`);
          setStopPlaying(true);
        } else {
          setWinnerAnnouncer("Still Playing");
        }
      };

      p.draw = () => {
        //Drawing the dashboard
        for (let i = 1; i < 3; i++) {
          p.line(i * cellSize, 0, i * cellSize, canvasSize);
          p.line(0, cellSize * i, canvasSize, cellSize * i);
        }
        // Display each cell content
        board.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const x = colIndex * cellSize + cellSize / 2;
            const y = rowIndex * cellSize + cellSize / 2;
            p.textSize(32);
            p.textAlign(p.CENTER, p.CENTER);

            if (cell === "O") {
              p.ellipse(x, y, cellSize / 2);
            } else if (cell === "X") {
              p.line(x - 25, y - 25, x + 25, y + 25); // Draw "X" with two lines
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
            const newBoard = board.map(
              (r, i) =>
                r.map((c, j) => (i === row && j === col ? currentPlayer : c)) //Copy and replace the new board and add the changes
            );
            setBoard(newBoard);

            console.log(board);
            console.log(newBoard);

            setCurrentPlayer(currentPlayer === "O" ? "X" : "O"); // Toggle player
          }
        };
      };
    };

    // Create the p5 instance and attach it to the ref
    const p5Instance = new p5(sketch, sketchRef.current);

    // Cleanup the p5 instance on component unmount
    return () => {
      p5Instance.remove();
    };
  }, [board, checkWinner, currentPlayer, setCurrentPlayer, stopPlaying]);
  return (
    <div style={{ textAlign: "center" }}>
      <h1>Tic Tac Toe</h1>
      <div>
        <div>
          <button
            onClick={() => {
              setCurrentPlayer("X");
              setBoard([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ]);
              setStopPlaying(false);
            }}
          >
            X start first
          </button>
          <button
            onClick={() => {
              setCurrentPlayer("O");
              setBoard([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ]);
              setStopPlaying(false);
            }}
          >
            O start first
          </button>
          <button
            onClick={() => {
              setBoard([
                ["", "", ""],
                ["", "", ""],
                ["", "", ""],
              ]);
              setStopPlaying(false);
            }}
          >
            Play again
          </button>
          <p>{winnerAnnouncer}</p>
        </div>
        <div ref={sketchRef}></div>
      </div>
    </div>
  );
}

export default TicTacToe;
