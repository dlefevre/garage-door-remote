const config = {};

// Application configuration
config.application = {
    port: process.env.GDR_PORT || 8080,
    userstore: {
        path: '/home/pi/.gdr/users',
        cache_ttl: 60
    },
    loglevel: 'debug'
}

// Setup of the GPIO pins
config.gpio = {
    trigger_time: 500, 
    trigger_pin: 12,
    door_open_pin: 17,
    door_closed_pin: 27
}

module.exports = config;
