const ws = new WebSocket(`ws://${window.document.location.host}`);
// Log socket opening and closing
ws.addEventListener("open", event => {
    console.log("Websocket connection opened");
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});

function addMessage(val) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msgCtn');
    msgDiv.innerHTML = val;
    document.getElementById('messages').appendChild(msgDiv);
}

function addImg(path) {
    const msgDiv = document.createElement('img');
    msgDiv.classList.add('msgCtn');
    msgDiv.src = path
    document.getElementById('messages').appendChild(msgDiv);
}

ws.onmessage = function (message) {
    try {
        const data = JSON.parse(message.data)
        console.log(data)
        if (data.img !== undefined) addImg(data.img)
        if (data.text != undefined) addMessage(data.text)
    }
    catch(err) {
        console.error(err)
    }
}
const form = document.getElementById('msgForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const message = formData.get('message')
    ws.send(message);
    form.reset();
})
const imgForm = document.getElementById('imgForm');
imgForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    try {
        // send appropriate request
        // long time can pass between calling fetch and getting response
        const response = await fetch(form.action, { method: 'post', body: formData });
        // parse response as json
        const data = await response.json();
        console.log(data);
        if (data.success) form.reset()
        // display added comment at current page (without reloading)
    } catch (err) {
        // best error handling
        alert(`something went wrong during form upload ${err}`);
    }
})
