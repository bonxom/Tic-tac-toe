import { useEffect, useState } from "react";
import Board from "./Board";

let step = 0;

const minimax = (board, depth, isMaximizing) =>{
    step += 1;
    const winner = calculateWinner(board);
    if (winner === "X") { //human win
        return depth - 10;
    }
    else if (winner === "O"){//AI win
        return 10 - depth;
    }
    else if (winner === "Draw"){
        return 0;
    }

    if (isMaximizing){//AI turn
        let maxVal = -Infinity;
        for (let i = 0; i < board.length; i++){
            if (!board[i]){
                const newBoard = [...board];
                newBoard[i] = "O";
                const val = minimax(newBoard, depth + 1, false); //next turn is Human -> try to minimize
                maxVal = Math.max(maxVal, val);
            }
        }
        return maxVal;
    }
    else { //human turn
        let minVal = Infinity;
        for (let i = 0; i < board.length; i++){
            if (!board[i]){
                const newBoard = [...board];
                newBoard[i] = "X";
                const val = minimax(newBoard, depth + 1, true); //next turn is AI
                minVal = Math.min(minVal, val);
            }
        }
        return minVal;
    }
}

const getBestMove = (board) => {
    let best = -Infinity;
    let move = null;
    for (let i = 0; i < board.length; i++){
        if (!board[i]){ //if AI choose this move
            const newBoard = [...board];
            newBoard[i] = "O";
            const val = minimax(newBoard, 0, false);
            if (best < val){
                best = val;
                move = i;
            }
        }
    }
    return move;
}

const calculateWinner = (board) => {
    const winnerSet = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    for (const [idx1, idx2, idx3] of winnerSet){
        if (board[idx1] && board[idx1] === board[idx2] && board[idx2] === board[idx3]){
            return board[idx1];
        }
    }

    if (!board.includes(null)){
        return 'Draw';
    }
    return null;
}

function Game(){
    const [board, setBoard] = useState(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [winner, setWinner] = useState(null);

    useEffect( () => {
        const win = calculateWinner(board);
        setWinner(win);
        console.log(step);
    }, [board]);

    useEffect( () => {
        if (!xIsNext){//AI turn
            setXIsNext(!xIsNext);
            let idx = getBestMove(board);
            board[idx] = "O";
            console.log(board);
            const tmp = [...board];
            setBoard(tmp);
        }
    }, [xIsNext])

    const handleClick = (index) => {
        if (board[index] !== null || winner) return;
        board[index] = "X";
        setXIsNext(!xIsNext);
        console.log(board);
        // setBoard(board); //same reference -> not set
        const tmp = [...board] //copy board
        setBoard(tmp);
    }

    return(
        <div>
            <h2>{winner ? winner : "N/A"}</h2>
            <Board board={board} handleClick={handleClick}/>

        </div>
    );
}

export default Game;