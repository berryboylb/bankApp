import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { UserModel } from "../schemas";
import moment from "moment";
export const AuthService = {
  async validateUser(email: string, pass: string): Promise<any | null> {
    const user = await UserModel.findOne({ email }).select("+password");
    console.log(user);
    if (!user) return null;
    const passwordMatch = await bcrypt.compare(pass, user?.password);
    console.log(passwordMatch);
    return passwordMatch ? user : null;
  },
  async createForgotPasswordToken(email: string): Promise<string | null> {
    const resetToken = uuid();
    const resetExpires = moment().add(1, "d").toDate();
    const user = await UserModel.findOneAndUpdate(
      { email, deletedAt: 0 },
      { resetToken, resetExpires },
      { new: true }
    );
    return user ? resetToken : null;
  },
  async getTokens(
    userId: string,
    email: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const tokens = await Promise.all([
      jwt.sign(
        {
          id: userId,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      ),
      jwt.sign(
        {
          email,
        },
        process.env.REFRESH_SECRET as string,
        {
          expiresIn: "1d",
        }
      ),
    ]);
    return {
      accessToken: tokens[0],
      refreshToken: tokens[1],
    };
  },

  async getResetToken(token: string): Promise<any> {
    return UserModel.findOne({
      resetToken: token,
      resetExpires: { $gt: Date.now() },
    });
  },
  async nullifyResetToken(email: string): Promise<any> {
    await UserModel.updateOne(
      { email, deleted: 0 },
      { resetToken: null, resetExpires: null }
    );
    return true;
  },
};
