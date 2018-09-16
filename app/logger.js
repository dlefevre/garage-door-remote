/*
 * app/logger.js
 */

const winston = require('winston');
const config = require('../config');

const format = winston.format;
const logger = winston.createLogger({
    level: config.application.loglevel,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.align(),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new winston.transports.Console()]
});

module.exports = logger;