const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin');
const serviceAccount = require('./beefreeagro-b1d5b-firebase-adminsdk-rbfuf-3b41614a89.json')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

// session setup
const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
// Express App Config
app.use(express.json())
app.use(session)
app.use(express.static('public'))


// Configuring CORS
const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
    credentials: true
}
app.use(cors(corsOptions))
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://beefreeagro-b1d5b.firebaseapp.com"
});

let uid = "";
app.post('/getUserDetails', (req, res) => {
    const { userToken } = req.body;
    admin.auth()
        .verifyIdToken(userToken)
        .then((decodedToken) => {
            uid = decodedToken.uid;
        }).then(() => {
            admin.auth()
                .getUser(uid)
                .then((userRecord) => {
                    const user = {
                        email: userRecord.email,
                        displayName: userRecord.displayName,
                    }
                    return res.send(user)
                })
        })
        .catch((error) => {
            console.log(error);
        });
});



// ASYNC SID
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

const logger = require('./services/logger.service');
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})



//************* extra  *************//




app.post('/getUserDetailsWithSession', (req, res) => {
    const sessionCookie = req.cookies.session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then((userData) => {
            console.log("Logged in:", userData.email)
        })
        .catch((error) => {
            res.redirect("/");
        });
});


app.post('/sessionLogin', (req, res) => {
    const idToken = req.body.userToken
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })
        .then((sessionCookie) => {
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({ status: "success" }));
        })
        .catch((error) => {
            res.status(401).send("UNAUTHORIZED REQUEST!");
        })
});






