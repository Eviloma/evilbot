import dayjs from "dayjs";
import winston from "winston";

const { combine, printf } = winston.format;

const myFormat = printf(
  ({ level, message, timestamp }) => `${dayjs(timestamp).format("DD.MM.YYYY HH:mm:ss")} ${level}: ${message}`,
);

const logger = winston.createLogger({
  format: combine(myFormat),
  transports: [new winston.transports.Console({})],
});

export default logger;
