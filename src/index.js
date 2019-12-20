import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// https://reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial
// https://codepen.io/gaearon/pen/aWWQOG?editors=0010
// https://reactjs.org/tutorial/tutorial.html#completing-the-game
// https://reactjs.org/tutorial/tutorial.html#why-immutability-is-important
// https://reactjs.org/tutorial/tutorial.html#function-components
// https://reactjs.org/tutorial/tutorial.html#adding-time-travel
// https://reactjs.org/tutorial/tutorial.html#showing-the-past-moves
// https://codepen.io/gaearon/pen/gWWZgR?editors=0010

class Board extends React.Component {

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }
  
}

  function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
      };
    }

    squareChar = (xIsNext) => xIsNext ? 'X' : 'O';

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length-1];
      const squares = current.squares.slice();
      if (squares[i] || this.calculateWinner(squares)) {
        return;
      }
      squares[i] = this.squareChar(this.state.xIsNext);
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    calculateWinner(squares) {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      for (let i=0; i<lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }

      return null;
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = this.calculateWinner(current.squares);

      const moves = history.map((step, index) => {
        const desc = index ?
          'Go to move #' + index :
          'Go to game start';
        return (
          <li key={index}>
            <button onClick={() => this.jumpTo(index)}>{desc}</button>
          </li>
        );
      });

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + this.squareChar(this.state.xIsNext);
        if (this.state.stepNumber >= 9) {
          status = 'Game is a draw';
        }
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares} 
              onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  