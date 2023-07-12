import { createLogger, format, transports } from "winston";

const logger = createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === "production" ? "error" : "debug",
    }),
    new transports.File({ filename: "debug.log", level: "debug" }),
    new transports.File({ filename: "error.log", level: "error" }),
  ],
  exitOnError: false,
});

logger.error("error", (err: any) => {
  if (err instanceof Error) {
    logger.log({ level: "error", message: `${err.stack || err}` });
  } else {
    logger.log({ level: "error", message: err });
  }
});
if (process.env.NODE_ENV !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;
