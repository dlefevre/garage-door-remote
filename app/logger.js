/*
 * app/logger.js
 */

const winston = require('winston');

const format = winston.format;
const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
});

module.exports = logger;