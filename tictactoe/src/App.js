import { useState } from "react"

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    const nextSquares = squares.slice()
    if (xIsNext) {
      nextSquares[i] = 'X'
    } 
    else {
      nextSquares[i] = 'O'
    }
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Challenge #2
  const boardLength = 3
  const boardRows = [...Array(boardLength).keys()].map((row) => {
    const boardSquares = [...Array(boardLength).keys()].map((col) => {
      const  i = 3 * row + col;
      return (
        <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        />
      )
    })

    return (
      <div key={row} className="board-row">{boardSquares}</div>
    )
  })

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove]
  const [ascending, setAscending] = useState(true);
  const displayOrder = ascending ? "Ascending" : "Descending"

  // Challenge #3
  function toggleDisplayOrder() {
    setAscending(!ascending);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  // Challenge #1
  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'You are on move #' + move
    }
    else {
      description = 'Game Start'
    }
    return (
      <li key={move}>
          {move === currentMove ? (
              <>You are at move #{move}</>
          ) : (
              <button onClick={() => jumpTo(move)}>{description}</button>
          )}
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <div className="center">
          <button onClick={toggleDisplayOrder}>
            {displayOrder}
          </button>
        </div>
        <ol>
          {ascending ? moves : moves.slice().reverse()}
        </ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const i of lines) {
    const [a, b, c] = i;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}