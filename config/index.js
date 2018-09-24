/*
 * config/index.js
 */ 

const os = require('os');
const path = require('path');

const config = {};

// Application configuration
config.application = {
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    secured: true,
    userstore: {
        path: process.env.USERSTORE || path.join(os.homedir(), '.gdr/users'),
        cache_ttl: 60
    },
    sessionstore: {
        path: process.env.SESSIONSTORE || path.join(os.homedir(), '.gdr/sessions'),
        ttl: 3600 * 24 * 90,
        purgeTime: 1800
    },
    loglevel: process.env.LOGLEVEL || 'info'
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
if(process.env.GPIO_ENABLED) {
    gpio_enabled = process.env.GPIO_ENABLED.toLowerCase();
    if(gpio_enabled === 'no' || gpio_enabled === 'false') {
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
