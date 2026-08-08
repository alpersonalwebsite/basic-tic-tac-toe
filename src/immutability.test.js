// The README prints console output for each immutability example. These assert the
// behaviour those outputs are demonstrating, so the document cannot drift away from
// what the code does.
import {
  shallowCopyIsOneLevelDeep,
  deepCloneSharesNothing,
  attemptOneMutates,
  attemptTwoFixesPrimitivesOnly,
  attemptThreeIsClean
} from './immutability'

it('a spread copies one level, so nested writes are shared', () => {
  const r = shallowCopyIsOneLevelDeep()

  // All three names see 111, because all three point at the same players object.
  expect(r.state).toBe(111)
  expect(r.newState1).toBe(111)
  expect(r.newState2).toBe(111)
  expect(r.sharesPlayersObject).toBe(true)
})

it('cloneDeep shares nothing', () => {
  const r = deepCloneSharesNothing()

  expect(r.state).toBe(1)
  expect(r.deepCloneOfState).toBe(111111)
  expect(r.sharesPlayersObject).toBe(false)
})

it('attempt #1 mutates the original array', () => {
  const r = attemptOneMutates()

  expect(r.before).toHaveLength(3)
  expect(r.state).toHaveLength(4)
  expect(r.newState1).toHaveLength(4)
  expect(r.mutatedOriginal).toBe(true)
})

it('attempt #2 protects primitives on the copied branch, not the array', () => {
  const r = attemptTwoFixesPrimitivesOnly()

  // Still mutates hobbies: the array itself was never copied.
  expect(r.stillMutatesHobbies).toBe(true)
  expect(r.stateHobbies).toHaveLength(4)

  // player1 was copied, so its name is safe. player2 was not, so writing to it
  // reaches through to the original. This is the asymmetry the README calls out.
  expect(r.newStateNames).toEqual(['Player 1', 'Player 2'])
  expect(r.stateNames).toEqual(['Cindy', 'Player 2'])
})

it('attempt #3 copies every level it writes to', () => {
  const r = attemptThreeIsClean()

  expect(r.before).toHaveLength(3)
  expect(r.state).toHaveLength(3)
  expect(r.newState1).toHaveLength(4)
  expect(r.mutatedOriginal).toBe(false)
})
