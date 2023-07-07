import { z } from "zod";
import mongoose from "mongoose";
import { IdentificationType } from "../constants";
 
const values = Object.values(IdentificationType);

export const KycDto = z.object({
  body: z.object({
    userId: z
      .string()
      .min(3, { message: "userId must have at least three characters " })
      .refine((value) => mongoose.Types.ObjectId.isValid(value), "Invalid Id"),
    identificationType: z.enum([values[0], ...values]),
    identificationNumber: z
      .string()
      .min(3, {
        message: "identificationNumber must have at least three characters ",
      })
      .uuid(),
    isVerified: z.boolean(),
    documentImage: z.string().min(3, {
      message: "documentImage must have at least three characters ",
    }),
    submittedAt: z.coerce
      .date({
        required_error: "submittedAt is required",
        invalid_type_error: "submittedAt must be a Date",
      })
      .min(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        ),
        { message: "Date must start_date from today" }
      ),
  }),
});

export type KycDtoType = z.infer<typeof KycDto>;
