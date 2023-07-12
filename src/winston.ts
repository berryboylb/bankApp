import winston, { transports, format } from "winston";
const { combine, timestamp, prettyPrint } = format;
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.Console(),
    new transports.File({ filename: "db.log", level: "info" }),
    new transports.File({ filename: "db.log", level: "warn" }),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
});
