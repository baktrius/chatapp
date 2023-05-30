import express from 'express';
import multer from 'multer';
import session from 'express-session';
import ws, { WebSocketServer } from 'ws';

const upload = multer({ dest: 'uploads/' })

const PORT = process.argv[2] || 8080

const app = express();

// session library config
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}))

// paths which can be reached by not logged users
const publicUrls = new Set(["/login.html", "/login"])
// redirect not logged users to login.html
app.use(function (req, res, next) {
    if (!publicUrls.has(req.path) && req.session.login === undefined) {
        res.redirect('/login.html');
    } else {
        next();
    }
});

// enable post request data parsing
app.use(express.urlencoded())

// handle login
app.post('/login', (req, res) => {
    req.session.login = req.body.login
    res.redirect("/")
})
// handle logout
app.post('/logout', (req, res) => {
    req.session.destroy()
    res.redirect("login.html")
})

// serve static folder
app.use(express.static('public'))
// server images uploaded by users
// MAYBE SOMETHING HERE ?? (2)

// handle image upload
app.post('/img', upload.single('img'), function (req, res, next) {
    // Use of upload.single middleware saves uploaded
    // files to /uploads directory and enrich
    // req object with additional info about them.
    // More info:
    // https://www.npmjs.com/package/multer
    // WRITE SOMETHING APPROPRIATE HERE (1)
})

// start http server
const server = app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});

// socket server configuration
// ! ws don't handle authorization
const wss = new WebSocketServer({ server })
wss.on('connection', (client) => {
    console.log('Client connected !')
    client.on('message', (msg, isBinary) => {
        console.log(`Message:${msg}`, isBinary);
        // MAYBE SOME CHANGES HERE?? (2)
        broadcast(msg.toString())
    })
})

function broadcast(msg) {
    for (const client of wss.clients) {
        if (client.readyState === ws.OPEN) {
            client.send(msg)
        }
    }
}
