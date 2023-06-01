const winston = require('winston');
const appRoot = require("app-root-path");
const path = require('path')
const finalPath = path.join(__dirname, '/app.log')

//Winston logger
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info' || 'error',
  //Specify the display format for Winston logger
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: finalPath,
    }),
  ],
});

module.exports = logger;

