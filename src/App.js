import React, { Component } from 'react';
//import { cloneDeep } from 'lodash';
import './App.css';

function App() {
  console.log('App')
  return (
    <div className="App">
      Hi
      <Board />
    </div>
  );
}

class Board extends Component {

  constructor(props) {
    super(props)

    this.startGame.bind(this);

    this.state = {
      isGame: false,
      players: {
        order: ['player2', 'player1'],
        player1: 1,
        player2: 2
      },
      currentPlayer: '',
      isWinner: false
    }
  }

  // Init game and set player that starts the game
  startGame = () => {
    this.setState({
      isGame: !this.state.isGame,
      currentPlayer: this.state.players.order[0]
    })
  }


  selectCell = (cellId) => {
    // get current player
    const { currentPlayer } = this.state

    /*
const newOrder = this.state.players.order
newOrder.push(9)
console.log(newOrder)
*/

const newState1 = {
  ...this.state,
  players: {
    ...this.state.players,
    order: [...this.state.players.order]
  }
}

newState1.players.order.push(9)

console.log(newState1.players)

    this.setState({
      players: 
      {
        order: newState1.players.order
      }
    })


    // update state

    // mark cell

    // set current player the other
  }
 


  render() {
    console.log('Board')
    return (
      <>
        <div className="board">
          <div className="row">
            <Cell onSelectCell={this.selectCell.bind(this, 0)}></Cell>
            <Cell onSelectCell={this.selectCell.bind(this, 1)}></Cell>
            <Cell onSelectCell={this.selectCell.bind(this, 2)}></Cell>
          </div>
          <div className="row">
          <Cell onSelectCell={this.selectCell.bind(this, 3)}></Cell>
            <Cell onSelectCell={this.selectCell.bind(this, 4)}></Cell>
            <Cell onSelectCell={this.selectCell.bind(this, 5)}></Cell>
          </div>
          <div className="row">
          <Cell onSelectCell={this.selectCell.bind(this, 6)}></Cell>
            <Cell onSelectCell={this.selectCell.bind(this, 7)}></Cell>
            <Cell onSelectCell={this.selectCell.bind(this, 8)}></Cell>
          </div>
        </div>
        <div>
          <button onClick={this.startGame} disabled={this.state.isGame}>
            { this.state.isGame ? "Playing..." : "Start Game!" }
          </button>
          <span>
            {this.state.currentPlayer}
          </span>
        </div>
      </>
    )
  }
}

const Cell = props => {
  console.log('Cell')
  return (
    <div onClick={props.onSelectCell}></div>
  )
}

export default App;
