import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, errors } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

const logger = createLogger({
  level: 'info', // Set default log level (info, warn, error)
  format: combine(
    timestamp(), // Add timestamps to log entries
    errors({ stack: true }), // Log stack traces
    logFormat, // Apply custom log format
  ),
  transports: [
    // Log to a file
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console logging in development environment
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(
        format.colorize(), // Add color to the logs on the console
        logFormat,
      ),
    }),
  );
}

export default logger;
