import { Request, Response, NextFunction } from "express";
import { UserModel } from "../schemas/user.schema";
import { RegisterUserDtoType } from "../validators";

const exportResult = {
  async createUser(
    req: Request<{}, {}, RegisterUserDtoType, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const newUser = await UserModel.create(req.body);
      return res.status(201).json({
        status: "Success",
        message: "Successfully created a new user",
        data: newUser,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
};

export default exportResult;
