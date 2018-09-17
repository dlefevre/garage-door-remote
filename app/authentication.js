/*
 * app/authentication.js
 */

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const logger = require("./logger.js");
const userstore = require("./userstore.js");

// Configure strategy
passport.use(new LocalStrategy (
    (username, password, done) => {
        userstore.find(username, (err, user) => {
            if(err) {
                logger.error('Error during password validation for user ' + username);
                return done(err);
            }
            if(!user) { 
                logger.warn('(SEC) Unknown user: ' + username);
                return done(null, false, {message: 'Invalid username or password.'});
            }
            if(!user.verify(password)) {
                logger.warn('(SEC) Invalid password for user: ' + username);
                return done(null, false, {message: 'Invalid username or password.'});
            }
            logger.info('(SEC) ' + username + ' logged on.')
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
