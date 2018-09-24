#!/usr/bin/env node

/*
 * Purge unauthenticated sessions
 */

const config = require('./config');
const fs = require('fs');
const path = require('path');

fs.readdir(config.application.sessionstore.path, (error, list) => {
    if(error) {
        throw error;
    }

    list.forEach((filename) => {
        var filePath  = path.join(config.application.sessionstore.path, filename);
        var session = JSON.parse(fs.readFileSync(filePath, 'utf8')); 
        var now = new Date().getTime();

        if(!session.passport) {
            if(!session.__lastAccess) {
                console.log(filename + ': unauthenticated session without access time -> purge from session store.');
                fs.unlinkSync(filePath);
            } else {
                if(Math.floor((now - session.__lastAccess) / 1000) > config.application.sessionstore.purgeTime) {
                    console.log(filename + ': expired unauthenticated session -> purge from session store.');
                    fs.unlinkSync(filePath);
                } else {
                    console.log(filename + ': unexpired unauthenticated session -> retain.');
                }
            }
        } else {
            console.log(filename + ': authenticated session -> rely on middleware ttl for cleanup.');
        }
    });

});