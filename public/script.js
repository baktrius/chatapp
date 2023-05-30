const ws = new WebSocket(`ws://${window.document.location.host}`);
// Log socket opening and closing
ws.addEventListener("open", event => {
    console.log("Websocket connection opened");
});
ws.addEventListener("close", event => {
    console.log("Websocket connection closed");
});

// adds new message with value val to chat
function addMessage(val) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msgCtn');
    msgDiv.innerHTML = val;
    document.getElementById('messages').appendChild(msgDiv);
}

// adds new image message to chat (based on url)
// Why we may need this function?
// Threat above question as a tip.
function addImg(path) {
    const msgDiv = document.createElement('img');
    msgDiv.classList.add('msgCtn');
    msgDiv.src = path
    document.getElementById('messages').appendChild(msgDiv);
}

// websocket incoming message handling
ws.onmessage = function (message) {
    try {
        // MAYBE SOMETHING HERE (4)
        addMessage(message.data)
    }
    catch(err) {
        console.error(err)
    }
}
// message send form handling
const form = document.getElementById('msgForm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const message = formData.get('message')
    ws.send(message);
    form.reset();
})
// image upload form handling
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
        // further image upload handling
        // YOUR CODE GOES HERE (5)
        form.reset()
        // display added comment at current page (without reloading)
    } catch (err) {
        // best error handling
        alert(`something went wrong during form upload ${err}`);
    }
})
