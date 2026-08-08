import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import App, { findWinningLine, LINES } from './App'

const mount = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  act(() => {
    ReactDOM.render(<App />, div)
  })

  const cells = () => Array.from(div.querySelectorAll('.cell'))
  const buttonByText = (text) =>
    Array.from(div.querySelectorAll('.controls button')).find((b) =>
      b.textContent.includes(text)
    )

  return {
    div,
    cells,
    status: () => div.querySelector('.status').textContent,
    start: () => act(() => buttonByText('Start Game!').click()),
    reset: () => act(() => buttonByText('Reset').click()),
    play: (index) => act(() => cells()[index].click()),
    marks: () => cells().map((c) => c.textContent),
    unmount: () => {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

describe('findWinningLine', () => {
  it('finds every line', () => {
    LINES.forEach((line) => {
      const cells = Array(9).fill(null)
      line.forEach((i) => { cells[i] = 'X' })
      expect(findWinningLine(cells)).toEqual(line)
    })
  })

  it('does not treat empty cells as a line', () => {
    expect(findWinningLine(Array(9).fill(null))).toBeNull()
  })

  it('does not match a mixed line', () => {
    const cells = Array(9).fill(null)
    cells[0] = 'X'; cells[1] = 'O'; cells[2] = 'X'
    expect(findWinningLine(cells)).toBeNull()
  })
})

it('renders nine empty cells and does not start until asked', () => {
  const h = mount()
  expect(h.cells()).toHaveLength(9)
  expect(h.status()).toBe('Press Start Game')

  // Clicking before the game starts does nothing. The board is nine buttons, and
  // before Start they are all disabled.
  h.play(0)
  expect(h.marks().join('')).toBe('')

  h.unmount()
})

it('alternates players and records every move', () => {
  const h = mount()
  h.start()
  expect(h.status()).toBe('player1 (X) to play')

  h.play(0)
  expect(h.marks()[0]).toBe('X')
  expect(h.status()).toBe('player2 (O) to play')

  h.play(4)
  expect(h.marks()[4]).toBe('O')
  expect(h.status()).toBe('player1 (X) to play')

  h.unmount()
})

it('ignores a click on a cell that is already taken', () => {
  const h = mount()
  h.start()

  h.play(0)
  const after = h.marks().join('')
  h.play(0)

  expect(h.marks().join('')).toBe(after)
  expect(h.status()).toBe('player2 (O) to play')

  h.unmount()
})

it('declares a winner and stops accepting moves', () => {
  const h = mount()
  h.start()

  // X takes the top row.
  h.play(0); h.play(3)
  h.play(1); h.play(4)
  h.play(2)

  expect(h.status()).toBe('player1 (X) wins')
  expect(h.div.querySelectorAll('.cell-winning')).toHaveLength(3)

  const settled = h.marks().join('')
  h.play(8)
  expect(h.marks().join('')).toBe(settled)

  h.unmount()
})

it('declares a draw when the board fills with no line', () => {
  const h = mount()
  h.start()

  // X O X / X O O / O X X leaves nobody with a line.
  ;[0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((i) => h.play(i))

  expect(h.marks().every(Boolean)).toBe(true)
  expect(h.status()).toBe('Draw')

  h.unmount()
})

it('reset clears the board', () => {
  const h = mount()
  h.start()
  h.play(0)
  h.play(4)
  h.reset()

  expect(h.marks().join('')).toBe('')
  expect(h.status()).toBe('Press Start Game')

  h.unmount()
})
