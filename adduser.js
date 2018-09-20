/*
 * Utility for adding a user to the user store
 */

const config = require('./config');
const hash = require('create-hash');
const randomstring = require("randomstring");
const prompt = require('prompt-sync')();
const fs = require('fs');
const path = require('path');

// Salt for pasword hash
var salt = randomstring.generate({
  length: 16,
  charset: 'alphanumeric'
});

// Get username
var username = prompt("Enter the username: ");
if(username.length == 0) {
    console.log("Zero-length usernames aren't allowed");
    process.exit(1);
}

// Get or produce password
var password = prompt("Enter a password (or nothing to generate one): ", {echo: '*'});
var printpassword = false;
if(password.length > 0) {
    var confirm = prompt("Enter your password again: ", {echo: '*'});
    if(password !== confirm) {
        console.log('Your passwords don\'t match');
        process.exit(1);
    }
} else {
    password = randomstring.generate({
        length: 16,
        charset: 'alphanumeric'
    });
    printpassword = true;
}

// Generate hash
var digest = hash('sha256').update(salt).update(password).digest("hex");

// Create new file
fs.writeFileSync(path.join(config.application.userstore.path, username), salt + "/" + digest, {mode: 0o600});
if(printpassword) {
    console.log('Your password: ' + password);
}