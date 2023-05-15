const express = require('express')
const app = express()
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const logger = require("./logger");

// Authzero configuration file
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//set view engine to ejs 
app.set('view engine', 'ejs');

// loading body-parser
const bodyParser = require('body-parser')

// loading our routers
const mainRouter = require('./src/routes/mainRoutes.js')
const classRouter = require('./src/routes/classRoutes.js')

// tell Express to use bodyParser for JSON and URL encoded form bodies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// mounting our routers
app.use('/', mainRouter)
app.use('/class', classRouter)

//Specify where to find static files
app.use('/cdn', express.static('public'));

//Ejs needs to know where to find the views
app.set('views', path.join(__dirname, 'src/views'));

//Error route
app.get('/404', (req, res) => {
  res.sendStatus(404);
})

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  // console.log(req.oidc.user);
  next();
});


app.listen(port)
console.log('Express server running on port 3000')