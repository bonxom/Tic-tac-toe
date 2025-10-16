import Square from "./Square";

function Board({ board, handleClick }){
    return(
        <div id="board">
            <div className="row">
                <Square value={board[0]} handleClick={ ()=>handleClick(0) }/>
                <Square value={board[1]} handleClick={ ()=>handleClick(1) }/>
                <Square value={board[2]} handleClick={ ()=>handleClick(2) }/>
            </div>

            <div className="row">
                <Square value={board[3]} handleClick={ ()=>handleClick(3) }/>
                <Square value={board[4]} handleClick={ ()=>handleClick(4) }/>
                <Square value={board[5]} handleClick={ ()=>handleClick(5) }/>
            </div>

            <div className="row">
                <Square value={board[6]} handleClick={ ()=>handleClick(6) }/>
                <Square value={board[7]} handleClick={ ()=>handleClick(7) }/>
                <Square value={board[8]} handleClick={ ()=>handleClick(8) }/>
            </div>
        </div>
    );
}

export default Board;