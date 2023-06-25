import mongoose, { Schema } from "mongoose";
import { BaseModel, BaseSchema } from "./base.schema";
import { IdentificationType } from "../constants";
export interface IKyc extends BaseModel {
  userId: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  isVerified: boolean;
  submittedAt: Date;
  documentImage: string;
}

const KycSchemaFields = {
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  identificationType: {
    type: String,
    enum: Object.values(IdentificationType),
    required: true,
  },
  identificationNumber: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
  documentImage: { type: String, required: true },
};

const KycSchema = new Schema(KycSchemaFields).add(BaseSchema);

export const KycModel = mongoose.model<IKyc>("Kyc", KycSchema);
