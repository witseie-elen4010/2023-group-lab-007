const express = require('express')
const app = express()
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');
const logger = require("./logger");
const { lecturerDetails, consultationDetails, consultationPeriods, studentBooking, studentDetails } = require('./database')
const insertData = require('./insertData')

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

//Public folder
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

require('./database').connect().then(() => {
  console.log('Connected to MongoDB!')
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error)
})

app.get('/', async (req, res) => {
  try {
    const lecturerDetailsData = await lecturerDetails.find({})
    const consultationDetailsData = await consultationDetails.find({})
    const consultationPeriodsData = await consultationPeriods.find({})
    const studentBookingData = await studentBooking.find({})
    const studentDetailsData = await studentDetails.find({})

    res.render('index', {
      consultationDetails: consultationDetailsData,
      consultationPeriods: consultationPeriodsData,
      lecturerDetails: lecturerDetailsData,
      studentBooking: studentBookingData,
      studentDetails: studentDetailsData
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into lecturerDetails collection
app.post('/lecturerDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the lecturerDetails collection
    await insertData.insertLecturerDetails(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into studentDetails collection
app.post('/studentDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the studentDetails collection
    await insertData.insertStudentDetails(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into studentBooking collection
app.post('/studentBooking', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the studentBooking collection
    await insertData.insertStudentBooking(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into consultationPeriods collection
app.post('/consultationPeriods', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the consultationPeriods collection
    await insertData.insertConsultationPeriods(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
app.get('/consultationPeriodsSearch', async (req, res) => {
  try {
    const selectedDay = req.query.dayOfWeek
    const consultationPeriodsData = await consultationPeriods.find({dayOfWeek: selectedDay })
    res.json(consultationPeriodsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Define a route to handle the consultation details request
app.get('/consultationDetailSearch', async (req, res) => {
  try {
    const consultationDetailsData = await consultationDetails.find({})
    res.json(consultationDetailsData)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// Route for inserting new data into consultationDetails collection
app.post('/consultationDetails', async (req, res) => {
  try {
    const newData = req.body // Assumes the request body contains the new data

    // Insert the new data into the consultationDetails collection
    await insertData.insertConsultationDetails(newData)

    res.sendStatus(200)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})


app.listen(port)
console.log('Express server running on port 3000')