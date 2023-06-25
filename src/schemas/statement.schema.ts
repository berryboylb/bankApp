import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";
import { AccountTierTypes, AccountTypes } from "../constants";
export interface IStatement extends BaseModel {
  accountId: string;
  startDate: Date;
  endDate: Date;
  transactions: string[];
}

const StatementSchemaFields = {
  accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
};

const StatementSchema = new Schema(StatementSchemaFields).add(BaseSchema);

export const StatementModel = mongoose.model<IStatement>("Statement", StatementSchema);
