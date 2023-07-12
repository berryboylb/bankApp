import { Request, Response, NextFunction } from "express";
import { UserService } from "../services";
import AppError from "../utils/error";
import { success, error } from "../utils";
import { StatusCodes } from "http-status-codes";
import EventEmitter from "../events";
import app from "../index";
import dotenv from "dotenv";
import { UserTypes } from "../constants";
import logger from "../utils/logger";
import { uploadImages } from "../utils/cloudinary";

dotenv.config();

export const UserController = {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req;
      return res
        .status(StatusCodes.OK)
        .json(
          success(user, "Success", "Successfully fetched user", StatusCodes.OK)
        );
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
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
      logger.error(error);
      next(error);
    }
  },

  async changeRole(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query?.email;
      const user = await UserService.changeRole(
        String(email),
        UserTypes.SubAdmin
      );
      if (!user) throw new AppError(StatusCodes.NOT_FOUND, "user wasn't found");
      const html = app.render("admin", {
        name: user.firstname,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("mail", {
        email: user.email,
        subject: "Attention",
        text: "Your role has been changed",
        html,
      });
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
      logger.error(error);
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
      if (!data) throw new AppError(StatusCodes.NOT_FOUND, "User is not found");
      const html = app.render("reset", {
        name: data.firstname,
        link: process.env.CLIENT_URL,
      });
      EventEmitter.emit("mail", {
        email: data.email,
        subject: "You made us sad",
        text: "Your account has been deleted",
        html,
      });
      return res
        .status(StatusCodes.OK)
        .json(
          success(true, "Success", "Successfully deleted user", StatusCodes.OK)
        );
    } catch (error) {
      logger.error(error);
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
      logger.error(error);
      next(error);
    }
  },
  async UploadPicture(req: Request, res: Response, next: NextFunction) {
    try {
      const { file } = req;
      if (!file)
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          "Please add an image in the request body"
        );
      const links = await uploadImages([file]);
      if (links.length > 0)
        return res
          .status(StatusCodes.OK)
          .json(
            success(
              links,
              "Success",
              "Successfully added picture",
              StatusCodes.OK
            )
          );
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json(
          error(
            "Error",
            "An error occured uploading image",
            StatusCodes.UNPROCESSABLE_ENTITY
          )
        );
    } catch (error) {
      logger.error(error);
      next(error);
    }
  },
};
