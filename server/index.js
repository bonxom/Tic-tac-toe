
const WebSocket = require("ws")
const server = new WebSocket.Server({ port: 8081 })
console.log("bonx")

server.on('connection', (ws) => {
    console.log("connected");
    ws.on('message', (msg) => {
        console.log(msg.toString());
    });
})