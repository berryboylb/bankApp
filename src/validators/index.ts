import { z } from "zod";
import mongoose from "mongoose";

export const IdDto = z.object({
  query: z.object({
    id: z
      .string()
      .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
  }),
});


export * from "./users.validators";
export * from "./transaction.validators";
export * from "./statement.validators";
export * from "./receipt.validators";
export * from "./kyc.validators"
export * from "./account.validators"