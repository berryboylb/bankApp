import { Request, Response, NextFunction } from "express";
import { UserModel } from "../schemas";
import jwt from "jsonwebtoken";
import { UserService, AuthService } from "../services";
import * as dotenv from "dotenv";
import AppError from "../utils/error";
import { UserTypes } from "../constants";
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from "http-status-codes";
import { error } from "../utils";
import { success } from "../utils/response";
import logger from "../utils/logger";
dotenv.config();

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const secret = process.env.JWT_SECRET;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || token === "")
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(
        error(
          "error",
          "No token authorization access denied",
          StatusCodes.UNAUTHORIZED
        )
      );
  try {
    const { id }: any = jwt.verify(token, secret as string);
    const user = await UserService.findOne({
      _id: id,
    });
    if (!user || user.deletedAt !== null) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          error(
            "error",
            "User not found/Invalid token",
            StatusCodes.BAD_REQUEST
          )
        );
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    logger.error(e);
    const message = e instanceof Error ? e.message : "Token is not valid";
    res
      .status(StatusCodes.BAD_REQUEST)
      .send(error("error", message, StatusCodes.BAD_REQUEST));
  }
};

export const refreshToken = async (
  req: Request<{}, {}, { refreshToken: string }, {}>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const secret = process.env.REFRESH_SECRET;
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return res.status(401).json({
        status: "error",
        message: "refresh token is required",
        data: null,
      });
    const { email }: any = jwt.verify(refreshToken, secret as string);
    const user = await UserService.findOne({
      email: email,
      deletedAt: 0,
    });
    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(error("error", "User not found", StatusCodes.BAD_REQUEST));
    req.user = user;
    next();
  } catch (e) {
    logger.error(e);
    const message = e instanceof Error ? e.message : "Token is not valid";
    res.status(401).send(error("error", message, StatusCodes.BAD_REQUEST));
  }
};

// Function to set needed header auth
export function checkRole(
  roles?: string[]
): (req: Request, _res: Response, next: NextFunction) => void {
  return function (req: Request, _res: Response, next: NextFunction): void {
    try {
      const validRoles: string[] = roles ? roles : [UserTypes.User];
      const user = req.user;
      if (!user || !validRoles.includes(user.role))
        throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized User");
      next();
    } catch (error) {
     logger.error(`check role error: ${error}`);
      next(error);
    }
  };
}

//check if user trying to login exist and is verifed
export const checkUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  const user = await AuthService.validateUser(email, password);
  logger.debug(user);
  if (!user) throw new AppError(400, "invalid email/password");
  res.send(success(user, "Success", "Successfully found user", StatusCodes.OK));
};
