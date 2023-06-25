import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";

export interface IReceipt extends BaseModel {
  transactionId: string;
  amount: number;
  receiptNumber: string;
  issuedAt: Date;
}

const ReceiptSchemaFields = {
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: "Transaction",
    required: true,
  },
  amount: { type: Number, required: true },
  receiptNumber: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now },
};

const ReceiptSchema = new Schema(ReceiptSchemaFields).add(BaseSchema);
//not sure about this
ReceiptSchema.virtual("transactionDetails", {
  ref: "Transaction",
  localField: "transaction",
  foreignField: "_id",
  justOne: true,
});

export const ReceiptModel = mongoose.model<IReceipt>("Receipt", ReceiptSchema);
