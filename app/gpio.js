/*
 * app/gpio.js
 */

const config = require('../config');
const logger = require('./logger.js');

const Gpio = require('onoff').Gpio;
const triggerPin = new Gpio(config.gpio.trigger_pin, 'out');
const doorOpenPin = new Gpio(config.gpio.door_open_pin, 'in');
const doorClosedPin = new Gpio(config.gpio.door_closed_pin, 'in');

// Release resources on Ctrl+C
process.on('SIGINT', () => {
    triggerPin.unexport();
    doorOpenPin.unexport();
    doorClosePin.unexport();
});

// Trigger the door
trigger = () => {
    logger.info('Garage door motor was triggered');
    triggerPin.writeSync(1);
    setTimeout(() => { triggerPin.writeSync(0) }, config.gpio.trigger_time);
}

// Return the door's state (open, closed, in motion)
getState = () => {
    var open = doorOpenPin.readSync();
    var closed = doorClosedPin.readSync();

    if(open && !closed)  return 'open';
    if(!open && closed)  return 'closed';
    if(!open && !closed) return 'moving';
    return 'unknown';
}

module.exports = {
    trigger: trigger,
    getState: getState
}
