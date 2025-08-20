import * as winston from 'winston';
import { utilities } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const consoleTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    utilities.format.nestLike(),
  ),
});

export function createDailyRotateTransport(
  level: string,
  filename: string,
): DailyRotateFile {
  return new DailyRotateFile({
    level,
    filename: `${filename}-%DATE%.log`,  // 使用 %DATE% 占位符
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    createSymlink: true,      // 创建符号链接
    symlinkName: `${filename}.log`,  // 符号链接名称，这将是您的标准日志文件名
    zippedArchive: true,
    maxFiles: '14d',
    maxSize: '20m',
    format: winston.format.combine(
      winston.format.timestamp(),
      // 只记录当前级别的日志
      winston.format((info) => {
        return info.level === level ? info : false;
      })(),
      winston.format.json(),
      winston.format.simple(),
    ),
  });
}
