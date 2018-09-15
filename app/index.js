/*
 * app/index.js
 */

// Imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const hash = require('create-hash');

const config = require('../config');
const gpio = require('./gpio.js');
const passport = require('./authentication.js');
const logger = require('./logger.js');

// Generate a secret
const machineid = fs.readFileSync('/etc/machine-id', 'ascii')
const secret = hash('sha256').update(machineid).digest("hex");

// Set up app
const app = express();
const ejs = require('ejs');

// Set up middleware
app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(session({ secret: secret }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// Default get
app.get("/", (req, res) => {
  res.render("index");
});

// Twiddle (push the controller button)
app.post("/trigger", (req, res) => {
  gpio.trigger();
  return res.send('OK');
});

module.exports = app;