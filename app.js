const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const layouts      = require('express-ejs-layouts');
const mongoose     = require('mongoose');
const ensure       = require('connect-ensure-login');
const cors         = require('cors');


const session      = require('express-session');
const passport     = require('passport');


//**********************************************************
// tell node to run the code contained in this file
// this sets up passport and our strategy
//**********************************************************
require('./config/passport-config');

//******************************************************
// set DB connection 
//******************************************************
require('./config/database');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'STEM-CELL-API';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);

app.use(session({
  // these two options are there to prevent warnings
  secret: 'my cool angular server app',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true, maxAge: 2419200000 }
}));

//*********************************************************
// these needs to come AFTER the session middleware
//*********************************************************
app.use(passport.initialize());
app.use(passport.session());
// and before our routes

//*********************************************************
// enable CORS requests
//*********************************************************
app.use(cors({
  credentials: true,
  origin: [ 'http://localhost:4200' ]
}));

//**************************************************************
// Routers here ...
//**************************************************************
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

const countryRoutes = require('./routes/country-routes');
app.use('/', countryRoutes);

const medicalUnitRoutes = require('./routes/medical-unit-routes');
app.use('/', medicalUnitRoutes);

const patientRoutes = require('./routes/patient-routes.js');
app.use('/', patientRoutes);

// display angular app if no route matches
// app.use((req, res, next) => {
//   res.sendfile(__dirname + './public/index.html');
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
