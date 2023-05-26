import express from 'express';
import ws, { WebSocketServer } from 'ws';

const PORT = process.argv[2] || 8080

const app = express();
//serve static folder
app.use(express.static('public'))

const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});

const wss = new WebSocketServer({ server }) // (2)
wss.on('connection', (client) => {
    console.log('Client connected !')
    client.on('message', (msg) => {    // (3)
        console.log(`Message:${msg}`);
        broadcast(msg)
    })
})
function broadcast(msg) {       // (4)
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg)
        }
    }
}
