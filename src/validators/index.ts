import { z } from "zod";
import mongoose from "mongoose";

export const IdDto = z.object({
  query: z.object({
    id: z
      .string()
      .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
  }),
});

export const EmailDto = z.object({
  query: z.object({
    email: z
      .string()
      .email("This is not a valid email.")
      .trim()
      .min(8, { message: "Email length must be at least 8." }),
  }),
});


export * from "./users.validators";
export * from "./transaction.validators";
export * from "./statement.validators";
export * from "./receipt.validators";
export * from "./kyc.validators"
export * from "./account.validators"