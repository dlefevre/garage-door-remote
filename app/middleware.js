/*
 * app/middleware.js
 */

const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');

const bodyParser = require('body-parser');
const flash = require('connect-flash');
const fs = require('fs');
const hash = require('create-hash');

const config = require('../config');
const passport = require('./authentication.js');

// Generate a secret
const machineid = fs.readFileSync('/etc/machine-id', 'ascii')
const secret = hash('sha256').update(machineid).digest("hex");

init = (app) => {
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
            scriptSrc: ["'self'", 'code.jquery.com', 'cdnjs.cloudflare.com', 'maxcdn.bootstrapcdn.com']
        }
    }));
    app.use(rateLimit( {
        windowMs: 60 * 1000, // Due to active polling, use a small window
        max: 180             // Set the maximum to aprox. 3 requests/sec.
    }));
    app.use(express.static('static'));
    app.use(session({ 
        secret: secret,
        name: '_sid'
    }));
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use(csrf());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/', (req, res, next) => {
        if(req.isAuthenticated() || req.url === '/login' || req.url === '/images/favicon.png') {
            next();
        } else {
            if(req.method === 'POST') {
                res.status('401');
                res.set('WWW-Authenticate', ' FormBased');
                res.json({outcome: 'failure', error: 'Unauthorized'});
            } else {
                res.redirect('/login');
            }
        }
    });   
}

module.exports = {
    init: init
}
