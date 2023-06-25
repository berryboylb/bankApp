import mongoose, { Schema, Document } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";
import bcrypt from "bcrypt";
import { UserTypes } from "../constants";

export interface IUser extends BaseModel {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePics?: string;
  role?: string;
  isVerified?: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  loginToken?: string;
  loginTokenExpires?: Date;
  resetToken?: string;
  resetExpires?: Date;
  passwordChangedOn?: Date;
}

const UserSchemaFields = {
  // your additional fields here
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    required: true,
  },
  profilePics: {
    type: String,
    default: null,
    trim: true,
  },
  role: {
    default: "User",
    enum: UserTypes,
  },
  isVerified: {
    default: false,
  },
  verificationToken: {
    default: null,
    select: false,
  },
  verificationExpires: { default: null, select: false },
  loginToken: {
    default: null,
    select: false,
  },
  loginTokenExpires: { default: null, select: false },
  resetToken: { default: null, select: false },
  resetExpires: { default: null, select: false },
  passwordChangedOn: { default: null, select: false },
};

const UserSchema = new Schema(UserSchemaFields).add(BaseSchema);

UserSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  next();
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
