
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8081 });
console.log("bonx");

const PLAYER = ['X', 'O'];
const sockets = new Map(); // ws -> X || O

const assignPlayer = (ws) => {
    if (sockets.size == 2) return null; //full slot

    if (sockets.size == 0) {
        sockets.set(ws, 'X'); 
        return 'X';
    } 
    sockets.set(ws, 'O');
    return 'O';
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

server.on('connection', (ws) => {
    console.log("connected");
    ws.on('message', (msg) => {
        const { type, data } = JSON.parse(msg);

        switch (type) {
            case 'prepare':
                ws.send(JSON.stringify({ //send a object {...}
                    type: 'start',
                    data: {
                        player: assignPlayer(ws),
                    },
                }));
                break;
            case 'move':
                server.clients.forEach((socket) => {
                    socket.send(JSON.stringify({
                        type: 'display',
                        data: {
                            board: data.board,
                            nextPlayer: data.nextPlayer,
                            winner: calculateWinner(data.board),
                        },
                    }));
                })
                break;
            default:
                break;
        }
    });
})