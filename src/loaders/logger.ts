import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import configData from '../config';

const transportsList: any[] = [];

transportsList.push(
  new transports.DailyRotateFile({
    level: 'http',
    filename: 'log/' + configData.name + '/%DATE%-http.log',
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '14d',
  })
);

transportsList.push(
  new transports.DailyRotateFile({
    level: 'info',
    filename: 'log/' + configData.name + '/%DATE%-system.log',
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '14d',
  })
);

transportsList.push(
  new transports.DailyRotateFile({
    level: 'error',
    filename: 'log/' + configData.name + '/%DATE%-error.log',
    zippedArchive: true,
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    maxFiles: '14d',
  })
);

if (process.env.NODE_ENV !== 'production') {
  transportsList.push(
    new transports.Console({
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), format.cli(), format.splat()),
    })
  );
}

const LoggerInstance = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: transportsList,
});

export default LoggerInstance;
