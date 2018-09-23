/*
 * config/index.js
 */ 

const os = require('os');

const config = {};

// Application configuration
config.application = {
    port: process.env.GDR_PORT || 8080,
    host: process.env.GDR_HOST || 'localhost',
    userstore: {
        path: process.env.GDR_USERSTORE || os.homedir() + '/.gdr/users',
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
    gdr_enabled = process.env.GDR_ENABLED.toLowerCase();
    if(gdr_enabled === 'no' || gdr_enabled === 'false') {
        config.gpio.enabled = false;
    }
}

module.exports = config;
