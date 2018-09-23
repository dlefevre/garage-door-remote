/*
 * app/authentication.js
 */

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require("./logger.js");
const userstore = require("./userstore.js");

// Configure strategy
passport.use(new LocalStrategy ({
        passReqToCallback: true
    },
    (req, username, password, done) => {
        userstore.find(username, (err, user) => {
            if(err) {
                logger.error('(security event) Error during password validation for user ' + username);
                return done(err);
            }
            if(!user) { 
                logger.warn('(security event) Failed login from ' + req.clientIp + ', unknown username ' + username);
                return done(null, false, {message: 'Invalid username or password.'});
            }
            if(!user.verify(password)) {
                logger.warn('(security event) Failed login from ' + req.clientIp + ', password invalid for user ' + username);
                return done(null, false, {message: 'Invalid username or password.'});
            }
            logger.info('(security event) Successful login from ' + req.clientIp + ', for user ' + username);
            return done(null, user);
        });
    }
));

// Serialization
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// Deserialization
passport.deserializeUser((username, done) => {
    userstore.find(username, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
