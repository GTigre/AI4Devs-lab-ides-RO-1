import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}

export class Logger {
  static error(message: string, meta?: any): void {
    logger.error(message, { ...meta, timestamp: new Date().toISOString() });
  }

  static warn(message: string, meta?: any): void {
    logger.warn(message, { ...meta, timestamp: new Date().toISOString() });
  }

  static info(message: string, meta?: any): void {
    logger.info(message, { ...meta, timestamp: new Date().toISOString() });
  }

  static debug(message: string, meta?: any): void {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() });
  }

  static http(message: string, meta?: any): void {
    logger.http(message, { ...meta, timestamp: new Date().toISOString() });
  }
} 