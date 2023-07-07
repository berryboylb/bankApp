import { z } from "zod";
import mongoose from "mongoose";
import { PaymentMethod } from "../constants";

export const TransactionDto = z.object({
  body: z.object({
    accountId: z
      .string()
      .min(3, { message: "accountId must have at least three characters " })
      .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
    amount: z
      .number({
        required_error: "amount  is required",
        invalid_type_error: "amount Price must be a number",
      })
      .positive()
      .refine((value) => Number(value) <= 1000000, "amount must be a number"),
    type: z.literal("debit").or(z.literal("credit")),
    verified: z.boolean(),
    status: z.boolean(),
    reference: z
      .string()
      .min(3, { message: "reference must have at least three characters " })
      .uuid(),
    paymentMethod: z.enum([PaymentMethod.CARD, PaymentMethod.TRANSFER]),
  }),
});

export type TransactionDtoType = z.infer<typeof TransactionDto>;
