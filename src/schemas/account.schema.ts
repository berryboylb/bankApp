import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";
import { AccountTierTypes, AccountTypes } from "../constants";
export interface IAccount extends BaseModel {
  accountNumber: string;
  accountType: string;
  balance: number;
  user: Schema.Types.ObjectId;
  tier: string;
}

const AccountSchemaFields = {
  balance: { type: Number,  default: 0 },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 10,
    maxlength: 10,
  },
  accountType: { type: String, required: true, enum: AccountTypes },
  tier: { type: String, default: "Tier 1", enum: AccountTierTypes },
  user: { type: Schema.Types.ObjectId, ref: "user" },
};

const AccountSchema = new Schema(AccountSchemaFields).add(BaseSchema);

export const AccountModel = mongoose.model<IAccount>("Account", AccountSchema);
