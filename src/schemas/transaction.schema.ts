import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";
import { transactionTypes, PaymentMethod } from "../constants";

export interface ITransaction extends BaseModel {
  accountId: Schema.Types.ObjectId;
  amount: number;
  type: "debit" | "credit" | string;
  verified: boolean;
  paymentMethod: PaymentMethod;
  status: boolean;
  reference: string;
  receiver: string;
}

const TransactionSchemaFields = {
  accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: transactionTypes, required: true },
  reference: { type: String, required: true, unique: true },
  paymentMethod: {
    type: String,
    enum: Object.values(PaymentMethod),
    required: true,
  },
  receiver:{
    type: String,
     required: true,
  },
  verified: { type: Boolean, default: false },
  status: { type: Boolean, default: false },
};

const TransactionSchema = new Schema(TransactionSchemaFields).add(BaseSchema);

export const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
