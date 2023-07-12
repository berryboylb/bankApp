import { Request, Response, NextFunction } from "express";
import { AuthService, UserService } from "../services";
import AppError from "../utils/error";
import { generateAccountNumber, success, error } from "../utils";
import { StatusCodes } from "http-status-codes";
import EventEmitter from "../events";
import app from "../index";
import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config(); 

export const AuthController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      const html = app.render("signup", {
        name: user.firstname,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("signup", {
        email: req.body.email,
        subject: "Welcome",
        text: "We are glad to have you onboard",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            user,
            "successfully created user",
            "A new user has been successfully saved",
            StatusCodes.OK
          )
        );
      
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.validateUser(email, password);
      if (!user) throw new AppError(400, "invalid email/password");
      if (!user.isVerified)
        throw new AppError(400, "Validate your account via email");
      const tokens = await AuthService.getTokens(user?._id, email);
      await UserService.findOneAndUpdate(
        { email },
        { refreshToken: tokens.refreshToken, loginToken: tokens.accessToken },
        { new: true }
      );
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            tokens,
            "Success",
            "Successfully logged in  user",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },

  async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { isVerified, firstname, email } = req.user;
      if (isVerified)
        throw new AppError(StatusCodes.BAD_REQUEST, "Account already verified");
      const token = await AuthService.createAccountVerificationToken(email);
      const html = app.render("resend", {
        name: firstname,
        token,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("mail", {
        email: email,
        subject: "Verify your account",
        text: " A new validation token has been sent to your account",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(true, "Success", "Successfully sent mail", StatusCodes.OK)
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.verifyAccount(req.body.token);
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            true,
            "Success",
            "Successfully validated account",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async sendForgotPasswordMail(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.findOne({ email: req.body.email });
      if (!user || user.deletedAt !== null)
        throw new AppError(404, "User not found");
      const token = await AuthService.createForgotPasswordToken(req.body.email);
      const html = app.render("resend", {
        name: user.firstname,
        token,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("mail", {
        email: req.body.email,
        subject: "Verify your account",
        text: " A new validation token has been sent to your account",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(null, "Success", "Successfully sent mail", StatusCodes.OK)
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getResetToken(req.body.token);
      if (!user || user.deletedAt !== 0)
        throw new AppError(400, "Invalid token");
      await UserService.changePassword(user._id, req.body.password);
      await AuthService.nullifyResetToken(user?.email);
      const html = app.render("reset", {
        name: user.firstname,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("mail", {
        email: req.body.email,
        subject: "Password Reset",
        text: "Your password rest was succesfull",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            null,
            "Success",
            "Successfully reset password",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.validateUser(
        req.user.email,
        req.body.currentPassword
      );
      if (!user) throw new AppError(400, "Incorrect password");
      await UserService.changePassword(req.user._id, req.body.password);
      const html = app.render("reset", {
        name: user.firstname,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("mail", {
        email: req.user.email,
        subject: "Password Reset",
        text: "Your password rest was succesfull",
        html,
      });
      res
        .status(StatusCodes.OK)
        .json(
          success(
            true,
            "Sucesss",
            "Successfully updated password",
            StatusCodes.OK
          )
        );
      next(res);
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const tokens = await AuthService.getTokens(user?._id, user?.email);
      await UserService.findOneAndUpdate(
        { email: user.email },
        { refreshToken: tokens.refreshToken },
        { new: true }
      );
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            tokens,
            "Success",
            "Successfully logged in User",
            StatusCodes.OK
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
