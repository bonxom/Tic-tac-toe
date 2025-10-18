import { useEffect, useState, useRef } from "react";
import Board from "./Board";

// let step = 0;

// const minimax = (board, depth, alpha, beta, isMaximizing) =>{
//     step += 1;
//     const winner = calculateWinner(board);
//     if (winner === "X") { //human win
//         return depth - 10;
//     }
//     else if (winner === "O"){//AI win
//         return 10 - depth;
//     }
//     else if (winner === "Draw"){
//         return 0;
//     }

//     if (isMaximizing){//AI turn
//         let maxVal = -Infinity;
//         for (let i = 0; i < board.length; i++){
//             if (!board[i]){
//                 const newBoard = [...board];
//                 newBoard[i] = "O";
//                 const val = minimax(newBoard, depth + 1, alpha, beta, false); //next turn is Human -> try to minimize
//                 maxVal = Math.max(maxVal, val); 
//                 alpha = Math.max(alpha, val);
//                 if (beta <= alpha) break;
//             }
//         }
//         return maxVal;
//     }
//     else { //human turn
//         let minVal = Infinity;
//         for (let i = 0; i < board.length; i++){
//             if (!board[i]){
//                 const newBoard = [...board];
//                 newBoard[i] = "X";
//                 const val = minimax(newBoard, depth + 1, alpha, beta, true); //next turn is AI
//                 minVal = Math.min(minVal, val);
//                 beta = Math.min(beta, val);
//                 if (beta <= alpha) break;
//             }
//         }
//         return minVal;
//     }
// }

// const getBestMove = (board) => {
//     let best = -Infinity;
//     let move = null;
//     for (let i = 0; i < board.length; i++){
//         if (!board[i]){ //if AI choose this move
//             const newBoard = [...board];
//             newBoard[i] = "O";
//             const val = minimax(newBoard, 0, -Infinity, Infinity, false);
//             if (best < val){
//                 best = val;
//                 move = i;
//             }
//         }
//     }
//     return move;
// }

// const calculateWinner = (board) => {
//     const winnerSet = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6]
//     ]

//     for (const [idx1, idx2, idx3] of winnerSet){
//         if (board[idx1] && board[idx1] === board[idx2] && board[idx2] === board[idx3]){
//             return board[idx1];
//         }
//     }

//     if (!board.includes(null)){
//         return 'Draw';
//     }
//     return null;
// }

function Game(){
    const [board, setBoard] = useState(Array(9).fill(null));
    // const [xIsNext, setXIsNext] = useState(true);
    const [player, setPlayer] = useState(null);
    const [winner, setWinner] = useState(null);
    const [isPlayable, setIsPlayable] = useState(false);
    const wsRef = useRef(null);
    const playerRef = useRef(null);

    useEffect( () =>{
        playerRef.current = player;
    }, [player])

    useEffect( () => {
        if (wsRef.current){ //ws will run 2 time, one for test, and one for real run 
            return; 
        }   
        const ws = new WebSocket('ws://localhost:8081');
        wsRef.current = ws;

        ws.onopen = () => {
            // ws.send("Hello server");
            ws.send(JSON.stringify({
                type: 'prepare',
            }));
            // console.log('init1 ' + player);
            // if (player === 'X') setIsPlayable(true); -> wrong
        };

        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);

            switch (type){
                case 'start':
                    console.log('data: ', data);
                    setPlayer(data.player);
                    setIsPlayable(data.player === 'X');
                    playerRef.current = data.player;
                    console.log('init2 ' + player); //can not set value for player -> player will be set in the next render
                    console.log('init3' + data.player);
                    break;
                case 'display':
                    console.log(data);
                    setBoard(data.board);
                    // console.log('can player play: ', player);
                    // setIsPlayable(player === data.nextPlayer); -> wrong: player is not set yet
                    setIsPlayable(playerRef.current === data.nextPlayer);
                    if (data.winner) {
                        setWinner(data.winner);
                    }
                    break;
                default:
                    break;
            }
        }

        return () => {// call when component unmount 
            ws.close();
            wsRef.current = null
        }
    }, []); // do not have dependencies => only run in first render

    // useEffect( () => {
    //     const win = calculateWinner(board);
    //     setWinner(win);
    //     console.log(step);
    // }, [board]);

    // useEffect( () => {
    //     if (!xIsNext){//AI turn
    //         setXIsNext(!xIsNext);
    //         let idx = getBestMove(board);
    //         board[idx] = "O";
    //         console.log(board);
    //         const tmp = [...board];
    //         setBoard(tmp);
    //     }
    // }, [xIsNext])

    const handleClick = (index) => {
        if (board[index] !== null || winner || !isPlayable) return;
        // board[index] = "X";
        // setXIsNext(!xIsNext);
        board[index] = player;
        console.log(board);
        // setBoard(board); //same reference -> not set
        const tmp = [...board] //copy board
        setBoard(tmp);

        wsRef.current.send(JSON.stringify({
            data: {
                board: tmp,
                nextPlayer: player === 'X' ? 'O' : 'X',
            },
            type: 'move',
        }));
    }

    return(
        <div className="main">
            <h2>{winner ? winner : "N/A"}</h2>
            <div className="game">
                <span className="player">{
                    (!player) ? 
                        "You are the spectator":
                        ("You are player " + player)}</span>
                <span className="turn">{
                    (player != null) ?
                        ((winner) ? 
                            ( (player === winner)? "You win" : "You lose" )
                            :(isPlayable ? 'Your turn' : 'Wait for opponent'))
                        :"Keep watching!    "
                }
                </span>
                <Board board={board} handleClick={handleClick}/>
            </div>
        </div>
    );
}

export default Game;