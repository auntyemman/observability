import * as winston from 'winston';
import 'winston-daily-rotate-file';
// import { createMailerTransporter } from '../../configs/mailer.config';
// import { environment } from '../environment';
import * as path from 'path';
import * as fs from 'fs';

const { combine, timestamp, printf, errors, colorize } = winston.format;

// Define log message format
const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}${stack ? `\n${stack}` : ''}`;
});

// Define log directory
const logDirectory = 'logs';
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory); // Create log directory if it doesn't exist
}

// Define log transports (where logs will be stored)
const transports: winston.transport[] = [
  new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, 'error-%DATE%.log'), // Log file name format
    datePattern: 'YYYY-MM-DD', // Log file rotation based on date
    maxSize: '50m', // Max file size before rotation
    maxFiles: '7d', // Keep logs for the last 7 days
    level: 'error', // Only log errors
  }),
];

// In development, also log to the console
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(colorize(), logFormat), // Add colorized output for readability
    }),
  );
}

// Create the logger instance
export const logger = winston.createLogger({
  level: 'error', // Only log error level messages
  format: combine(timestamp(), errors({ stack: true }), logFormat),
  transports, // Apply the defined transports
});


// // Email alert setup for errors
// const transporter = createMailerTransporter(); // Mail transporter
// const devEmails = environment.app.devEmails; // Developer email addresses

// // Event listener: When an error log is written, send an email
// logger.on('data', async (log) => {
//   if (log.level === 'error') {
//     try {
//       // Fetch all error log files
//       const files = fs
//         .readdirSync(logDirectory)
//         .filter((file) => file.startsWith('error-'));

//       // Sort log files by modification time (latest first)
//       files.sort(
//         (a, b) =>
//           fs.statSync(path.join(logDirectory, b)).mtime.getTime() -
//           fs.statSync(path.join(logDirectory, a)).mtime.getTime(),
//       );

//       // Get the latest log file
//       const latestLogFile =
//         files.length > 0 ? path.join(logDirectory, files[0]) : null;

//       // Send email notification with error details
//       await transporter.sendMail({
//         to: Array.isArray(devEmails) ? devEmails.join(',') : devEmails, // Ensure correct format
//         subject: `🚨 [ERROR ALERT] From ${environment.mail.appName} ${log.timestamp}`,
//         text: `An error occurred:\n\n${log.message}\n\nStack:\n${log.stack}`,
//         attachments: latestLogFile
//           ? [{ filename: latestLogFile, path: latestLogFile }]
//           : [],
//       });
//     } catch (error) {
//       // Log failure of email alert only in development
//       if (environment.app.node_env !== 'production') {
//         console.error('Failed to send error email:', error);
//       }
//     }
//   }
// });