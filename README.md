# Basic Tic-Tac-Toe

[![Greenkeeper badge](https://badges.greenkeeper.io/alpersonalwebsite/basic-tic-tac-toe.svg)](https://greenkeeper.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

TODO: Overview

**NOTE:** This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



Immutability

Shallow copy

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

TODO: Performance deep

Deep copy (or clone) with lodash

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

DOING:

Example of adding a hobby to the hobbies's array of player1

Having the following object (state)...
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