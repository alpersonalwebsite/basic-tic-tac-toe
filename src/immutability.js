// The examples from the README, as code that runs.
//
// The README walks through copying nested state and shows the console output for each
// attempt. Printed output in a document is a claim, and claims drift. Every example is
// a function here, and immutability.test.js asserts the behaviour each one is
// demonstrating, so `yarn test` checks that the README still tells the truth.
//
// This is also why lodash is a dependency: `_.cloneDeep` is the third example. It was
// declared in package.json with its only use commented out in App.js.
import cloneDeep from 'lodash/cloneDeep'

export const makePlayerState = () => ({
  isGame: false,
  players: {
    order: ['player1', 'player2'],
    player1: 1,
    player2: 2
  },
  currentPlayer: '',
  isWinner: false
})

export const makeHobbyState = () => ({
  players: {
    player1: {
      name: 'Cindy',
      hobbies: ['3D printing', 'Reading', 'Gaming'],
      age: 30
    },
    player2: {
      name: 'Paul',
      hobbies: ['Painting', 'Gaming', 'Coloring'],
      age: 99
    }
  }
})

// A spread copies one level. `players` is the same object in both, so writing through
// either name changes the other.
export const shallowCopyIsOneLevelDeep = () => {
  const state = makePlayerState()

  const newState1 = { ...state }
  newState1.players.player1 = 11

  // Written through newState2, so this shows Object.assign sharing `players` too. The
  // README's original snippet assigned to newState1 twice here, which still ends with
  // every name reading 111 but never actually exercises the Object.assign copy.
  const newState2 = Object.assign({}, state)
  newState2.players.player1 = 111

  return {
    state: state.players.player1,
    newState1: newState1.players.player1,
    newState2: newState2.players.player1,
    sharesPlayersObject: state.players === newState1.players,
    objectAssignAlsoShares: state.players === newState2.players
  }
}

// cloneDeep copies the whole tree, so nothing is shared.
export const deepCloneSharesNothing = () => {
  const state = makePlayerState()

  const deepCloneOfState = cloneDeep(state)
  deepCloneOfState.players.player1 = 111111

  return {
    state: state.players.player1,
    deepCloneOfState: deepCloneOfState.players.player1,
    sharesPlayersObject: state.players === deepCloneOfState.players
  }
}

// Attempt #1: spread the top level only. hobbies is still the original array.
export const attemptOneMutates = () => {
  const state = makeHobbyState()
  const before = [...state.players.player1.hobbies]

  const newState1 = { ...state }
  newState1.players.player1.hobbies.push('new hobbie')

  return {
    before,
    state: state.players.player1.hobbies,
    newState1: newState1.players.player1.hobbies,
    mutatedOriginal: state.players.player1.hobbies.length !== before.length
  }
}

// Attempt #2: spread down to player1. The array inside it is still shared, so pushing
// still mutates. What this DOES buy you is the primitives on player1: assigning
// newState1.players.player1.name leaves the original alone, while player2, which was
// never copied, is still shared.
export const attemptTwoFixesPrimitivesOnly = () => {
  const state = makeHobbyState()
  const before = [...state.players.player1.hobbies]

  const newState1 = {
    ...state,
    players: {
      ...state.players,
      player1: { ...state.players.player1 }
    }
  }

  newState1.players.player1.hobbies.push('new hobbie')
  newState1.players.player1.name = 'Player 1'
  newState1.players.player2.name = 'Player 2'

  return {
    hobbiesBefore: before,
    stateHobbies: state.players.player1.hobbies,
    stateNames: [state.players.player1.name, state.players.player2.name],
    newStateNames: [newState1.players.player1.name, newState1.players.player2.name],
    stillMutatesHobbies: state.players.player1.hobbies.length !== before.length
  }
}

// Attempt #3: copy every level you intend to write to, including the array.
export const attemptThreeIsClean = () => {
  const state = makeHobbyState()
  const before = [...state.players.player1.hobbies]

  const newState1 = {
    ...state,
    players: {
      ...state.players,
      player1: {
        ...state.players.player1,
        hobbies: [...state.players.player1.hobbies]
      }
    }
  }

  newState1.players.player1.hobbies.push('new hobbie')

  return {
    before,
    state: state.players.player1.hobbies,
    newState1: newState1.players.player1.hobbies,
    mutatedOriginal: state.players.player1.hobbies.length !== before.length
  }
}
