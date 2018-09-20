/*
 * app/userstore.js
 */

const fs = require('fs'); 
const hash = require('create-hash');
const config = require('../config');
const logger = require('./logger.js');
const NodeCache = require('node-cache');
const path = require('path');

var userCache = new NodeCache({stdTTL: config.application.userstore.cache_ttl});

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

// Try to find the user in the cache or load if from disk if necessary
find = (username, callback) => {
    userCache.get(username, (err, obj) => {
        if(!err && obj) {
            logger.debug('Retrieving user ' + username + ' from cache');
            callback(null, obj);
        } else {
            logger.debug('Retrieving user ' + username + ' from the userstore');
            load(username, (_err, _obj) => {
                userCache.set(username, _obj);
                callback(_err, _obj);
            });
        }
    });
}

// Restore the userobject from disk
load = (username, callback) => {
    var filepath = path.join(config.application.userstore.path, username);
    
    if(fs.existsSync(filepath)) {
        var content = fs.readFileSync(filepath, 'utf8');
        var [seed, digest] = content.trim().split('/');
        if(!seed || !digest) {
            callback(new Error("Invalid userfile for user: " + username));
            return;
        }

        var obj = new User(username, seed, digest);
        callback(null, obj);
    } else {
        logger.debug('Could not locate user ' + username + ' in the userstore');
        callback(null);
    }
}


module.exports = {
    find: find
}