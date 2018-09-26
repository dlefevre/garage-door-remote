/*
 * app/middleware.js
 */

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const helmet = require('helmet');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const requestIp = require('request-ip');

const bodyParser = require('body-parser');
const flash = require('connect-flash');
const fs = require('fs');
const hash = require('create-hash');

const config = require('../config');
const passport = require('./authentication.js');
const logger = require('./logger.js');

// Generate a secret
const machineid = fs.readFileSync('/etc/machine-id', 'ascii')
const secret = hash('sha256').update(machineid).digest("hex");

// Cookie security
const maxAge = 10 * 365.2425 * 24 * 3600 * 1000;
const cookieSecurity = config.application.secured ? { secure: true, httpOnly: true, maxAge: maxAge } : { httpOnly: true };

init = (app) => {
    app.enable('trust proxy');
    
    app.use(requestIp.mw());
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
        store: new FileStore({
            ttl: config.application.sessionstore.ttl,
            path: config.application.sessionstore.path,
            retries: 3,
            logFn: logger.debug
        }),
        secret: secret,
        name: '_sid',
        cookie: cookieSecurity,
        resave: true,
        saveUninitialized: false
    }));
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use(csrf());
    app.use(function (err, req, res, next) {
      if (err.code !== 'EBADCSRFTOKEN') 
        return next(err);

      logger.error('(security event) Invalid CSRF token for request from ' + req.clientIp);
      res.redirect('/login');
    });
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/', (req, res, next) => {
        if(req.isAuthenticated() || req.url === '/login' || req.url === '/images/favicon.png') {
            next();
        } else {
            if(req.method === 'POST') {
                logger.error('(security event) Unauthenticated POST request from ' + req.clientIp);

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
