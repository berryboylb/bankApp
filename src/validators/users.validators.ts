import { z } from "zod";

export const RegisterUserDto = z.object({
  body: z
    .object({
      firstname: z
        .string()
        .min(3, { message: "firstname must have at least three characters " })
        .max(20, {
          message: "firstname must not be greater than 20 characters",
        }),
      lastname: z
        .string()
        .min(3, { message: "lastname must have at least three characters " })
        .max(20, {
          message: "lastname must not be greater than 20 characters",
        }),
      email: z
        .string()
        .email("This is not a valid email.")
        .trim()
        .min(8, { message: "Email length must be at least 8." }),
      phoneNumber: z
        .string()
        .min(10, { message: "phonenumber must be at least 10." }),
      password: z
        .string()
        .min(8, { message: "password must be at least 8 characters" })
        .max(50, {
          message: "The password can't accept more than 50 characters",
        })
        .refine(
          (value) =>
            /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value),
          "Password should contain at least One Uppercase letter, Lowercase letter,numbers and special charcters"
        ),
      confirmpassword: z
        .string()
        .min(8, { message: "password must be at least 8 characters" })
        .max(50, {
          message: "The password can't accept more than 50 characters",
        }),
    })
    .refine((data) => data.password === data.confirmpassword, {
      message: "Passwords don't match",
      path: ["confirmpassword"],
    }),
});


export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;

export const LoginUserDto = z.object({
  body: z.object({
    email: z
      .string()
      .email("This is not a valid email.")
      .trim()
      .min(8, { message: "Email length must be at least 8." }),
    password: z
      .string()
      .min(8, { message: "password must be at least 8 characters" })
      .max(50, {
        message: "The password can't accept more than 50 characters",
      }),
  }),
});

export type LoginUserDtoType = z.infer<typeof LoginUserDto>;
