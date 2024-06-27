import React from 'react'
import {useState} from "react"

function Square({value, onSquareClick}){//the individual boxes in the game table
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}//it takes props from the board component.



const Board = ({xIsnext, squares, onPlay}) => {//the component name they used was Board instead of App//it takes props from the game itself since we want the game to control the state.

  const winner = calculateWInner(squares);
  let status;
  if(winner){//if there is a winner, tell us, otherwise tell them who is next
    status = "Winner: " + winner;
  }else{
    status = "Next player: " + (xIsnext ? "X" : "O");
  }

  function handleClick(i){
    if(squares[i] || calculateWInner(squares)){//checks if a box is already filled or checks if there is a possibility that someone has won after every re-render
      return;
    }

    const nextSquares = squares.slice();//creates a shallow copy of the actual board so as to ensure immutability and we can make changes easily.
    if(xIsnext){
      nextSquares[i] = "X";
    }else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);//the logic is controled by the game component. but it basically  takes the shallow copy created as an input arguement and is processed in the game component itself
  }

  function calculateWInner(squares){

    const lines = [//this checks for the possible patterns that shows that someone has won.
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,5,6]
    ];

    for(let i =0; i < lines.length; i++){//loop through all the patterns
      const [a,b,c] = lines[i];//initialize a condition so that we can check all the patterns and make sure they return the same string, ie X or O
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    return null;//return null if no one has won yet.
  }
  
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
        {/* we used an arrow function  so as to not get stuck in an infinite loop of rerendering */}
        <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
      </div>      
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
      </div>
    </>
  );

}

const App = () => {
  const [xIsnext, setXisNext] = useState(true);//this is what makes sure we can move to the next player after each player's move
  const [ history, setHistory ] = useState([Array(9).fill(null)]);//we want to keep track of how the board looks like after eevery move, so we have an array that will contain many arrays later.
  const [ currentMove, setCurrentMove ] = useState(0);
  const currentSquares = history[currentMove];//the most recent copy of the board with all the made moves

  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);//keeps the history array intact and appends the new array or copy of the board after every move made
    setCurrentMove(nextHistory.length - 1);
    setXisNext(!xIsnext);//toggles to make each player have a turn
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
    // setXisNext(nextMove % 2 === 0);

  }
  const moves = history.map((squares, move) => {
    let description;
    if(move > 0){
      description = `move ${move} saved data`;
    }else{
      description = "game start's saved data";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
  <div className='game'>
    <div className='game-board'>
      <Board xIsnext={xIsnext} squares={currentSquares} onPlay={handlePlay}/>
    </div>
    <div className='game-info'>
      <ol>{moves}</ol>
    </div>
  </div>
  );
}

export default App
