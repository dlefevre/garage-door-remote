/*
 * config/index.js
 */ 

const os = require('os');

const config = {};

// Application configuration
config.application = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    secured: true,
    userstore: {
        path: process.env.USERSTORE || os.homedir() + '/.gdr/users',
        cache_ttl: 60
    },
    loglevel: 'info'
}

// Setup of the GPIO pins
config.gpio = {
    enabled: true,
    trigger_time: 500, 
    trigger_pin: 12,
    door_open_pin: 17,
    door_closed_pin: 27
}

// Disable GPIO connection if requested
if(process.env.GDR_ENABLED) {
    gdr_enabled = process.env.GPIO_ENABLED.toLowerCase();
    if(gdr_enabled === 'no' || gdr_enabled === 'false') {
        config.gpio.enabled = false;
    }
}

// Disable security if so requrested
if(process.env.SECURED) {
    secured = process.env.SECURED.toLowerCase();
    if(secured === 'no' || secured == 'false') {
        config.application.secured = false;
    }
}

module.exports = config;
