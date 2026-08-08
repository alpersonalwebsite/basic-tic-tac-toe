# Basic Tic-Tac-Toe

[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

A playable tic-tac-toe board, written so that every state update is an immutable one,
with notes underneath on why the updates are written that way.

**NOTE:** bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Running it

```shell
yarn install --frozen-lockfile
yarn start
yarn test
yarn build
```

**Node 10 or 12.** This is `react-scripts` 3, which is webpack 4, and on Node 17 or
newer the build fails with `ERR_OSSL_EVP_UNSUPPORTED` because webpack 4 uses an MD4
hash that OpenSSL 3 removed. The dependencies are deliberately pinned to their 2019
versions, so either use an older Node or pass `NODE_OPTIONS=--openssl-legacy-provider`.

## The game

Two players alternate, `player1` is X and moves first, and the first line of three
wins. A won line is highlighted, a full board with no line is a draw, and the board
stops accepting moves once either happens.

| File | Role |
| --- | --- |
| `src/App.js` | the board, the turn logic, and win and draw detection |
| `src/immutability.js` | the examples below, as code |
| `src/App.test.js` | the game rules |
| `src/immutability.test.js` | the examples, asserted |

### It did not used to be a game

`selectCell` never recorded a move. Its body was an experiment that pushed the number
`9` onto the players array, and the actual work was three comments:

```js
    // update state

    // mark cell

    // set current player the other
```

There was no cell state at all, so there was nothing for a move to be written to, and
`Cell` rendered an empty `<div>` with nothing inside it and nothing to click. The
README's first line was `TODO: Overview`.

The board is nine `<button>` elements now, each labelled for screen readers and
disabled when it is not a legal move, rather than `<div>`s with click handlers.

### How the state updates work

The move is the whole lesson in one line:

```js
const cells = state.cells.map((cell, index) => (index === cellId ? mark : cell))
```

`.map` returns a new array and leaves `state.cells` alone. Writing
`state.cells[cellId] = mark` instead would be Attempt #1 below: React compares by
identity, so the array would still be the same object and the board would not
re-render.

Every update uses the functional form of `setState` and builds a new object.
`selectCell` returns `null` when the move is illegal, which is React's way of saying
"no state change", rather than setting state to what it already was.

## Immutability

The examples below are in `src/immutability.js` and asserted in
`src/immutability.test.js`, so `yarn test` checks that they still behave the way this
page says they do.

### Shallow copy

A spread copies one level. Everything nested below that level is still the same object,
so writing through the copy writes through to the original.

```javascript
const state = {
  isGame: false,
  players: {
    order: ['player1', 'player2'],
    player1: 1,
    player2: 2
  },
  currentPlayer: '',
  isWinner: false
};

console.log(`Original state: ${state.players.player1} `)


const newState1 = {...state};
newState1.players.player1 = 11;
// At this point state.players.player1 = 11

const newState2 = Object.assign({}, state);
newState1.players.player1 = 111;

console.log(`state is ${state.players.player1} 
newState1 is ${newState1.players.player1}
newState2 is ${newState2.players.player1}`)
```

Result:
```
Original state: 1 
state is 111 
newState1 is 111
newState2 is 111
```

### Deep copy with lodash

`_.cloneDeep` copies the whole tree, so nothing is shared. It is also the reason
`lodash` is a dependency of this project: it was declared in `package.json` with its
only use commented out in `App.js`, and it is used here.

```javascript
const state = {
  isGame: false,
  players: {
    order: ['player1', 'player2'],
    player1: 1,
    player2: 2
  },
  currentPlayer: '',
  isWinner: false
};

console.log(`Original state: ${state.players.player1} `)

const deepCloneOfState = _.cloneDeep(state);
deepCloneOfState.players.player1 = 111111;

console.log(`state: ${state.players.player1} 
deepCloneOfState: ${deepCloneOfState.players.player1}`)
```

Result:
```
Original state: 1 
state: 1 
deepCloneOfState: 111111
```

### Copying only as deep as you write

Three attempts at adding a hobby to `player1`, each going one level deeper than the
last. Starting from this state:
```javascript
const state = {
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
    },
  }
}
```

**Attempt #1...**

If we try...

```javascript
const newState1 = {
  ...state
}

console.log('Original', state.players.player1.hobbies)

newState1.players.player1.hobbies.push('new hobbie')


console.log('Original state', state.players.player1.hobbies)
console.log('newState1', newState1.players.player1.hobbies)
```

Result:
```
Original (3) ["3D printing", "Reading", "Gaming"]

Original state (4) ["3D printing", "Reading", "Gaming", "new hobbie"]
newState1 (4) ["3D printing", "Reading", "Gaming", "new hobbie"]
```

We are mutating the original object. So... Let's go deeper.

**Attempt #2**

If we try...

```javascript
const newState1 = {
  ...state,
  players: {
    ...state.players,
    player1: {
      ...state.players.player1
    }
  }
}

console.log('Original', state.players.player1.hobbies)

newState1.players.player1.hobbies.push('new hobbie')


console.log('Original state', state.players.player1.hobbies)
console.log('newState1', newState1.players.player1.hobbies)
```

Result:
```
Original (3) ["3D printing", "Reading", "Gaming"]
Original state (4) ["3D printing", "Reading", "Gaming", "new hobbie"]
newState1 (4) ["3D printing", "Reading", "Gaming", "new hobbie"]
```

Yes... We should expect to see the same, but... We can make changes for the key `player1` without altering the original source. Well, for the properties or keys holding `primitives values`; 

Example: 

```javascript
const newState1 = {
  ...state,
  players: {
    ...state.players,
    player1: {
      ...state.players.player1
    }
  }
}

console.log('Original state', state.players.player1.name, state.players.player2.name)

// This does NOT mutate
newState1.players.player1.name = 'Player 1';

// This will mutate state
newState1.players.player2.name = 'Player 2';


console.log('newState1 > player1', newState1.players.player1.name)
console.log('newState1 > player2', newState1.players.player2.name)

console.log('state', state.players.player1.name, state.players.player2.name)
```

Result:
```
state Cindy Paul
newState1 > player1 Player 1
newState1 > player2 Player 2
state Cindy Player 2
```

**Attempt #3**

If we try...

```javascript
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

console.log('Original', state.players.player1.hobbies)

newState1.players.player1.hobbies.push('new hobbie')


console.log('Original state', state.players.player1.hobbies)
console.log('newState1', newState1.players.player1.hobbies)
```

Result:
```
Original (3) ["3D printing", "Reading", "Gaming"]
Original state (3) ["3D printing", "Reading", "Gaming"]
newState1 (4) ["3D printing", "Reading", "Gaming", "new hobbie"]
```

Great!