import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './App.css'

// The eight ways to win, as cell indexes.
export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
]

export const findWinningLine = (cells) =>
  LINES.find(([a, b, c]) => cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) || null

const initialState = () => ({
  isGame: false,
  // Nine cells, each null or a mark. This is the piece of state the original never
  // had: selectCell was left with `// mark cell` and `// update state` as comments,
  // so no move was ever recorded anywhere.
  cells: Array(9).fill(null),
  players: {
    order: ['player1', 'player2'],
    player1: 'X',
    player2: 'O'
  },
  currentPlayer: '',
  winner: null,
  winningLine: null,
  isDraw: false
})

function App () {
  return (
    <div className="App">
      <h1>Tic-Tac-Toe</h1>
      <Board />
    </div>
  )
}

class Board extends Component {
  state = initialState()

  startGame = () => {
    // A fresh object rather than editing the current one. Everything below follows the
    // same rule, which is what the immutability notes in the README are about.
    this.setState((state) => ({
      ...initialState(),
      isGame: true,
      currentPlayer: state.players.order[0]
    }))
  }

  resetGame = () => {
    this.setState(initialState())
  }

  selectCell = (cellId) => {
    this.setState((state) => {
      if (!state.isGame || state.winner || state.isDraw || state.cells[cellId]) {
        return null
      }

      const mark = state.players[state.currentPlayer]

      // .map returns a new array; state.cells is untouched. The README's Attempt #3 is
      // the same idea: copy the level you are about to write to.
      //
      // Being precise about why the alternative is wrong, because the obvious reason is
      // not the real one. Writing state.cells[cellId] = mark and returning the same
      // array still re-renders: setState schedules an update whenever its updater
      // returns an object, and Board is a plain Component, so nothing compares
      // references. Measured on exactly this shape: renders went 1 to 2 and the cell
      // showed its mark. The mutation appears to work.
      //
      // It is wrong because it edits state that has already been handed out, and it
      // stops working the moment anything does compare references: a PureComponent, a
      // React.memo child, shouldComponentUpdate, or any memoised selector above it.
      // That is a bug that arrives later, in a different file, for no visible reason.
      const cells = state.cells.map((cell, index) => (index === cellId ? mark : cell))

      const winningLine = findWinningLine(cells)
      const currentIndex = state.players.order.indexOf(state.currentPlayer)
      const nextPlayer = state.players.order[(currentIndex + 1) % state.players.order.length]

      return {
        cells,
        winner: winningLine ? state.currentPlayer : null,
        winningLine,
        isDraw: !winningLine && cells.every(Boolean),
        currentPlayer: winningLine ? state.currentPlayer : nextPlayer
      }
    })
  }

  status () {
    const { isGame, winner, isDraw, currentPlayer, players } = this.state

    if (!isGame) return 'Press Start Game'
    if (winner) return `${winner} (${players[winner]}) wins`
    if (isDraw) return 'Draw'
    return `${currentPlayer} (${players[currentPlayer]}) to play`
  }

  render () {
    const { cells, isGame, winner, isDraw, winningLine } = this.state
    const finished = Boolean(winner) || isDraw

    return (
      <>
        <div className="board">
          {[0, 3, 6].map((rowStart) => (
            <div className="row" key={rowStart}>
              {[0, 1, 2].map((offset) => {
                const index = rowStart + offset
                return (
                  <Cell
                    key={index}
                    index={index}
                    value={cells[index]}
                    highlight={Boolean(winningLine && winningLine.includes(index))}
                    disabled={!isGame || finished || Boolean(cells[index])}
                    onSelectCell={this.selectCell}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="controls">
          <button onClick={this.startGame} disabled={isGame && !finished}>
            {isGame && !finished ? 'Playing...' : 'Start Game!'}
          </button>
          <button onClick={this.resetGame} disabled={!isGame}>Reset</button>
          <span className="status" role="status">{this.status()}</span>
        </div>
      </>
    )
  }
}

const Cell = ({ index, value, highlight, disabled, onSelectCell }) => (
  <button
    type="button"
    className={`cell${highlight ? ' cell-winning' : ''}`}
    aria-label={`Cell ${index + 1}${value ? `, ${value}` : ', empty'}`}
    disabled={disabled}
    onClick={() => onSelectCell(index)}
  >
    {value}
  </button>
)

Cell.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
  highlight: PropTypes.bool,
  disabled: PropTypes.bool,
  onSelectCell: PropTypes.func.isRequired
}

export default App
