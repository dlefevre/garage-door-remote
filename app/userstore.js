/*
 * app/userstore.js
 */

const fs = require('fs'); 
const hash = require('create-hash');
const config = require('../config');
const logger = require('./logger.js');

class User {
    constructor(username, seed, digest) {
        this.username = username;
        this.seed = seed;
        this.digest = digest;
    }

    verify(password)  {
        const digest = hash('sha256').update(this.seed).update(password).digest("hex");
        return digest === this.digest;
    }
}

// Perform lookup in userstore on filesystem and return a user object if found
find = (username, callback) => {
    var path = config.application.userstore + '/' + username;
    
    if(fs.existsSync(path)) {
        var content = fs.readFileSync(path, 'utf8');
        var [seed, digest] = content.trim().split('/');
        if(!seed || !digest) {
            callback(new Error("Invalid userfile for user: " + username));
            return;
        }

        var obj = new User(username, seed, digest);
        callback(null, obj);
    } else {
        callback(null);
    }
}


module.exports = {
    find: find
}