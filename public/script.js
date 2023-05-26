const ws = new WebSocket(`ws://${window.document.location.host}`);
ws.binaryType = "blob";
// Log socket opening and closing
ws.addEventListener("open", event => {
    console.log("Websocket connection opened");
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});
ws.onmessage = function (message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msgCtn');
    if (message.data instanceof Blob) {
        reader = new FileReader();
        reader.onload = () => {
            msgDiv.innerHTML = reader.result;
            document.getElementById('messages').appendChild(msgDiv);
        };
        reader.readAsText(message.data);
    } else {
        console.log("Result2: " + message.data);
        msgDiv.innerHTML = message.data;
        document.getElementById('messages').appendChild(msgDiv);
    }
}
const form = document.getElementById('msgForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = document.getElementById('inputBox').value;
    ws.send(message);
    document.getElementById('inputBox').value = ''
})