import mongoose, { Schema, Document } from "mongoose";
export interface BaseModel extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

const baseSchemaFields = {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
};

export const BaseSchema = new Schema<BaseModel>(baseSchemaFields, {
  toJSON: { getters: true },
  toObject: { getters: true },
});

BaseSchema.pre<BaseModel>("save", function (next) {
  this.updatedAt = new Date();
  next();
});
