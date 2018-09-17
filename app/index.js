/*
 * app/index.js
 */

// Imports
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
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
app.use((req, res, next) => {
    res.removeHeader("X-Powered-By");
    next();
});
app.use(express.static('static'));
app.use(session({ secret: secret }));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/', (req, res, next) => {
    if(req.isAuthenticated() || req.url === '/login') {
        next();
    } else {
        if(req.method === 'POST') {
            res.status('401');
            res.set('WWW-Authenticate', ' FormBased');
            res.json({result: 'failed', error: 'Unauthorized'});
        } else {
            res.redirect('/login');
        }
    }
});

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

// Default get
app.get("/", (req, res) => {
    res.render("index");
});

// Twiddle (push the controller button)
app.post("/trigger", (req, res) => {
    gpio.trigger();
    return res.json({result: 'ok'});
});

module.exports = app;