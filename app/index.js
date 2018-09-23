/*
 * app/index.js
 */

// Imports
const express = require('express');

const slowdown = require('express-slow-down');

const config = require('../config');
const gpio = config.gpio.enabled ? require('./gpio.js') : require('./gpio_stub.js');
const passport = require('./authentication.js');
const logger = require('./logger.js');

// Set up app
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
require('./middleware.js').init(app);

// Slow down policy for login
const speedLimitLogin = slowdown({
    windowMs: 30 * 60 * 1000,
    delayAfter: 5,
    delayMs: 500
});

// Login page
app.get('/login', (req, res) => {
    res.render('login', {
        message: req.flash('error'), 
        csrftoken: req.csrfToken()
    });
});
app.post('/login', speedLimitLogin, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/logout', function(req, res){
  logger.info('(security event) Logout requested from ' + req.clientIp + ' by user ' + req.user.username);
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
    res.render("index", {
        csrftoken: req.csrfToken()
    });
});
// Default get
app.get("/about", (req, res) => {
    res.render("about", require('./sysinfo.js'));
});


// Twiddle (push the controller button)
app.post("/trigger", (req, res) => {
    logger.info('(application event) Garage door triggered from ' + req.clientIp + ' by user ' + req.user.username);

    gpio.trigger();
    return res.json({outcome: 'success'});
});

module.exports = app;