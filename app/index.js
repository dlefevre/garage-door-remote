/*
 * app/index.js
 */

// Imports
const express = require('express');

const config = require('../config');
const gpio = require('./gpio.js');
const passport = require('./authentication.js');
const logger = require('./logger.js');

// Set up app
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
require('./middleware.js').init(app);

// Login page
app.get('/login', (req, res) => {
    res.render('login', {message: req.flash('error')});
});
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// Get door state
app.get("/state", (req, res) => {
    var state = gpio.getState();
    return res.json({outcome: 'success', state: state});
})

// Default get
app.get("/", (req, res) => {
    res.render("index");
});

// Twiddle (push the controller button)
app.post("/trigger", (req, res) => {
    gpio.trigger();
    return res.json({outcome: 'success'});
});

module.exports = app;