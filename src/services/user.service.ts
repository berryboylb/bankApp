import { UserModel, IUser } from "../schemas";
import { RegisterUserDtoType } from "../validators";
import moment from "moment";
import * as bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import AppError from "../utils/error";
import dotenv from "dotenv";
import { UserTypes } from "../constants";
import jwt from "jsonwebtoken";
dotenv.config();

const exportResult = {
  async createUser(reqBody: RegisterUserDtoType) {
    const createdUser = new UserModel(reqBody);
    return createdUser.save();
  },
  async findAll(condition: any): Promise<IUser[]> {
    const users = await UserModel.find(condition);
    return users;
  },
  async findOne(condition: any, options?: { select: string }) {
    const user = await UserModel.findOne(condition, options?.select);
    return user;
  },
  async findById(id: string, select: string) {
    const user = await UserModel.findById(id, select);
    return user;
  },
  async findOneAndUpdate(
    condition: { [key: string]: any },
    fields: { [key: string]: any },
    options?: { [key: string]: any }
  ) {
    return UserModel.findOneAndUpdate(condition, fields, options);
  },
  async updateOne(
    condition: { [key: string]: any },
    fields: { [key: string]: any }
  ) {
    const result = await UserModel.updateOne(condition, fields);
    return result;
  },
  async changePassword(userId: string, password: string): Promise<boolean> {
    const user = await UserModel.findById(
      userId,
      "+password +passwordChangedOn"
    );
    if (!user) return false;
    user.password = password;
    user.passwordChangedOn = moment().toDate();
    user.save();
    return true;
  },
  async validateUser(email: string, pass: string): Promise<any | null> {
    const user = await UserModel.findOne({ email }).select("+password");
    console.log(user);
    if (!user) return null;
    const passwordMatch = await bcrypt.compare(pass, user?.password);
    console.log(passwordMatch);
    return passwordMatch ? user : null;
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
  async softDelete(_id: string): Promise<any> {
    const user = await UserModel.findById(_id);
    if (!user || user.deletedAt !== null)
      throw new AppError(404, "User not found");
    await UserModel.findByIdAndUpdate(
      _id,
      { deletedAt: moment().toDate() },
      { new: true }
    );
    return true;
  },
  async remove(
    userId: string
  ): Promise<{ ok?: number; n?: number } & { deletedCount?: number }> {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    if (user.deletedAt !== null) throw new AppError(400, "Archive User first");
    return UserModel.deleteOne({ _id: userId });
  },
  async changeRole(email: string, role: string) {
    const user = await UserModel.findOne({ email });
    if (!user || user.deletedAt !== null)
      throw new AppError(404, "User not found");
    return await UserModel.findOneAndUpdate({ email }, { role }, { new: true });
  },
  async checkAdmin(): Promise<boolean> {
    const user = await UserModel.findOne({ role: UserTypes.Admin});
    if (user) return false;
    const adminUser = {
      email: String(process.env.ADMIN_EMAIL),
      password: String(process.env.ADMIN_PASSWORD),
      role: UserTypes.Admin,
      firstname: String(process.env.ADMIN_NAME),
      lastname: String(process.env.ADMIN_NAME),
      phoneNumber: String(process.env.ADMIN_PHONE_NUMBER),
      profilePics: undefined,
      passwordChangedOn: undefined,
      resetToken: "",
      resetExpires: undefined,
      isVerified: true,
      verificationToken: "",
      verificationExpires: undefined,
      createdAt: moment().toDate(),
      updatedAt: moment().toDate(),
      deletedAt: null,
    };
    await UserModel.create(adminUser);
    return true;
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
};
export default exportResult; 