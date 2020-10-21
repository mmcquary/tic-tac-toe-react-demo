import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//------------------------------------------------------------------------------
// Square
//------------------------------------------------------------------------------
function Square(props) {
  let highlightStyle = '';
  //console.log(props);
  if (props.highlightCells.indexOf(props.squareID) > -1) {
    highlightStyle = 'square-highlight';
  }
  return (
    <button
      className={`square ${highlightStyle}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}
//------------------------------------------------------------------------------
// Board
//------------------------------------------------------------------------------
class Board extends React.Component {
//------------------------------------------------------------------------------
  renderSquare(i) {
    //console.log(this.props);
    return (
      <Square
        key = {i}
        squareID = {i}
        value = {this.props.squares[i]}
        highlightCells = {this.props.highlightCells}
        onClick = {() => this.props.onClick(i)}
      />
    );
  }
//------------------------------------------------------------------------------
  render() {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const the_row = [];
      for (let col = 0; col < 3; col++) {
        the_row.push(this.renderSquare(row * 3 + col));
      }
      board.push(<div className="board-row" key={row}>{the_row}</div>);
    };

    return (
      <div>
        <div className="status">Tic-Tac-Toe</div>
        {board}
      </div>
    );
  }
//------------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
// Game
//------------------------------------------------------------------------------
class Game extends React.Component {
//------------------------------------------------------------------------------
  constructor(props) {
    super(props);
    this.state = {
      turnNumber: 0,
      xIsNext: true,
      history: [{
        squares: Array(9).fill(null),
        squareClicked: null,
        highlightCells: [],
      }],
      ascending: false,
    }
  }
//------------------------------------------------------------------------------
  orderButton() {
    let order = 'Descending';
    if (this.state.ascending) order = 'Ascending';
    return (
      <button
        className=""
        onClick={ () =>
          this.setState({
            ascending: !this.state.ascending
          })
        }
      >
        {order}
      </button>
    );
  }
//------------------------------------------------------------------------------
  handleSquareClick(i) {
    // Set the history to the entire state history
    const history = this.state.history.slice(0, this.state.turnNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // Return if a winner already exists or if the square is already occupied
    if (calculateWinner(squares).length || squares[i]) {
      return;
    }
    // Here is where the X or O is placed in the new history
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const winner = calculateWinner(squares);

    this.setState({
      turnNumber: history.length,
      xIsNext: !this.state.xIsNext,
      history: history.concat([{
        squares: squares,
        squareClicked: i,
        highlightCells: winner,
      }]),
    });
  }
//------------------------------------------------------------------------------
  handleHistoryClick(turnNumber) {
    this.setState({
      turnNumber: turnNumber,
      xIsNext: (turnNumber % 2) === 0,
    })
  }
//------------------------------------------------------------------------------
  render() {
    const history = this.state.history;
    const current = history[this.state.turnNumber];
    const winner = calculateWinner(current.squares);
    
    // History
    const moves = history.map( (step, index) => {
      //console.log(this.state);
      const desc = index ? 'Go to move #' + index : 'Go to game start';
      let boldCurrent;
      if (index === this.state.turnNumber) {
        boldCurrent = 'button-bold';
      }
      let rowCol;
      if (index) {
        const row = parseInt(step.squareClicked / 3) + 1;
        const col = parseInt(step.squareClicked % 3) + 1;
        rowCol = '( Row ' + row + ' Col ' + col + ' )';
      }
      return (
        <li key={index}>
          <button
            className={boldCurrent}
            onClick={() => this.handleHistoryClick(index)}
          >{desc}</button> {rowCol}
        </li>
      );
    });
    if (this.state.ascending) moves.reverse();

    // Game status
    let status;
    if (winner.length) {
      status = 'Winner: '+ current.squares[winner[0]];
    } else if ( isGameTied(current.squares) ) {
      status = 'Tied Game';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const orderButton = this.orderButton();
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            highlightCells = {current.highlightCells}
            onClick={(i) => this.handleSquareClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{orderButton}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
//------------------------------------------------------------------------------
}
//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
//------------------------------------------------------------------------------
// Helper functions
//------------------------------------------------------------------------------
function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return [];
}
//------------------------------------------------------------------------------
function isGameTied(squares) {
  for (let i = 0; i < 10; i++) {
    if (squares[i] === null) return false;
  }
  return true;
}
//------------------------------------------------------------------------------