import React, { useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main App component for the Tic Tac Toe game.
 */
function App() {
  // Tic Tac Toe game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  // PUBLIC_INTERFACE
  /**
   * Handle a move in the grid by updating square, switching turn,
   * and detecting win/draw state.
   */
  function handleSquareClick(idx) {
    if (squares[idx] || gameOver) return; // Ignore if occupied or finished
    const nextSquares = squares.slice();
    nextSquares[idx] = isXNext ? "X" : "O";
    setSquares(nextSquares);

    const outcome = calculateWinner(nextSquares);
    if (outcome) {
      setWinner(outcome);
      setGameOver(true);
    } else if (!nextSquares.includes(null)) {
      // No winner and no empty spots: Draw
      setWinner(null);
      setGameOver(true);
    } else {
      setIsXNext(!isXNext);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Reset all state to begin a new game.
   */
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
  }

  // Determine status to display
  let status;
  if (winner) {
    status = (
      <span>
        🎉 <strong>Player {winner} wins!</strong>
      </span>
    );
  } else if (gameOver) {
    status = (
      <span>
        <strong>It's a draw!</strong>
      </span>
    );
  } else {
    status = (
      <span>
        Next turn: <strong>{isXNext ? "X" : "O"}</strong>
      </span>
    );
  }

  return (
    <div className="App">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className="ttt-description">
          Two players take turns. Click on a square to place your mark.<br />
          First to get three in a row (horizontally, vertically, or diagonally) wins!
        </p>
      </header>
      <main className="ttt-main">
        <StatusBar status={status} />
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
        />
        <div className="ttt-controls">
          <button
            className="ttt-reset-btn"
            onClick={handleRestart}
            aria-label="Restart Game"
          >
            Restart Game
          </button>
        </div>
      </main>
      <footer className="ttt-footer">
        <span>
          <span role="img" aria-label="react">⚛️</span> Powered by React &middot; Minimal Light Theme
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Board component for displaying the grid.
 * @param {{ squares: string[], onSquareClick: (idx: number) => void }} props
 */
function Board({ squares, onSquareClick }) {
  // Render 3x3 grid
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {Array(3).fill(null).map((_, row) => (
        <div key={row} className="ttt-row" role="row">
          {Array(3).fill(null).map((_, col) => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                ariaLabel={`Row ${row + 1}, Column ${col + 1}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Square component for a cell in the grid.
 * @param {{ value: string, onClick: () => void, ariaLabel: string }} props
 */
function Square({ value, onClick, ariaLabel }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
/**
 * Status bar for showing turn/status message.
 * @param {{ status: React.ReactNode }} props
 */
function StatusBar({ status }) {
  return (
    <div className="ttt-status" aria-live="polite">
      {status}
    </div>
  );
}

// PUBLIC_INTERFACE
/**
 * Calculate the winner (X or O) if one exists based on board state.
 * @param {string[]} sqs
 * @returns {"X"|"O"|null}
 */
function calculateWinner(sqs) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (sqs[a] && sqs[a] === sqs[b] && sqs[a] === sqs[c]) {
      return sqs[a];
    }
  }
  return null;
}

export default App;
