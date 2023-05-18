const winston = require('winston');

//Winston logger
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
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
    new winston.transports.Console(),
    //Replace with this to write to a file instead of consol logging
    // new winston.transports.File({
    //   filename: 'combined.logs',
    // }),
  ],
});

module.exports = logger;

