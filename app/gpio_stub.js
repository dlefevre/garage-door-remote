/*
 * app/gpio.js
 */

const config = require('../config');
const logger = require('./logger.js');

// Dummy state
var state = "closed";

// Trigger the door
trigger = () => {
    if(state === 'open') {
        state = 'moving';
        setTimeout(() => { state = 'closed' }, 5000);
    } else if(state === 'closed') {
        state = 'moving';
        setTimeout(() => { state = 'open'}, 5000);
    } else {
        state = 'unknown';
    }
}

// Return the door's state (open, closed, in motion)
getState = () => {
    return state;
}

module.exports = {
    trigger: trigger,
    getState: getState
}
