import * as winston from 'winston';
import * as path from 'path';

export const getLogger = (filename: string): winston.Logger => {
  const base = path.basename(filename);

  const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        level, message, ...extra
      } = info;

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const timestamp: string = info.timestamp as string;

      const result = {
        timestamp,
        level,
        base,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message,
        ...extra,
      };

      return JSON.stringify(result);
    }),
  );

  const options: winston.LoggerOptions = {
    level: process.env.LOG_LEVEL ?? 'info',
    format,
    transports: [
      new winston.transports.Console(),
    ],
  };

  return winston.createLogger(options);
};
