import { z } from "zod";
import { AccountTypes, AccountTierTypes, TransferLimits } from "../constants";
import mongoose from "mongoose";
// export const DepositDto = z.object({
//   body: z.object({
//     balance: z
//       .number({
//         required_error: "balance  is required",
//         invalid_type_error: "balance must be a number",
//       })
//       .positive()
//       .refine((value) => Number(value) <= 1000000, "price must be a number"),
//     accountNumber: z
//       .string()
//       .min(10, {
//         message: "accountNumber must have at least three characters ",
//       })
//       .max(10, {
//         message: "accountNumber must not be greater than 20 characters",
//       }),
//     accountType: z.enum([AccountTypes[0], ...AccountTypes]),
//     tier: z.enum([AccountTierTypes[0], ...AccountTierTypes]),
//     user: z
//       .string()
//       .min(3, { message: "accountId must have at least three characters " })
//       .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
//   }),
// });

export const DepositDto = z.object({
  body: z.object({
    amount: z
      .number({
        required_error: "balance  is required",
        invalid_type_error: "balance must be a number",
      })
      .positive()
      .refine((value) => Number(value) <= 1000000, "price must be a number"),
    // accountNumber: z
    //   .string()
    //   .min(10, {
    //     message: "accountNumber must have at least three characters ",
    //   })
    //   .max(10, {
    //     message: "accountNumber must not be greater than 20 characters",
    //   }),
  }),
});

export const TransferDto = z.object({
  body: z.object({
    amount: z
      .number({
        required_error: "amount  is required",
        invalid_type_error: "amount must be a number",
      })
      .positive()
      .refine((value) => Number(value) >= TransferLimits.Minimum, "Minimum amount must be 100")
      .refine((value) => Number(value) <= TransferLimits.Tier3, "price must be a number"),
    accountNumber: z
      .string({
        required_error: "Account Number is required",
        invalid_type_error: "Account Number be a string",
      })
      .min(10, {
        message: "accountNumber must have at least 10 numbers ",
      })
      .max(10, {
        message: "accountNumber must not be greater than 10 numbers",
      }),
  }),
});

export const AccountDto = z.object({
  body: z.object({
    accountType: z.enum([AccountTypes[0], ...AccountTypes]).optional(),
    tier: z.enum([AccountTierTypes[0], ...AccountTierTypes]).optional(),
  }),
});

export type AccountDtoType = z.infer<typeof AccountDto>;
