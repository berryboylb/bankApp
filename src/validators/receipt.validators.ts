import { z } from "zod";
import mongoose from "mongoose";

export const ReceiptDto = z.object({
  body: z.object({
    transactionId: z
      .string()
      .min(3, { message: "transactionId must have at least three characters " })
      .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
    amount: z
      .number({
        required_error: "amount  is required",
        invalid_type_error: "amount Price must be a number",
      })
      .positive()
      .refine((value) => Number(value) <= 1000000, "amount must be a number"),
    receiptNumber: z
      .string()
      .min(3, { message: "receiptNumber must have at least three characters " })
      .uuid(),
    issuedAt: z.coerce
      .date({
        required_error: " issuedAt is required",
        invalid_type_error: " issuedAt must be a Date",
      })
      .min(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        { message: " issuedAt must start from today" }
      ),
  }),
});

export type ReceiptDtoType = z.infer<typeof ReceiptDto>;
