import { Request, Response, NextFunction } from "express";
import  applogger from "../utils/logger";
export const logger = (req: Request, res: Response, next: NextFunction) => {
   applogger.debug(`route called   ${req.originalUrl}`);
  next();
};
