import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";
import { transactionTypes, PaymentMethod } from "../constants";

export interface ITransaction extends BaseModel {
  accountId: string;
  amount: number;
  type: "debit" | "credit";
  verified: boolean;
  paymentMethod: PaymentMethod;
  status: boolean;
  reference: string;
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
  verified: { default: false },
  status: { default: false },
};

const TransactionSchema = new Schema(TransactionSchemaFields).add(BaseSchema);

export const TransactionModel = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);
