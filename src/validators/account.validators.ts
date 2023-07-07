import { z } from "zod";
import { AccountTypes, AccountTierTypes } from "../constants";
import mongoose from "mongoose";
export const AccountDto = z.object({
  body: z.object({
    balance: z
      .number({
        required_error: "balance  is required",
        invalid_type_error: "balance must be a number",
      })
      .positive()
      .refine((value) => Number(value) <= 1000000, "price must be a number"),
    accountNumber: z
      .string()
      .min(10, {
        message: "accountNumber must have at least three characters ",
      })
      .max(10, {
        message: "accountNumber must not be greater than 20 characters",
      }),
    accountType: z.enum([AccountTypes[0], ...AccountTypes]),
    tier: z.enum([AccountTierTypes[0], ...AccountTierTypes]),
    user: z
      .string()
      .min(3, { message: "accountId must have at least three characters " })
      .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
  }),
});

export type AccountDtoType = z.infer<typeof AccountDto>;
