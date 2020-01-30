import * as winston from 'winston';
import * as path from 'path';

const logPath = path.join(__dirname, '../..', 'logs');

let options = {
  file: {
    level: 'info',
    filename: path.join(logPath, 'app.log'),
    handleExceptions: true,
    format: winston.format.json(),
    maxsize: 10485760,
    maxFiles: 5,
    colorize: winston.format.colorize()
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
};

let logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false
});

export const stream = {
  write(message: any) {
    logger.info(message);
  }
};

export { logger };
