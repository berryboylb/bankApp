import { Request, Response, NextFunction } from "express";
import { AuthService, UserService, AccountService } from "../services";
import AppError from "../utils/error";
import { generateAccountNumber, success, error } from "../utils";
import { StatusCodes } from "http-status-codes";
import EventEmitter from "../events";
import app from "../index";
import dotenv from "dotenv";

dotenv.config();

const AuthController = {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);
      const html =  app.render("signup", {
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
      // const accountDetails = {
      //   accountNumber: generateAccountNumber(),
      //   accountType: req.body.accountType,
      //   user: user._id,
      //   tier: req.body.tier,
      // };
      // const account = await AccountService.create(accountDetails);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      return res
        .status(StatusCodes.OK)
        .json(
          success(user, "Success", "Successfully fetched user", StatusCodes.OK)
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.findAll({
        deletedAt: null,
        role: "user",
      });
      return res
        .status(201)
        .json(
          success(
            users,
            "Success",
            "Successfully fetched users",
            StatusCodes.OK
          )
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.findOneAndUpdate(
        { _id: req.user._id },
        {
          ...req.body,
        },
        {
          new: true,
        }
      );
      return res
        .status(StatusCodes.OK)
        .json(
          success(user, "Success", "Successfully Edited user", StatusCodes.OK)
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const user = await AuthService.validateUser(email, password);
      if (!user) throw new AppError(400, "invalid email/password");
      // if(user.isVerified === false) throw new AppError(400, "Validate your account");
      //i want to check if the user has been verifed via email
      const tokens = await AuthService.getTokens(user?._id, email);
      await UserService.findOneAndUpdate(
        { email },
        { refreshToken: tokens.refreshToken },
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
      console.log(error);
      next(error);
    }
  },
  async changeRole(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query?.email;
      const user = await UserService.changeRole(String(email), "agent");
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            user,
            "Success",
            "Successfully changed to agent",
            StatusCodes.OK
          )
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async resendVerifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      next(res);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async verifyAccount(req: Request, res: Response, next: NextFunction) {
    try {
      next(res);
    } catch (error) {
      console.log(error);
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
      console.log(token);
      //send the email here
      return res.status(StatusCodes.OK).json({
        status: "Success",
        message: "Successfully sent mail",
        data: null,
      });
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      next(error);
    }
  },
  async archiveUser(
    req: Request<{}, {}, {}, { id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await UserService.softDelete(req.query.id);
      return res
        .status(StatusCodes.OK)
        .json(
          success(true, "Success", "Successfully deleted user", StatusCodes.OK)
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async deleteUser(
    req: Request<{}, {}, {}, { id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await UserService.remove(req.query.id);
      return res
        .status(StatusCodes.OK)
        .json(
          success(
            data,
            "Success",
            "Successfully permanently deleted user",
            StatusCodes.OK
          )
        );
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async UploadPicture(req: Request, res: Response, next: NextFunction) {},
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
      console.log(error);
      next(error);
    }
  },
};

export default AuthController;
